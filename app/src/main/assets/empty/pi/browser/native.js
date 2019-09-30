_$define("pi/browser/native", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 封装了高层与底层交互方法
 */
// ============================== 导入
const base64_1 = require("../util/base64");
// ============================== 导出
/**
 * 添加底层事件监听器
 * cb(param1, param2, ...)
 */
exports.addEventListener = (type, name, cb) => {
    if (!eventMap.has(type)) {
        eventMap.set(type, new Map());
    }
    let nameMap = eventMap.get(type);
    if (!nameMap.has(name)) {
        nameMap.set(name, []);
    }
    let fs = nameMap.get(name);
    if (fs.indexOf(cb) < 0) {
        fs.push(cb);
    }
};
/**
 * 移除底层事件监听器
 * cb(param1, param2, ...)
 */
exports.removeEventListener = (type, name, cb) => {
    if (eventMap.has(type)) {
        let nameMap = eventMap.get(type);
        if (nameMap.has(name)) {
            let fs = nameMap.get(name);
            let index = fs.indexOf(cb);
            if (index >= 0)
                fs.splice(index, 1);
            if (fs.length === 0)
                nameMap.delete(name);
            if (nameMap.size === 0)
                eventMap.delete(type);
        }
    }
};
/**
 * 注册类的方法签名
 * @param constructor 类的构造函数
 * @param sign
 * {
 *    "getPerson": [{name: "paramName", type: ParamType.Number}...]
 * }
 */
exports.registerSign = (constructor, sign) => {
    const map = new Map();
    for (const methodName in sign) {
        map.set(methodName, sign[methodName]);
    }
    signMap.set(constructor, map);
};
/**
 * 底层对象，供高层扩展
 */
class NativeObject {
    constructor() {
        this.id = 0; // 底层对象对应的id，如果为0代表尚未初始化成功
        this.state = NativeState.UnInit; // 当前状态
        this.waits = []; // 正在初始化时候，积累的函数；最后一个是方法名，其他是方法的参数
    }
    /**
     * 调用底层静态方法
     */
    /* tslint:disable:function-name */
    static callStatic(constructor, methodName, params, id = 0) {
        const className = constructor.name;
        let cbID = 0;
        if (params.success || params.fail || params.callback) {
            cbID = callIDMax++;
            callIDMap.set(cbID, {
                success: params.success,
                fail: params.fail,
                callback: params.callback
            });
        }
        const args = [];
        const methodSign = signMap.get(constructor);
        const signs = methodSign.get(methodName);
        for (const p of signs) {
            if (!(p.name in params)) {
                throw new Error(`${className}.${methodName}, value ${p.name} isn't exist`);
            }
            let value = params[p.name];
            switch (p.type) {
                case ParamType.Number:
                    if (typeof value !== 'number') {
                        throw new Error(`${className}.${methodName}, type ${p.type} of value ${p.name} isn't match`);
                    }
                    break;
                case ParamType.String:
                    if (typeof value !== 'string') {
                        throw new Error(`${className}.${methodName}, type ${p.type} of value ${p.name} isn't match`);
                    }
                    break;
                case ParamType.Bytes:
                    if (!(value instanceof ArrayBuffer)) {
                        throw new Error(`${className}.${methodName}, type ${p.type} of value ${p.name} isn't match`);
                    }
                    value = base64_1.arrayBufferToBase64(value);
                    break;
                default:
                    throw new Error(`${className}.${methodName}, type ${p.type} of value ${p.name} isn't exist`);
            }
            args.push(value);
        }
        exports.callNative(className, methodName, id, cbID, ...args);
    }
    /**
     * 初始化方法，创建对象
     * @param cb 监听器
     */
    init(cb) {
        if (this.state !== NativeState.UnInit) {
            throw new Error('NativeObject already inited');
        }
        this.state = NativeState.Init;
        const func = id => {
            this.id = id;
            // 调用积累函数
            for (let w of this.waits) {
                const name = w.pop();
                w = w ? w[0] : undefined;
                setTimeout(() => {
                    if (name === 'close') {
                        this.close(w);
                    }
                    else {
                        this.call(name, w);
                    }
                }, 0);
            }
            this.waits.length = 0;
            cb && cb.success && cb.success();
        };
        const cbID = callIDMax++;
        callIDMap.set(cbID, {
            success: func
        });
        exports.callNative(this.constructor.name, 'init', 0, cbID);
    }
    /**
     * 删除底层对象
     */
    close(cb) {
        if (this.state !== NativeState.Init) {
            alert(`NativeObject.close isn\'t use, state = ${this.state}`);
            throw new Error('NativeObject isn\'t use');
        }
        if (this.id === 0) {
            this.waits.push([cb, 'close']);
            return;
        }
        this.state = NativeState.Close;
        let cbID = 0;
        if (cb.success) {
            cbID = callIDMax++;
            callIDMap.set(cbID, {
                success: cb.success
            });
        }
        const id = this.id;
        this.id = 0;
        exports.callNative(this.constructor.name, 'close', id, cbID);
    }
    /**
     * 调用底层方法
     */
    call(methodName, params) {
        if (this.state !== NativeState.Init) {
            throw new Error(`${methodName} NativeObject isn\'t use`);
        }
        if (this.id === 0) {
            this.waits.push([params, methodName]);
            return;
        }
        NativeObject.callStatic(this.constructor, methodName, params, this.id);
    }
}
exports.NativeObject = NativeObject;
// ============================== 本地
/**
 * 调用底层函数
 *
 */
exports.callNative = (className, methodName, nativeID, listenerID, ...args) => {
    const str = navigator.userAgent;
    if (str.indexOf('JSVM') >= 0) {
        window.JSVM.messageReciver([className, methodName, nativeID, listenerID, ...args]);
    }
    else if (str.indexOf('YINENG_ANDROID') >= 0) {
        // alert(`callNative(${className}, ${methodName}, ${nativeID}, ${listenerID}, ${JSON.stringify(args)})`)
        window.JSBridge.postMessage(className, methodName, nativeID, listenerID, JSON.stringify(args));
    }
    else if (str.indexOf('YINENG_IOS') >= 0) {
        // JS通知WKWebView
        window.webkit.messageHandlers.Native.postMessage([className, methodName, nativeID, listenerID, ...args]);
    }
};
/**
 * 底层回调方法的约定
 */
var NativeCode;
(function (NativeCode) {
    NativeCode[NativeCode["Success"] = 0] = "Success";
    NativeCode[NativeCode["Fail"] = 1] = "Fail";
    NativeCode[NativeCode["Callback"] = 2] = "Callback";
})(NativeCode = exports.NativeCode || (exports.NativeCode = {}));
/**
 * 类型
 */
var ParamType;
(function (ParamType) {
    ParamType["Number"] = "number";
    ParamType["String"] = "string";
    ParamType["Bytes"] = "ArrayBuffer";
})(ParamType = exports.ParamType || (exports.ParamType = {}));
/**
 * 对象的初始化状态
 */
var NativeState;
(function (NativeState) {
    NativeState[NativeState["UnInit"] = 0] = "UnInit";
    NativeState[NativeState["Init"] = 1] = "Init";
    NativeState[NativeState["Close"] = 2] = "Close"; // 已经关闭
})(NativeState = exports.NativeState || (exports.NativeState = {}));
// 当前回调对应的索引
let callIDMax = 1;
/**
 * 回调函数对应的id map
 */
const callIDMap = new Map();
const eventMap = new Map();
const signMap = new Map();
/**
 * 底层主动抛上来的事件
 */
window.handle_native_event = (type, name, ...params) => {
    if (eventMap.has(type)) {
        let nameMap = eventMap.get(type);
        if (nameMap.has(name)) {
            for (let f of nameMap.get(name)) {
                f(...params);
            }
        }
    }
};
/**
 * 高层调用底层后，底层的回调
 */
window.handle_native_message = (cbID, code, ...args) => {
    // alert(`handle_native_message(${cbID}, ${code}, ${args.join(",")})`);
    if (cbID === 0)
        return;
    const cb = callIDMap.get(cbID);
    if (!cb) {
        return;
    }
    switch (code) {
        case NativeCode.Success:
            cb.success && cb.success(...args);
            callIDMap.delete(cbID); // 成功回调只调用一次
            break;
        case NativeCode.Fail:
            cb.fail && cb.fail(...args);
            callIDMap.delete(cbID); // 失败回调只调用一次
            break;
        case NativeCode.Callback:
            // 约定：所有的callback函数都不会删除map，在最后一次调用success或fail
            cb.callback && cb.callback(...args);
            break;
        default:
            alert(`NativeObject Callback error, code = ${code} don't match`);
            throw new Error(`NativeObject Callback error, code = ${code} don't match`);
    }
};
/**
 * 底层报错回调
 */
window.handle_native_throw_error = (className, methodName, msg) => {
    alert(`handle_native_throw_error, ${className}.${methodName} failed: ${msg}`);
    throw new Error(`handle_native_throw_error, ${className}.${methodName} failed: ${msg}`);
};
});
