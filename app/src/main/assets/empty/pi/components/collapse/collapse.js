_$define("pi/components/collapse/collapse", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Collapse 折叠面板的逻辑处理
 */
const widget_1 = require("../../widget/widget");
const event_1 = require("../../widget/event");
const painter_1 = require("../../widget/painter");
class Collapse extends widget_1.Widget {
    constructor() {
        super();
    }
    setProps(props, oldProps) {
        super.setProps(props, oldProps);
        if (props.accordion) {
            this.state = {
                currentExpIndex: -1,
                lastExpIndex: -1,
                isExpanded: this.isExpanded.bind(this)
            };
        }
        else {
            let currentExpArr = [];
            for (let i = 0; i < props.htmlStrList.length; i++) {
                currentExpArr[i] = false;
            }
            this.state = {
                currentExpArr,
                isExpanded: this.isExpanded.bind(this)
            };
        }
    }
    clickItemListener(event, index) {
        if (this.props.accordion) {
            this.state.lastExpIndex = this.state.currentExpIndex;
            if (this.state.currentExpIndex === index) {
                this.state.currentExpIndex = -1;
            }
            else {
                this.state.currentExpIndex = index;
            }
        }
        else {
            this.state.currentExpArr[index] = !this.state.currentExpArr[index];
        }
        this.setHiddenContentHeight(index, this.isExpanded(index));
        let activeIndexs;
        if (this.props.accordion) {
            activeIndexs = this.state.currentExpIndex;
        }
        else {
            activeIndexs = [];
            for (let i = 0; i < this.state.currentExpArr.length; i++) {
                if (this.state.currentExpArr[i]) {
                    activeIndexs.push(i);
                }
            }
        }
        event_1.notify(event.node, "ev-collapse-change", { activeIndexs });
        this.paint();
    }
    //判断当前item是否展开
    isExpanded(index) {
        if (this.props.accordion) {
            return this.state.currentExpIndex == index;
        }
        return this.state.currentExpArr[index];
    }
    setHiddenContentHeight(index, isExpanded) {
        let currentItemPanel = this.tree.children[index].children[1];
        let currentItemPanelNode = painter_1.getRealNode(currentItemPanel);
        if (this.props.accordion && this.state.lastExpIndex !== -1) {
            let lastItemPanel = this.tree.children[this.state.lastExpIndex].children[1];
            let lastItemPanelNode = painter_1.getRealNode(lastItemPanel);
            lastItemPanelNode.style.height = "0px";
        }
        if (!isExpanded) {
            currentItemPanelNode.style.height = "0px";
            return;
        }
        let scrollHeight = currentItemPanelNode.scrollHeight;
        currentItemPanelNode.style.height = scrollHeight + "px";
    }
}
exports.Collapse = Collapse;
});
