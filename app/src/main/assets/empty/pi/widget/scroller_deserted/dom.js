_$define("pi/widget/scroller_deserted/dom", function (require, exports, module){
"use strict";
/**
 * 一些dom相关的函数
 */
Object.defineProperty(exports, "__esModule", { value: true });
// ============================================= 执行
const TOUCH_EVENT = 1;
const MOUSE_EVENT = 2;
const elementStyle = document.createElement('div').style;
const vendor = (() => {
    const transformNames = {
        webkit: 'webkitTransform',
        Moz: 'MozTransform',
        O: 'OTransform',
        ms: 'msTransform',
        standard: 'transform'
    };
    for (const key in transformNames) {
        if (elementStyle[transformNames[key]] !== undefined) {
            return key;
        }
    }
    return false;
})();
const prefixStyle = (style) => {
    if (vendor === false) {
        return false;
    }
    if (vendor === 'standard') {
        return style;
    }
    return vendor + style.charAt(0).toUpperCase() + style.substr(1);
};
const transform = prefixStyle('transform');
// ============================================= 导出
exports.addEvent = (el, eventType, fn, capture) => {
    el.addEventListener(eventType, fn, { passive: false, capture: !!capture });
};
exports.removeEvent = (el, eventType, fn, capture) => {
    el.removeEventListener(eventType, fn, !!capture);
};
exports.offset = (el) => {
    let left = 0;
    let top = 0;
    while (el) {
        left -= el.offsetLeft;
        top -= el.offsetTop;
        el = el.offsetParent;
    }
    return {
        left,
        top
    };
};
exports.hasPerspective = prefixStyle('perspective') in elementStyle;
exports.hasTouch = 'ontouchstart' in window;
exports.hasTransform = transform !== false;
exports.hasTransition = prefixStyle('transition') in elementStyle;
exports.style = {
    transform,
    transitionTimingFunction: prefixStyle('transitionTimingFunction'),
    transitionDuration: prefixStyle('transitionDuration'),
    transitionDelay: prefixStyle('transitionDelay'),
    transformOrigin: prefixStyle('transformOrigin'),
    transitionEnd: prefixStyle('transitionEnd')
};
exports.eventType = {
    touchstart: TOUCH_EVENT,
    touchmove: TOUCH_EVENT,
    touchend: TOUCH_EVENT,
    mousedown: MOUSE_EVENT,
    mousemove: MOUSE_EVENT,
    mouseup: MOUSE_EVENT
};
exports.getRect = (el) => {
    if (el instanceof window.SVGElement) {
        const rect = el.getBoundingClientRect();
        return {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height
        };
    }
    else {
        return {
            top: el.offsetTop,
            left: el.offsetLeft,
            width: el.offsetWidth,
            height: el.offsetHeight
        };
    }
};
exports.preventDefaultException = (el, exceptions) => {
    for (const i in exceptions) {
        if (exceptions[i].test(el[i])) {
            return true;
        }
    }
    return false;
};
exports.tap = (e, eventName) => {
    const ev = document.createEvent('Event');
    ev.initEvent(eventName, true, true);
    ev.pageX = e.pageX;
    ev.pageY = e.pageY;
    e.target.dispatchEvent(ev);
};
exports.click = (e) => {
    const target = e.target;
    if (!(/(SELECT|INPUT|TEXTAREA)/i).test(target.tagName)) {
        const ev = document.createEvent(window.MouseEvent ? 'MouseEvents' : 'Event');
        ev.initEvent('click', true, true);
        ev._constructed = true;
        target.dispatchEvent(ev);
    }
};
exports.prepend = (el, target) => {
    if (target.firstChild) {
        exports.before(el, target.firstChild);
    }
    else {
        target.appendChild(el);
    }
};
exports.before = (el, target) => {
    target.parentNode.insertBefore(el, target);
};
// ============================================= 本地
});
