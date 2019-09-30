_$define("pi/render3d/babylon/offline_provider", function (require, exports, module){
"use strict";
/// <reference path="./babylon.d.ts"/>
Object.defineProperty(exports, "__esModule", { value: true });
const res_mgr_1 = require("../../util/res_mgr");
const util_1 = require("../../util/util");
//实现babylon的脱机提供者， 从外部ResTab获取数据
class OfflineProvider {
    constructor(resTab) {
        this.enableSceneOffline = true;
        this.enableTexturesOffline = true;
        this.resTab = new res_mgr_1.ResTab();
        this.resTab = resTab;
    }
    open(successCallback, _errorCallback) {
        successCallback();
    }
    loadImage(url, image) {
        image.src = url;
    }
    loadFile(url, sceneLoaded, _progressCallBack, errorCallback, _useArrayBuffer) {
        this.resTab.load(res_mgr_1.RES_TYPE_FILE + ":" + url, res_mgr_1.RES_TYPE_FILE, url, null, (r) => {
            if (url.endsWith(".gltf")) {
                sceneLoaded(util_1.utf8Decode(r.link));
            }
            else {
                sceneLoaded(r.link);
            }
        }, errorCallback);
    }
    loadAnimationKeys(name) {
        let r = this.resTab.get(anmationKey(name));
        if (r) {
            return r.link;
        }
        else {
            return null;
        }
    }
    createAnimationKeys(name, keys) {
        this.resTab.load(anmationKey(name), BABYLON_ANIMATION_TYPE, keys, null, null, () => {
            console.log("createAnimationKeys fail!, name:", name);
        });
    }
    release() {
        this.resTab.release();
    }
}
exports.OfflineProvider = OfflineProvider;
/**
 * @description 纹理资源
 * @example
 */
class AnimationKeysRes extends res_mgr_1.Res {
    /**
     * @description 创建
     * @example
     */
    create(data) {
        this.link = data;
    }
}
exports.AnimationKeysRes = AnimationKeysRes;
const BABYLON_ANIMATION_TYPE = "babyblon_animationkeys";
const anmationKey = (name) => {
    return BABYLON_ANIMATION_TYPE + ":" + name;
};
const createGeometryRes = (name, type, keys, _) => {
    return res_mgr_1.loadOK(name, type, null, AnimationKeysRes, keys);
};
res_mgr_1.register(BABYLON_ANIMATION_TYPE, (name, type, keys, _) => {
    createGeometryRes(name, type, keys, _);
});
});
