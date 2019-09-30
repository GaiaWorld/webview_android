_$define("pi/components/switch/switch", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 开关的逻辑处理
 */
const widget_1 = require("../../widget/widget");
const event_1 = require("../../widget/event");
class Switch extends widget_1.Widget {
    constructor() {
        super();
    }
    doClick(event) {
        let oldType = !!this.props.type;
        let newType = !oldType;
        this.props.type = newType;
        event_1.notify(event.node, 'ev-switch-click', { oldType: oldType, newType: newType });
        this.paint();
    }
}
exports.Switch = Switch;
});
