_$define("pi/render3d/particlesystem/util", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 */
var PSSimulationSpace;
(function (PSSimulationSpace) {
    PSSimulationSpace[PSSimulationSpace["Local"] = 0] = "Local";
    PSSimulationSpace[PSSimulationSpace["World"] = 1] = "World";
    PSSimulationSpace[PSSimulationSpace["Custom"] = 2] = "Custom";
})(PSSimulationSpace = exports.PSSimulationSpace || (exports.PSSimulationSpace = {}));
// 线性插值 (1 - k) * n1 + k * n2
exports.lerp = (n1, n2, k) => n1 + k * (n2 - n1);
});
