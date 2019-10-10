_$define("app/postMessage/postMessage", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * vm 推送消息
 */
const webview_1 = require("../../pi/browser/webview");
const serverPush_1 = require("./serverPush");
const constant_1 = require("../public/constant");
const thirdPush_1 = require("./thirdPush");
const vmLoaded_1 = require("./vmLoaded");
/**
 * 监听postMessage
 */
webview_1.WebViewManager.addPostMessageListener((fromWebView, message) => {
    const msg = JSON.parse(message);
    console.log('postMessage ===', msg);
    if (msg.moduleName === constant_1.PostModule.LOADED) {
        vmLoaded_1.emitVmLoaded(msg.args);
    }
    else if (msg.moduleName === constant_1.PostModule.SERVER) {
        serverPush_1.emitServerPush(msg.args);
    }
    else if (msg.moduleName === constant_1.PostModule.THIRD) {
        thirdPush_1.emitThirdPush(msg.args);
    }
    else if (msg.moduleName === constant_1.PostModule.AUTHORIZE) {
        console.log('授权成功');
    }
});
});
