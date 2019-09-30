_$define("pi/widget/scroller/core/base/ActionsHandler", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventEmitter_1 = require("./EventEmitter");
const EventRegister_1 = require("./EventRegister");
const index_1 = require("../../shared-utils/index");
const index_2 = require("../enums/index");
class ActionsHandler {
    constructor(wrapper, options) {
        this.wrapper = wrapper;
        this.options = options;
        this.hooks = new EventEmitter_1.EventEmitter([
            'beforeStart',
            'start',
            'move',
            'end',
            'click'
        ]);
        this.handleDOMEvents();
    }
    handleDOMEvents() {
        const { bindToWrapper, disableMouse, disableTouch, click } = this.options;
        const wrapper = this.wrapper;
        const target = bindToWrapper ? wrapper : window;
        const wrapperEvents = [];
        const targetEvents = [];
        const shouldRegiserTouch = index_1.hasTouch && !disableTouch;
        const sholdRegisterMouse = !disableMouse;
        if (click) {
            wrapperEvents.push({
                name: 'click',
                handler: this.click.bind(this),
                capture: true
            });
        }
        if (shouldRegiserTouch) {
            wrapperEvents.push({
                name: 'touchstart',
                handler: this.start.bind(this)
            });
            targetEvents.push({
                name: 'touchmove',
                handler: this.move.bind(this)
            }, {
                name: 'touchend',
                handler: this.end.bind(this)
            }, {
                name: 'touchcancel',
                handler: this.end.bind(this)
            });
        }
        if (sholdRegisterMouse) {
            wrapperEvents.push({
                name: 'mousedown',
                handler: this.start.bind(this)
            });
            targetEvents.push({
                name: 'mousemove',
                handler: this.move.bind(this)
            }, {
                name: 'mouseup',
                handler: this.end.bind(this)
            });
        }
        this.wrapperEventRegister = new EventRegister_1.EventRegister(wrapper, wrapperEvents);
        this.targetEventRegister = new EventRegister_1.EventRegister(target, targetEvents);
    }
    beforeHandler(e, type) {
        const { preventDefault, stopPropagation, preventDefaultException } = this.options;
        const preventDefaultConditions = {
            start: () => {
                return (preventDefault &&
                    !index_1.preventDefaultExceptionFn(e.target, preventDefaultException));
            },
            end: () => {
                return (preventDefault &&
                    !index_1.preventDefaultExceptionFn(e.target, preventDefaultException));
            },
            move: () => {
                return preventDefault;
            }
        };
        if (preventDefaultConditions[type]()) {
            e.preventDefault();
        }
        if (stopPropagation) {
            e.stopPropagation();
        }
    }
    setInitiated(type = 0) {
        this.initiated = type;
    }
    start(e) {
        const _eventType = index_1.eventTypeMap[e.type];
        if (this.initiated && this.initiated !== _eventType) {
            return;
        }
        this.setInitiated(_eventType);
        // if textarea or other html tags in options.tagException is manipulated
        // do not make bs scroll
        if (index_1.tagExceptionFn(e.target, this.options.tagException)) {
            this.setInitiated();
            return;
        }
        // no mouse left button
        if (_eventType === index_2.EventType.Mouse && e.button !== index_2.MouseButton.Left)
            return;
        if (this.hooks.trigger(this.hooks.eventTypes.beforeStart, e)) {
            return;
        }
        this.beforeHandler(e, 'start');
        let point = (e.touches ? e.touches[0] : e);
        this.pointX = point.pageX;
        this.pointY = point.pageY;
        this.hooks.trigger(this.hooks.eventTypes.start, e);
    }
    move(e) {
        if (index_1.eventTypeMap[e.type] !== this.initiated) {
            return;
        }
        this.beforeHandler(e, 'move');
        let point = (e.touches ? e.touches[0] : e);
        let deltaX = point.pageX - this.pointX;
        let deltaY = point.pageY - this.pointY;
        this.pointX = point.pageX;
        this.pointY = point.pageY;
        if (this.hooks.trigger(this.hooks.eventTypes.move, {
            deltaX,
            deltaY,
            e
        })) {
            return;
        }
        // auto end when out of wrapper
        let scrollLeft = document.documentElement.scrollLeft ||
            window.pageXOffset ||
            document.body.scrollLeft;
        let scrollTop = document.documentElement.scrollTop ||
            window.pageYOffset ||
            document.body.scrollTop;
        let pX = this.pointX - scrollLeft;
        let pY = this.pointY - scrollTop;
        if (pX >
            document.documentElement.clientWidth -
                this.options.momentumLimitDistance ||
            pX < this.options.momentumLimitDistance ||
            pY < this.options.momentumLimitDistance ||
            pY >
                document.documentElement.clientHeight -
                    this.options.momentumLimitDistance) {
            this.end(e);
        }
    }
    end(e) {
        if (index_1.eventTypeMap[e.type] !== this.initiated) {
            return;
        }
        this.setInitiated();
        this.beforeHandler(e, 'end');
        this.hooks.trigger(this.hooks.eventTypes.end, e);
    }
    click(e) {
        this.hooks.trigger(this.hooks.eventTypes.click, e);
    }
    destroy() {
        this.wrapperEventRegister.destroy();
        this.targetEventRegister.destroy();
        this.hooks.destroy();
    }
}
exports.ActionsHandler = ActionsHandler;
});
