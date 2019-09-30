_$define("pi/render3d/babylon/format_canvas_display", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _CANVAS, 
// 是否旋转canvas
FLAG_ROTATION, deviceWidth, deviceHeight, 
// canvas 缩放
scaleH, scaleW, 
// canvas 尺寸
canvasH, canvasW, 
// canvas 尺寸
rootWidth, rootHeight, 
// canvas 定位
rootX, rootY, 
// canvas 显示尺寸（缩放后）
displayWidth, displayHeight;
const SceneCfg = {
    WIDTH: 1334,
    HEIGHT: 750,
    CURR_WIDTH: 1334,
    CURR_HEIGHT: 750,
    CURR_SCALE_W: 1,
    CURR_SCALE_H: 1,
    initCurrWidth: (w) => {
        SceneCfg.CURR_WIDTH = w;
        SceneCfg.CURR_SCALE_W = w / SceneCfg.WIDTH;
    },
    initCurrHeight: (h) => {
        SceneCfg.CURR_HEIGHT = h;
        SceneCfg.CURR_SCALE_H = h / SceneCfg.HEIGHT;
    }
};
/**
 * 标准化 Canvas 的显示 的方法类
 */
class FormatCanvasDisplay {
    /**
     * 初始化设计尺寸
     * @param w
     * @param h
     */
    static initDesignSize(w, h) {
        SceneCfg.WIDTH = w;
        SceneCfg.HEIGHT = h;
    }
    /**
     * 标准化 canvas 显示
     * @param canvas
     * @param parent
     */
    static format(canvas, parent) {
        _CANVAS = canvas;
        FormatCanvasDisplay.keepHeight(SceneCfg.WIDTH > SceneCfg.HEIGHT, parent);
    }
    static getDesignH() {
        return SceneCfg.HEIGHT;
    }
    static getDesignW() {
        return SceneCfg.WIDTH;
    }
    /**
     * 返回设备宽度
     */
    static getClientW() {
        return deviceWidth;
    }
    /**
     * 返回设备高度
     */
    static getClientH() {
        return deviceHeight;
    }
    /**
     * 返回显示宽度 canvas 缩放后
     */
    static getDisplayW() {
        return displayWidth;
    }
    /**
     * 返回显示高度 canvas 缩放后
     */
    static getDisplayH() {
        return displayHeight;
    }
    /**
     * 返回 canvas 宽度
     */
    static getRootW() {
        return rootWidth;
    }
    /**
     * 返回 canvas 高度
     */
    static getRootH() {
        return rootHeight;
    }
    /**
     * 返回 canvas 缩放系数
     */
    static getRootScale() {
        return scaleH;
    }
    /**
     * 返回 canvas 是否旋转
     */
    static getIsRotate() {
        return FLAG_ROTATION;
    }
    /**
     * 保持高度不变，宽度自适应
     * @param isHorizontalScreen 是否为横屏设计
     */
    // tslint:disable-next-line:max-func-body-length
    static keepHeight(isHorizontalScreen, parent) {
        // var href = window.location.href;
        // if ( 1 || href.indexOf("index.html") >= 0 || href.indexOf("gamePage.html") >= 0 ) {//index
        // 设计尺寸
        let designW, designH;
        FLAG_ROTATION = false;
        deviceWidth = document.body.clientWidth
            || document.documentElement.clientWidth
            || document.documentElement.screen.availWidth; // 微信小游戏
        deviceHeight = document.body.clientHeight
            || document.documentElement.clientHeight
            || document.documentElement.screen.availHeight; // 微信小游戏
        if (parent !== undefined) {
            deviceWidth = parent.clientWidth;
            deviceHeight = parent.clientHeight;
        }
        let clientWidth = deviceWidth;
        let clientHeight = deviceHeight;
        // oldHeight   = clientHeight;
        designW = SceneCfg.WIDTH;
        designH = SceneCfg.HEIGHT;
        if ((isHorizontalScreen && clientHeight > clientWidth)
            || (!isHorizontalScreen && clientHeight < clientWidth)) {
            FLAG_ROTATION = true;
            let temp;
            temp = clientHeight;
            clientHeight = clientWidth;
            clientWidth = temp;
        }
        // 宽高比不满足设计时 采用 高度固定，宽度自适应
        if (clientWidth / clientHeight !== designW / designH) {
            // 视窗尺寸 比 设计尺寸
            scaleH = clientHeight / designH;
            // canvas 高度固定为设计固定
            canvasH = designH;
            // 显示高度
            displayHeight = designH * scaleH;
            // 先设置 canvas宽度 为 设计宽度
            canvasW = designW;
            // 计算这个情况下 显示宽度
            displayWidth = canvasW * scaleH;
            // 此时 显示高度 为 设备高度
            // 如果 显示宽度 超出 设备宽度
            if (displayWidth > clientWidth) {
                // 将整体再缩放 以使得 显示宽度 为 设备宽度
                scaleH = scaleH * (clientWidth / displayWidth);
                scaleW = scaleH;
            }
            else {
                canvasW = clientWidth / scaleH;
                scaleH = scaleH * 1;
                scaleW = scaleH;
            }
        }
        else {
            scaleW = clientWidth / designW;
            scaleH = clientHeight / designH;
            canvasH = designH;
            canvasW = designW;
        }
        rootWidth = canvasW;
        rootHeight = canvasH;
        displayWidth = canvasW * scaleW;
        displayHeight = canvasH * scaleH;
        if (FLAG_ROTATION) {
            rootX = (clientHeight - rootWidth) / 2;
            rootY = (clientWidth - rootHeight) / 2;
            _CANVAS.setAttribute('style', 'position: absolute;overflow: hidden;left: ' + rootX + 'px;top: ' + rootY + 'px;width:' + rootWidth + 'px;height: ' + rootHeight + 'px;' +
                '-webkit-transform:scale(' + scaleH + ',' + scaleW + ') rotate(90deg);-moz-transform:scale(' + scaleH + ',' + scaleW + ') rotate(90deg);-ms-transform:scale(' + scaleH + ',' + scaleW + ') rotate(90deg);transform:scale(' + scaleH + ',' + scaleW + ') rotate(90.0001deg);');
        }
        else {
            rootX = (clientWidth - rootWidth) / 2;
            rootY = (clientHeight - rootHeight) / 2;
            _CANVAS.setAttribute('style', 'position: absolute;overflow: hidden;left: ' + rootX + 'px;top: ' + rootY + 'px;width:' + rootWidth + 'px;height: ' + rootHeight + 'px;' +
                '-webkit-transform:scale(' + scaleW + ',' + scaleH + ');-moz-transform:scale(' + scaleW + ',' + scaleH + ');-ms-transform:scale(' + scaleW + ',' + scaleH + ');transform:scale(' + scaleW + ',' + scaleH + ');');
        }
        SceneCfg.initCurrWidth(canvasW);
        SceneCfg.initCurrHeight(canvasH);
        // }
    }
}
exports.FormatCanvasDisplay = FormatCanvasDisplay;
});
