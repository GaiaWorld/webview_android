_$define("pi/net/rpc_r.s", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const struct_mgr_1 = require("../struct/struct_mgr");
const sinfo_1 = require("../struct/sinfo");
class OK_I extends struct_mgr_1.Struct {
    bonDecode(bb) {
        this.value = bb.readInt();
    }
    bonEncode(bb) {
        bb.writeInt(this.value);
    }
}
OK_I._$info = new sinfo_1.StructInfo("pi/net/rpc_r.OK_I", 722477464, null, [new sinfo_1.FieldInfo("value", new sinfo_1.EnumType(sinfo_1.Type.Usize), null)]);
exports.OK_I = OK_I;
struct_mgr_1.structMgr.register(OK_I._$info.name_hash, OK_I, OK_I._$info.name);
class OK_S extends struct_mgr_1.Struct {
    bonDecode(bb) {
        this.value = bb.readUtf8();
    }
    bonEncode(bb) {
        bb.writeUtf8(this.value);
    }
}
OK_S._$info = new sinfo_1.StructInfo("pi/net/rpc_r.OK_S", 1882083963, null, [new sinfo_1.FieldInfo("value", new sinfo_1.EnumType(sinfo_1.Type.Str), null)]);
exports.OK_S = OK_S;
struct_mgr_1.structMgr.register(OK_S._$info.name_hash, OK_S, OK_S._$info.name);
class Req extends struct_mgr_1.Struct {
    bonDecode(bb) {
        this.path = bb.readUtf8();
    }
    bonEncode(bb) {
        bb.writeUtf8(this.path);
    }
}
Req._$info = new sinfo_1.StructInfo("pi/net/rpc_r.Req", 3608827980, null, [new sinfo_1.FieldInfo("path", new sinfo_1.EnumType(sinfo_1.Type.Str), null)]);
exports.Req = Req;
struct_mgr_1.structMgr.register(Req._$info.name_hash, Req, Req._$info.name);
class Error extends struct_mgr_1.Struct {
    bonDecode(bb) {
        this.code = bb.readInt();
        this.info = bb.readUtf8();
    }
    bonEncode(bb) {
        bb.writeInt(this.code);
        bb.writeUtf8(this.info);
    }
}
Error._$info = new sinfo_1.StructInfo("pi/net/rpc_r.Error", 2102366875, null, [new sinfo_1.FieldInfo("code", new sinfo_1.EnumType(sinfo_1.Type.Usize), null), new sinfo_1.FieldInfo("info", new sinfo_1.EnumType(sinfo_1.Type.Str), null)]);
exports.Error = Error;
struct_mgr_1.structMgr.register(Error._$info.name_hash, Error, Error._$info.name);
class Ok extends struct_mgr_1.Struct {
    bonDecode(bb) {
    }
    bonEncode(bb) {
    }
}
Ok._$info = new sinfo_1.StructInfo("pi/net/rpc_r.Ok", 622395616, null, []);
exports.Ok = Ok;
struct_mgr_1.structMgr.register(Ok._$info.name_hash, Ok, Ok._$info.name);
});
