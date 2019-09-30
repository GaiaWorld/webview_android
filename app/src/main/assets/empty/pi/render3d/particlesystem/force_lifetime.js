_$define("pi/render3d/particlesystem/force_lifetime", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 */
const curve_1 = require("./curve");
class ForceOverLifetimeModule {
    // tslint:disable-next-line:typedef
    constructor(config) {
        this.randomized = config.randomized;
        this.space = config.space; // 只实现World
        this.x = curve_1.buildMinMaxCurve(config.x);
        this.xMultiplier = config.xMultiplier;
        this.y = curve_1.buildMinMaxCurve(config.y);
        this.yMultiplier = config.yMultiplier;
        this.z = curve_1.buildMinMaxCurve(config.z);
        this.zMultiplier = config.zMultiplier;
    }
}
exports.ForceOverLifetimeModule = ForceOverLifetimeModule;
});
