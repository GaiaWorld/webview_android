_$define("pi/browser/wxlogin", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ============================== 导入
const native_1 = require("./native");
// ============================== 导出
/**
 * 微信登陆
 */
class WeChatLogin extends native_1.NativeObject {
    /**
     * regToWx 将APP注册到微信 建议在程序开始时使用
     *
     * @param app_id : 微信开发平台的appID
     *
     */
    static regToWx(app_id) {
        wxlogin.call("regToWx", { app_id });
    }
    /**
     * getCodeFormWX 从微信APP获取临时凭证Code
     *
     * @param scope 授权作用域，默认传值: "snsapi_userinfo":获取用户基本信息
     * @param state 用于保存请求和回调的状态
     * @param success 回调
     * @param ruselt 参数说明  0：发送成功  -2：发送取消  -3：发送拒绝  -4：不支持错误 其他：发送返回 -7: 用户没有安装微信
     * @param code 临时凭证一个code只能获取一次token
     *
     */
    static getCodeFromWX(scope, state, success) {
        wxlogin.call("getCodeFromWX", { scope, state, success });
    }
    /**
     * goWXPay 微信支付
     *
     * @param app_id ：微信开发平台的appID
     * @param partnerid : 微信支付分配的商户号
     * @param prepayid : 微信返回的支付会话ID
     * @param packages : 扩展字段，暂时填写 "Sign=WXPay" 固定值
     * @param noncestr : 随机字符串
     * @param timestamp ：时间戳
     * @param sign ：签名
     * @param success : 成功回调
     * @param result ：0：充值成功， -1： 充值错误（参数异常）  -2： 用户选择取消 -7： 用户没有安装微信
     */
    static goWXPay(app_id, partnerid, prepayid, packages, noncestr, timestamp, sign, success) {
        wxlogin.call("goWXPay", { app_id, partnerid, prepayid, packages, noncestr, timestamp, sign, success });
    }
}
exports.WeChatLogin = WeChatLogin;
/**
 * 底层接口和参数的声明
 */
native_1.registerSign(WeChatLogin, {
    regToWx: [
        {
            name: 'app_id',
            type: native_1.ParamType.String
        }
    ],
    getCodeFromWX: [
        {
            name: 'scope',
            type: native_1.ParamType.String
        }, {
            name: 'state',
            type: native_1.ParamType.String
        }
    ],
    goWXPay: [
        {
            name: 'app_id',
            type: native_1.ParamType.String
        }, {
            name: 'partnerid',
            type: native_1.ParamType.String
        }, {
            name: 'prepayid',
            type: native_1.ParamType.String
        }, {
            name: 'packages',
            type: native_1.ParamType.String
        }, {
            name: 'noncestr',
            type: native_1.ParamType.String
        }, {
            name: 'timestamp',
            type: native_1.ParamType.String
        }, {
            name: 'sign',
            type: native_1.ParamType.String
        },
    ]
});
const wxlogin = new WeChatLogin();
wxlogin.init();
});
