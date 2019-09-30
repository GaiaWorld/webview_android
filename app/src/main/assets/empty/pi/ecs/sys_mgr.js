_$define("pi/ecs/sys_mgr", function (require, exports, module){
"use strict";
/*
 * ecs的系统及系统管理器。
 * 系统监听组件的事件， 并负责对实体和组件进行操作。
 * 管理器负责维护系统运行管线(有项无环图)，包括系统的并发执行。现在的实现是顺序执行，换成其他有多线程的语言，可以并发执行。
 * 一个管理器内的系统模块不可重复。
 * cfg: {
 * 	"graph" : ["pi/ecs/system/init", ["async"], "pi/ecs/system/sync"],
 * 	"args" : {
 * 		"pi/ecs/system/init" : {
 * 			"viewGrid" : 20,
 * 			"blockGrid" : 1,
 * 			"width" : 10000,
 * 			"height" : 10000,
 * 			"depth" : 10000,
 * 			"seed" : 10000,
 * 			"runInterval": 50
 * 		},
 * 		pi/ecs/system/sync" : {
 * 		}
 * 	}
 * }
 */
Object.defineProperty(exports, "__esModule", { value: true });
// ============================== 导入
const mod_1 = require("../lang/mod");
const util_1 = require("../util/util");
// ============================== 导出
// 系统
class System {
    /**
     * 初始化
     */
    /* tslint:disable:no-empty */
    init(w, cfg) { }
    /**
     * 运行
     */
    run(context) { }
    /**
     * 销毁
     */
    destroy() { }
}
exports.System = System;
/**
 * 系统管理器
 * @example
 */
class SysMgr {
    /**
     * 初始化
     */
    constructor(w) {
        // 系统表
        /* tslint:disable:typedef */
        this.map = new Map();
        this.world = w;
    }
    /**
     * 根据配置初始化，可以多次调用
     */
    init(cfg) {
        const g = new SystemGraph();
        const m = new Map();
        g.init(this.world, { graph: cfg.graph, args: cfg.args, map: m, mgr: this });
        this.map = m;
        this.graph.destroy();
        this.graph = g;
    }
    /**
     * 运行
     */
    run(context) {
        this.graph && this.graph.run(context);
    }
}
exports.SysMgr = SysMgr;
// ============================== 本地
// 可并发的系统图节点
class SystemGraph extends System {
    constructor() {
        super(...arguments);
        // 并发
        this.async = false;
        // 包含的系统
        this.arr = [];
    }
    /**
     * 初始化
     */
    init(w, cfg) {
        this.mgr = cfg.mgr;
        let arr = cfg.graph;
        // 判断是否并发执行
        if (arr[0] === 'async') {
            this.async = true;
            arr = arr.slice(1);
        }
        for (const s of arr) {
            if (Array.isArray(s)) {
                // 生成系统图节点，并放入数组
                const r = new SystemGraph();
                r.init(w, { graph: s, args: cfg.args, map: cfg.map, mgr: this.mgr });
                this.arr.push(['', r]);
                continue;
            }
            let r = this.mgr.map.get(s);
            if (!r) {
                const mod = mod_1.commonjs.relativeGet(s);
                if (!mod) {
                    throw new Error(`invalid mod: ${s}`);
                }
                const sys = util_1.getExport(mod, util_1.checkType, System);
                if (!sys) {
                    throw new Error(`invalid system in: ${s}`);
                }
                r = sys();
                r.init(w, cfg.args[s]);
                // 放入到管理器的新系统表
                cfg.map.set(s, r);
                this.arr.push([s, r]);
            }
        }
    }
    /**
     * 运行
     */
    run(context) {
        for (const [k, s] of this.arr) {
            s.run(context);
        }
    }
    /**
     * 销毁
     */
    destroy() {
        for (const [k, s] of this.arr) {
            // 如果不在管理器的系统表，则移除
            if (!this.mgr.map.has(k)) {
                s.destroy();
            }
        }
    }
}
});
