_$define("pi/components/navmenu/nav_submenu", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 导航菜单栏
 * mod 设置导航栏的类型，vertical和horizontal，默认是vertical垂直导航栏
 * isopen 子模块是否展开，默认不展开
 * arr 数组，没有子模块，直接传递包含title的json数据，有子模块传递包含submenu，subtitle及arr的json数据
 * left和top 表示子模块要显示的绝对位置
 * 可以多层嵌套导航栏
 *
 *
 * 最外层事件监听清空参数
 */
const widget_1 = require("../../widget/widget");
const painter_1 = require("../../widget/painter");
class navmenu extends widget_1.Widget {
    constructor() {
        super();
        this.props = {
            mod: "vertical",
            isopen: false,
            isActivated: false,
            arr: []
        };
        this.state = {
            left: 0,
            top: 0
        };
    }
    subClick(event) {
        this.props.isopen = !this.props.isopen;
        this.paint();
    }
    subMouseover(event) {
        this.state.left = painter_1.getRealNode(event.node).offsetLeft;
        this.state.top = painter_1.getRealNode(event.node).offsetTop + painter_1.getRealNode(event.node).offsetHeight;
        this.props.isopen = true;
        this.paint();
    }
    subMouseout(event) {
        this.props.isopen = false;
        this.paint();
    }
}
exports.navmenu = navmenu;
});
