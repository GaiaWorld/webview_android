_$define("app/view/main", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 入口文件
 */
const util_1 = require("../../pi/widget/util");
const root_1 = require("../../pi/ui/root");
exports.run = (cb) => {
    util_1.addWidget(document.body, 'pi-ui-root');
    // 打开首页面
    root_1.popNew('app-view-home');
    // 解决进入时闪一下问题
    setTimeout(() => {
        if (cb)
            cb();
    }, 100);
};
});
