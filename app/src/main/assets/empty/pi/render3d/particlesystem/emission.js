_$define("pi/render3d/particlesystem/emission", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 */
const curve_1 = require("./curve");
class Burst {
    // tslint:disable-next-line:typedef
    constructor(config) {
        this.time = config.time;
        this.minCount = config.minCount;
        this.maxCount = config.maxCount;
    }
}
class EmissionModule {
    // tslint:disable-next-line:typedef
    constructor(config) {
        this.lastTime = 0;
        this.rateOverDistance = curve_1.buildMinMaxCurve(config.rateOverDistance);
        this.rateOverDistanceMultiplier = config.rateOverDistanceMultiplier;
        this.rateOverTime = curve_1.buildMinMaxCurve(config.rateOverTime);
        this.rateOverTimeMultiplier = config.rateOverTimeMultiplier;
        this.bursts = [];
        for (let i = 0; i < config.bursts.length; ++i) {
            this.bursts.push(new Burst(config.bursts[i]));
        }
    }
    // 返回这次新创建的粒子的数量
    update(time, playTime, maxCount) {
        let count = 0;
        for (let i = 0; i < this.bursts.length; ++i) {
            if (Math.abs(this.bursts[i].time - playTime) < 0.01) {
                count = this.bursts[i].minCount + Math.random() * (this.bursts[i].maxCount - this.bursts[i].minCount);
                count = Math.floor(count);
                break;
            }
        }
        if (this.lastTime === 0) {
            this.lastTime = time;
        }
        if (count === 0) {
            const v = this.rateOverTime.getValue(playTime);
            const delta = time - this.lastTime;
            count = Math.floor(v * delta);
            if (count >= 1) {
                this.lastTime = time;
            }
        }
        return count < maxCount ? count : maxCount;
    }
}
exports.EmissionModule = EmissionModule;
});
