_$define("pi/ui/navtab", function (require, exports, module){
"use strict";
/*
 * 导航选项卡
 * 用户可以单击选项，来切换卡片。支持3种模式，惰性加载0-隐藏显示切换，切换采用加载1-销毁模式，一次性加载2-隐藏显示切换。
 * props={cur:0, btn:"btn$", arr:[{tab:"input$", btn:{} }], old:{}, type:0 }
 */
Object.defineProperty(exports, "__esModule", { value: true });
const task_mgr_1 = require("../util/task_mgr");
const event_1 = require("../widget/event");
const widget_1 = require("../widget/widget");
// ============================== 导出
/**
 * @description 导出组件Widget类
 * @example
 */
class NavTab extends widget_1.Widget {
    constructor() {
        super(...arguments);
        this.old = {};
    }
    /**
     * @description 设置属性，默认外部传入的props是完整的props，重载可改变行为
     * @example
     */
    setProps(props, oldProps) {
        if (!Number.isInteger(props.cur)) {
            props.cur = this.props ? this.props.cur : 0;
        }
        this.old[props.cur] = true;
        props.old = this.old;
        this.props = props;
    }
    /**
     * @description 选择按钮切换
     * @example
     */
    change(e) {
        console.log('===');
        if (e.cmd === this.props.cur) {
            return;
        }
        const old = this.props.cur;
        this.props.cur = e.cmd;
        this.old[e.cmd] = true;
        this.paint();
        task_mgr_1.set(event_1.notify, [this.parentNode, 'ev-change', e], 90000, 1);
    }
}
exports.NavTab = NavTab;
// ============================== 本地
// ============================== 立即执行
});
