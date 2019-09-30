_$define("pi/components/message/messagebox", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 确认提示框
 */
const widget_1 = require("../../widget/widget");
class MessageBox extends widget_1.Widget {
    constructor() {
        super();
    }
    create() {
        super.create();
        this.config = { value: { group: "top" } };
    }
    setProps(props, oldProps) {
        super.setProps(props, oldProps);
        this.state = { isShow: false, input: "" };
        this.init();
    }
    /**
     * 点击确认
     */
    doClickSure() {
        this.ok && this.ok(this.state.input);
    }
    /**
     * 点击取消
     */
    doClickCancel() {
        this.cancel && this.cancel();
    }
    /**
     * 提示框数据改变
     */
    inputChange(e) {
        this.state.input = e.value;
    }
    init() {
        setTimeout(() => {
            this.state.isShow = true;
            this.paint();
        }, 100);
    }
}
exports.MessageBox = MessageBox;
});
