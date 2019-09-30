_$define("pi/render3d/particlesystem/ps", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const three_1 = require("../three");
const particle_1 = require("./particle");
const util_1 = require("./util");
const emission_1 = require("./emission");
const main_1 = require("./main");
const renderer_1 = require("./renderer");
const shape_1 = require("./shape");
const texture_sheet_animation_1 = require("./texture_sheet_animation");
const color_lifetime_1 = require("./color_lifetime");
const rotation_lifetime_1 = require("./rotation_lifetime");
const size_lifetime_1 = require("./size_lifetime");
const velocity_lifetime_1 = require("./velocity_lifetime");
const force_1 = require("./force");
const force_lifetime_1 = require("./force_lifetime");
const inherit_velocity_1 = require("./inherit_velocity");
const limitvelocity_lifetime_1 = require("./limitvelocity_lifetime");
const color_speed_1 = require("./color_speed");
const rotation_speed_1 = require("./rotation_speed");
const size_speed_1 = require("./size_speed");
/**
 * 注：目前的粒子系统 不 支 持 以下模块
 *   inherit
 *   External Force 外部力
 *   Noise      噪音
 *   SubEmitter 子发射器
 *   Collision  碰撞
 *   Triggers
 *   Lights     光照
 *   Trails     拖尾
 *   Custom Data 用户数据
 */
class ParticleSystem extends three_1.THREE.Object3D {
    constructor(config, scene, renderer, resTab) {
        super();
        const main = new main_1.MainModule(config.main);
        if (main.simulationSpace !== util_1.PSSimulationSpace.Local) {
            throw new Error('main.simulationSpace isn\'t PSSimulationSpace.Local');
        }
        this.main = main;
        this.psScene = scene;
        this.resTab = resTab;
        this.isStop = false;
        this.totalTime = 0;
        this.frees = [];
        this.particles = [];
        this.useAutoRandomSeed = config.useAutoRandomSeed;
        this.randomSeed = this.useAutoRandomSeed ? 0 : config.randomSeed;
        if (config.renderer) {
            this.renderer = new renderer_1.RendererModule(config.renderer, renderer, resTab);
        }
        if (config.shape) {
            this.shape = new shape_1.ShapeModule(config.shape);
        }
        if (config.emission) {
            this.emission = new emission_1.EmissionModule(config.emission);
        }
        if (config.externalForces) {
            this.externalForces = new force_1.ExternalForcesModule(config.externalForces);
        }
        if (config.textureSheetAnimation) {
            this.textureSheetAnimation = new texture_sheet_animation_1.TextureSheetAnimationModule(config.textureSheetAnimation);
        }
        if (config.velocityOverLifetime) {
            this.velocityOverLifetime = new velocity_lifetime_1.VelocityOverLifetimeModule(config.velocityOverLifetime);
        }
        if (config.rotationOverLifetime) {
            this.rotationOverLifetime = new rotation_lifetime_1.RotationOverLifetimeModule(config.rotationOverLifetime);
        }
        if (config.sizeOverLifetime) {
            this.sizeOverLifetime = new size_lifetime_1.SizeOverLifetimeModule(config.sizeOverLifetime);
        }
        if (config.colorOverLifetime) {
            this.colorOverLifetime = new color_lifetime_1.ColorOverLifetimeModule(config.colorOverLifetime);
        }
        if (config.forceOverLifetime) {
            this.forceOverLifetime = new force_lifetime_1.ForceOverLifetimeModule(config.forceOverLifetime);
        }
        if (config.inheritVelocity) {
            this.inheritVelocity = new inherit_velocity_1.InheritVelocityModule(config.inheritVelocity);
        }
        if (config.limitVelocityOverLifetime) {
            this.limitVelocityOverLifetime = new limitvelocity_lifetime_1.LimitVelocityOverLifetimeModule(config.limitVelocityOverLifetime);
        }
        if (config.colorBySpeed) {
            this.colorBySpeed = new color_speed_1.ColorBySpeedModule(config.colorBySpeed);
        }
        if (config.rotationBySpeed) {
            this.rotationBySpeed = new rotation_speed_1.RotationBySpeedModule(config.rotationBySpeed);
        }
        if (config.sizeBySpeed) {
            this.sizeBySpeed = new size_speed_1.SizeBySpeedModule(config.sizeBySpeed);
        }
    }
    dispose() {
        super.dispose();
        // this.geometry.dispose();
        for (const p of this.particles) {
            p.dispose();
        }
        for (const p of this.frees) {
            p.dispose();
        }
    }
    // deltaTime的单位：秒
    update(deltaTime) {
        const emission = this.emission;
        if (!emission || !this.renderer || this.isStop) {
            return;
        }
        if (!this.renderer.update()) {
            return;
        }
        deltaTime *= this.main.simulationSpeed;
        this.totalTime += deltaTime;
        // 更新
        const playTime = this.totalTime % this.main.duration;
        for (let i = 0; i < this.particles.length; ++i) {
            if (!this.particles[i].update(this.totalTime, deltaTime)) {
                i = this.removePar(i);
            }
        }
        const delayTime = this.main.startDelay.getValue(playTime);
        if (this.totalTime < delayTime) {
            return;
        }
        if (this.main.loop || this.totalTime < delayTime + this.main.duration) {
            let maxCount = this.main.maxParticles - this.particles.length;
            if (maxCount < 0)
                maxCount = 0;
            const count = emission.update(this.totalTime, playTime, maxCount);
            this.createParticle(count, this.totalTime);
        }
        else {
            // 如果已经超出了发射器的生命周期，而且没有存活的粒子了，该粒子系统就可以停止播放了。
            if (this.particles.length === 0) {
                this.isStop = true;
            }
        }
    }
    addSuccess() {
        this.scene.animObjectMap.set(this.uuid, this);
    }
    createParticle(count, time) {
        let p;
        for (let i = 0; i < count; ++i) {
            if (this.frees.length > 0) {
                p = this.frees.pop();
                this.particles.push(p);
            }
            else {
                p = new particle_1.Particle(this);
                p.material = new three_1.THREE.MeshParticlesMaterial({ map: this.renderer.map });
                let mat = this.renderer.mesh.material;
                if (Array.isArray(mat)) {
                    mat = mat[0];
                }
                p.startTintColor.setRGBA(mat.tintColor.r, mat.tintColor.g, mat.tintColor.b, mat.tintOpacity);
                p.material.copy(mat);
                p.mesh = new three_1.THREE.Mesh(this.renderer.geometry, p.material);
                this.particles.push(p);
            }
            this.add(p.mesh);
            p.init(time);
        }
    }
    removePar(i) {
        const p = this.particles[i];
        this.frees.push(p);
        this.remove(p.mesh);
        this.particles[i] = this.particles[this.particles.length - 1];
        --this.particles.length;
        return i - 1;
    }
}
exports.ParticleSystem = ParticleSystem;
});
