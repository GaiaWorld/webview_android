_$define("pi/render3d/scene/scene", function (require, exports, module){
"use strict";
/*
 * 场景模块
 */
Object.defineProperty(exports, "__esModule", { value: true });
// ============================== 导入
const frame_mgr_1 = require("../../widget/frame_mgr");
const widget_1 = require("../../widget/widget");
const forelet_1 = require("../../widget/forelet");
const painter_1 = require("../../widget/painter");
// ============================== 导出
/**
 * @description 导出给组件用的forelet
 * @example
 */
exports.forelet = new forelet_1.Forelet();
const scene_mgr_1 = require("../../render3d/scene_mgr");
exports.cfg = {
    width: 420,
    height: 700,
    antialias: false
};
let frame;
let isInitMgr = false;
exports.init = () => {
    if (isInitMgr)
        return;
    isInitMgr = true;
    scene_mgr_1.SceneManager.init(exports.cfg.width, exports.cfg.height, exports.cfg.antialias);
    scene_mgr_1.SceneManager.reset({
        lights: [{
                type: 'Ambient',
                color: [1.0, 1.0, 1.0]
            }]
    });
    // 场景的渲染循环
    const FPS = 31;
    frame = frame_mgr_1.create();
    // tslint:disable-next-line:no-string-based-set-interval
    frame.setInterval(1000 / FPS);
    frame_mgr_1.setInterval(frame);
    frame.setPermanent(scene_mgr_1.SceneManager.render.bind(scene_mgr_1.SceneManager));
};
// ============================== 本地
// ============================== 立即执行
// 监听添加widget
exports.forelet.listener = (cmd, widget) => {
    if (cmd === 'firstPaint') {
        const canvas = scene_mgr_1.SceneManager.getCanvas();
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        painter_1.paintCmd3(painter_1.getRealNode(widget.tree), 'appendChild', [canvas]);
    }
};
let clickCB = null;
// 设置点击回调，主要是场景查询
exports.setClickCallback = (cb) => {
    clickCB = cb;
};
/**
 * @description 设置帧率统计回调
 * @param interval 调用回调的间隔时间，单位:毫秒
 * @param cb 回调函数，参数是frame_mgr的lastStat对象
 *
 */
exports.setFrameStateCallback = (cb, interval) => {
    frame.setStat(cb, interval);
};
class Scene extends widget_1.Widget {
    constructor() {
        super();
    }
    onRayCast(event) {
        const scale = exports.cfg.width;
        const x = event.x * (exports.cfg.width / window.innerWidth);
        const y = event.y * (exports.cfg.height / window.innerHeight);
        const result = scene_mgr_1.SceneManager.raycast(x, y);
        clickCB && clickCB(result);
    }
}
exports.Scene = Scene;
});
