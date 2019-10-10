_$define("app/postMessage/listenerStore", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webview_1 = require("../../pi/browser/webview");
/**
 * 监听store
 */
const handlerMap = new Map();
const VMREGISTERSTORE = 'app/store/memstore';
const registerMethodName = 'vmRegisterStore';
const registerKeys = [];
let frameId;
/**
 * 注册监听函数
 */
exports.addStoreListener = (key, cb) => {
    const handlers = handlerMap.get(key) || [];
    if (handlers.length === 0) { // 当前key还从未被注册过
        registerKeys.push(key); // 一次性注册的key
    }
    handlers.push(cb);
    handlerMap.set(key, handlers);
    if (!frameId && registerKeys.length > 0) {
        frameId = requestAnimationFrame(() => {
            const keysStr = registerKeys.join(',');
            webview_1.WebViewManager.rpc('JSVM', { moduleName: VMREGISTERSTORE, methodName: registerMethodName, params: [keysStr] }, () => { });
            registerKeys.length = 0;
            frameId = undefined;
        });
    }
};
/**
 * 通知监听器
 */
exports.notifyListener = (key, data) => {
    data = JSON.parse(data);
    const handlers = handlerMap.get(key) || [];
    for (const h of handlers) {
        h && h(data);
    }
};
});
