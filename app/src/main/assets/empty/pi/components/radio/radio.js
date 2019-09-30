_$define("pi/components/radio/radio", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 单选框的逻辑处理
 */
const widget_1 = require("../../widget/widget");
const event_1 = require("../../widget/event");
class Radio extends widget_1.Widget {
    constructor() {
        super();
    }
    clickListenter(event) {
        if (this.props.disabled)
            return;
        if (this.props.labelIndex === this.props.checkedIndex)
            return;
        this.props.checkedIndex = this.props.labelIndex;
        event_1.notify(event.node, 'ev-radio-change', { checkedIndex: this.props.checkedIndex });
        this.paint();
    }
}
exports.Radio = Radio;
});
