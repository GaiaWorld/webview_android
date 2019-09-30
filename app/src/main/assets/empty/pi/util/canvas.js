_$define("pi/util/canvas", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * 画布工具库
 * 图像滤镜 imgfilter
 * 支持多种滤镜，可以连续滤镜处理，包括 灰度-色相饱和度亮度-亮度对比度-腐蚀-锐化-高斯模糊
 * [["gray"], ["hsl", 180?, 1?, 1?], ["brightnessContrast", 0.5, 0?], ["corrode", 3?], ["sharp", 3?], ["gaussBlur", 3?]]
 * 图像文字 imgtext
 * 只支持单行文字，不支持继承的font属性，不支持line-height属性
 * 	如果支持继承的font属性，则需要在div放入节点后，获取font属性
 * 	如果支持多行文本，需要支持line-height属性，并处理对齐问题
 * 要求参数为ImgTextCfg, 如果cfg中有show字段，表示按字符显示，渐变也是单字符计算的
 */
// ============================== 导入
const mod_1 = require("../lang/mod");
const math_1 = require("../util/math");
const res_mgr_1 = require("../util/res_mgr");
const client_1 = require("../worker/client");
const task_mgr_1 = require("./task_mgr");
const util_1 = require("./util");
// ============================== 导出
// imgtext的资源类型
exports.RES_TYPE_IMGTEXT = 'imgtext';
// imgfliter的资源类型
exports.RES_TYPE_IMGFILTER = 'imgfilter';
// 销毁图片文字
exports.destroyImgText = (cfg) => {
    cfg.key = '';
    cfg.chars = cfg.charUV = null;
    // tslint:disable:max-line-length
    cfg.width = cfg.height = cfg.textWidth = cfg.textHeight = cfg.offsetX = cfg.offsetY = cfg.textWidth = cfg.offsetHeight = cfg.offsetY = cfg.offsetY = 0;
};
// 获得对应的字符串键
// tslint:disable:no-reserved-keywords
exports.getImgTextKey = (cfg, type) => {
    // let key = cfg.key;
    let key;
    type = type || exports.RES_TYPE_IMGTEXT;
    // if (key)
    // 	return type + ":" +key;
    if (!cfg.fontCfg) {
        cfg.fontCfg = exports.parseFont(cfg.font);
    }
    // tslint:disable:prefer-template
    cfg.key = key = cfg.text + '| ' + cfg.fontCfg.font + '| ' + colorString(cfg.color) +
        '| ' + shadowString(cfg.shadow) + '| ' + (cfg.strokeWidth || 1) + '| ' + colorString(cfg.strokeColor) + '| ' + colorString(cfg.background) + '|' + (cfg.isPowerOfTwo ? true : false);
    return type + ':' + key;
};
/**
 * @description 解析字体配置，同css font的字体简写， 字体字符串中必须有size和family属性
 * @example
 */
exports.parseFont = (str) => {
    const arr = str.split(' ');
    let i = arr.length - 1;
    const cfg = {
        style: 'normal',
        weight: 400,
        size: 24,
        face: 'arial,serif',
        font: ''
    };
    if (i >= 0) {
        cfg.face = arr[i--];
    }
    if (i >= 0) {
        const size = parseInt(arr[i--], 10);
        if (size) {
            cfg.size = size;
        }
    }
    if (i >= 0) {
        const s = arr[i--];
        let weight = parseInt(s, 10);
        if (!weight) {
            weight = WeightNumber[s];
        }
        if (weight) {
            cfg.weight = weight;
        }
    }
    if (i >= 0) {
        cfg.style = arr[i];
    }
    cfg.font = cfg.style + ' ' + cfg.weight + ' ' + cfg.size + 'px ' + cfg.face;
    return cfg;
};
/**
 * @description 计算绘制文字的参数，宽度、偏移量
 * @example
 */
exports.calcText = (cfg) => {
    if (cfg.isPowerOfTwo === true && cfg.width !== undefined && !math_1.isPowerOfTwo(cfg.width)) {
        throw new Error('Not a power of 2, width: ' + cfg.width);
    }
    const ctx = initWidth(cfg);
    const arr = cfg.text.split('');
    let v = cfg.lineHeight;
    let u = 0;
    let h = 0;
    const uv = {};
    let totalW = 0;
    let currW = 0;
    const halfSpace = cfg.space;
    exports.calcOffset(cfg); // 计算描边阴影的像素
    for (const v of arr) {
        totalW += (ctx.measureText(v).width * cfg.factor + cfg.offsetWidth + cfg.space);
    }
    totalW -= cfg.space;
    if (cfg.width === undefined) {
        const tw = cfg.isPowerOfTwo ? math_1.nextPowerOfTwo(Math.ceil(totalW)) : Math.ceil(totalW);
        cfg.width = Math.min(tw, imgLimitWidth);
    }
    // 每次换行时，重置u
    const resetStart = () => {
        if (cfg.isCommon || totalW - currW >= cfg.width || !cfg.textAlign || cfg.textAlign === 'left') {
            u = 0;
        }
        else if (cfg.textAlign === 'center') {
            u = (cfg.width - (totalW - currW)) / 2;
        }
        else if (cfg.textAlign === 'right') {
            u = (cfg.width - (totalW - currW)) - 1;
        }
        v += h;
    };
    resetStart();
    let size = (cfg.fontCfg.size + cfg.offsetHeight) * cfg.hfactor;
    // 计算uv
    const calc = () => {
        let w;
        let index = 0;
        h = cfg.lineHeight;
        if (h < size) {
            h = size;
        }
        v = (h - size) / 2;
        for (const c of arr) {
            w = ctx.measureText(c).width * cfg.factor + cfg.offsetWidth + cfg.space;
            if (u + w - halfSpace > cfg.width) {
                resetStart();
            }
            if (cfg.isCommon) {
                if (uv[c]) {
                    continue;
                }
                uv[c] = { u1: u, v1: v, u2: u + w, v2: v + h };
            }
            else {
                uv[index] = { u1: u, v1: v, u2: u + w, v2: v + h };
            }
            u += w;
            currW += w;
            index++;
        }
    };
    calc();
    cfg.textHeight = Math.ceil(v + h / 2 + size / 2);
    cfg.textWidth = v ? cfg.width : totalW;
    cfg.totalW = totalW;
    if (isErgodicDraw(cfg)) {
        cfg.chars = arr;
        cfg.charUV = uv;
    }
    if (cfg.isPowerOfTwo) {
        cfg.height = math_1.nextPowerOfTwo(cfg.textHeight);
        return;
    }
    cfg.height = Math.ceil(cfg.textHeight);
};
/**
 * @description 计算勾边宽度和阴影设置所影响的偏移量和宽高
 * @example
 */
exports.calcOffset = (cfg) => {
    cfg.offsetX = 0;
    cfg.offsetY = 0;
    cfg.offsetWidth = 0;
    cfg.offsetHeight = 0;
    if (cfg.strokeColor) {
        const width = cfg.strokeWidth;
        cfg.offsetX += width;
        cfg.offsetWidth += width + width;
        cfg.offsetY += width;
        cfg.offsetHeight += width + width;
    }
    const shadow = cfg.shadow;
    if (shadow) {
        const blur = shadow.blur > cfg.maxBlur ? cfg.maxBlur : shadow.blur;
        cfg.offsetX += Math.max(0, blur - shadow.offsetX);
        cfg.offsetWidth += blur * 2;
        cfg.offsetY += Math.max(0, blur - shadow.offsetY);
        cfg.offsetHeight += blur * 2;
    }
};
/**
 * @description 初始化字体配置
 * @example
 */
exports.initTextCfg = (cfg) => {
    const zoomfactor = cfg.zoomfactor ? cfg.zoomfactor : 1;
    const arr = cfg.font.split(' ');
    const i = arr.length - 2;
    if (i >= 0) {
        const size = parseInt(arr[i], 10);
        if (arr[i]) {
            arr[i] = (size * zoomfactor).toString() + 'px';
        }
    }
    const font = arr.join(' ');
    const shadow = cfg.shadow;
    const textcfg = {
        text: cfg.text,
        font: font,
        color: cfg.color,
        shadow: shadow ? {
            offsetX: cfg.shadow.offsetX ? cfg.shadow.offsetX * zoomfactor : cfg.shadow.offsetX,
            offsetY: cfg.shadow.offsetY ? cfg.shadow.offsetY * zoomfactor : cfg.shadow.offsetY,
            blur: cfg.shadow.blur ? cfg.shadow.blur * zoomfactor : cfg.shadow.blur,
            color: cfg.shadow.color
        } : undefined,
        strokeWidth: cfg.strokeWidth ? cfg.strokeWidth * zoomfactor : 1,
        strokeColor: cfg.strokeColor,
        background: cfg.background,
        isCommon: cfg.isCommon,
        space: cfg.space ? cfg.space * zoomfactor : 0,
        lineHeight: cfg.lineHeight ? cfg.lineHeight * zoomfactor : 0,
        textAlign: cfg.textAlign,
        isPowerOfTwo: cfg.isPowerOfTwo,
        factor: cfg.factor ? cfg.factor : 1,
        hfactor: cfg.hfactor ? cfg.hfactor : 1,
        zoomfactor: zoomfactor,
        width: cfg.width ? cfg.width * zoomfactor : cfg.width,
        maxBlur: zoomfactor * 10,
        key: cfg.key
    };
    imgLimitWidth = zoomfactor * 512;
    return textcfg;
};
/**
 * @description 绘制文字
 * @example
 */
exports.drawText = (textcfg) => {
    const cfg = exports.initTextCfg(textcfg);
    const canvas = document.createElement('canvas');
    exports.calcText(cfg);
    canvas.width = cfg.width;
    canvas.height = cfg.height;
    const ctx = canvas.getContext('2d');
    ctx.font = cfg.fontCfg.font;
    ctx.textBaseline = 'top';
    if (cfg.background) {
        ctx.fillStyle = getStyle(ctx, cfg.background, 0, 0, cfg.width, cfg.height);
        ctx.fillRect(0, 0, cfg.width, cfg.height);
    }
    if (cfg.strokeColor) {
        ctx.save();
        setShadow(ctx, cfg.shadow);
        ctx.lineWidth = cfg.strokeWidth;
        ctx.strokeStyle = getStyle(ctx, cfg.strokeColor, 0, 0, cfg.width, cfg.height);
        if (isErgodicDraw(cfg)) {
            const arr = cfg.chars;
            if (util_1.isString(ctx.strokeStyle)) {
                for (let i = 0; i < arr.length; i++) {
                    const uv = cfg.charUV[cfg.isCommon ? arr[i] : i];
                    ctx.strokeText(arr[i], cfg.offsetX + uv.u1, cfg.offsetY + uv.v1);
                }
            }
            else {
                for (let i = 0; i < arr.length; i++) {
                    const uv = cfg.charUV[cfg.isCommon ? arr[i] : i];
                    ctx.strokeStyle = getStyle(ctx, cfg.strokeColor, uv.u1, uv.v1, uv.u2 - uv.u1, uv.v2 - uv.v1);
                    ctx.strokeText(arr[i], cfg.offsetX + uv.u1, cfg.offsetY + uv.v1);
                }
            }
        }
        else {
            ctx.strokeText(cfg.text, cfg.offsetX, cfg.offsetY);
        }
    }
    if (cfg.color) {
        if (!cfg.strokeColor) {
            setShadow(ctx, cfg.shadow);
        }
        else {
            ctx.restore();
        }
        ctx.fillStyle = getStyle(ctx, cfg.color, 0, 0, cfg.width, cfg.height);
        if (isErgodicDraw(cfg)) {
            const arr = cfg.chars;
            if (util_1.isString(ctx.fillStyle)) {
                for (let i = 0; i < arr.length; i++) {
                    const uv = cfg.charUV[cfg.isCommon ? arr[i] : i];
                    ctx.fillText(arr[i], cfg.offsetX + uv.u1, cfg.offsetY + uv.v1);
                }
            }
            else {
                for (let i = 0; i < arr.length; i++) {
                    const uv = cfg.charUV[cfg.isCommon ? arr[i] : i];
                    ctx.fillStyle = getStyle(ctx, cfg.color, uv.u1, uv.v1, uv.u2 - uv.u1, uv.v2 - uv.v1);
                    ctx.fillText(arr[i], cfg.offsetX + uv.u1, cfg.offsetY + uv.v1);
                }
            }
        }
        else {
            ctx.fillText(cfg.text, cfg.offsetX, cfg.offsetY);
        }
    }
    return [canvas, ctx.getImageData(0, 0, cfg.width, cfg.height).data.buffer, cfg];
};
// 获得对应的图像键
exports.getImgFilterKey = (cfg) => {
    if (!cfg.file) {
        cfg.file = mod_1.butil.relativePath(cfg.img, cfg.path);
    }
    let key = exports.RES_TYPE_IMGFILTER + ':' + cfg.file;
    for (const f of cfg.arr) {
        key += '| ' + f.join(':');
    }
    return key;
};
/**
 * @description 绘制图片
 * @example
 */
exports.drawImg = (img) => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    return ctx.getImageData(0, 0, img.width, img.height).data.buffer;
};
// ============================== 本地
// 图像最大宽度
let imgLimitWidth = 512;
// 字体粗细的数值
const WeightNumber = {
    lighter: 100,
    normal: 400,
    bold: 700,
    bolder: 900
};
/**
 * @description ImgTextRes资源
 * @example
 */
