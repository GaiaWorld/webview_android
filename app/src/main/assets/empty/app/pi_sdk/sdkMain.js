_$define("app/pi_sdk/sdkMain", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sdkTools_1 = require("./sdkTools");
const sdkApi_1 = require("./sdkApi");
let webviewManagerPath; // pi库webview文件路径
// tslint:disable-next-line:variable-name
let pi_RPC_Method; // rpc调用
// tslint:disable-next-line:variable-name
const pi_sdk = window["pi_sdk"] || {}; // pi sdk
// tslint:disable-next-line:variable-name
const piStore = pi_sdk.store || {
    freeSecret: false // 是否开启免密支付
};
// tslint:disable-next-line:variable-name
const piConfig = pi_sdk.config || {}; // 配置信息
/**
 * button id定义
 */
var ButtonId;
(function (ButtonId) {
    ButtonId["INVITEFRIENDS"] = "pi-invite";
    ButtonId["GAMESSERVICE"] = "pi-service";
    ButtonId["OFFICIALGROUPCHAT"] = "pi-official-chat";
    ButtonId["RECHARGE"] = "pi-recharg";
    ButtonId["FREESECRET"] = "pi-free-secret";
    ButtonId["MINWINDOW"] = "pi-min-window";
    ButtonId["EXITGAME"] = "pi-exit-game"; // 退出游戏
})(ButtonId || (ButtonId = {}));
/**
 * 提供的button
 */
const showButtons = [{
        id: ButtonId.INVITEFRIENDS,
        img: 'wx.png',
        text: '邀请好友',
        show: true,
        clickedClose: true,
        clickCb: () => {
            console.log('click 邀请好友');
            pi_RPC_Method(piConfig.jsApi, 'inviteFriends', piConfig.webviewName, (error, result) => {
                console.log('inviteFriends call success');
            });
        }
    }, {
        id: ButtonId.GAMESSERVICE,
        img: 'game_customer_service.png',
        text: '游戏客服',
        show: true,
        clickedClose: true,
        clickCb: () => {
            console.log('click 游戏客服');
            pi_RPC_Method(piConfig.jsApi, 'gotoGameService', piConfig.webviewName, (error, result) => {
                console.log('gotoGameService call success');
            });
        }
    }, {
        id: ButtonId.OFFICIALGROUPCHAT,
        img: 'official_group_chat.png',
        text: '官方群聊',
        show: true,
        clickedClose: true,
        clickCb: () => {
            console.log('click 官方群聊');
            pi_RPC_Method(piConfig.jsApi, 'gotoOfficialGroupChat', piConfig.webviewName, (error, result) => {
                console.log('gotoOfficialGroupChat call success');
            });
        }
    }, {
        id: ButtonId.RECHARGE,
        img: 'recharg.png',
        text: '去充值',
        show: true,
        clickedClose: true,
        clickCb: () => {
            console.log('click 去充值');
            pi_RPC_Method(piConfig.jsApi, 'gotoRecharge', piConfig.webviewName, (error, result) => {
                console.log('inviteFriends call success');
            });
        }
    }, {
        id: ButtonId.FREESECRET,
        startImg: 'free_secret_close.png',
        closeImg: 'free_secret_start.png',
        text: '打开免密',
        startText: '关闭免密',
        closeText: '打开免密支付',
        show: false,
        clickedClose: false,
        clickCb: () => {
            console.log('click 免密支付');
            sdkApi_1.setFreeSecrectPay(!piStore.freeSecret);
        }
    }, {
        id: ButtonId.MINWINDOW,
        img: 'min_window.png',
        text: '最小化',
        show: true,
        clickedClose: true,
        clickCb: () => {
            console.log('click 最小化');
            pi_RPC_Method(piConfig.jsApi, 'minWebview', { webviewName: piConfig.webviewName, popFloatBox: true }, (error, result) => {
                console.log('minWebview call success');
            });
        }
    }, {
        id: ButtonId.EXITGAME,
        img: 'exit_game.png',
        text: '退出游戏',
        show: true,
        clickedClose: true,
        clickCb: () => {
            console.log('click 退出游戏');
            pi_RPC_Method(piConfig.jsApi, 'closeWebview', piConfig.webviewName, (error, result) => {
                console.log('closeWebview call success');
            });
        }
    }];
/**
 * @param timeMS: 超时时间
 * @param autoInfo：JSON对象
 * @param callback(err, initData) 接口回调
 * @description autoInfo 结构
 *                  {
 *                      "webViewName" = "testWebView"
 *                  }
 * @description initData 结构
 *                  {
 *                      "code" = 0
 *                      "autoToken" = "HA1284HWADry98"
 *                  }
 */
const piService = {
    hasCallBind: false,
    callBackListen: undefined,
    bind: function (timeMS, autoInfo, callback) {
        let start = 0;
        const step = 100;
        if (this.hasCallBind) {
            callback({
                code: -1,
                reason: 'this webview has already bind'
            });
            return;
        }
        this.hasCallBind = true;
        this.callBackListen = callback;
        const that = this;
        const handler = function () {
            if (!that.hasCallBind) {
                return;
            }
            start += step;
            if (start > timeMS) {
                callback({
                    code: -3,
                    reason: 'timeout'
                });
                return;
            }
            if (that.callBackListen) {
                window["JSBridge"].webViewBindService(JSON.stringify(autoInfo));
                setTimeout(handler, step);
            }
        };
        setTimeout(handler, step);
    },
    unbind: function (webViewName) {
        if (!this.hasCallBind)
            return;
        this.hasCallBind = false;
        window["JSBridge"].unWebViewBindService(webViewName);
    },
    onBindService: function (err, initData) {
        this.callBackListen && this.callBackListen(err, JSON.parse(initData));
        this.callBackListen = undefined;
    }
};
/**
 * 设置webviewManager路径
 */
const setWebviewManager = (path) => {
    webviewManagerPath = path;
    console.log('setWebviewManager path = ', path);
    pi_sdk.pi_RPC_Method = pi_RPC_Method = (moduleName, methodName, param, callback) => {
        const exs = pi_modules[webviewManagerPath].exports;
        if (!exs || !exs.WebViewManager || !exs.WebViewManager.rpc)
            throw new Error('can\'t find WebViewManager');
        const rpcData = {
            moduleName,
            methodName,
            params: [param, callback] // 参数组成的数组，参数可以有回调函数
        };
        exs.WebViewManager.rpc('JSVM', rpcData);
    };
};
/**
 * 初始化
 */
const piSdkInit = (cb) => {
    sdkTools_1.createThirdBaseStyle();
    sdkTools_1.createThirdApiStyleTag();
    piService.bind(2000, { webviewName: piConfig.webviewName }, cb);
    // buttonModInit()();
    // getFreeSecret();
};
piConfig.ButtonId = ButtonId;
piConfig.showButtons = showButtons;
piConfig.webviewName = 'wallet';
piConfig.isHorizontal = false;
piConfig.appid = '101';
piConfig.jsApi = 'app/remote/JSAPI';
piConfig.imgUrlPre = 'http://192.168.33.13/wallet/app/res/image/third/';
pi_sdk.setWebviewManager = setWebviewManager;
pi_sdk.piSdkInit = piSdkInit;
pi_sdk.config = piConfig;
pi_sdk.store = piStore;
pi_sdk.piService = piService;
window["pi_sdk"] = pi_sdk;
});
