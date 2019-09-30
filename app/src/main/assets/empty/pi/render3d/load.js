_$define("pi/render3d/load", function (require, exports, module){
"use strict";
/**
 *
 */
// ============================== 导入
Object.defineProperty(exports, "__esModule", { value: true });
const mod_1 = require("../lang/mod");
const _CANVAS = require("../util/canvas");
const log_1 = require("../util/log");
const res_mgr_1 = require("../util/res_mgr");
const util_1 = require("../util/util");
const drc_parser_1 = require("./drc_parser");
const three_1 = require("./three");
const texture_atlas_1 = require("./texture_atlas");
exports.RES_PATH = 'res/';
const TERRAIN_PATH = 'terrain/';
class Animation {
}
exports.Animation = Animation;
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
        if (this.link) {
            this.link.dispose();
            this.link.image = null;
            this.link = null;
            this.args = null;
        }
    }
}
exports.TextureRes = TextureRes;
/**
 * @description Geometry资源
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
        if (Array.isArray(this.link)) {
            for (const value of this.link) {
                value.dispose();
            }
        }
        else if (this.link) {
            this.link.dispose();
        }
    }
}
exports.GeometryRes = GeometryRes;
// 分割url成两部分
const splitPath = (url) => {
    let urlPath = '';
    let urlFile = url;
    const result = /(.*)\/(.*)/.exec(url);
    // tslint:disable-next-line:prefer-type-cast
    if (result)
        [, urlPath, urlFile] = result;
    return { urlPath, urlFile };
};
/**
 * @description 获取 geo 自动转换成同名的drc, drc必须在depend中存在
 * @example
 */
