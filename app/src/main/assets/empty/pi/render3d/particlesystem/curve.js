_$define("pi/render3d/particlesystem/curve", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 */
var PSCurveMode;
(function (PSCurveMode) {
    PSCurveMode[PSCurveMode["Constant"] = 0] = "Constant";
    PSCurveMode[PSCurveMode["Curve"] = 1] = "Curve";
    PSCurveMode[PSCurveMode["TwoCurves"] = 2] = "TwoCurves";
    PSCurveMode[PSCurveMode["TwoConstants"] = 3] = "TwoConstants";
})(PSCurveMode = exports.PSCurveMode || (exports.PSCurveMode = {}));
class Keyframe {
    // tslint:disable-next-line:typedef
    constructor(config) {
        this.inTangent = config.inTangent;
        this.outTangent = config.outTangent;
        this.time = config.time;
        this.value = config.value;
    }
}
class AnimationCurve {
    // tslint:disable-next-line:typedef
    constructor(config) {
        this.keys = [];
        for (let i = 0; i < config.keys.length; ++i) {
            this.keys[i] = new Keyframe(config.keys[i]);
        }
    }
    getValue(time) {
        let i = 0;
        for (i = 0; i < this.keys.length; ++i) {
            const k = this.keys[i];
            if (k.time >= time)
                break;
        }
        if (i === 0) {
            return this.keys.length > 0 ? this.keys[0].value : 0.0;
        }
        else if (i === this.keys.length) {
            return this.keys.length > 0 ? this.keys[this.keys.length - 1].value : 0.0;
        }
        const { time: t0, value: v0, outTangent: m0 } = this.keys[i - 1];
        const { time: t1, value: v1, inTangent: m1 } = this.keys[i];
        // 有一个是inf或者-inf，都要按阶梯函数处理
        if (m0 === Infinity || m0 === -Infinity || m1 === Infinity || m1 === -Infinity) {
            return v0;
        }
        const dt = t1 - t0;
        const x = (time - t0) / dt;
        const x2 = x * x;
        const x3 = x * x2;
        const h1 = x3 * 2 - x2 * 3 + 1;
        const h2 = x3 - x2 * 2 + x;
        const h3 = x3 * -2 + x2 * 3;
        const h4 = x3 - x2;
        const result = h1 * v0 + dt * h2 * m0 + h3 * v1 + dt * h4 * m1;
        return result;
    }
}
class ConstantImpl {
    constructor(constant) {
        this.constant = constant;
    }
    getValue(time, random) {
        return this.constant;
    }
}
// tslint:disable:max-classes-per-file
class TwoConstantsImpl {
    constructor(min, max) {
        this.min = min;
        this.max = max;
    }
    getValue(time, random) {
        if (random === undefined) {
            random = Math.random();
        }
        return this.min + random * (this.max - this.min);
    }
}
class CurveImpl {
    // tslint:disable-next-line:typedef
    constructor(config) {
        this.curve = new AnimationCurve(config);
    }
    getValue(time, random) {
        return this.curve.getValue(time);
    }
}
class TwoCurvesImpl {
    // tslint:disable-next-line:typedef
    constructor(minConfig, maxConfig) {
        this.curveMin = new AnimationCurve(minConfig);
        this.curveMax = new AnimationCurve(maxConfig);
    }
    getValue(time, random) {
        const min = this.curveMin.getValue(time);
        const max = this.curveMax.getValue(time);
        if (random === undefined) {
            random = Math.random();
        }
        return min + random * (max - min);
    }
}
/**
 * 构建曲线取值
 */
exports.buildMinMaxCurve = config => {
    let result;
    switch (config.mode) {
        case PSCurveMode.Constant:
            result = new ConstantImpl(config.constant);
            break;
        case PSCurveMode.TwoConstants:
            result = new TwoConstantsImpl(config.constantMin, config.constantMax);
            break;
        case PSCurveMode.Curve:
            result = new CurveImpl(config.curve);
            break;
        // tslint:disable-next-line:no-duplicate-switch-case
        case PSCurveMode.Curve:
            result = new TwoCurvesImpl(config.curveMin, config.curveMax);
            break;
        default:
    }
    return result;
};
});
