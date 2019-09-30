_$define("pi/db/db", function (require, exports, module){
"use strict";
/*
 * KV数据库，及事务
 */
Object.defineProperty(exports, "__esModule", { value: true });
const event_1 = require("../util/event");
// ============================== 导出
/**
 * 数据库系统提供的表的前缀
 * @example
 */
exports.PRIFIX = {
    mq: '_$mq/',
    rt: '_$rt/',
    db: '_$db/',
    cfg: '_$cfg/',
    code: '_$code/',
    node: '_$node/',
    temp: '_$temp/',
    connect: '_$connect/',
    action: '_$action/' // 表示每操作的表前缀，操作结束后会自动清理
};
/**
 * @description 数据库会话
 * @example
 */
class Session {
    // 打开与数据库的会话。
    open(db) {
    }
    // 关闭与数据库的会话。
    close() {
    }
    // 读事务，无限尝试直到超时，默认10秒
    read(tx, timeout) {
    }
    // 写事务，无限尝试直到超时，默认10秒
    write(tx, timeout) {
    }
}
exports.Session = Session;
/**
 * @description 数据库会话
 * @example
 */
class DB {
    constructor() {
        /* tslint:disable:typedef */
        this.listeners = new event_1.ListenerList();
        this.tabListeners = new Map();
    }
    // 打开数据库
    open() {
    }
    // 关闭数据库
    close() {
    }
    // 复制一个数据库，在复制的数据库上做的所有操作都不会影响主库，主要用于前端做模拟计算使用
    clone() {
        return null;
    }
}
exports.DB = DB;
});
