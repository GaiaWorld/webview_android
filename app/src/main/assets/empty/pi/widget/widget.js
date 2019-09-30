_$define("pi/widget/widget", function (require, exports, module){
"use strict";
// 模块描述
/*
负责显示逻辑，是数据和原始dom间的桥梁
组件支持嵌套，并且tpl中的自定义元素支持相对路径。
组件名的规则：可以使用英文小写字母加'_'和''。 '-'表示路径分隔，'$'只能在最后，1个'$'表示本目录开始查找，N个'$'表示上溯N-1个父目录开始查找。如果没有'$'表示从根目录下开始查找
举例：
<role_show$ style=""></role_show$>表示本目录下的role_show组件，
<role_show$$ style=""> </role_show$$>表示父目录下的role_show组件，
<role_show-zb_show$$ style=""></role_show-zb_show$$>表示父目录下role_show目录下的zb_show组件
<app-base-btn style=""></app-base-btn>表示根目录开始，app/base目录下的btn组件
*/
Object.defineProperty(exports, "__esModule", { value: true });
const event_1 = require("../util/event");
const log_1 = require("../util/log");
const util_1 = require("../util/util");
const painter_1 = require("./painter");
// ============================== 导出
exports.level = log_1.logLevel;
/**
 * @description 组件
 * @example
 * 组件，包含样式和模板的js类,
 * 注意区分 widget实例和widget节点
 * widget节点的link属性指向了widget实例
 */
class Widget extends event_1.HandlerTable {
    constructor() {
        super(...arguments);
        // 必须要赋初值，不然new出来的实例里面是没有这些属性的
        this.name = null; // 组件的名称
        this.tpl = null; // 组件的模板
        this.sheet = null; // 组件的样式
        this.config = null; // 所对应的配置
        this.forelet = null; // 所对应的forelet
        this.props = null; // 由父组件设置的组件属性
        this.state = null; // 由forelet设置的组件状态
        this.tree = null; // 组件所对应的节点树
        this.parentNode = null; // 父节点，parentNode.link的对象就是widget
        this.children = []; // 所有的子组件
        this.inDomTree = false; // 是否在dom树中
        this.resTab = null; // 资源表
        this.resTimeout = 3000; // 资源缓冲时间，默认3秒
        this.styleCache = new Map(); // 样式查询缓存
    }
    /**
     * 创建后调用，一般在渲染循环外调用
     */
    create() {
        this.forelet && this.forelet.addWidget(this);
    }
    /**
     * 第一次计算后调用，此时创建了真实的dom，但并没有加入到dom树上，一般在渲染循环外调用
     */
    firstPaint() {
        this.forelet && this.forelet.eventWidget(this, 'firstPaint');
    }
    /**
     * 销毁时调用，一般在渲染循环外调用
     */
    destroy() {
        if (!this.tpl) {
            return false;
        }
        this.tpl = undefined;
        if (this.resTab) {
            this.resTab.timeout = this.resTimeout;
            this.resTab.release();
        }
        this.forelet && this.forelet.removeWidget(this);
        return true;
    }
    /**
     * 添加到dom树后调用，在渲染循环内调用
     */
    // tslint:disable:no-empty
    attach() {
    }
    /**
     * 更新到dom树前调用，一般在渲染循环外调用
     */
    beforeUpdate() {
        this.forelet && this.forelet.eventWidget(this, 'update');
    }
    /**
     * 更新到dom树后调用，在渲染循环内调用
     */
    afterUpdate() {
    }
    /**
     * 从dom树上移除前调用，一般在渲染循环内调用
     */
    detach() {
    }
    /**
     * 获得样式数据
     */
    getSheet() {
        return this.sheet && this.sheet.value;
    }
    /**
     * 获得配置数据
     */
    getConfig() {
        return this.config && this.config.value;
    }
    /**
     * 获得渲染数据
     */
    getProps() {
        return this.props;
    }
    /**
     * 设置属性，默认外部传入的props是完整的props，重载可改变行为
     * @param props 新数据
     * @param oldProps 老数据
     */
    setProps(props, oldProps) {
        this.props = props;
    }
    /**
     * 更新属性，默认外部传入的props是更新命令，必须为Json对象，键的结构类似"a.b.c"，重载可改变行为
     */
    updateProps(props, oldProps) {
        if (!props) {
            return;
        }
        for (const k in props) {
            util_1.setValue(this.props, k, props[k]);
        }
    }
    /**
     * 获得渲染数据
     */
    getState() {
        return this.state;
    }
    /**
     * 设置状态
     */
    setState(state) {
        this.state = state;
    }
    /**
     * 绘制方法，
     * @param reset 表示新旧数据差异很大，不做差异计算，直接生成dom
     */
    paint(reset) {
        painter_1.paintWidget(this, reset);
    }
}
exports.Widget = Widget;
/**
 * @description 注册组件
 * @example
 */
exports.register = (name, widget, tpl, sheet, config, forelet) => {
    const old = widgetMap.get(name);
    if (old) {
        log_1.warn(exports.level, 'widget already register, name:', name);
    }
    widget = widget || getWidget;
    widgetMap.set(name, { name, widget, tpl, sheet, config, forelet });
    return old;
};
/**
 * @description 查询组件
 * @example
 */
exports.lookup = (name) => {
    return widgetMap.get(name);
};
/**
 * @description 列出所有的组件
 * @example
 */
exports.list = () => {
    return [...widgetMap.values()];
};
/**
 * @description 取消注册组件
 * @example
 */
exports.unregister = (name) => {
    return widgetMap.delete(name);
};
/**
 * @description 创建组件
 * @example
 */
exports.factory = (name) => {
    const creator = widgetMap.get(name);
    if (!creator) {
        return;
    }
    const c = creator.widget();
    const w = new c();
    w.name = name;
    if (creator.sheet) {
        w.sheet = creator.sheet;
    }
    if (creator.tpl) {
        w.tpl = creator.tpl;
    }
    if (creator.config) {
        w.config = creator.config;
    }
    if (creator.forelet) {
        w.forelet = creator.forelet();
    }
    w.create();
    return w;
};
/**
 * @description 计算相对组件路径
 * @example
 */
exports.relative = (name, dir) => {
    let j;
    let i = name.length - 1;
    if (name.charCodeAt(i) !== 36) {
        return name;
    }
    j = dir.length - 1;
    if (dir.charCodeAt(j) !== 47) {
        j = dir.lastIndexOf('-');
    }
    while (i >= 0) {
        if (name.charCodeAt(i - 1) !== 36) {
            break;
        }
        i--;
        j = dir.lastIndexOf('-', j - 1);
    }
    if (i < 0) {
        return '';
    }
    name = name.slice(0, i);
    if (j < 0) {
        return name;
    }
    if (j < dir.length - 1) {
        dir = dir.slice(0, j + 1);
    }
    return dir + name;
};
/**
 * @description 获取tpl、css和cfg缓冲
 * @example
 */
exports.getCache = (file) => {
    return cacheMap.get(file);
};
/**
 * @description 设置tpl、css和cfg缓冲
 * @example
 */
exports.setCache = (file, data) => {
    cacheMap.set(file, data);
};
/**
 * @description 清除tpl、css和cfg缓冲
 * @example
 */
exports.deleteCache = (file) => {
    cacheMap.delete(file);
};
// ============================== 本地
// 组件模板表
const widgetMap = new Map();
// tpl、css和cfg缓冲
const cacheMap = new Map();
// 获得默认组件
const getWidget = () => Widget;
// ============================== 立即执行
});
