_$define("pi/components/tabs/tabs", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 确认提示框
 */
const event_1 = require("../../widget/event");
const widget_1 = require("../../widget/widget");
class Tabs extends widget_1.Widget {
    constructor() {
        super();
    }
    setProps(props, oldProps) {
        super.setProps(props, oldProps);
        this.props.activeNum = this.props.activeNum || 0;
        this.props.type = this.props.type || 'normal';
        this.props.position = this.props.position || 'top';
        this.init();
    }
    doClick(event, value) {
        this.props.activeNum = value;
        this.paint();
        event_1.notify(event.node, 'ev-tabs-change', { value: value });
    }
    init() {
        //
    }
}
exports.Tabs = Tabs;
});
