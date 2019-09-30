_$define("app/pi_sdk/sdkApi", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sdkTools_1 = require("./sdkTools");
const signIn_1 = require("./signIn");
/**
 * 获取是否开启免密支付
 */
exports.getFreeSecret = () => {
    console.log('getFreeSecret called');
    window["pi_sdk"].pi_RPC_Method(window["pi_sdk"].config.jsApi, 'querySetNoPassword', window["pi_sdk"].config.appid, (error, startFreeSecret) => {
        console.log('getFreeSecret called callback', startFreeSecret);
        window["pi_sdk"].store.freeSecret = startFreeSecret;
    });
};
// 第三方设置免密支付
// openFreeSecret:设置免密支付状态  
// 0:关闭，1:开启
exports.setFreeSecrectPay = (openFreeSecret) => {
    sdkTools_1.closePopBox();
    const title = openFreeSecret ? '设置免密支付' : '关闭免密支付';
    sdkTools_1.popInputBox(title, (value) => {
        const sendData = {
            appid: window["pi_sdk"].config.appid,
            noPSW: openFreeSecret ? 1 : 0,
            password: value
        };
        sdkTools_1.popNewLoading('设置中...');
        window["pi_sdk"].pi_RPC_Method(window["pi_sdk"].config.jsApi, 'setFreeSecrectPay', sendData, (resCode1, msg1) => {
            if (msg1) {
                window["pi_sdk"].store.freeSecret = !window["pi_sdk"].store.freeSecret;
                sdkTools_1.popNewMessage('设置成功');
            }
            else {
                sdkTools_1.popNewMessage('设置失败');
            }
            sdkTools_1.closePopBox();
        });
    });
};
// ----------对外接口------------------------------------------------------------------------------------------
// 获取openID
const authorize = (payload, callBack) => {
    window["pi_sdk"].pi_RPC_Method(window["pi_sdk"].config.jsApi, 'authorize', payload, (error, result) => {
        console.log('getOpenId call success', error);
        console.log('getOpenId call success', result);
        callBack(error, result);
    });
};
// 第三方支付
const thirdPay = (order, callBack) => {
    const payCode = {
        SUCCESS: 1,
        SETNOPASSWORD: 2,
        EXCEEDLIMIT: 3,
        ERRORPSW: 4,
        RECHARGEFAILED: 5,
        FAILED: 6 // 支付失败
    };
    sdkTools_1.closePopBox();
    sdkTools_1.popNewLoading('支付中...');
    window["pi_sdk"].pi_RPC_Method(window["pi_sdk"].config.jsApi, 'thirdPay', {
        order,
        webviewName: window["pi_sdk"].config.webviewName
    }, (error, res) => {
        console.log('thirdPay call success', res);
        sdkTools_1.closePopBox();
        if (res.result === payCode.SUCCESS) {
            sdkTools_1.popNewMessage('支付成功');
            callBack(error, res);
        }
        else if (res.result === payCode.SETNOPASSWORD || res.result === payCode.EXCEEDLIMIT) {
            const title = res.result === payCode.SETNOPASSWORD ? '未开启免密支付，请输入支付密码' : '免密额度到达上限';
            sdkTools_1.popInputBox(title, (value) => {
                sdkTools_1.popNewLoading('支付中...');
                window["pi_sdk"].pi_RPC_Method(window["pi_sdk"].config.jsApi, 'thirdPayDirect', {
                    order,
                    password: value
                }, (error, res) => {
                    console.log('thirdPayDirect call success', res);
                    sdkTools_1.closePopBox();
                    if (res.result === payCode.ERRORPSW) {
                        sdkTools_1.popNewMessage('密码错误');
                        callBack(error, { result: payCode.FAILED });
                    }
                    else if (res.result === payCode.SUCCESS) {
                        sdkTools_1.popNewMessage('支付成功');
                        callBack(error, res);
                    }
                    else {
                        sdkTools_1.popNewMessage('支付失败');
                        callBack(error, res);
                    }
                });
            });
        }
        else {
            sdkTools_1.popNewMessage('支付失败');
            callBack(error, { result: payCode.FAILED });
        }
    });
};
// 打开新页面
const openNewWebview = (payload) => {
    window["pi_sdk"].pi_RPC_Method(window["pi_sdk"].config.jsApi, 'openNewWebview', payload, (error, result) => {
        console.log('openNewWebview call success');
    });
};
// 关闭钱包后台
const closeWalletWebview = () => {
    window["pi_sdk"].pi_RPC_Method(window["pi_sdk"].config.jsApi, 'closeWalletWebview', null, (error, result) => {
        console.log('closeWalletWebview call success');
    });
};
// 打开注册登录页面
const openSignInPage = () => {
    signIn_1.createSignInStyle();
    signIn_1.createSignInPage();
};
// ----------对外接口------------------------------------------------------------------------------------------
const piSdk = window["pi_sdk"] || {};
const piApi = {
    authorize,
    thirdPay,
    openNewWebview,
    closeWalletWebview,
    openSignInPage
};
// tslint:disable-next-line: no-unsafe-any
piSdk.api = piApi;
window["pi_sdk"] = piSdk;
});
