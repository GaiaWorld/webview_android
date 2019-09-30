_$define("pi/math/triangle", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @description 三角形
 */
const line3_1 = require("./line3");
const plane_1 = require("./plane");
const vector3_1 = require("./vector3");
/**
 * 注：不能在这里初始化，否则会引起模块的循环引用
 */
// tslint:disable:variable-name
let _v1;
let _v2;
let _v3;
let _plane;
let _edgeList;
class Triangle {
    /**
     * @description
     */
    constructor(a, b, c) {
        // tslint:disable:no-constant-condition
        this.a = (a !== undefined) ? a : new vector3_1.Vector3();
        this.b = (b !== undefined) ? b : new vector3_1.Vector3();
        this.c = (c !== undefined) ? c : new vector3_1.Vector3();
    }
    /**
     * @description
     */
    static normal(a, b, c, optionalTarget) {
        if (_v1 === undefined)
            _v1 = new vector3_1.Vector3();
        const result = optionalTarget || new vector3_1.Vector3();
        result.subVectors(c, b);
        _v1.subVectors(a, b);
        result.cross(_v1);
        const resultLengthSq = result.lengthSq();
        if (resultLengthSq > 0) {
            return result.multiplyScalar(1 / Math.sqrt(resultLengthSq));
        }
        return result.set(0, 0, 0);
    }
    /**
     * @description
     */
    // tslint:disable-next-line:typedef
    static barycoordFromPoint(point, a, b, c, optionalTarget) {
        // static/instance method to calculate barycentric coordinates
        // based on: http://www.blackpawn.com/texts/pointinpoly/default.html
        if (_v1 === undefined)
            _v1 = new vector3_1.Vector3();
        if (_v2 === undefined)
            _v2 = new vector3_1.Vector3();
        if (_v3 === undefined)
            _v3 = new vector3_1.Vector3();
        _v1.subVectors(c, a);
        _v2.subVectors(b, a);
        _v3.subVectors(point, a);
        const dot00 = _v1.dot(_v1);
        const dot01 = _v1.dot(_v2);
        const dot02 = _v1.dot(_v3);
        const dot11 = _v2.dot(_v2);
        const dot12 = _v2.dot(_v3);
        const denom = (dot00 * dot11 - dot01 * dot01);
        const result = optionalTarget || new vector3_1.Vector3();
        // collinear or singular triangle
        if (denom === 0) {
            // arbitrary location outside of triangle?
            // not sure if this is the best idea, maybe should be returning undefined
            return result.set(-2, -1, -1);
        }
        const invDenom = 1 / denom;
        const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
        const v = (dot00 * dot12 - dot01 * dot02) * invDenom;
        // barycentric coordinates must always sum to 1
        return result.set(1 - u - v, v, u);
    }
    /**
     * @description
     */
    static containsPoint(point, a, b, c) {
        if (_v1 === undefined)
            _v1 = new vector3_1.Vector3();
        const result = Triangle.barycoordFromPoint(point, a, b, c, _v1);
        return (result.x >= 0) && (result.y >= 0) && ((result.x + result.y) <= 1);
    }
    /**
     * @description
     */
    // tslint:disable-next-line:no-reserved-keywords
    set(a, b, c) {
        this.a.copy(a);
        this.b.copy(b);
        this.c.copy(c);
        return this;
    }
    /**
     * @description
     */
    setFromPointsAndIndices(points, i0, i1, i2) {
        this.a.copy(points[i0]);
        this.b.copy(points[i1]);
        this.c.copy(points[i2]);
        return this;
    }
    /**
     * @description
     */
    clone() {
        return new Triangle().copy(this);
    }
    /**
     * @description
     */
    copy(triangle) {
        this.a.copy(triangle.a);
        this.b.copy(triangle.b);
        this.c.copy(triangle.c);
        return this;
    }
    /**
     * @description
     */
    area() {
        if (_v1 === undefined)
            _v1 = new vector3_1.Vector3();
        if (_v2 === undefined)
            _v2 = new vector3_1.Vector3();
        _v1.subVectors(this.c, this.b);
        _v2.subVectors(this.a, this.b);
        return _v1.cross(_v2).length() * 0.5;
    }
    /**
     * @description
     */
    midpoint(optionalTarget) {
        const result = optionalTarget || new vector3_1.Vector3();
        return result.addVectors(this.a, this.b).add(this.c).multiplyScalar(1 / 3);
    }
    /**
     * @description
     */
    normal(optionalTarget) {
        return Triangle.normal(this.a, this.b, this.c, optionalTarget);
    }
    /**
     * @description
     */
    plane(optionalTarget) {
        const result = optionalTarget || new plane_1.Plane();
        return result.setFromCoplanarPoints(this.a, this.b, this.c);
    }
    /**
     * @description
     */
    barycoordFromPoint(point, optionalTarget) {
        return Triangle.barycoordFromPoint(point, this.a, this.b, this.c, optionalTarget);
    }
    /**
     * @description
     */
    containsPoint(point) {
        return Triangle.containsPoint(point, this.a, this.b, this.c);
    }
    /**
     * @description
     */
    closestPointToPoint(point, optionalTarget) {
        if (_v1 === undefined)
            _v1 = new vector3_1.Vector3();
        if (_v2 === undefined)
            _v2 = new vector3_1.Vector3();
        if (_plane === undefined)
            _plane = new plane_1.Plane();
        if (_edgeList === undefined)
            _edgeList = [new line3_1.Line3(), new line3_1.Line3(), new line3_1.Line3()];
        const projectedPoint = _v1;
        const closestPoint = _v2;
        const result = optionalTarget || new vector3_1.Vector3();
        let minDistance = Infinity;
        // project the point onto the plane of the triangle
        _plane.setFromCoplanarPoints(this.a, this.b, this.c);
        _plane.projectPoint(point, projectedPoint);
        // check if the projection lies within the triangle
        if (this.containsPoint(projectedPoint) === true) {
            // if so, this is the closest point
            result.copy(projectedPoint);
        }
        else {
            // if not, the point falls outside the triangle. the result is the closest point to the triangle's edges or vertices
            _edgeList[0].set(this.a, this.b);
            _edgeList[1].set(this.b, this.c);
            _edgeList[2].set(this.c, this.a);
            for (let i = 0; i < _edgeList.length; i++) {
                _edgeList[i].closestPointToPoint(projectedPoint, true, closestPoint);
                const distance = projectedPoint.distanceToSq(closestPoint);
                if (distance < minDistance) {
                    minDistance = distance;
                    result.copy(closestPoint);
                }
            }
        }
        return result;
    }
    /**
     * @description
     */
    equals(triangle) {
        return triangle.a.equals(this.a) && triangle.b.equals(this.b) && triangle.c.equals(this.c);
    }
}
exports.Triangle = Triangle;
});
