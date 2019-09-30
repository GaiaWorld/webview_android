_$define("pi/util/lang", function (require, exports, module){
"use strict";
/**
 * 多语言模块
 */
Object.defineProperty(exports, "__esModule", { value: true });
// ============================== 导出
/**
 * @description 多语言字符串，必须由UI组件使用
 * @example
 */
class LangStr {
}
exports.LangStr = LangStr;
/**
 * @description 设置当前的显示语言
 * @example
 */
exports.setLang = (str) => {
    curLang = str;
    for (const f of langListeners) {
        f(str);
    }
};
/**
 * @description 获得当前的显示语言
 * @example
 */
exports.getLang = () => {
    return curLang;
};
/**
 * @description 添加语言改变监听器
 * @example
 */
exports.addLangListener = (cb) => {
    langListeners.push(cb);
};
// ============================== 本地
// 当前语言 cn en fr
let curLang = 'en';
// 语言改变监听器
const langListeners = [];
});
