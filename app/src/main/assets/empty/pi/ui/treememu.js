_$define("pi/ui/treememu", function (require, exports, module){
"use strict";
/*
 * 树形菜单，要求props为{tag:"btn$", show:{select:true, cfg:{} }, arr:[]}，嵌套使用，子菜单的props为父菜单的引用
 */
Object.defineProperty(exports, "__esModule", { value: true });
const event_1 = require("../widget/event");
const widget_1 = require("../widget/widget");
// ============================== 导出
/**
 * @description 导出组件Widget类
 * @example
 */
class TreeMemu extends widget_1.Widget {
    /**
     * @description 设置属性，默认外部传入的props是完整的props，重载可改变行为
     * @example
     */
    setProps(props, oldProps) {
        this.props = props;
        if (Number.isInteger(props)) {
            this.props = this.parentNode.widget.props.arr[props];
        }
    }
    /**
     * @description 按钮事件
     * @example
     */
    // tslint:disable-next-line:typedef
    change(e) {
        if (this.props.arr) {
            this.props.show.select = !this.props.show.select;
            return this.paint();
        }
        event_1.notify(this.parentNode, 'ev-tm-open', e);
    }
}
exports.TreeMemu = TreeMemu;
// ============================== 本地
// ============================== 立即执行
});
