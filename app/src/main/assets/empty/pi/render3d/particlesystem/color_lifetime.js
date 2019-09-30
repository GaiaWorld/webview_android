_$define("pi/render3d/particlesystem/color_lifetime", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 */
const gradient_1 = require("./gradient");
class ColorOverLifetimeModule {
    // tslint:disable-next-line:typedef
    constructor(config) {
        this.color = gradient_1.buildMinMaxGradient(config.color);
    }
}
exports.ColorOverLifetimeModule = ColorOverLifetimeModule;
});
