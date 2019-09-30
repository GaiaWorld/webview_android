_$define("pi/ui/html", function (require, exports, module){
"use strict";
/*
 * 可以使用html语法来设置文字
 */
Object.defineProperty(exports, "__esModule", { value: true });
// ============================== 导入
const widget_1 = require("../widget/widget");
// ============================== 导出
/**
 * @description 导出组件Widget类
 * @example
 */
class InnerHTML extends widget_1.Widget {
    firstPaint() {
        this.tree.link.innerHTML = this.props;
    }
    afterUpdate() {
        this.tree.link.innerHTML = this.props;
    }
}
exports.InnerHTML = InnerHTML;
// ============================== 本地
// ============================== 立即执行
});
