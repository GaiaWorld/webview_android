_$define("pi/widget/util", function (require, exports, module){
"use strict";
/*
 * 组件工具模块
 */
Object.defineProperty(exports, "__esModule", { value: true });
// ============================== 导入
const mod_1 = require("../lang/mod");
const html_1 = require("../util/html");
const log_1 = require("../util/log");
const res_mgr_1 = require("../util/res_mgr");
const task_mgr_1 = require("../util/task_mgr");
const tpl_1 = require("../util/tpl");
const util_1 = require("../util/util");
const style_1 = require("../widget/style");
const forelet_1 = require("./forelet");
const painter_1 = require("./painter");
const widget_1 = require("./widget");
// ============================== 导出
exports.level = log_1.logLevel;
exports.scriptTpl = true; // 通过script加载tpl
const tplWait = []; // 脚本加载tpl队列
const slowWait = {
    suffixMap: new Map(),
    fileMap: {}
}; // 慢下载
/**
 * @description 将指定名称的组件，加入到el元素的第一个元素前，会延迟到帧调用时添加
 * @example
 */
exports.addWidget = (el, name, props) => {
    const w = widget_1.factory(name);
    if (!w) {
        return;
    }
    if (props) {
        w.setProps(props);
    }
    w.paint();
    painter_1.paintCmd3(el, 'appendChild', [w.tree.link]);
    return w;
};
/**
 * @description 标签匹配， 判断模式字符串，是否和标签匹配，标签可以多级
 * @example
 * not($b1) or($b1,$b2) and(or($b1=c1,$b2!=c2), not($b3)
 * 	$b1、$b2表示flag是否含有此键， $b2!=c2表示flag的b2键的值要不等于c2
 */
exports.flagMatch = (pattern, flags) => {
    return exports.parseMatch({ str: pattern.trim() }, flags);
};
/**
 * @description 列出目录及子目录下所有的文件，跳过重复文件
 * 如果一个目录中含有 .exclude.<文件后缀>.<标签匹配语句> 文件，则表示该目录指定后缀（没有后缀表示所有文件）需要进行排除匹配，如果匹配成功，则该目录及子目录的指定后缀的文件被排除。
 * @example
 */
exports.listDir = (info, flags, fileList, suffixMap, resultMap, suffixCfg, withOut) => {
    if (resultMap[info.path]) {
        return;
    }
    let scfg;
    const children = info.children;
    const files = [];
    const dirs = [];
    for (const name in children) {
        if (!children.hasOwnProperty(name)) {
            continue;
        }
        const info = children[name];
        if (info.children) {
            dirs.push(info);
            continue;
        }
        if (!name.startsWith(exclude)) {
            files.push(info);
            continue;
        }
        const i = name.indexOf('.', exclude.length);
        if (!exports.flagMatch(name.slice(i + 1), flags)) {
            continue;
        }
        const suf = name.slice(exclude.length, i);
        if (!suf) {
            return;
        }
        if (!scfg) {
            scfg = Object.assign({}, suffixCfg);
        }
        scfg[suf] = 'none';
    }
    for (let i = files.length - 1; i > -1; i--) {
        listFile(files[i], flags, fileList, suffixMap, resultMap, scfg || suffixCfg, withOut);
    }
    for (const d of dirs) {
        exports.listDir(d, flags, fileList, suffixMap, resultMap, scfg || suffixCfg, withOut);
    }
};
exports.listDirFile = (dirs, flags, fileList, suffixMap, resultMap, suffixCfg, withOut) => {
    const dirSuffixCfg = {};
    resultMap = resultMap || {};
    if (suffixCfg) {
        for (const k in suffix_cfg) {
            if (!suffixCfg[k]) {
                suffixCfg[k] = suffix_cfg[k];
            }
        }
    }
    else {
        suffixCfg = suffix_cfg;
    }
    for (const dir of dirs) {
        const info = mod_1.depend.get(dir);
        if (!info) {
            continue;
        }
        if (info.children) {
            exports.listDir(info, flags, fileList, suffixMap, resultMap, findExclude(getParentInfo(info.path), flags, suffixCfg, dirSuffixCfg), withOut);
        }
        else {
            listFile(info, flags, fileList, suffixMap, resultMap, suffixCfg, withOut);
        }
    }
    // fileList 去除所有的模块文件
    for (let f, i = fileList.length - 1; i >= 0; i--) {
        f = fileList[i].path;
        // 跳过后缀不为".js"的文件
        if ((f.charCodeAt(f.length - 1) !== 115 || f.charCodeAt(f.length - 2) !== 106 || f.charCodeAt(f.length - 3) !== 46)) {
            continue;
        }
        if (i < fileList.length - 1) {
            fileList[i] = fileList[fileList.length - 1];
        }
        fileList.length--;
    }
};
exports.fileDepends = (suffixMap, fileList) => {
    // modNames 去除已经加载的模块文件
    const modNames = suffixMap.get("js") || [];
    for (let f, j, i = modNames.length - 1; i >= 0; i--) {
        f = modNames[i].path;
        modNames[i] = f.slice(0, f.length - 3);
        if (mod_1.commonjs.check(modNames[i]) !== true) {
            continue;
        }
        if (i < modNames.length - 1) {
            modNames[i] = modNames[modNames.length - 1];
        }
        modNames.length--;
    }
    // 获得包括依赖模块在内的等待加载的模块文件
    // tslint:disable:no-reserved-keywords
    const set = mod_1.commonjs.depend(modNames);
    modNames.length = 0;
    // fileList 加上模块依赖的文件，合并下载
    for (let i = set.length - 1; i >= 0; i--) {
        const m = set[i];
        if (m.loaded || m.buildFunc) {
            continue;
        }
        fileList.push(m.info);
        modNames.push(m.id);
    }
    return modNames;
};
/**
 * @description 加载并注册指定目录及子目录下的所有模块、组件和资源（图片、声音、字体……）
 * 次序是按照目录逐层加载，目录按序深度遍历加载
 * 精确下载，如果目录含匹配定义文件，如果和当前标签不匹配，则该目录及子目录不下载和加载。
 * 先加载所有的模块及其依赖模块，然后加载所有的组件，最后执行所有模块内的loadDirCompleted方法。
 * 前端的三种兼容（compat）： 1、模块（B模块修饰A模块） 2、组件（B组件修饰A组件） 3、资源（文字-构建系统预处理 css图片及字体-构建系统预处理），统一通过loadDirCompleted方法来处理兼容问题。这样可以支持平台差异，包括系统平台差异和渠道平台差异。
 *
 * 组件可以是<组件名>.widget，也可以是<组件名>.wcss, <组件名>.tpl, <组件名>.js，如果有tpl就算一个组件，会默认同名的css和js构成组件，如果js模块内导出了一个forelet，则认为是这个组件的forelet。
 * .widget、*.wcss、*.js可以引用到dirs以外的文件，该文件又可能引用新的文件，会需要多次碎片加载，所以都不支持引用外部目录的文件。
 * @example
 */
exports.loadDir = (dirs, flags, resultMap, suffixCfg, successCallback, errorCallback, processCallback, withOut, slowLength = -1) => {
    const fileList = [];
    const suffixMap = new Map();
    exports.listDirFile(dirs, flags, fileList, suffixMap, resultMap, suffixCfg, withOut);
    const modNames = exports.fileDepends(suffixMap, fileList);
    processCallback && processCallback({
        type: 'requireStart',
        modAmout: modNames.length,
        tplAmout: suffixMap.has("tpl") ? suffixMap.get("tpl").length : 0
    });
    const down = mod_1.load.create(fileList, (fileMap) => {
        // 加载所有的模块
        // tslint:disable:non-literal-require
        mod_1.commonjs.require(modNames, fileMap, (mods) => {
            if (exports.scriptTpl) {
                defineTpl(suffixMap, fileMap, () => {
                    if (slowLength > 0) {
                        suffixMap.forEach((v, i) => {
                            const arr = slowWait.suffixMap.get(i);
                            if (arr) {
                                slowWait.suffixMap.set(i, arr.concat(v));
                            }
                            else {
                                slowWait.suffixMap.set(i, v);
                            }
                        });
                        for (const k in fileMap) {
                            slowWait.fileMap[k] = fileMap[k];
                        }
                        successCallback && successCallback();
                    }
                    else if (slowLength === 0) {
                        loadNext(slowWait.suffixMap, slowWait.fileMap, [], successCallback, processCallback, true);
                    }
                    else {
                        loadNext(suffixMap, fileMap, mods, successCallback, processCallback);
                    }
                }, processCallback);
            }
            else {
                loadNext(suffixMap, fileMap, mods, successCallback, processCallback);
            }
        }, errorCallback, processCallback);
    }, errorCallback, processCallback);
    down.fileTab = resultMap || {};
    mod_1.load.start(down);
    return down;
};
/**
 * @description 加载全局css，并自动加载css上的图片和字体，并加载fileMap的BlobURL资源
 * @example
 */
exports.loadCssRes = (fileMap, callback) => {
    // 从fileMap中，提前将全部的BlobURL资源载入资源管理器上
    const tab = new res_mgr_1.ResTab();
    const cssArr = [];
    const rcssArr = [];
    for (const k in fileMap) {
        const type = mod_1.butil.fileSuffix(k);
        if (res_mgr_1.BlobType[type]) {
            // tslint:disable:prefer-template
            tab.load(res_mgr_1.RES_TYPE_BLOB + ':' + (type === 'webp' ? getWebpSrc(k) : k), res_mgr_1.RES_TYPE_BLOB, k, fileMap);
        }
        else if (type === 'css') {
            cssArr.push(k);
        }
        else if (type === 'rcss') {
            rcssArr.push(k);
        }
    }
    // 加载不包含资源的全局样式和应用全局样式，应该是完全的兼容样式
    for (const k of cssArr) {
        loadCss(fileMap[k]);
    }
    // 加载包含资源的全局样式和应用全局样式，并自动加载css上的资源，应该是完全的兼容样式
    let count = 1;
    const cb = (s) => {
        s && html_1.addCssNode(s);
        count--;
        count === 0 && callback && callback();
    };
    for (const k of rcssArr) {
        count++;
        replaceURL(mod_1.butil.utf8Decode(fileMap[k]), k, fileMap, cb);
    }
    cb('');
    return tab;
};
/**
 * @description 设置tpl模板加载函数
 * @example
 */
exports.setTplFun = (func) => {
    tplFun = func;
};
// ============================== 本地
// 排除前缀
const exclude = '.exclude.';
// 标签匹配的正则表达式
// tslint:disable:variable-name
const var_reg = /^\$([a-zA-Z0-9\.\_]+)\s*/;
const str_reg = /^([a-zA-Z][a-zA-Z0-9\.\_]*)\s*/;
const number_reg = /^([0-9\.]+)\s*/;
// 样式中匹配URL的正则表达式，不匹配含有:的字符串，所以如果是http:或https:，则不替换
const CSS_URL = /url\(([^\)"':]*)\)/g;
// 默认的后缀配置处理, "downonly"表示仅下载，如果本地有则不加载， "none"表示不下载不加载
const suffix_cfg = {
    png: 'downonly', jpg: 'downonly', jpeg: 'downonly',
    webp: 'downonly', gif: 'downonly', svg: 'downonly', mp3: 'downonly', ogg: 'downonly', aac: 'downonly', gltf: 'none', bin: 'none'
};
// tpl模板加载函数
let tplFun = (tplStr, filename) => {
    return { value: tpl_1.toFun(tplStr, filename), path: filename, wpath: null };
};
/**
 * @description 获得webp文件的源文件
 * @example
 */
const getWebpSrc = (path) => {
    const s = path.slice(0, path.length - 5);
    let s1 = s + '.png';
    if (mod_1.depend.get(s1)) {
        return s1;
    }
    s1 = s + '.jpg';
    if (mod_1.depend.get(s1)) {
        return s1;
    }
    s1 = s + '.jpeg';
    if (mod_1.depend.get(s1)) {
        return s1;
    }
    return path;
};
/**
 * @description 寻找父目录的文件信息
 * @example
 */
const getParentInfo = (path) => {
    const i = path.lastIndexOf('/');
    return (i > 0) ? mod_1.depend.get(path.slice(0, i + 1)) : undefined;
};
/**
 * @description 寻找父目录下的排除文件
 * @example
 */
const findExclude = (parent, flags, suffixCfg, cache) => {
    let scfg;
    while (parent) {
        let c = cache[parent.path];
        if (c === undefined) {
            const children = parent.children;
            for (const name in children) {
                if (!children.hasOwnProperty(name)) {
                    continue;
                }
                if (children[name].children) {
                    continue;
                }
                if (!name.startsWith(exclude)) {
                    continue;
                }
                const i = name.indexOf('.', exclude.length);
                if (!exports.flagMatch(name.slice(i + 1), flags)) {
                    continue;
                }
                const suf = name.slice(exclude.length, i);
                if (!suf) {
                    continue;
                }
                if (!c) {
                    c = {};
                }
                c[suf] = 'none';
            }
            cache[parent.path] = c || null;
        }
        if (c) {
            if (!scfg) {
                scfg = Object.assign({}, suffixCfg);
            }
            Object.assign(scfg, c);
        }
        parent = getParentInfo(parent.path);
    }
    return scfg || suffixCfg;
};
/**
 * @description 列出文件
 * @example
 */
const listFile = (info, flags, fileList, suffixMap, resultMap, suffixCfg, withOut) => {
    const path = info.path;
    if (withOut && withOut(path)) {
        return;
    }
    if (resultMap[path]) {
        return;
    }
    const suffix = mod_1.butil.fileSuffix(path);
    const suffix1 = fileSuffix1(path);
    const type = suffixCfg[suffix];
    const type1 = suffixCfg[suffix1];
    if (type === 'none' || type1 === 'none') {
        return;
    }
    if (type === 'downonly' || type1 === 'downonly') {
        if (mod_1.load.isLocal(path)) {
            return;
        }
    }
    fileList && fileList.push(info);
    if (!suffixMap) {
        return;
    }
    let arr = suffixMap.get(suffix);
    if (!arr) {
        arr = [];
        suffixMap.set(suffix, arr);
    }
    arr.push(info);
};
/**
 * @description 用BlobURL方式加载css
 * @example
 */
const loadCss = (data) => {
    const url = URL.createObjectURL(new Blob([data], { type: 'text/css' }));
    return html_1.loadCssNode(url, () => {
        URL.revokeObjectURL(url);
    });
};
/**
 * @description 替换样式字符串中的url，并增加资源的引用计数
 * @example
 */
const replaceURL = (css, path, fileMap, callback) => {
    const tab = new res_mgr_1.ResTab();
    let count = 1;
    const cb = () => {
        count--;
        count === 0 && callback(css.replace(CSS_URL, (str, s) => {
            s = mod_1.butil.relativePath(s, path);
            const res = tab.get(res_mgr_1.RES_TYPE_BLOB + ':' + s);
            if (!res) {
                return '';
            }
            res.use();
            return 'url(' + res.link + ')';
        }));
    };
    css.replace(CSS_URL, (str, s) => {
        count++;
        s = mod_1.butil.relativePath(s, path);
        tab.load(res_mgr_1.RES_TYPE_BLOB + ':' + s, res_mgr_1.RES_TYPE_BLOB, s, fileMap, cb, cb);
        return '';
    });
    cb();
};
/**
 * @description 目录加载的下一步，分析和创建*.tpl和*.widget对应的组件，执行脚本
 * @example
 */
const loadNext = (suffixMap, fileMap, mods, successCallback, processCallback, isSlow = false) => {
    task_mgr_1.set(() => {
        processCallback && processCallback({ type: 'loadTpl' });
        const arr = suffixMap.get("tpl") || [];
        for (const f of arr) {
            loadTpl(f.path, fileMap);
        }
    }, undefined, 3000000, 1);
    task_mgr_1.set(() => {
        processCallback && processCallback({ type: 'loadWidget' });
        const arr = suffixMap.get("widget") || [];
        for (const f of arr) {
            loadWidget(f.path, fileMap);
        }
    }, undefined, 3000000, 1);
    task_mgr_1.set(() => {
        if (isSlow) {
            successCallback && successCallback();
            slowWait.suffixMap.clear();
            slowWait.fileMap = {};
        }
        else {
            processCallback && processCallback({ type: 'loadDirCompleted' });
            for (const m of mods) {
                loadDirCompleted(m, fileMap);
            }
            successCallback && successCallback(fileMap, mods);
        }
    }, undefined, 3000000, 1);
};
const defineTpl = (suffixMap, fileMap, successCallback, processCallback) => {
    const tplArr = suffixMap.get('tpl') || [];
    if (tplArr.length === 0) {
        return successCallback();
    }
    const map = new Map();
    let len = 0;
    const defineArr = [];
    tplArr.forEach(v => {
        const tpl = widget_1.getCache(v.path);
        if (!tpl) {
            const tpl = { value: null, path: v.path, wpath: null };
            widget_1.setCache(v.path, tpl);
            map.set(v.path, 1);
            defineArr.push(fileMap[v.path]);
            len += fileMap[v.path].byteLength;
        }
        else if (!tpl.value) {
            map.set(v.path, 1);
        }
    });
    if (len) {
        const d = new Int8Array(len);
        len = 0;
        defineArr.forEach((v) => {
            d.set(new Int8Array(v), len);
            len += v.byteLength;
        });
        releaseDefine(d.buffer);
    }
    if (map.size) {
        tplWait.push({
            map: map,
            total: map.size,
            successCallback: successCallback,
            processCallback: processCallback
        });
    }
    else {
        successCallback();
    }
};
/**
 * @description 创建组件
 * @example
 */
const loadTpl = (filename, fileMap) => {
    let widget;
    let forelet;
    const name = filename.slice(0, filename.length - 4);
    const s = name + '.widget'; // 忽略有widget配置的组件
    if (fileMap[s]) {
        return;
    }
    const mod = mod_1.commonjs.relativeGet(name);
    if (mod) {
        widget = util_1.getExportFunc(mod, util_1.checkType, widget_1.Widget);
        forelet = util_1.getExportFunc(mod, util_1.checkInstance, forelet_1.Forelet);
    }
    const config = loadCfg(name + '.cfg', fileMap, name);
    const tpl = loadTpl1(filename, fileMap, name);
    const css = loadWcss(name + '.wcss', fileMap, name);
    widget_1.register(name.replace(/\//g, '-'), widget, tpl, css, config, forelet);
};
/**
 * @description 创建组件
 * @example
 */
const loadWidget = (filename, fileMap) => {
    let widget;
    let config;
    let tpl;
    let css;
    let forelet;
    const name = filename.slice(0, filename.length - 7);
    const cfg = JSON.parse(mod_1.butil.utf8Decode(fileMap[filename]));
    if (cfg.js || cfg.widget) {
        const mod = mod_1.commonjs.relativeGet(mod_1.commonjs.modName(cfg.js || cfg.widget), name);
        if (!mod) {
            log_1.warn(exports.level, 'widget not found, name:', name, cfg.js || cfg.widget);
            return;
        }
        widget = util_1.getExportFunc(mod, util_1.checkType, widget_1.Widget);
    }
    if (cfg.cfg) {
        config = loadCfg(cfg.cfg, fileMap, name);
        if (!config) {
            log_1.warn(exports.level, 'widget cfg not found, name:', name, cfg.cfg);
        }
    }
    if (cfg.css) {
        css = loadWcss(cfg.css, fileMap, name);
        if (!css) {
            log_1.warn(exports.level, 'widget css not found, name:', name, cfg.css);
        }
    }
    if (cfg.tpl) {
        tpl = loadTpl1(cfg.tpl, fileMap, name);
    }
    if (cfg.forelet) {
        const mod = mod_1.commonjs.relativeGet(mod_1.commonjs.modName(cfg.forelet), name);
        if (!mod) {
            log_1.warn(exports.level, 'widget forelet not found, name:', name, cfg.forelet);
            return;
        }
        forelet = util_1.getExportFunc(mod, util_1.checkInstance, forelet_1.Forelet);
    }
    widget_1.register(name.replace(/\//g, '-'), widget, tpl, css, config, forelet);
};
/**
 * @description 加载模板
 * @example
 */
const loadTpl1 = (file, fileMap, widget) => {
    const s = mod_1.butil.relativePath(file, widget);
    let tpl = widget_1.getCache(s);
    if (!tpl) {
        log_1.warn(exports.level, `${file} is not load with script. `);
        const data = fileMap[s];
        if (!data) {
            log_1.warn(exports.level, 'widget tpl not found, name:', widget, file);
            return;
        }
        tpl = tplFun(mod_1.butil.utf8Decode(data), s);
        widget_1.setCache(s, tpl);
    }
    else if (!tpl.value) {
        tpl.value = tpl_1.toFun(mod_1.butil.utf8Decode(fileMap[s]), s);
    }
    return tpl;
};
/**
 * @description 加载配置
 * @example
 */
const loadCfg = (cfg, fileMap, widget) => {
    if (Array.isArray(cfg)) {
        let c;
        for (const f of cfg) {
            let config = loadCfg1(f, fileMap, widget);
            if (!config) {
                continue;
            }
            config = config.value;
            if (!config) {
                continue;
            }
            if (!c) {
                c = {};
            }
            for (const k in config) {
                c[k] = config[k];
            }
        }
        return c ? { value: c } : null;
    }
    else {
        return loadCfg1(cfg, fileMap, widget);
    }
};
/**
 * @description 加载配置
 * @example
 */
const loadCfg1 = (cfg, fileMap, widget) => {
    const s = mod_1.butil.relativePath(cfg, widget);
    let config = widget_1.getCache(s);
    if (!config) {
        const data = fileMap[s];
        if (!data) {
            return;
        }
        config = { value: JSON.parse(mod_1.butil.utf8Decode(data)) };
        widget_1.setCache(s, config);
    }
    else if (!config.value) {
        config.value = style_1.parse(mod_1.butil.utf8Decode(fileMap[s]), s);
    }
    return config;
};
/**
 * @description 加载配置
 * @example
 */
const loadWcss = (wcss, fileMap, widget) => {
    if (Array.isArray(wcss)) {
        let sheet;
        for (const f of wcss) {
            let css = loadWcss1(f, fileMap, widget);
            if (!css) {
                continue;
            }
            css = css.value;
            if (!css) {
                continue;
            }
            if (!sheet) {
                sheet = new Map();
            }
            util_1.mapCopy(css, sheet);
        }
        return { value: sheet };
    }
    else {
        return loadWcss1(wcss, fileMap, widget);
    }
};
/**
 * @description 加载样式
 * @example
 */
const loadWcss1 = (wcss, fileMap, widget) => {
    const s = mod_1.butil.relativePath(wcss, widget);
    let css = widget_1.getCache(s);
    if (!css) {
        const data = fileMap[s];
        if (!data) {
            return;
        }
        css = { value: style_1.parse(mod_1.butil.utf8Decode(data), s) };
        widget_1.setCache(s, css);
    }
    else if (!css.value) {
        css.value = style_1.parse(mod_1.butil.utf8Decode(fileMap[s]), s);
    }
    return css;
};
/**
 * @description 调用模块的loadDirCompleted方法
 * @example
 */
const loadDirCompleted = (mod, fileMap) => {
    const func = mod.loadDirCompleted;
    func && func(fileMap);
};
/**
 * @description 标签匹配， 判断模式字符串，是否和标签匹配，标签可以多级
 * @example
 * not($b1) or($b1,$b2) and(or($b1=c1,$b2!=c2), not($b3)) ($b2)
 * 	$b1、$b2表示flag是否含有此键， $b2!=c2表示flag的b2键的值要不等于c2
 */
exports.parseMatch = (pattern, flags) => {
    let s = pattern.str;
    if (s.startsWith('and(')) {
        pattern.str = s.slice(4).trim();
        return parseAnd(pattern, flags);
    }
    if (s.startsWith('or(')) {
        pattern.str = s.slice(3).trim();
        return parseOr(pattern, flags);
    }
    if (s.startsWith('not(')) {
        pattern.str = s.slice(4).trim();
        return parseNot(pattern, flags);
    }
    if (s.startsWith('(')) {
        pattern.str = s.slice(1).trim();
        const r = exports.parseMatch(pattern, flags);
        s = pattern.str;
        if (s.charCodeAt(0) !== 41) { // ")"
            throw new Error('parse error, invalid pattern:' + pattern.str);
        }
        return r;
    }
    return parseEqual(pattern, flags);
};
/**
 * @description 分析not， ")"结束
 * @example
 */
const parseNot = (pattern, flags) => {
    const r = exports.parseMatch(pattern, flags);
    const s = pattern.str;
    if (s.charCodeAt(0) !== 41) { // ")"
        throw new Error('parse error, invalid pattern:' + pattern.str);
    }
    pattern.str = s.slice(1).trim();
    return !r;
};
/**
 * @description 分析or， ","分隔， ")"结束
 * @example
 */
const parseOr = (pattern, flags) => {
    let rr = false;
    // tslint:disable-next-line:no-constant-condition
    while (true) {
        const r = exports.parseMatch(pattern, flags);
        const s = pattern.str;
        if (s.charCodeAt(0) === 44) { // ","
            pattern.str = s.slice(1).trim();
        }
        else if (s.charCodeAt(0) === 41) { // ")"
            pattern.str = s.slice(1).trim();
            return rr || r;
        }
        else {
            throw new Error('parse error, invalid pattern:' + pattern.str);
        }
        rr = rr || r;
    }
};
/**
 * @description 分析and， ","分隔， ")"结束
 * @example
 */
const parseAnd = (pattern, flags) => {
    let rr = true;
    while (true) {
        const r = exports.parseMatch(pattern, flags);
        const s = pattern.str;
        if (s.charCodeAt(0) === 44) { // ","
            pattern.str = s.slice(1).trim();
        }
        else if (s.charCodeAt(0) === 41) { // ")"
            pattern.str = s.slice(1).trim();
            return rr && r;
        }
        else {
            throw new Error('parse error, invalid pattern:' + pattern.str);
        }
        rr = rr && r;
    }
};
/**
 * @description 分析变量， 判断 = != 3种情况
 * @example
 */
const parseEqual = (pattern, flags) => {
    const v1 = parseValue(pattern, flags);
    const s = pattern.str;
    if (s.charCodeAt(0) === 41) { // ")"
        return v1 !== false && v1 !== undefined;
    }
    if (s.charCodeAt(0) === 44) { // ","
        return v1 !== false && v1 !== undefined;
    }
    if (s.charCodeAt(0) === 61) { // "="
        pattern.str = s.slice(1).trim();
        const v2 = parseValue(pattern, flags);
        return v1 === v2;
    }
    if (s.charCodeAt(0) === 33 && s.charCodeAt(1) === 61) { // "!="
        pattern.str = s.slice(2).trim();
        const v2 = parseValue(pattern, flags);
        return v1 !== v2;
    }
    throw new Error('parse error, invalid pattern:' + pattern.str);
};
/**
 * @description 分析值，要么是变量，要么是字面量
 * @example
 */
const parseValue = (pattern, flags) => {
    const s = pattern.str;
    if (s.charCodeAt(0) === 36) { // "$"
        const arr = var_reg.exec(s);
        if (!arr) {
            throw new Error('parse error, invalid pattern:' + pattern.str);
        }
        pattern.str = s.slice(arr[0].length);
        return util_1.getValue(flags, arr[1]);
    }
    let arr = str_reg.exec(s);
    if (arr) {
        pattern.str = s.slice(arr[0].length);
        return arr[1];
    }
    arr = number_reg.exec(s);
    if (!arr) {
        throw new Error('parse error, invalid pattern:' + pattern.str);
    }
    pattern.str = s.slice(arr[0].length);
    return parseFloat(arr[1]);
};
const fileSuffix1 = (file) => {
    const i = file.indexOf(".");
    if (i === -1) {
        return "";
    }
    return file.slice(i, file.length);
};
// 用BlobURL的方式加载的模块，二进制转换字符串及编译，浏览器内核会异步处理
// 创建函数的方式加载，二进制转换字符串及编译，主线程同步处理性能不好
const releaseDefine = (data) => {
    const blob = new Blob([data], { type: "text/javascript" });
    loadJS({ src: URL.createObjectURL(blob), revokeURL: URL.revokeObjectURL });
};
const loadJS = (cfg) => {
    const head = document.head;
    const n = document.createElement('script');
    n.charset = 'utf8';
    n.onerror = (e) => {
        n.onload = n.onerror = undefined;
        head.removeChild(n);
        cfg.revokeURL && cfg.revokeURL(cfg.src);
    };
    n.onload = () => {
        n.onload = n.onerror = undefined;
        head.removeChild(n);
        cfg.revokeURL && cfg.revokeURL(cfg.src);
    };
    n.async = true;
    n.crossorigin = true;
    n.src = cfg.src;
    head.appendChild(n);
};
self._$defineTpl = (name, func) => {
    const path = name + '.tpl';
    const tpl = widget_1.getCache(path);
    if (!tpl) {
        throw new Error(`tpl names ${name} not found`);
    }
    let notFound = true;
    for (let i = 0; i < tplWait.length; i++) {
        const f = tplWait[i];
        if (f.map.delete(path)) {
            notFound = false;
            f.processCallback && f.processCallback({
                type: 'defineTpl',
                total: f.total,
                curr: f.total - f.map.size
            });
            // 编译
            if (!tpl.value) {
                tpl.value = tpl_1.toFunComplete(func, name);
            }
            f.processCallback && f.processCallback({
                type: 'buildTpl',
                total: f.total,
                curr: f.total - f.map.size
            });
            if (f.map.size === 0) {
                f.successCallback && f.successCallback();
                tplWait.splice(i--, 1);
            }
        }
    }
    if (notFound) {
        console.error(`${name} not found in tplWait`);
    }
};
// ============================== 立即执行
});
