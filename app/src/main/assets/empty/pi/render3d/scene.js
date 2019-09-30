_$define("pi/render3d/scene", function (require, exports, module){
"use strict";
/**
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
const _CANVAS = require("../util/canvas");
const _LOAD = require("./load");
const ps_1 = require("./particlesystem/ps");
const three_1 = require("./three");
const spine_1 = require("./spine");
class PlayObj {
}
exports.createScene = (renderer, data) => {
    return new SceneImpl(renderer, data);
};
// tslint:disable:variable-name
const _size = {
    width: 0,
    height: 0
};
const _tmpPt = new three_1.THREE.Vector3();
const _tmpV4 = new three_1.THREE.Vector4();
const _tmpMat = new three_1.THREE.Matrix4();
exports.parseSkeleton = () => {
    return null;
};
class SceneImpl {
    constructor(renderer, data) {
        // 是否已经释放
        this.destroyed = false;
        this.renderer = renderer;
        // THREE.WebGLRenderer的句柄
        this.impl3D = renderer.getThreeRenderer();
        this.post = new three_1.THREE.PostRender(this.impl3D);
        this.width = this.impl3D.domElement.width;
        this.height = this.impl3D.domElement.height;
        const cap = this.impl3D.capabilities;
        this.maxBones = Math.floor((cap.maxVertexUniforms - 60) / 4);
        this.useVertexTexture = cap.floatVertexTextures > 0;
        this.scene = new three_1.THREE.Scene();
        this.scene2D = new three_1.THREE.Scene();
        this.scene2D.add(new three_1.THREE.AmbientLight([1, 1, 1]));
        this.meshArray = [];
        this.attachmentArray = [];
        this.camera = undefined;
        this.camera2D = undefined;
        this.terrain = undefined;
        this.raycaster = new three_1.THREE.Raycaster();
        this.raycast3DArray = [];
        this.raycast2DArray = [];
        if (!data)
            return;
        if (data.terrain) {
            this.initTerrain(data.terrain.path, data.resTab, data.terrain.scale);
        }
        if (data.fog) {
            this.initFog(data.fog);
        }
        if (data.lights) {
            for (let i = 0; i < data.lights.length; i++) {
                const impl = this.initLight(data.lights[i]);
                if (impl) {
                    this.scene.add(impl);
                }
            }
        }
        if (data.skybox) {
            this.initSkybox(data.skybox, data.resTab);
        }
        if (data.staticObj) {
            this.insertScene(data.staticObj, data.resTab);
        }
    }
    setScene2DFactor(wFactor, hFactor) {
        this.scene2D.scale.set(wFactor, hFactor, 1);
    }
    getCameraObject() {
        return this.cameraObject;
    }
    raycast(x, y, ignoreObj) {
        if (this.destroyed) {
            throw new Error('THREE.PiScene.raycast failed, scene is destroyed!');
        }
        if (!this.camera) {
            throw new Error('THREE.PiScene.raycast failed, no 3d camera!');
        }
        const size = this.renderer.getSize();
        const mouse = {
            x: (x / size.width) * 2 - 1,
            y: -(y / size.height) * 2 + 1
        };
        // 2D 相机优先
        if (this.camera2D) {
            this.raycaster.setFromCamera(mouse, this.camera2D);
            let r;
            const intersects = this.raycaster.intersectObjects(this.raycast2DArray, false, ignoreObj);
            if (intersects.length > 0) {
                const inter = intersects[0]; // 按距离升序排列
                r = {
                    type: 'mesh',
                    id: inter.object.rayID
                };
                return r;
            }
        }
        this.raycaster.setFromCamera(mouse, this.camera);
        // 保证地形永远放到最后一个
        if (this.terrain) {
            this.raycast3DArray.push(this.terrain);
        }
        let r;
        const intersects = this.raycaster.intersectObjects(this.raycast3DArray, false, ignoreObj);
        if (this.terrain) {
            this.raycast3DArray.pop();
        }
        if (intersects.length > 0) {
            const inter = intersects[0]; // 按距离升序排列
            // 注：约定了网格地形的ID为负数
            if (inter.object.rayID < 0) {
                r = {
                    type: 'terrain',
                    data: [inter.point.x, inter.point.y, inter.point.z],
                    id: inter.object.rayID
                };
            }
            else if (inter.object === this.terrain) {
                r = {
                    type: 'terrain',
                    data: [inter.point.x, inter.point.y, inter.point.z]
                };
            }
            else {
                r = {
                    type: 'mesh',
                    id: inter.object.rayID
                };
            }
        }
        return r;
    }
    /**
     * 释放场景
     */
    destroy() {
        if (!this.destroyed) {
            this.terrain && this.terrain.dispose();
            this.attachmentArray.length = 0;
            const dispose = (root) => {
                root.dispose && root.dispose();
                const children = root.children;
                if (!children) {
                    return;
                }
                for (let i = 0; i < children.length; i++) {
                    dispose(children[i]);
                }
            };
            dispose(this.scene);
            dispose(this.scene2D);
            if (this.skybox) {
                this.skybox.dispose();
            }
            this.meshArray.length = 0;
            this.raycast3DArray = [];
            this.raycast2DArray = [];
            delete this.camera;
            delete this.camera2D;
            this.scene.children = [];
            this.scene2D.children = [];
            delete this.scene;
            delete this.scene2D;
            this.destroyed = true;
        }
    }
    /**
     * 渲染，高层控帧
     */
    render(deltaMS, isAutoClear) {
        // 更新spine骨骼动画
        this.meshArray.forEach((v) => {
            if (v.name === "spine" && v.visible) {
                v.update(deltaMS);
            }
        });
        if (isAutoClear !== undefined)
            this.impl3D.autoClear = isAutoClear;
        if (this.camera.posts && this.camera.posts.length > 0) {
            let src = this.createRenderTarget();
            this.impl3D.render(this.scene, this.camera, deltaMS, src);
            for (let i = 0; i < this.camera.posts.length; i++) {
                if (i < this.camera.posts.length - 1) {
                    const dist = this.createRenderTarget();
                    this.camera.posts[i].onRenderImage(this.post, src, dist, deltaMS);
                    src = dist;
                }
                else {
                    this.camera.posts[i].onRenderImage(this.post, src, null, deltaMS);
                }
            }
        }
        else {
            this.impl3D.render(this.scene, this.camera, deltaMS);
        }
        this.impl3D.autoClear = true;
        if (this.camera2D) {
            this.updateScreenPoints();
            this.impl3D.autoClear = false;
            this.impl3D.render(this.scene2D, this.camera2D, deltaMS);
            this.impl3D.autoClear = true;
        }
    }
    createRenderTarget() {
        if (!this.renderTargets) {
            this.renderTargets = [];
        }
        if (!this.renderTargets[0]) {
            this.renderTargets[0] = new three_1.THREE.WebGLRenderTarget(this.width, this.height);
        }
        const temp = this.renderTargets[0];
        this.renderTargets[0] = this.renderTargets[1];
        this.renderTargets[1] = temp;
        return temp;
    }
    /**
     * json = [{
     *   ref: 当传进来的json数据没有该值时候，创建对象；然后返回的数据带着这个字段；
     *
     *   attachSkeleton: true, // 代表该对象用父对象的骨骼动画
     *
     *   material: {
     *      住：仅在创建时候使用一次！
     *      查看material.js文件，描述参数
     *   }
     *   children: [],
     *
     *   // 仅当type为"Mesh" 或者时有效，而且不能通过update方法修改
     *   shape: "Circle", "Quad", "Sphere"
     *
     *   color: 0xFF777777,
     *   texture: "a.png",
     *
     *   gray: true, false
     *
     *   config: "配置路径",
     *
     *   type: "Mesh", "Camera", "Node", "Text", "PointLight", "SpotLight"
     *   attachment: "2D", "3D"（默认）
     *
     *   parentBone: 如果有该字段，表示该对象是骨骼绑定方式，这里填父对象骨头名字
     *
     *   // 空间信息，相对关系，Node
     *   position: [x, y, z],
     *   rotate:  [x, y, z], 旋转的欧拉角，供相机使用
     *   lookatOnce: [x, y, z],  正面朝向的目标点的位置；供角色使用
     *   scale: [1, 1, 1],
     *   rayID: 有该字段的对象，才可以参与射线检测（射线检测不包含子对象）
     *
     *   // type为 "PointLight"（点光源） 时，才会有如下字段
     *   startAtten: 1.0,
     *   endAtten: 0.0,
     *   diffuse: 0xFFFFFF,
     *   specular: 0x0
     *
     *   // type为 "SpotLight"（聚光灯） 时，才会有如下字段
     *   startAtten: 1.0,
     *   endAtten: 0.0,
     *
     *   spotDirection: [x, y, z],
     *   spotCosCutoff: 1.0,
     *   spotExponent: 1.0,
     *
     *   diffuse: 0xFFFFFF,
     *   specular: 0x0
     *
     *   // type为 "Text" 时，才会有如下字段
     *   text: "显示的字符串",
     *   material: {
     *       设置在canvas的context
     *   }
     *
     *   // type 为 "mesh"时，才会有如下字段（准确的说，只有带skeleton时才会有）
     *   uvAnim: true代表循环播放uv动画，false代表播放一次uv动画
     *   modelAnim: true代表循环播放model动画，false代表播放一次动画
     *   animationSpeed: 速度，默认为1.0
     *   animationLoop: 默认的循环动作
     *   animationOnce: 当该字段有值时，会播放一次该动画，然后回到loop动画
     *   animationDir: 播放动画的方向，默认正向播放
     *
     *   // type 为 "camera"时，才会有如下字段
     *
     *   perspective: [fov, aspect, near, far],
     *   ortho: [left, right, top, bottom, near, far]
     * }];
     */
    /**
     * 将obj放到parent上
     * 如果obj没有ref字段，则会创建一个新的
     */
    insert(obj, parent, resTab) {
        if (this.destroyed) {
            throw new Error('THREE.PiScene.insert failed, scene is destroyed!');
        }
        const root = obj.attachment === '2D' ? this.scene2D : this.scene;
        parent = parent || {
            attachment: obj.attachment,
            ref: {
                impl: root,
                attachment: obj.attachment // 3D对应3D场景，2D对应2D场景
            }
        };
        if (!obj.ref) {
            const resCount = { tatal: 0, curr: 0 };
            this.initSceneChildren(parent, [obj], resCount, resTab);
        }
        else {
            throw new Error('insert failed, obj.ref is already exist');
        }
    }
    /**
     * 将obj放到parent上
     * 如果obj没有ref字段，则会创建一个新的
     */
    insertScene(obj, resTab) {
        if (this.destroyed) {
            throw new Error('THREE.PiScene.insert failed, scene is destroyed!');
        }
        const root = (obj.attachment === '2D') ? this.scene2D : this.scene;
        const parent = {
            attachment: obj.attachment,
            ref: {
                impl: root,
                attachment: obj.attachment // 3D对应3D场景，2D对应2D场景
            }
        };
        if (!obj.ref) {
            const resCount = { tatal: 0, curr: 0 };
            this.initSceneChildren(parent, [obj], resCount, resTab);
        }
        else {
            throw new Error('insert failed, obj.ref is already exist');
        }
    }
    /**
     * 修改obj的itemKey字段
     * 注：obj必须要有ref字段
     */
    modify(obj, keys) {
        if (this.destroyed) {
            throw new Error('THREE.PiScene.modify failed, scene is destroyed!');
        }
        if (!obj.ref) {
            throw new Error('THREE.PiScene.modify failed ! ');
        }
        const propertyIndex = keys[keys.length - 1]; // 找到属性数组中的最后一个属性
        const targetObj = findProperty(obj, keys);
        if (this[propertyIndex]) {
            this[propertyIndex].call(this, targetObj[propertyIndex], obj.ref.impl, keys, obj.resTab);
        }
        else {
            const targetimpl = findProperty(obj.ref.impl, keys);
            targetimpl[propertyIndex] = targetObj[propertyIndex];
        }
    }
    /**
     * 删除obj的ref
     */
    remove(obj) {
        if (this.destroyed) {
            throw new Error('THREE.PiScene.remove failed, scene is destroyed!');
        }
        if (!obj || !obj.ref)
            return;
        const impl = obj.ref.impl;
        if (!impl)
            return;
        impl.parent && impl.parent.remove(impl);
        this.removeRef(obj);
        this._remove(impl);
    }
    /**
     * 删除ref
     */
    removeRef(obj) {
        if (!obj || !obj.ref)
            return;
        delete obj.ref;
        if (!obj.children) {
            return;
        }
        for (let i = 0; i < obj.children.length; i++) {
            this.removeRef(obj.children[i]);
        }
    }
    /**
     * 工具方法：用于转换3D坐标到屏幕
     * pt: 3D坐标 [x, y, z]
     * result: 结果，2D坐标 [x, y, z]
     */
    getScreenPoint(pt, result) {
        _tmpMat.multiplyMatrices(this.camera.projectionMatrix, _tmpMat.getInverse(this.camera.matrixWorld));
        this.impl3D.getSize(_size);
        _tmpV4.set(pt[0], pt[1], pt[2], 1.0);
        _tmpV4.applyMatrix4(_tmpMat);
        // tslint:disable:binary-expression-operand-order
        result[0] = -0.5 * _size.width * _tmpV4.x / _tmpV4.w;
        result[1] = 0.5 * _size.height * _tmpV4.y / _tmpV4.w;
        result[2] = 0.5 * _tmpV4.z / _tmpV4.w;
    }
    initSkybox(cfg, resTab) {
        const geo = { width: 8000, height: 8000, longness: 8000 };
        const render = { material: [] };
        for (let i = 0; i < cfg.length; i++) {
            const map = { image: { name: cfg[i] } };
            render.material[i] = {};
            render.material[i].map = map;
        }
        this.skybox = _LOAD.newloadShape(this.renderer, geo, render, resTab);
        this.scene.add(this.skybox);
    }
    // ------------------- 下面是私有方法 ----------------------------
    // tslint:disable:function-name
    _remove(impl) {
        let i;
        let index;
        // 射线检测
        index = this.raycast3DArray.indexOf(impl);
        if (index >= 0) {
            this.raycast3DArray.splice(index, 1);
        }
        index = this.raycast2DArray.indexOf(impl);
        if (index >= 0) {
            this.raycast2DArray.splice(index, 1);
        }
        //  顶层的2D物体     
        index = this.attachmentArray.indexOf(impl);
        if (index >= 0) {
            delete impl.__piAttachment;
            this.attachmentArray.splice(index, 1);
        }
        index = this.meshArray.indexOf(impl);
        if (index >= 0) {
            this.meshArray.splice(index, 1);
        }
        impl.dispose && impl.dispose();
        // 删除3D节点对应的2D子节点
        const r = [];
        let d = [];
        for (i = 0; i < this.attachmentArray.length; ++i) {
            if (impl === this.attachmentArray[i].__piAttachment) {
                this.scene2D.remove(this.attachmentArray[i]);
                d.push(this.attachmentArray[i]);
            }
            else {
                r.push(this.attachmentArray[i]);
            }
        }
        this.attachmentArray = r;
        for (i = 0; i < d.length; ++i) {
            this._remove(d[i]);
        }
        d = undefined;
        for (i = 0; impl.children && i < impl.children.length; ++i) {
            this._remove(impl.children[i]);
        }
        impl.children.length = 0;
    }
    // 更新，位置3D变2D
    updateScreenPoints() {
        if (this.attachmentArray.length > 0) {
            _tmpMat.multiplyMatrices(this.camera.projectionMatrix, _tmpMat.getInverse(this.camera.matrixWorld));
        }
        this.impl3D.getSize(_size);
        for (let i = 0; i < this.attachmentArray.length; ++i) {
            const impl = this.attachmentArray[i];
            const pimpl = impl.__piAttachment;
            const p = pimpl.getWorldPosition(_tmpPt);
            _tmpV4.set(p.x, p.y, p.z, 1.0);
            _tmpV4.applyMatrix4(_tmpMat);
            p.set(_tmpV4.x / _tmpV4.w, _tmpV4.y / _tmpV4.w, _tmpV4.z / _tmpV4.w);
            p.set(-p.x * _size.width * 0.5, p.y * _size.height * 0.5, 0);
            if (!impl.__piPosition) {
                impl.__piPosition = impl.position.clone();
            }
            impl.position.addVectors(p, impl.__piPosition);
        }
    }
    addToRaycastList(obj, mesh) {
        if (obj.rayID) {
            mesh.rayID = obj.rayID;
            if (obj.rayID < 0) {
                this.raycast3DArray.push(mesh);
            }
            else {
                if (obj.attachment === '2D') {
                    this.raycast2DArray.unshift(mesh);
                }
                else {
                    this.raycast3DArray.unshift(mesh);
                }
            }
        }
    }
    gray(obj) {
        if (obj.gray !== undefined) {
            const m = obj.ref.impl;
            m.setGray(obj.gray);
        }
    }
    childVisible(obj) {
        if (obj.childVisible !== undefined) {
            obj.ref.impl.childVisible = obj.childVisible;
            // obj.ref.impl.visible = obj.childVisible;
        }
    }
    boneVisible(obj) {
        if (obj.boneVisible !== undefined) {
            obj.ref.impl.boneVisible = obj.boneVisible;
        }
    }
    /**
     * 注：地形文件必须放在 res/terrain目录
     */
    initTerrain(configName, resTab, scale) {
        _LOAD.loadTerrain(configName, this.renderer, resTab, (terrain) => {
            if (this.destroyed) {
                terrain.dispose();
                return;
            }
            this.terrain = terrain;
            if (scale) {
                this.terrain.scale.fromArray(scale);
            }
            this.scene.add(this.terrain);
        });
    }
    initFog(fog) {
        if (fog.type === 'Linear') {
            this.scene.fog = new three_1.THREE.Fog(fog.color, fog.near, fog.far);
        }
        else if (fog.type === 'Exp') {
            this.scene.fog = new three_1.THREE.FogExp2(fog.color, fog.density);
        }
    }
    // =========================================================初始化场景
    // tslint:disable:cyclomatic-complexity
    initSceneChildren(parent, children, resCount, resTab) {
        if (!children || children.length === 0) {
            parent.ref.impl.childReadyOk();
            return;
        }
        let skeletonRes;
        const boneChildren = [];
        let skinnedMesh;
        let spineRes;
        for (let i = 0; children && i < children.length; ++i) {
            const obj = children[i];
            let impl;
            if (!obj) {
                parent.ref.impl.childReadyOk();
                continue;
            }
            if (obj.type === 'Skeleton') {
                skeletonRes = obj.res;
                parent.ref.impl.isSkeletonAnimation = true;
                resCount.tatal++;
                continue;
            }
            obj.resTab = resTab;
            children[i].resTab = resTab;
            // (!obj.spineLitener && parent.spineLitener) && (obj.spineLitener = parent.spineLitener);
            // if (obj.type === "spine") {
            // 	spineRes = obj.spine;
            // 	resCount.tatal++;
            // 	continue;
            // }
            if (obj.camera) {
                this.cameraObject = obj;
            }
            impl = this.initObjectComponent(obj);
            impl.attachment = obj.attachment;
            // 2D相机返回undefined
            if (!impl)
                continue;
            children[i].ref = {
                impl: impl
            };
            obj.ref = {
                impl: impl
            };
            (!obj.spineLitener && parent.spineLitener) && (obj.spineLitener = parent.spineLitener);
            if (obj.type === "spine") {
                spineRes = obj.spine;
                resCount.tatal++;
                continue;
            }
            this.meshArray.push(impl);
            this.addToRaycastList(obj, impl);
            if (obj.animator) {
                impl.aniControl = obj.animator.controller;
                if (obj.animator.aniBox) {
                    impl.aniBox = {};
                    for (const k in obj.animator.aniBox) {
                        if (k === '_$hash') {
                            continue;
                        }
                        const center = obj.animator.aniBox[k].center;
                        const size = obj.animator.aniBox[k].size;
                        const max = new three_1.THREE.Vector3(center[0] + size[0], center[1] + size[1], center[2] + size[2]);
                        const min = new three_1.THREE.Vector3(center[0] - size[0], center[1] - size[1], center[2] - size[2]);
                        impl.aniBox[k] = new three_1.THREE.Box3(min, max);
                    }
                }
            }
            impl.name = obj.name;
            if (obj.bindBone) {
                boneChildren.push(obj);
                parent.ref.impl.childReadyOk();
            }
            else {
                this.addChild(parent, obj);
            }
            this.initOtherComponent(obj); // 初始化组件
            if ((obj.ref.impl instanceof three_1.THREE.Light)) {
                if (obj.ref.impl.target) {
                    parent.ref.impl.add(obj.ref.impl.target);
                }
            }
            // 不是和骨骼节点一起插入进场景的蒙皮模型，需要去场景数上找到对应骨骼
            if (obj.skinnedMeshRender && !skeletonRes) {
                skinnedMesh = obj;
            }
            if (!obj.children && obj.animator && obj.animator.playAnim) {
                const option = obj.animator.playAnim;
                this.playAnim(option, obj.ref.impl, undefined, resTab);
            }
            obj.children && (impl.childrenCount = obj.children.length);
            this.initSceneChildren(obj, obj.children, resCount, resTab);
        }
        // 不是和骨骼节点一起插入进场景的蒙皮模型，需要去场景数上找到对应骨骼
        if (skinnedMesh && !skeletonRes) {
            const skTemp = parent ? parent.ref.impl : null;
            if (skTemp) {
                skinnedMesh.ref.impl.setSkeleton(skTemp, skinnedMesh.bones);
            }
        }
        // 如果父节点上存在skeleton, 并且有需要绑在骨头上的子节点, 则将这些节点绑在父节点的skeleton上
        if (parent && parent.ref && parent.ref.impl.skeleton && boneChildren.length > 0) {
            bindBone(parent.ref.impl.skeleton, boneChildren);
        }
        // 初始化骨骼
        if (skeletonRes && parent) {
            _LOAD.newloadSkeleton(skeletonRes, resTab, (bones) => {
                // 将加载到的骨头添加到骨骼的包装节点和需要使用该骨骼的节点上
                const skel = parent.ref.impl.setSkeletonChild(bones);
                for (let i = 0; i < children.length; i++) {
                    const child = children[i];
                    if (child.skinnedMeshRender && child.ref) {
                        const sBonesIndex = child.skinnedMeshRender.bones;
                        if (sBonesIndex) {
                            child.ref.impl.setSkeleton(skel, sBonesIndex);
                        }
                        child.ref.impl.bones = bones;
                    }
                }
                // 含有bindBone属性的节点，应该添加到对应骨头的子节点上
                bindBone(skel, boneChildren);
                resCount.curr++;
                this.loadResOk(resCount);
            });
        }
        // 初始化spine数据
        if (spineRes) {
            _LOAD.loadString(`${spineRes.proRes}`, resTab, (r) => {
                // _LOAD.loadImgTexture( { name: `${spineRes.imgRes}` }, null, resTab, (r) => {
                // loadTextureAtlas 返回 TextureAtlas
                // loadTextureAtlas 加载Atlas后解析, 创建TextureAtlas，并解析配置，获得需要的资源文件(在pages[].name); 再加载资源，成功后设置TextureAtlas各纹理
                _LOAD.loadTextureAtlas(`${spineRes.atlas}`, resTab, (r) => {
                    // loadOk = true;
                    let imgArr = [];
                    let textureAtlas = r;
                    textureAtlas.pages.forEach(ele => {
                        imgArr.push({ name: ele.name });
                    });
                    _LOAD.loadImgTextures(imgArr, null, resTab, (r) => {
                        // 资源加载成功后 设置纹理
                        // textureAtlas.setPageAndRegionTexture( _LOAD.getNewTexture, resTab );
                        let textures = {};
                        imgArr.forEach(ele => {
                            ele && (textures[`${ele.name}`] = _LOAD.findTexture(ele.name, resTab));
                        });
                        textureAtlas.setPageAndRegionTexture2(textures);
                        for (let i = 0; i < children.length; i++) {
                            const child = children[i];
                            if (child.type === "spine") {
                                // console.log(child)
                                let impl = this.initSpine(child);
                                child.ref.impl = impl;
                                // child.ref = {
                                // 	impl: impl
                                // };
                                this.meshArray.push(impl);
                                // this.addToRaycastList(child, impl);
                                this.addChild(parent, child);
                                resCount.curr++;
                                this.loadResOk(resCount);
                            }
                        }
                    });
                });
                // });
            });
        }
        if (parent.animator && parent.animator.playAnim) {
            const option = parent.animator.playAnim;
            this.playAnim(option, parent.ref.impl, undefined, resTab);
        }
        this.loadResOk(resCount);
    }
    // 添加子节点
    addChild(parent, child) {
        // 2D节点挂在3D节点上
        if (child.attachment === '2D' && parent.attachment !== '2D') {
            this.scene2D.add(child.ref.impl);
            child.ref.impl.__piAttachment = parent.ref.impl;
            this.attachmentArray.push(child.ref.impl);
        }
        else {
            parent.ref.impl.add(child.ref.impl);
        }
    }
    // 完成资源加载
    loadResOk(resCount) {
        if (resCount.tatal === resCount.curr) {
            resCount.tatal = resCount.curr = 0;
        }
    }
    createSceneAmbientLight(obj) {
        return new three_1.THREE.AmbientLight(obj.color);
    }
    createSceneDirectionLight(obj) {
        return new three_1.THREE.DirectionalLight(obj.direction, obj.diffuse, obj.specular);
    }
    createScenePointLight(obj) {
        return new three_1.THREE.PointLight(obj.isUseNormal, obj.startAtten, obj.endAtten, obj.diffuse, obj.specular);
    }
    createSceneSpotLight(obj) {
        return new three_1.THREE.SpotLight(obj.startAtten, obj.endAtten, obj.spotDirection, obj.spotCosCutoff, obj.spotExponent, obj.diffuse, obj.specular);
    }
    initObjectComponent(obj) {
        let impl;
        impl = impl || this.initMeshAndMeshRender(obj.meshRender, obj.geometry, obj.resTab);
        impl = impl || this.initSkinnedMeshRender(obj.skinnedMeshRender, obj.resTab);
        impl = impl || this.initCamera(obj.camera);
        impl = impl || this.initTextCon(obj.textCon, obj.resTab);
        impl = impl || this.initLight(obj.light);
        impl = impl || this.initParticleSystem(obj.particlesystem, obj.attachment, obj.resTab);
        impl = impl || this.initBox(obj.box);
        impl = impl || this.initSpine(obj);
        impl = impl || this.initObject3D();
        return impl;
    }
    initOtherComponent(obj) {
        this.initBoxCollider(obj.boxCollider, obj.ref.impl);
        this.initTransform(obj.transform, obj.ref.impl, obj.textCon && obj.textCon.textcfg);
        this.initAnimator(obj.animator, obj.ref.impl, obj.resTab);
        if (obj.lookatOnce) {
            this.lookatOnce(obj.lookatOnce, obj.ref.impl);
        }
        this.childVisible(obj);
        this.boneVisible(obj);
        this.initWave(obj.wave, obj.ref.impl);
        this.initLut(obj.lut, obj.ref.impl, obj.resTab);
    }
    initWave(wave, impl) {
        if (wave) {
            this.wave(wave, impl);
        }
    }
    initLut(lut, impl, resTab) {
        if (lut) {
            if (!impl.lut) {
                impl.lut = new three_1.THREE.LutEffect();
            }
            if (!impl.posts) {
                impl.posts = [];
            }
            impl.posts.push(impl.lut);
            _LOAD.loadImgTexture({ name: lut }, this.renderer, resTab, texture => {
                impl.lut.setTexture(texture);
            });
        }
    }
    initBoxCollider(boxCollider, impl) {
        if (boxCollider) {
            const min = new three_1.THREE.Vector3();
            min.fromArray(boxCollider.min);
            const max = new three_1.THREE.Vector3();
            max.fromArray(boxCollider.max);
            impl.settingBound = new three_1.THREE.Box3(min, max);
        }
    }
    initTransform(transform, impl, textcfg) {
        if (!transform) {
            return;
        }
        this.position(transform.position, impl);
        this.scale(transform.scale, impl, textcfg);
        this.rotate(transform.rotate, impl);
    }
    initAnimator(animator, impl, resTab) {
        if (!animator) {
            return;
        }
        impl.aniControl = animator.controller; // 设置动画控制器
    }
    initTextCon(textCon, resTab) {
        if (!textCon) {
            return;
        }
        const textcfg = textCon.textcfg;
        let impl;
        if (textcfg.isCommon) {
            impl = new three_1.THREE.ImageText(textCon);
            _LOAD.loadText(impl, textCon, this.renderer, resTab);
        }
        else {
            textcfg.text = textCon.show;
            impl = new three_1.THREE.Text2D(textCon, resTab, _LOAD.GeometryRes, _LOAD.TextureRes, _CANVAS);
        }
        return impl;
    }
    initSkinnedMeshRender(skinnedMeshRender, resTab) {
        if (!skinnedMeshRender) {
            return;
        }
        const impl = _LOAD.newloadSkeletonMesh(this.renderer, skinnedMeshRender, resTab, this.maxBones, this.useVertexTexture);
        this.visible(skinnedMeshRender.visible, impl);
        return impl;
    }
    initLight(light) {
        if (!light) {
            return;
        }
        let impl;
        if (light.type === 'Ambient') {
            impl = this.ambientLight = new three_1.THREE.AmbientLight(light.color);
        }
        else if (light.type === 'Direction') {
            impl = new three_1.THREE.DirectionalLight(light.direction, light.diffuse, light.specular);
        }
        return impl;
    }
    initParticleSystem(particlesystem, attachment, resTab) {
        if (!particlesystem) {
            return;
        }
        const scene = attachment === '2D' ? this.scene2D : this.scene;
        const impl = new ps_1.ParticleSystem(particlesystem, scene, this.renderer, resTab);
        return impl;
    }
    initMeshAndMeshRender(meshRender, geo, resTab) {
        if (!meshRender) {
            return;
        }
        let impl;
        if (geo.type === 'BufferGeometry') {
            impl = _LOAD.newloadMesh(this.renderer, geo, meshRender, resTab);
        }
        else if (geo.type === 'Plane') {
            impl = _LOAD.newloadPlane(this.renderer, geo, meshRender, resTab);
        }
        else {
            impl = _LOAD.newloadShape(this.renderer, geo, meshRender, resTab);
        }
        this.visible(meshRender.visible, impl);
        return impl;
    }
    initCamera(camera) {
        if (!camera) {
            return;
        }
        let impl;
        if (camera.perspective) {
            const fov = camera.perspective[0];
            const aspect = camera.perspective[1];
            const near = camera.perspective[2];
            const far = camera.perspective[3];
            impl = this.camera = new three_1.THREE.PerspectiveCamera(fov, aspect, near, far);
        }
        else if (camera.ortho) {
            const l = camera.ortho[0];
            const r = camera.ortho[1];
            const t = camera.ortho[2];
            const b = camera.ortho[3];
            const n = camera.ortho[4];
            const f = camera.ortho[5];
            //impl = this.camera2D = new THREE.OrthographicCamera(l, r, t, b, n, f);
            impl = new three_1.THREE.OrthographicCamera(l, r, t, b, n, f);
            if (!this.camera) {
                this.camera = impl;
                // this.camera2D = impl;
            }
            else {
                this.camera2D = impl;
            }
        }
        return impl;
    }
    /**
     * 初始化spine数据
     * @param spine
     * @param resTab
     */
    initSpine(obj) {
        if (!obj.spine)
            return;
        function start() {
            obj.spineLitener && obj.spineLitener.start && obj.spineLitener.start(skeletonMesh);
        }
        ;
        function end() {
            obj.spineLitener && obj.spineLitener.end && obj.spineLitener.end(skeletonMesh);
        }
        ;
        function complete() {
            obj.spineLitener && obj.spineLitener.complete && obj.spineLitener.complete(skeletonMesh);
        }
        ;
        function disposed() {
            obj.spineLitener && obj.spineLitener.dispose && obj.spineLitener.dispose(skeletonMesh);
        }
        ;
        let res;
        let spineCfg = obj.spine;
        // res = resTab.get(`${_LOAD.RES_TYPE_TEXTURE_ATLAS_IMAGE}:${_LOAD.parseUrl(spineCfg.imgRes)}`);
        // if (!res) return new THREE.Object3D();
        // res = resTab.get(`${_LOAD.RES_TYPE_TEXTURE}:${_LOAD.parseUrl(spineCfg.proRes)}`);
        // if (!res) return new THREE.Object3D();
        res = obj.resTab.get(`${_LOAD.RES_TYPE_TEXTURE_ATLAS}:${_LOAD.parseUrl(spineCfg.atlas)}`);
        if (!res)
            return;
        const atlas = res.link;
        // Create a AtlasAttachmentLoader that resolves region, mesh, boundingbox and path attachments
        const atlasLoader = new spine_1.Spine.AtlasAttachmentLoader(atlas);
        // Create a SkeletonJson instance for parsing the .json file.
        const skeletonJson = new spine_1.Spine.SkeletonJson(atlasLoader);
        // Set the scale to apply during parsing, parse the file, and create a new skeleton.
        skeletonJson.scale = spineCfg.scale || 1;
        // const data = assetManager.get(skeletonFile);
        const data = obj.resTab.get(`${_LOAD.RES_TYPE_STRING}:${_LOAD.parseUrl(spineCfg.proRes)}`).link;
        const skeletonData = skeletonJson.readSkeletonData(data);
        // Create a SkeletonMesh from the data and attach it to the scene
        // 内部处理有调整部分代码
        let skeletonMesh = new spine_1.Spine.threejs.SkeletonMesh(skeletonData);
        skeletonMesh.name = "spine";
        if (spineCfg.position) {
            skeletonMesh.position.set(spineCfg.position[0], spineCfg.position[1], spineCfg.position[2]);
        }
        skeletonMesh.state.setAnimation(0, spineCfg.aniName, spineCfg.isLoop);
        skeletonMesh.state.addListener({
            start: start,
            end: end,
            complete: complete,
            disposed: disposed
        });
        return skeletonMesh;
    }
    modifySpine(skeletonMesh, aniName, isLoop, listener) {
        skeletonMesh.state.setAnimation(0, aniName, isLoop);
    }
    initBox(boxCfg) {
        if (!boxCfg)
            return;
        const geometry = new three_1.THREE.BoxGeometry(boxCfg.geometry.width, boxCfg.geometry.height, boxCfg.geometry.depth);
        const material = new three_1.THREE.MeshBasicMaterial({ color: boxCfg.material.color, wireframe: true, opacity: boxCfg.material.opacity === undefined ? 1 : boxCfg.material.opacity });
        return new three_1.THREE.Mesh(geometry, material);
    }
    initObject3D() {
        return new three_1.THREE.Object3D();
    }
    position(position, impl) {
        if (!position) {
            position = [0, 0, 0];
        }
        impl.position.fromArray(position);
    }
    ortho(ortho, impl) {
        if (ortho && impl.type === "OrthographicCamera") {
            impl.setProjection(ortho[0], ortho[1], ortho[2], ortho[3], ortho[4], ortho[5]);
        }
    }
    scale(scale, impl, textcfg) {
        const s = scale ? [scale[0], scale[1], scale[2]] : [1, 1, 1];
        if (textcfg) {
            const zoomfactor = textcfg.zoomfactor ? textcfg.zoomfactor : 1;
            s[0] = s[0] / zoomfactor;
            s[1] = s[1] / zoomfactor;
        }
        impl.scale.fromArray(s);
    }
    rotate(rotate, impl) {
        if (!rotate) {
            rotate = [0, 0, 0];
        }
        impl.rotation.fromArray(rotate);
    }
    lookatOnce(obj, impl) {
        if (obj.value) {
            _tmpPt.fromArray(obj.value);
            if (!_tmpPt.equals(impl.position)) {
                impl.lookAt(_tmpPt);
            }
        }
    }
    lookat(value, impl) {
        if (value) {
            _tmpPt.fromArray(value);
            if (!_tmpPt.equals(impl.position)) {
                impl.lookAt(_tmpPt);
            }
        }
    }
    playAnim(option, impl, attr, resTab) {
        const content = impl.aniControl[option.name];
        if (!content) {
            console.warn(`控制器上不存在动画：${option.name}`);
            return;
        }
        _LOAD.loadAnimation(option.name, content, resTab, clip => {
            impl.playAnim(clip.link, option.isOnce, option.speed, option.id);
        });
    }
    color(color, impl, attr) {
        const obj = findProperty(impl, attr);
        obj.color = new three_1.THREE.Color(color);
    }
    visible(isVisible, impl) {
        if (isVisible !== undefined) {
            impl.visible = isVisible;
        }
    }
    textCon(textCon, impl, attr, resTab) {
        if (textCon.textcfg.isCommon) {
            _LOAD.loadText(impl, textCon, this.renderer, resTab);
        }
        else {
            textCon.textcfg.text = textCon.show;
            impl.setText(textCon, resTab, _LOAD.GeometryRes, _LOAD.TextureRes, _CANVAS);
        }
    }
    image(image, impl, attr, resTab) {
        const target = findProperty(impl, attr);
        _LOAD.loadImage(image, resTab, img => {
            target.image = img;
            target.needsUpdate = true;
        });
    }
    map(texture, impl, attr, resTab) {
        const target = findProperty(impl, attr);
        _LOAD.loadImgTexture(texture.image, this.renderer, resTab, texture => {
            target.map = texture;
        });
    }
    geometry(geo, impl, attr, resTab) {
        _LOAD.newloadGeo(this.renderer, geo, impl, resTab);
    }
    wave(wave, impl) {
        if (!impl.wave) {
            impl.wave = new three_1.THREE.WaveEffect(wave);
        }
        if (!impl.posts) {
            impl.posts = [];
        }
        impl.posts.push(impl.wave);
    }
}
const findProperty = (obj, attr) => {
    let target = obj;
    if (attr.length === 1) {
        return target;
    }
    for (let i = 0; i < attr.length - 1; i++) {
        if (obj instanceof three_1.THREE.Object3D && attr[i].endsWith('Render')) {
            continue;
        }
        target = target[attr[i]];
        if (!target) {
            throw new Error('属性不存在');
        }
    }
    return target;
};
const bindBone = (skeleton, objs) => {
    const bones = skeleton.bones;
    for (let i = 0; i < objs.length; i++) {
        for (let j = 0; j < bones.length; j++) {
            if (bones[j].name === objs[i].bindBone) {
                bones[j].add(objs[i].ref.impl);
            }
        }
    }
};
});
