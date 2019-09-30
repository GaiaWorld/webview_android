_$define("pi/widget/scroller/core/scroller/Behavior", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../shared-utils/index");
const direction_1 = require("../enums/direction");
const EventEmitter_1 = require("../base/EventEmitter");
class Behavior {
    constructor(wrapper, options) {
        this.wrapper = wrapper;
        this.options = options;
        this.hooks = new EventEmitter_1.EventEmitter(['momentum', 'end']);
        this.content = this.wrapper.children[0];
        this.currentPos = 0;
        this.startPos = 0;
    }
    start() {
        this.direction = direction_1.Direction.Default;
        this.movingDirection = direction_1.Direction.Default;
        this.dist = 0;
    }
    move(delta) {
        delta = this.hasScroll ? delta : 0;
        this.movingDirection =
            delta > 0
                ? direction_1.Direction.Negative
                : delta < 0
                    ? direction_1.Direction.Positive
                    : direction_1.Direction.Default;
        let newPos = this.currentPos + delta;
        // Slow down or stop if outside of the boundaries
        if (newPos > this.minScrollPos || newPos < this.maxScrollPos) {
            if ((newPos > this.minScrollPos && this.options.bounces[0]) ||
                (newPos < this.maxScrollPos && this.options.bounces[1])) {
                newPos = this.currentPos + delta / 3;
            }
            else {
                newPos =
                    newPos > this.minScrollPos ? this.minScrollPos : this.maxScrollPos;
            }
        }
        return newPos;
    }
    end(duration) {
        let momentumInfo = {
            duration: 0
        };
        const absDist = Math.abs(this.currentPos - this.startPos);
        // start momentum animation if needed
        if (this.options.momentum &&
            duration < this.options.momentumLimitTime &&
            absDist > this.options.momentumLimitDistance) {
            const wrapperSize = (this.direction === direction_1.Direction.Negative && this.options.bounces[0]) ||
                (this.direction === direction_1.Direction.Positive && this.options.bounces[1])
                ? this.wrapperSize
                : 0;
            momentumInfo = this.hasScroll
                ? this.momentum(this.currentPos, this.startPos, duration, this.maxScrollPos, this.minScrollPos, wrapperSize, this.options)
                : { destination: this.currentPos, duration: 0 };
        }
        else {
            this.hooks.trigger(this.hooks.eventTypes.end, momentumInfo);
        }
        return momentumInfo;
    }
    momentum(current, start, time, lowerMargin, upperMargin, wrapperSize, options = this.options) {
        const distance = current - start;
        const speed = Math.abs(distance) / time;
        const { deceleration, swipeBounceTime, swipeTime } = options;
        const momentumData = {
            destination: current + (speed / deceleration) * (distance < 0 ? -1 : 1),
            duration: swipeTime,
            rate: 15
        };
        this.hooks.trigger(this.hooks.eventTypes.momentum, momentumData, distance);
        if (momentumData.destination < lowerMargin) {
            momentumData.destination = wrapperSize
                ? Math.max(lowerMargin - wrapperSize / 4, lowerMargin - (wrapperSize / momentumData.rate) * speed)
                : lowerMargin;
            momentumData.duration = swipeBounceTime;
        }
        else if (momentumData.destination > upperMargin) {
            momentumData.destination = wrapperSize
                ? Math.min(upperMargin + wrapperSize / 4, upperMargin + (wrapperSize / momentumData.rate) * speed)
                : upperMargin;
            momentumData.duration = swipeBounceTime;
        }
        momentumData.destination = Math.round(momentumData.destination);
        return momentumData;
    }
    updateDirection() {
        const absDist = Math.round(this.currentPos) - this.absStartPos;
        this.direction =
            absDist > 0
                ? direction_1.Direction.Negative
                : absDist < 0
                    ? direction_1.Direction.Positive
                    : direction_1.Direction.Default;
    }
    refresh() {
        const { size, position } = this.options.rect;
        const isWrapperStatic = window.getComputedStyle(this.wrapper, null).position === 'static';
        const wrapperRect = index_1.getRect(this.wrapper);
        this.wrapperSize = wrapperRect[size];
        const contentRect = index_1.getRect(this.content);
        this.contentSize = contentRect[size];
        this.relativeOffset = contentRect[position];
        if (isWrapperStatic) {
            this.relativeOffset -= wrapperRect[position];
        }
        this.minScrollPos = 0;
        this.maxScrollPos = this.wrapperSize - this.contentSize;
        if (this.maxScrollPos < 0) {
            this.maxScrollPos -= this.relativeOffset;
            this.minScrollPos = -this.relativeOffset;
        }
        this.hasScroll =
            this.options.scrollable && this.maxScrollPos < this.minScrollPos;
        if (!this.hasScroll) {
            this.maxScrollPos = this.minScrollPos;
            this.contentSize = this.wrapperSize;
        }
        this.direction = 0;
    }
    updatePosition(pos) {
        this.currentPos = pos;
    }
    getCurrentPos() {
        return Math.round(this.currentPos);
    }
    checkInBoundary() {
        const position = this.adjustPosition(this.currentPos);
        const inBoundary = position === this.getCurrentPos();
        return {
            position,
            inBoundary
        };
    }
    // adjust position when out of boundary
    adjustPosition(pos) {
        let roundPos = Math.round(pos);
        if (!this.hasScroll || roundPos > this.minScrollPos) {
            roundPos = this.minScrollPos;
        }
        else if (roundPos < this.maxScrollPos) {
            roundPos = this.maxScrollPos;
        }
        return roundPos;
    }
    updateStartPos() {
        this.startPos = this.currentPos;
    }
    updateAbsStartPos() {
        this.absStartPos = this.currentPos;
    }
    resetStartPos() {
        this.updateStartPos();
        this.updateAbsStartPos();
    }
    getAbsDist(delta) {
        this.dist += delta;
        return Math.abs(this.dist);
    }
    destroy() {
        this.hooks.destroy();
    }
}
exports.Behavior = Behavior;
});
