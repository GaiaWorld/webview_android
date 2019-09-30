_$define("pi/db/client", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const event_1 = require("../util/event");
const sb_tree_1 = require("../util/sb_tree");
const util_1 = require("../util/util");
const db_1 = require("./db");
class CSession extends db_1.Session {
    // 打开与数据库的会话。
    open(db) {
        if (this.db) {
            return new DBError('the session is connecting the other', ErrorType.DB_CONNECT, '');
        }
        db.open();
        this.db = db;
    }
    // 关闭与数据库的会话。
    close() {
        if (this.tempTabs) {
            return new DBError('the session has transaction is going on, connection cannot be closed', ErrorType.DB_CONNECT, '');
        }
        this.db.close();
        delete this.db;
    }
    // 读事务，无限尝试直到超时，默认10秒
    read(tx, timeout) {
        return visitDB(this, tx, handlerRead, timeout);
    }
    // 写事务，无限尝试直到超时，默认10秒
    write(tx, timeout) {
        return visitDB(this, tx, handlerWrite, timeout);
    }
}
exports.CSession = CSession;
class CTransaction {
    constructor() {
        // 是否为写事务
        this.writable = false;
        this.timeout = 5000;
    }
    // 开始本地事务
    start(s) {
        if (s.tempTabs) {
            throw new DBError('a transaction is going on! you can\'t start the next transaction', ErrorType.START, null);
        }
        this.session = s;
        s.tempTabs = new Map();
    }
    // 结束本地事务，清理临时表及session（在开始事务时被创建）。
    end() {
        delete this.session.tempTabs;
        delete this.session;
    }
    // 提交一个本地事务。
    commit() {
        const tabs = this.session.db.tabs;
        this.session.tempTabs.forEach((v, k) => {
            const tab = tabs.get(k);
            tab.data = v.data;
            tab.lock = false; // 设置为非锁状态
            tab.version++; // 提交后版本加1
            const l = this.session.db.tabListeners.get(k);
            if (l) {
                l.notify(v.modify); // 抛出修改事件
            }
        });
    }
    // 回滚一个本地事务。
    /* tslint:disable:no-empty */
    rollback() {
    }
    // 预提交一个本地事务。
    prepare() {
        const tabs = this.session.db.tabs;
        this.session.tempTabs.forEach((v, k) => {
            if (tabs.get(k).lock === true) { // 预提交时，修改的表已锁，抛出异常， 高层收到异常，应重新执行修改逻辑再次预提交
                throw new DBError('the table has a lock,prepare fail!', ErrorType.PREPARE, k);
            }
            else if (tabs.get(k).version !== v.version) { // 版本号已变，说明另一个线程已对其更改，抛出异常，高层收到异常，应重新执行修改逻辑再次预提交
                throw new DBError('the data has changed,prepare fail!', ErrorType.PREPARE, k);
            }
        });
        this.session.tempTabs.forEach((v, k) => {
            tabs.get(k).lock = true; // 预提交条件达成，给每一个表上锁，防止其他线程在此线程提交结束前修改表
        });
    }
    // 回滚一个已进行预提交的事务。
    recover() {
        this.session.tempTabs = new Map();
    }
    // 查询
    query(arr, lockTime) {
        const tabs = this.session.db.tabs;
        const items = [];
        for (let i = 0; i < arr.length; i++) {
            const item = arr[i];
            const tab = tabs.get(item.tab);
            if (!tab) {
                throw new DBError('The table is not exist, query fail!', ErrorType.NOT_TABLE, item.tab);
            }
            if (tab.data) {
                items[i] = {
                    key: item.key,
                    tab: item.tab,
                    value: tab.data.get(item.key),
                };
            }
        }
        return items;
    }
    query_one(item, lockTime) {
        const tabs = this.session.db.tabs;
        const tab = tabs.get(item.tab);
        if (!tab) {
            throw new DBError('The table is not exist, query fail!', ErrorType.NOT_TABLE, item.tab);
        }
        if (tab.data) {
            return {
                key: item.key,
                tab: item.tab,
                value: tab.data.get(item.key),
            };
        }
    }
    // 插入或更新
    upsert(arr, lockTime) {
        if (!this.writable) {
            throw new DBError('you can not write, this is a read transaction', ErrorType.ILLEGAL_WRITE, '');
        }
        /* tslint:disable:prefer-const */
        let item;
        let tab;
        let tempTab;
        let tempTabs;
        let tabs;
        tempTabs = this.session.tempTabs;
        tabs = this.session.db.tabs;
        for (let i = 0; i < arr.length; i++) {
            item = arr[i];
            if (!item)
                continue;
            let keyCompare = compareNumber;
            if (typeof item.key === 'string') {
                keyCompare = compareString;
            }
            else if (typeof item.key !== 'number') {
                throw new Error('数据库不支持除number, string以外的主键！');
            }
            tab = tabs.get(item.tab);
            if (!tab) {
                throw new DBError('The table is not exist,upsert fail!', ErrorType.NOT_TABLE, item.tab);
            }
            tempTab = tempTabs.get(item.tab);
            if (!tempTab) { // 每次修改，需几下上次的数据以便回滚
                tempTab = new TempModify(tab.version, tab.data, []);
                tempTabs.set(item.tab, tempTab);
            }
            if (item.value !== null) { // 插入或更新
                !tempTab.data && (tempTab.data = new sb_tree_1.Tree(keyCompare));
                tempTab.data = tempTab.data.set(item.key, item.value);
            }
            else { // 删除
                tempTab.data = tempTab.data.delete(item.key);
            }
            tempTab.modify.push(item);
        }
    }
    // 插入或更新或删除
    modify_one(item, lockTime) {
        if (!this.writable) {
            throw new DBError('you can not write, this is a read transaction', ErrorType.ILLEGAL_WRITE, '');
        }
        /* tslint:disable:prefer-const */
        let tab;
        let tempTab;
        let tempTabs = this.session.tempTabs;
        let tabs = this.session.db.tabs;
        let keyCompare = compareNumber;
        if (typeof item.key === 'string') {
            keyCompare = compareString;
        }
        else if (typeof item.key !== 'number') {
            throw new Error('数据库不支持除number, string以外的主键！');
        }
        tab = tabs.get(item.tab);
        if (!tab) {
            throw new DBError('The table is not exist,upsert fail!', ErrorType.NOT_TABLE, item.tab);
        }
        tempTab = tempTabs.get(item.tab);
        if (!tempTab) { // 每次修改，需几下上次的数据以便回滚
            tempTab = new TempModify(tab.version, tab.data, []);
            tempTabs.set(item.tab, tempTab);
        }
        if (item.value !== null) { // 插入或更新
            !tempTab.data && (tempTab.data = new sb_tree_1.Tree(keyCompare));
            tempTab.data = tempTab.data.set(item.key, item.value);
        }
        else { // 删除
            tempTab.data = tempTab.data.delete(item.key);
        }
        tempTab.modify.push(item);
    }
    // 删除
    /* tslint:disable:no-reserved-keywords */
    delete(arr, lockTime) {
        if (!this.writable) {
            throw new DBError('you can not write, this is a read transaction', ErrorType.ILLEGAL_WRITE, '');
        }
        const tempTabs = this.session.tempTabs;
        let tab;
        let item;
        const tabs = this.session.db.tabs;
        let tempTab;
        for (let i = 0; i < arr.length; i++) {
            item = arr[i];
            if (!item)
                continue;
            tab = tabs.get(item.tab);
            if (!tab) {
                throw new DBError('The table is not exist, delete fail!', ErrorType.NOT_TABLE, item.tab);
            }
            tempTab = tempTabs.get(item.tab);
            if (!tempTab) {
                tempTab = new TempModify(tab.version, tab.data, []);
                tempTabs.set(item.tab, tempTab);
            }
            if (!tempTab.data) {
                throw new DBError('The table is null, delete fail!', ErrorType.NOT_TABLE, item.tab);
            }
            tempTab.data = tempTab.data.delete(item.key);
            tempTab.modify.push(item);
        }
    }
    // 迭代
    iter(tab, filter) {
        const tabs = this.session.db.tabs;
        const t = tabs.get(tab);
        if (!t) {
            throw new DBError('The table is not exist', ErrorType.NOT_TABLE, tab);
        }
        if (!t.data) {
            return;
        }
        return t.data.items();
    }
    // 新增 修改 删除 表
    alter(tabName, meta) {
        const tabs = this.session.db.tabs;
        let tab;
        if (!meta) {
            tab = tabs.get(tabName);
            if (!tab) {
                throw new DBError('the table is not exist, delete table fail！', ErrorType.NOT_TABLE, '');
            }
            tabs.delete(tabName);
            this.session.db.metaListeners.notify({ meta: meta, old: tab.meta, tab: tabName });
        }
        else {
            let old;
            let tab = tabs.get(tabName);
            if (!tab) {
                tab = { meta: meta, data: null, version: 0 };
                tabs.set(tabName, tab);
            }
            else {
                old = tab.meta;
                tab.meta = meta;
            }
            this.session.db.metaListeners.notify({ meta: meta, old: old, tab: tabName });
        }
    }
    //TODO
    lock(arr, lockTime) {
    }
}
exports.CTransaction = CTransaction;
/**
 * @description 数据库会话
 * @example
 */
class CDB extends db_1.DB {
    constructor() {
        super(...arguments);
        /* tslint:disable:typedef */
        this.metaListeners = new event_1.ListenerList();
        this.tabListeners = new Map();
        this.tabs = new Map();
    }
    // 打开数据库
    open() {
    }
    // 关闭数据库
    close() {
    }
    // 复制一个数据库，在复制的数据库上做的所有操作都不会影响主库，主要用于前端做模拟计算使用
    clone() {
        const db = new CDB();
        util_1.mapCopy(this.tabs, db.tabs);
        return db;
    }
    addTabListener(tabName, fun) {
        let l = this.tabListeners.get(tabName);
        if (!l) {
            l = new event_1.ListenerList();
            this.tabListeners.set(tabName, l);
        }
        l.add(fun);
    }
    addListener(fun) {
        const l = this.metaListeners.add(fun);
    }
}
exports.CDB = CDB;
const handlerWrite = (h, t, timeout) => {
    t.writable = true;
    try {
        const r = h(t); // 业务逻辑，对数据库进行增删改查
        t.prepare();
        t.commit();
        t.end(); // 结束事务
        return r;
    }
    catch (error) {
        if (error.type === ErrorType.NOT_TABLE || error.type === ErrorType.ILLEGAL_WRITE) {
            t.rollback();
        }
        else if (error.type === ErrorType.PREPARE) {
            t.recover();
        }
        t.end(); // 结束事务
        throw error;
    }
};
const handlerRead = (h, t, timeout = 5000) => {
    const startTime = new Date().getTime();
    while (timeout > 0) {
        try {
            const r = h(t); // 业务逻辑，对数据库进行增删改查
            t.end(); // 结束事务
            return r;
        }
        catch (error) {
            t.end(); // 结束事务
            throw error;
        }
    }
};
const visitDB = (session, tx, handler, timeout) => {
    const t = new CTransaction();
    t.start(session);
    return handler(tx, t, timeout);
};
/* tslint:disable:max-classes-per-file */
class DBError extends Error {
    constructor(message, type, info) {
        super();
        this.message = message;
        this.type = type;
        this.info = info;
    }
}
var ErrorType;
(function (ErrorType) {
    ErrorType[ErrorType["NOT_TABLE"] = 0] = "NOT_TABLE";
    ErrorType[ErrorType["PREPARE"] = 1] = "PREPARE";
    ErrorType[ErrorType["START"] = 2] = "START";
    ErrorType[ErrorType["DB_CONNECT"] = 3] = "DB_CONNECT";
    ErrorType[ErrorType["ILLEGAL_WRITE"] = 4] = "ILLEGAL_WRITE";
})(ErrorType || (ErrorType = {}));
class TempModify {
    constructor(version, data, modify) {
        this.version = version;
        this.data = data;
        this.modify = modify;
    }
}
const compareNumber = (a, b) => {
    if (a > b) {
        return 1;
    }
    else if (a < b) {
        return -1;
    }
    else {
        return 0;
    }
};
const compareString = (a, b) => {
    if (a.length > b.length) {
        return 1;
    }
    else if (a.length < b.length) {
        return -1;
    }
    for (let i = 0; i < a.length; i++) { // 长度相等
        if (a.charCodeAt(i) > b.charCodeAt(i)) {
            return 1;
        }
        else if (a.charCodeAt(i) < b.charCodeAt(i)) {
            return -1;
        }
    }
    return 0;
};
});
