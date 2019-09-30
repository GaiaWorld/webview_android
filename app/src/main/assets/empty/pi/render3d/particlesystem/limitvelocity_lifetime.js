_$define("pi/render3d/particlesystem/limitvelocity_lifetime", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 */
const curve_1 = require("./curve");
/**
 * TODO: 因为没法理解分轴计算时候的限速行为，所以暂时不提供分轴计算
 */
class LimitVelocityOverLifetimeModule {
    // tslint:disable-next-line:typedef
    constructor(config) {
        this.dampen = config.dampen;
        this.limit = curve_1.buildMinMaxCurve(config.limit);
        this.limitMultiplier = config.limitMultiplier;
        this.limitX = curve_1.buildMinMaxCurve(config.limitX);
        this.limitXMultiplier = config.limitXMultiplier;
        this.limitY = curve_1.buildMinMaxCurve(config.limitY);
        this.limitYMultiplier = config.limitYMultiplier;
        this.limitZ = curve_1.buildMinMaxCurve(config.limitZ);
        this.limitZMultiplier = config.limitZMultiplier;
        this.separateAxes = config.separateAxes;
        this.space = config.space;
    }
}
exports.LimitVelocityOverLifetimeModule = LimitVelocityOverLifetimeModule;
});
