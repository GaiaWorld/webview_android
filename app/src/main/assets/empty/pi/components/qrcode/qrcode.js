_$define("pi/components/qrcode/qrcode", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 二维码组件
 */
const widget_1 = require("../../widget/widget");
const qrcode_src_1 = require("./qrcode_src");
const painter_1 = require("../../widget/painter");
class Qrcode extends widget_1.Widget {
    constructor() {
        super();
    }
    firstPaint() {
        let wrapper = painter_1.getRealNode(this.tree);
        console.log(this.tree, wrapper);
        var qrcode = new qrcode_src_1.QrcodeSrc(wrapper.children[0], {
            width: this.props.size,
            height: this.props.size
        });
        qrcode.makeCode(this.props.value);
    }
}
exports.Qrcode = Qrcode;
});
