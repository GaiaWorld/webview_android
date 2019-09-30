_$define("pi/widget/scroller/core/scroller/Scroller", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ActionsHandler_1 = require("../base/ActionsHandler");
const EventEmitter_1 = require("../base/EventEmitter");
const EventRegister_1 = require("../base/EventRegister");
const index_1 = require("../translater/index");
const index_2 = require("../animater/index");
const Behavior_1 = require("./Behavior");
const Actions_1 = require("./Actions");
const createOptions_1 = require("./createOptions");
const index_3 = require("../enums/index");
const index_4 = require("../../shared-utils/index");
const bubbling_1 = require("../utils/bubbling");
class Scroller {
    constructor(wrapper, options) {
        this.hooks = new EventEmitter_1.EventEmitter([
            'beforeStart',
            'beforeMove',
            'beforeScrollStart',
            'scrollStart',
            'scroll',
            'beforeEnd',
            'scrollEnd',
            'refresh',
            'touchEnd',
            'end',
            'flick',
            'scrollCancel',
            'momentum',
            'scrollTo',
            'ignoreDisMoveForSamePos',
            'scrollToElement'
        ]);
        this.wrapper = wrapper;
        this.content = wrapper.children[0];
        this.options = options;
        const { left = true, right = true, top = true, bottom = true } = this
            .options.bounce;
        // direction X
        this.scrollBehaviorX = new Behavior_1.Behavior(wrapper, createOptions_1.createBehaviorOptions(options, 'scrollX', [left, right], {
            size: 'width',
            position: 'left'
        }));
        // direction Y
        this.scrollBehaviorY = new Behavior_1.Behavior(wrapper, createOptions_1.createBehaviorOptions(options, 'scrollY', [top, bottom], {
            size: 'height',
            position: 'top'
        }));
        this.translater = new index_1.Translater(this.content);
        this.animater = index_2.createAnimater(this.content, this.translater, this.options);
        this.actionsHandler = new ActionsHandler_1.ActionsHandler(wrapper, createOptions_1.createActionsHandlerOptions(this.options));
        this.actions = new Actions_1.ScrollerActions(this.scrollBehaviorX, this.scrollBehaviorY, this.actionsHandler, this.animater, this.options);
        const resizeHandler = this.resize.bind(this);
        this.resizeRegister = new EventRegister_1.EventRegister(window, [
            {
                name: 'orientationchange',
                handler: resizeHandler
            },
            {
                name: 'resize',
                handler: resizeHandler
            }
        ]);
        this.transitionEndRegister = new EventRegister_1.EventRegister(this.content, [
            {
                name: index_4.style.transitionEnd,
                handler: this.transitionEnd.bind(this)
            }
        ]);
        this.init();
    }
    init() {
        this.bindTranslater();
        this.bindAnimater();
        this.bindActions();
        // enable pointer events when scrolling ends
        this.hooks.on(this.hooks.eventTypes.scrollEnd, () => {
            this.togglePointerEvents(true);
        });
    }
    bindTranslater() {
        const hooks = this.translater.hooks;
        hooks.on(hooks.eventTypes.beforeTranslate, (transformStyle) => {
            if (this.options.translateZ) {
                transformStyle.push(this.options.translateZ);
            }
        });
        // disable pointer events when scrolling
        hooks.on(hooks.eventTypes.translate, (pos) => {
            this.updatePositions(pos);
            this.togglePointerEvents(false);
        });
    }
    bindAnimater() {
        // reset position
        this.animater.hooks.on(this.animater.hooks.eventTypes.end, (pos) => {
            if (!this.resetPosition(this.options.bounceTime)) {
                this.animater.setPending(false);
                this.hooks.trigger(this.hooks.eventTypes.scrollEnd, pos);
            }
        });
        bubbling_1.bubbling(this.animater.hooks, this.hooks, [
            {
                source: this.animater.hooks.eventTypes.move,
                target: this.hooks.eventTypes.scroll
            },
            {
                source: this.animater.hooks.eventTypes.forceStop,
                target: this.hooks.eventTypes.scrollEnd
            }
        ]);
    }
    bindActions() {
        const actions = this.actions;
        bubbling_1.bubbling(actions.hooks, this.hooks, [
            {
                source: actions.hooks.eventTypes.start,
                target: this.hooks.eventTypes.beforeStart
            },
            {
                source: actions.hooks.eventTypes.start,
                target: this.hooks.eventTypes.beforeScrollStart // just for event api
            },
            {
                source: actions.hooks.eventTypes.beforeMove,
                target: this.hooks.eventTypes.beforeMove
            },
            {
                source: actions.hooks.eventTypes.scrollStart,
                target: this.hooks.eventTypes.scrollStart
            },
            {
                source: actions.hooks.eventTypes.scroll,
                target: this.hooks.eventTypes.scroll
            },
            {
                source: actions.hooks.eventTypes.beforeEnd,
                target: this.hooks.eventTypes.beforeEnd
            }
        ]);
        actions.hooks.on(actions.hooks.eventTypes.end, (e, pos) => {
            this.hooks.trigger(this.hooks.eventTypes.touchEnd, pos);
            if (this.hooks.trigger(this.hooks.eventTypes.end, pos)) {
                return true;
            }
            // check if it is a click operation
            if (!actions.moved && this.checkClick(e)) {
                this.animater.setForceStopped(false);
                this.hooks.trigger(this.hooks.eventTypes.scrollCancel);
                return true;
            }
            this.animater.setForceStopped(false);
            // reset if we are outside of the boundaries
            if (this.resetPosition(this.options.bounceTime, index_4.ease.bounce)) {
                return true;
            }
        });
        actions.hooks.on(actions.hooks.eventTypes.scrollEnd, (pos, duration) => {
            const deltaX = Math.abs(pos.x - this.scrollBehaviorX.startPos);
            const deltaY = Math.abs(pos.y - this.scrollBehaviorY.startPos);
            if (this.checkFlick(duration, deltaX, deltaY)) {
                this.hooks.trigger(this.hooks.eventTypes.flick);
                return;
            }
            if (this.momentum(pos, duration)) {
                return;
            }
            this.hooks.trigger(this.hooks.eventTypes.scrollEnd, pos);
        });
    }
    checkFlick(duration, deltaX, deltaY) {
        // flick
        if (this.hooks.events.flick.length > 1 &&
            duration < this.options.flickLimitTime &&
            deltaX < this.options.flickLimitDistance &&
            deltaY < this.options.flickLimitDistance) {
            return true;
        }
    }
    momentum(pos, duration) {
        const meta = {
            time: 0,
            easing: index_4.ease.swiper,
            newX: pos.x,
            newY: pos.y
        };
        // start momentum animation if needed
        const momentumX = this.scrollBehaviorX.end(duration);
        const momentumY = this.scrollBehaviorY.end(duration);
        meta.newX = index_4.isUndef(momentumX.destination)
            ? meta.newX
            : momentumX.destination;
        meta.newY = index_4.isUndef(momentumY.destination)
            ? meta.newY
            : momentumY.destination;
        meta.time = Math.max(momentumX.duration, momentumY.duration);
        this.hooks.trigger(this.hooks.eventTypes.momentum, meta, this);
        // when x or y changed, do momentum animation now!
        if (meta.newX !== pos.x || meta.newY !== pos.y) {
            // change easing function when scroller goes out of the boundaries
            if (meta.newX > this.scrollBehaviorX.minScrollPos ||
                meta.newX < this.scrollBehaviorX.maxScrollPos ||
                meta.newY > this.scrollBehaviorY.minScrollPos ||
                meta.newY < this.scrollBehaviorY.maxScrollPos) {
                meta.easing = index_4.ease.swipeBounce;
            }
            this.scrollTo(meta.newX, meta.newY, meta.time, meta.easing);
            return true;
        }
    }
    checkClick(e) {
        // when in the process of pulling down, it should not prevent click
        const cancelable = {
            preventClick: this.animater.forceStopped
        };
        // we scrolled less than momentumLimitDistance pixels
        if (this.hooks.trigger(this.hooks.eventTypes.checkClick))
            return true;
        if (!cancelable.preventClick) {
            const _dblclick = this.options.dblclick;
            let dblclickTrigged = false;
            if (_dblclick && this.lastClickTime) {
                const { delay = 300 } = _dblclick;
                if (index_4.getNow() - this.lastClickTime < delay) {
                    dblclickTrigged = true;
                    index_4.dblclick(e);
                }
            }
            if (this.options.tap) {
                index_4.tap(e, this.options.tap);
            }
            if (this.options.click &&
                !index_4.preventDefaultExceptionFn(e.target, this.options.preventDefaultException)) {
                index_4.click(e);
            }
            this.lastClickTime = dblclickTrigged ? null : index_4.getNow();
            return true;
        }
        return false;
    }
    resize() {
        if (!this.actions.enabled) {
            return;
        }
        // fix a scroll problem under Android condition
        if (index_4.isAndroid) {
            this.wrapper.scrollTop = 0;
        }
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = window.setTimeout(() => {
            this.refresh();
        }, this.options.resizePolling);
    }
    transitionEnd(e) {
        if (e.target !== this.content || !this.animater.pending) {
            return;
        }
        const animater = this.animater;
        animater.transitionTime();
        if (!this.resetPosition(this.options.bounceTime, index_4.ease.bounce)) {
            this.animater.setPending(false);
            if (this.options.probeType !== index_3.Probe.Realtime) {
                this.hooks.trigger(this.hooks.eventTypes.scrollEnd, this.getCurrentPos());
            }
        }
    }
    togglePointerEvents(enabled = true) {
        let el = this.content.children.length
            ? this.content.children
            : [this.content];
        let pointerEvents = enabled ? 'auto' : 'none';
        for (let i = 0; i < el.length; i++) {
            let node = el[i];
            // ignore BetterScroll instance's wrapper DOM
            if (node.isBScroll) {
                continue;
            }
            node.style.pointerEvents = pointerEvents;
        }
    }
    refresh() {
        this.scrollBehaviorX.refresh();
        this.scrollBehaviorY.refresh();
        this.actions.refresh();
        this.wrapperOffset = index_4.offset(this.wrapper);
    }
    scrollBy(deltaX, deltaY, time = 0, easing) {
        const { x, y } = this.getCurrentPos();
        easing = !easing ? index_4.ease.bounce : easing;
        deltaX += x;
        deltaY += y;
        this.scrollTo(deltaX, deltaY, time, easing);
    }
    scrollTo(x, y, time = 0, easing, extraTransform = {
        start: {},
        end: {}
    }, isSilent) {
        easing = !easing ? index_4.ease.bounce : easing;
        const easingFn = this.options.useTransition ? easing.style : easing.fn;
        const currentPos = this.getCurrentPos();
        const startPoint = Object.assign({ x: currentPos.x, y: currentPos.y }, extraTransform.start);
        const endPoint = Object.assign({ x,
            y }, extraTransform.end);
        this.hooks.trigger(this.hooks.eventTypes.scrollTo, endPoint);
        if (!this.hooks.trigger(this.hooks.eventTypes.ignoreDisMoveForSamePos)) {
            // it is an useless move
            if (startPoint.x === endPoint.x && startPoint.y === endPoint.y) {
                return;
            }
        }
        this.animater.move(startPoint, endPoint, time, easingFn, isSilent);
    }
    scrollToElement(el, time, offsetX, offsetY, easing) {
        const targetEle = index_4.getElement(el);
        const pos = index_4.offset(targetEle);
        const getOffset = (offset, size, wrapperSize) => {
            if (typeof offset === 'number') {
                return offset;
            }
            // if offsetX/Y are true we center the element to the screen
            return offset ? Math.round(size / 2 - wrapperSize / 2) : 0;
        };
        offsetX = getOffset(offsetX, targetEle.offsetWidth, this.wrapper.offsetWidth);
        offsetY = getOffset(offsetY, targetEle.offsetHeight, this.wrapper.offsetHeight);
        const getPos = (pos, wrapperPos, offset, scrollBehavior) => {
            pos -= wrapperPos;
            pos = scrollBehavior.adjustPosition(pos - offset);
            return pos;
        };
        pos.left = getPos(pos.left, this.wrapperOffset.left, offsetX, this.scrollBehaviorX);
        pos.top = getPos(pos.top, this.wrapperOffset.top, offsetY, this.scrollBehaviorY);
        if (this.hooks.trigger(this.hooks.eventTypes.scrollToElement, targetEle, pos)) {
            return;
        }
        this.scrollTo(pos.left, pos.top, time, easing);
    }
    resetPosition(time = 0, easing) {
        easing = !easing ? index_4.ease.bounce : easing;
        const { position: x, inBoundary: xInBoundary } = this.scrollBehaviorX.checkInBoundary();
        const { position: y, inBoundary: yInBoundary } = this.scrollBehaviorY.checkInBoundary();
        if (xInBoundary && yInBoundary) {
            return false;
        }
        // out of boundary
        this.scrollTo(x, y, time, easing);
        return true;
    }
    updatePositions(pos) {
        this.scrollBehaviorX.updatePosition(pos.x);
        this.scrollBehaviorY.updatePosition(pos.y);
    }
    getCurrentPos() {
        return this.actions.getCurrentPos();
    }
    enable() {
        this.actions.enabled = true;
    }
    disable() {
        index_4.cancelAnimationFrame(this.animater.timer);
        this.actions.enabled = false;
    }
    destroy() {
        const keys = [
            'resizeRegister',
            'transitionEndRegister',
            'actionsHandler',
            'actions',
            'hooks',
            'animater',
            'translater',
            'scrollBehaviorX',
            'scrollBehaviorY'
        ];
        keys.forEach(key => this[key].destroy());
    }
}
exports.Scroller = Scroller;
});
