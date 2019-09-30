_$define("pi/util/event", function (require, exports, module){
"use strict";
/*
 * 事件广播模块
 */
Object.defineProperty(exports, "__esModule", { value: true });
// ============================== 导入
const mod_1 = require("../lang/mod");
const time_1 = require("../lang/time");
const log_1 = require("./log");
const util_1 = require("./util");
// ============================== 导出
exports.level = mod_1.commonjs.debug ? log_1.logLevel : log_1.LogLevel.info;
// 3毫秒以上的事件会打印
const timeout = 3;
/**
 * @description 处理器返回值
 */
var HandlerResult;
(function (HandlerResult) {
    HandlerResult[HandlerResult["OK"] = 0] = "OK";
    HandlerResult[HandlerResult["REMOVE_SELF"] = 1] = "REMOVE_SELF";
    HandlerResult[HandlerResult["BREAK_OK"] = 2] = "BREAK_OK";
    HandlerResult[HandlerResult["BREAK_REMOVE_SELF"] = 3] = "BREAK_REMOVE_SELF"; // 结束此次事件调用，不继续调用处理器，从处理器列表删除自身，以后不会收到事件
})(HandlerResult = exports.HandlerResult || (exports.HandlerResult = {}));
/**
 * 创建事件处理器列表
 * @example
 */
exports.createHandlerList = () => {
    const list = (args) => {
        let i;
        let handler;
        let r;
        let delIndex = -1;
        const arr = list.array;
        const n = arr.length;
        list.handling++;
        for (i = n - 1; i >= 0; i--) {
            handler = arr[i];
            if (handler) {
                r = call1(handler, args);
                if (!r) {
                    continue;
                }
                else if (r === HandlerResult.REMOVE_SELF) {
                    arr[i] = null;
                    delIndex = i;
                }
                else if (r === HandlerResult.BREAK_OK) {
                    break;
                }
                else if (r === HandlerResult.BREAK_REMOVE_SELF) {
                    arr[i] = null;
                    delIndex = i;
                    break;
                }
            }
            else {
                delIndex = i;
            }
        }
        list.handling--;
        if (delIndex >= 0 && !list.handling) {
            for (i = delIndex + 1; i < n; ++i) {
                handler = arr[i];
                if (handler) {
                    arr[delIndex] = handler;
                    ++delIndex;
                }
            }
            list.count = delIndex;
            arr.length = delIndex;
        }
        return r || HandlerResult.BREAK_OK;
    };
    list.handling = 0;
    list.count = 0;
    list.array = [];
    list.__proto__ = HandlerArray.prototype;
    return list;
};
/**
 * 创建事件处理器表
 * @example
 */
class HandlerMap {
    constructor() {
        /**
         * 事件处理器映射表
         */
        this.map = new Map();
    }
    /**
     * 事件通知
     */
    // tslint:disable:no-reserved-keywords
    notify(type, args) {
        const list = this.map.get(type);
        if (!list) {
            return false;
        }
        // 这是一个bug,如果传入的参数本来就是数组，就会解析出错
        Array.isArray(args) ? list([args]) : list(args);
        return true;
    }
    /**
     * 获得事件处理器表的长度
     */
    size(type) {
        let list;
        let n = 0;
        for (list of this.map.values()) {
            n += list.size();
        }
        return n;
    }
    /**
     * 添加事件处理器
     */
    add(type, h) {
        let list;
        const map = this.map;
        if (!(h && type)) {
            return;
        }
        list = map.get(type);
        if (!list) {
            list = exports.createHandlerList();
            map.set(type, list);
        }
        list.add(h);
    }
    /**
     * 删除事件处理器
     */
    remove(type, h) {
        let list;
        const map = this.map;
        if (!h) {
            if (!type) {
                return false;
            }
            return map.delete(type);
        }
        if (!type) {
            for (list of this.map.values()) {
                if (!list.remove(h)) {
                    continue;
                }
                if (list.size() === 0) {
                    map.delete(type);
                    return true;
                }
            }
            return false;
        }
        list = map.get(type);
        if (!list) {
            return false;
        }
        if (!list.remove(h)) {
            return false;
        }
        if (list.size() === 0) {
            map.delete(type);
        }
        return true;
    }
    /**
     * 删除事件处理器
     */
    clear() {
        this.map.clear();
    }
}
exports.HandlerMap = HandlerMap;
/**
 * 事件处理器表
 * @example
 */
class HandlerTable {
    constructor() {
        // 必须要赋初值，不然new出来的实例里面是没有这些属性的
        this.handlerMap = null; // 事件处理器表
    }
    /**
     * @description 通知组件上的事件监听器
     * @example
     */
    notify(eventType, args) {
        if (this[eventType]) {
            return objCall1(this, eventType, args);
        }
        const map = this.handlerMap;
        if (!map) {
            return;
        }
        const r = map.notify(eventType, args);
        if (r) {
            return r;
        }
        return map.notify('*', args);
    }
    /**
     * 添加事件处理器
     */
    addHandler(type, h) {
        let map = this.handlerMap;
        if (!map) {
            map = this.handlerMap = new HandlerMap();
        }
        map.add(type, h);
    }
    /**
     * 删除事件处理器
     */
    removeHandler(type, h) {
        return this.handlerMap && this.handlerMap.remove(type, h);
    }
    /**
     * 删除事件处理器
     */
    clearHandler() {
        return this.handlerMap && this.handlerMap.clear();
    }
}
exports.HandlerTable = HandlerTable;
/**
 * 创建事件监听器表
 * @example
 */
class ListenerList {
    constructor() {
        this.list = [];
    }
    /**
     * @description 通知列表上的每个事件监听器
     * @example
     */
    notify(arg) {
        const r = this.list;
        for (const f of r) {
            f(arg);
        }
    }
    /**
     * 获取事件监听器列表的长度
     */
    size() {
        return this.list.length;
    }
    /**
     * 添加事件监听器
     */
    add(f) {
        this.list = util_1.arrInsert(this.list, f);
    }
    /**
     * 删除事件监听器
     */
    remove(f) {
        const old = this.list;
        const r = util_1.arrRemove(this.list, f);
        const b = r === old;
        this.list = r;
        return b;
    }
    /**
     * 清空事件监听器列表
     */
    clear() {
        this.list = [];
    }
}
exports.ListenerList = ListenerList;
// ============================== 本地
// 函数调用
const call1 = (func, args) => {
    let r;
    const start = time_1.now();
    try {
        r = util_1.call(func, args);
    }
    catch (ex) {
        return log_1.warn(exports.level, 'event, ex: ', ex, ', func: ', func, args);
    }
    const end = time_1.now();
    if (end - start > timeout) {
        exports.level <= log_1.LogLevel.debug && log_1.debug(exports.level, `event slow, cost: ${end - start}`, func, args);
    }
    return r;
};
// 对象方法调用
const objCall1 = (obj, func, args) => {
    let r;
    const start = time_1.now();
    try {
        r = util_1.objCall(obj, func, args);
    }
    catch (ex) {
        return log_1.warn(exports.level, 'event, ex: ', ex, ', func: ', obj, func, args);
    }
    const end = time_1.now();
    if (end - start > timeout) {
        exports.level <= log_1.LogLevel.debug && log_1.debug(exports.level, `event slow, cost: ${end - start}`, obj, func, args);
    }
    return r;
};
// TODO 以后改成树结构-并且是写时复制的，就可以任意重入。而且删除效率高。js对象不能直接比较大小，可以转成字符串后的hash来比较大小。如果是乱序执行，则只需要1个树。如果是按照放入的顺序执行，则需要2个树。sbtree或fingertree
// tslint:disable:max-classes-per-file
class HandlerArray {
    constructor() {
        this.handling = 0;
        this.count = 0;
        this.array = [];
    }
    /**
     * 获得事件处理器列表的长度
     */
    size() {
        return this.count;
    }
    /**
     * 添加事件处理器
     */
    add(handler) {
        this.array.push(handler);
        this.count += 1;
    }
    /**
     * 删除事件处理器
     */
    remove(handler) {
        let i;
        const arr = this.array;
        for (i = arr.length - 1; i >= 0; --i) {
            if (arr[i] === handler) {
                arr[i] = null;
                this.count -= 1;
                return true;
            }
        }
        return false;
    }
    /**
     * 清理事件处理器
     */
    clear() {
        this.array = [];
        this.count = 0;
    }
}
});
