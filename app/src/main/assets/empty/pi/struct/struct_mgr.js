_$define("pi/struct/struct_mgr", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util/util");
class StructMeta {
    //添加元信息
    addStruct(s) {
        s._$meta = this;
    }
    //删除元信息
    delStruct(ss) {
        ss._$meta = null;
    }
}
exports.StructMeta = StructMeta;
/**
 * 结构元信息
 * @example
 */
class MStructMeta extends StructMeta {
    constructor() {
        super(...arguments);
        this.maxIndex = 0; // 当前实例的最大索引位置
        this.map = new Map(); // 实例表
        this.add = []; // 插入监听器
        this.modify = []; // 修改监听器
        this.remove = []; // 删除监听器	
    }
    //添加一个实例
    addStruct(s) {
        s._$index = this.maxIndex++;
        s._$meta = this;
        this.map.set(s._$index, s);
        this.addNotify(s); //通知添加监听器
    }
    //插入一个实例
    insertStruct(s, index) {
        s._$index = index;
        s._$meta = this;
        this.map.set(s._$index, s);
        this.addNotify(s); //通知添加监听器
        if (index >= this.maxIndex) {
            this.maxIndex = index + 1;
        }
    }
    //删除一个实例
    delStruct(ss) {
        let s = this.map.get(ss._$index);
        if (!s)
            throw new Error("StructMeta Error:struct is not exist!,index:" + ss._$index);
        this.map.delete(ss._$index);
        this.removeNotify(s);
        s._$meta = null;
        s._$index = -1;
    }
    //通知插入监听
    addNotify(s) {
        let arr = this.add;
        for (let l of arr)
            l(s);
    }
    //通知移除监听
    removeNotify(s) {
        let arr = this.remove;
        for (let l of arr)
            l(s);
    }
    //通知修改监听
    modifyNotify(s, fieldKey, value, old, index) {
        let arr = this.modify;
        for (let l of arr)
            l(s, fieldKey, value, old, index);
    }
    /**
     * 添加结构添加监听器
     */
    addAddListener(listener) {
        this.add.push(listener);
    }
    /**
     * 移除组件添加监听器
     */
    removeAddListener(listener) {
        this.add = util_1.arrDelete(this.add, this.add.indexOf(listener));
    }
    /**
     * 注册组件修改监听器
     */
    addModifyListener(listener) {
        this.modify = util_1.arrInsert(this.modify, listener);
    }
    /**
     * 移除组件添加监听器
     */
    removeModifyListener(listener) {
        this.modify = util_1.arrDelete(this.modify, this.modify.indexOf(listener));
    }
    /**
     * 注册组件移除监听器
     */
    addRemoveListener(listener) {
        this.remove = util_1.arrInsert(this.remove, listener);
    }
    /**
     * 移除组件添加监听器
     */
    removeRemoveListener(listener) {
        this.remove = util_1.arrDelete(this.remove, this.remove.indexOf(listener));
    }
}
exports.MStructMeta = MStructMeta;
/**
 * 结构
 * @example
 */
class Struct {
    _$getSinfo() {
        return this.constructor._$info;
    }
    removeMeta() { }
    ; //从元信息上移除
    addMeta(mgr) { }
    ; //添加到元信息上
    bonEncode(bb) { }
    ; //二进制编码
    bonDecode(bb) { }
    ; //二进制解码
}
exports.Struct = Struct;
class Bon extends Struct {
    constructor(data) {
        super();
        this.data = data;
    }
    bonEncode(bb) {
        bb.writeBon(this.data);
    }
    ;
    bonDecode(bb) {
        throw new Error("Bon is can not readed");
    }
    ;
}
exports.Bon = Bon;
/**
 * 实例被管理器管理起来的结构
 * @example
 */
class MStruct extends Struct {
    insertMeta(mgr, index) { }
    ; //添加到元信息上
}
exports.MStruct = MStruct;
/**
 * 将结构添加到元信息中
 */
exports.addToMeta = (ss, struct) => {
    const meta = ss.constructMap.get(struct.constructor);
    if (!meta)
        throw new Error("unregister struct, name:" + struct.constructor.name);
    meta.addStruct(struct);
};
/**
 * 将结构添加插入到元信息中
 */
exports.insertToMeta = (ss, struct, index) => {
    const meta = ss.constructMap.get(struct.constructor);
    if (!meta)
        throw new Error("unregister struct, name:" + struct.constructor.name);
    meta.insertStruct(struct, index);
};
/**
 * 从元信息中删除结构
 */
exports.removeFromMeta = (struct) => {
    struct._$meta.delStruct(struct);
};
/**
 * 通知字段改变
 */
exports.notifyModify = (struct, field, value, old, index) => {
    struct._$meta.modifyNotify(struct, field, value, old, index);
};
/**
 * 结构系统管理器
 * @example
 */
class StructMgr {
    constructor() {
        this.numberMap = new Map(); //组件元信息表
        this.constructMap = new Map(); //组件元信息表
    }
    /**
     * 注册
     */
    register(nameHash, construct, name) {
        const hash = construct._$info.name_hash;
        const meta = this.numberMap.get(hash);
        if (meta)
            throw new Error("class already register, name:" + name);
        let s;
        if (MStruct.isPrototypeOf(construct)) {
            s = new MStructMeta;
        }
        else {
            s = new StructMeta;
        }
        s.construct = construct;
        s.mgr = this;
        s.info = construct._$info;
        construct._$info.name = name;
        s.name = name;
        this.numberMap.set(hash, s);
        this.constructMap.set(construct, s);
    }
    /**
     * 查询
     */
    lookup(key) {
        return Number.isInteger(key) ? this.numberMap.get(key) : this.constructMap.get(key);
    }
}
exports.StructMgr = StructMgr;
exports.structMgr = new StructMgr();
});