class ImgRes extends res_mgr_1.Res {
    /**
     * @description 创建
     * @example
     */
    create(data) {
        const blob = new Blob([data], { type: res_mgr_1.BlobType.png });
        this.link = URL.createObjectURL(blob);
    }
    /**
     * @description 销毁，需要子类重载
     * @example
     */
    destroy() {
        URL.revokeObjectURL(this.link);
    }
}
// canvas
let canvas;
// 图像模块的名称
const imgModName = mod_1.butil.relativePath('./img', module.id);
const isErgodicDraw = (cfg) => {
    if (cfg.isCommon || cfg.space !== undefined || (!cfg.textAlign && cfg.textAlign !== 'left') || cfg.totalW > cfg.width) {
        return true;
    }
    else {
        return false;
    }
};
// 初始化canvas方法
const init = () => {
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;
    }
    return canvas.getContext('2d');
};
// 获得颜色的字符串键
const colorString = (color) => {
    if (!color) {
        return '';
    }
    if (util_1.isString(color)) {
        return color;
    }
    const cfg = color;
    return cfg.x1 + 'x' + cfg.y1 + 'x' + (cfg.r1 ? cfg.r1 : '') + ' ' + cfg.x2 + 'x' + cfg.y2 + 'x' + (cfg.r2 ? cfg.r1 : '') + ' [' + cfg.steps.join() + ']';
};
// 获得阴影的字符串键
const shadowString = (shadow) => {
    if (!shadow) {
        return '';
    }
    return shadow.offsetX + 'x' + shadow.offsetY + 'x' + shadow.blur + 'x' + shadow.color;
};
// 初始化计算宽度方法
const initWidth = (cfg) => {
    const ctx = init();
    if (!cfg.fontCfg) {
        cfg.fontCfg = exports.parseFont(cfg.font);
    }
    ctx.font = cfg.fontCfg.font;
    return ctx;
};
// 获取颜色或渐变颜色
const getStyle = (ctx, cfg, x, y, width, height) => {
    if (util_1.isString(cfg)) {
        return cfg;
    }
    let x1 = cfg.x1;
    if (!Number.isInteger(x1)) {
        x1 = parseFloat(x1) * width / 100;
    }
    let y1 = cfg.y1;
    if (!Number.isInteger(y1)) {
        y1 = parseFloat(y1) * height / 100;
    }
    let x2 = cfg.x2;
    if (!Number.isInteger(x2)) {
        x2 = parseFloat(x2) * width / 100;
    }
    let y2 = cfg.y2;
    if (!Number.isInteger(y2)) {
        y2 = parseFloat(y2) * height / 100;
    }
    const g = cfg.r1 ? ctx.createRadialGradient(x + x1, y + y1, cfg.r1, x + x2, y + y2, x + cfg.r2) : ctx.createLinearGradient(x + x1, y + y1, x + x2, y + y2);
    for (let i = 0, arr = cfg.steps, n = arr.length; i < n; i += 2) {
        g.addColorStop(arr[i], arr[i + 1]);
    }
    return g;
};
// 设置阴影
const setShadow = (ctx, cfg) => {
    if (!cfg) {
        return;
    }
    ctx.shadowOffsetX = cfg.offsetX;
    ctx.shadowOffsetY = cfg.offsetY;
    ctx.shadowBlur = cfg.blur;
    ctx.shadowColor = cfg.color;
};
// 创建ImgTextRes资源
const createImgTextRes = (name, type, args, funcArgs) => {
    task_mgr_1.set(() => {
        const text = exports.drawText(args);
        const ab = text[1];
        const cfg = text[2];
        client_1.request('calc', imgModName, 'png', [ab, cfg.width, cfg.height], [ab], 900, 0, (r) => {
            res_mgr_1.loadOK(name, type, cfg, ImgRes, r);
        }, (err) => {
            res_mgr_1.loadError(name, err);
        });
    }, undefined, 900, 0);
};
// 创建ImgFilterRes资源
const createImgFilterRes = (name, type, args, resTab) => {
    const file = args.file || mod_1.butil.relativePath(args.img, args.path);
    resTab.load(res_mgr_1.RES_TYPE_BLOB + ':' + file, res_mgr_1.RES_TYPE_BLOB, file, undefined, (r) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
            if (img.width < 1 || img.height < 1) {
                return res_mgr_1.loadError(name, {
                    error: 'INVALID_IMAGE',
                    reason: 'createImgFilterRes fail: ' + file
                });
            }
            task_mgr_1.set(() => {
                const ab = exports.drawImg(img);
                client_1.request('calc', imgModName, 'filter', [ab, img.width, img.height, args.arr], [ab], 900, 0, (r) => {
                    res_mgr_1.loadOK(name, type, args, ImgRes, r);
                }, (err) => {
                    res_mgr_1.loadError(name, err);
                });
            }, undefined, 900, 0);
        };
        img.src = r.link;
    });
};
// ============================== 立即执行
res_mgr_1.register(exports.RES_TYPE_IMGTEXT, createImgTextRes);
res_mgr_1.register(exports.RES_TYPE_IMGFILTER, createImgFilterRes);
});
