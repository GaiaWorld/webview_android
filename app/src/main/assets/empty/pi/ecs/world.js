_$define("pi/ecs/world", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util/util");
const hash_1 = require("../util/hash");
const struct_mgr_1 = require("../struct/struct_mgr");
/**
 * 组件, 组件只能有一个父组件
 * @example
 */
class Component extends struct_mgr_1.MStruct {
    removeMeta() {
        super.removeMeta();
        parent = null;
    }
    ;
}
exports.Component = Component;
/**
 * 实体
 * @example
 */
class Entity extends struct_mgr_1.MStruct {
    constructor() {
        super(...arguments);
        this.children = new Map(); //子实体
        this.comp = new Map(); // 组件表
    }
    /**
     * 添加子实体，并调用监听器（创建、修改、删除，可以定义域监听）
     * @param e:子实体， mgr:管理器
     */
    addChild(e) {
        if (!e)
            return;
        if (e.parent)
            throw new Error("entity has already parent");
        e.parent = this;
        this.children.set(e._$index, e);
    }
    /**
     * 移除子实体
     */
    removeChild(index) {
        let ee = this.children.get(index);
        if (!ee)
            throw new Error("entity is not exist!,index:" + index);
        this.children.delete(index);
        struct_mgr_1.removeFromMeta(ee);
        ee.children.forEach((v) => {
            ee.removeChild(v._$index); //递归删除子实体
        });
    }
    /**
     * 添加子组件，相同的子组件类型会替换，并调用监听器（创建、修改、删除，可以定义域监听）
     */
    addComp(c) {
        if (c && c.parent)
            throw new Error("component has already parent");
        const old = this.comp.get(c.constructor);
        if (old) {
            struct_mgr_1.removeFromMeta(old);
            old.parent = null;
        }
        this.comp.set(c.constructor, c);
        c.parent = this;
        //c.fieldKey = ""; // 特殊处理
        struct_mgr_1.addToMeta(this._$meta.mgr, c);
        return old;
    }
    /**
     * 移除子组件，参数为子组件的类， 并调用监听器（创建、修改、删除，可以定义域监听）
     */
    removeComp(compClass) {
        const old = this.comp.get(compClass);
        if (!old)
            throw new Error("component is not exist");
        old.removeMeta();
        return old;
    }
    /**
     * 获取组件
     */
    getComp(compClass) {
        return this.comp.get(compClass);
    }
}
exports.Entity = Entity;
/**
 * 实体索引
 * @example
 */
class EntityIndex {
    constructor(keys) {
        // 实体索引
        this.map = new Map();
        // 包含的组件类
        this.keys = new Set();
        this.keys = new Set(keys);
    }
}
exports.EntityIndex = EntityIndex;
/**
 * 组件索引
 * @example
 */
class ComponentIndex {
    constructor(key, parentKey) {
        // 组件索引
        this.map = new Map();
        this.key = key;
        this.parentKey = parentKey;
    }
}
exports.ComponentIndex = ComponentIndex;
/**
 * 单例组件索引
 * @example
 */
class SingleIndex {
    constructor(key) {
        this.key = key;
    }
}
exports.SingleIndex = SingleIndex;
/**
 * 创建世界
 * @example
 */
class World extends struct_mgr_1.StructMgr {
    /**
     * 构造方法
     */
    constructor() {
        super();
        super.register(hash_1.strHashCode(module.id + "Entity", 0), Entity, module.id + "Entity");
    }
    /**
     * 添加实体索引
     */
    addEntityIndex(i) {
        i.addListener = (c) => {
            const p = c.parent;
            for (let k of i.keys) {
                if (!p.getComp(k))
                    return;
            }
            i.map.set(p._$index, p);
        };
        i.removeListener = (c) => {
            const p = c.parent;
            i.map.delete(p._$index);
        };
        for (let c of i.keys) {
            this.addAddListener(c, i.addListener, Entity);
            this.addRemoveListener(c, i.removeListener, Entity);
        }
    }
    /**
     * 移除实体索引
     */
    removeEntityIndex(i) {
        for (let c of i.keys) {
            this.removeAddListener(c, i.addListener, Entity);
            this.removeRemoveListener(c, i.removeListener, Entity);
        }
    }
    /**
     * 添加组件索引
     */
    addComponentIndex(i) {
        i.addListener = (c) => {
            i.map.set(c._$index, c);
        };
        i.removeListener = (c) => {
            i.map.delete(c._$index);
        };
        this.addAddListener(i.key, i.addListener, i.parentKey);
        this.addRemoveListener(i.key, i.removeListener, i.parentKey);
    }
    /**
     * 移除组件索引
     */
    removeComponentIndex(i) {
        this.removeAddListener(i.key, i.addListener, i.parentKey);
        this.removeRemoveListener(i.key, i.removeListener, i.parentKey);
    }
    /**
     * 添加单例组件索引
     */
    addSingleIndex(i) {
        i.addListener = (c) => {
            i.comp = c;
        };
        i.removeListener = (c) => {
            i.comp = null;
        };
        this.addAddListener(i.key, i.addListener);
        this.addRemoveListener(i.key, i.removeListener);
    }
    /**
     * 移除单例组件索引
     */
    removeSingleIndex(i) {
        this.removeAddListener(i.key, i.addListener);
        this.removeRemoveListener(i.key, i.removeListener);
    }
    /**
     * 添加组件添加监听器
     */
    addAddListener(compClass, listener, parentCompClass) {
        const meta = getMeta(this, compClass);
        if (parentCompClass) {
            meta.addFilter = util_1.arrInsert(meta.addFilter, new ListenerCfg(listener, getMeta(this, parentCompClass)));
        }
        else
            meta.addAddListener(listener);
    }
    /**
     * 移除组件添加监听器
     */
    removeAddListener(compClass, listener, parentCompClass) {
        const meta = getMeta(this, compClass);
        if (parentCompClass) {
            meta.addFilter = util_1.arrDelete(meta.addFilter, getListenerIndex(meta.addFilter, listener));
        }
        else
            meta.removeAddListener(listener);
    }
    /**
     * 注册组件修改监听器
     */
    addModifyListener(compClass, listener, parentCompClass) {
        const meta = getMeta(this, compClass);
        if (parentCompClass) {
            const p = this.constructMap.get(parentCompClass);
            if (!p)
                throw new Error("unregister component, name:" + parentCompClass.name);
            meta.modifyFilter = util_1.arrInsert(meta.modifyFilter, new ListenerCfg(listener, getMeta(this, parentCompClass)));
        }
        else
            meta.modify = util_1.arrInsert(meta.modify, listener);
    }
    /**
     * 移除组件添加监听器
     */
    removeModifyListener(compClass, listener, parentCompClass) {
        const meta = getMeta(this, compClass);
        if (parentCompClass) {
            meta.modifyFilter = util_1.arrDelete(meta.modifyFilter, getListenerIndex(meta.modifyFilter, listener));
        }
        else
            meta.removeModifyListener(listener);
    }
    /**
     * 注册组件移除监听器
     */
    addRemoveListener(compClass, listener, parentCompClass) {
        const meta = getMeta(this, compClass);
        if (parentCompClass) {
            meta.removeFilter = util_1.arrInsert(meta.removeFilter, new ListenerCfg(listener, getMeta(this, parentCompClass)));
        }
        else
            meta.remove = util_1.arrInsert(meta.remove, listener);
    }
    /**
     * 移除组件添加监听器
     */
    removeRemoveListener(compClass, listener, parentCompClass) {
        const meta = getMeta(this, compClass);
        if (parentCompClass) {
            meta.removeFilter = util_1.arrDelete(meta.removeFilter, getListenerIndex(meta.removeFilter, listener));
        }
        else
            meta.removeRemoveListener(listener);
    }
    /**
     * 创建实体
     */
    create() {
        let e = new Entity;
        struct_mgr_1.addToMeta(this, e);
        return e;
    }
}
exports.World = World;
// ============================== 本地
// 监听器配置信息
class ListenerCfg {
    constructor(listener, p) {
        this.parentCompMeta = p;
        this.listener = Function;
    }
}
// 组件元信息
class CompMeta extends struct_mgr_1.MStructMeta {
    constructor() {
        super(...arguments);
        this.addFilter = []; // 插入监听器，需要过滤键和父组件
        this.modifyFilter = []; // 修改监听器，需要过滤键和父组件
        this.removeFilter = []; // 删除监听器，需要过滤键和父组件
    }
    addNotify(c) {
        super.addNotify(c);
        notify(this.addFilter, c);
    }
    removeNotify(c) {
        super.removeNotify(c);
        notify(this.removeFilter, c);
    }
    modifyNotify(c, fieldKey, value, old, fieldKeyIndex) {
        let arr = this.modify, arrFilter = this.modifyFilter;
        for (let l of arr)
            l(c, fieldKey, value, old, fieldKeyIndex);
        for (let l of arrFilter) {
            c.parent._$meta === l.parentCompMeta && l.listener(c, fieldKey, value, old, fieldKeyIndex);
        }
    }
}
/**
 * 获取组件元信息
 */
const getMeta = (w, compClass) => {
    const meta = w.constructMap.get(compClass);
    if (!meta)
        throw new Error("unregister component, name:" + compClass.name);
    return meta;
};
/**
 * 获取监听器的位置
 */
const getListenerIndex = (arr, listener) => {
    for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i].listener !== listener)
            return i;
    }
    return -1;
};
// 通知监听器
const notify = (arrFilter, c) => {
    for (let l of arrFilter) {
        (c.parent._$meta === l.parentCompMeta) && l.listener(c);
    }
};
});
