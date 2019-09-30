_$define("pi/struct/sinfo", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Type;
(function (Type) {
    Type[Type["Bool"] = 0] = "Bool";
    Type[Type["U8"] = 1] = "U8";
    Type[Type["U16"] = 2] = "U16";
    Type[Type["U32"] = 3] = "U32";
    Type[Type["U64"] = 4] = "U64";
    Type[Type["U128"] = 5] = "U128";
    Type[Type["U256"] = 6] = "U256";
    Type[Type["Usize"] = 7] = "Usize";
    Type[Type["I8"] = 8] = "I8";
    Type[Type["I16"] = 9] = "I16";
    Type[Type["I32"] = 10] = "I32";
    Type[Type["I64"] = 11] = "I64";
    Type[Type["I128"] = 12] = "I128";
    Type[Type["I256"] = 13] = "I256";
    Type[Type["Isize"] = 14] = "Isize";
    Type[Type["F32"] = 15] = "F32";
    Type[Type["F64"] = 16] = "F64";
    Type[Type["BigI"] = 17] = "BigI";
    Type[Type["Str"] = 18] = "Str";
    Type[Type["Bin"] = 19] = "Bin";
    Type[Type["Arr"] = 20] = "Arr";
    Type[Type["Map"] = 21] = "Map";
    Type[Type["Struct"] = 22] = "Struct";
    Type[Type["Option"] = 23] = "Option";
    Type[Type["Enum"] = 24] = "Enum";
})(Type = exports.Type || (exports.Type = {}));
class EnumType {
    constructor(type, into) {
        this.type = type;
        switch (this.type) {
            case Type.Arr:
                this.into = into;
                break;
            case Type.Option:
                this.into = into;
                break;
            case Type.Map:
                this.mapType = into;
                break;
            case Type.Struct:
                this.structType = into;
                break;
            case Type.Enum:
                this.enumType = into;
                break;
            default:
                break;
        }
    }
    /**
     * 二进制编码
     */
    bonEncode(bb) {
        bb.writeInt(this.type);
        this.into && bb.writeBonCode(this.into);
        if (this.mapType) {
            bb.writeBonCode(this.mapType[0]);
            bb.writeBonCode(this.mapType[1]);
        }
        this.structType && bb.writeBonCode(this.structType);
        this.enumType && bb.writeBonCode(this.enumType);
    }
    /**
     * 二进制解码
     */
    bonDecode(bb) {
        this.type = bb.readInt();
        switch (this.type) {
            case Type.Arr:
                this.into = bb.readBonCode(EnumType);
                break;
            case Type.Option:
                this.into = bb.readBonCode(EnumType);
                break;
            case Type.Map:
                this.mapType = [bb.readBonCode(EnumType), bb.readBonCode(EnumType)];
                break;
            case Type.Struct:
                this.structType = bb.readBonCode(StructInfo);
                break;
            case Type.Enum:
                this.enumType = bb.readBonCode(EnumInfo);
                break;
            default:
                break;
        }
    }
}
exports.EnumType = EnumType;
class FieldInfo {
    /**
     * @param name 字段名
     * @param ftype 字段类型
     * @param notes 字段注解， 可以为null
     */
    constructor(name, ftype, notes) {
        this.name = name;
        this.ftype = ftype;
        this.notes = notes;
    }
    /**
     * 二进制编码
     */
    bonEncode(bb) {
        bb.writeUtf8(this.name);
        bb.writeBonCode(this.ftype);
        if (this.notes) {
            bb.writeMap(this.notes, (v, k) => {
                bb.writeUtf8(k);
                bb.writeUtf8(v);
            });
        }
        else {
            bb.writeNil();
        }
    }
    /**
     * 二进制解码
     */
    bonDecode(bb) {
        this.name = bb.readUtf8();
        this.ftype = bb.readBonCode(EnumType);
        if (!bb.isNil()) {
            this.notes = bb.readMap(() => {
                return [bb.readUtf8(), bb.readUtf8()];
            });
        }
    }
}
exports.FieldInfo = FieldInfo;
/**
 * 结构信息
 * @example
 */
class StructInfo {
    /**
     * @param name 名称
     * @param name_hash hash值
     * @param notes 注解，可以为null
     * @param fields 字段，没有字段是应该传入空数组[], 不允许传入null
     */
    constructor(name, name_hash, notes, fields) {
        this.name = name;
        this.name_hash = name_hash;
        this.notes = notes;
        this.fields = fields || [];
    }
    bonEncode(bb) {
        bb.writeUtf8(this.name);
        bb.writeInt(this.name_hash);
        if (this.notes) {
            bb.writeMap(this.notes, (k, v) => {
                bb.writeUtf8(k);
                bb.writeUtf8(v);
            });
        }
        else {
            bb.writeNil();
        }
        bb.writeArray(this.fields, (el) => {
            bb.writeBonCode(el);
        });
    }
    /**
     * 二进制解码
     */
    bonDecode(bb) {
        this.name = bb.readUtf8();
        this.name_hash = bb.readInt();
        if (!bb.isNil()) {
            this.notes = bb.readMap(() => {
                return [bb.readUtf8(), bb.readUtf8()];
            });
        }
        this.fields = bb.readArray(() => {
            return bb.readBonCode(FieldInfo);
        });
    }
}
exports.StructInfo = StructInfo;
class EnumInfo {
    /**
     * @param name 名称
     * @param name_hash hash值
     * @param notes 注解，可以为null
     * @param members 枚举成员类型，该数组不能为空，但其中的元素可以为空
     */
    constructor(name, name_hash, notes, members) {
        this.name = name;
        this.name_hash = name_hash;
        this.notes = notes;
        this.members = members || [];
    }
    bonEncode(bb) {
        bb.writeUtf8(this.name);
        bb.writeInt(this.name_hash);
        if (this.notes) {
            bb.writeMap(this.notes, (k, v) => {
                bb.writeUtf8(k);
                bb.writeUtf8(v);
            });
        }
        else {
            bb.writeNil();
        }
        bb.writeArray(this.members, (el) => {
            if (el === null || el === undefined) {
                bb.writeNil();
            }
            else {
                bb.writeBonCode(el);
            }
        });
    }
    /**
     * 二进制解码
     */
    bonDecode(bb) {
        this.name = bb.readUtf8();
        this.name_hash = bb.readInt();
        if (!bb.isNil()) {
            this.notes = bb.readMap(() => {
                return [bb.readUtf8(), bb.readUtf8()];
            });
        }
        this.members = bb.readArray(() => {
            if (bb.isNil()) {
                return null;
            }
            else {
                return bb.readBonCode(EnumType);
            }
        });
    }
}
exports.EnumInfo = EnumInfo;
//数据库表的元信息， 应该移动至db.ts文件中？
class TabMeta {
    constructor(k, v) {
        this.k = k;
        this.v = v;
    }
    bonEncode(bb) {
        this.k.bonEncode(bb);
        this.v.bonEncode(bb);
    }
    bonDecode(bb) {
        this.k = bb.readBonCode(EnumType);
        this.v = bb.readBonCode(EnumType);
    }
}
exports.TabMeta = TabMeta;
});
