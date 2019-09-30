_$define("pi/math/line3", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @description 线段
 */
const math_1 = require("../util/math");
const vector3_1 = require("./vector3");
/**
 * 注：不能在这里初始化，否则会引起模块的循环引用
 */
/* tslint:disable:variable-name no-constant-condition no-reserved-keywords*/
let _v1;
let _v2;
class Line3 {
    /**
     * @description 构造
     */
    constructor(start, end) {
        this.start = (start !== undefined) ? start : new vector3_1.Vector3();
        this.end = (end !== undefined) ? end : new vector3_1.Vector3();
    }
    /**
     * @description 设置
     */
    set(start, end) {
        this.start.copy(start);
        this.end.copy(end);
        return this;
    }
    /**
     * @description 克隆
     */
    clone() {
        return new Line3().copy(this);
    }
    /**
     * @description 拷贝
     */
    copy(line) {
        this.start.copy(line.start);
        this.end.copy(line.end);
        return this;
    }
    /**
     * @description 取中心点
     */
    center(optionalTarget) {
        const result = optionalTarget || new vector3_1.Vector3();
        return result.addVectors(this.start, this.end).multiplyScalar(0.5);
    }
    /**
     * @description 多长
     */
    delta(optionalTarget) {
        const result = optionalTarget || new vector3_1.Vector3();
        return result.subVectors(this.end, this.start);
    }
    /**
     * @description 距离平方
     */
    distanceSq() {
        return this.start.distanceToSq(this.end);
    }
    /**
     * @description 距离
     */
    distance() {
        return this.start.distanceTo(this.end);
    }
    /**
     * @description 伸缩
     */
    at(t, optionalTarget) {
        const result = optionalTarget || new vector3_1.Vector3();
        return this.delta(result).multiplyScalar(t).add(this.start);
    }
    /**
     * @description 最近距离
     */
    closestPointToPointParameter(point, clampToLine) {
        if (_v1 === undefined)
            _v1 = new vector3_1.Vector3();
        if (_v2 === undefined)
            _v2 = new vector3_1.Vector3();
        const startP = _v1;
        const startEnd = _v2;
        startP.subVectors(point, this.start);
        startEnd.subVectors(this.end, this.start);
        const startEnd2 = startEnd.dot(startEnd);
        const startEnd_startP = startEnd.dot(startP);
        let t = startEnd_startP / startEnd2;
        if (clampToLine) {
            t = math_1.clamp(t, 0, 1);
        }
        return t;
    }
    /**
     * @description 最近距离
     */
    closestPointToPoint(point, clampToLine, optionalTarget) {
        const t = this.closestPointToPointParameter(point, clampToLine);
        const result = optionalTarget || new vector3_1.Vector3();
        return this.delta(result).multiplyScalar(t).add(this.start);
    }
    /**
     * @description 矩阵应用
     */
    applyMatrix4(matrix) {
        this.start.applyPoint(matrix);
        this.end.applyPoint(matrix);
        return this;
    }
    /**
     * @description 是否相等
     */
    equal(line) {
        return line.start.equals(this.start) && line.end.equals(this.end);
    }
}
exports.Line3 = Line3;
});
