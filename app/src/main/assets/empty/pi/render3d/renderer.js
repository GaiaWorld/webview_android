_$define("pi/render3d/renderer", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 */
const scene_1 = require("./scene");
const three_1 = require("./three");
/**
 * @description Renderer
 */
class Renderer {
    /**
     * @description 构造函数
     * @param antialias 是否抗锯齿，默认不开
     */
    constructor(width, height, antialias = false, ratio = 1.0) {
        this.canUseVertexTexture = false;
        this.impl = new three_1.THREE.WebGLRenderer({
            alpha: true,
            antialias: antialias
        });
        this.size = {
            width: width,
            height: height
        };
        this.impl.autoClear = true;
        this.impl.setSize(width, height);
        this.impl.setPixelRatio(ratio);
        if (this.impl.capabilities) {
            const nVertexUniforms = this.impl.capabilities.maxVertexUniforms;
            const maxBones = Math.floor((nVertexUniforms - 60) / 4);
            if (maxBones < 40) {
                console.log(`+++ warning: maxBones = ${maxBones} < 40, useVertexTexture: ${this.canUseVertexTexture}`);
                this.canUseVertexTexture = this.impl.capabilities.floatVertexTextures > 0;
            }
        }
    }
    /**
     * @description 是否可用顶点纹理
     */
    useVertexTexture() {
        return this.canUseVertexTexture;
    }
    /**
     * @description 设置canvas的清空色
     * rgb：十六进制整数表示的颜色值，0xRRGGBB
     * alpha: [0, 1]
     */
    // tslint:disable-next-line:typedef
    setClearColor(rgb, alpha) {
        this.impl.setClearColor(rgb, alpha);
    }
    /**
     * @description 是否设备丢失
     */
    isContextLost() {
        return this.impl.isContextLost();
    }
    /**
     * @description 强制设备丢失
     */
    forceContextLoss() {
        this.impl.forceContextLoss();
    }
    /**
     * 更新几何体
     */
    // tslint:disable-next-line:typedef
    updateGeometry(mesh) {
        this.impl.updateGeometry(mesh);
    }
    /**
     * 设置纹理
     */
    // tslint:disable-next-line:typedef
    setTexture2D(texture) {
        this.impl.setTexture2D(texture, 0);
    }
    /**
     * @description 取Threejs渲染器
     */
    getThreeRenderer() {
        return this.impl;
    }
    /**
     * @description 返回canvas标签
     */
    getCanvas() {
        return this.impl.domElement;
    }
    /**
     * @description 设置canvas和webgl环境的宽高
     */
    // tslint:disable-next-line:typedef
    setSize(width, height) {
        this.size.width = width;
        this.size.height = height;
        this.impl.setSize(width, height);
    }
    /**
     * @description 获取canvas和webgl环境的宽高
     */
    getSize() {
        return this.size;
    }
    /**
     * @description 创建对应的渲染场景
     * @return Scene的实例
     */
    createScene(data) {
        return scene_1.createScene(this, data);
    }
}
exports.Renderer = Renderer;
});
