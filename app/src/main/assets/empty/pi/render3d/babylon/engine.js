_$define("pi/render3d/babylon/engine", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="./babylon.d.ts"/>
const res_mgr_1 = require("../../util/res_mgr");
const loader_1 = require("./loader");
const offline_provider_1 = require("./offline_provider");
class Engine extends BABYLON.Engine {
    static prepare(resTab) {
        let loader = new loader_1.ResLoader(resTab);
        Engine.loader = loader;
        //提供脱机资源加载
        BABYLON.Engine.OfflineProviderFactory = (_urlToScene, _callbackManifestChecked, _disableManifestCheck) => {
            BABYLON.Tools.SetImmediate(() => {
                _callbackManifestChecked(true);
            });
            return new offline_provider_1.OfflineProvider(new res_mgr_1.ResTab()); //每场景一个OfflineProvider
        };
        loader_1.GLTF2Loader.resLoader = loader;
        //修改默认的gltf文件加载类
        BABYLON.GLTFFileLoader._CreateGLTFLoaderV2 = (parent) => new loader_1.GLTF2Loader(parent);
    }
    constructor(canvasOrContext, antialias, options, adaptToDeviceRatio = false) {
        if (!Engine.loader) {
            throw "loader is not exist!, Please call 'Engine.setResTab' first.";
        }
        super(canvasOrContext, antialias, options, adaptToDeviceRatio);
        this.piEngine = true;
        this.loader = Engine.loader;
    }
    //创建Texture
    createTexture(urlArg, noMipmap, invertY, scene, samplingMode = Engine.TEXTURE_TRILINEAR_SAMPLINGMODE, onLoad = null, onError = null, buffer = null, fallback = null, format = null, forcedExtension = null) {
        let tex = BABYLON.Engine.prototype.createTexture.call(this, urlArg, noMipmap, invertY, scene, samplingMode, onLoad, onError, buffer, fallback, format, forcedExtension);
        //将tex添加到资源表
        Engine.loader.createTexture(tex);
        return tex;
    }
}
exports.Engine = Engine;
});
