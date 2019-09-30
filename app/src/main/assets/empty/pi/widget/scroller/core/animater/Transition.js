_$define("pi/widget/scroller/core/animater/Transition", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../shared-utils/index");
const probe_1 = require("../enums/probe");
const Base_1 = require("./Base");
class Transition extends Base_1.Base {
    startProbe() {
        const probe = () => {
            let pos = this.translater.getComputedPosition();
            this.hooks.trigger(this.hooks.eventTypes.move, pos);
            // excute when transition ends
            if (!this.pending) {
                this.hooks.trigger(this.hooks.eventTypes.end, pos);
                return;
            }
            this.timer = index_1.requestAnimationFrame(probe);
        };
        index_1.cancelAnimationFrame(this.timer);
        this.timer = index_1.requestAnimationFrame(probe);
    }
    transitionTime(time = 0) {
        this.style[index_1.style.transitionDuration] = time + 'ms';
        this.hooks.trigger(this.hooks.eventTypes.time, time);
    }
    transitionTimingFunction(easing) {
        this.style[index_1.style.transitionTimingFunction] = easing;
        this.hooks.trigger(this.hooks.eventTypes.timeFunction, easing);
    }
    move(startPoint, endPoint, time, easingFn, isSlient) {
        this.setPending(time > 0 && (startPoint.x !== endPoint.x || startPoint.y !== endPoint.y));
        this.transitionTimingFunction(easingFn);
        this.transitionTime(time);
        this.translate(endPoint);
        if (time && this.options.probeType === probe_1.Probe.Realtime) {
            this.startProbe();
        }
        // if we change content's transformY in a tick
        // such as: 0 -> 50px -> 0
        // transitionend will not be triggered
        // so we forceupdate by reflow
        if (!time) {
            this._reflow = this.content.offsetHeight;
        }
        // no need to dispatch move and end when slient
        if (!time && !isSlient) {
            this.hooks.trigger(this.hooks.eventTypes.move, endPoint);
            this.hooks.trigger(this.hooks.eventTypes.end, endPoint);
        }
    }
    stop() {
        // still in transition
        if (this.pending) {
            this.setPending(false);
            index_1.cancelAnimationFrame(this.timer);
            const { x, y } = this.translater.getComputedPosition();
            this.transitionTime();
            this.translate({ x, y });
            this.setForceStopped(true);
            if (this.hooks.trigger(this.hooks.eventTypes.beforeForceStop, { x, y })) {
                return;
            }
            this.hooks.trigger(this.hooks.eventTypes.forceStop, { x, y });
        }
    }
}
exports.Transition = Transition;
});
