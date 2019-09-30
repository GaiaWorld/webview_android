_$define("pi/math/aabb", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sphere_1 = require("./sphere");
const vector3_1 = require("./vector3");
/**
 * 注：不能在这里初始化，否则会引起模块的循环引用
 */
/* tslint:disable:variable-name no-constant-condition no-reserved-keywords*/
let _v1;
let _points;
class AABB {
    /**
     * @description 构造
     */
    constructor(min, max) {
        this.min = (min !== undefined) ? min : new vector3_1.Vector3(+Infinity, +Infinity, +Infinity);
        this.max = (max !== undefined) ? max : new vector3_1.Vector3(-Infinity, -Infinity, -Infinity);
    }
    /**
     * * @description 设置
     */
    set(min, max) {
        this.min.copy(min);
        this.max.copy(max);
        return this;
    }
    /**
     * @description 从数组中设置
     */
    setFromArray(array) {
        let minX = +Infinity;
        let minY = +Infinity;
        let minZ = +Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        let maxZ = -Infinity;
        for (let i = 0, l = array.length; i < l; i += 3) {
            const x = array[i];
            const y = array[i + 1];
            const z = array[i + 2];
            if (x < minX)
                minX = x;
            if (y < minY)
                minY = y;
            if (z < minZ)
                minZ = z;
            if (x > maxX)
                maxX = x;
            if (y > maxY)
                maxY = y;
            if (z > maxZ)
                maxZ = z;
        }
        this.min.set(minX, minY, minZ);
        this.max.set(maxX, maxY, maxZ);
    }
    /**
     * @description 一堆点里面设置包围盒
     */
    setFromPoints(points) {
        this.makeEmpty();
        for (let i = 0, il = points.length; i < il; i++) {
            this.expandByPoint(points[i]);
        }
        return this;
    }
    /**
     * @description 从中心和大小设置
     */
    setFromCenterAndSize(center, size) {
        if (_v1 === undefined)
            _v1 = new vector3_1.Vector3();
        const halfSize = _v1.copy(size).multiplyScalar(0.5);
        this.min.copy(center).sub(halfSize);
        this.max.copy(center).add(halfSize);
        return this;
    }
    /**
     * @description 克隆
     */
    clone() {
        return new AABB().copy(this);
    }
    /**
     * @description 拷贝
     */
    copy(box) {
        this.min.copy(box.min);
        this.max.copy(box.max);
        return this;
    }
    /**
     * @description 设置为空
     */
    makeEmpty() {
        this.min.x = this.min.y = this.min.z = +Infinity;
        this.max.x = this.max.y = this.max.z = -Infinity;
        return this;
    }
    /**
     * @description 判断是否为空
     */
    isEmpty() {
        // this is a more robust check for empty than ( volume <= 0 ) because volume can get positive with two negative axes
        return (this.max.x < this.min.x) || (this.max.y < this.min.y) || (this.max.z < this.min.z);
    }
    /**
     * @description 取中心
     */
    center(optionalTarget) {
        const result = optionalTarget || new vector3_1.Vector3();
        return result.addVectors(this.min, this.max).multiplyScalar(0.5);
    }
    /**
     * @description 取大小
     */
    size(optionalTarget) {
        const result = optionalTarget || new vector3_1.Vector3();
        return result.subVectors(this.max, this.min);
    }
    /**
     * @description 从点point扩展
     */
    expandByPoint(point) {
        this.min.min(point);
        this.max.max(point);
        return this;
    }
    /**
     * @description 从向量扩展
     */
    expandByVector(vector) {
        this.min.sub(vector);
        this.max.add(vector);
        return this;
    }
    /**
     * @description 从scalar扩展
     */
    expandByScalar(scalar) {
        this.min.addScalar(-scalar);
        this.max.addScalar(scalar);
        return this;
    }
    /**
     * @description 是否包含点
     */
    containsPoint(point) {
        if (point.x < this.min.x || point.x > this.max.x ||
            point.y < this.min.y || point.y > this.max.y ||
            point.z < this.min.z || point.z > this.max.z) {
            return false;
        }
        return true;
    }
    /**
     * @description 是否包含box
     */
    containsBox(box) {
        if ((this.min.x <= box.min.x) && (box.max.x <= this.max.x) &&
            (this.min.y <= box.min.y) && (box.max.y <= this.max.y) &&
            (this.min.z <= box.min.z) && (box.max.z <= this.max.z)) {
            return true;
        }
        return false;
    }
    /**
     * @description 取参数
     */
    getParameter(point, optionalTarget) {
        // This can potentially have a divide by zero if the box
        // has a size dimension of 0.
        const result = optionalTarget || new vector3_1.Vector3();
        return result.set((point.x - this.min.x) / (this.max.x - this.min.x), (point.y - this.min.y) / (this.max.y - this.min.y), (point.z - this.min.z) / (this.max.z - this.min.z));
    }
    /**
     * @description 是否和box相交
     */
    intersectsBox(box) {
        // using 6 splitting planes to rule out intersections.
        if (box.max.x < this.min.x || box.min.x > this.max.x ||
            box.max.y < this.min.y || box.min.y > this.max.y ||
            box.max.z < this.min.z || box.min.z > this.max.z) {
            return false;
        }
        return true;
    }
    /**
     * @description 是否和球面相交
     */
    intersectsSphere(sphere) {
        if (_v1 === undefined)
            _v1 = new vector3_1.Vector3();
        const closestPoint = _v1;
        // Find the point on the AABB closest to the sphere center.
        this.clampPoint(sphere.center, closestPoint);
        // If that point is inside the sphere, the AABB and sphere intersect.
        return closestPoint.distanceToSq(sphere.center) <= (sphere.radius * sphere.radius);
    }
    /**
     * @description 是否和平面相交
     */
    intersectsPlane(plane) {
        // We compute the minimum and maximum dot product values. If those values
        // are on the same side (back or front) of the plane, then there is no intersection.
        let min;
        let max;
        if (plane.normal.x > 0) {
            min = plane.normal.x * this.min.x;
            max = plane.normal.x * this.max.x;
        }
        else {
            min = plane.normal.x * this.max.x;
            max = plane.normal.x * this.min.x;
        }
        if (plane.normal.y > 0) {
            min += plane.normal.y * this.min.y;
            max += plane.normal.y * this.max.y;
        }
        else {
            min += plane.normal.y * this.max.y;
            max += plane.normal.y * this.min.y;
        }
        if (plane.normal.z > 0) {
            min += plane.normal.z * this.min.z;
            max += plane.normal.z * this.max.z;
        }
        else {
            min += plane.normal.z * this.max.z;
            max += plane.normal.z * this.min.z;
        }
        return (min <= plane.constant && max >= plane.constant);
    }
    /**
     * @description 根据包围盒裁剪点
     */
    clampPoint(point, optionalTarget) {
        const result = optionalTarget || new vector3_1.Vector3();
        return result.copy(point).clamp(this.min, this.max);
    }
    /**
     * @description 包围盒到点的距离
     */
    distanceToPoint(point) {
        if (_v1 === undefined)
            _v1 = new vector3_1.Vector3();
        const clampedPoint = _v1.copy(point).clamp(this.min, this.max);
        return clampedPoint.sub(point).length();
    }
    /**
     * @description 取包围球
     */
    getBoundingSphere(optionalTarget) {
        if (_v1 === undefined)
            _v1 = new vector3_1.Vector3();
        const result = optionalTarget || new sphere_1.Sphere();
        result.center = this.center();
        result.radius = this.size(_v1).length() * 0.5;
        return result;
    }
    /**
     * @description 相交
     */
    intersect(box) {
        this.min.max(box.min);
        this.max.min(box.max);
        // ensure that if there is no overlap, the result is fully empty
        // not slightly empty with non-inf/+inf values that will cause subsequence intersects to erroneously return valid values.
        if (this.isEmpty())
            this.makeEmpty();
        return this;
    }
    /**
     * @description 合并
     */
    union(box) {
        this.min.min(box.min);
        this.max.max(box.max);
        return this;
    }
    /**
     * @description 平移
     */
    translate(offset) {
        this.min.add(offset);
        this.max.add(offset);
        return this;
    }
    /**
     * @description 判断是否相等
     */
    equal(box) {
        return box.min.equals(this.min) && box.max.equals(this.max);
    }
    /**
     * @description 应用矩阵到aabb
     */
    applyMatrix4(matrix) {
        if (_points === undefined) {
            _points = [
                new vector3_1.Vector3(), new vector3_1.Vector3(), new vector3_1.Vector3(),
                new vector3_1.Vector3(), new vector3_1.Vector3(), new vector3_1.Vector3(),
                new vector3_1.Vector3(), new vector3_1.Vector3()
            ];
        }
        // transform of empty box is an empty box.
        if (this.isEmpty())
            return this;
        // NOTE: I am using a binary pattern to specify all 2^3 combinations below
        _points[0].set(this.min.x, this.min.y, this.min.z).applyPoint(matrix); // 000
        _points[1].set(this.min.x, this.min.y, this.max.z).applyPoint(matrix); // 001
        _points[2].set(this.min.x, this.max.y, this.min.z).applyPoint(matrix); // 010
        _points[3].set(this.min.x, this.max.y, this.max.z).applyPoint(matrix); // 011
        _points[4].set(this.max.x, this.min.y, this.min.z).applyPoint(matrix); // 100
        _points[5].set(this.max.x, this.min.y, this.max.z).applyPoint(matrix); // 101
        _points[6].set(this.max.x, this.max.y, this.min.z).applyPoint(matrix); // 110
        _points[7].set(this.max.x, this.max.y, this.max.z).applyPoint(matrix); // 111
        this.setFromPoints(_points);
        return this;
    }
}
exports.AABB = AABB;
});
