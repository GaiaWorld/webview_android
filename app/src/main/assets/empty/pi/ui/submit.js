_$define("pi/ui/submit", function (require, exports, module){
"use strict";
/*
 * 提交输入框，要求props为{sign:string|number, text?:string, readOnly?:string, focus?:boolean, id?:string|number}, 注意text要转义引号
 */
Object.defineProperty(exports, "__esModule", { value: true });
// ============================== 导入
const event_1 = require("../widget/event");
const painter_1 = require("../widget/painter");
const input_1 = require("./input");
// ============================== 导出
/**
 * @description 导出组件Widget类
 * @example
 */
class Submit extends input_1.Input {
    /**
     * @description 获取输入框
     * @example
     */
    getInput() {
        return findInput(this.tree);
    }
    /**
     * @description 提交
     * @example
     */
    submit() {
        const i = this.getInput();
        painter_1.paintCmd3(i, 'value', this.lastText || '');
        event_1.notify(this.parentNode, 'ev-input-submit', { id: this.props.id, text: i.value, input: i });
    }
}
exports.Submit = Submit;
// ============================== 本地
// 递归查找input
const findInput = (node) => {
    for (const i of node.children) {
        if (!i.children) {
            continue;
        }
        if (i.tagName === 'input') {
            return painter_1.getRealNode(i);
        }
        const r = findInput(i);
        if (r) {
            return r;
        }
    }
};
});
