_$define("pi/widget/scroller/shared-utils/lang", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getNow() {
    return window.performance && window.performance.now
        ? window.performance.now() + window.performance.timing.navigationStart
        : +new Date();
}
exports.getNow = getNow;
function extend(target, ...rest) {
    for (let i = 0; i < rest.length; i++) {
        let source = rest[i];
        for (let key in source) {
            target[key] = source[key];
        }
    }
    return target;
}
exports.extend = extend;
function isUndef(v) {
    return v === undefined || v === null;
}
exports.isUndef = isUndef;
function isPlainObject(v) {
    return typeof v === 'object' && v !== null;
}
exports.isPlainObject = isPlainObject;
function getDistance(x, y) {
    return Math.sqrt(x * x + y * y);
}
exports.getDistance = getDistance;
function fixInboundValue(x, min, max) {
    if (x < min) {
        return min;
    }
    if (x > max) {
        return max;
    }
    return x;
}
exports.fixInboundValue = fixInboundValue;
});
