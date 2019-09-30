_$define("pi/ui/share", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 */
const Android = require("../browser/android");
const widget_1 = require("../widget/widget");
class Share extends widget_1.Widget {
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
    // 分享到朋友圈
    shareTargetTimeLine() {
        Android.shareToLine(this.props.info);
        return true;
    }
    // 分享给朋友
    shareTargetSession() {
        Android.shareToFriend(this.props.info);
        return true;
    }
    // 分享给QQ
    shareQQ() {
        Android.shareToQQ(this.props.info);
        return true;
    }
    // 分享到微博
    shareWB() {
        Android.shareToWB(this.props.info);
        return true;
    }
}
exports.Share = Share;
});
