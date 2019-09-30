_$define("pi/render3d/babylon/scene", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//重载BABYLON.Scene， 释放资源
class Scene extends BABYLON.Scene {
    dispose() {
        BABYLON.Scene.prototype.dispose.call(this);
        this.offlineProvider.release();
    }
}
exports.Scene = Scene;
});
