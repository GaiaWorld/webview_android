_$define("pi/render3d/babylon/loader", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="./babylon.d.ts"/>
const res_mgr_1 = require("../../util/res_mgr");
const geometry_1 = require("./geometry");
class ResLoader {
    constructor(resTab) {
        this.resTab = resTab;
    }
    loadTexture(url, noMipmap, sampling) {
        let r = this.resTab.get(textureKey(url, noMipmap, sampling));
        if (r) {
            return r.link;
        }
        else {
            return null;
        }
    }
    createTexture(texture) {
        //该load 是一个同步过程
        this.resTab.load(textureKey(texture.url, !texture.generateMipMaps, texture.samplingMode), BABYLON_TEXTURE_TYPE, texture, null, null, () => {
            console.log("createTexture fail!, url:", texture.url, "noMipmap:", texture.generateMipMaps, "sampling:", texture.samplingMode);
        });
    }
    //调用此方法应该保证resTab中存在该texture
    releaseTexture(texture) {
        if (!texture.url) {
            return false;
        }
        let res = this.resTab.get(textureKey(texture.url, !texture.generateMipMaps, texture.samplingMode));
        if (!res) {
            return false;
        }
        this.resTab.delete(res);
        return true;
    }
    loadGeometry(id) {
        let r = this.resTab.get(geometryKey(id));
        if (r) {
            return r.link;
        }
        else {
            return null;
        }
    }
    createGeometry(geometry) {
        //该load 是一个同步过程
        this.resTab.load(geometryKey(geometry.id), BABYLON_GEOMETRY_TYPE, geometry, null, null, () => {
            console.log("createGeometry fail!, url:", geometry.id);
        });
    }
    //调用此方法应该保证resTab中存在该texture
    releaseGeometry(id) {
        let res = this.resTab.get(geometryKey(id));
        this.resTab.delete(res);
    }
}
exports.ResLoader = ResLoader;
/**
 * @description 纹理资源
 * @example
 */
class TextureRes extends res_mgr_1.Res {
    /**
     * @description 创建
     * @example
     */
    create(data) {
        this.link = data;
    }
    /**
     * @description 销毁，需要子类重载
     * @example
     */
    destroy() {
        let r = this.link;
        if (r) {
            r._engine._releaseTexture(r);
            r._webGLTexture = null;
            r.previous = null;
            r.next = null;
        }
    }
}
exports.TextureRes = TextureRes;
/**
 * @description 纹理资源
 * @example
 */
class GeometryRes extends res_mgr_1.Res {
    /**
     * @description 创建
     * @example
     */
    create(data) {
        this.link = data;
    }
    /**
     * @description 销毁，需要子类重载
     * @example
     */
    destroy() {
        let r = this.link;
        if (r) {
            BABYLON.Geometry.prototype.dispose.call(r);
        }
    }
}
exports.GeometryRes = GeometryRes;
/**
 * 对Babylon的GLTFLoader进行扩展， 其目的是接管其VertexBuffer的加载, 对其进行缓冲！
 * 使用该扩展类， 你始终应该保证accessor引用的buffer是紧凑的数据（accessor没有bytesStride字段）， 并保证数据的offset可以整除数据类型的长度
 */
class GLTF2Loader extends BABYLON.GLTF2.GLTFLoader {
    //重载_loadVertexBufferViewAsync方法， 使其返回值为ArrayBufferView
    _loadVertexBufferViewAsync(bufferView, _kind) {
        if (bufferView._babylonBuffer) {
            return bufferView._babylonBuffer;
        }
        bufferView._babylonBuffer = this.loadBufferViewAsync(`#/bufferViews/${bufferView.index}`, bufferView).then((data) => {
            return data;
        });
        return bufferView._babylonBuffer;
    }
    //重载_loadVertexAccessorAsync方法， 使其不支持sparse， 并且偏移量只能是其类型长度的倍数
    _loadVertexAccessorAsync(context, accessor, kind) {
        if (accessor._babylonVertexBuffer) {
            return accessor._babylonVertexBuffer;
        }
        if (accessor.sparse || (accessor.byteOffset && accessor.byteOffset % BABYLON.VertexBuffer.GetTypeByteLength(accessor.componentType) !== 0)) {
            throw new Error("Accessor does not support s, and its cost should be integer multiple of its type.");
        }
        const bufferView = BABYLON.GLTF2.ArrayItem.Get(`${context}/bufferView`, this.gltf.bufferViews, accessor.bufferView);
        accessor._babylonVertexBuffer = this._loadVertexBufferViewAsync(bufferView, kind).then((babylonBuffer) => {
            const size = BABYLON.GLTF2.GLTFLoader._GetNumComponents(context, accessor.type);
            return new BABYLON.VertexBuffer(this.babylonScene.getEngine(), babylonBuffer, kind, false, false, null, false, accessor.byteOffset, size, accessor.componentType, accessor.normalized, true);
        });
        return accessor._babylonVertexBuffer;
    }
    //重载_loadVertexDataAsync， 缓存geo
    _loadVertexDataAsync(context, primitive, babylonMesh) {
        const accessor = BABYLON.GLTF2.ArrayItem.Get(`${context}/indices`, this.gltf.accessors, primitive.indices);
        const bufferView = BABYLON.GLTF2.ArrayItem.Get(`#/accessors/${accessor.index}/bufferView`, this.gltf.bufferViews, accessor.bufferView);
        const buffer = BABYLON.GLTF2.ArrayItem.Get(`#/bufferViews/${bufferView.index}/buffer`, this.gltf.buffers, bufferView.buffer);
        let url = this._rootUrl + buffer.uri;
        let r = GLTF2Loader.resLoader.loadGeometry(url);
        if (r) {
            return new Promise(() => { return r; });
        }
        else {
            let the = this;
            const extensionPromise = the._extensionsLoadVertexDataAsync(context, primitive, babylonMesh);
            if (extensionPromise) {
                return extensionPromise;
            }
            const attributes = primitive.attributes;
            if (!attributes) {
                throw new Error(`${context}: Attributes are missing`);
            }
            const promises = new Array();
            const babylonGeometry = new geometry_1.Geometry(url, this.babylonScene);
            GLTF2Loader.resLoader.createGeometry(babylonGeometry);
            if (primitive.indices == undefined) {
                babylonMesh.isUnIndexed = true;
            }
            else {
                promises.push(the._loadIndicesAccessorAsync(`#/accessors/${accessor.index}`, accessor).then((data) => {
                    babylonGeometry.setIndices(data);
                }));
            }
            const loadAttribute = (attribute, kind, callback) => {
                if (attributes[attribute] == undefined) {
                    return;
                }
                babylonMesh._delayInfo = babylonMesh._delayInfo || [];
                if (babylonMesh._delayInfo.indexOf(kind) === -1) {
                    babylonMesh._delayInfo.push(kind);
                }
                const accessor = BABYLON.GLTF2.ArrayItem.Get(`${context}/attributes/${attribute}`, this.gltf.accessors, attributes[attribute]);
                promises.push(this._loadVertexAccessorAsync(`#/accessors/${accessor.index}`, accessor, kind).then((babylonVertexBuffer) => {
                    babylonGeometry.setVerticesBuffer(babylonVertexBuffer, accessor.count);
                }));
                if (callback) {
                    callback(accessor);
                }
            };
            loadAttribute("POSITION", BABYLON.VertexBuffer.PositionKind);
            loadAttribute("NORMAL", BABYLON.VertexBuffer.NormalKind);
            loadAttribute("TANGENT", BABYLON.VertexBuffer.TangentKind);
            loadAttribute("TEXCOORD_0", BABYLON.VertexBuffer.UVKind);
            loadAttribute("TEXCOORD_1", BABYLON.VertexBuffer.UV2Kind);
            loadAttribute("JOINTS_0", BABYLON.VertexBuffer.MatricesIndicesKind);
            loadAttribute("WEIGHTS_0", BABYLON.VertexBuffer.MatricesWeightsKind);
            loadAttribute("COLOR_0", BABYLON.VertexBuffer.ColorKind, (accessor) => {
                if (accessor.type === BABYLON.GLTF2.AccessorType.VEC4) {
                    babylonMesh.hasVertexAlpha = true;
                }
            });
            return Promise.all(promises).then(() => {
                return babylonGeometry;
            });
        }
    }
    //重载_loadAnimationChannelAsync， 缓存keys
    _loadAnimationChannelAsync(context, animationContext, animation, channel, babylonAnimationGroup) {
        const targetNode = BABYLON.GLTF2.ArrayItem.Get(`${context}/target/node`, this.gltf.nodes, channel.target.node);
        // Ignore animations that have no animation targets.
        if ((channel.target.path === BABYLON.GLTF2.AnimationChannelTargetPath.WEIGHTS && !targetNode._numMorphTargets) ||
            (channel.target.path !== BABYLON.GLTF2.AnimationChannelTargetPath.WEIGHTS && !targetNode._babylonMesh)) {
            return Promise.resolve();
        }
        // Ignore animations targeting TRS of skinned nodes.
        // See https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#skins (second implementation note)
        if (targetNode.skin != undefined && channel.target.path !== BABYLON.GLTF2.AnimationChannelTargetPath.WEIGHTS) {
            return Promise.resolve();
        }
        const sampler = BABYLON.GLTF2.ArrayItem.Get(`${context}/sampler`, animation.samplers, channel.sampler);
        const inputAccessor = BABYLON.GLTF2.ArrayItem.Get(`${animationContext}/samplers/${channel.sampler}/input`, this.gltf.accessors, sampler.input);
        const bufferView = BABYLON.GLTF2.ArrayItem.Get(`#/bufferView`, this.gltf.bufferViews, inputAccessor.bufferView);
        const buffer = BABYLON.GLTF2.ArrayItem.Get(`#/bufferViews/${bufferView.index}/buffer`, this.gltf.buffers, bufferView.buffer);
        let url = this._rootUrl + buffer.uri;
        let targetPath;
        let animationType;
        switch (channel.target.path) {
            case BABYLON.GLTF2.AnimationChannelTargetPath.TRANSLATION: {
                targetPath = "position";
                animationType = BABYLON.Animation.ANIMATIONTYPE_VECTOR3;
                break;
            }
            case BABYLON.GLTF2.AnimationChannelTargetPath.ROTATION: {
                targetPath = "rotationQuaternion";
                animationType = BABYLON.Animation.ANIMATIONTYPE_QUATERNION;
                break;
            }
            case BABYLON.GLTF2.AnimationChannelTargetPath.SCALE: {
                targetPath = "scaling";
                animationType = BABYLON.Animation.ANIMATIONTYPE_VECTOR3;
                break;
            }
            case BABYLON.GLTF2.AnimationChannelTargetPath.WEIGHTS: {
                targetPath = "influence";
                animationType = BABYLON.Animation.ANIMATIONTYPE_FLOAT;
                break;
            }
            default: {
                throw new Error(`${context}/target/path: Invalid value (${channel.target.path})`);
            }
        }
        const influenceAnim = (keys) => {
            for (let targetIndex = 0; targetIndex < targetNode._numMorphTargets; targetIndex++) {
                const animationName = `${babylonAnimationGroup.name}_channel${babylonAnimationGroup.targetedAnimations.length}`;
                const babylonAnimation = new BABYLON.Animation(animationName, targetPath, 1, animationType);
                let iKeys = this.babylonScene.offlineProvider.loadAnimationKeys(url + "_" + 0);
                if (!iKeys) {
                    iKeys = keys.map((key) => ({
                        frame: key.frame,
                        inTangent: key.inTangent ? key.inTangent[targetIndex] : undefined,
                        value: key.value[targetIndex],
                        outTangent: key.outTangent ? key.outTangent[targetIndex] : undefined
                    }));
                    this.babylonScene.offlineProvider.createAnimationKeys(url + "_" + 0, iKeys);
                }
                babylonAnimation.setKeys(iKeys);
                this._forEachPrimitive(targetNode, (babylonMesh) => {
                    const morphTarget = babylonMesh.morphTargetManager.getTarget(targetIndex);
                    const babylonAnimationClone = babylonAnimation.clone();
                    morphTarget.animations.push(babylonAnimationClone);
                    babylonAnimationGroup.addTargetedAnimation(babylonAnimationClone, morphTarget);
                });
            }
        };
        if (targetPath === "influence") {
            if (!this.babylonScene.offlineProvider.loadAnimationKeys(url + "_" + 0)) {
                this._loadAnimationKeysAsync(context, animationContext, animation, channel, url).then((keys) => {
                    influenceAnim(keys);
                });
            }
            else {
                influenceAnim(null);
            }
        }
        else {
            this._loadAnimationKeysAsync(context, animationContext, animation, channel, url).then((keys) => {
                const animationName = `${babylonAnimationGroup.name}_channel${babylonAnimationGroup.targetedAnimations.length}`;
                const babylonAnimation = new BABYLON.Animation(animationName, targetPath, 1, animationType);
                babylonAnimation.setKeys(keys);
                if (targetNode._babylonBones) {
                    const babylonAnimationTargets = [targetNode._babylonMesh, ...targetNode._babylonBones];
                    for (const babylonAnimationTarget of babylonAnimationTargets) {
                        babylonAnimationTarget.animations.push(babylonAnimation);
                    }
                    babylonAnimationGroup.addTargetedAnimation(babylonAnimation, babylonAnimationTargets);
                }
                else {
                    targetNode._babylonMesh.animations.push(babylonAnimation);
                    babylonAnimationGroup.addTargetedAnimation(babylonAnimation, targetNode._babylonMesh);
                }
            });
        }
    }
    //增加_loadAnimationKeysAsync方法， 缓存keys
    _loadAnimationKeysAsync(context, animationContext, animation, channel, key) {
        let r = this.babylonScene.offlineProvider.loadAnimationKeys(key);
        if (r) {
            return new Promise(() => { return r; });
        }
        const targetNode = BABYLON.GLTF2.ArrayItem.Get(`${context}/target/node`, this.gltf.nodes, channel.target.node);
        let targetPath;
        const sampler = BABYLON.GLTF2.ArrayItem.Get(`${context}/sampler`, animation.samplers, channel.sampler);
        return this._loadAnimationSamplerAsync(`${animationContext}/samplers/${channel.sampler}`, sampler).then((data) => {
            let outputBufferOffset = 0;
            let getNextOutputValue;
            switch (targetPath) {
                case "position": {
                    getNextOutputValue = () => {
                        const value = BABYLON.Vector3.FromArray(data.output, outputBufferOffset);
                        outputBufferOffset += 3;
                        return value;
                    };
                    break;
                }
                case "rotationQuaternion": {
                    getNextOutputValue = () => {
                        const value = BABYLON.Quaternion.FromArray(data.output, outputBufferOffset);
                        outputBufferOffset += 4;
                        return value;
                    };
                    break;
                }
                case "scaling": {
                    getNextOutputValue = () => {
                        const value = BABYLON.Vector3.FromArray(data.output, outputBufferOffset);
                        outputBufferOffset += 3;
                        return value;
                    };
                    break;
                }
                case "influence": {
                    getNextOutputValue = () => {
                        const value = new Array(targetNode._numMorphTargets);
                        for (let i = 0; i < targetNode._numMorphTargets; i++) {
                            value[i] = data.output[outputBufferOffset++];
                        }
                        return value;
                    };
                    break;
                }
            }
            let getNextKey;
            switch (data.interpolation) {
                case BABYLON.GLTF2.AnimationSamplerInterpolation.STEP: {
                    getNextKey = (frameIndex) => ({
                        frame: data.input[frameIndex],
                        value: getNextOutputValue(),
                        interpolation: BABYLON.AnimationKeyInterpolation.STEP
                    });
                    break;
                }
                case BABYLON.GLTF2.AnimationSamplerInterpolation.LINEAR: {
                    getNextKey = (frameIndex) => ({
                        frame: data.input[frameIndex],
                        value: getNextOutputValue()
                    });
                    break;
                }
                case BABYLON.GLTF2.AnimationSamplerInterpolation.CUBICSPLINE: {
                    getNextKey = (frameIndex) => ({
                        frame: data.input[frameIndex],
                        inTangent: getNextOutputValue(),
                        value: getNextOutputValue(),
                        outTangent: getNextOutputValue()
                    });
                    break;
                }
            }
            const keys = new Array(data.input.length);
            for (let frameIndex = 0; frameIndex < data.input.length; frameIndex++) {
                keys[frameIndex] = getNextKey(frameIndex);
            }
            this.babylonScene.offlineProvider.createAnimationKeys(key, keys); //缓存关键帧
            return keys;
        });
    }
}
exports.GLTF2Loader = GLTF2Loader;
const textureKey = (url, noMipmap, sampling) => {
    return BABYLON_TEXTURE_TYPE + ":" + url + "_" + noMipmap + "_" + (sampling ? true : false);
};
const geometryKey = (id) => {
    return BABYLON_GEOMETRY_TYPE + ":" + id;
};
const createTextureRes = (name, type, texture, _) => {
    return res_mgr_1.loadOK(name, type, null, TextureRes, texture);
};
const createGeometryRes = (name, type, geometry, _) => {
    return res_mgr_1.loadOK(name, type, null, GeometryRes, geometry);
};
const BABYLON_TEXTURE_TYPE = "babylon_texture";
const BABYLON_GEOMETRY_TYPE = "babylon_geometry";
res_mgr_1.register(BABYLON_TEXTURE_TYPE, (name, type, texture, _) => {
    createTextureRes(name, type, texture, _);
});
res_mgr_1.register(BABYLON_GEOMETRY_TYPE, (name, type, geometry, _) => {
    createGeometryRes(name, type, geometry, _);
});
});
