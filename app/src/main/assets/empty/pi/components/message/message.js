_$define("pi/components/message/message", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 消息框
 */
const widget_1 = require("../../widget/widget");
class Message extends widget_1.Widget {
    constructor() {
        super();
    }
    create() {
        super.create();
        this.config = { value: { group: "pop_tip" } };
    }
    setProps(props, oldProps) {
        super.setProps(props, oldProps);
        this.state = { isShow: false };
        this.init();
    }
    init() {
        setTimeout(() => {
            this.state.isShow = true;
            this.paint();
        }, 100);
        setTimeout(() => {
            this.state.isShow = false;
            this.paint();
            setTimeout(() => {
                this.ok && this.ok();
            }, 300);
        }, 3000);
    }
}
exports.Message = Message;
});
