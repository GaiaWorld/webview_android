_$define("pi/components/message/notification", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 确认提示框
 */
const widget_1 = require("../../widget/widget");
class Notification extends widget_1.Widget {
    constructor() {
        super();
        this.timerRef = 0;
    }
    create() {
        super.create();
        this.config = { value: { group: "download" } };
    }
    setProps(props, oldProps) {
        super.setProps(props, oldProps);
        this.init();
    }
    /**
     * 点击确认
     */
    doClose() {
        if (this.timerRef) {
            clearTimeout(this.timerRef);
            this.timerRef = 0;
        }
        this.ok && this.ok();
    }
    init() {
        if (!this.props.manuallyClose) {
            this.timerRef = setTimeout(() => {
                this.timerRef = 0;
                this.doClose();
            }, 3000);
        }
    }
}
exports.Notification = Notification;
});
