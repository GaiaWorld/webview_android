_$define("pi/util/userAgent", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @description 获得浏览器的userAgent
 * @example
 */
// tslint:disable-next-line:cyclomatic-complexity
exports.userAgent = (r) => {
    const ua = navigator.userAgent.toLowerCase();
    r = r || {};
    const nameVersion = (obj, name, rxp) => {
        const arr = ua.match(rxp);
        if (!arr) {
            return;
        }
        obj.version = arr[1];
        obj.name = name;
        return true;
    };
    const cfg = {
        chrome: null,
        msie: 'ie',
        firefox: null,
        opr: 'opera',
        micromessenger: null,
        mqqbrowser: null,
        ucbrowser: null
    };
    // 解析ua中的browser信息
    r.browser = { name: 'unknown', version: '0.0' };
    if (ua.indexOf('safari') > -1) {
        if (ua.indexOf('mobile') > -1) {
            if (nameVersion(r.browser, 'safari', /version\/([\d.]+)/)) {
                r.browser.safari = r.browser.version;
            }
        }
        else {
            if (nameVersion(r.browser, 'safari', /safari\/([\d.]+)/)) {
                r.browser.safari = r.browser.version;
            }
        }
    }
    for (const k in cfg) {
        if (!cfg.hasOwnProperty(k)) {
            continue;
        }
        const i = ua.indexOf(k);
        if (i < 0) {
            continue;
        }
        let name = cfg[k];
        name = name || k;
        if (nameVersion(r.browser, name, new RegExp(k + '\/([\\d.]+)'))) {
            r.browser[name] = r.browser.version;
        }
    }
    // 解析ua中的engine信息
    r.engine = { name: 'unknown', version: '0.0' };
    if (ua.indexOf('trident') > -1) {
        nameVersion(r.engine, 'trident', /trident\/([\d.]+)/);
    }
    else if (ua.indexOf('applewebkit') > -1) {
        nameVersion(r.engine, 'webkit', /applewebkit\/([\d.]+)/);
    }
    else if (ua.indexOf('gecko') > -1) {
        nameVersion(r.engine, 'gecko', /gecko\/([\d.]+)/);
    }
    // 解析ua中的os信息
    r.os = r.os || { name: 'unknown', version: '0.0' };
    if (ua.indexOf('windows nt') > -1) {
        nameVersion(r.os, 'windows', /windows nt ([\d.]+)/);
        if (r.os.version === '6.1') {
            r.os.version = '7';
        }
        else if (r.os.version === '6.2') {
            r.os.version = '8';
        }
    }
    else if (ua.indexOf('iphone os') > -1) {
        nameVersion(r.os, 'ios', /iphone os ([\d_]+)/);
        r.os.version = r.os.version.split('_').join('.');
    }
    else if (ua.indexOf('android') > -1) {
        nameVersion(r.os, 'android', /android ([\d.]+)/);
    }
    // r.screen = { colorDepth: screen.colorDepth };
    // if (screen.height > screen.width) {
    //     r.screen.height = screen.height;
    //     r.screen.width = screen.width;
    // } else {
    //     r.screen.height = screen.width;
    //     r.screen.width = screen.height;
    // }
    r.timezone_offset = new Date().getTimezoneOffset();
    r.language = navigator.language;
    r.device = { type: (ua.indexOf('mobile') > -1) ? 'mobile' : 'pc', platform: navigator.platform };
    // 标签化
    if (r.mobile === undefined) {
        r.mobile = r.device.type === 'mobile';
    }
    return r;
};
});
