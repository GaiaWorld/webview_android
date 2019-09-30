_$define("pi/widget/painter", function (require, exports, module){
"use strict";
/**
 * vdom和组件的渲染器，提供全局的命令列表，将真实dom操作延迟到帧渲染时调用
 * 新建DOM节点及子节点时，不发送渲染命令，直接调用方法
 * 注意：如果父组件修改子组件属性，并且子组件也更改根节点的属性，则以最后修改的为准
 * 注意：如果父组件定义了子组件w-class样式，并且子组件也定义了根节点的w-class样式，则以子组件的优先
 */
Object.defineProperty(exports, "__esModule", { value: true });
// ============================== 导入
const mod_1 = require("../lang/mod");
const log_1 = require("../util/log");
const res_mgr_1 = require("../util/res_mgr");
const util_1 = require("../util/util");
const event = require("./event");
const frame_mgr_1 = require("./frame_mgr");
const style_1 = require("./style");
const virtual_node_1 = require("./virtual_node");
const widget_1 = require("./widget");
// ============================== 导出
exports.level = mod_1.commonjs.debug ? log_1.logLevel : log_1.LogLevel.info;
/**
 * @description 是否忽略hash相同，强制比较和替换
 * @example
 */
exports.forceReplace = false;
/**
 * @description 是否显示w-前缀的属性
 * @example
 */
exports.showWAttr = false;
/**
 * @description 创建节点后的处理函数，一般给扩展方调用
 * @example
 */
exports.createHandler = null;
/**
 * @description 是否显示w-前缀的属性
 * @example
 */
exports.setShowWAttr = (value) => {
    exports.showWAttr = value;
};
/**
 * @description 是否显示w-前缀的属性
 * @example
 */
exports.setCreateHandler = (func) => {
    exports.createHandler = func;
};
/**
 * @description 获得真实的dom节点
 * @example
 */
exports.getRealNode = (node) => {
    let n;
    while (node) {
        n = virtual_node_1.isVirtualWidgetNode(node);
        if (!n) {
            return node.link;
        }
        node = n.link.tree;
    }
};
/**
 * @description 替换节点，只替换了当前节点的link ext, 其他属性和子节点均没有替换
 * @example
 */
exports.replaceNode = (oldNode, newNode) => {
    newNode.link = oldNode.link;
    const n = virtual_node_1.isVirtualWidgetNode(newNode);
    if (n) {
        n.link.parentNode = n;
    }
    newNode.ext = oldNode.ext;
    event.rebindEventMap(oldNode, newNode);
};
/**
 * @description 添加节点的属性，并没有真正的添加，只是传了一个命令
 * @example
 */
exports.addAttr = (node, key, value) => {
    exports.setAttr(node, key, value);
};
/**
 * @description 修改节点的属性
 * @example
 */
exports.modifyAttr = (node, key, newValue, oldValue) => {
    exports.setAttr(node, key, newValue);
};
/**
 * @description 删除节点的属性
 * @example
 */
exports.delAttr = (node, key) => {
    exports.setAttr(node, key);
};
/**
 * @description 添加节点的属性，并没有真正的添加，只是传了一个命令
 * @example
 */
// tslint:disable-next-line:cyclomatic-complexity
exports.setAttr = (node, key, value, immediately) => {
    if (key === 'class') {
        cmdSet(exports.getRealNode(node), 'className', value, immediately);
        return;
    }
    if (key === 'style') {
        return setAttrStyle(node, key, value, immediately);
    }
    if (setAttrEventListener(node, key, value) && !exports.showWAttr) {
        return;
    }
    if (key.charCodeAt(0) === 119 && key.charCodeAt(1) === 45) {
        if (key === 'w-class') {
            setAttrClazz(node, key, value, immediately);
        }
        else if (key === 'w-plugin') {
            setAttrPlugin(node, value ? JSON.parse(value) : undefined);
        }
        else if (key === 'w-props') {
            if (virtual_node_1.isVirtualWidgetNode(node)) {
                node.ext.propsUpdate = (value === 'update');
            }
        }
        else if (key.charCodeAt(2) === 101 && key.charCodeAt(3) === 118 && key.charCodeAt(4) === 45) {
            // "w-ev-***"
            let attr = node.ext.eventAttr;
            if (!attr) {
                node.ext.eventAttr = attr = {};
            }
            attr[key.slice(5)] = value ? JSON.parse(value) : undefined;
        }
        if (!exports.showWAttr) {
            return;
        }
    }
    const el = exports.getRealNode(node);
    // 匹配img src
    if (key === 'src' && node.tagName === 'img') {
        if (value) {
            if (value.indexOf(':') < 0) {
                value = mod_1.butil.relativePath(value, node.widget.tpl.path);
                loadSrc(el, node.widget, value, immediately);
            }
            else {
                cmdSet(el, 'src', value, immediately);
            }
        }
        else {
            cmdSet(el, 'src', '', immediately);
        }
    }
    else if (key === 'value' && (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA')) {
        cmdSet(el, 'value', value, immediately);
    }
    else if (value) {
        cmdObjCall(el, 'setAttribute', key, value, immediately);
    }
    else {
        cmdObjCall(el, 'removeAttribute', key, '', immediately);
    }
};
/**
 * @description 创建组件
 * @example
 */
exports.createWidget = (node) => {
    // 处理相对tpl路径的组件
    let s = node.widget.tpl.wpath;
    if (!s) {
        node.widget.tpl.wpath = s = node.widget.tpl.path.replace(/\//g, '-');
    }
    const w = widget_1.factory(widget_1.relative(node.tagName, s));
    if (!w) {
        throw new Error(`widget not found, name: ${node.tagName}`);
    }
    node.link = w;
    node.widget.children.push(w);
    w.parentNode = node;
    if (node.hasChild || node.child) {
        if (virtual_node_1.getAttribute(node.attrs, 'w-props')) {
            w.updateProps(node.child);
        }
        else {
            w.setProps(node.child);
        }
    }
    w.paint();
    if (node.widget.inDomTree) {
        attachList.push(w);
    }
    if (node.attrSize) {
        node.ext = {};
    }
    const obj = node.attrs;
    for (const k in obj) {
        exports.setAttr(node, k, obj[k], true);
    }
    exports.createHandler && exports.createHandler(node);
};
/**
 * @description 创建真实节点
 * @example
 */
exports.createNode = (node) => {
    node.link = document.createElement(node.tagName);
    if (node.attrSize) {
        node.ext = {};
    }
    const obj = node.attrs;
    for (const k in obj) {
        exports.setAttr(node, k, obj[k], true);
    }
    exports.createHandler && exports.createHandler(node);
};
/**
 * @description 创建文本节点
 * @example
 */
exports.createTextNode = (node) => {
    node.link = document.createTextNode(node.text);
};
/**
 * @description 插入节点
 * @example
 */
exports.insertNode = (parent, node, offset) => {
    cmdList.push([insertBefore, [parent, exports.getRealNode(node), offset]]);
};
/**
 * @description 添加节点
 *
 * @example
 */
exports.addNode = (parent, node, immediately) => {
    if (immediately) {
        parent.appendChild(exports.getRealNode(node));
    }
    else {
        cmdList.push([parent, 'appendChild', [exports.getRealNode(node)]]);
    }
};
/**
 * @description 删除节点，不仅要删除节点还要删除其下widget
 * @example
 */
exports.delNode = (node) => {
    let r = node.link;
    if (virtual_node_1.isVirtualNode(node)) {
        delChilds(node);
    }
    else if (virtual_node_1.isVirtualWidgetNode(node)) {
        util_1.arrDrop(node.widget.children, r);
        const w = r;
        exports.delWidget(w);
        r = exports.getRealNode(w.tree);
    }
    cmdList.push([r, 'remove', []]);
};
/**
 * @description 修改组件节点的数据
 * @example
 */
exports.modifyWidget = (node, newValue, oldValue) => {
    const w = node.link;
    if (node.ext && node.ext.propsUpdate) {
        w.updateProps(newValue, oldValue);
    }
    else {
        w.setProps(newValue, oldValue);
    }
    w.paint();
};
/**
 * @description 修改文本节点的文本
 * @example
 */
exports.modifyText = (node, newValue, oldValue) => {
    cmdList.push([node.link, 'nodeValue', newValue]);
};
/**
 * @description 删除widget及其子widgets
 * @example
 */
exports.delWidget = (w) => {
    if (!w.destroy()) {
        return;
    }
    if (w.inDomTree) {
        detachList.push(w);
    }
    delWidgetChildren(w.children);
};
/**
 * @description 获得显示在真实的dom节点的组件名称
 * @example
 */
exports.getShowWidgetName = (node, name) => {
    const n = virtual_node_1.isVirtualWidgetNode(node);
    // tslint:disable:prefer-template
    return (n) ? exports.getShowWidgetName(n.link.tree, name + ' ' + n.link.name) : name;
};
/**
 * @description 渲染Widget方法，如果当前正在渲染，则缓冲，渲染完成后会继续渲染该数据
 * @example
 */
exports.paintWidget = (w, reset) => {
    const tpl = w.tpl;
    if (!tpl) {
        return;
    }
    const frameMgr = frame_mgr_1.getGlobal();
    if (cmdList.length === 0) {
        frameMgr.setBefore(paint1);
    }
    const tree = tpl.value(w.getConfig() || empty, w.getProps(), w.getState(), w);
    let old = w.tree;
    tree.widget = w;
    if (old) {
        if (reset) {
            try {
                w.beforeUpdate();
                const arr = w.children;
                for (const w of arr) {
                    exports.delWidget(w);
                }
                w.children = [];
                virtual_node_1.create(tree);
                const node = exports.getRealNode(tree);
                node.setAttribute('w-tag', exports.getShowWidgetName(tree, w.name));
                cmdList.push([replaceTree, [node, exports.getRealNode(old)]]);
                cmdList.push([w, 'afterUpdate', []]);
                w.tree = tree;
            }
            catch (e) {
                log_1.warn(exports.level, 'paint reset fail, ', w, e);
            }
        }
        else {
            const b = old.attrHash !== tree.attrHash || old.childHash !== tree.childHash || exports.forceReplace;
            if (b) {
                try {
                    w.beforeUpdate();
                    old = w.tree;
                    virtual_node_1.replace(old, tree);
                    cmdList.push([w, 'afterUpdate', []]);
                    w.tree = tree;
                }
                catch (e) {
                    log_1.warn(exports.level, 'paint replace fail, ', w, e);
                    if (old.offset < 0) {
                        fixOld(virtual_node_1.isVirtualNode(old));
                    }
                }
            }
        }
    }
    else {
        try {
            virtual_node_1.create(tree);
            exports.getRealNode(tree).setAttribute('w-tag', exports.getShowWidgetName(tree, w.name));
            w.tree = tree;
            w.firstPaint();
        }
        catch (e) {
            log_1.warn(exports.level, 'paint create fail, ', w, e);
        }
    }
};
/**
 * @description 渲染命令2方法
 * @example
 */
exports.paintCmd = (func, args) => {
    const frameMgr = frame_mgr_1.getGlobal();
    if (cmdList.length === 0) {
        frameMgr.setBefore(paint1);
    }
    cmdList.push([func, args]);
};
/**
 * @description 渲染命令3方法
 * @example
 */
exports.paintCmd3 = (obj, funcOrAttr, args) => {
    const frameMgr = frame_mgr_1.getGlobal();
    if (cmdList.length === 0) {
        frameMgr.setBefore(paint1);
    }
    cmdList.push([obj, funcOrAttr, args]);
};
/**
 * @description 绘制时，添加组件，调用组件及子组件的attach方法
 * @example
 */
exports.paintAttach = (w) => {
    attachList.push(w);
};
/**
 * @description 绘制时，删除组件，调用组件及子组件的detach方法
 * @example
 */
exports.paintDetach = (w) => {
    detachList.push(w);
};
// ============================== 本地
// 空配置
const empty = {}; // 每个painter的指令都被放入其中
let cmdList = [];
// 每个被添加的widget
let attachList = [];
// 每个被删除的widget
let detachList = [];
// 临时变量
let cmdList1 = [];
let attachList1 = [];
let detachList1 = [];
/**
 * @description 最终的渲染方法，渲染循环时调用，负责实际改变dom
 * @example
 */
const paint1 = () => {
    let arr = detachList;
    detachList = detachList1;
    detachList1 = arr;
    arr = cmdList;
    cmdList = cmdList1;
    cmdList1 = arr;
    arr = attachList;
    attachList = attachList1;
    attachList1 = arr;
    // 先调用所有要删除的widget的detach方法
    arr = detachList1;
    for (const w of arr) {
        paintDetach1(w);
    }
    arr.length = 0;
    arr = cmdList1;
    for (const cmd of arr) {
        if (cmd.length === 3) {
            const args = cmd[2];
            if (Array.isArray(args)) {
                util_1.objCall(cmd[0], cmd[1], args);
            }
            else {
                cmd[0][cmd[1]] = args;
            }
        }
        else if (cmd.length === 2) {
            util_1.call(cmd[0], cmd[1]);
        }
    }
    // arr.length > 3 && level <= LogLevel.debug && debug(level, "painter cmd: ", arr.concat([]));
    arr.length = 0;
    // 调用所有本次添加上的widget的attach方法
    arr = attachList1;
    for (const w of arr) {
        paintAttach1(w);
    }
    arr.length = 0;
};
/**
 * @description 删除子组件
 * @example
 */
const delWidgetChildren = (arr) => {
    for (const w of arr) {
        if (w.destroy()) {
            delWidgetChildren(w.children);
        }
    }
};
/**
 * @description 绘制时，添加组件，调用组件及子组件的attach方法
 * @example
 */
const paintAttach1 = (w) => {
    if (w.inDomTree) {
        return;
    }
    w.inDomTree = true;
    w.attach();
    for (const c of w.children) {
        paintAttach1(c);
    }
};
/**
 * @description 绘制时，删除组件，调用组件及子组件的detach方法
 * @example
 */
const paintDetach1 = (w) => {
    if (!w.inDomTree) {
        return;
    }
    w.inDomTree = false;
    for (const c of w.children) {
        paintDetach1(c);
    }
    w.detach();
};
/**
 * @description 设置节点的style
 * @example
 */
const setAttrStyle = (node, key, value, immediately) => {
    node.ext.innerStyle = value ? style_1.parseEffect(value, node.widget.tpl.path) : null;
    setDiffStyle(node, immediately);
};
/**
 * @description 设置节点的clazz
 * @example
 */
const setAttrClazz = (node, key, value, immediately) => {
    if (value) {
        const clazz = value.trim().split(/\s+/);
        if (clazz[0].length > 0) {
            node.ext.clazzStyle = style_1.calc(node.widget, clazz, clazz.join(' '), { map: new Map(), url: null });
        }
    }
    else {
        node.ext.clazzStyle = null;
    }
    setDiffStyle(node, immediately);
};
/**
 * @description 设置节点的插件
 * @example
 */
const setAttrPlugin = (node, cfg) => {
    let mod;
    const w = node.widget;
    const old = node.ext.plugin;
    node.ext.plugin = cfg;
    if (cfg) {
        mod = mod_1.commonjs.relativeGet(cfg.mod, w.tpl.path);
    }
    else if (old) {
        const mod = mod_1.commonjs.relativeGet(old.mod, w.tpl.path);
    }
    mod && mod.exports.pluginBind && mod.exports.pluginBind(w, node, cfg, old);
};
/**
 * @description 设置节点的style
 * @example
 */
const setDiffStyle = (node, immediately) => {
    const ext = node.ext;
    const style = style_1.merge(ext.innerStyle, ext.clazzStyle);
    const diff = style_1.difference(ext.style, style);
    ext.style = style;
    if (!diff) {
        return;
    }
    const el = getFilterStyleRealNode(node, diff);
    if (!el) {
        return;
    }
    loadURL(el, node.widget, diff);
    cmdCall(exports.setStyle, el, diff, immediately);
};
/**
 * @description 获得过滤样式后的真实的dom节点,如果过滤的样式不存在，则不向下获取dom节点
 * @example
 */
const getFilterStyleRealNode = (node, diff) => {
    let n;
    // tslint:disable-next-line:no-constant-condition
    while (true) {
        n = virtual_node_1.isVirtualWidgetNode(node);
        if (!n) {
            return node.link;
        }
        node = n.link.tree;
        if (!node) {
            return null;
        }
        if (!node.ext) {
            continue;
        }
        style_1.filter(node.ext.clazzStyle, diff);
        style_1.filter(node.ext.innerStyle, diff);
        if (diff.map.size === 0) {
            return null;
        }
    }
};
/**
 * @description 设置节点的事件，因为并不影响显示，所以立即处理，而不是延迟到渲染时。因为vnode已经被改变，如果延迟，也是会有事件不一致的问题
 * @example
 */
const setAttrEventListener = (node, key, value) => {
    // tslint:disable:no-reserved-keywords
    const type = event.getEventType(key);
    if (type === event.USER_EVENT_PRE) {
        event.addUserEventListener(node, key, type, value);
        return true;
    }
    if (type) {
        event.addNativeEventListener(node, exports.getRealNode(node), key, type, value);
        return true;
    }
    return false;
};
/**
 * @description 命令属性设置
 * @example
 */
const cmdSet = (obj, key, value, immediately) => {
    if (immediately) {
        obj[key] = value;
    }
    else {
        cmdList.push([obj, key, value]);
    }
};
/**
 * @description 命令方法调用
 * @example
 */
const cmdCall = (func, arg1, arg2, immediately) => {
    if (immediately) {
        func(arg1, arg2);
    }
    else {
        cmdList.push([func, [arg1, arg2]]);
    }
};
/**
 * @description 命令方法调用
 * @example
 */
const cmdObjCall = (obj, func, arg1, arg2, immediately) => {
    if (immediately) {
        obj[func](arg1, arg2);
    }
    else {
        cmdList.push([obj, func, [arg1, arg2]]);
    }
};
/**
 * @description 删除节点的子节点，不仅要删除节点还要删除其下widget
 * @example
 */
const delChilds = (node) => {
    const arr = node.children;
    for (const n of arr) {
        if (virtual_node_1.isVirtualNode(n)) {
            delChilds(n);
        }
        else if (virtual_node_1.isVirtualWidgetNode(n)) {
            exports.delWidget(n.link);
        }
    }
};
/**
 * @description 设置元素的样式，跳过指定样式
 * @example
 */
exports.setStyle = (el, style) => {
    const s = el.style;
    const map = style.map;
    for (const [k, v] of map) {
        s[k] = v;
    }
};
/**
 * @description 插入节点
 * @example
 */
const insertBefore = (parent, el, offset) => {
    parent.insertBefore(el, parent.childNodes[offset]);
};
/**
 * @description 删除树节点
 * @example
 */
const replaceTree = (newEl, oldEl) => {
    const parent = oldEl.parentNode;
    parent && parent.replaceChild(newEl, oldEl);
};
/**
 * @description 替换图像的src
 * @example
 */
const loadSrc = (el, widget, src, immediately) => {
    let tab = widget.resTab;
    if (!tab) {
        widget.resTab = tab = new res_mgr_1.ResTab();
    }
    const name = res_mgr_1.RES_TYPE_BLOB + ':' + src;
    const res = tab.get(name);
    if (res) {
        cmdSet(el, 'src', res.link, immediately);
    }
    else {
        tab.load(name, res_mgr_1.RES_TYPE_BLOB, src, undefined, (res) => {
            exports.paintCmd3(el, 'src', res.link);
        });
    }
};
/**
 * @description 替换含URL的样式或图像的src
 * @example
 */
const loadURL = (el, widget, style) => {
    let tab = widget.resTab;
    const url = style.url;
    if (!url) {
        return;
    }
    if (!tab) {
        widget.resTab = tab = new res_mgr_1.ResTab();
    }
    const arr = url.arr.concat();
    let count = (arr.length / 2) | 0;
    for (let i = arr.length - 2; i > 0; i -= 2) {
        const file = arr[i];
        const name = res_mgr_1.RES_TYPE_BLOB + ':' + file;
        const res = tab.get(name);
        if (res) {
            arr[i] = res.link;
            count--;
            if (count <= 0) {
                style.map.set(url.key, arr.join(''));
            }
        }
        else {
            tab.load(name, res_mgr_1.RES_TYPE_BLOB, file, undefined, urlLoad(arr, i, () => {
                count--;
                if (count <= 0) {
                    exports.paintCmd3(el.style, url.key, arr.join(''));
                }
            }));
        }
    }
};
/**
 * @description 替换含URL的样式或图像的src
 * @example
 */
const urlLoad = (arr, i, callback) => {
    return (res) => {
        arr[i] = res.link;
        callback();
    };
};
/**
 * @description 尽量修复旧节点，已经重绑定的事件和发出的渲染指令还是会生效
 * @example
 */
const fixOld = (old) => {
    if (!old) {
        return;
    }
    const arr = old.children;
    for (let n, i = 0, len = arr.length; i < len; i++) {
        n = arr[i];
        if (n.offset >= 0) {
            continue;
        }
        n.offset = i;
        fixOld(virtual_node_1.isVirtualNode(n));
    }
};
});
