_$define("pi/util/res_mgr", function (require, exports, module){
"use strict";
/**
 * 负责创建、销毁BlobURL，负责维护资源的缓存和引用计数
 * 异步加载二进制数据，同步创建BlobURL，异步加载资源（图像、字体……）
 */
Object.defineProperty(exports, "__esModule", { value: true });
// ============================== 导入
const mod_1 = require("../lang/mod");
const time_1 = require("../lang/time");
// ============================== 导出
/**
 * @description blob的资源类型
 * @example
 */
exports.RES_TYPE_BLOB = 'blob';
exports.RES_TYPE_FILE = 'file';
/**
 * @description 资源
 * @example
 */
class Res {
    constructor() {
        // 必须要赋初值，不然new出来的实例里面是没有这些属性的
        // 名称
        this.name = '';
        // 类型
        // tslint:disable:no-reserved-keywords
        this.type = '';
        // 参数
        this.args = null;
        // 引用数
        this.count = 0;
        // 超时时间
        this.timeout = 0;
        // 链接
        this.link = null;
    }
    /**
     * @description 创建, 参数为源数据 可以是二进制数据，也可以是其他
     * @example
     */
    create(data) {
        this.link = data;
    }
    /**
     * @description 使用
     * @example
     */
    use() {
        this.count++;
    }
    /**
     * @description 不使用
     * @example
     */
    unuse(timeout, nowTime) {
        this.count--;
        if (timeout > this.timeout) {
            this.timeout = timeout;
        }
        this.release(nowTime);
    }
    /**
     * @description 释放
     * @example
     */
    release(nowTime) {
        if (this.count > 0) {
            return;
        }
        if (nowTime < this.timeout) {
            timeoutRelease(this, nowTime, this.timeout);
        }
        else {
            resMap.delete(this.name);
            this.destroy();
        }
    }
    /**
     * @description 销毁，需要子类重载
     * @example
     */
    // tslint:disable:no-empty
    destroy() {
    }
}
exports.Res = Res;
/**
 * @description 资源表，用于管理一个场景下所有的资源。需要手工释放。资源表内的资源，只会在资源上增加1个引用计数，释放后减少1个引用计数。
 * @example
 */
class ResTab {
    constructor() {
        // 必须要赋初值，不然new出来的实例里面是没有这些属性的
        // 本地表，为空表示资源表已经被释放
        this.tab = new Map();
        // 超时时间
        this.timeout = 0;
    }
    /**
     * @description 获取当前资源的数量
     * @example
     */
    size() {
        return this.tab ? this.tab.size : -1;
    }
    /**
     * @description 是否已释放
     */
    isReleased() {
        return !this.tab;
    }
    /**
     * @description 获取资源
     * @example
     */
    get(name) {
        const tab = this.tab;
        if (!tab) {
            return;
        }
        let r = tab.get(name);
        if (r) {
            return r;
        }
        r = resMap.get(name);
        if (!r) {
            return;
        }
        r.use();
        tab.set(name, r);
        return r;
    }
    /**
     * @description 加载资源
     * @example
     */
    load(name, type, args, funcArgs, successCallback, errorCallback) {
        const r = this.get(name);
        successCallback = successCallback || empty;
        errorCallback = errorCallback || empty;
        if (r) {
            return successCallback(r);
        }
        const create = typeMap.get(type);
        if (!create) {
            return false;
        }
        const cb = (r) => {
            const tab = this.tab;
            if (tab && !tab.has(name)) {
                r.use();
                tab.set(r.name, r);
            }
            successCallback(r);
        };
        const wait = waitMap.get(name);
        if (wait) {
            return wait.push(cb, errorCallback);
        }
        waitMap.set(name, [cb, errorCallback]);
        return create(name, type, args, funcArgs);
    }
    /**
     * @description 创建资源
     * @example
     */
    createRes(name, type, args, construct, data) {
        const tab = this.tab;
        if (!tab) {
            return;
        }
        const r = exports.loadOK(name, type, args, construct, data);
        r.use();
        tab.set(r.name, r);
        return r;
    }
    /**
     * @description 释放资源
     * @example
     */
    delete(res, timeout) {
        const tab = this.tab;
        if (!tab) {
            return false;
        }
        const b = tab.delete(res.name);
        if (b) {
            const time = time_1.now();
            res.unuse(time + (timeout || this.timeout), time);
        }
        return b;
    }
    /**
     * @description 清除全部资源
     * @example
     */
    clear() {
        const tab = this.tab;
        if (!tab) {
            return;
        }
        const time = time_1.now();
        const timeout = time + this.timeout;
        for (const res of tab.values()) {
            res.unuse(timeout, time);
        }
        tab.clear();
    }
    /**
     * @description 释放资源表
     * @example
     */
    release() {
        const tab = this.tab;
        if (!tab) {
            return false;
        }
        this.tab = null;
        const time = time_1.now();
        const timeout = time + this.timeout;
        for (const res of tab.values()) {
            res.unuse(timeout, time);
        }
        return true;
    }
}
exports.ResTab = ResTab;
/**
 * @description 后缀名对应的Blob类型
 * @example
 */
exports.BlobType = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    webp: 'image/webp',
    gif: 'image/gif',
    svg: 'image/svg+xml',
    ttf: 'application/x-font-ttf',
    otf: 'application/x-font-opentype',
    woff: 'application/x-font-woff',
    woff2: 'application/x-font-woff2'
};
/**
 * @description 创建BlobURL
 * @example
 */
exports.createURL = (data, type) => {
    const blob = new Blob([data], { type: type });
    return URL.createObjectURL(blob);
};
/**
 * @description 销毁BlobURL
 */
exports.revokeURL = (url) => {
    URL.revokeObjectURL(url);
};
/**
 * @description 注册资源类型对应的创建函数
 * @example
 */
exports.register = (type, create) => {
    typeMap.set(type, create);
};
/**
 * @description 等待成功
 * @example
 */
exports.loadOK = (name, type, args, construct, data) => {
    let r = resMap.get(name);
    if (!r) {
        r = new construct();
        r.name = name;
        r.type = type;
        r.args = args;
        r.create(data);
        resMap.set(r.name, r);
        const t = time_1.now();
        timeoutRelease(r, t, t + defalutTimeout);
    }
    const arr = waitMap.get(name);
    if (!arr) {
        return r;
    }
    waitMap.delete(name);
    for (let i = arr.length - 2; i >= 0; i -= 2) {
        arr[i](r);
    }
    return r;
};
/**
 * @description 等待失败
 * @example
 */
exports.loadError = (name, err) => {
    const arr = waitMap.get(name);
    if (!arr) {
        return;
    }
    waitMap.delete(name);
    for (let i = arr.length - 1; i >= 0; i -= 2) {
        arr[i](err);
    }
};
/**
 * @description 获得资源主表
 * @example
 */
exports.getResMap = () => {
    return resMap;
};
/**
 * @description 创建ArrayBuffer资源
 * @example
 */
const createABRes = (name, type, file, fileMap, construct) => {
    file = exports.getTransWebpName(file);
    if (fileMap) {
        const data = fileMap[file];
        if (data) {
            exports.loadOK(name, type, file, construct, data);
            return;
        }
    }
    const info = mod_1.depend.get(file);
    if (!info) {
        return exports.loadError(name, {
            error: 'FILE_NOT_FOUND',
            reason: `createBlobURLRes fail: ${file}`
        });
    }
    const down = mod_1.load.create([info], (r) => {
        exports.loadOK(name, type, file, construct, r[file]);
    }, (err) => {
        exports.loadError(name, err);
    });
    mod_1.load.start(down);
};
/**
 * @description 获取 png jpg jpeg 自动转换成同名的webp, webp必须在depend中存在
 * @example
 */
exports.getTransWebpName = (name) => {
    if (!(mod_1.commonjs.flags.webp && mod_1.commonjs.flags.webp.alpha)) {
        return name;
    }
    const suf = mod_1.butil.fileSuffix(name);
    if (!(suf === 'png' || suf === 'jpg' || suf === 'jpeg')) {
        return name;
    }
    const s = `${name.slice(0, name.length - suf.length)}webp`;
    const i = s.indexOf(':');
    return mod_1.depend.get(i < 0 ? s : s.slice(i + 1)) ? s : name;
};
// ============================== 本地
// 资源类型对应的构造函数表
const typeMap = new Map();
// 全局资源
const resMap = new Map();
// 全局等待表
const waitMap = new Map();
// 空函数
// tslint:disable-next-line:only-arrow-functions no-function-expression
const empty = function () { };
// 定时的时间
const defalutTimeout = 1000;
// 最小释放的时间
const minReleaseTimeout = 500;
// 等待释放的资源数组
let releaseArray = [];
// 回收方法的定时器的引用
let timerRef = 0;
// 定时的时间
let timerTime = Number.MAX_SAFE_INTEGER;
/**
 * @description BlobURL资源
 * @example
 */
class BlobURLRes extends Res {
    /**
     * @description 创建
     * @example
     */
    create(data) {
        const type = mod_1.butil.fileSuffix(this.args);
        const blob = new Blob([data], { type: exports.BlobType[type] });
        this.link = URL.createObjectURL(blob);
    }
    /**
     * @description 销毁，需要子类重载
     * @example
     */
    destroy() {
        URL.revokeObjectURL(this.link);
    }
}
/**
 * @description 回收超时的资源
 * @example
 */
const collect = () => {
    const time = time_1.now();
    const arr = releaseArray;
    releaseArray = [];
    timerRef = 0;
    timerTime = Number.MAX_SAFE_INTEGER;
    for (const res of arr) {
        res.release(time);
    }
};
/**
 * @description 超时释放, 最小500ms
 * @example
 */
const timeoutRelease = (res, nowTime, releaseTime) => {
    releaseArray.push(res);
    if (timerTime <= releaseTime + minReleaseTimeout) {
        return;
    }
    if (timerRef) {
        clearTimeout(timerRef);
    }
    timerTime = (releaseTime > nowTime + minReleaseTimeout) ? releaseTime : nowTime + minReleaseTimeout;
    timerRef = setTimeout(collect, timerTime - nowTime);
};
// ============================== 立即执行
exports.register(exports.RES_TYPE_BLOB, (name, type, args, fileMap) => {
    createABRes(name, type, args, fileMap, BlobURLRes);
});
exports.register(exports.RES_TYPE_FILE, (name, type, args, fileMap) => {
    createABRes(name, type, args, fileMap, Res);
});
});
