_$define("pi/util/base64", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * base64字符串转ArrayBuffer
 * @param base64 base64格式的字符串
 * @return ArrayBuffer
 */
exports.base64ToArrayBuffer = (base64) => {
    // tslint:disable-next-line:no-reserved-keywords
    let isPC = navigator.userAgent.indexOf("JSVM") > 0 ? false : true;
    if (isPC) {
        const string = window.atob(base64);
        const bytes = new Uint8Array(string.length);
        for (let i = 0; i < string.length; i++) {
            bytes[i] = string.charCodeAt(i);
        }
        return bytes.buffer;
    }
    else {
        var us = base64js.toByteArray(base64);
        return us.buffer;
    }
};
/**
 * ArrayBuffer转base64字符串
 * @return string base64格式的字符串
 */
exports.arrayBufferToBase64 = (buffer) => {
    let isPC = navigator.userAgent.indexOf("JSVM") > 0 ? false : true;
    if (isPC) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.length;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }
    else {
        var u8 = new Uint8Array(buffer);
        return base64js.fromByteArray(u8);
    }
};
});
