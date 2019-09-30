_$define("pi/math/spherical", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @description 球面坐标
 */
const math_1 = require("../util/math");
class Spherical {
    /**
     * @description 构造函数
     */
    constructor(radius, phi, theta) {
        this.radius = radius !== undefined ? radius : 1.0;
        this.phi = phi !== undefined ? phi : 0.0;
        this.theta = theta !== undefined ? theta : 0.0;
    }
    /**
     * @description 设置
     */
    // tslint:disable-next-line:no-reserved-keywords
    set(radius, phi, theta) {
        this.radius = radius;
        this.phi = phi;
        this.theta = theta;
    }
    /**
     * @description 克隆
     */
    clone() {
        return new Spherical().copy(this);
    }
    /**
     * @description 拷贝
     */
    copy(src) {
        this.radius = src.radius;
        this.phi = src.phi;
        this.theta = src.theta;
        return this;
    }
    /**
     * @description 限制phi在 [EPS, Pi - EPS]
     */
    makeSafe() {
        const EPS = 0.0001;
        this.phi = Math.max(EPS, Math.min(Math.PI - EPS, this.phi));
    }
    /**
     * @description 直角坐标转球面坐标
     */
    setFromVector3(v) {
        this.radius = v.length();
        if (this.radius === 0) {
            this.theta = 0;
            this.phi = 0;
        }
        else {
            this.theta = Math.atan2(v.x, v.z);
            this.phi = Math.acos(math_1.clamp(v.y / this.radius, -1, 1));
        }
        return this;
    }
}
exports.Spherical = Spherical;
});