const getTransDrcName = (name) => {
    const suf = mod_1.butil.fileSuffix(name);
    if (suf !== 'geo') {
        return name;
    }
    const s = `${name.slice(0, name.length - suf.length)}drc`;
    return mod_1.depend.get(s) ? s : name;
};
// 从场景或者配置中找到资源
// tslint:disable-next-line:no-reserved-keywords
exports.findRes = (content, type, key) => {
    const res = [];
    const isRes = (name) => {
        if (typeof name !== 'string') {
            return false;
        }
        return name.endsWith('.ai')
            || name.endsWith('.geo')
            || name.endsWith('.drc')
            || name.endsWith('.png')
            || name.endsWith('.jpg')
            || name.endsWith('.skl')
            || name.endsWith('.rtpl')
            || name.endsWith('.json')
            || name.endsWith('.atlas');
    };
    const findFromScene = (con) => {
        for (const k in con) {
            const v = con[k];
            if (typeof v === 'object') {
                if (v === null) {
                    continue;
                }
                else {
                    findFromScene(v);
                }
            }
            else if (v && isRes(con[k])) {
                res.push(con[k]);
            }
        }
    };
    const findFromCfg = (con, k) => {
        const v = con[k];
        if (!con[k]) {
            throw new Error('找不到对应的key');
        }
        for (const i in v.res) {
            res.push(v.res[i]);
        }
        res.push(v.tpl);
        if (v.aniControl) {
            const ani = con.ainMod[v.aniControl];
            for (let j = 0; j < ani; j++) {
                res.push(ani[j]);
            }
        }
    };
    if (type === 'scene') {
        findFromScene(content);
    }
    else if (type === 'cfg') {
        if (key) {
            findFromCfg(content, key);
        }
        else {
            for (const k in content) {
                if (k !== 'ainMod') {
                    findFromCfg(content, k);
                }
            }
        }
    }
    return util_1.unique(res);
};
exports.configMap = new Map();
// 资源配置路径表，键是去去掉前缀的资源路径，值是全路径
exports.resConfigPathMap = new Map();
exports.getConfigMap = () => {
    return exports.configMap;
};
// 从配置表里面寻找文件，找不到抛异常 
exports.findConfigFile = (path) => {
    if (!path.startsWith('RES_TYPE_IMGTEXT')) {
        path = exports.resConfigPathMap.get(path);
    }
    let data = exports.configMap.get(path);
    if (!data) {
        const content = `findFile 404, path = ${path}`;
        log_1.warn(log_1.LogLevel.warn, content);
        throw new Error(content);
    }
    if (data instanceof ArrayBuffer && !path.endsWith('.ai') && !path.endsWith('.rtpl')) {
        data = util_1.toJson(mod_1.butil.utf8Decode(data));
        exports.configMap.set(path, data);
    }
    return data;
};
exports.addSceneRes = (fileArray, resPrefix = '') => {
    const resTab = new res_mgr_1.ResTab();
    resTab.timeout = 0;
    if (!resPrefix.endsWith('/'))
        resPrefix += '/';
    // 空字符串对应的全局路径
    exports.resConfigPathMap.set('', resPrefix);
    for (const path in fileArray) {
        if (!path.startsWith(resPrefix)) {
            continue;
        }
        // 纪录局部路径和全局路径的键
        exports.resConfigPathMap.set(path.slice(resPrefix.length), path);
        const isJson = jsonSuffixs.some(value => path.endsWith(value));
        if (isJson) {
            exports.configMap.set(path, fileArray[path]);
        }
        else if (res_mgr_1.BlobType[mod_1.butil.fileSuffix(path)]) {
            resTab.load(`${res_mgr_1.RES_TYPE_BLOB}:${path}`, res_mgr_1.RES_TYPE_BLOB, path, fileArray);
        }
        else {
            resTab.load(`${res_mgr_1.RES_TYPE_FILE}:${path}`, res_mgr_1.RES_TYPE_FILE, path, fileArray);
        }
    }
    resTab.release();
};
const jsonSuffixs = ['.scene', '.rtpl', '.json', '.nav'];
const meshGeo = (res, renderer, mesh) => {
    if (mesh._isDestroy) {
        return;
    }
    mesh.boundingBox = mesh.boundingBox || new three_1.THREE.Box3();
    mesh.setGeometry(res.link);
    mesh.boundingBox.union(res.link.boundingBox);
    renderer.updateGeometry(mesh);
};
exports.meshTex = (tex, material, texKey, index, mesh, renderer) => {
    const texData = material[texKey];
    if (texData.mapping)
        tex.mapping = texData.mapping;
    if (texData.wrap) {
        tex.wrapS = texData.wrap[0];
        tex.wrapT = texData.wrap[1];
    }
    if (texData.filter) {
        tex.magFilter = texData.filter[0];
        tex.minFilter = texData.filter[1];
    }
    if (texData.generateMipmaps !== undefined)
        tex.generateMipmaps = texData.generateMipmaps;
    if (mesh.material) {
        mesh.setTexture(tex, texKey, index);
    }
};
// 所有纹理，包括光照贴图等
exports.setMaterials = (resTab, renderer, mesh, render, callBack, geotype) => {
    if (!render || !render.material) {
        return;
    }
    const materials = render.material;
    const mapKeyOR = {
        map: 'mapst', lightMap: 'lightmapst', _Splat0: '_splat0st',
        _Splat1: '_splat1st', _Splat2: '_splat2st', _Control: '_controlst', ASMMap: 'asmmapst', NAHMap: 'nahmapst', EmissionMap: 'emissionmapst'
    };
    const func = (material, index) => {
        for (const k in mapKeyOR) {
            if (material[k]) {
                if (material[k].offset || material[k].repeat) {
                    material[mapKeyOR[k]] = getST(material[k]);
                }
                exports.loadImgTexture(material[k].image, renderer, resTab, mod_1.butil.curryFirst(callBack, material, k, index, mesh, renderer));
            }
        }
    };
    if (geotype === 'Plane' && Array.isArray(materials)) {
        func(materials[0], -1);
        mesh.setMaterial(materials[0]);
    }
    else if (Array.isArray(materials)) {
        for (let i = 0; i < materials.length; i++) {
            const material = materials[i];
            func(material, i);
            mesh.setMaterial(material, i);
        }
    }
    else {
        func(render.material, -1);
        mesh.setMaterial(render.material);
    }
};
const getST = (obj) => {
    const or = [1, 1, 0, 0];
    if (obj.repeat) {
        or[0] = obj.repeat[0];
        or[1] = obj.repeat[1];
    }
    if (obj.offset) {
        or[2] = obj.offset[0];
        or[3] = obj.offset[1];
    }
    return or;
};
const terrainGeo = (res, tmesh) => {
    if (tmesh._isDestroy) {
        return;
    }
    tmesh.boundingBox = tmesh.boundingBox || new three_1.THREE.Box3();
    const geometry = res.link;
    tmesh.setGeometry(geometry);
    tmesh.boundingBox.union(geometry.boundingBox);
};
const terrainTex = (tex, texData, property, index, tmesh) => {
    if (tmesh._isDestroy) {
        return;
    }
    if (texData.mapping)
        tex.mapping = texData.mapping;
    if (texData.wrapS)
        tex.wrapS = texData.wrapS;
    if (texData.wrapT)
        tex.wrapT = texData.wrapT;
    if (texData.generateMipmaps !== undefined)
        tex.generateMipmaps = texData.generateMipmaps;
    tex.needsUpdate = true;
    tmesh.setTexture(property, tex);
};
const parseGeoImpl = (data, callBack) => {
    const i32 = new Int32Array(data, 16, 3);
    const vtCount = i32[0]; // 顶点数量 4字节
    const subCount = i32[1]; // 子网格数量 4字节
    const decLength = i32[2]; // 描述信息字节数 4字节
    const subSLlen = subCount * 4 * 2;
    const subSL = new Int32Array(data, 28, subCount * 2); // 子网格的索引偏移， 子网格索引数量; subSLlen字节
    const dec = new Int32Array(data, subCount * 4 * 2 + 28, decLength / 4); // 描述信息
    const attrDes = [['index', 1], ['position', 3], ['normal', 3], ['tangent', 3],
        ['skinIndex', 4], ['uv', 2], ['uv2', 2], ['uv3', 2], ['uv4', 2], ['skinWeight', 4], ['color', 4]];
    const geometry = new three_1.THREE.BufferGeometry();
    const addAttribute = (offset, length, geometry, attrDes) => {
        const attr = new Float32Array(data, offset, length / 4);
        geometry.addAttribute(attrDes[0], new three_1.THREE.BufferAttribute(attr, attrDes[1]));
    };
    const addUv2 = (offset, length, geometry) => {
        if (length > 0) {
            const attr = new Float32Array(data, offset, length / 4);
            geometry.addAttribute('uv2', new three_1.THREE.BufferAttribute(attr, 2));
        }
    };
    const setIndex = (offset, length, geometry) => {
        let indices;
        if (length < 65536 * 2) {
            indices = new Uint16Array(data, offset, length / 2);
        }
        else {
            indices = new Uint32Array(data, offset, length / 4);
        }
        geometry.setIndex(new three_1.THREE.BufferAttribute(indices, 1));
    };
    let i = 0;
    while (i < dec.length) {
        // tslint:disable-next-line:no-reserved-keywords
        const type = dec[i];
        if (type === 0) {
            setIndex(dec[i + 1], dec[i + 2], geometry);
        }
        else if (type === 6) {
            addUv2(dec[i + 1], dec[i + 2], geometry);
        }
        else {
            addAttribute(dec[i + 1], dec[i + 2], geometry, attrDes[type]);
        }
        i += 3;
    }
    for (i = 0; i < subCount; i++) {
        geometry.addGroup(subSL[i * 2], subSL[i * 2 + 1], i);
    }
    geometry.computeVertexNormals();
    geometry.computeBoundingBox();
    geometry.elementsNeedUpdate = true;
    callBack(geometry);
};
exports.parseDrcImpl = (data, callBack) => {
    const t = new Int32Array(data, 0, 2); // [子网格数量， 描述信息长度]
    const subCount = new Int32Array(data, 0, 2)[0]; // 子网格数量
    const decL = new Int32Array(data, 0, 2)[1]; // 描述信息长度
    const subSL = new Int32Array(data, 8, subCount * 2); // 子网格的索引偏移， 子网格索引数量;
    const dec = new Int32Array(data, subCount * 2 * 4 + 8, decL / 4); // 描述信息； 类型， id，类型， id.....
    const info = data.slice(subCount * 2 * 4 + decL + 8, data.byteLength); // 详细信息(drc格式的数据)
    // tslint:disable:prefer-type-cast
    const attrDes = [['index', 1], ['position', 3, 'POSITION'], ['normal', 3, 'NORMAL'], ['tangent', 3],
        ['skinIndex', 4, 'GENERIC'], ['uv', 2, 'TEX_COORD'], ['uv2', 2, 'TEX_COORD'], ['uv3', 2, , 'TEX_COORD'],
        ['uv4', 2, , 'TEX_COORD'], ['skinWeight', 4, 'GENERIC'], ['color', 4, 'COLOR']];
    const attrMap = {};
    for (let i = 0; i < dec.length / 2; i++) {
        attrMap[attrDes[dec[i * 2]][0]] = dec[i * 2 + 1];
    }
    drc_parser_1.decodeDrc(info, attrMap, (geometry) => {
        for (let i = 0; i < subCount; i++) {
            geometry.addGroup(subSL[i * 2], subSL[i * 2 + 1], i);
        }
        geometry.computeVertexNormals();
        geometry.computeBoundingBox();
        geometry.elementsNeedUpdate = true;
        callBack(geometry);
    });
};
/**
 * data
 * 16字节: ANIMATION_1.0
 * 4字节: 描述信息偏移量
 * 4字节: 描述信息长度
 * float二进制数据
 * 描述信息：
 *
 * property:["position.x","position.y","position.z"],  // 属性名称
 * length: [],                                         // 与property一一对应，为每个属性的关键帧帧数
 * keys: ["time"，"value", "inTangent", "outTangent"], // 目前只有4个元素，关键帧导出信息的Key
 * content: [offset, offset, offset, offset],          // 描述每帧、每个key的数据的offset
 */
