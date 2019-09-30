_$define("pi/widget/scroller/shared-utils/dom", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("./env");
const lang_1 = require("./lang");
let elementStyle = (env_1.inBrowser &&
    document.createElement('div').style);
let vendor = (() => {
    if (!env_1.inBrowser) {
        return false;
    }
    let transformNames = {
        webkit: 'webkitTransform',
        Moz: 'MozTransform',
        O: 'OTransform',
        ms: 'msTransform',
        standard: 'transform'
    };
    for (let key in transformNames) {
        if (elementStyle[transformNames[key]] !== undefined) {
            return key;
        }
    }
    return false;
})();
function prefixStyle(style) {
    if (vendor === false) {
        return style;
    }
    if (vendor === 'standard') {
        if (style === 'transitionEnd') {
            return 'transitionend';
        }
        return style;
    }
    return vendor + style.charAt(0).toUpperCase() + style.substr(1);
}
function getElement(el) {
    return (typeof el === 'string'
        ? document.querySelector(el)
        : el);
}
exports.getElement = getElement;
function addEvent(el, type, fn, capture) {
    el.addEventListener(type, fn, {
        passive: false,
        capture: !!capture
    });
}
exports.addEvent = addEvent;
function removeEvent(el, type, fn, capture) {
    el.removeEventListener(type, fn, {
        capture: !!capture
    });
}
exports.removeEvent = removeEvent;
function offset(el) {
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
}
exports.offset = offset;
function offsetToBody(el) {
    let rect = el.getBoundingClientRect();
    return {
        left: -(rect.left + window.pageXOffset),
        top: -(rect.top + window.pageYOffset)
    };
}
exports.offsetToBody = offsetToBody;
exports.cssVendor = vendor && vendor !== 'standard' ? '-' + vendor.toLowerCase() + '-' : '';
let transform = prefixStyle('transform');
let transition = prefixStyle('transition');
exports.hasPerspective = env_1.inBrowser && prefixStyle('perspective') in elementStyle;
// fix issue #361
exports.hasTouch = env_1.inBrowser && ('ontouchstart' in window || env_1.isWeChatDevTools);
exports.hasTransition = env_1.inBrowser && transition in elementStyle;
exports.style = {
    transform,
    transition,
    transitionTimingFunction: prefixStyle('transitionTimingFunction'),
    transitionDuration: prefixStyle('transitionDuration'),
    transitionDelay: prefixStyle('transitionDelay'),
    transformOrigin: prefixStyle('transformOrigin'),
    transitionEnd: prefixStyle('transitionEnd')
};
exports.eventTypeMap = {
    touchstart: 1,
    touchmove: 1,
    touchend: 1,
    mousedown: 2,
    mousemove: 2,
    mouseup: 2
};
function getRect(el) {
    if (el instanceof window.SVGElement) {
        let rect = el.getBoundingClientRect();
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
}
exports.getRect = getRect;
function preventDefaultExceptionFn(el, exceptions) {
    for (let i in exceptions) {
        if (exceptions[i].test(el[i])) {
            return true;
        }
    }
    return false;
}
exports.preventDefaultExceptionFn = preventDefaultExceptionFn;
exports.tagExceptionFn = preventDefaultExceptionFn;
function tap(e, eventName) {
    let ev = document.createEvent('Event');
    ev.initEvent(eventName, true, true);
    ev.pageX = e.pageX;
    ev.pageY = e.pageY;
    e.target.dispatchEvent(ev);
}
exports.tap = tap;
function click(e, event = 'click') {
    let eventSource;
    if (e.type === 'mouseup') {
        eventSource = e;
    }
    else if (e.type === 'touchend' || e.type === 'touchcancel') {
        eventSource = e.changedTouches[0];
    }
    let posSrc = {};
    if (eventSource) {
        posSrc.screenX = eventSource.screenX || 0;
        posSrc.screenY = eventSource.screenY || 0;
        posSrc.clientX = eventSource.clientX || 0;
        posSrc.clientY = eventSource.clientY || 0;
    }
    let ev;
    const bubbles = true;
    const cancelable = true;
    if (typeof MouseEvent !== 'undefined') {
        try {
            ev = new MouseEvent(event, lang_1.extend({
                bubbles,
                cancelable
            }, posSrc));
        }
        catch (e) {
            createEvent();
        }
    }
    else {
        createEvent();
    }
    function createEvent() {
        ev = document.createEvent('Event');
        ev.initEvent(event, bubbles, cancelable);
        lang_1.extend(ev, posSrc);
    }
    // forwardedTouchEvent set to true in case of the conflict with fastclick
    ev.forwardedTouchEvent = true;
    ev._constructed = true;
    e.target.dispatchEvent(ev);
}
exports.click = click;
function dblclick(e) {
    click(e, 'dblclick');
}
exports.dblclick = dblclick;
function prepend(el, target) {
    const firstChild = target.firstChild;
    if (firstChild) {
        before(el, firstChild);
    }
    else {
        target.appendChild(el);
    }
}
exports.prepend = prepend;
function before(el, target) {
    ;
    target.parentNode.insertBefore(el, target);
}
exports.before = before;
function removeChild(el, child) {
    el.removeChild(child);
}
exports.removeChild = removeChild;
function hasClass(el, className) {
    let reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
    return reg.test(el.className);
}
exports.hasClass = hasClass;
function addClass(el, className) {
    if (hasClass(el, className)) {
        return;
    }
    let newClass = el.className.split(' ');
    newClass.push(className);
    el.className = newClass.join(' ');
}
exports.addClass = addClass;
function removeClass(el, className) {
    if (!hasClass(el, className)) {
        return;
    }
    let reg = new RegExp('(^|\\s)' + className + '(\\s|$)', 'g');
    el.className = el.className.replace(reg, ' ');
}
exports.removeClass = removeClass;
});
