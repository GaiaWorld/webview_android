_$define("pi/widget/scroller/core/scroller/DirectionLock", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../enums/index");
var Passthrough;
(function (Passthrough) {
    Passthrough["Yes"] = "yes";
    Passthrough["No"] = "no";
})(Passthrough || (Passthrough = {}));
const PassthroughHandlers = {
    [Passthrough.Yes]: (e) => {
        return true;
    },
    [Passthrough.No]: (e) => {
        e.preventDefault();
        return false;
    }
};
const DirectionMap = {
    [index_1.DirectionLock.Horizontal]: {
        [Passthrough.Yes]: index_1.EventPassthrough.Horizontal,
        [Passthrough.No]: index_1.EventPassthrough.Vertical
    },
    [index_1.DirectionLock.Vertical]: {
        [Passthrough.Yes]: index_1.EventPassthrough.Vertical,
        [Passthrough.No]: index_1.EventPassthrough.Horizontal
    }
};
class DirectionLockAction {
    constructor(directionLockThreshold, freeScroll, eventPassthrough) {
        this.directionLockThreshold = directionLockThreshold;
        this.freeScroll = freeScroll;
        this.eventPassthrough = eventPassthrough;
        this.reset();
    }
    reset() {
        this.directionLocked = index_1.DirectionLock.Default;
    }
    checkMovingDirection(absDistX, absDistY, e) {
        this.computeDirectionLock(absDistX, absDistY);
        return this.handleEventPassthrough(e);
    }
    adjustDelta(deltaX, deltaY) {
        if (this.directionLocked === index_1.DirectionLock.Horizontal) {
            deltaY = 0;
        }
        else if (this.directionLocked === index_1.DirectionLock.Vertical) {
            deltaX = 0;
        }
        return {
            deltaX,
            deltaY
        };
    }
    computeDirectionLock(absDistX, absDistY) {
        // If you are scrolling in one direction, lock it
        if (this.directionLocked === index_1.DirectionLock.Default && !this.freeScroll) {
            if (absDistX > absDistY + this.directionLockThreshold) {
                this.directionLocked = index_1.DirectionLock.Horizontal; // lock horizontally
            }
            else if (absDistY >= absDistX + this.directionLockThreshold) {
                this.directionLocked = index_1.DirectionLock.Vertical; // lock vertically
            }
            else {
                this.directionLocked = index_1.DirectionLock.None; // no lock
            }
        }
    }
    handleEventPassthrough(e) {
        const handleMap = DirectionMap[this.directionLocked];
        if (handleMap) {
            if (this.eventPassthrough === handleMap[Passthrough.Yes]) {
                return PassthroughHandlers[Passthrough.Yes](e);
            }
            else if (this.eventPassthrough === handleMap[Passthrough.No]) {
                return PassthroughHandlers[Passthrough.No](e);
            }
        }
        return false;
    }
}
exports.DirectionLockAction = DirectionLockAction;
});