const parseAnimation = (name, data) => {
    if (!data) {
        console.error('  no arrayBuffer in data');
        return null;
    }
    const desOffset = new Int32Array(data, 16, 1)[0];
    const desLen = new Int32Array(data, 20, 1)[0];
    const des = JSON.parse(three_1.THREE.AnimationUtils.utf8Decode(data.slice(desOffset, desOffset + desLen)));
    const tracks = [];
    let duration = -1;
    const clipName = name || 'default';
    const keyLen = des.keys.length;
    const keys = des.keys;
    const indexMap = {
        time: undefined,
        value: undefined,
        inTangent: undefined,
        outTangent: undefined
    };
    for (let i = 0; i < keyLen; i++) {
        indexMap[keys[i]] = i;
    }
    if (indexMap.time === undefined) {
        throw new Error('动画文件缺少times属性');
    }
    if (!indexMap.value === undefined) {
        throw new Error('动画文件缺少values属性');
    }
    for (let i = 0; i < des.property.length; i++) {
        const begin = i * keyLen;
        const tvLen = (des.content[begin + 1] - des.content[begin]) / 4;
        const times = new Float32Array(data, des.content[begin + indexMap.time], tvLen);
        const values = new Float32Array(data, des.content[begin + indexMap.value], tvLen);
        let inTangent;
        let outTangent;
        if (indexMap.inTangent !== undefined) {
            if (des.content[begin + indexMap.inTangent] !== -1) {
                inTangent = new Float32Array(data, des.content[begin + indexMap.inTangent], tvLen);
            }
        }
        if (indexMap.outTangent !== undefined) {
            if (des.content[begin + indexMap.outTangent] !== -1) {
                outTangent = new Float32Array(data, des.content[begin + indexMap.outTangent], tvLen);
            }
        }
        if (outTangent === undefined) {
            outTangent = inTangent;
        }
        if (times.length !== 0) {
            let mode = three_1.THREE.InterpolateLinear;
            if (inTangent) {
                mode = three_1.THREE.InterpolateSmooth;
            }
            const attr = des.property[i];
            const track = new three_1.THREE.KeyframeTrack(attr, times, values, mode);
            track.setTangent(inTangent, outTangent);
            tracks.push(track);
        }
        if (times[times.length - 1] > duration) {
            duration = times[times.length - 1];
        }
    }
    if (tracks.length === 0) {
        return null;
    }
    const clip = new three_1.THREE.AnimationClip(clipName, duration, tracks);
    return clip;
};
const parseSkeleton = (data) => {
    const transformLen = new Int32Array(data, 16, 1)[0];
    const indexLen = new Int32Array(data, 20, 1)[0];
    const nameLen = new Int32Array(data, 24, 1)[0];
    const transforms = new Float32Array(data, 28, transformLen / 4);
    const indexs = new Int16Array(data, transformLen + 28, indexLen / 2);
    const names = mod_1.butil.utf8Decode(data.slice(indexLen + transformLen + 28, indexLen + transformLen + nameLen + 28)).split(',');
    const bones = [];
    for (let i = 0; i < names.length; i++) {
        const start = i * 10;
        const bone = {};
        bone.name = names[i];
        bone.parent = indexs[i];
        bone.pos = [transforms[start], transforms[start + 1], transforms[start + 2]];
        bone.rotq = [transforms[start + 3], transforms[start + 4], transforms[start + 5], transforms[start + 6]];
        bone.scl = [transforms[start + 7], transforms[start + 8], transforms[start + 9]];
        bones[i] = bone;
    }
    return bones;
};
exports.parseGeometry = (path, resTab, callBack) => {
    const p = exports.resConfigPathMap.get(path);
    path = p !== undefined ? p : exports.resConfigPathMap.get('') + path;
    path = getTransDrcName(path);
    const key = `${exports.RES_TYPE_GEOMETRY}:${path}`;
    const data = new GeometryData();
    data.resTab = resTab;
    if (path.split('.')[1] === 'drc') {
        data.parseFun = exports.parseDrcImpl;
    }
    else {
        data.parseFun = parseGeoImpl;
    }
    resTab.load(key, exports.RES_TYPE_GEOMETRY, path, data, callBack);
};
/**
 * 加载动画，返回动画clip
 */
