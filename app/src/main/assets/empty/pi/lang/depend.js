_$define("pi/lang/depend", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const struct_mgr_1 = require("../struct/struct_mgr");
const sinfo_1 = require("../struct/sinfo");
class FeilDes extends struct_mgr_1.Struct {
    //构造方法， depend形如{"js": ["a/b/c", "d/e/f"]}
    constructor(path, sign, time, size, depend, children) {
        super();
        this.path = path;
        this.sign = sign;
        this.size = size;
        this.time = time;
        if (depend) {
            this.depend = new Map();
            for (let k in depend) {
                this.depend.set(k, depend[k]);
            }
        }
        this.children = children;
    }
    bonDecode(bb) {
        this.path = bb.readUtf8();
        this.sign = bb.readUtf8();
        this.time = bb.readInt();
        this.size = bb.readInt();
        this.depend = bb.readMap(() => {
            return [bb.readUtf8(), bb.readArray(() => {
                    return bb.readUtf8();
                })];
        });
        this.children = bb.readMap(() => {
            return [bb.readUtf8(), bb.readBonCode(FeilDes)];
        });
    }
    bonEncode(bb) {
        bb.writeUtf8(this.path);
        bb.writeUtf8(this.sign);
        bb.writeInt(this.time);
        bb.writeInt(this.size);
        bb.writeMap(this.depend, (k, v) => {
            bb.writeUtf8(k);
            bb.writeArray(v, (el) => {
                bb.writeUtf8(el);
            });
        });
        bb.writeMap(this.children, (k, v) => {
            bb.writeUtf8(k);
            bb.writeBonCode(v);
        });
    }
}
exports.FeilDes = FeilDes;
class Depend extends struct_mgr_1.Struct {
    constructor() {
        super(...arguments);
        this.fileMap = new Map();
        // 将目录放入到文件表中
        this.initDir = function (f, map) {
            var i, dir, info, s, suf = "", path = f.path, i = path.lastIndexOf("."), j = path.lastIndexOf("/");
            if (i > j)
                suf = path.slice(i + 1);
            j = 0;
            while ((i = path.indexOf("/", j)) >= 0) {
                dir = path.slice(j, i + 1);
                info = map[dir];
                if (!info) {
                    map[dir] = info = new FeilDes(path.slice(0, i), null, null, 0, null, null);
                    this.fileMap[path.slice(0, i + 1)] = info;
                }
                info.size += f.size;
                map = info.children;
                j = i + 1;
            }
            if (info)
                map[path.slice(j)] = f;
        };
    }
    bonDecode(bb) {
        this.fileMap = bb.readMap(() => {
            return [bb.readUtf8(), bb.readBonCode(FeilDes)];
        });
    }
    bonEncode(bb) {
        bb.writeMap(this.fileMap, (k, v) => {
            bb.writeUtf8(k);
            bb.writeBonCode(v);
        });
    }
    addDepend(files, root) {
        var i, f, dir, fileMap = new Map();
        for (i = files.length - 1; i >= 0; i--) {
            let fi = files[i];
            f = new FeilDes(fi.path, fi.sign, fi.time, fi.size, fi.depend, fi.children);
            fileMap[f.path] = f;
            this.initDir(f, fileMap);
        }
    }
    get(path) {
        return this.fileMap[path];
    }
    ;
    // 获得文件表
    getFileMap() {
        return this.fileMap;
    }
    ;
}
Depend._$sinfo = new sinfo_1.StructInfo("Depend", 111111111, null, []);
exports.Depend = Depend;
});
