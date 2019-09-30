_$define("pi/components/navmenu/navmenu_item", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * index 唯一标识
 * title 名称
 * submenu 是否含有子模块
 * subtitle 模块组的名称
 * isActivated 是否选中，默认未选中
 * isdisable 是否不可选择，默认可选择
 * 可以多层嵌套导航栏
 */
const widget_1 = require("../../widget/widget");
const event_1 = require("../../widget/event");
const painter_1 = require("../../widget/painter");
class navmenu extends widget_1.Widget {
    constructor() {
        super();
        this.props = {
            index: "1",
            title: "group1",
            submenu: false,
            subtitle: "",
            isActivated: false,
            isdisabled: false
        };
        this.state = {
            left: 0,
            top: 0,
            isopen: false
        };
    }
    doClick(event) {
        if (this.props.isdisabled) {
            return;
        }
        this.props.isActivated = true;
        this.paint();
        event_1.notify(event.node, "ev-navmenu-click", { index: this.props.index });
    }
    itemMouseover(event) {
        this.state.left = painter_1.getRealNode(event.node).offsetWidth;
        this.state.top = painter_1.getRealNode(event.node).offsetTop;
        this.state.isopen = true;
        this.paint();
    }
    itemMouseout(event) {
        this.state.isopen = false;
        this.paint();
    }
}
exports.navmenu = navmenu;
});
