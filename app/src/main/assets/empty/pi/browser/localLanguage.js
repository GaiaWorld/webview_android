_$define("pi/browser/localLanguage", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 语言设置
 */
// ============================== 导入
const native_1 = require("./native");
// ============================== 导出
class LocalLanguageMgr extends native_1.NativeObject {
    /**
     * 获取当前APP使用的语言
     * @param param
     */
    getAppLan(param) {
        this.call('getAppLanguage', param);
    }
    /**
     * 设置当前APP使用的语言
     * @param param
     */
    setAppLan(param) {
        this.call('setAppLanguage', param);
    }
    /**
     * 获取手机系统的语言
     * @param param
     */
    getSysLan(param) {
        this.call('getSystemLanguage', param);
    }
}
exports.LocalLanguageMgr = LocalLanguageMgr;
/**
 * 本地语言类型枚举
 *   + zh_Hans：简体中文
 *   + zh_Hant：繁体中文
 */
var appLanguageList;
(function (appLanguageList) {
    appLanguageList[appLanguageList["zh_Hans"] = 2] = "zh_Hans";
    appLanguageList[appLanguageList["zh_Hant"] = 3] = "zh_Hant";
})(appLanguageList = exports.appLanguageList || (exports.appLanguageList = {}));
// ============================== 本地
/**
 * 底层接口和参数的声明
 */
native_1.registerSign(LocalLanguageMgr, {
    getAppLanguage: [],
    setAppLanguage: [
        {
            param: 'language',
            type: native_1.ParamType.Number
        }
    ],
    getSystemLanguage: []
});
});
