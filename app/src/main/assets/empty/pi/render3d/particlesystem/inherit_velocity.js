_$define("pi/render3d/particlesystem/inherit_velocity", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 */
const curve_1 = require("./curve");
var PSInheritVelocityMode;
(function (PSInheritVelocityMode) {
    PSInheritVelocityMode[PSInheritVelocityMode["Initial"] = 0] = "Initial";
    PSInheritVelocityMode[PSInheritVelocityMode["Current"] = 1] = "Current";
})(PSInheritVelocityMode || (PSInheritVelocityMode = {}));
class InheritVelocityModule {
    // tslint:disable-next-line:typedef
    constructor(config) {
        this.mode = config.mode;
        this.curve = curve_1.buildMinMaxCurve(config.curve);
        this.curveMultiplier = config.curveMultiplier;
    }
}
exports.InheritVelocityModule = InheritVelocityModule;
});
