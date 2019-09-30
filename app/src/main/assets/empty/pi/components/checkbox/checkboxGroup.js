_$define("pi/components/checkbox/checkboxGroup", function (require, exports, module){
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
    setProps(props, oldProps) {
        super.setProps(props, oldProps);
        this.state = {};
        this.checkChooseAllType();
    }
    doAllClick(event) {
        if (!this.props.chooseAll)
            return;
        let newType = "true";
        if (this.state.chooseAllType === "true")
            newType = "false";
        this.props.list = this.props.list.map(v => {
            if (v.type === "disabled")
                return v;
            v.type = newType;
            return v;
        });
        event_1.notify(event.node, 'ev-checkbox-all-click', { oldType: this.state.chooseAllType, newType: newType });
        this.state.chooseAllType = newType;
        this.paint();
    }
    doEachClick(event) {
        if (event.index === undefined)
            return;
        let oldChooseLen = this.props.list.filter(v => v.type === "true").length;
        this.props.list[event.index].type = event.newType;
        if (this.props.min !== undefined || this.props.max !== undefined) {
            let chooseLen = this.props.list.filter(v => v.type === "true").length;
            if ((this.props.min !== undefined && chooseLen < this.props.min && chooseLen < oldChooseLen)
                || (this.props.max !== undefined && chooseLen > this.props.max && chooseLen > oldChooseLen)) {
                this.props.list[event.index].type = event.oldType;
                if (this.props.list[event.index].reset) {
                    this.props.list[event.index].reset++;
                }
                else {
                    this.props.list[event.index].reset = 1;
                }
            }
        }
        this.checkChooseAllType();
        this.paint();
    }
    checkChooseAllType() {
        if (!this.props.chooseAll)
            return;
        let ischooseNone = this.props.list.some((v) => v.type === "false");
        let isChoose = this.props.list.some(v => v.type === "true");
        if (!isChoose) {
            this.state.chooseAllType = "false";
        }
        else if (ischooseNone) {
            this.state.chooseAllType = "indeterminate";
        }
        else {
            this.state.chooseAllType = "true";
        }
    }
}
exports.Checkbox = Checkbox;
});
