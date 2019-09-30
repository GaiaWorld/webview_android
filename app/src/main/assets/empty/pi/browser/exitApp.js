_$define("pi/browser/exitApp", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 最终返回
 */
// ============================== 导入
const native_1 = require("./native");
// ============================== 导出
class ExitApp extends native_1.NativeObject {
    /**
     * 退出APP，关闭应用
     * @param param
     */
    exitApplication(param) {
        this.call('confirmExit', param);
    }
    /**
     * 返回桌面。将应用退到后台
     * @param param
     */
    ToHome(param) {
        this.call('backToHome', param);
    }
}
exports.ExitApp = ExitApp;
// ============================== 本地
/**
 * 底层接口和参数的声明
 */
native_1.registerSign(ExitApp, {
    confirmExit: [],
    backToHome: []
});
});