exports.loadAnimation = (name, fileName, resTab, cb) => {
    fileName = exports.RES_PATH + fileName;
    let path = exports.resConfigPathMap.get(fileName);
    path = path !== undefined ? path : exports.resConfigPathMap.get('') + fileName;
    const key = `${exports.RES_TYPE_ANIMATION}:${path}`;
    const data = new AnimationData();
    data.resTab = resTab;
    data.name = name;
    resTab.load(key, exports.RES_TYPE_ANIMATION, path, data, clip => {
        cb(clip);
    });
};
/**
 * 加载网格
 */
exports.newloadMesh = (renderer, geo, render, resTab) => {
    const mesh = new three_1.THREE.Mesh();
    const url = geo.res;
    exports.setMaterials(resTab, renderer, mesh, render, exports.meshTex);
    exports.parseGeometry(exports.RES_PATH + url, resTab, mod_1.butil.curryFirst(meshGeo, renderer, mesh));
    return mesh;
};
/**
 * 加载网格(不包含材质)
 */
exports.newloadGeo = (renderer, geo, impl, resTab) => {
    if (geo.type === 'BufferGeometry') {
        const url = geo.res;
        exports.parseGeometry(exports.RES_PATH + url, resTab, mod_1.butil.curryFirst(meshGeo, renderer, impl));
    }
    else if (geo.type === 'Plane') {
        impl.setGeometry(exports.createPlane(resTab, geo.width || 1, geo.height || 1, 1, 1, geo.horizontalAlign, geo.verticalAlign));
        renderer.updateGeometry(impl);
    }
    else {
        impl.setGeometry(exports.createBox(resTab, geo.width || 1, geo.height || 1, geo.longness || 1));
        renderer.updateGeometry(impl);
    }
};
/**
 * 加载骨骼网格
 */
