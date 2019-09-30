_$define("pi/struct/util", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const struct_mgr_1 = require("./struct_mgr");
exports.rigisterStruct = (structMgr) => {
    for (var id in pi_modules) {
        if (pi_modules.hasOwnProperty(id) && pi_modules[id].exports) {
            for (var kk in pi_modules[id].exports) {
                var c = pi_modules[id].exports[kk];
                if (struct_mgr_1.Struct.isPrototypeOf(c) && c._$info) {
                    //console.log(c._$info);
                    structMgr.register(c._$info.name_hash, c, c._$info.name);
                }
            }
        }
    }
};
exports.writeBon = (o, bb) => {
    bb.writeCt(o, () => {
        let h = o.constructor._$info.name_hash;
        bb.writeU32(h); //写类型hash
        o.bonEncode(bb);
    });
};
//写入一个数组
exports.writeArray = (o, bb) => {
    bb.writeCt(o, () => {
        bb.writeU32(2); //数组类型
        bb.writeArray(o, (el) => {
            exports.write(el, bb);
        });
    });
};
exports.writeMap = (o, bb) => {
    bb.writeCt(o, () => {
        bb.writeU32(3); //map类型
        bb.writeMap(o, (k, v) => {
            exports.write(k, bb);
            exports.write(v, bb);
        });
    });
};
exports.write = (o, bb) => {
    if (o === undefined || o === null) {
        bb.writeNil();
    }
    else if (Object.prototype.toString.call(o) == '[object Array]') {
        exports.writeArray(o, bb);
    }
    else if (o instanceof Map) {
        exports.writeMap(o, bb);
    }
    else if (o instanceof struct_mgr_1.Struct) {
        exports.writeBon(o, bb);
    }
    else {
        bb.write(o);
    }
};
exports.read = (bb, mgr) => {
    return bb.read((b, t) => {
        if (t === 2) {
            return b.readArray(() => {
                return exports.read(b, mgr);
            });
        }
        else if (t === 3) {
            return b.readMap(() => {
                return [exports.read(b, mgr), exports.read(b, mgr)];
            });
        }
        else {
            let c = mgr.lookup(t).construct; //必须保证mgr中存在该类型的元信息;
            let r = bb.readBonCode(c);
            return r;
        }
    });
};
});
