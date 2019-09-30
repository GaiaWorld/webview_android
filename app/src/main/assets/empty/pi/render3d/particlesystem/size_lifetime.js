_$define("pi/render3d/particlesystem/size_lifetime", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 */
const curve_1 = require("./curve");
class SizeOverLifetimeModule {
    // tslint:disable-next-line:typedef
    constructor(config) {
        this.separateAxes = config.separateAxes;
        this.size = curve_1.buildMinMaxCurve(config.size);
        this.sizeMultiplier = config.sizeMultiplier;
        this.x = curve_1.buildMinMaxCurve(config.x);
        this.xMultiplier = config.xMultiplier;
        this.y = curve_1.buildMinMaxCurve(config.y);
        this.yMultiplier = config.yMultiplier;
        this.z = curve_1.buildMinMaxCurve(config.z);
        this.zMultiplier = config.zMultiplier;
    }
}
exports.SizeOverLifetimeModule = SizeOverLifetimeModule;
});