exports.newloadSkeletonMesh = (renderer, skinnedMeshRender, resTab, maxBones, useVertexTexture) => {
    const mesh = new three_1.THREE.SkinnedMesh();
    mesh.setMaxBones(maxBones);
    mesh.setUseVertexTexture(useVertexTexture);
    const url = skinnedMeshRender.geometry.res;
    mesh.setBoundBone(skinnedMeshRender.bounds, skinnedMeshRender.rootbone);
    if (skinnedMeshRender.boundVisible) {
        mesh.setBoundVisible();
    }
    exports.setMaterials(resTab, renderer, mesh, skinnedMeshRender, exports.meshTex);
    exports.parseGeometry(exports.RES_PATH + url, resTab, mod_1.butil.curryFirst(meshGeo, renderer, mesh));
    return mesh;
};
exports.createBox = (resTab, x, y, z) => {
    const key = `${exports.RES_TYPE_GEOMETRY}-Box:${x},${y},${z}`;
    const res = resTab.get(key);
    if (res)
        return res.link;
    const box = new three_1.THREE.BoxBufferGeometry(x, y, z);
    resTab.createRes(key, exports.RES_TYPE_GEOMETRY, undefined, GeometryRes, box);
    return box;
};
/**
 * 加载规则的几何体(目前只实现了立方体)
 */
exports.newloadShape = (renderer, geo, render, resTab) => {
    let g;
    // tslint:disable-next-line:prefer-const
    let m;
    g = exports.createBox(resTab, geo.width || 1, geo.height || 1, geo.longness || 1);
    const materials = render.material;
    if (render.attachment === '2D') {
        m.enableLight = false;
    }
    const mesh = new three_1.THREE.Mesh(g);
    render.material[1] = render.material[0];
    render.material[2] = render.material[0];
    render.material[3] = render.material[0];
    render.material[4] = render.material[0];
    render.material[5] = render.material[0];
    exports.setMaterials(resTab, renderer, mesh, render, exports.meshTex);
    return mesh;
};
/**
 * 加载四边形
 */
exports.newloadPlane = (renderer, geo, render, resTab) => {
    let g;
    // tslint:disable-next-line:prefer-const
    let m;
    g = exports.createPlane(resTab, geo.width || 1, geo.height || 1, 1, 1, geo.horizontalAlign, geo.verticalAlign);
    const mesh = new three_1.THREE.Mesh(g);
    exports.setMaterials(resTab, renderer, mesh, render, exports.meshTex, geo.type);
    return mesh;
};
exports.createPlane = (resTab, w, h, cw, ch, horizontalAlign, verticalAlign) => {
    const key = `geometry-Plane:${w},${h},${cw},${ch},${horizontalAlign},${verticalAlign}`;
    const res = resTab.get(key);
    if (res)
        return res.link;
    const plane = new three_1.THREE.PlaneBufferGeometry(w, h, cw, ch, horizontalAlign, verticalAlign);
    resTab.createRes(key, exports.RES_TYPE_GEOMETRY, undefined, GeometryRes, plane);
    return plane;
};
/**
 * 加载并解析骨骼
 */
