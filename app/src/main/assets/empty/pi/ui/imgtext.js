_$define("pi/ui/imgtext", function (require, exports, module){
"use strict";
/*
 * 图像文字
 * 只支持单行文字，不支持继承的font属性，不支持line-height属性
 * 	如果支持继承的font属性，则需要在div放入节点后，获取font属性
 * 	如果支持多行文本，需要支持line-height属性，并处理对齐问题
 * 要求props为 {
 * 					textCfg:canvas.ImgTextCfg,
 * 					space?:number,
 * 					"show":"" // 如果有show，表示为拼接文字，text为全文字，show变动不会生成新的文字图片
 * 				}
 *
canvas.ImgTextCfg {
        "text": "测试",
        "font": "normal 400 24px 宋体",
        "color": "#636363" | GradientCfg, // 颜色 或渐变颜色
        "shadow": { // 阴影
            "offsetX": number,
            "offsetY": number, //偏移量
            "blur": number, // 模糊值，一般为5
            "color": string; // 颜色 "rgba(0,0,0,0.5)" "gray" "#BABABA"
        };
        "strokeWidth": number, // 描边宽度
        "strokeColor": string | GradientCfg, // 描边颜色
        "background": string | GradientCfg, // 背景
    }
 */
Object.defineProperty(exports, "__esModule", { value: true });
const widget_1 = require("../widget/widget");
// ============================== 导出
/**
 * @description 导出组件Widget类
 * @example
 */
class ImgText extends widget_1.Widget {
}
exports.ImgText = ImgText;
// ============================== 本地
// ============================== 立即执行
});
