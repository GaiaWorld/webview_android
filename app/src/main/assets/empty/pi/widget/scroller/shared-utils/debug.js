_$define("pi/widget/scroller/shared-utils/debug", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function warn(msg) {
    console.error(`[BScroll warn]: ${msg}`);
}
exports.warn = warn;
function assert(condition, msg) {
    if (!condition) {
        throw new Error('[BScroll] ' + msg);
    }
}
exports.assert = assert;
});