exports.newloadSkeleton = (fileName, resTab, callBack) => {
    const url = exports.RES_PATH + fileName;
    let path = exports.resConfigPathMap.get(url);
    path = path !== undefined ? path : exports.resConfigPathMap.get('') + url;
    const key = `${exports.RES_TYPE_SKELETON}:${path}`;
    resTab.load(key, exports.RES_TYPE_SKELETON, path, resTab, bones => {
        callBack(bones.link);
    });
};
exports.loadTerrain = (url, renderer, resTab = null, cb) => {
    const json = exports.findConfigFile(TERRAIN_PATH + url);
    const paths = [{ name: TERRAIN_PATH + json.image1 }, { name: TERRAIN_PATH + json.image2 }, { name: TERRAIN_PATH + json.image3 }];
    exports.loadImgTextures(paths, renderer, resTab, (texs) => {
        const blend = json.blend;
        const terrain = new three_1.THREE.Terrain(json.width, json.height, blend.width, blend.height);
        terrain.setTexture(0, texs[0]);
        terrain.setTexture(1, texs[1]);
        terrain.setTexture(2, texs[2]);
        terrain.setTextureIsReady();
        texs = undefined;
        // Blend
        terrain.setBlendSeed(blend.seed[0], blend.seed[1], blend.seed[2], blend.seed[3]);
        terrain.setBlendCoff(blend.constCoff1, blend.linearCoff1, blend.constCoff2, blend.linearCoff2);
        terrain.setBlendFrequency(blend.frequency1, blend.frequency2, blend.frequency3);
        terrain.setBlendClamp(blend.oneClamp, blend.zeroClamp, blend.middleValue);
        terrain.updateBlend(renderer.getThreeRenderer());
        cb && cb(terrain);
    });
};
/**
 * 加载文字
 */
exports.loadText = (text, textCon, renderer, resTab) => {
    const textcfg = textCon.textcfg;
    const key = _CANVAS.getImgTextKey(textcfg, 'texture');
    const res = resTab.get(key);
    const fun = (texture) => {
        const shows = (!textCon.show) ? [] : textCon.show.split('');
        const uvs = [];
        for (let i = 0; i < shows.length; i++) {
            if (!texture.args.charUV[shows[i]]) {
                throw new Error('loadText: charUV isn\'t exist');
            }
            uvs.push(texture.args.charUV[shows[i]]);
        }
        text.setTexture(texture.link);
        if (!uvs || uvs.length === 0) {
            text.visible = false;
            return;
        }
        else {
            text.visible = true;
        }
        const alignModHorizon = textCon.horizontalAlign || 'left';
        const alignModVertical = textCon.verticalAlign || 'top';
        // tslint:disable-next-line:max-line-length
        const gk = `${exports.RES_TYPE_GEOMETRY}:${key}|${textCon.show}|${texture.args.width}|${texture.args.height}|${textCon.width}|${alignModHorizon}|${alignModVertical}`;
        let geometry;
        const textSize = {};
        const res = resTab.get(gk);
        if (res) {
            geometry = res.link;
        }
        else {
            geometry = text.createTxPlaneBufferGeometry(uvs, texture.args.width, texture.args.height, textCon.width, alignModHorizon, alignModVertical, textSize);
            resTab.createRes(gk, 'geometry', undefined, GeometryRes, geometry);
        }
        text.setGeometry(geometry);
    };
    if (res) {
        fun(res);
    }
    else {
        const data = new TexData(resTab, renderer);
        resTab.load(key, exports.RES_TYPE_TEXTURE, { type: _CANVAS.RES_TYPE_IMGTEXT, cfg: textcfg }, data, fun);
    }
};
// tslint:disable:max-classes-per-file
class TexData {
    // tslint:disable-next-line:typedef
    constructor(resTab, renderer) {
        this.resTab = resTab;
        this.renderer = renderer;
    }
}
/**
 * @description 加载图片纹理
 * @param cb 回调，只有一个参数，Texture
 */
