_$define("pi/components/input/input", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 输入框的逻辑处理
 */
const widget_1 = require("../../widget/widget");
const event_1 = require("../../widget/event");
const painter_1 = require("../../widget/painter");
const calcTextareaHeight_1 = require("./calcTextareaHeight");
class Input extends widget_1.Widget {
    constructor() {
        super();
    }
    setProps(props, oldProps) {
        super.setProps(props, oldProps);
        let styleStr = "";
        if (props && props.style) {
            for (let key in props.style) {
                styleStr += `${key}:${props.style[key]};`;
            }
        }
        let currentValue = "";
        if (props.input) {
            currentValue = props.input;
        }
        this.state = {
            currentValue,
            hovering: false,
            focused: false,
            showClear: this.showClear.bind(this),
            styleStr
        };
        if (oldProps) {
            this.changeInputValue();
        }
    }
    change(event) {
        let currentValue = event.currentTarget.value;
        this.state.currentValue = currentValue;
        if (this.props.type === 'textarea' && this.props.autosize) {
            this.setTextareaHeight();
        }
        event_1.notify(event.node, "ev-input-change", { value: this.state.currentValue });
        this.changeInputValue();
        //this.paint();
    }
    blur(event) {
        this.state.focused = false;
        event_1.notify(event.node, "ev-input-blur", {});
        this.paint();
    }
    focus(event) {
        this.state.focused = true;
        event_1.notify(event.node, "ev-input-focus", {});
        this.paint();
    }
    mouseover() {
        this.state.hovering = true;
        this.paint();
    }
    mouseleave() {
        this.state.hovering = false;
        this.paint();
    }
    showClear() {
        if (!this.props)
            return;
        return this.props && this.props.clearable &&
            !this.props.disabled &&
            this.state.currentValue !== '' &&
            (this.state.focused || this.state.hovering);
    }
    //清空文本框
    clearClickListener(event) {
        this.state.currentValue = "";
        event_1.notify(event.node, "ev-input-clear", {});
        this.paint(true);
    }
    //设置textarea的高
    setTextareaHeight() {
        let child = this.tree.children[0].children[0];
        let childNode = painter_1.getRealNode(child);
        let result = calcTextareaHeight_1.default(childNode);
        childNode.style.height = result.height;
        childNode.style.minHeight = result.minHeight;
    }
    //设置input value
    changeInputValue() {
        let child = this.tree.children[0].children[0];
        let childNode = painter_1.getRealNode(child);
        childNode.value = this.state.currentValue;
    }
}
exports.Input = Input;
});
