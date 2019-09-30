_$define("pi/widget/scroller/core/scroller/Actions", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DirectionLock_1 = require("./DirectionLock");
const EventEmitter_1 = require("../base/EventEmitter");
const index_1 = require("../enums/index");
const index_2 = require("../../shared-utils/index");
class ScrollerActions {
    constructor(scrollBehaviorX, scrollBehaviorY, actionsHandler, animater, options) {
        this.hooks = new EventEmitter_1.EventEmitter([
            'start',
            'beforeMove',
            'scrollStart',
            'scroll',
            'beforeEnd',
            'end',
            'scrollEnd'
        ]);
        this.scrollBehaviorX = scrollBehaviorX;
        this.scrollBehaviorY = scrollBehaviorY;
        this.actionsHandler = actionsHandler;
        this.animater = animater;
        this.options = options;
        this.directionLockAction = new DirectionLock_1.DirectionLockAction(options.directionLockThreshold, options.freeScroll, options.eventPassthrough);
        this.enabled = true;
        this.bindActionsHandler();
    }
    bindActionsHandler() {
        // [mouse|touch]start event
        this.actionsHandler.hooks.on(this.actionsHandler.hooks.eventTypes.start, (e) => {
            if (!this.enabled)
                return true;
            return this.handleStart(e);
        });
        // [mouse|touch]move event
        this.actionsHandler.hooks.on(this.actionsHandler.hooks.eventTypes.move, ({ deltaX, deltaY, e }) => {
            if (!this.enabled)
                return true;
            return this.handleMove(deltaX, deltaY, e);
        });
        // [mouse|touch]end event
        this.actionsHandler.hooks.on(this.actionsHandler.hooks.eventTypes.end, (e) => {
            if (!this.enabled)
                return true;
            return this.handleEnd(e);
        });
        // click
        this.actionsHandler.hooks.on(this.actionsHandler.hooks.eventTypes.click, (e) => {
            // handle native click event
            if (this.enabled && !e._constructed) {
                this.handleClick(e);
            }
        });
    }
    handleStart(e) {
        const timestamp = index_2.getNow();
        this.moved = false;
        this.startTime = timestamp;
        this.directionLockAction.reset();
        this.scrollBehaviorX.start();
        this.scrollBehaviorY.start();
        // force stopping last transition or animation
        this.animater.stop();
        this.scrollBehaviorX.resetStartPos();
        this.scrollBehaviorY.resetStartPos();
        this.hooks.trigger(this.hooks.eventTypes.start, e);
    }
    handleMove(deltaX, deltaY, e) {
        if (this.hooks.trigger(this.hooks.eventTypes.beforeMove, e)) {
            console.log("no actions 1");
            return;
        }
        const absDistX = this.scrollBehaviorX.getAbsDist(deltaX);
        const absDistY = this.scrollBehaviorY.getAbsDist(deltaY);
        const timestamp = index_2.getNow();
        // We need to move at least momentumLimitDistance pixels
        // for the scrolling to initiate
        if (this.checkMomentum(absDistX, absDistY, timestamp)) {
            console.log("no actions 2");
            return true;
        }
        if (this.directionLockAction.checkMovingDirection(absDistX, absDistY, e)) {
            this.actionsHandler.setInitiated();
            console.log("no actions 3");
            return true;
        }
        const delta = this.directionLockAction.adjustDelta(deltaX, deltaY);
        const newX = this.scrollBehaviorX.move(delta.deltaX);
        const newY = this.scrollBehaviorY.move(delta.deltaY);
        if (!this.moved) {
            this.moved = true;
            console.log("actions");
            this.hooks.trigger(this.hooks.eventTypes.scrollStart);
        }
        this.animater.translate({
            x: newX,
            y: newY
        });
        this.dispatchScroll(timestamp);
    }
    dispatchScroll(timestamp) {
        // dispatch scroll in interval time
        if (timestamp - this.startTime > this.options.momentumLimitTime) {
            // refresh time and starting position to initiate a momentum
            this.startTime = timestamp;
            this.scrollBehaviorX.updateStartPos();
            this.scrollBehaviorY.updateStartPos();
            if (this.options.probeType === index_1.Probe.Throttle) {
                this.hooks.trigger(this.hooks.eventTypes.scroll, this.getCurrentPos());
            }
        }
        // dispatch scroll all the time
        if (this.options.probeType > index_1.Probe.Throttle) {
            this.hooks.trigger(this.hooks.eventTypes.scroll, this.getCurrentPos());
        }
    }
    checkMomentum(absDistX, absDistY, timestamp) {
        return (timestamp - this.endTime > this.options.momentumLimitTime &&
            absDistY < this.options.momentumLimitDistance &&
            absDistX < this.options.momentumLimitDistance);
    }
    handleEnd(e) {
        if (this.hooks.trigger(this.hooks.eventTypes.beforeEnd, e)) {
            return;
        }
        const currentPos = this.getCurrentPos();
        this.scrollBehaviorX.updateDirection();
        this.scrollBehaviorY.updateDirection();
        if (this.hooks.trigger(this.hooks.eventTypes.end, e, currentPos)) {
            return true;
        }
        this.animater.translate(currentPos);
        this.endTime = index_2.getNow();
        const duration = this.endTime - this.startTime;
        this.hooks.trigger(this.hooks.eventTypes.scrollEnd, currentPos, duration);
    }
    handleClick(e) {
        if (!index_2.preventDefaultExceptionFn(e.target, this.options.preventDefaultException)) {
            e.preventDefault();
            e.stopPropagation();
        }
    }
    getCurrentPos() {
        return {
            x: this.scrollBehaviorX.getCurrentPos(),
            y: this.scrollBehaviorY.getCurrentPos()
        };
    }
    refresh() {
        this.endTime = 0;
    }
    destroy() {
        this.hooks.destroy();
    }
}
exports.ScrollerActions = ScrollerActions;
});