exports.loadImgTexture = (image, renderer, resTab, cb) => {
    let url = exports.RES_PATH + image.name;
    const filter = image.filter;
    const p = exports.resConfigPathMap.get(url);
    url = p !== undefined ? p : exports.resConfigPathMap.get('') + url;
    let key = `${exports.RES_TYPE_TEXTURE}:${url}`;
    if (filter) {
        key += ` | ${_CANVAS.getImgFilterKey({ arr: filter, img: url, path: '' })}`;
    }
    const texData = new TexData(resTab, renderer);
    resTab.load(key, exports.RES_TYPE_TEXTURE, image, texData, texRes => cb && setTimeout(() => cb(texRes.link), 0));
};
exports.loadImgTextures = (images, renderer, resTab, cb) => {
    let num = images.length;
    const result = [];
    for (let i = 0; i < images.length; ++i) {
        exports.loadImgTexture(images[i], renderer, resTab, tex => {
            result[i] = tex;
            if (--num === 0)
                cb && cb(result);
        });
    }
};
exports.loadImage = (image, resTab, cb) => {
    let arg;
    let key = `${exports.RES_TYPE_IMAGE}:`;
    if (image.type === _CANVAS.RES_TYPE_IMGTEXT) {
        arg = { sourceType: _CANVAS.RES_TYPE_IMGTEXT, value: image.cfg };
        key += _CANVAS.getImgTextKey(image.cfg);
    }
    else {
        let url = exports.RES_PATH + image.name;
        const filter = image.filter;
        const p = exports.resConfigPathMap.get(url);
        url = p !== undefined ? p : exports.resConfigPathMap.get('') + url;
        key += url;
        if (filter) {
            arg = { sourceType: _CANVAS.RES_TYPE_IMGFILTER, value: { arr: filter, img: url, path: '' } };
            key += ` | ${_CANVAS.getImgFilterKey(arg.value)}`;
        }
        else {
            arg = { sourceType: res_mgr_1.RES_TYPE_BLOB, value: url };
        }
    }
    loadRes[arg.sourceType](resTab, arg.value, res => {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
            cb(img, res.args);
        };
        img.src = res.link;
    });
};
/**
 * 解析字符串
 * @param url
 */
exports.parseUrl = (url) => {
    url = exports.RES_PATH + url;
    const p = exports.resConfigPathMap.get(exports.RES_PATH + url);
    url = p !== undefined ? p : exports.resConfigPathMap.get('') + url;
    return url;
};
/**
 * 加载字符串
 * @param url
 * @param resTab
 * @param cb
 */
exports.loadString = (url, resTab, cb) => {
    url = exports.parseUrl(url);
    let key = `${exports.RES_TYPE_STRING}:${url}`;
    resTab.load(key, exports.RES_TYPE_STRING, url, resTab, texRes => {
        cb && setTimeout(() => cb(texRes.link), 0);
    });
};
/**
 * 加载骨骼纹理
 * @param url
 * @param resTab
 * @param cb
 */
exports.loadTextureAtlas = (url, resTab, cb) => {
    url = exports.parseUrl(url);
    let key = `${exports.RES_TYPE_TEXTURE_ATLAS}:${url}`;
    resTab.load(key, exports.RES_TYPE_TEXTURE_ATLAS, url, resTab, texRes => {
        cb && setTimeout(() => cb(texRes.link), 0);
    });
};
const loadRes = {};
loadRes[res_mgr_1.RES_TYPE_BLOB] = (resTab, path, cb) => {
    const key = `${res_mgr_1.RES_TYPE_BLOB}:${path}`;
    const res = resTab.get(key);
    if (res)
        cb(res);
    else {
        resTab.load(key, res_mgr_1.RES_TYPE_BLOB, path, undefined, cb, error => {
            throw new Error(`load.ts loadRes${res_mgr_1.RES_TYPE_BLOB} failed, path = ${path}, error = ${error.reason}`);
        });
    }
};
loadRes[_CANVAS.RES_TYPE_IMGTEXT] = (resTab, textCfg, cb) => {
    const key = _CANVAS.getImgTextKey(textCfg);
    const res = resTab.get(key);
    if (res) {
        cb(res);
        textCfg.charUV = res.args.charUV;
    }
    else {
        resTab.load(key, _CANVAS.RES_TYPE_IMGTEXT, textCfg, undefined, cb);
    }
};
loadRes[_CANVAS.RES_TYPE_IMGFILTER] = (resTab, imgFilterCfg, cb) => {
    const key = _CANVAS.getImgFilterKey(imgFilterCfg);
    const res = resTab.get(key);
    if (res) {
        cb(res);
    }
    else {
        resTab.load(key, _CANVAS.RES_TYPE_IMGFILTER, imgFilterCfg, resTab, cb);
    }
};
class GeometryData {
}
exports.GeometryData = GeometryData;
// tslint:disable-next-line:no-reserved-keywords
const createGeometryRes = (name, type, path, data) => {
    const key = `${res_mgr_1.RES_TYPE_FILE}:${path}`;
    data.resTab.load(key, res_mgr_1.RES_TYPE_FILE, path, undefined, bufferRes => {
        data.parseFun(bufferRes.link, (geo) => {
            res_mgr_1.loadOK(name, type, path, GeometryRes, geo);
        });
    }, err => {
        throw new Error(`createGeometryRes failed, key = ${key}, err = ${err.reason}`);
    });
};
// tslint:disable-next-line:no-reserved-keywords
const createTextureRes = (name, type, image, data) => {
    const tex = new three_1.THREE.Texture();
    const r = exports.loadImage(image, data.resTab, (img, args) => {
        tex.image = img;
        tex.isReady = true;
        tex.needsUpdate = true;
        res_mgr_1.loadOK(name, type, args, TextureRes, tex);
    });
};
// tslint:disable-next-line:no-reserved-keywords
exports.createSkeletonRes = (key, type, path, resTab) => {
    resTab.load(`${res_mgr_1.RES_TYPE_FILE}:${path}`, res_mgr_1.RES_TYPE_FILE, path, resTab, res => {
        res_mgr_1.loadOK(key, type, path, res_mgr_1.Res, parseSkeleton(res.link));
    });
};
/**
 * 创建字符串类型资源
 * @param key
 * @param type
 * @param path
 * @param resTab
 */
