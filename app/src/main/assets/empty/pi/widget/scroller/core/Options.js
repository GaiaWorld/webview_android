_$define("pi/widget/scroller/core/Options", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../shared-utils/index");
const index_2 = require("./enums/index");
class Options {
    constructor() {
        this.startX = 0;
        this.startY = 0;
        this.scrollX = false;
        this.scrollY = true;
        this.freeScroll = false;
        this.directionLockThreshold = 5;
        this.eventPassthrough = index_2.EventPassthrough.None;
        this.click = false;
        this.dblclick = false;
        this.tap = '';
        this.bounce = {
            top: true,
            bottom: true,
            left: true,
            right: true
        };
        this.bounceTime = 800;
        this.momentum = true;
        this.momentumLimitTime = 300;
        this.momentumLimitDistance = 15;
        this.swipeTime = 2500;
        this.swipeBounceTime = 500;
        this.deceleration = 0.0015;
        this.flickLimitTime = 200;
        this.flickLimitDistance = 100;
        this.resizePolling = 60;
        this.probeType = index_2.Probe.Default;
        this.stopPropagation = false;
        this.preventDefault = true;
        this.preventDefaultException = {
            tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|AUDIO)$/
        };
        this.tagException = {
            tagName: /^TEXTAREA$/
        };
        this.HWCompositing = true;
        this.useTransition = true;
        this.bindToWrapper = false;
        this.disableMouse = index_1.hasTouch;
        this.disableTouch = !index_1.hasTouch;
        this.autoBlur = true;
    }
    merge(options) {
        if (!options)
            return this;
        for (let key in options) {
            this[key] = options[key];
        }
        return this;
    }
    process() {
        this.translateZ =
            this.HWCompositing && index_1.hasPerspective ? ' translateZ(0)' : '';
        this.useTransition = this.useTransition && index_1.hasTransition;
        this.preventDefault = !this.eventPassthrough && this.preventDefault;
        // If you want eventPassthrough I have to lock one of the axes
        this.scrollX =
            this.eventPassthrough === index_2.EventPassthrough.Horizontal
                ? false
                : this.scrollX;
        this.scrollY =
            this.eventPassthrough === index_2.EventPassthrough.Vertical ? false : this.scrollY;
        // With eventPassthrough we also need lockDirection mechanism
        this.freeScroll = this.freeScroll && !this.eventPassthrough;
        // force true when freeScroll is true
        this.scrollX = this.freeScroll ? true : this.scrollX;
        this.scrollY = this.freeScroll ? true : this.scrollY;
        this.directionLockThreshold = this.eventPassthrough
            ? 0
            : this.directionLockThreshold;
        return this;
    }
}
exports.Options = Options;
});
