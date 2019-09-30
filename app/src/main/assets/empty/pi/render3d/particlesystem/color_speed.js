_$define("pi/render3d/particlesystem/color_speed", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 */
const three_1 = require("../three");
const gradient_1 = require("./gradient");
class ColorBySpeedModule {
    // tslint:disable-next-line:typedef
    constructor(config) {
        this.range = new three_1.THREE.Vector2(config.range.x, config.range.y);
        this.color = gradient_1.buildMinMaxGradient(config.color);
    }
}
exports.ColorBySpeedModule = ColorBySpeedModule;
});
