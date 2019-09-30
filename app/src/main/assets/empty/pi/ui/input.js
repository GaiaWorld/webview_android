_$define("pi/ui/input", function (require, exports, module){
"use strict";
/*
 * 输入框，要求props为{sign:string|number, text?:string, readOnly?:string, focus?:boolean, id?:string|number}, 注意text要转义引号
 */
Object.defineProperty(exports, "__esModule", { value: true });
// ============================== 导入
const event_1 = require("../widget/event");
const painter_1 = require("../widget/painter");
const widget_1 = require("../widget/widget");
// ============================== 导出
/**
 * @description 导出组件Widget类
 * @example
 */
class Input extends widget_1.Widget {
    constructor() {
        super(...arguments);
        this.lastSign = 0;
        this.lastText = undefined;
        this.readOnly = undefined;
    }
    /**
     * @description 绘制方法，
     * @param reset 表示新旧数据差异很大，不做差异计算，直接生成dom
     * @example
     */
    paint(reset) {
        if (!this.tree) {
            super.paint(reset);
        }
        if (!this.props) {
            this.props = {};
        }
        if (this.lastSign === this.props.sign) {
            return;
        }
        this.lastSign = this.props.sign;
        if (this.props.text !== undefined) {
            this.lastText = this.props.text;
            painter_1.paintCmd3(this.getInput(), 'value', this.lastText);
        }
        let r = this.props.readOnly;
        if (r === null) {
            r = undefined;
        }
        if (this.readOnly !== r) {
            this.readOnly = r;
            painter_1.paintCmd3(this.getInput(), 'readOnly', r || 'false');
        }
    }
    /**
     * @description 添加到dom树后调用，在渲染循环内调用
     * @example
     */
    attach() {
        this.props.focus && focus();
    }
    /**
     * @description 失焦
     * @example
     */
    getInput() {
        return painter_1.getRealNode(this.tree);
    }
    /**
     * @description 输入事件
     * @example
     */
    // tslint:disable:typedef
    onInput(e) {
        event_1.notify(this.parentNode, 'ev-input-text', { native: e, id: this.props.id, text: e.target.value });
    }
    /**
     * @description 失焦事件
     * @example
     */
    onBlur(e) {
        event_1.notify(this.parentNode, 'ev-input-blur', { native: e, id: this.props.id, text: e.target.value });
    }
    /**
     * @description 聚焦事件
     * @example
     */
    onFocus(e) {
        event_1.notify(this.parentNode, 'ev-input-focus', { native: e, id: this.props.id, text: e.target.value });
    }
    /**
     * @description 失焦
     * @example
     */
    blur() {
        this.getInput().blur();
    }
    /**
     * @description 聚焦
     * @example
     */
    focus() {
        this.getInput().focus();
    }
}
exports.Input = Input;
// ============================== 本地
// ============================== 立即执行
});
