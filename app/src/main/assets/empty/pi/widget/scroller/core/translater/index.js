_$define("pi/widget/scroller/core/translater/index", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../shared-utils/index");
const EventEmitter_1 = require("../base/EventEmitter");
const translaterMetaData = {
    x: ['translateX', 'px'],
    y: ['translateY', 'px']
};
class Translater {
    constructor(content) {
        this.content = content;
        this.style = content.style;
        this.hooks = new EventEmitter_1.EventEmitter(['beforeTranslate', 'translate']);
    }
    getComputedPosition() {
        let cssStyle = window.getComputedStyle(this.content, null);
        let matrix = cssStyle[index_1.style.transform].split(')')[0].split(', ');
        const x = +(matrix[12] || matrix[4]);
        const y = +(matrix[13] || matrix[5]);
        return {
            x,
            y
        };
    }
    translate(point) {
        let transformStyle = [];
        Object.keys(point).forEach(key => {
            if (!translaterMetaData[key]) {
                return;
            }
            const transformFnName = translaterMetaData[key][0];
            if (transformFnName) {
                const transformFnArgUnit = translaterMetaData[key][1];
                const transformFnArg = point[key];
                transformStyle.push(`${transformFnName}(${transformFnArg}${transformFnArgUnit})`);
            }
        });
        this.hooks.trigger(this.hooks.eventTypes.beforeTranslate, transformStyle, point);
        this.style[index_1.style.transform] = `${transformStyle.join(' ')}`;
        this.hooks.trigger(this.hooks.eventTypes.translate, point);
    }
    destroy() {
        this.hooks.destroy();
    }
}
exports.Translater = Translater;
});
