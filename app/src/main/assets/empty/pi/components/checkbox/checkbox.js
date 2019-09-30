_$define("pi/components/checkbox/checkbox", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 选择框的逻辑处理
 */
const widget_1 = require("../../widget/widget");
const event_1 = require("../../widget/event");
class Checkbox extends widget_1.Widget {
    constructor() {
        super();
    }
    doClick(event) {
        let oldType = this.props.type;
        if (oldType === "disabled")
            return;
        let newType = "";
        switch (oldType) {
            case "true":
                newType = "false";
                break;
            case "false":
                newType = "true";
                break;
            case "indeterminate":
                newType = "true";
                break;
        }
        this.props.type = newType;
        event_1.notify(event.node, 'ev-checkbox-click', { oldType: oldType, newType: newType, index: this.props.index });
        this.paint();
    }
}
exports.Checkbox = Checkbox;
});
