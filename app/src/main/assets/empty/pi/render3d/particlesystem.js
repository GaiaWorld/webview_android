_$define("pi/render3d/particlesystem", function (require, exports, module){
/**
 *
 */
var TangentMode;
(function (TangentMode) {
    TangentMode[TangentMode["Free"] = 0] = "Free";
    TangentMode[TangentMode["Auto"] = 1] = "Auto";
    TangentMode[TangentMode["Linear"] = 2] = "Linear";
    TangentMode[TangentMode["Constant"] = 3] = "Constant";
    TangentMode[TangentMode["ClampedAuto"] = 4] = "ClampedAuto";
})(TangentMode || (TangentMode = {}));
var ParticleSystemCollisionMode;
(function (ParticleSystemCollisionMode) {
    ParticleSystemCollisionMode[ParticleSystemCollisionMode["Collision3D"] = 0] = "Collision3D";
    ParticleSystemCollisionMode[ParticleSystemCollisionMode["Collision2D"] = 1] = "Collision2D";
})(ParticleSystemCollisionMode || (ParticleSystemCollisionMode = {}));
var ParticleSystemCollisionQuality;
(function (ParticleSystemCollisionQuality) {
    ParticleSystemCollisionQuality[ParticleSystemCollisionQuality["High"] = 0] = "High";
    ParticleSystemCollisionQuality[ParticleSystemCollisionQuality["Medium"] = 1] = "Medium";
    ParticleSystemCollisionQuality[ParticleSystemCollisionQuality["Low"] = 2] = "Low";
})(ParticleSystemCollisionQuality || (ParticleSystemCollisionQuality = {}));
var ParticleSystemCollisionType;
(function (ParticleSystemCollisionType) {
    ParticleSystemCollisionType[ParticleSystemCollisionType["Planes"] = 0] = "Planes";
    ParticleSystemCollisionType[ParticleSystemCollisionType["World"] = 1] = "World";
})(ParticleSystemCollisionType || (ParticleSystemCollisionType = {}));
var ParticleSystemSimulationSpace;
(function (ParticleSystemSimulationSpace) {
    ParticleSystemSimulationSpace[ParticleSystemSimulationSpace["Local"] = 0] = "Local";
    ParticleSystemSimulationSpace[ParticleSystemSimulationSpace["World"] = 1] = "World";
    ParticleSystemSimulationSpace[ParticleSystemSimulationSpace["Custom"] = 2] = "Custom";
})(ParticleSystemSimulationSpace || (ParticleSystemSimulationSpace = {}));
var ParticleSystemInheritVelocityMode;
(function (ParticleSystemInheritVelocityMode) {
    ParticleSystemInheritVelocityMode[ParticleSystemInheritVelocityMode["Initial"] = 0] = "Initial";
    ParticleSystemInheritVelocityMode[ParticleSystemInheritVelocityMode["Current"] = 1] = "Current";
})(ParticleSystemInheritVelocityMode || (ParticleSystemInheritVelocityMode = {}));
var ParticleSystemScalingMode;
(function (ParticleSystemScalingMode) {
    ParticleSystemScalingMode[ParticleSystemScalingMode["Hierarchy"] = 0] = "Hierarchy";
    ParticleSystemScalingMode[ParticleSystemScalingMode["Local"] = 1] = "Local";
    ParticleSystemScalingMode[ParticleSystemScalingMode["Shape"] = 2] = "Shape";
})(ParticleSystemScalingMode || (ParticleSystemScalingMode = {}));
var ParticleSystemGradientMode;
(function (ParticleSystemGradientMode) {
    ParticleSystemGradientMode[ParticleSystemGradientMode["Color"] = 0] = "Color";
    ParticleSystemGradientMode[ParticleSystemGradientMode["Gradient"] = 1] = "Gradient";
    ParticleSystemGradientMode[ParticleSystemGradientMode["TwoColors"] = 2] = "TwoColors";
    ParticleSystemGradientMode[ParticleSystemGradientMode["TwoGradients"] = 3] = "TwoGradients";
    ParticleSystemGradientMode[ParticleSystemGradientMode["RandomColor"] = 4] = "RandomColor";
})(ParticleSystemGradientMode || (ParticleSystemGradientMode = {}));
var GradientMode;
(function (GradientMode) {
    GradientMode[GradientMode["Blend"] = 0] = "Blend";
    GradientMode[GradientMode["Fixed"] = 1] = "Fixed";
})(GradientMode || (GradientMode = {}));
var ParticleSystemNoiseQuality;
(function (ParticleSystemNoiseQuality) {
    ParticleSystemNoiseQuality[ParticleSystemNoiseQuality["Low"] = 0] = "Low";
    ParticleSystemNoiseQuality[ParticleSystemNoiseQuality["Medium"] = 1] = "Medium";
    ParticleSystemNoiseQuality[ParticleSystemNoiseQuality["High"] = 2] = "High";
})(ParticleSystemNoiseQuality || (ParticleSystemNoiseQuality = {}));
var ParticleSystemShapeType;
(function (ParticleSystemShapeType) {
    ParticleSystemShapeType[ParticleSystemShapeType["Sphere"] = 0] = "Sphere";
    ParticleSystemShapeType[ParticleSystemShapeType["SphereShell"] = 1] = "SphereShell";
    ParticleSystemShapeType[ParticleSystemShapeType["Hemisphere"] = 2] = "Hemisphere";
    ParticleSystemShapeType[ParticleSystemShapeType["HemisphereShell"] = 3] = "HemisphereShell";
    ParticleSystemShapeType[ParticleSystemShapeType["Cone"] = 4] = "Cone";
    ParticleSystemShapeType[ParticleSystemShapeType["Box"] = 5] = "Box";
    ParticleSystemShapeType[ParticleSystemShapeType["Mesh"] = 6] = "Mesh";
    ParticleSystemShapeType[ParticleSystemShapeType["ConeShell"] = 7] = "ConeShell";
    ParticleSystemShapeType[ParticleSystemShapeType["ConeVolume"] = 8] = "ConeVolume";
    ParticleSystemShapeType[ParticleSystemShapeType["ConeVolumeShell"] = 9] = "ConeVolumeShell";
    ParticleSystemShapeType[ParticleSystemShapeType["Circle"] = 10] = "Circle";
    ParticleSystemShapeType[ParticleSystemShapeType["CircleEdge"] = 11] = "CircleEdge";
    ParticleSystemShapeType[ParticleSystemShapeType["SingleSidedEdge"] = 12] = "SingleSidedEdge";
    ParticleSystemShapeType[ParticleSystemShapeType["MeshRenderer"] = 13] = "MeshRenderer";
    ParticleSystemShapeType[ParticleSystemShapeType["SkinnedMeshRenderer"] = 14] = "SkinnedMeshRenderer";
    ParticleSystemShapeType[ParticleSystemShapeType["BoxShell"] = 15] = "BoxShell";
    ParticleSystemShapeType[ParticleSystemShapeType["BoxEdge"] = 16] = "BoxEdge";
})(ParticleSystemShapeType || (ParticleSystemShapeType = {}));
var ParticleSystemMeshShapeType;
(function (ParticleSystemMeshShapeType) {
    ParticleSystemMeshShapeType[ParticleSystemMeshShapeType["Vertex"] = 0] = "Vertex";
    ParticleSystemMeshShapeType[ParticleSystemMeshShapeType["Edge"] = 1] = "Edge";
    ParticleSystemMeshShapeType[ParticleSystemMeshShapeType["Triangle"] = 2] = "Triangle";
})(ParticleSystemMeshShapeType || (ParticleSystemMeshShapeType = {}));
var UVChannelFlags;
(function (UVChannelFlags) {
    UVChannelFlags[UVChannelFlags["UV0"] = 1] = "UV0";
    UVChannelFlags[UVChannelFlags["UV1"] = 2] = "UV1";
    UVChannelFlags[UVChannelFlags["UV2"] = 4] = "UV2";
    UVChannelFlags[UVChannelFlags["UV3"] = 8] = "UV3";
})(UVChannelFlags || (UVChannelFlags = {}));
var ParticleSystemAnimationType;
(function (ParticleSystemAnimationType) {
    ParticleSystemAnimationType[ParticleSystemAnimationType["WholeSheet"] = 0] = "WholeSheet";
    ParticleSystemAnimationType[ParticleSystemAnimationType["SingleRow"] = 1] = "SingleRow";
})(ParticleSystemAnimationType || (ParticleSystemAnimationType = {}));
var ParticleSystemTrailTextureMode;
(function (ParticleSystemTrailTextureMode) {
    ParticleSystemTrailTextureMode[ParticleSystemTrailTextureMode["Stretch"] = 0] = "Stretch";
    ParticleSystemTrailTextureMode[ParticleSystemTrailTextureMode["Tile"] = 1] = "Tile";
})(ParticleSystemTrailTextureMode || (ParticleSystemTrailTextureMode = {}));
var ParticleSystemOverlapAction;
(function (ParticleSystemOverlapAction) {
    ParticleSystemOverlapAction[ParticleSystemOverlapAction["Ignore"] = 0] = "Ignore";
    ParticleSystemOverlapAction[ParticleSystemOverlapAction["Kill"] = 1] = "Kill";
    ParticleSystemOverlapAction[ParticleSystemOverlapAction["Callback"] = 2] = "Callback";
})(ParticleSystemOverlapAction || (ParticleSystemOverlapAction = {}));
var ParticleSystemCurveMode;
(function (ParticleSystemCurveMode) {
    ParticleSystemCurveMode[ParticleSystemCurveMode["Constant"] = 0] = "Constant";
    ParticleSystemCurveMode[ParticleSystemCurveMode["Curve"] = 1] = "Curve";
    ParticleSystemCurveMode[ParticleSystemCurveMode["TwoCurves"] = 2] = "TwoCurves";
    ParticleSystemCurveMode[ParticleSystemCurveMode["TwoConstants"] = 3] = "TwoConstants";
})(ParticleSystemCurveMode || (ParticleSystemCurveMode = {}));
/**
 * @description 取值器
 */
const getValue = (param) => {
    let func;
    switch (param.mode) {
        case ParticleSystemCurveMode.Constant:
            // tslint:disable:typedef only-arrow-functions no-function-expression
            func = (function (value) {
                return () => value;
            }(param.constant));
            break;
        case ParticleSystemCurveMode.TwoConstants:
            const v = param.constantMin + Math.random() * (param.constantMax - param.constantMin);
            func = (function (value) {
                return () => value;
            }(v));
            break;
        case ParticleSystemCurveMode.Curve:
            break;
        case ParticleSystemCurveMode.TwoCurves:
            break;
        default:
    }
    return func;
};
class Particle {
}
class ParticleSystem {
    constructor(config) {
        this.startTime = 0;
        this.config = config;
    }
    play(time) {
        const main = this.config.main;
        this.playTime = time;
        if (this.startTime === 0) {
            this.startTime = time;
        }
        // tslint:disable-next-line:no-empty
        if (this.particles.length > main.maxParticles) {
        }
    }
}
});
