_$define("pi/util/msdf_font", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 导入 =================================
const util_1 = require("../widget/util");
const util_2 = require("./util");
const mod_1 = require("../lang/mod");
const readJsonBin_1 = require("./readJsonBin");
// const charsetMap = {
//     frequency: undefined,
//     other: undefined
// };
const allFontMap = new Map(); // <fontName, fontMap>
const allCharsetMap = new Map(); // <fontName, CharsetMap>
const allCharInfoMap = new Map(); // <fontName, CharInfoMap>
const getFontMap = (fontName) => {
    let fontMap;
    if (allFontMap.has(fontName)) {
        fontMap = allFontMap.get(fontName);
    }
    else {
        fontMap = {
            canvasInfo: {
                canvas: undefined,
                curlineHeight: 0,
                curXOffset: 0,
                curYOffset: 0,
                width: defaultWidth,
                height: defaultHeight
            },
            chars: {},
            common: undefined,
            fontName: fontName
        };
        initFontCanvas(fontMap);
        allFontMap.set(fontName, fontMap);
    }
    return fontMap;
};
const getCharsetMap = (fontName) => {
    let charsetMap;
    if (allCharsetMap.has(fontName)) {
        charsetMap = allCharsetMap.get(fontName);
    }
    else {
        charsetMap = { frequency: undefined };
        allCharsetMap.set(fontName, charsetMap);
    }
    return charsetMap;
};
const getCharInfoMap = (fontName) => {
    let charInfoMap;
    if (allCharInfoMap.has(fontName)) {
        charInfoMap = allCharInfoMap.get(fontName);
    }
    else {
        charInfoMap = {
            dir: '',
            frequencyChar: [],
            otherChar: [],
            otherJsonFile: []
        };
        fontName && allCharInfoMap.set(fontName, charInfoMap);
    }
    return charInfoMap;
};
/**
 * 获取字体总配置文件文件
 * 默认不同字体放在不同文件夹下，每个文件夹下也只有一个字体
 * @param dir 构建出的字体相关文件所在文件夹
 * @param callback 成功回调
 * @example getJsonConfig('dist/', (charsetMap) => {}, (err) => {})
 */
const getJsonConfig = (dir, callback, errCallback) => {
    const charInfoMap = getCharInfoMap('');
    if (!dir) {
        dir = '';
    }
    else if (!dir.endsWith('/')) {
        dir += '/';
    }
    fetchFontCharInfo(dir, (info) => {
        fetchFontJsonBin(dir, info, (data) => {
            const [charset, fontName] = dealBinFiles(dir, data);
            if (charset.frequency) {
                loadImages(charset.frequency.pages, fontName, (imgs) => {
                    charset.frequency.pages = imgs;
                    dealImgOfCharset(charset.frequency);
                    callback(charset);
                }, errCallback);
            }
            else {
                callback(charset);
            }
        }, errCallback);
    }, errCallback);
    charInfoMap.dir = dir;
};
exports.getJsonConfig = getJsonConfig;
const dealImgOfCharset = (charset, fontMap) => {
    const { pages, chars } = charset;
    Object.keys(chars).forEach((id) => {
        const char = chars[id];
        const idx = char.page;
        if (typeof idx === 'object')
            return;
        char.page = pages[idx];
        fontMap && fontMap.chars[id] && (fontMap.chars[id].page = pages[idx]);
    });
};
const fetchFontCharInfo = (dir, callback, errCallback) => {
    if (!callback)
        return new Error('no callback');
    if (!dir.endsWith('/')) {
        dir += '/';
    }
    const path = `${dir}char_info.json`;
    util_1.loadDir([path], {}, {}, { json: 'download' }, (data) => {
        const getJsonBin = (data) => {
            let jsonString = util_2.utf8Decode(data);
            const info = JSON.parse(jsonString);
            callback(info);
        };
        if (!data[path]) {
            const lstore = mod_1.load.getStore();
            mod_1.store.read(lstore, path, (data) => {
                getJsonBin(data);
            }, (err) => {
                errCallback && errCallback(err);
            });
            return;
        }
        getJsonBin(data[path]);
    }, (err) => {
        errCallback && errCallback(err);
    });
};
/**
 * 从store中读取文件
 */
const readStore = (fileList, callback, errCallback) => {
    const lstore = mod_1.load.getStore();
    const wait = [];
    fileList.forEach((file) => {
        const p = new Promise((resolve, reject) => {
            mod_1.store.read(lstore, file, (data) => {
                resolve(data);
            }, (err) => {
                reject(err);
            });
        });
        wait.push(p);
    });
    Promise.all(wait).then((data) => {
        callback(data);
    }).catch((err) => {
        errCallback(err);
    });
};
/**
 * 下载字体的二进制配置文件
 */
const fetchFontJsonBin = (dir, info, callback, errCallback) => {
    const jsonBinFiles = [];
    Object.keys(info).forEach((k) => {
        jsonBinFiles.push(`${dir}${k}.json.bin`);
    });
    jsonBinFiles.push(`${dir}frequency.json.bin`);
    util_1.loadDir(jsonBinFiles, {}, {}, { bin: 'download' }, (data) => {
        if (Object.keys(data).length !== jsonBinFiles.length) {
            callback(data);
            return;
        }
        readStore(jsonBinFiles, (arrbufArr) => {
            const json = {};
            jsonBinFiles.forEach((file, idx) => {
                json[file] = arrbufArr[idx];
            });
            callback(json);
        }, (err) => {
            errCallback(err);
        });
    }, (err) => {
        errCallback(err);
    });
};
/**
 * 读取二进制文件的内容并作相应处理
 */
const dealBinFiles = (dir, data) => {
    let map;
    let name;
    Object.keys(data).forEach((k) => {
        const buf = data[k];
        k = k.replace(dir, '').replace('.json.bin', '');
        const char = readJsonBin_1.bin2Json(buf);
        const fontName = char.info.face;
        const charsetMap = getCharsetMap(fontName);
        const charsetInfo = { chars: {}, pages: [] };
        char.chars.forEach((c) => {
            if (!c)
                return;
            charsetInfo.chars[c.id] = c;
        });
        charsetInfo.pages.push(...char.pages);
        charsetMap[k] = charsetInfo;
        const charInfoMap = getCharInfoMap(fontName);
        charInfoMap.dir === dir || (charInfoMap.dir = dir);
        const { charset } = char.info;
        if (k === 'frequency') {
            charInfoMap.frequencyChar = charset;
            map = charsetMap;
            name = fontName;
        }
        else {
            charInfoMap.otherJsonFile.push(k);
            charInfoMap.otherChar.push(...charset);
        }
    });
    return [map, name];
};
/**
 * 加载字体json文件里pages中的图片文件
 */
const loadImages = (imgs, fontName, callback, errCallback) => {
    let count = 0;
    let reportedError = false;
    const len = imgs.length;
    const imageNodes = [];
    const charInfoMap = getCharInfoMap(fontName);
    imgs = imgs.map((img) => charInfoMap.dir + img);
    util_1.loadDir(imgs, {}, {}, { png: 'download' }, (data) => {
        imgs.forEach((img, idx) => {
            const node = new Image();
            node.onload = () => {
                ++count;
                if (count !== len)
                    return;
                callback(imageNodes);
            };
            imageNodes[idx] = node;
            node.onerror = (err) => {
                if (!reportedError)
                    return;
                reportedError = true;
                errCallback(err, img);
            };
            if (data[img]) {
                const blob = new Blob([data[img]]);
                node.src = URL.createObjectURL(blob);
            }
            else {
                const lstore = mod_1.load.getStore();
                mod_1.store.read(lstore, img, (arrBuf) => {
                    const blob = new Blob([arrBuf]);
                    node.src = URL.createObjectURL(blob);
                }, (err) => {
                    errCallback(err, img);
                });
            }
        });
    }, errCallback);
};
/**
 * 按照字符串顺序返回字符串在canvas上的位置信息
 */
const getCharsPosition = (str, fontMap) => {
    const pos = [];
    const { chars } = fontMap;
    let charArr;
    if (typeof str === 'string') {
        charArr = str.split('');
    }
    else {
        charArr = str;
    }
    charArr.forEach((char, idx) => {
        const charCode = typeof char === 'string' ? char.charCodeAt(0) : char;
        const info = chars[charCode];
        if (info) {
            pos[idx] = info;
        }
        else {
            pos[idx] = {
                id: charCode,
                advance: 0,
                x: 0,
                y: 0,
                xoffset: 0,
                yoffset: 0,
                width: 0,
                height: 0
            };
        }
    });
    return pos;
};
/**
 * 将需要的文字绘制到特定canvas上
 * @param str       要用到的字符组成的字符串或字符unicode码的数组
 * @param callback  生成完成回调(canvas: HTMLCanvasElement, updatedCharCodeArr: Uint32Array)
 * @example buildFont('string I want use', 'fontName', (canvas, [renderCharCode: Uint32Array]) => {}) => [CharInfo]
 */
const buildFont = (str, fontName, callback, errCallback) => {
    let resizeCanvas = false;
    let needFetchImage = false;
    const waitChars = [];
    const failChars = [];
    const fontMap = getFontMap(fontName);
    const tmpFontMap = deepCopy(fontMap);
    tmpFontMap.canvasInfo.canvas = fontMap.canvasInfo.canvas;
    const doRender = () => {
        renderCanvas(waitChars, tmpFontMap, resizeCanvas);
        allFontMap.set(fontName, tmpFontMap);
        const arrbuf = new ArrayBuffer(waitChars.length * 4);
        const u32 = new Uint32Array(arrbuf);
        waitChars.forEach((code, idx) => {
            u32[idx] = code;
        });
        callback(tmpFontMap.canvasInfo.canvas, u32);
    };
    const charArr = typeof str === 'string' ? str.split('') : str;
    charArr.forEach((char) => {
        let charset;
        const code = typeof char === 'string' ? char.charCodeAt(0) : char;
        if (tmpFontMap && tmpFontMap.chars[code])
            return;
        const charsetMap = getCharsetMap(fontName);
        const charInfoMap = getCharInfoMap(fontName);
        if (charInfoMap.frequencyChar.indexOf(char) > -1) {
            charset = charsetMap.frequency;
        }
        else if (charInfoMap.otherChar.indexOf(char) > -1) {
            const fileName = getCharInWhichJson(char, charInfoMap.otherJsonFile);
            charset = charsetMap[fileName];
            if (typeof charset.pages[0] === 'string') {
                needFetchImage = true;
                loadImages(charset.pages, fontName, (imgs) => {
                    charset.pages = imgs;
                    dealImgOfCharset(charset, tmpFontMap);
                    doRender();
                }, errCallback);
            }
        }
        else {
            failChars.push(code);
            return;
        }
        const result = calcCharPos(code, tmpFontMap, charset);
        // 不再扩大canvas
        if (result === null) {
            failChars.push(code);
        }
        else {
            waitChars.push(code);
        }
        if (result) {
            resizeCanvas = result;
        }
    });
    if (!needFetchImage) {
        doRender();
    }
    return getCharsPosition(str, tmpFontMap);
};
exports.buildFont = buildFont;
const renderCanvas = (charCodeArr, fontMap, resizeCanvas) => {
    const { chars, canvasInfo } = fontMap;
    const { canvas } = canvasInfo;
    if (!resizeCanvas) {
        charCodeArr.forEach((charCode) => {
            const { width, height, x, y, page, oix, oiy } = chars[charCode];
            const ctx = canvas.getContext('2d');
            ctx.drawImage(page, oix, oiy, width, height, x, y, width, height);
        });
        return;
    }
    const tmpCanvas = document.createElement('canvas');
    tmpCanvas.id = canvas.id;
    tmpCanvas.width = canvasInfo.width;
    tmpCanvas.height = canvasInfo.height;
    const ctx = tmpCanvas.getContext('2d');
    Object.keys(chars).forEach((id) => {
        const { width, height, x, y, page, oix, oiy } = chars[id];
        if (!page || typeof page === 'number')
            return;
        ctx.drawImage(page, oix, oiy, width, height, x, y, width, height);
    });
    canvasInfo.canvas = tmpCanvas;
};
/**
 * 深拷贝
 */
const deepCopy = (src) => {
    const result = {};
    Object.keys(src).forEach((k) => {
        if (typeof src[k] === 'object') {
            result[k] = deepCopy(src[k]);
        }
        else {
            result[k] = src[k];
        }
    });
    return result;
};
const calcCharPos = (char, fontMap, charset) => {
    let resizeCanvas = false;
    const charCode = typeof char === 'string' ? char.charCodeAt(0) : char;
    const { canvasInfo, chars } = fontMap;
    const { width, height } = canvasInfo;
    const charInfo = charset.chars[charCode] || chars[charCode];
    const newline = charInfo.width + canvasInfo.curXOffset > width;
    let contextHeight = charInfo.height + canvasInfo.curYOffset;
    if (newline) {
        contextHeight += canvasInfo.curlineHeight;
    }
    if (height < contextHeight) {
        // 不再扩大canvas
        return null;
        // 需扩大并重新绘制canvas，重新计算所有字符位置
        canvasInfo.width *= 2;
        canvasInfo.height *= 2;
        canvasInfo.curXOffset = 0;
        canvasInfo.curYOffset = 0;
        canvasInfo.curlineHeight = 0;
        resizeCanvas = true;
        Object.keys(chars).forEach((c) => {
            calcCharPos(chars[c].id, fontMap, charset);
        });
    }
    let x = 0, y = 0;
    if (newline) {
        x = 0;
        y = canvasInfo.curYOffset + canvasInfo.curlineHeight;
        canvasInfo.curlineHeight = charInfo.height;
        canvasInfo.curXOffset = charInfo.width;
        canvasInfo.curYOffset = y;
    }
    else {
        x = canvasInfo.curXOffset;
        y = canvasInfo.curYOffset;
        canvasInfo.curXOffset += charInfo.width;
    }
    if (canvasInfo.curlineHeight < charInfo.height) {
        canvasInfo.curlineHeight = charInfo.height;
    }
    const oix = charInfo.oix === undefined ? charInfo.x : charInfo.oix;
    const oiy = charInfo.oiy === undefined ? charInfo.y : charInfo.oiy;
    const item = Object.assign({}, charInfo, { x, y, oix, oiy });
    chars[charCode] = item;
    return resizeCanvas;
};
/**
 * 查找字符在那个不常用json文件内
 * @param char      要查找的字符串
 * @param jsonFiles 不常用字符串json文件名列表，其格式为"start_end"
 *                  其中start为该json文件中最小的unicode编码值，end为最大值
 */
const getCharInWhichJson = (char, jsonFiles) => {
    const charCode = char.charCodeAt(0);
    let fileName = '';
    for (const file of jsonFiles) {
        const [s, e] = file.split('_');
        const start = parseInt(s);
        const end = parseInt(e);
        if (charCode >= start && charCode <= end) {
            fileName = file;
            break;
        }
    }
    ;
    return fileName;
};
/**
 * 初始化绘制字体的canvas
 * @param width     宽(最好为2的幂)
 * @param height    高(最好为2的幂)
 */
const initFontCanvas = (fontMap) => {
    const { width, height } = fontMap.canvasInfo;
    const id = `__${fontMap.fontName}_fontCanvas__`;
    let canvas = document.getElementById(id);
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = id;
    }
    canvas.width = width;
    canvas.height = height;
    if (fontMap && fontMap.canvasInfo && fontMap.canvasInfo.canvas)
        return;
    fontMap.canvasInfo.canvas = canvas;
};
// 立即执行 =========================
// canvas默认宽高
const defaultWidth = 1024;
const defaultHeight = 1024;
// 调试用
// (<any>window).allCharsetMap = allCharsetMap;
// (<any>window).allCharInfoMap = allCharInfoMap;
// (<any>window).allFontMap = allFontMap;
// (<any>window).buildFont = buildFont;
// (<any>window).getJsonConfig = getJsonConfig;
});
