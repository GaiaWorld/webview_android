_$define("pi/widget/scroller/core/scroller/createOptions", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createActionsHandlerOptions(bsOptions) {
    const options = [
        'click',
        'bindToWrapper',
        'disableMouse',
        'disableTouch',
        'preventDefault',
        'stopPropagation',
        'tagException',
        'preventDefaultException'
    ].reduce((prev, cur) => {
        prev[cur] = bsOptions[cur];
        return prev;
    }, {});
    return options;
}
exports.createActionsHandlerOptions = createActionsHandlerOptions;
function createBehaviorOptions(bsOptions, extraProp, bounces, rect) {
    const options = [
        'momentum',
        'momentumLimitTime',
        'momentumLimitDistance',
        'deceleration',
        'swipeBounceTime',
        'swipeTime'
    ].reduce((prev, cur) => {
        prev[cur] = bsOptions[cur];
        return prev;
    }, {});
    // add extra property
    options.scrollable = bsOptions[extraProp];
    options.bounces = bounces;
    options.rect = rect;
    return options;
}
exports.createBehaviorOptions = createBehaviorOptions;
});