const createStringRes = (name, type, path, resTab) => {
    resTab.load(`${res_mgr_1.RES_TYPE_FILE}:${path}`, res_mgr_1.RES_TYPE_FILE, path, resTab, res => {
        res_mgr_1.loadOK(name, type, path, res_mgr_1.Res, mod_1.butil.utf8Decode(res.link));
    });
};
const createTextureAtlasRes = (name, type, path, resTab) => {
    let key = `${exports.RES_TYPE_STRING}:${path}`;
    resTab.load(key, exports.RES_TYPE_STRING, path, resTab, texRes => {
        res_mgr_1.loadOK(name, type, path, res_mgr_1.Res, new texture_atlas_1.TextureAtlas(texRes.link));
    });
};
/**
 * 手动 创建纹理
 * @param url 	资源路径
 * @param res 	res 表
 * @param w 	图片宽
 * @param h 	图片高
 */
exports.getNewTexture = (url, res, w, h) => {
    let _url = exports.parseUrl(url);
    let key = `${exports.RES_TYPE_TEXTURE}:${_url}`;
    let image = new Image();
    image.decoding = "async";
    image.src = "../" + _url;
    image.width = w;
    image.height = h;
    return new texture_atlas_1.ThreeJsTexture(image, res.get(key).link.texture);
};
exports.findTexture = (url, res) => {
    let _url = exports.parseUrl(url);
    let key = `${exports.RES_TYPE_TEXTURE}:${_url}`;
    return res.get(key).link;
};
class AnimationData {
}
exports.AnimationData = AnimationData;
// tslint:disable-next-line:no-reserved-keywords
exports.createAnimationRes = (key, type, path, data) => {
    const resTab = data.resTab;
    resTab.load(`${res_mgr_1.RES_TYPE_FILE}:${path}`, res_mgr_1.RES_TYPE_FILE, path, resTab, res => {
        res_mgr_1.loadOK(key, type, path, res_mgr_1.Res, parseAnimation(data.name, res.link));
    });
};
exports.RES_TYPE_SKELETON = 'skeleton';
exports.RES_TYPE_ANIMATION = 'animation';
exports.RES_TYPE_TEXTURE = 'texture';
exports.RES_TYPE_IMAGE = 'image';
exports.RES_TYPE_GEOMETRY = 'geometry';
exports.RES_TYPE_STRING = 'string';
exports.RES_TYPE_TEXTURE_ATLAS = 'textureAtlas';
exports.RES_TYPE_TEXTURE_ATLAS_IMAGE = 'textureAtlasImage';
res_mgr_1.register(exports.RES_TYPE_SKELETON, exports.createSkeletonRes);
res_mgr_1.register(exports.RES_TYPE_ANIMATION, exports.createAnimationRes);
res_mgr_1.register(exports.RES_TYPE_TEXTURE, createTextureRes);
res_mgr_1.register(exports.RES_TYPE_GEOMETRY, createGeometryRes);
res_mgr_1.register(exports.RES_TYPE_STRING, createStringRes);
res_mgr_1.register(exports.RES_TYPE_TEXTURE_ATLAS, createTextureAtlasRes);
});
