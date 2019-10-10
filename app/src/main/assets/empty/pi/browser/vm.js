_$define("pi/browser/vm", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 游戏中打开分享界面
 * @param imageName 图片名
 * @param userName 用户名
 * @param shareCode 邀请码
 * @param shareUrl 用于生产二维码的URL
 * @param callBack(result) 0: 分享成功， -1： 分享失败  -2： 分享取消
 */
exports.goshare = (imageName, userName, shareCode, shareUrl, callBack) => {
    window.Service.goShare(imageName, userName, shareCode, shareUrl, callBack);
};
/**
 * android去充值---->打开界面
 * @param slv 银两余额
 */
exports.goChareActivity = (slv) => {
    window.Service.goChareActivity(slv);
};
/**
 * 监听充值界面推送事件
 * @param success payAmount：充值金额，单位分，platform：充值平台
 * @param fail code: -1:用户点击返回
 */
exports.addChareActionListener = (success, fail) => {
    var callBack = (code, payAmount, plateform) => {
        if (code === 0) {
            success(payAmount, plateform);
        }
        else {
            fail(code);
        }
    };
    window.Service.addActionListener("outpay_action", callBack);
};
/**
 * 关闭监听事件
 */
exports.removeChareActionListener = () => {
    window.Service.removeActionListener("outpay_action");
};
/**
 * android游戏内充值---->打开界面
 * @param orderId 订单ID string
 * @param kupayId 好嗨ID string
 * @param balance 银两余额  int (fen)
 * @param seller 收款方 string
 * @param price 收款价格 string
 * @param pay 还需支付 int(fen)
 */
exports.goChareInGameActivity = (orderId, kupayId, balance, seller, price, pay) => {
    window.Service.goChareInGameActivity(orderId, kupayId, balance, seller, price, pay);
};
/**
 * 监听充值界面推送事件
 * @param success(orderId, platform)订单ID， 充值平台
 * @param fail code: -1:用户点击返回
 */
exports.addChareInGameActionListener = (success, fail) => {
    var callBack = (code, orderId, plateform) => {
        if (code === 0) {
            success(orderId, plateform);
        }
        else {
            fail(code);
        }
    };
    window.Service.addActionListener("inpay_action", callBack);
};
/**
 * 关闭监听事件
 */
exports.removeChareInGameActionListener = () => {
    window.Service.removeActionListener("inpay_action");
};
/**
 * 支付宝支付
 * callBack(code) 0: 成功  其他： 取消
 */
exports.goAliPay = (codeInfo, callBack) => {
    window.Service.goAliPay(codeInfo, callBack);
};
/**
 * 微信支付
 * callBack(code) 0： 成功  其他： 取消
 */
exports.goWeXinPay = (app_id, partnerid, prepayid, packages, noncestr, timestamp, sign, callBack) => {
    window.Service.goWXPay(app_id, partnerid, prepayid, packages, noncestr, timestamp, sign, callBack);
};
/**
 * 吊起ios支付界面
 *
 * @param slv 银两余额
 * @param successCallBack 成功回調，拿到充值額度conpay, sMD:iOS支付时所需参数，不做修改，直接回传。 充值平台platform "iOS","alipay","weixinpay"
 * @param failCallBack 失敗回調，用戶選擇了取消
 */
exports.gopay = (slv, muchNeed, successCallBack, failCallBack) => {
    var callBack = (isSuccess, conpay, sMD, platform) => {
        if (isSuccess === "success") {
            successCallBack(conpay, sMD, platform);
        }
        else {
            failCallBack();
        }
    };
    window.JSVM.goPay(slv, muchNeed, callBack);
};
/**
 *
 * @param sID 后台获取到的订单号
 * @param sMD iOS支付需要的字段
 * @param successCallBack 成功回调会收到订单号sID,凭证base64编码trans 发送给服务器验证
 */
exports.goiOSPay = (sID, sMD, successCallBack, failCallBack) => {
    window.JSVM.goiosPay(sID, sMD, successCallBack, failCallBack);
};
exports.closePayView = () => {
    window.JSVM.closePayView();
};
var ImageNameType;
(function (ImageNameType) {
    ImageNameType["Wallet"] = "wallet";
})(ImageNameType = exports.ImageNameType || (exports.ImageNameType = {}));
var payPlatform;
(function (payPlatform) {
    payPlatform["apple_pay"] = "apple_pay";
    payPlatform["aliPay"] = "alipay";
    payPlatform["wxpay"] = "wxpay";
})(payPlatform = exports.payPlatform || (exports.payPlatform = {}));
});
