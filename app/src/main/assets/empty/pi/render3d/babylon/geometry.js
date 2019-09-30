_$define("pi/render3d/babylon/geometry", function (require, exports, module){
"use strict";
/// <reference path="./babylon.d.ts"/>
Object.defineProperty(exports, "__esModule", { value: true });
class Geometry extends BABYLON.Geometry {
    dispose() {
        this.getScene().getEngine().constructor.loader.releaseGeometry(this.id);
    }
}
exports.Geometry = Geometry;
});
