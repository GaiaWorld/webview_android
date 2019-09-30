_$define("pi/bigint/big_struct.s", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const struct_mgr_1 = require("../struct/struct_mgr");
const sinfo_1 = require("../struct/sinfo");
const util_1 = require("./util");
class U64 extends struct_mgr_1.Struct {
    constructor(value, old) {
        super();
        if (!old) {
            this.value = value;
        }
        else {
            this.value = value === undefined ? old.value : value;
        }
    }
    addMeta(mgr) {
        if (this._$meta)
            return;
        struct_mgr_1.addToMeta(mgr, this);
    }
    removeMeta() {
        struct_mgr_1.removeFromMeta(this);
    }
    bonDecode(bb) {
        this.value = util_1.u64Merge(bb.readBigInt());
    }
    bonEncode(bb) {
        bb.writeBigInt(util_1.u64Unwrap(this.value));
    }
}
U64._$info = new sinfo_1.StructInfo("pi/bigint/big_struct.U64", 2075458578, new Map([["constructor", "true"]]), [new sinfo_1.FieldInfo("value", new sinfo_1.EnumType(sinfo_1.Type.U64), null)]);
exports.U64 = U64;
struct_mgr_1.structMgr.register(U64._$info.name_hash, U64, U64._$info.name);
class U128 extends struct_mgr_1.Struct {
    constructor(value, old) {
        super();
        if (!old) {
            this.value = value;
        }
        else {
            this.value = value === undefined ? old.value : value;
        }
    }
    addMeta(mgr) {
        if (this._$meta)
            return;
        struct_mgr_1.addToMeta(mgr, this);
    }
    removeMeta() {
        struct_mgr_1.removeFromMeta(this);
    }
    bonDecode(bb) {
        this.value = util_1.u128Merge(bb.readBigInt());
    }
    bonEncode(bb) {
        bb.writeBigInt(util_1.u128Unwrap(this.value));
    }
}
U128._$info = new sinfo_1.StructInfo("pi/bigint/big_struct.U128", 873530750, new Map([["constructor", "true"]]), [new sinfo_1.FieldInfo("value", new sinfo_1.EnumType(sinfo_1.Type.U128), null)]);
exports.U128 = U128;
struct_mgr_1.structMgr.register(U128._$info.name_hash, U128, U128._$info.name);
});
