_$define("pi/render3d/particlesystem/renderer", function (require, exports, module){
"use strict";
/**
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
const load_1 = require("../load");
const three_1 = require("../three");
class RendererModule {
    // tslint:disable-next-line:typedef
    constructor(config, renderer, resTab) {
        if (!config.meshRender)
            return;
        const geo = config.geometry;
        if (geo.type === 'BufferGeometry') {
            this.mesh = load_1.newloadMesh(renderer, config.geometry, config.meshRender, resTab);
        }
        else if (geo.type === 'Plane') {
            this.mesh = load_1.newloadPlane(renderer, geo, config.meshRender, resTab);
        }
        else {
            this.mesh = load_1.newloadShape(renderer, geo, config.meshRender, resTab);
        }
    }
    update() {
        if (this.geometry && this.map) {
            return true;
        }
        if (!this.geometry && this.mesh.geometry) {
            this.geometry = this.mesh.geometry;
        }
        if (!this.map && this.mesh.material && this.mesh.material[0].map) {
            this.map = this.mesh.material[0].map;
            if (!(this.map instanceof three_1.THREE.Texture)) {
                this.map = undefined;
            }
        }
        return this.geometry && this.map;
    }
}
exports.RendererModule = RendererModule;
});
