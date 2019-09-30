_$define("pi/render3d/particlesystem/main", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 */
const curve_1 = require("./curve");
const gradient_1 = require("./gradient");
var PSScalingMode;
(function (PSScalingMode) {
    PSScalingMode[PSScalingMode["Hierarchy"] = 0] = "Hierarchy";
    PSScalingMode[PSScalingMode["Local"] = 1] = "Local";
    PSScalingMode[PSScalingMode["Shape"] = 2] = "Shape";
})(PSScalingMode = exports.PSScalingMode || (exports.PSScalingMode = {}));
class MainModule {
    // tslint:disable-next-line:typedef
    constructor(config) {
        this.duration = config.duration;
        this.loop = config.loop;
        this.prewarm = config.prewarm;
        this.startDelay = curve_1.buildMinMaxCurve(config.startDelay);
        this.startDelayMultiplier = config.startDelayMultiplier;
        this.startLifetime = curve_1.buildMinMaxCurve(config.startLifetime);
        this.startLifetimeMultiplier = config.startLifetimeMultiplier;
        this.startSpeed = curve_1.buildMinMaxCurve(config.startSpeed);
        this.startSpeedMultiplier = config.startSpeedMultiplier;
        this.startSize3D = config.startSize3D;
        this.startSize = curve_1.buildMinMaxCurve(config.startSize);
        this.startSizeMultiplier = config.startSizeMultiplier;
        this.startSizeX = curve_1.buildMinMaxCurve(config.startSizeX);
        this.startSizeXMultiplier = config.startSizeXMultiplier;
        this.startSizeY = curve_1.buildMinMaxCurve(config.startSizeY);
        this.startSizeYMultiplier = config.startSizeYMultiplier;
        this.startSizeZ = curve_1.buildMinMaxCurve(config.startSizeZ);
        this.startSizeZMultiplier = config.startSizeZMultiplier;
        this.startRotation3D = config.startRotation3D;
        this.startRotation = curve_1.buildMinMaxCurve(config.startRotation);
        this.startRotationMultiplier = config.startRotationMultiplier;
        this.startRotationX = curve_1.buildMinMaxCurve(config.startRotationX);
        this.startRotationXMultiplier = config.startRotationXMultiplier;
        this.startRotationY = curve_1.buildMinMaxCurve(config.startRotationY);
        this.startRotationYMultiplier = config.startRotationYMultiplier;
        this.startRotationZ = curve_1.buildMinMaxCurve(config.startRotationZ);
        this.startRotationZMultiplier = config.startRotationZMultiplier;
        this.randomizeRotationDirection = config.randomizeRotationDirection;
        this.startColor = gradient_1.buildMinMaxGradient(config.startColor);
        this.gravityModifier = curve_1.buildMinMaxCurve(config.gravityModifier);
        this.gravityModifierMultiplier = config.gravityModifierMultiplier;
        this.simulationSpace = config.simulationSpace;
        // this.customSimulationSpace = config.customSimulationSpace;
        this.simulationSpeed = config.simulationSpeed;
        this.scalingMode = config.scalingMode;
        this.playOnAwake = config.playOnAwake;
        this.maxParticles = config.maxParticles;
    }
}
exports.MainModule = MainModule;
});
