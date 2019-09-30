_$define("pi/components/input_autocomplete/input_autocomplete", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 带输入提示输入框的逻辑处理
 */
const widget_1 = require("../../widget/widget");
const event_1 = require("../../widget/event");
class InputAutocomplete extends widget_1.Widget {
    constructor() {
        super();
    }
    setProps(props, oldProps) {
        super.setProps(props, oldProps);
        this.state = {
            currentValue: "",
            showTips: false,
            showTipList: props.tipList
        };
    }
    autoCompleteItemClickListener(event, text) {
        this.state.currentValue = text;
        this.state.showTips = false;
        event_1.notify(event.node, "ev-input-select", { value: this.state.currentValue });
        this.paint(true);
    }
    focus() {
        this.state.showTips = true;
        this.state.showTipList = this.props.tipList.filter((v) => {
            return v.value.indexOf(this.state.currentValue) !== -1;
        });
        this.paint();
    }
    blur(event) {
        this.state.showTips = false;
        this.paint();
    }
    change(event) {
        let currentValue = event.value;
        this.state.currentValue = currentValue.trim();
        if (this.state.currentValue.length === 0) {
            this.state.showTipList = this.props.tipList;
            this.paint();
            return;
        }
        this.state.showTipList = this.props.tipList.filter((v) => {
            return v.value.indexOf(currentValue) !== -1;
        });
        this.paint();
    }
}
exports.InputAutocomplete = InputAutocomplete;
});
