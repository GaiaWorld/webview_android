_$define("pi/math/sphere", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vector3_1 = require("./vector3");
const aabb_1 = require("./aabb");
/**
 * 注：不能在这里初始化，否则会引起模块的循环引用
 */
// tslint:disable-next-line:variable-name
let _aabb;
class Sphere {
    /**
     * @description 构造
     */
    constructor(center, radius) {
        // tslint:disable:no-constant-condition
        this.center = (center !== undefined) ? center : new vector3_1.Vector3();
        this.radius = (radius !== undefined) ? radius : 0;
    }
    /**
     * @description 设置
     */
    // tslint:disable-next-line:no-reserved-keywords
    set(center, radius) {
        this.center.copy(center);
        this.radius = radius;
        return this;
    }
    /**
     * @description 从点中设置
     */
    setFromPoints(points, optionalCenter) {
        if (_aabb === undefined)
            _aabb = new aabb_1.AABB();
        const center = this.center;
        if (optionalCenter !== undefined) {
            center.copy(optionalCenter);
        }
        else {
            _aabb.setFromPoints(points).center(center);
        }
        let maxRadiusSq = 0;
        for (let i = 0, il = points.length; i < il; i++) {
            maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSq(points[i]));
        }
        this.radius = Math.sqrt(maxRadiusSq);
        return this;
    }
    /**
     * @description 克隆
     */
    clone() {
        return new Sphere().copy(this);
    }
    /**
     * @description 拷贝
     */
    copy(sphere) {
        this.center.copy(sphere.center);
        this.radius = sphere.radius;
        return this;
    }
    /**
     * @description 是否为空
     */
    empty() {
        return (this.radius <= 0);
    }
    /**
     * @description 是否包含点
     */
    containsPoint(point) {
        return (point.distanceToSq(this.center) <= (this.radius * this.radius));
    }
    /**
     * @description 到点的距离
     */
    distanceToPoint(point) {
        return (point.distanceTo(this.center) - this.radius);
    }
    /**
     * @description 是否和球相交
     */
    intersectsSphere(sphere) {
        const radiusSum = this.radius + sphere.radius;
        return sphere.center.distanceToSq(this.center) <= (radiusSum * radiusSum);
    }
    /**
     * @description AABB相交
     */
    intersectsAABB(aabb) {
        return aabb.intersectsSphere(this);
    }
    /**
     * @description 平面相交
     */
    intersectsPlane(plane) {
        // We use the following equation to compute the signed distance from
        // the center of the sphere to the plane.
        //
        // distance = q * n - d
        //
        // If this distance is greater than the radius of the sphere,
        // then there is no intersection.
        return Math.abs(this.center.dot(plane.normal) - plane.constant) <= this.radius;
    }
    /**
     * @description 裁剪点
     */
    clampPoint(point, optionalTarget) {
        const deltaLengthSq = this.center.distanceToSq(point);
        const result = optionalTarget || new vector3_1.Vector3();
        result.copy(point);
        if (deltaLengthSq > (this.radius * this.radius)) {
            result.sub(this.center).normalize();
            result.multiplyScalar(this.radius).add(this.center);
        }
        return result;
    }
    /**
     * @description 取AABB
     */
    getBoundingBox(optionalTarget) {
        const box = optionalTarget || new aabb_1.AABB();
        box.set(this.center, this.center);
        box.expandByScalar(this.radius);
        return box;
    }
    /**
     * @description 矩阵应用
     */
    applyMatrix4(matrix) {
        this.center.applyPoint(matrix);
        this.radius = this.radius * matrix.getMaxScaleOnAxis();
        return this;
    }
    /**
     * @description 平移
     */
    translate(offset) {
        this.center.add(offset);
        return this;
    }
    /**
     * @description 相等
     */
    equal(sphere) {
        return sphere.center.equals(this.center) && (sphere.radius === this.radius);
    }
}
exports.Sphere = Sphere;
});
