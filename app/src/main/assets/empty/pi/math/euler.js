_$define("pi/math/euler", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 旋转的优先顺序
 */
const math_1 = require("../util/math");
const matrix4_1 = require("./matrix4");
const quaternion_1 = require("./quaternion");
const vector3_1 = require("./vector3");
var RotationOrder;
(function (RotationOrder) {
    RotationOrder[RotationOrder["XYZ"] = 0] = "XYZ";
    RotationOrder[RotationOrder["YZX"] = 1] = "YZX";
    RotationOrder[RotationOrder["ZXY"] = 2] = "ZXY";
    RotationOrder[RotationOrder["XZY"] = 3] = "XZY";
    RotationOrder[RotationOrder["YXZ"] = 4] = "YXZ";
    RotationOrder[RotationOrder["ZYX"] = 5] = "ZYX";
})(RotationOrder = exports.RotationOrder || (exports.RotationOrder = {}));
/**
 * 默认顺序
 */
const DEFAULT_ORDER = RotationOrder.YXZ;
/**
 * @description 欧拉角
 */
class Euler {
    /**
     * @description 构造函数
     */
    constructor(x, y, z, order) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
        this.order = order || DEFAULT_ORDER;
    }
    /**
     * @description 设置
     */
    /* tslint:disable:no-reserved-keywords */
    set(x, y, z, order) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.order = order || this.order;
        return this;
    }
    /**
     * @description 克隆
     */
    clone() {
        return new Euler(this.x, this.y, this.z, this.order);
    }
    /**
     * @description 拷贝
     */
    copy(euler) {
        this.x = euler.x;
        this.y = euler.y;
        this.z = euler.z;
        this.order = euler.order;
        return this;
    }
    /**
     * @description 从四元数构建
     */
    setFromQuaternion(q, order) {
        if (!Euler._m) {
            Euler._m = new matrix4_1.Matrix4();
        }
        Euler._m.makeRotationFromQuaternion(q);
        this.setFromRotationMatrix(Euler._m, order);
        return this;
    }
    /**
     * @description 从三维向量构建
     */
    setFromVector3(v, order) {
        return this.set(v.x, v.y, v.z, order || this.order);
    }
    /**
     * @description 重新设置order
     */
    reorder(order) {
        // WARNING: this discards revolution information -bhouston
        if (!Euler._q) {
            Euler._q = new quaternion_1.Quaternion();
        }
        Euler._q.setFromEuler(this);
        this.setFromQuaternion(Euler._q, order);
    }
    /**
     * @description 判断相等
     */
    equal(euler) {
        return math_1.equal(euler.x, this.x) && math_1.equal(euler.y, this.y) && math_1.equal(euler.z, this.z) && math_1.equal(euler.order, this.order);
    }
    /**
     * @description 从数组构建
     * @param array 元素依次是：x, y, z, order; order可以没有
     */
    fromArray(array) {
        this.x = array[0];
        this.y = array[1];
        this.z = array[2];
        if (array[3] !== undefined) {
            this.order = array[3];
        }
        return this;
    }
    /**
     * @description 把euler的值写到array的第offset索引中
     */
    toArray(array, offset) {
        if (array === undefined)
            array = [];
        if (offset === undefined)
            offset = 0;
        array[offset] = this.x;
        array[offset + 1] = this.y;
        array[offset + 2] = this.z;
        array[offset + 3] = this.order;
        return array;
    }
    /**
     * @description 把euler的值写到vector3中
     */
    toVector3(vec) {
        if (vec) {
            return vec.set(this.x, this.y, this.z);
        }
        else {
            return new vector3_1.Vector3(this.x, this.y, this.z);
        }
    }
    /**
     * @description 从旋转矩阵中构建
     * @param m 必须是旋转矩阵，无缩放分量
     */
    setFromRotationMatrix(m, order) {
        const te = m.elements;
        const m11 = te[0];
        const m12 = te[4];
        const m13 = te[8];
        const m21 = te[1];
        const m22 = te[5];
        const m23 = te[9];
        const m31 = te[2];
        const m32 = te[6];
        const m33 = te[10];
        order = order || this.order;
        if (order === RotationOrder.XYZ) {
            this.y = Math.asin(math_1.clamp(m13, -1, 1));
            if (Math.abs(m13) < 0.99999) {
                this.x = Math.atan2(-m23, m33);
                this.z = Math.atan2(-m12, m11);
            }
            else {
                this.x = Math.atan2(m32, m22);
                this.z = 0;
            }
        }
        else if (order === RotationOrder.YXZ) {
            this.x = Math.asin(-math_1.clamp(m23, -1, 1));
            if (Math.abs(m23) < 0.99999) {
                this.y = Math.atan2(m13, m33);
                this.z = Math.atan2(m21, m22);
            }
            else {
                this.y = Math.atan2(-m31, m11);
                this.z = 0;
            }
        }
        else if (order === RotationOrder.ZXY) {
            this.x = Math.asin(math_1.clamp(m32, -1, 1));
            if (Math.abs(m32) < 0.99999) {
                this.y = Math.atan2(-m31, m33);
                this.z = Math.atan2(-m12, m22);
            }
            else {
                this.y = 0;
                this.z = Math.atan2(m21, m11);
            }
        }
        else if (order === RotationOrder.ZYX) {
            this.y = Math.asin(-math_1.clamp(m31, -1, 1));
            if (Math.abs(m31) < 0.99999) {
                this.x = Math.atan2(m32, m33);
                this.z = Math.atan2(m21, m11);
            }
            else {
                this.x = 0;
                this.z = Math.atan2(-m12, m22);
            }
        }
        else if (order === RotationOrder.YZX) {
            this.z = Math.asin(math_1.clamp(m21, -1, 1));
            if (Math.abs(m21) < 0.99999) {
                this.x = Math.atan2(-m23, m22);
                this.y = Math.atan2(-m31, m11);
            }
            else {
                this.x = 0;
                this.y = Math.atan2(m13, m33);
            }
        }
        else if (order === RotationOrder.XZY) {
            this.z = Math.asin(-math_1.clamp(m12, -1, 1));
            if (Math.abs(m12) < 0.99999) {
                this.x = Math.atan2(m32, m22);
                this.y = Math.atan2(m13, m11);
            }
            else {
                this.x = Math.atan2(-m23, m33);
                this.y = 0;
            }
        }
        else {
            console.warn(`THREE.Euler: .setFromRotationMatrix() given unsupported order: ${order}`);
        }
        this.order = order;
        return this;
    }
}
exports.Euler = Euler;
});
