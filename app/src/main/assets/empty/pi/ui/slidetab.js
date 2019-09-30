_$define("pi/ui/slidetab", function (require, exports, module){
"use strict";
/*
 * 滑动选项卡
 * 用户可以单击选项，来切换卡片，也可以滑动或快速滑动卡片来切换卡片。滑动到头后，有橡皮筋效果。
 * 根据提示条目显示红点提示或数量提示
 */
Object.defineProperty(exports, "__esModule", { value: true });
// ============================== 导入
const time_1 = require("../lang/time");
const tween_1 = require("../math/tween");
const html_1 = require("../util/html");
const task_mgr_1 = require("../util/task_mgr");
const painter_1 = require("../widget/painter");
const virtual_node_1 = require("../widget/virtual_node");
const widget_1 = require("../widget/widget");
// ============================== 导出
/**
 * @description 定时器的定时时间，毫秒
 */
exports.TimerTime = 30;
/**
 * @description 运动速度，宽度100%/秒
 */
exports.Speed = 100;
/**
 * @description 导出组件Widget类
 * @example
 */
class SlideTab extends widget_1.Widget {
    constructor() {
        super(...arguments);
        this.transform = ''; // transform的兼容键
        this.end = 0; // 结束位置，为(卡片数量-1)*-100
        this.container = undefined; // 卡片的容器
        this.containerWidth = 0;
        this.timerRef = undefined;
        this.startTime = 0; // 定时运动的起始时间
        this.startOffset = 0; // 定时运动的起始位置
        this.swipe = 0; // 挥动的方向，0为无挥动，-1左，1右
        this.lastOffset = 0;
        this.moving = 0;
    }
    /**
     * @description 第一次计算后调用，此时创建了真实的dom，但并没有加入到dom树上，一般在渲染循环外调用
     * @example
     */
    firstPaint() {
        super.firstPaint();
        this.props = this.props || { cur: 0, old: {} };
        this.transform = html_1.getSupportedProperty('transform');
        this.end = -(this.config.value.arr.length - 1) * 100;
    }
    /**
     * @description 定住移动的卡片或初始化
     * @example
     */
    poiseStart(e) {
        this.moving = 0;
        if (!this.container) {
            this.container = painter_1.getRealNode(virtual_node_1.findNodeByAttr(this.tree, 'container'));
            this.containerWidth = this.container.getBoundingClientRect().width;
        }
        if (this.timerRef) {
            task_mgr_1.clearTimer(this.timerRef);
            const r = tween(this);
            this.timerRef = null;
            this.lastOffset = (r === false) ? -this.props.cur * 100 : r;
        }
        else {
            this.lastOffset = -this.props.cur * 100;
        }
    }
    /**
     * @description 松开移动的卡片
     * @example
     */
    poiseEnd(e) {
        if (this.moving > 0 || this.timerRef) {
            return;
        }
        if (this.lastOffset === -this.props.cur * 100) {
            return;
        }
        this.timerRef = task_mgr_1.setTimer(tween, [this], exports.TimerTime);
        this.startTime = time_1.now();
        this.startOffset = this.lastOffset;
        this.moving = 2;
    }
    /**
     * @description 处理tpl里面的on-move事件
     * @example
     */
    moveTab(e) {
        let d = this.lastOffset + (e.x - e.startX) * 100 / this.containerWidth;
        if (d > 0) { // 左边拉到头
            d = tween_1.calc(d > 100 ? 100 : d, 0, 100, 100, tween_1.cubicOut) / 3;
        }
        else if (d < this.end) { // 右边拉到头
            d = this.end - tween_1.calc(this.end - d > 100 ? 100 : this.end - d, 0, 100, 100, tween_1.cubicOut) / 3;
        }
        // tslint:disable-next-line:prefer-template
        painter_1.paintCmd3(this.container.style, this.transform, 'translateX(' + d + '%)');
        this.moving = 1;
        if (e.subType === 'over') {
            this.timerRef = task_mgr_1.setTimer(tween, [this], exports.TimerTime);
            this.startTime = time_1.now();
            this.startOffset = d;
            this.moving = 2;
            if (e.swipe) {
                this.swipe = (e.x - e.lastX) > 0 ? 1 : -1;
            }
            else {
                this.swipe = 0;
            }
        }
    }
    /**
     * @description 选择按钮切换
     * @example
     */
    change(e) {
        if (e.cmd === this.props.cur) {
            return;
        }
        if (this.timerRef) {
            task_mgr_1.clearTimer(this.timerRef);
            this.timerRef = null;
        }
        this.props.cur = e.cmd;
        this.paint();
    }
}
exports.SlideTab = SlideTab;
// ============================== 本地
/**
 * @description 定时器调用运动函数
 * @example
 */
const tween = (widget) => {
    let d;
    const time = time_1.now() - widget.startTime;
    if (widget.startOffset > 0) { // 左边弹回
        d = widget.startOffset * 1000 / exports.Speed;
        if (time > d) {
            d = 0;
            task_mgr_1.clearTimer(widget.timerRef);
            widget.timerRef = null;
        }
        else {
            d = tween_1.calc(time, widget.startOffset, 0, d, tween_1.quadIn);
        }
    }
    else if (widget.startOffset < widget.end) { // 右边弹回
        d = (widget.end - widget.startOffset) * 1000 / exports.Speed;
        if (time > d) {
            d = widget.end;
            task_mgr_1.clearTimer(widget.timerRef);
            widget.timerRef = null;
        }
        else {
            d = tween_1.calc(time, widget.startOffset, widget.end, d, tween_1.quadIn);
        }
    }
    else if (widget.swipe !== 0) { // 挥动
        let end = widget.startOffset % 100;
        end = (widget.swipe > 0) ? widget.startOffset - end : widget.startOffset - end - 100;
        d = stop(widget, end, time);
        if (d === false) {
            return false;
        }
    }
    else { // 平稳运动，中间根据起始位置靠那边，决定运动方向
        let end = widget.startOffset % 100;
        end = (end > -50) ? widget.startOffset - end : widget.startOffset - end - 100;
        d = stop(widget, end, time);
        if (d === false) {
            return false;
        }
    }
    // tslint:disable-next-line:prefer-template
    painter_1.paintCmd3(widget.container.style, widget.transform, 'translateX(' + d + '%)');
    return d;
};
/**
 * @description 停止，判断是否刷新
 * @example
 */
const stop = (widget, end, time) => {
    let d = Math.abs(end - widget.startOffset) * 1000 / exports.Speed;
    if (time > d) {
        d = end;
        task_mgr_1.clearTimer(widget.timerRef);
        widget.timerRef = null;
        if (widget.props.cur !== -end / 100) {
            widget.props.cur = -end / 100;
            widget.paint();
            return false;
        }
    }
    else {
        d = tween_1.calc(time, widget.startOffset, end, d, tween_1.sinOut);
    }
    return d;
};
// ============================== 立即执行
});
