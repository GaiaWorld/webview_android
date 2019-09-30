_$define("pi/ui/login", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 */
const Android = require("../browser/android");
const widget_1 = require("../widget/widget");
// tslint:disable-next-line:class-name
class login extends widget_1.Widget {
    constructor() {
        super();
    }
    // 登录微信
    loginWX() {
        Android.loginWX();
        return true;
    }
    // 登录QQ
    loginQQ() {
        Android.loginQQ();
        return true;
    }
    // 微博登录
    loginWeiBo() {
        Android.loginWB();
    }
}
exports.login = login;
});
