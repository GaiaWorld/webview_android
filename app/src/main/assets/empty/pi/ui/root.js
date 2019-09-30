_$define("pi/ui/root", function (require, exports, module){
"use strict";
/*
 * 根组件
 * 负责监控页面大小变化，约束根元素在标准比例附近变化
 * 负责提供组，组的定义在div元素的属性上
 * 负责将指定的组件放入到对应的组上，并计算该组件的进场动画的时间，进程动画完毕后，还负责根据是否透明的配置，将该组下的组件及组设置成隐藏，组件销毁时，要把被隐藏的组件显示出来。动画期间禁止操作
 */
Object.defineProperty(exports, "__esModule", { value: true });
// ============================== 导入
const mod_1 = require("../lang/mod");
const time_1 = require("../lang/time");
const event_1 = require("../util/event");
const html_1 = require("../util/html");
const log_1 = require("../util/log");
const task_mgr_1 = require("../util/task_mgr");
const util_1 = require("../util/util");
const forelet_1 = require("../widget/forelet");
const frame_mgr_1 = require("../widget/frame_mgr");
const painter_1 = require("../widget/painter");
const virtual_node_1 = require("../widget/virtual_node");
const widget_1 = require("../widget/widget");
// ============================== 导出
exports.logLevel = mod_1.commonjs.debug ? log_1.LogLevel.info : log_1.LogLevel.none;
// 是否记录页面路由信息
exports.routerRecord = true;
/**
 * @description 导出给组件用的forelet
 * @example
 */
exports.forelet = new forelet_1.Forelet();
/**
 * @description 导出的监听器列表
 * @example
 */
exports.listenerList = event_1.createHandlerList();
/**
 * @description 根元素的显示兼容配置,
 * 1x2(500x1000 600x1200) 2, 25x48(500x960 750x1440) 1.92, 8x15(480x900 560x1050 640x1200) 1.875, 5x9(500x900 600x1080) 1.8, 9x16(450x800 540x960) 1.77.., 3x5(480x800 540x900) 1.66.., 5x8(500x800) 1.6
 * @example
 */
exports.cfg = {
    width: 750, height: 1334, wscale: 0, hscale: 0.25, full: false
};
/**
 * @description 获得根元素
 * @example
 */
exports.getRoot = () => {
    return root;
};
/**
 * @description 获得根元素的缩放比例
 * @example
 */
exports.getScale = () => {
    return rootScale;
};
/**
 * @description 获得根元素的宽度
 * @example
 */
exports.getWidth = () => {
    return rootWidth;
};
/**
 * @description 获得根元素的高度
 * @example
 */
exports.getHeight = () => {
    return rootHeight;
};
/**
 * 获取键盘高度
 */
exports.getKeyBoardHeight = () => {
    return keyBoardHeight;
};
/**
 * @description 指定范围(左上角x1y1, 右下角x2y2)外，禁止鼠标和触控事件，直到超时时间
 * @example
 */
exports.forbidEvent = (timeout, rect) => {
    forbidEventTime = timeout ? time_1.now() + timeout : 0;
    if (rect) {
        allowEventRect[0] = rect[0];
        allowEventRect[1] = rect[1];
        allowEventRect[2] = rect[2];
        allowEventRect[3] = rect[3];
    }
    else {
        allowEventRect[0] = allowEventRect[1] = allowEventRect[2] = allowEventRect[3] = 0;
    }
};
/**
 * @description 获得是否禁止返回
 * @example
 */
exports.isForbidBack = () => {
    return forbidBack;
};
/**
 * @description 设置是否禁止返回
 * @example
 */
exports.setForbidBack = (b) => {
    forbidBack = b;
};
/**
 * @description 获得是否禁止默认滚动
 * @example
 */
exports.isPreventScroll = () => {
    return preventScroll;
};
/**
 * @description 设置是否禁止默认滚动
 * @example
 */
exports.setPreventScroll = (b) => {
    preventScroll = b;
};
/**
 * @description 弹出界面，返回关闭对象
 * @param back 为返回按钮的处理，Callback表示处理函数-必须调用w.cancel方法， cancel表示调用cancel函数，force表示强制不返回，next表示调用cancel函数继续调用返回，默认处理为cancel
 * @example
 */
exports.pop = (w, ok, cancel, process, back, originProps) => {
    const b = { widget: w, callback: null };
    const close = { widget: w, callback: backClose };
    if (back === undefined || back === 'cancel') {
        b.callback = () => {
            close.callback(close.widget);
            cancel && cancel('back');
        };
    }
    else if (back === 'next') {
        b.callback = () => {
            close.callback(close.widget);
            cancel && cancel('back');
            exports.backCall();
        };
    }
    else if (back !== 'force') {
        b.callback = back;
    }
    exports.backList.push(b);
    let r;
    let propsSensitive = false;
    for (let i = 0; i < exports.routerList.length; i++) {
        const props = exports.routerList[i].props;
        if (props && props.pi_norouter) {
            propsSensitive = true;
            break;
        }
    }
    if ((w && w.props && w.props.pi_norouter) || propsSensitive) {
        r = { name: b.widget.name, props: { pi_norouter: true } };
    }
    else {
        r = { name: b.widget.name, props: originProps };
    }
    exports.routerList.push(r);
    routerListSerialize();
    // 设置回调
    w.ok = w.$ok = (arg) => {
        close.callback(close.widget);
        ok && ok(arg);
    };
    w.cancel = w.$cancel = (arg) => {
        close.callback(close.widget);
        cancel && cancel(arg);
    };
    w.process = w.$process = process;
    exports.add(w);
    return close;
};
/**
 * @description 弹出新界面，返回关闭对象
 * @param back 为返回按钮的处理，Callback表示处理函数-必须调用w.cancel方法， cancel表示调用cancel函数，force表示强制不返回，next表示调用cancel函数继续调用返回，默认处理为cancel
 * @example
 */
exports.popNew = (name, props, ok, cancel, process, back) => {
    const w = exports.create(name, props);
    const close = exports.pop(w, ok, cancel, process, back, props);
    const c = close.callback;
    close.callback = (w) => {
        // popNew创建的，关闭需要销毁
        backClose(w);
        exports.destory(w);
    };
    return close;
};
/**
 * 压入弹窗队列
 * @param name 组件名称
 * @param props 需要传给组件的参数
 * @param onlyFg 是否只能弹出一次，第二次会拒绝压入队列中
 */
const boxList = []; // 弹窗名字列表
let nowPopingBox = null; // 当前正在弹出的组件
exports.popModalBoxs = (name, props, ok, cancel, onlyFg) => {
    console.log(name, props, ok, cancel, onlyFg);
    if (onlyFg) {
        // 名字和参数都匹配才算是同一个弹窗
        const index = boxList.findIndex(item => item.name === name && JSON.stringify(item.props) === JSON.stringify(props));
        const isSuit = nowPopingBox && nowPopingBox.name === name && JSON.stringify(nowPopingBox.props) === JSON.stringify(props);
        if (index === -1 && !isSuit) { // 队列中没有此弹窗且当前弹窗不是
            boxList.push({
                name,
                props,
                ok,
                cancel
            });
        }
    }
    else {
        boxList.push({
            name,
            props,
            ok,
            cancel
        });
    }
    popUps(); // 弹出窗口
};
/**
 * 从前依次弹出窗口
 */
const popUps = () => {
    if (!nowPopingBox) { // 当前没有弹窗，从前依次弹出
        const box = boxList.shift();
        if (box) {
            nowPopingBox = box;
            exports.popNew(box.name, box.props, (r) => {
                nowPopingBox = null;
                popUps();
                box.ok && box.ok(r);
            }, (r) => {
                nowPopingBox = null;
                popUps();
                box.cancel && box.cancel(r);
            });
        }
    }
};
/**
 * @description 将2个close关联起来，1个界面被关闭时，关闭另外1个界面，一般要求界面1先打开
 * @example
 */
exports.linkClose = (close1, close2) => {
    const c1 = close1.callback;
    const c2 = close2.callback;
    close1.callback = (w) => {
        c2(close2.widget);
        c1(w);
    };
    close2.callback = (w) => {
        c2(w);
        c1(close1.widget);
    };
};
/**
 * @description 用任务队列的方式弹出界面2，并与界面1关联起来，如果界面1已经关闭，则自动销毁界面2
 * @example
 */
exports.popLink = (close1, name, props, ok, cancel, process, back) => {
    frame_mgr_1.getGlobal().setAfter(() => {
        task_mgr_1.set(() => {
            if (!close1.widget.parentNode) {
                return;
            }
            const w = exports.create(name, props);
            if (!close1.widget.parentNode) {
                exports.destory(w);
                return;
            }
            const close2 = exports.pop(w, ok, cancel, process, back);
            close2.callback = (w) => {
                backClose(w);
                exports.destory(w);
            };
            exports.linkClose(close1, close2);
        }, undefined, 1000, 1);
    });
};
/**
 * @description 创建指定名称的组件
 * @example
 */
exports.create = (name, props) => {
    const w = widget_1.factory(name);
    if (!w) {
        return;
    }
    if (props !== undefined) {
        w.setProps(props);
    }
    w.paint();
    return w;
};
/**
 * @description 创建指定名称的组件，根据组件上的配置，将组件加入到指定的组上，会延迟到帧调用时添加
 * @example
 */
exports.open = (name, props) => {
    const w = widget_1.factory(name);
    if (!w) {
        return;
    }
    if (props !== undefined) {
        w.setProps(props);
    }
    w.paint();
    exports.add(w);
    return w;
};
/**
 * @description 将指定的组件，根据组件上的配置，将组件加入到指定的组上，会延迟到帧调用时添加
 * @example
 */
exports.add = (w, props) => {
    const cfg = w.getConfig();
    const name = cfg && cfg.group;
    const group = groupMap.get(name || 'main');
    if (!group) {
        return;
    }
    if (w.parentNode) {
        return;
    }
    group.arr.push(w);
    if (props !== undefined) {
        w.setProps(props);
        w.paint();
    }
    // tslint:disable-next-line:no-object-literal-type-assertion
    const node = {
        attrs: {}, attrSize: 0, attrHash: 0, link: w, widget: rootWidget, childHash: 0xffffffff, child: null
    };
    w.parentNode = node;
    // TODO 计算进场动画时间和是否透明
    painter_1.paintCmd3(group.el, 'appendChild', [painter_1.getRealNode(w.tree)]);
    painter_1.paintAttach(w);
    if (group.arr.length === 1) {
        painter_1.paintCmd3(root, 'appendChild', [group.el]);
    }
    exports.listenerList({ type: 'add', widget: w, group: group });
};
/**
 * @description 将指定的组件移除，会延迟到帧调用时移除
 * @example
 */
exports.remove = (w) => {
    if (!w.parentNode) {
        return;
    }
    w.parentNode = null;
    painter_1.paintCmd3(painter_1.getRealNode(w.tree), 'remove', []);
    painter_1.paintDetach(w);
    const cfg = w.getConfig();
    const name = cfg && cfg.group;
    const group = groupMap.get(name || 'main');
    if (!group) {
        return;
    }
    const i = group.arr.indexOf(w);
    if (i < 0) {
        return;
    }
    group.arr.splice(i, 1);
    // TODO 计算离场动画时间和是否透明
    if (group.arr.length === 0) {
        painter_1.paintCmd3(group.el, 'remove', []);
    }
    exports.listenerList({ type: 'remove', widget: w, group: group });
};
/**
 * @description 显示或隐藏组
 * @example
 */
exports.show = (groupName, b) => {
    const group = groupMap.get(groupName || 'main');
    if (!group) {
        return;
    }
    painter_1.paintCmd3(group.el.style, 'visibility', b ? 'visible' : 'hidden');
};
/**
 * @description 将指定的组件移除并销毁
 * @example
 */
exports.destory = (w) => {
    exports.remove(w);
    painter_1.delWidget(w);
};
/**
 * @description 日志显示，仅处理在手机上，commonjs.debug打开，log级别为info,warn的日志
 * @example
 */
exports.log = (level, msg, args1, args2, args3, args4, args5, args6, args7, args8, args9) => {
    if (level < exports.logLevel || !logContainer) {
        return;
    }
    let s;
    if (args9 !== undefined) {
        // tslint:disable:max-line-length prefer-template
        s = util_1.toString(msg) + ', ' + util_1.toString(args1) + ', ' + util_1.toString(args2) + ', ' + util_1.toString(args3) + ', ' + util_1.toString(args4) + ', ' + util_1.toString(args5) + ', ' + util_1.toString(args6) + ', ' + util_1.toString(args7) + ', ' + util_1.toString(args8) + ', ' + util_1.toString(args9) + '\n';
    }
    else if (args8 !== undefined) {
        s = util_1.toString(msg) + ', ' + util_1.toString(args1) + ', ' + util_1.toString(args2) + ', ' + util_1.toString(args3) + ', ' + util_1.toString(args4) + ', ' + util_1.toString(args5) + ', ' + util_1.toString(args6) + ', ' + util_1.toString(args7) + ', ' + util_1.toString(args8) + '\n';
    }
    else if (args7 !== undefined) {
        s = util_1.toString(msg) + ', ' + util_1.toString(args1) + ', ' + util_1.toString(args2) + ', ' + util_1.toString(args3) + ', ' + util_1.toString(args4) + ', ' + util_1.toString(args5) + ', ' + util_1.toString(args6) + ', ' + util_1.toString(args7) + '\n';
    }
    else if (args6 !== undefined) {
        s = util_1.toString(msg) + ', ' + util_1.toString(args1) + ', ' + util_1.toString(args2) + ', ' + util_1.toString(args3) + ', ' + util_1.toString(args4) + ', ' + util_1.toString(args5) + ', ' + util_1.toString(args6) + '\n';
    }
    else if (args5 !== undefined) {
        s = util_1.toString(msg) + ', ' + util_1.toString(args1) + ', ' + util_1.toString(args2) + ', ' + util_1.toString(args3) + ', ' + util_1.toString(args4) + ', ' + util_1.toString(args5) + '\n';
    }
    else if (args4 !== undefined) {
        s = util_1.toString(msg) + ', ' + util_1.toString(args1) + ', ' + util_1.toString(args2) + ', ' + util_1.toString(args3) + ', ' + util_1.toString(args4) + '\n';
    }
    else if (args3 !== undefined) {
        s = util_1.toString(msg) + ', ' + util_1.toString(args1) + ', ' + util_1.toString(args2) + ', ' + util_1.toString(args3) + '\n';
    }
    else if (args2 !== undefined) {
        s = util_1.toString(msg) + ', ' + util_1.toString(args1) + ', ' + util_1.toString(args2) + '\n';
    }
    else if (args1 !== undefined) {
        s = util_1.toString(msg) + ', ' + util_1.toString(args1) + '\n';
    }
    else {
        s = util_1.toString(msg) + '\n';
    }
    logClearTime = time_1.now() + LogClearTimeout;
    const t = document.createTextNode(s);
    logs.unshift(t);
    painter_1.paintCmd3(logContainer, 'appendChild', [t]);
    if (logs.length === 1) {
        painter_1.paintCmd3(root, 'appendChild', [logContainer]);
        setTimeout(clearLog, LogClearInterval);
    }
};
/**
 * @description 获取指定属性的父元素，如果遇到root根节点则返回undefined
 * @example
 */
exports.getParentByAttr = (el, key, value) => {
    while (el !== null && el !== root && el !== document.body) {
        const v = el.getAttribute(key);
        if (v !== null) {
            if ((!value) || v === value) {
                return el;
            }
        }
        el = el.parentNode;
    }
};
/**
 * @description 返回最后一个弹出界面
 * @example
 */
exports.lastBack = () => {
    const h = exports.backList[exports.backList.length - 1];
    return h ? h.widget : null;
};
/**
 * @description 返回调用，返回弹出界面的数量
 * @example
 */
exports.backCall = () => {
    const h = exports.backList[exports.backList.length - 1];
    h.callback && h.callback(h.widget);
    exports.routerList.pop();
    routerListSerialize();
    return exports.backList.length;
};
/**
 * @description 尽量关闭所有的返回对象，返回最后留下的弹出界面的数量
 * @example
 */
exports.closeBack = () => {
    let len = exports.backList.length;
    let i = exports.backCall();
    while (i && i < len) {
        len = i;
        i = exports.backCall();
        exports.routerList.pop();
    }
    routerListSerialize();
    return i;
};
// 日志清除掉超时时间，20秒，也就是说20秒内，如果有日志写入，则不清除日志
const LogClearTimeout = 20000;
// 日志清除的间隔时间，2秒
const LogClearInterval = 2000;
// 日志最多100条
const LogLimit = 100;
// 根元素
let root = null;
// 根组件
let rootWidget = null;
// 组对象表
const groupMap = new Map();
// 返回记录
exports.backList = [];
// 路由记录
exports.routerList = [];
// 禁止返回
let forbidBack = false;
// 禁止默认滚动
let preventScroll = false;
// 日志
const logs = [];
// 日志的清理时间
let logClearTime = 0;
// 日志的dom容器
let logContainer = null;
// 根元素的缩放比例
let rootScale = 1;
// 根元素的xy坐标
let rootX = 0;
let rootY = 0;
// 根元素的宽度和高度
let rootWidth = 0;
let rootHeight = 0;
// 旧的高度
let oldHeight = 0;
// 手机模式弹出键盘的高度
let keyBoardHeight = 0;
// 禁止触控时间
let forbidEventTime = 0;
// 允许的矩形区域外，禁止触控
const allowEventRect = [0, 0, 0, 0];
// 序列化routerList
const routerListSerialize = () => {
    if (exports.routerRecord) {
        localStorage.setItem('pi_router_list', JSON.stringify(exports.routerList));
    }
};
/**
 * @description 返回关闭
 * @example
 */
const backClose = (w) => {
    exports.remove(w);
    w.ok = w.$ok = null;
    w.cancel = w.$cancel = null;
    w.process = w.$process = null;
    exports.backList.pop();
    exports.routerList.pop();
    routerListSerialize();
};
/**
 * @description 检查坐标是否在允许区域内
 * @example
 */
const checkAllowRect = (x, y, rect) => {
    return (x > rect[0] && x < rect[2] && y > rect[1] && y < rect[3]);
};
/**
 * @description 负责监控页面大小变化，约束根元素在标准比例附近变化
 * @example
 */
const browserAdaptive = () => {
    if (!root) {
        return;
    }
    const clientWidth = document.documentElement.clientWidth;
    const clientHeight = document.documentElement.clientHeight;
    const ae = document.activeElement;
    // 表示因为是输入，手机上弹出输入面板后的页面变小
    if ((ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA') && oldHeight > clientHeight) {
        const rect = ae.getBoundingClientRect();
        if (rect.bottom > clientHeight) {
            if (!ae.getAttribute('unchange')) {
                rootY -= rect.bottom - clientHeight;
                painter_1.paintCmd3(root.style, 'top', rootY + 'px');
            }
            keyBoardHeight = (rect.bottom - clientHeight) / rootScale; // 键盘高度
            oldHeight = clientHeight;
        }
        if (!ae.getAttribute('unchange')) {
            return;
        }
    }
    if (exports.cfg.full) {
        rootWidth = clientWidth;
        rootHeight = clientHeight;
        return painter_1.paintCmd3(root.style, 'cssText', 'position:absolute;overflow:hidden;width:100%;height:100%;');
    }
    oldHeight = clientHeight;
    rootWidth = exports.cfg.width;
    rootHeight = exports.cfg.height;
    let scaleW = clientWidth / rootWidth;
    let scaleH = clientHeight / rootHeight;
    if (exports.cfg.wscale >= exports.cfg.hscale) {
        // 宽度比例变动
        if (scaleW > scaleH * (exports.cfg.wscale + 1)) {
            // 大于规定的比例
            rootWidth = rootWidth * (exports.cfg.wscale + 1) | 0;
        }
        else {
            rootWidth = (clientWidth / scaleH) | 0;
        }
        rootScale = scaleW = scaleH;
    }
    else {
        // 高度比例变动
        if (scaleH > scaleW * (exports.cfg.hscale + 1)) {
            rootHeight = rootHeight * (exports.cfg.hscale + 1) | 0;
        }
        else {
            rootHeight = (clientHeight / scaleW) | 0;
        }
        rootScale = scaleH = scaleW;
    }
    rootX = (clientWidth - rootWidth) / 2;
    rootY = (clientHeight - rootHeight) / 2;
    painter_1.paintCmd3(root.style, 'cssText', 'position: absolute;overflow: hidden;left: ' + rootX + 'px;top: ' + rootY + 'px;width:' + rootWidth + 'px;height: ' + rootHeight + 'px;-webkit-transform:scale(' + scaleW + ',' + scaleH + ');-moz-transform:scale(' + scaleW + ',' + scaleH + ');-ms-transform:scale(' + scaleW + ',' + scaleH + ');transform:scale(' + scaleW + ',' + scaleH + ');');
    exports.listenerList({ type: 'resize', root: root, scale: rootScale, x: rootX, y: rootY, width: rootWidth, height: rootHeight });
};
/**
 * @description 日志清除
 * @example
 */
const clearLog = () => {
    // 清除超过100条的日志
    let i = logs.length - 1;
    if (i >= LogLimit) {
        for (; i >= LogLimit; i--) {
            painter_1.paintCmd3(logs[i], 'remove', []);
        }
        logs.length = i + 1;
    }
    else {
        const t = time_1.now();
        if (t > logClearTime) {
            painter_1.paintCmd3(logs[i--], 'remove', []);
            logs.pop();
        }
    }
    if (i >= 0) {
        setTimeout(clearLog, LogClearInterval);
    }
    else {
        painter_1.paintCmd3(logContainer, 'remove', []);
    }
};
// ============================== 立即执行
// 在手机上才需要注册日志函数
mod_1.commonjs.flags.mobile && log_1.setBroadcast(exports.log);
// 监听添加widget
exports.forelet.listener = (cmd, widget) => {
    if (cmd !== 'firstPaint') {
        return;
    }
    rootWidget = widget;
    root = painter_1.getRealNode(widget.tree);
    const forbid = (e) => {
        if (forbidEventTime > 0) {
            if (time_1.now() < forbidEventTime && !checkAllowRect(e.clientX, e.clientY, allowEventRect)) {
                e.stopPropagation();
            }
            else {
                forbidEventTime = 0;
            }
        }
    };
    const forbidTouch = (e) => {
        if (forbidEventTime > 0) {
            if (time_1.now() < forbidEventTime && !checkAllowRect(e.touches[0].pageX, e.touches[0].pageY, allowEventRect)) {
                e.stopPropagation();
            }
            else {
                forbidEventTime = 0;
            }
        }
    };
    const stop = (e) => {
        e.stopPropagation();
    };
    const disabled = (e) => {
        e.stopPropagation();
        e.preventDefault();
    };
    const allowDefault = (e) => {
        e.stopPropagation();
        el = e.target;
        while (el !== null && el !== root && el !== document.body) {
            // 如果元素为输入框或允许默认事件，则返回
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.getAttribute('allowDefault')) {
                return;
            }
            el = el.parentNode;
        }
        e.preventDefault();
    };
    let startX;
    let startY;
    let el;
    let orientation;
    const onTouchStart = (e) => {
        startX = e.touches[0].screenX;
        startY = e.touches[0].screenY;
        const r = doTouchStart(e, orientation);
        orientation = r.orientation;
        el = r.el;
    };
    const onTouchMove = (e) => {
        if (orientation === 0) {
            e.preventDefault();
            return;
        }
        const r = doTouchMove(e, el, orientation, startX, startY);
        startX = r.startX;
        startY = r.startY;
    };
    // root.addEventListener('mousemove', forbid, true);
    // root.addEventListener('mousedown', forbid, true);
    // root.addEventListener('mouseup', forbid, true);
    // root.addEventListener('touchmove', forbidTouch, true);
    // root.addEventListener('touchstart', forbidTouch, true);
    // root.addEventListener('touchend', forbidTouch, true);
    // root.addEventListener('mousemove', allowDefault, false);
    // root.addEventListener('mousedown', stop, false);
    // root.addEventListener('mouseup', allowDefault, false);
    // root.addEventListener('touchmove', onTouchMove, false);
    // root.addEventListener('touchstart', onTouchStart, false);
    // root.addEventListener('touchend', stop, false);
    const arr = widget.tree.children;
    for (const n of arr) {
        const e = painter_1.getRealNode(n);
        painter_1.paintCmd3(e, 'remove', []);
        const name = virtual_node_1.getAttribute(n.attrs, 'group');
        if (!name) {
            continue;
        }
        groupMap.set(name, { name: name, el: e, arr: [] });
        if (name === 'log') {
            logContainer = e;
        }
    }
    browserAdaptive();
};
// 监听onresize
window.onresize = browserAdaptive;
// 取顶层窗口
try {
    const win = top.window;
    // 注册系统返回事件
    win.onpopstate = () => {
        win.history.pushState({}, null);
        if (forbidBack) {
            return;
        }
        if (exports.backList.length) {
            exports.backCall();
        }
        else {
            exports.listenerList({ type: 'back' });
        }
    };
    win.history.pushState({}, null);
    // tslint:disable-next-line:no-empty
}
catch (e) {
}
/**
 * 处理点击开始
 * @param e 事件
 */
const doTouchStart = (e, orientation) => {
    e.stopPropagation();
    orientation = 0;
    let el = e.target;
    while (el !== null && el !== root && el !== document.body) {
        // 如果元素为输入框或允许默认事件，则返回
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.getAttribute('allowDefault')) {
            return { orientation, el };
        }
        if (!preventScroll) {
            // 如果完全使用better-scroll，则可以去掉
            const st = html_1.getStyle(el);
            if (st.overflowX === 'auto') {
                orientation |= 1;
            }
            if (st.overflowY === 'auto') {
                orientation |= 2;
            }
            // 如果元素为可滚动，则返回
            if (orientation !== 0) {
                return { orientation, el };
            }
        }
        el = el.parentNode;
    }
    // 禁止默认操作，防止微信及浏览器的返回或拉下
    e.preventDefault();
    return { orientation, el };
};
/**
 * 处理移动
 *
 * @param e 事件
 * @param el 元素
 * @param orientation 方向
 * @param startX 起始x位置
 * @param startY 起始y位置
 */
const doTouchMove = (e, el, orientation, startX, startY) => {
    const endX = e.touches[0].screenX;
    const endY = e.touches[0].screenY;
    if ((orientation & 2) !== 0) {
        if (endY - startY >= 0) {
            if (el.scrollTop <= 0) {
                e.preventDefault();
            }
        }
        else {
            if (el.scrollHeight - el.clientHeight <= el.scrollTop) {
                e.preventDefault();
            }
        }
    }
    if ((orientation & 1) !== 0) {
        if (endX - startX >= 0) {
            if (el.scrollLeft <= 0) {
                e.preventDefault();
            }
        }
        else {
            if (el.scrollWidth - el.clientWidth <= el.scrollLeft) {
                e.preventDefault();
            }
        }
    }
    return { startX, startY };
};
});
