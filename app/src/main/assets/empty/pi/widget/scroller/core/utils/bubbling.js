_$define("pi/widget/scroller/core/utils/bubbling", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function bubbling(source, target, events) {
    events.forEach(event => {
        let sourceEvent;
        let targetEvent;
        if (typeof event === 'string') {
            sourceEvent = targetEvent = event;
        }
        else {
            sourceEvent = event.source;
            targetEvent = event.target;
        }
        source.on(sourceEvent, function (...args) {
            // console.log(`targetEvent is : ${JSON.stringify(targetEvent)}`);
            return target.trigger(targetEvent, ...args);
        });
    });
}
exports.bubbling = bubbling;
});
