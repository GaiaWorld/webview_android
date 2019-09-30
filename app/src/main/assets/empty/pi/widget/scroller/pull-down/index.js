_$define("pi/widget/scroller/pull-down/index", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const direction_1 = require("../core/enums/direction");
const probe_1 = require("../core/enums/probe");
const ease_1 = require("../shared-utils/ease");
const propertiesConfig_1 = require("./propertiesConfig");
class PullDown {
    constructor(scroll) {
        this.scroll = scroll;
        this.pulling = false;
        if (scroll.options.pullDownRefresh) {
            this._watch();
        }
        this.scroll.registerType(['pullingDown']);
        this.scroll.proxy(propertiesConfig_1.default);
    }
    _watch() {
        // 需要设置 probe = 3 吗？
        // must watch scroll in real time
        this.scroll.options.probeType = probe_1.Probe.Realtime;
        this.scroll.scroller.hooks.on('end', this._checkPullDown, this);
    }
    _checkPullDown() {
        if (!this.scroll.options.pullDownRefresh) {
            return;
        }
        const { threshold = 90, stop = 40 } = this.scroll.options
            .pullDownRefresh;
        // check if a real pull down action
        if (this.scroll.directionY !== direction_1.Direction.Negative ||
            this.scroll.y < threshold) {
            return false;
        }
        if (!this.pulling) {
            this.pulling = true;
            this.scroll.trigger('pullingDown');
            this.originalMinScrollY = this.scroll.minScrollY;
            this.scroll.minScrollY = stop;
        }
        this.scroll.scrollTo(this.scroll.x, stop, this.scroll.options.bounceTime, ease_1.ease.bounce);
        return this.pulling;
    }
    finish() {
        this.pulling = false;
        this.scroll.minScrollY = this.originalMinScrollY;
        this.scroll.resetPosition(this.scroll.options.bounceTime, ease_1.ease.bounce);
    }
    open(config = true) {
        this.scroll.options.pullDownRefresh = config;
        this._watch();
    }
    close() {
        this.scroll.options.pullDownRefresh = false;
    }
    autoPull() {
        const { threshold = 90, stop = 40 } = this.scroll.options
            .pullDownRefresh;
        if (this.pulling) {
            return;
        }
        this.pulling = true;
        this.originalMinScrollY = this.scroll.minScrollY;
        this.scroll.minScrollY = threshold;
        this.scroll.scrollTo(this.scroll.x, threshold);
        this.scroll.trigger('pullingDown');
        this.scroll.scrollTo(this.scroll.x, stop, this.scroll.options.bounceTime, ease_1.ease.bounce);
    }
}
PullDown.pluginName = 'pullDownRefresh';
exports.PullDown = PullDown;
});
