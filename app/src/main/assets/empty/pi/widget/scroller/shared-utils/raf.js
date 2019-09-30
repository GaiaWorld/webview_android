_$define("pi/widget/scroller/shared-utils/raf", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("./env");
const DEFAULT_INTERVAL = 100 / 60;
const windowCompat = env_1.inBrowser && window;
function noop() { }
exports.requestAnimationFrame = (() => {
    if (!env_1.inBrowser) {
        /* istanbul ignore if */
        return noop;
    }
    let func = (windowCompat.requestAnimationFrame ||
        windowCompat.webkitRequestAnimationFrame ||
        windowCompat.mozRequestAnimationFrame ||
        windowCompat.oRequestAnimationFrame ||
        // if all else fails, use setTimeout
        function (callback) {
            return window.setTimeout(callback, (callback.interval || DEFAULT_INTERVAL) / 2); // make interval as precise as possible.
        });
    return func.bind(windowCompat);
})();
exports.cancelAnimationFrame = (() => {
    if (!env_1.inBrowser) {
        /* istanbul ignore if */
        return noop;
    }
    let func = (windowCompat.cancelAnimationFrame ||
        windowCompat.webkitCancelAnimationFrame ||
        windowCompat.mozCancelAnimationFrame ||
        windowCompat.oCancelAnimationFrame ||
        function (id) {
            window.clearTimeout(id);
        });
    return func.bind(windowCompat);
})();
});
