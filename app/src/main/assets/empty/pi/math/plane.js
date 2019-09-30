_$define("pi/math/plane", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const matrix4_1 = require("./matrix4");
const vector3_1 = require("./vector3");
/**
 * 注：不能在这里初始化，否则会引起模块的循环引用
 */
/* tslint:disable:variable-name no-constant-condition no-reserved-keywords*/
let _v1;
let _v2;
let _m;
class Plane {
    /**
     * @description 构造
     */
    constructor(normal, constant) {
        this.normal = (normal !== undefined) ? normal : new vector3_1.Vector3(1, 0, 0);
        this.constant = (constant !== undefined) ? constant : 0;
    }
    /**
     * @description 设置
     */
    set(normal, constant) {
        this.normal.copy(normal);
        this.constant = constant;
        return this;
    }
    /**
     * @description 分量设置
     */
    setComponents(x, y, z, w) {
        this.normal.set(x, y, z);
        this.constant = w;
        return this;
    }
    /**
     * @description 从法线和点设置
     */
    setFromNormalAndCoplanarPoint(normal, point) {
        this.normal.copy(normal);
        this.constant = -point.dot(this.normal); // must be this.normal, not normal, as this.normal is normalized
        return this;
    }
    /**
     * @description 从三个点设置
     */
    setFromCoplanarPoints(a, b, c) {
        if (_v1 === undefined)
            _v1 = new vector3_1.Vector3();
        if (_v2 === undefined)
            _v2 = new vector3_1.Vector3();
        const normal = _v1.subVectors(c, b).cross(_v2.subVectors(a, b)).normalize();
        // Q: should an error be thrown if normal is zero (e.g. degenerate plane)?
        this.setFromNormalAndCoplanarPoint(normal, a);
        return this;
    }
    /**
     * @description 克隆
     */
    clone() {
        return new Plane().copy(this);
    }
    /**
     * @description 拷贝
     */
    copy(plane) {
        this.normal.copy(plane.normal);
        this.constant = plane.constant;
        return this;
    }
    /**
     * @description 单位化
     */
    normalize() {
        // Note: will lead to a divide by zero if the plane is invalid.
        /* tslint:disable:number-literal-format */
        const inverseNormalLength = 1.0 / this.normal.length();
        this.normal.multiplyScalar(inverseNormalLength);
        this.constant *= inverseNormalLength;
        return this;
    }
    /**
     * @description 取反
     */
    negate() {
        this.constant *= -1;
        this.normal.negate();
        return this;
    }
    /**
     * @description 点距离
     */
    distanceToPoint(point) {
        return this.normal.dot(point) + this.constant;
    }
    /**
     * @description 球距离
     */
    distanceToSphere(sphere) {
        return this.distanceToPoint(sphere.center) - sphere.radius;
    }
    /**
     * @description 点投影
     */
    projectPoint(point, optionalTarget) {
        return this.orthoPoint(point, optionalTarget).sub(point).negate();
    }
    /**
     * @description 点正交
     */
    orthoPoint(point, optionalTarget) {
        const perpendicularMagnitude = this.distanceToPoint(point);
        const result = optionalTarget || new vector3_1.Vector3();
        return result.copy(this.normal).multiplyScalar(perpendicularMagnitude);
    }
    /**
     * @description 与线段相交的点
     */
    intersectLine(line, optionalTarget) {
        if (_v1 === undefined)
            _v1 = new vector3_1.Vector3();
        const result = optionalTarget || new vector3_1.Vector3();
        const direction = line.delta(_v1);
        const denominator = this.normal.dot(direction);
        if (denominator === 0) {
            // line is coplanar, return origin
            if (this.distanceToPoint(line.start) === 0) {
                return result.copy(line.start);
            }
            // Unsure if this is the correct method to handle this case.
            return undefined;
        }
        const t = -(line.start.dot(this.normal) + this.constant) / denominator;
        if (t < 0 || t > 1) {
            return undefined;
        }
        return result.copy(direction).multiplyScalar(t).add(line.start);
    }
    /**
     * @description 是否与线段相交
     */
    intersectsLine(line) {
        // Note: this tests if a line intersects the plane, not whether it (or its end-points) are coplanar with it.
        const startSign = this.distanceToPoint(line.start);
        const endSign = this.distanceToPoint(line.end);
        return (startSign < 0 && endSign > 0) || (endSign < 0 && startSign > 0);
    }
    /**
     * @description 是否与aabb相交
     */
    intersectsAABB(aabb) {
        return aabb.intersectsPlane(this);
    }
    /**
     * @description 是否与球相交
     */
    intersectsSphere(sphere) {
        return sphere.intersectsPlane(this);
    }
    /**
     * @description 平面点
     */
    coplanarPoint(optionalTarget) {
        const result = optionalTarget || new vector3_1.Vector3();
        return result.copy(this.normal).multiplyScalar(-this.constant);
    }
    /**
     * @description 应用矩阵
     */
    applyMatrix4(matrix, optionalNormalMatrix) {
        if (_v1 === undefined)
            _v1 = new vector3_1.Vector3();
        if (_m === undefined)
            _m = new matrix4_1.Matrix4();
        const referencePoint = this.coplanarPoint(_v1).applyPoint(matrix);
        // transform normal based on theory here:
        // http://www.songho.ca/opengl/gl_normaltransform.html
        const normalMatrix = optionalNormalMatrix || _m.getNormalMatrix(matrix);
        const normal = this.normal.applyVector(normalMatrix).normalize();
        // recalculate constant (like in setFromNormalAndCoplanarPoint)
        this.constant = -referencePoint.dot(normal);
        return this;
    }
    /**
     * @description 平移
     */
    translate(offset) {
        this.constant = this.constant - offset.dot(this.normal);
        return this;
    }
    /**
     * @description 是否相等
     */
    equal(plane) {
        return plane.normal.equals(this.normal) && (plane.constant === this.constant);
    }
}
exports.Plane = Plane;
});
