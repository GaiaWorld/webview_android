_$define("pi/widget/widget_gui", function (require, exports, module){
"use strict";
// 模块描述
/*
负责显示逻辑，是数据和原始dom间的桥梁
组件支持嵌套，并且tpl中的自定义元素支持相对路径。
组件名的规则：可以使用英文小写字母加'_'和''。 '-'表示路径分隔，'$'只能在最后，1个'$'表示本目录开始查找，N个'$'表示上溯N-1个父目录开始查找。如果没有'$'表示从根目录下开始查找
举例：
<role_show$ style=""></role_show$>表示本目录下的role_show组件，
<role_show$$ style=""> </role_show$$>表示父目录下的role_show组件，
<role_show-zb_show$$ style=""></role_show-zb_show$$>表示父目录下role_show目录下的zb_show组件
<app-base-btn style=""></app-base-btn>表示根目录开始，app/base目录下的btn组件
*/
// tslint:disable-next-line:no-reference
/// <reference path="../render3d/babylon/babylon.d.ts"/>
Object.defineProperty(exports, "__esModule", { value: true });
const gui_creator_1 = require("../render3d/babylon/gui_creator");
const widget_1 = require("./widget");
// ============================== 导出
/**
 * @description 组件
 * @example
 * 组件，包含样式和模板的js类,
 * 注意区分 widget实例和widget节点
 * widget节点的link属性指向了widget实例
 */
class WidgetGUI extends widget_1.Widget {
    /**
     * 创建后调用，一般在渲染循环外调用
     */
    create() {
        // 屏蔽 tpl 的使用
        this.tpl = undefined;
        this.forelet && this.forelet.addWidget(this);
    }
    /**
     * 设置属性，默认外部传入的props是完整的props，重载可改变行为
     * @param props 新数据
     * @param oldProps 老数据
     */
    setProps(props, oldProps) {
        this.props = props;
        if (props !== undefined && props.GUI) {
            this._createGUI();
            this.control && gui_creator_1.GUICreator.getUIRoot().addControl(this.control);
        }
        this.props.GUI = undefined;
    }
    /**
     * 第一次计算后调用，此时创建了真实的dom，但并没有加入到dom树上，一般在渲染循环外调用
     */
    firstPaint() {
        // this.forelet && this.forelet.eventWidget(this, 'firstPaint');
    }
    /**
     * 销毁时调用，一般在渲染循环外调用
     */
    destroy() {
        // 销毁GUI节点
        // if (this.control !== undefined) {
        //     this.control.dispose();
        //     this.control = undefined;
        // }
        const control = this.control;
        this.control = undefined;
        this.children.length = 0;
        gui_creator_1.GUICreator.disposeWithTree(control);
        this.forelet && this.forelet.removeWidget(this);
        if (!this.tpl) {
            return false;
        }
        this.tpl = undefined;
        if (this.resTab) {
            this.resTab.timeout = this.resTimeout;
            this.resTab.release();
        }
        return true;
    }
    /**
     * 绘制方法，
     * @param reset 表示新旧数据差异很大，不做差异计算，直接生成dom
     */
    paint(reset) {
        // paintWidget(this, reset);
        this._guiUpdate();
    }
    _createGUI() {
        this.control === undefined && this.createGUI && this.createGUI();
    }
    _guiUpdate() {
        this.control && this.guiUpdate && this.guiUpdate();
    }
}
exports.WidgetGUI = WidgetGUI;
});
