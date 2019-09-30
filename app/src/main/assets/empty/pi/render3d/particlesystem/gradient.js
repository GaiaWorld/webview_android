_$define("pi/render3d/particlesystem/gradient", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const three_1 = require("../three");
var GradientMode;
(function (GradientMode) {
    GradientMode[GradientMode["Blend"] = 0] = "Blend";
    GradientMode[GradientMode["Fixed"] = 1] = "Fixed";
})(GradientMode = exports.GradientMode || (exports.GradientMode = {}));
var PSGradientMode;
(function (PSGradientMode) {
    PSGradientMode[PSGradientMode["Color"] = 0] = "Color";
    PSGradientMode[PSGradientMode["Gradient"] = 1] = "Gradient";
    PSGradientMode[PSGradientMode["TwoColors"] = 2] = "TwoColors";
    PSGradientMode[PSGradientMode["TwoGradients"] = 3] = "TwoGradients";
    PSGradientMode[PSGradientMode["RandomColor"] = 4] = "RandomColor";
})(PSGradientMode = exports.PSGradientMode || (exports.PSGradientMode = {}));
/**
 * r, g, b 在0，1之间
 */
class GradientColorKey {
}
const lerpNum = (n1, n2, k) => {
    return k * n2 + (1 - k) * n1;
};
const lerpColor = (c, c1, c2, k) => {
    c.r = k * c2.color.r + (1 - k) * c1.color.r;
    c.g = k * c2.color.g + (1 - k) * c1.color.g;
    c.b = k * c2.color.b + (1 - k) * c1.color.b;
};
const getAlpha = (time, keys) => {
    let i;
    let result;
    for (i = 0; i < keys.length; ++i) {
        if (keys[i].time > time) {
            break;
        }
    }
    if (i === 0) {
        result = keys[0].alpha;
    }
    else if (i === keys.length) {
        result = keys[keys.length - 1].alpha;
    }
    else {
        // 数组至少有两个元素，而且i肯定有前一个元素
        const k = (time - keys[i - 1].time) / (keys[i].time - keys[i - 1].time);
        result = lerpNum(keys[i - 1].alpha, keys[i].alpha, k);
    }
    return result;
};
const getColor = (color, time, keys) => {
    let i;
    for (i = 0; i < keys.length; ++i) {
        if (keys[i].time > time) {
            break;
        }
    }
    if (i === 0) {
        color.r = keys[0].color.r;
        color.g = keys[0].color.g;
        color.b = keys[0].color.b;
    }
    else if (i === keys.length) {
        color.r = keys[keys.length - 1].color.r;
        color.g = keys[keys.length - 1].color.g;
        color.b = keys[keys.length - 1].color.b;
    }
    else {
        // 数组至少有两个元素，而且i肯定有前一个元素
        const k = (time - keys[i - 1].time) / (keys[i].time - keys[i - 1].time);
        lerpColor(color, keys[i - 1], keys[i], k);
    }
};
class Gradient {
    constructor(config) {
        this.mode = config.mode;
        this.alphaKeys = [];
        for (let i = 0; i < config.alphaKeys.length; ++i) {
            this.alphaKeys.push(config.alphaKeys[i]);
        }
        this.colorKeys = [];
        for (let i = 0; i < config.colorKeys.length; ++i) {
            this.colorKeys.push(config.colorKeys[i]);
        }
    }
    getValue(c, time) {
        getColor(c, time, this.colorKeys);
        c.a = getAlpha(time, this.alphaKeys);
    }
}
class ColorImpl {
    constructor(color) {
        this.color = new three_1.THREE.Color(0);
        this.color.setRGBA(color.r, color.g, color.b, color.a);
    }
    getValue(c, time, randoms) {
        c.setRGBA(this.color.r, this.color.g, this.color.b, this.color.a);
    }
}
// tslint:disable:max-classes-per-file
class TwoColorImpl {
    constructor(min, max) {
        this.colorMin = new three_1.THREE.Color(0);
        this.colorMax = new three_1.THREE.Color(0);
        this.colorMin.setRGBA(min.r, min.g, min.b, min.a);
        this.colorMax.setRGBA(max.r, max.g, max.b, max.a);
    }
    getValue(c, time, randoms) {
        if (randoms === undefined) {
            randoms = [Math.random(), Math.random(), Math.random(), Math.random()];
        }
        c.setRGBA(this.colorMin.r + randoms[0] * (this.colorMax.r - this.colorMin.r), this.colorMin.g + randoms[1] * (this.colorMax.g - this.colorMin.g), this.colorMin.b + randoms[2] * (this.colorMax.b - this.colorMin.b), this.colorMin.a + randoms[3] * (this.colorMax.a - this.colorMin.a));
    }
}
class RandomColorImpl {
    getValue(c, time, randoms) {
        if (randoms === undefined) {
            randoms = [Math.random(), Math.random(), Math.random(), Math.random()];
        }
        c.a = randoms[0];
        c.r = randoms[1];
        c.g = randoms[2];
        c.b = randoms[3];
    }
}
class GradientImpl {
    // tslint:disable-next-line:typedef
    constructor(config) {
        this.gradient = new Gradient(config);
    }
    getValue(c, time, randoms) {
        this.gradient.getValue(c, time);
    }
}
class TwoGradientImpl {
    // tslint:disable-next-line:typedef
    constructor(min, max) {
        this.gradientMin = new Gradient(min);
        this.gradientMax = new Gradient(max);
    }
    getValue(c, time, randoms) {
        const min = TwoGradientImpl.min;
        const max = TwoGradientImpl.max;
        this.gradientMin.getValue(min, time);
        this.gradientMax.getValue(max, time);
        if (randoms === undefined) {
            randoms = [Math.random(), Math.random(), Math.random(), Math.random()];
        }
        c.setRGBA(min.r + randoms[0] * (max.r - min.r), min.g + randoms[1] * (max.g - min.g), min.b + randoms[2] * (max.b - min.b), min.a + randoms[3] * (max.a - min.a));
    }
}
// tslint:disable-next-line:typedef
TwoGradientImpl.min = new three_1.THREE.Color(0);
// tslint:disable-next-line:typedef
TwoGradientImpl.max = new three_1.THREE.Color(0);
exports.buildMinMaxGradient = config => {
    let result;
    switch (config.mode) {
        case PSGradientMode.Color:
            result = new ColorImpl(config.color);
            break;
        case PSGradientMode.TwoColors:
            result = new TwoColorImpl(config.colorMin, config.colorMax);
            break;
        case PSGradientMode.RandomColor:
            result = new RandomColorImpl();
            break;
        case PSGradientMode.Gradient:
            result = new GradientImpl(config.gradient);
            break;
        case PSGradientMode.TwoGradients:
            result = new TwoGradientImpl(config.gradientMin, config.gradientMax);
            break;
        default:
    }
    return result;
};
});
