_$define("pi/render3d/babylon/gui_anim_controller", function (require, exports, module){
"use strict";
/// <reference path="./babylon.d.ts"/>
Object.defineProperty(exports, "__esModule", { value: true });
const gui_anim_math_1 = require("./gui_anim_math");
const gui_creator_1 = require("./gui_creator");
let animDataMap = new Map, animLoopTime;
/**
 * 动画参数 从 cfg[0] 到 cfg[1] 为变化的属性值的域，变化过程由 _math 控制， _math 可以为 GUIAnimMath 中函数名称，也可以是自定义的 (x)=>{ return y; } 函数
 *  @param left_cfg:
 *      left:
 *      left_math:
 *  @param top_cfg:
 *      top:
 *      top_math:
 *  @param right_cfg:
 *      right:
 *      right_math:
 *  @param bottom_cfg:
 *      bottom:
 *      bottom_math:
 *  @param hCenter_cfg:
 *      hCenter:
 *      hCenter_math:
 *  @param vCenter_cfg:
 *      vCenter:
 *      vCenter_math:
 *  @param alpha_cfg:
 *      alpha
 *      alpha_math:
 *  @param scale_cfg:
 *      scale:
 *      scale_math:
 *  @param scaleX_cfg:
 *      scaleX:
 *      scaleX_math:
 *  @param scaleY_cfg:
 *      scaleY:
 *      scaleY_math:
 *  @param rotation_cfg:
 *      rotation:
 *      rotation_math:
 *  @param rotate_cfg:
 *      rotate:
 *      rotate_math:
 *  @param cellId_cfg:
 *      cellId:
 *      cellId_math:
 *      更新 cellId 时，Image 内部有自检，先后连续多次更新为相同cellId,只在第一次变化时重新绘制
 *  @param frame_cfg:
 *      frameCfg_math:
 *
 *  @param isLoop:
 *  @param callBack:
 *  @param control:
 *  @param time:
 *  @param startTime:
 *  @param progress
 *
 *  调用方法以重新开始动画
 *  @param reStart
 *  调用方法以从帧调用堆中移除动画
 *  @param dispose
 *  调用方法执行回调
 *  @param doCallBack
 *
 *  标识 是否移除
 *  @param isDisposed
 *  标识 是否调用回调
 *  @param isCallBacked
 *  记录 最近一次动画时间
 *  @param lastTime
 *
 *
 */
class GUIAnimController {
    /**
     * 初始化，启动动画循环
     */
    static init() {
        GUIAnimController.animLoop();
    }
    /**
     * 添加一个动画运行
     * @param animData
     */
    static addAnimData(animData) {
        animDataMap.set(animData, animData);
        animData.startTime = Date.now();
        animData.lastTime = animData.startTime;
        animData.isDisposed = false;
        animData.isCallBacked = false;
        animData.dispose = () => {
            animData.isDisposed = true;
            GUIAnimController.delAnimData(animData);
        };
        animData.doCallBack = () => {
            animData.callBack && animData.callBack();
            animData.isCallBacked = true;
        };
        animData.reStart = () => {
            animData.startTime = Date.now();
        };
    }
    /**
     * 移除一个动画的运行
     * @param animData
     */
    static delAnimData(animData) {
        animDataMap.delete(animData);
    }
    /**
     * 计算动画进度
     * @param animData
     */
    static computeProgress(animData) {
        let timeProgress;
        timeProgress = (Date.now() - animData.startTime) / animData.time;
        timeProgress = timeProgress <= 0 ? 0 : timeProgress;
        timeProgress = timeProgress > 1 ? 1 : timeProgress;
        animData.progress = timeProgress;
    }
    /**
     * 计算属性
     * @param animData
     * @param key
     */
    static computeAttr(animData, key) {
        let cfg, math, value;
        cfg = animData[`${key}_cfg`];
        math = animData[`${key}_math`];
        if (cfg !== undefined) {
            if (math instanceof Function) {
                value = math(animData.progress);
                value = cfg[0] + (cfg[1] - cfg[0]) * value;
            }
            else {
                if (gui_anim_math_1.AnimMath[`${math}`] !== undefined) {
                    math = gui_anim_math_1.AnimMath[`${math}`];
                    value = math(animData.progress);
                    value = cfg[0] + (cfg[1] - cfg[0]) * value;
                }
                else {
                    console.warn(`AnimMath 没有该函数: ${math} .`);
                }
            }
        }
        animData[`${key}`] = value;
    }
    /**
     * 计算属性列表
     * @param animData
     */
    static computeAttrs(animData) {
        GUIAnimController.computeAttr(animData, "left");
        GUIAnimController.computeAttr(animData, "top");
        GUIAnimController.computeAttr(animData, "right");
        GUIAnimController.computeAttr(animData, "bottom");
        GUIAnimController.computeAttr(animData, "hCenter");
        GUIAnimController.computeAttr(animData, "vCenter");
        GUIAnimController.computeAttr(animData, "alpha");
        GUIAnimController.computeAttr(animData, "scale");
        GUIAnimController.computeAttr(animData, "scaleX");
        GUIAnimController.computeAttr(animData, "scaleY");
        GUIAnimController.computeAttr(animData, "rotation");
        GUIAnimController.computeAttr(animData, "rotate");
        GUIAnimController.computeAttr(animData, "cellId");
        if (animData.cellId !== undefined) {
            animData.cellId = Math.round(animData.cellId);
        }
    }
    /**
     * 计算指定动画数据
     * @param animData
     */
    static computeAnimData(animData) {
        if (animData.control === undefined) {
            animData.dispose();
        }
        else {
            GUIAnimController.computeProgress(animData);
            GUIAnimController.computeAttrs(animData);
            gui_creator_1.GUICreator.setControlAttrs(animData.control, animData);
            if (animData.progress === 1) {
                if (animData.isLoop === true) {
                    animData.reStart();
                }
                else {
                    animData.dispose();
                    animData.doCallBack();
                }
            }
        }
        animData.lastTime = Date.now();
    }
    /**
     * 计算指定所有动画数据
     */
    static computeAnimDatas() {
        animDataMap.forEach(data => {
            GUIAnimController.computeAnimData(data);
        });
    }
    /**
     * 动画循环
     */
    static animLoop() {
        if (animLoopTime !== undefined) {
            clearTimeout(animLoopTime);
        }
        animLoopTime = setTimeout(GUIAnimController.animLoop, 66);
        GUIAnimController.computeAnimDatas();
    }
}
exports.GUIAnimController = GUIAnimController;
});
