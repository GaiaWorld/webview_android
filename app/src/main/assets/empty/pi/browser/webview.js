_$define("pi/browser/webview", function (require, exports, module){
"use strict";
// ========================= import 
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("./native");
// ========================= export
/**
 * WebView管理相关
 */
class WebViewManager extends native_1.NativeObject {
    static addListenStage(callback) {
        stageArray.push(callback);
    }
    static isDefaultKilled(success) {
        if (isJSVM) {
            getInstance().call('isDefaultKilled', { success });
        }
    }
    static reloadDefault() {
        if (isJSVM) {
            getInstance().call('reloadDefault', {});
        }
    }
    static getReady(stage) {
        if (isJSVM) {
            window.JSVM.getReady(stage);
        }
        else if (isPC) {
            const pcindex = pcStageArray.indexOf(stage);
            if (pcindex >= 0) {
                window.onLoadTranslation(stage);
                pcStageArray.splice(pcindex, 1);
            }
            else {
                pcStageArray.push(stage);
            }
        }
        else {
            getInstance().call('getReady', { stage });
        }
    }
    /**
     * 创建新的WebView窗口并弹出来
     * 注：webViewName不能和已有的WebView重复，如果相同，抛异常
     * 注：主WebView的名字是"default"
     */
    static open(webViewName, url, title, injectContent) {
        getInstance().call('openWebView', { webViewName, url, title, injectContent });
    }
    /**
     * 释放指定名字的WebView
     * 注：不能使用这个释放主WebView
     */
    static close(webViewName) {
        getInstance().call('closeWebView', { webViewName });
    }
    /**
     * 获取屏幕刘海与下部分高度
     */
    static getScreenModify(success) {
        getInstance().call('getScreenModify', { success });
    }
    static minWebView(webViewName) {
        getInstance().call('minWebView', { webViewName });
    }
    /**
     * 创建一个新的webview，但不会显示出来
     * 一般用于微信支付
     * headers = {"Referer": url}
     */
    static newView(webViewName, url, headers) {
        headers = headers || {};
        const headerString = JSON.stringify(headers);
        getInstance().call('newView', { webViewName, url, headers: headerString });
    }
    /**
     * 只有newView的东西，才能用freeView释放
     */
    static freeView(webViewName) {
        getInstance().call('freeView', { webViewName });
    }
    /**
     * 往指定名字的WebView发信息
     */
    static postMessage(webViewName, message) {
        if (isJSVM) {
            window.JSVM.postMessage(webViewName, message);
        }
        else if (isPC) {
            window.onWebViewPostMessage('self', message);
        }
        else {
            getInstance().call('postWebViewMessage', { webViewName, message });
        }
    }
    /**
     * 注册收到别的webView发过来的postmessage信息后的回调函数
     */
    static addPostMessageListener(listener) {
        if (postMessageListeners.indexOf(listener) < 0) {
            postMessageListeners.push(listener);
        }
    }
    /**
     * 取消注册当收到别的WebView发过来的postmessage消息后的回调函数
     */
    static removePostMessageListener(listener) {
        const position = postMessageListeners.indexOf(listener);
        if (position >= 0) {
            postMessageListeners.splice(position, 1);
        }
    }
    /**
     * 往指定名字的WebView调用指定模块的导出方法
     * data: 指定对方WebView执行的模块和导出方法
     * callback：返回结果的回调函数， 如果要调用的function中，有callBack，就不能写该callBack
     * 注：RPC都是一来一回的结构，没有注册一次可以调用多次的结构！
     */
    static rpc(webViewName, data, callback) {
        const funcs = [];
        data.params = data.params || [];
        data.params = data.params.map(v => {
            if (v === undefined) {
                v = null;
            }
            else if (v instanceof Function) {
                const id = funcs.length;
                funcs.push(v);
                v = RPC_CALLBACK_PARAM + id;
            }
            return v;
        });
        const sign = data;
        if (callback) {
            sign.resultCallbackID = funcs.length;
            funcs.push(callback);
        }
        if (funcs.length > 0) {
            sign.rpcID = ++rpcCurrentID;
            rpcMap.set(sign.rpcID, funcs);
        }
        if (isPC) {
            window.onWebViewPostMessage('self', RPC_CALL_START + JSON.stringify(sign));
        }
        else {
            WebViewManager.postMessage(webViewName, RPC_CALL_START + JSON.stringify(sign));
        }
    }
    /**
     * 关闭定时器
     */
    static endTimer() {
        getInstance().call('endTimerInWebView', {});
    }
}
exports.WebViewManager = WebViewManager;
// ========================= implmentation
native_1.registerSign(WebViewManager, {
    newView: [{
            name: 'webViewName',
            type: native_1.ParamType.String
        }, {
            name: 'url',
            type: native_1.ParamType.String
        }, {
            name: 'headers',
            type: native_1.ParamType.String
        }],
    freeView: [{
            name: 'webViewName',
            type: native_1.ParamType.String
        }],
    openWebView: [{
            name: 'webViewName',
            type: native_1.ParamType.String
        }, {
            name: 'url',
            type: native_1.ParamType.String
        }, {
            name: 'title',
            type: native_1.ParamType.String
        }, {
            name: 'injectContent',
            type: native_1.ParamType.String
        }],
    closeWebView: [{
            name: 'webViewName',
            type: native_1.ParamType.String
        }],
    postWebViewMessage: [{
            name: 'webViewName',
            type: native_1.ParamType.String
        }, {
            name: 'message',
            type: native_1.ParamType.String
        }],
    getReady: [{
            name: 'stage',
            type: native_1.ParamType.String
        }],
    getScreenModify: [],
    isDefaultKilled: [],
    reloadDefault: [],
    endTimerInWebView: [],
    minWebView: [{
            name: 'webViewName',
            type: native_1.ParamType.String
        }]
});
/**
 * 特殊的消息开头，代表这是一个RPC调用
 */
const RPC_CALL_START = '$WEBVIEW_RPC_CALL: ';
/**
 * 特殊的消息开头，代表这是一个RPC回应
 */
const RPC_REPLY_START = '$WEBVIEW_RPC_REPLY: ';
/**
 * 特殊的消息格式，代表参数是一个函数
 */
const RPC_CALLBACK_PARAM = '$WEBVIEW_RPC_FUNCTION_PARAM: ';
/**
 * 监听postmessage的列表
 */
const postMessageListeners = [];
/**
 * rpc的当前可用的id 和 RPC映射表
 */
let rpcCurrentID = 0;
const rpcMap = new Map();
let count = 0;
/**
 * 注册到window上的全局函数，用于接收别的webView发送过来的消息
 */
window.onWebViewPostMessage = function (fromWebView, message) {
    console.log(`onWebViewPostMessage count = ${++count}`);
    // ping-pong测试
    // WebViewManager.postMessage(fromWebView, message);
    // 收到对方的rpc调用请求，处理
    if (message.startsWith(RPC_CALL_START)) {
        message = message.slice(RPC_CALL_START.length);
        const data = JSON.parse(message);
        return handleRpcCall(fromWebView, data);
    }
    // 收到对方的rpc回应，处理
    if (message.startsWith(RPC_REPLY_START)) {
        message = message.slice(RPC_REPLY_START.length);
        const data = JSON.parse(message);
        return handleRpcReply(data);
    }
    // 其他消息，看高层，谁关心谁处理
    for (const listener of postMessageListeners) {
        listener(fromWebView, message);
    }
};
/**
 * 收到对方RPC之后的处理
 * @param fromWebViewName
 * @param message
 */
const handleRpcCall = (fromWebViewName, { moduleName, methodName, params, rpcID, resultCallbackID }) => {
    let func, result;
    window.pi_modules.commonjs.exports.require([moduleName], {}, function (mods, fm) {
        const mod = mods[0];
        func = mod[methodName];
        if (!func) {
            result = {
                error: 'throw error, can\'t find module ' + moduleName + ', function = ' + methodName
            };
        }
        if (func) {
            /**
             * 将参数的回调函数恢复回来
             */
            params = params.map(v => {
                if (typeof v === 'string' && v.startsWith(RPC_CALLBACK_PARAM)) {
                    const id = JSON.parse(v.slice(RPC_CALLBACK_PARAM.length));
                    return (...args) => {
                        const sign = {
                            args: args,
                            rpcID: rpcID,
                            callbackID: id
                        };
                        const message = RPC_REPLY_START + JSON.stringify(sign);
                        if (isPC) {
                            window.onWebViewPostMessage(fromWebViewName, message);
                        }
                        else {
                            WebViewManager.postMessage(fromWebViewName, message);
                        }
                    };
                }
                return v;
            });
            console.log(`handleRpcCall params ${JSON.stringify(params)}`);
            try {
                result = func(...params);
                console.log(`handleRpcCall result ${result}`);
            }
            catch (e) {
                func = undefined;
                result = {
                    error: 'call throw error'
                };
            }
        }
        // 异常情况时，func为undefined，这时必须让对方的rpc释放掉
        if ((!func) || resultCallbackID !== undefined) {
            const sign = {
                args: [result]
            };
            if (rpcID !== undefined) {
                sign.rpcID = rpcID;
            }
            if (resultCallbackID !== undefined) {
                sign.callbackID = resultCallbackID;
            }
            const message = RPC_REPLY_START + JSON.stringify(sign);
            if (isPC) {
                window.onWebViewPostMessage(fromWebViewName, message);
            }
            else {
                WebViewManager.postMessage(fromWebViewName, message);
            }
        }
    }, function (result) {
        result = {
            error: 'throw error, load fail ' + moduleName
        };
    }, console.log('load mod ing1111111111.....'));
    result = {
        error: 'throw error, can\'t find module ' + moduleName
    };
};
/**
 * 收到对方RPC回应之后的处理
 */
const handleRpcReply = ({ rpcID, callbackID, args }) => {
    const funcs = rpcMap.get(rpcID);
    const f = funcs && funcs[callbackID];
    if (f) {
        f(...args);
    }
    rpcMap.delete(rpcID);
};
const isPC = navigator.userAgent.indexOf('YINENG') > 0 ? false : true;
const isJSVM = navigator.userAgent.indexOf('JSVM') > 0 ? true : false;
let webViewMgr;
const getInstance = () => {
    if (!webViewMgr) {
        webViewMgr = new WebViewManager();
        webViewMgr.init();
    }
    return webViewMgr;
};
// 准备阶段回调
const pcStageArray = [];
const stageArray = [];
window.onLoadTranslation = function (message) {
    console.log('window.onLoadTranslation==', message, stageArray);
    for (const f of stageArray) {
        f(message);
    }
};
});
