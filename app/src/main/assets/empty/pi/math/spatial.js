_$define("pi/math/spatial", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @description 空间属性
 */
const matrix4_1 = require("./matrix4");
const quaternion_1 = require("./quaternion");
const vector3_1 = require("./vector3");
class Spatial {
    /**
     * @description 构造
     */
    constructor() {
        this.needUpdate = false;
        this.position = new vector3_1.Vector3();
        this.quaternion = new quaternion_1.Quaternion();
        this.scale = new vector3_1.Vector3();
        this.matrix = new matrix4_1.Matrix4();
    }
    /**
     * @description 设置位置
     */
    // tslint:disable-next-line:typedef
    setPostion(x, y, z) {
        this.position.set(x, y, z);
        this.needUpdate = true;
        return this;
    }
    /**
     * @description 设置方位
     */
    // tslint:disable-next-line:typedef
    setQuaternion(x, y, z, w) {
        this.quaternion.set(x, y, z, w);
        this.needUpdate = true;
        return this;
    }
    /**
     * @description 设置缩放
     */
    // tslint:disable-next-line:typedef
    setScale(x, y, z) {
        this.scale.set(x, y, z);
        this.needUpdate = true;
        return this;
    }
    // tslint:disable-next-line:no-reserved-keywords
    set(postion, quaternion, scale) {
        this.needUpdate = true;
        this.position.copy(postion);
        this.quaternion.copy(quaternion);
        this.scale.copy(scale);
        return this;
    }
    /**
     * @description 克隆
     */
    clone(spatial) {
        return new Spatial().copy(this);
    }
    /**
     * @description 拷贝
     */
    copy(spatial) {
        this.position.copy(spatial.position);
        this.quaternion.copy(spatial.quaternion);
        this.scale.copy(spatial.scale);
        this.needUpdate = true;
    }
    /**
     * @description 更新矩阵
     */
    update() {
        if (this.needUpdate) {
            this.needUpdate = false;
            this.matrix.compose(this.position, this.quaternion, this.scale);
        }
    }
}
exports.Spatial = Spatial;
});
