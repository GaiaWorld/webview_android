_$define("pi/ui/selectnumber", function (require, exports, module){
"use strict";
/*
 * 选数量对话框
 * props = {count?:number ||, maxCount?:number, minCount?:number, interval?:number}
 * props可以有count, 默认为1
 * props可以有maxCount, 默认为Number.MAX_SAFE_INTEGER
 * props可以有minCount, 默认为0
 * props可以有interval, 默认为200毫秒
 */
Object.defineProperty(exports, "__esModule", { value: true });
const task_mgr_1 = require("../util/task_mgr");
const event_1 = require("../widget/event");
const widget_1 = require("../widget/widget");
const INTERVAL = 200;
// ============================== 导出
/**
 * @description 导出组件Widget类
 * @example
 */
class SelectNumber extends widget_1.Widget {
    constructor() {
        super(...arguments);
        this.timerRef = 0;
    }
    /**
     * @description 设置属性，默认外部传入的props是完整的props，重载可改变行为
     * @example
     */
    setProps(props, oldProps) {
        props.count = props.count || 1;
        props.minCount = props.minCount || 0;
        props.maxCount = props.maxCount || Number.MAX_SAFE_INTEGER;
        props.interval = props.interval || INTERVAL;
        this.props = props;
    }
    /**
     * @description 按下事件
     * @example
     */
    // tslint:disable-next-line:typedef
    down(step) {
        this.props.step = step;
        // tslint:disable-next-line:no-this-assignment
        const w = this;
        this.timerRef = setTimeout(() => { changeCount(w, step, true); }, 800);
    }
    /**
     * @description 鼠标或手指抬起事件
     * @example
     */
    // tslint:disable-next-line:typedef
    up(e) {
        if (this.timerRef) {
            clearTimeout(this.timerRef);
            this.timerRef = 0;
        }
        changeCount(this, this.props.step, false);
        task_mgr_1.set(event_1.notify, [this.parentNode, 'ev-selectcount', { count: this.props.count }], 90000, 1);
    }
    /**
     * @description 销毁时调用，一般在渲染循环外调用
     * @example
     */
    destroy() {
        if (!super.destroy()) {
            return false;
        }
        this.timerRef && clearTimeout(this.timerRef);
        return true;
    }
}
exports.SelectNumber = SelectNumber;
/**
 * @description 更改选择数量
 * @param startTimeout--是否开启定时器
 * @example
 */
const changeCount = (w, step, startTimeout) => {
    const to = w.props.count + step;
    if (step > 0) {
        if (to >= w.props.maxCount) {
            w.props.count = w.props.maxCount;
            w.timerRef = 0;
        }
        else {
            w.props.count = to;
            if (startTimeout) {
                w.timerRef = setTimeout(() => { changeCount(w, step, true); }, w.props.interval);
            }
        }
    }
    else if (step < 0) {
        if (to <= w.props.minCount) {
            w.props.count = w.props.minCount;
            w.timerRef = 0;
        }
        else {
            w.props.count = to;
            if (startTimeout) {
                w.timerRef = setTimeout(() => { changeCount(w, step, true); }, w.props.interval);
            }
        }
    }
    w.paint();
};
});
