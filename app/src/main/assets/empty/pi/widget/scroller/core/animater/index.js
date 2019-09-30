_$define("pi/widget/scroller/core/animater/index", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = require("./Base");
exports.Animater = Base_1.Base;
const Transition_1 = require("./Transition");
exports.Transition = Transition_1.Transition;
const Animation_1 = require("./Animation");
exports.Animation = Animation_1.Animation;
function createAnimater(element, translater, options) {
    const useTransition = options.useTransition;
    let animaterOptions = {};
    Object.defineProperty(animaterOptions, 'probeType', {
        enumerable: true,
        configurable: false,
        get() {
            return options.probeType;
        }
    });
    if (useTransition) {
        return new Transition_1.Transition(element, translater, animaterOptions);
    }
    else {
        return new Animation_1.Animation(element, translater, animaterOptions);
    }
}
exports.createAnimater = createAnimater;
});
