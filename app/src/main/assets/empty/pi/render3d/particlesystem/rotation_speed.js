_$define("pi/render3d/particlesystem/rotation_speed", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 */
const three_1 = require("../three");
const curve_1 = require("./curve");
class RotationBySpeedModule {
    // tslint:disable-next-line:typedef
    constructor(config) {
        this.range = new three_1.THREE.Vector2(config.range.x, config.range.y);
        this.separateAxes = config.separateAxes;
        this.x = curve_1.buildMinMaxCurve(config.x);
        this.xMultiplier = config.xMultiplier;
        this.y = curve_1.buildMinMaxCurve(config.y);
        this.yMultiplier = config.yMultiplier;
        this.z = curve_1.buildMinMaxCurve(config.z);
        this.zMultiplier = config.zMultiplier;
    }
}
exports.RotationBySpeedModule = RotationBySpeedModule;
});
