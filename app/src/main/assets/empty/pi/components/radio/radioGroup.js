_$define("pi/components/radio/radioGroup", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 单选框组的逻辑处理
 */
const widget_1 = require("../../widget/widget");
class RadioGroup extends widget_1.Widget {
    constructor() {
        super();
    }
    radioChangeListener(event) {
        this.props.checkedIndex = event.checkedIndex;
        this.paint();
    }
}
exports.RadioGroup = RadioGroup;
});
