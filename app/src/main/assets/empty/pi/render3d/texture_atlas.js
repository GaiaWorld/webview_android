_$define("pi/render3d/texture_atlas", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const three_1 = require("./three");
/**
 * 构建纹理图集
 */
class TextureAtlas {
    constructor(atlasText) {
        this.pages = new Array();
        this.regions = new Array();
        this.load(atlasText);
    }
    load(atlasText) {
        let reader = new TextureAtlasReader(atlasText);
        let tuple = new Array(4);
        let page = null;
        while (true) {
            let line = reader.readLine();
            if (line == null)
                break;
            line = line.trim();
            if (line.length == 0)
                page = null;
            else if (!page) {
                page = new TextureAtlasPage();
                page.name = line;
                if (reader.readTuple(tuple) == 2) { // size is only optional for an atlas packed with an old TexturePacker.
                    page.width = parseInt(tuple[0]);
                    page.height = parseInt(tuple[1]);
                    reader.readTuple(tuple);
                }
                // page.format = Format[tuple[0]]; we don't need format in WebGL
                reader.readTuple(tuple);
                page.minFilter = Texture.filterFromString(tuple[0]);
                page.magFilter = Texture.filterFromString(tuple[1]);
                let direction = reader.readValue();
                page.uWrap = TextureWrap.ClampToEdge;
                page.vWrap = TextureWrap.ClampToEdge;
                if (direction == "x")
                    page.uWrap = TextureWrap.Repeat;
                else if (direction == "y")
                    page.vWrap = TextureWrap.Repeat;
                else if (direction == "xy")
                    page.uWrap = page.vWrap = TextureWrap.Repeat;
                // page.texture = textureLoader(line, page.width, page.height);
                // page.texture.setFilters(page.minFilter, page.magFilter);
                // page.texture.setWraps(page.uWrap, page.vWrap);
                // page.width = page.texture.getImage().width;
                // page.height = page.texture.getImage().height;
                this.pages.push(page);
            }
            else {
                let region = new TextureAtlasRegion();
                region.name = line;
                region.page = page;
                region.rotate = reader.readValue() == "true";
                reader.readTuple(tuple);
                let x = parseInt(tuple[0]);
                let y = parseInt(tuple[1]);
                reader.readTuple(tuple);
                let width = parseInt(tuple[0]);
                let height = parseInt(tuple[1]);
                region.u = x / page.width;
                region.v = y / page.height;
                if (region.rotate) {
                    region.u2 = (x + height) / page.width;
                    region.v2 = (y + width) / page.height;
                }
                else {
                    region.u2 = (x + width) / page.width;
                    region.v2 = (y + height) / page.height;
                }
                region.x = x;
                region.y = y;
                region.width = Math.abs(width);
                region.height = Math.abs(height);
                if (reader.readTuple(tuple) == 4) { // split is optional
                    // region.splits = new Vector.<int>(parseInt(tuple[0]), parseInt(tuple[1]), parseInt(tuple[2]), parseInt(tuple[3]));
                    if (reader.readTuple(tuple) == 4) { // pad is optional, but only present with splits
                        //region.pads = Vector.<int>(parseInt(tuple[0]), parseInt(tuple[1]), parseInt(tuple[2]), parseInt(tuple[3]));
                        reader.readTuple(tuple);
                    }
                }
                region.originalWidth = parseInt(tuple[0]);
                region.originalHeight = parseInt(tuple[1]);
                reader.readTuple(tuple);
                region.offsetX = parseInt(tuple[0]);
                region.offsetY = parseInt(tuple[1]);
                region.index = parseInt(reader.readValue());
                // region.texture = page.texture;
                this.regions.push(region);
            }
        }
    }
    /**
     * 所需图片加载成功后，调用设置 纹理
     * @param f     获取纹理的方法
     * @param res   资源表
     */
    setPageAndRegionTexture(f, res) {
        this.pages.forEach(element => {
            if (element) {
                element.texture = f(element.name, res, element.width, element.height);
                element.texture.setFilters(element.minFilter, element.magFilter);
                element.texture.setWraps(element.uWrap, element.vWrap);
            }
        });
        // for ( let i=0, l=arr.length; i<l; i++){
        //     this.pages[i].texture = arr[i];
        //     this.pages[i].texture.setFilters(this.pages[i].minFilter, this.pages[i].magFilter);
        //     this.pages[i].texture.setWraps(this.pages[i].uWrap, this.pages[i].vWrap);
        // }
        this.regions.forEach(element => {
            element && (element.texture = element.page.texture);
        });
    }
    /**
     * 所需图片加载成功后，调用设置 纹理
     * @param arrTexture   纹理表
     */
    setPageAndRegionTexture2(arrTexture) {
        for (let i = 0, l = this.pages.length; i < l; i++) {
            let texture = arrTexture[`${this.pages[i].name}`];
            let image = texture.image;
            this.pages[i].texture = new ThreeJsTexture(image, texture);
            this.pages[i].texture.setFilters(this.pages[i].minFilter, this.pages[i].magFilter);
            this.pages[i].texture.setWraps(this.pages[i].uWrap, this.pages[i].vWrap);
        }
        this.regions.forEach(element => {
            element && (element.texture = element.page.texture);
        });
    }
    findRegion(name) {
        for (let i = this.regions.length - 1; i >= 0; i--) {
            if (this.regions[i].name == name) {
                return this.regions[i];
            }
        }
        return null;
    }
    dispose() {
        for (let i = this.pages.length - 1; i >= 0; i--) {
            this.pages[i].texture.dispose();
        }
    }
}
exports.TextureAtlas = TextureAtlas;
class TextureAtlasReader {
    constructor(text) {
        this.index = 0;
        this.lines = text.split(/\r\n|\r|\n/);
    }
    readLine() {
        if (this.index >= this.lines.length)
            return null;
        return this.lines[this.index++];
    }
    readValue() {
        let line = this.readLine();
        let colon = line.indexOf(":");
        if (colon == -1)
            throw new Error("Invalid line: " + line);
        return line.substring(colon + 1).trim();
    }
    readTuple(tuple) {
        let line = this.readLine();
        let colon = line.indexOf(":");
        if (colon == -1)
            throw new Error("Invalid line: " + line);
        let i = 0, lastMatch = colon + 1;
        for (; i < 3; i++) {
            let comma = line.indexOf(",", lastMatch);
            if (comma == -1)
                break;
            tuple[i] = line.substr(lastMatch, comma - lastMatch).trim();
            lastMatch = comma + 1;
        }
        tuple[i] = line.substring(lastMatch).trim();
        return i + 1;
    }
}
class Texture {
    constructor(image) {
        this._image = image;
    }
    getImage() {
        return this._image;
    }
    static filterFromString(text) {
        switch (text.toLowerCase()) {
            case "nearest": return TextureFilter.Nearest;
            case "linear": return TextureFilter.Linear;
            case "mipmap": return TextureFilter.MipMap;
            case "mipmapnearestnearest": return TextureFilter.MipMapNearestNearest;
            case "mipmaplinearnearest": return TextureFilter.MipMapLinearNearest;
            case "mipmapnearestlinear": return TextureFilter.MipMapNearestLinear;
            case "mipmaplinearlinear": return TextureFilter.MipMapLinearLinear;
            default: throw new Error(`Unknown texture filter ${text}`);
        }
    }
    static wrapFromString(text) {
        switch (text.toLowerCase()) {
            case "mirroredtepeat": return TextureWrap.MirroredRepeat;
            case "clamptoedge": return TextureWrap.ClampToEdge;
            case "repeat": return TextureWrap.Repeat;
            default: throw new Error(`Unknown texture wrap ${text}`);
        }
    }
}
exports.Texture = Texture;
class ThreeJsTexture extends Texture {
    constructor(image, texture) {
        super(image);
        this.texture = texture || new three_1.THREE.Texture();
        this.texture.image = image;
        this.texture.flipY = false;
        this.texture.needsUpdate = true;
    }
    setFilters(minFilter, magFilter) {
        this.texture.minFilter = ThreeJsTexture.toThreeJsTextureFilter(minFilter);
        this.texture.magFilter = ThreeJsTexture.toThreeJsTextureFilter(magFilter);
    }
    setWraps(uWrap, vWrap) {
        this.texture.wrapS = ThreeJsTexture.toThreeJsTextureWrap(uWrap);
        this.texture.wrapT = ThreeJsTexture.toThreeJsTextureWrap(vWrap);
    }
    dispose() {
        // this.texture.dispose();
    }
    static toThreeJsTextureFilter(filter) {
        if (filter === TextureFilter.Linear)
            return three_1.THREE.LinearFilter;
        else if (filter === TextureFilter.MipMap)
            return three_1.THREE.LinearMipMapLinearFilter; // also includes TextureFilter.MipMapLinearLinear
        else if (filter === TextureFilter.MipMapLinearNearest)
            return three_1.THREE.LinearMipMapNearestFilter;
        else if (filter === TextureFilter.MipMapNearestLinear)
            return three_1.THREE.NearestMipMapLinearFilter;
        else if (filter === TextureFilter.MipMapNearestNearest)
            return three_1.THREE.NearestMipMapNearestFilter;
        else if (filter === TextureFilter.Nearest)
            return three_1.THREE.NearestFilter;
        else
            throw new Error("Unknown texture filter: " + filter);
    }
    static toThreeJsTextureWrap(wrap) {
        if (wrap === TextureWrap.ClampToEdge)
            return three_1.THREE.ClampToEdgeWrapping;
        else if (wrap === TextureWrap.MirroredRepeat)
            return three_1.THREE.MirroredRepeatWrapping;
        else if (wrap === TextureWrap.Repeat)
            return three_1.THREE.RepeatWrapping;
        else
            throw new Error("Unknown texture wrap: " + wrap);
    }
}
exports.ThreeJsTexture = ThreeJsTexture;
class TextureRegion {
    constructor() {
        this.u = 0;
        this.v = 0;
        this.u2 = 0;
        this.v2 = 0;
        this.width = 0;
        this.height = 0;
        this.rotate = false;
        this.offsetX = 0;
        this.offsetY = 0;
        this.originalWidth = 0;
        this.originalHeight = 0;
    }
}
exports.TextureRegion = TextureRegion;
class TextureAtlasPage {
}
exports.TextureAtlasPage = TextureAtlasPage;
class TextureAtlasRegion extends TextureRegion {
}
exports.TextureAtlasRegion = TextureAtlasRegion;
var TextureFilter;
(function (TextureFilter) {
    TextureFilter[TextureFilter["Nearest"] = 9728] = "Nearest";
    TextureFilter[TextureFilter["Linear"] = 9729] = "Linear";
    TextureFilter[TextureFilter["MipMap"] = 9987] = "MipMap";
    TextureFilter[TextureFilter["MipMapNearestNearest"] = 9984] = "MipMapNearestNearest";
    TextureFilter[TextureFilter["MipMapLinearNearest"] = 9985] = "MipMapLinearNearest";
    TextureFilter[TextureFilter["MipMapNearestLinear"] = 9986] = "MipMapNearestLinear";
    TextureFilter[TextureFilter["MipMapLinearLinear"] = 9987] = "MipMapLinearLinear"; // WebGLRenderingContext.LINEAR_MIPMAP_LINEAR
})(TextureFilter = exports.TextureFilter || (exports.TextureFilter = {}));
var TextureWrap;
(function (TextureWrap) {
    TextureWrap[TextureWrap["MirroredRepeat"] = 33648] = "MirroredRepeat";
    TextureWrap[TextureWrap["ClampToEdge"] = 33071] = "ClampToEdge";
    TextureWrap[TextureWrap["Repeat"] = 10497] = "Repeat"; // WebGLRenderingContext.REPEAT
})(TextureWrap = exports.TextureWrap || (exports.TextureWrap = {}));
});
