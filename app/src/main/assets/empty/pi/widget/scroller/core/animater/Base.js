_$define("pi/widget/scroller/core/animater/Base", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventEmitter_1 = require("../base/EventEmitter");
const index_1 = require("../../shared-utils/index");
class Base {
    constructor(content, translater, options) {
        this.content = content;
        this.translater = translater;
        this.options = options;
        this.hooks = new EventEmitter_1.EventEmitter([
            'move',
            'end',
            'beforeForceStop',
            'forceStop',
            'time',
            'timeFunction'
        ]);
        this.style = content.style;
    }
    translate(endPoint) {
        this.translater.translate(endPoint);
    }
    setPending(pending) {
        this.pending = pending;
    }
    setForceStopped(forceStopped) {
        this.forceStopped = forceStopped;
    }
    destroy() {
        this.hooks.destroy();
        index_1.cancelAnimationFrame(this.timer);
    }
}
exports.Base = Base;
});
