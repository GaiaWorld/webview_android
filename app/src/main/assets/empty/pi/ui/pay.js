_$define("pi/ui/pay", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 */
const Android = require("../browser/android");
const widget_1 = require("../widget/widget");
class Pay extends widget_1.Widget {
    constructor() {
        super();
    }
    /**
     * @description 设置属性，默认外部传入的props是完整的props，重载可改变行为
     * @example
     */
    setProps(props, oldProps) {
        this.props = props;
    }
    // 支付宝支付
    payZhiFuBao() {
        Android.payZhiFuBao();
        return true;
    }
}
exports.Pay = Pay;
});
