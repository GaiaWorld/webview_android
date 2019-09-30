_$define("pi/render3d/particlesystem/texture_sheet_animation", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 */
const curve_1 = require("./curve");
var PSAnimationType;
(function (PSAnimationType) {
    PSAnimationType[PSAnimationType["WholeSheet"] = 0] = "WholeSheet";
    PSAnimationType[PSAnimationType["SingleRow"] = 1] = "SingleRow";
})(PSAnimationType = exports.PSAnimationType || (exports.PSAnimationType = {}));
var UVChannelFlags;
(function (UVChannelFlags) {
    UVChannelFlags[UVChannelFlags["UV0"] = 1] = "UV0";
    UVChannelFlags[UVChannelFlags["UV1"] = 2] = "UV1";
    UVChannelFlags[UVChannelFlags["UV2"] = 4] = "UV2";
    UVChannelFlags[UVChannelFlags["UV3"] = 8] = "UV3";
})(UVChannelFlags || (UVChannelFlags = {}));
class TextureSheetAnimationModule {
    // tslint:disable-next-line:typedef
    constructor(config) {
        this.animation = config.animation;
        this.cycleCount = config.cycleCount;
        this.flipU = config.flipU;
        this.flipV = config.flipV;
        this.frameOverTime = curve_1.buildMinMaxCurve(config.frameOverTime);
        this.frameOverTimeMultiplier = config.frameOverTimeMultiplier;
        this.numTilesX = config.numTilesX;
        this.numTilesY = config.numTilesY;
        this.rowIndex = config.rowIndex;
        this.startFrame = curve_1.buildMinMaxCurve(config.startFrame);
        this.startFrameMultiplier = config.startFrameMultiplier;
        this.useRandomRow = config.useRandomRow;
        this.uvChannelMask = config.uvChannelMask;
    }
}
exports.TextureSheetAnimationModule = TextureSheetAnimationModule;
});
