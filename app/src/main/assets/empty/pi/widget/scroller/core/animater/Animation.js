_$define("pi/widget/scroller/core/animater/Animation", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = require("./Base");
const index_1 = require("../../shared-utils/index");
const probe_1 = require("../enums/probe");
class Animation extends Base_1.Base {
    move(startPoint, endPoint, time, easingFn, isSlient) {
        // time is 0
        if (!time) {
            this.translate(endPoint);
            // if we change content's transformY in a tick
            // such as: 0 -> 50px -> 0
            // transitionend will not be triggered
            // so we forceupdate by reflow
            this._reflow = this.content.offsetHeight;
            // no need to dispatch move and end when slient
            if (isSlient)
                return;
            this.hooks.trigger(this.hooks.eventTypes.move, endPoint);
            this.hooks.trigger(this.hooks.eventTypes.end, endPoint);
            return;
        }
        this.animate(startPoint, endPoint, time, easingFn);
    }
    animate(startPoint, endPoint, duration, easingFn) {
        let startTime = index_1.getNow();
        let destTime = startTime + duration;
        const step = () => {
            let now = index_1.getNow();
            // js animation end
            if (now >= destTime) {
                this.translate(endPoint);
                this.hooks.trigger(this.hooks.eventTypes.move, endPoint);
                this.hooks.trigger(this.hooks.eventTypes.end, endPoint);
                return;
            }
            now = (now - startTime) / duration;
            let easing = easingFn(now);
            const newPoint = {};
            Object.keys(endPoint).forEach(key => {
                const startValue = startPoint[key];
                const endValue = endPoint[key];
                newPoint[key] = (endValue - startValue) * easing + startValue;
            });
            this.translate(newPoint);
            if (this.pending) {
                this.timer = index_1.requestAnimationFrame(step);
            }
            if (this.options.probeType === probe_1.Probe.Realtime) {
                this.hooks.trigger(this.hooks.eventTypes.move, newPoint);
            }
        };
        this.setPending(true);
        index_1.cancelAnimationFrame(this.timer);
        step();
    }
    stop() {
        // still in requestFrameAnimation
        if (this.pending) {
            this.setPending(false);
            index_1.cancelAnimationFrame(this.timer);
            const pos = this.translater.getComputedPosition();
            this.setForceStopped(true);
            if (this.hooks.trigger(this.hooks.eventTypes.beforeForceStop, pos)) {
                return;
            }
            this.hooks.trigger(this.hooks.eventTypes.forceStop, pos);
        }
    }
}
exports.Animation = Animation;
});
