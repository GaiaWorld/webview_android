_$define("pi/widget/forelet", function (require, exports, module){
"use strict";
/*
负责进行业务逻辑处理，是数据库和显示组件间的桥梁， 输入->逻辑计算->输出
输入：
1、用户事件
2、数据库中数据被修改的事件
3、网络事件

输出：
1、操作数据库（同步）
2、网络通信（异步）
3、生成显示数据，调用paint，显示到界面上（可选同步或异步）

为了平滑显示，复杂的处理逻辑应该使用任务管理器进行调度处理
*/
Object.defineProperty(exports, "__esModule", { value: true });
const event_1 = require("../util/event");
const task_mgr_1 = require("../util/task_mgr");
// ============================== 导出
/**
 * @description 前端部件
 * @example
 */
class Forelet extends event_1.HandlerTable {
    constructor() {
        super(...arguments);
        // 必须要赋初值，不然new出来的实例里面是没有这些属性的
        this.widgets = []; // 关联的组件
        this.listener = null; // 监听器
        // tslint:disable:variable-name
        this._data = null; // 延迟渲染的数据
        this._dataState = DataState.init; // 延迟渲染的状态
        this._args = [this];
    }
    /**
     * @description 添加widget，自动在widget创建时调用
     * @example
     */
    addWidget(w) {
        this.listener && this.listener('add', w);
        w.setState(this._data);
        this.widgets.push(w);
    }
    /**
     * @description widget事件
     * @example
     */
    // tslint:disable:no-reserved-keywords
    eventWidget(w, type) {
        this.listener && this.listener(type, w);
    }
    /**
     * @description widget被移除，自动在widget销毁时调用
     * @example
     */
    removeWidget(w) {
        const arr = this.widgets;
        const i = arr.indexOf(w);
        if (i < 0) {
            return;
        }
        if (i < arr.length - 1) {
            arr[i] = arr[arr.length - 1];
        }
        arr.length--;
        this.listener && this.listener('remove', w);
    }
    /**
     * @description 获取指定名称的widget
     * @example
     */
    getWidget(name) {
        const arr = this.widgets;
        for (const w of arr) {
            if (w.name === name) {
                return w;
            }
        }
    }
    /**
     * @description 绘制方法，
     * @parms reset表示新旧数据差异很大，不做差异计算，直接生成dom
     * @parms immediately，表示同步计算dom，不延迟到系统空闲时
     * @example
     */
    paint(data, reset, immediately) {
        const s = this._dataState;
        // tslint:disable:no-constant-condition
        this._dataState = (reset || s === DataState.reset_true) ? DataState.reset_true : DataState.reset_false;
        this._data = data;
        if (immediately) {
            return paint1(this);
        }
        if (s === DataState.init) {
            if (this.widgets.length > 0) {
                task_mgr_1.set(paint1, this._args, 900000, 1);
            }
            else {
                this._dataState = DataState.init;
            }
        }
    }
}
exports.Forelet = Forelet;
// ============================== 本地
/**
 * @description 处理器返回值
 */
var DataState;
(function (DataState) {
    DataState[DataState["init"] = 0] = "init";
    DataState[DataState["reset_false"] = 1] = "reset_false";
    DataState[DataState["reset_true"] = 2] = "reset_true";
})(DataState || (DataState = {}));
/**
 * @description 绘制方法，
 * @example
 */
const paint1 = (f) => {
    const data = f._data;
    const r = f._dataState === DataState.reset_true;
    f._dataState = DataState.init;
    for (const w of f.widgets) {
        w.setState(data);
        w.paint(r);
    }
};
// ============================== 立即执行
});
