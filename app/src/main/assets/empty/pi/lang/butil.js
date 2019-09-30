_$define("pi/lang/butil", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.utf8Decode = (arr) => {
    if ((!arr) || arr.byteLength === 0)
        return "";
    if (arr instanceof ArrayBuffer)
        arr = new Uint8Array(arr);
    var c, out = "", i = 0, len = arr.length;
    while (i < len) {
        c = arr[i++];
        if (c < 128) {
            out += String.fromCharCode(c);
        }
        else if (c < 0xE0 && i < len) {
            out += String.fromCharCode(((c & 0x1F) << 6) | (arr[i++] & 0x3F));
        }
        else if (c < 0xF0 && i + 1 < len) {
            out += String.fromCharCode((((c & 0x0F) << 12) | ((arr[i++] & 0x3F) << 6) | (arr[i++] & 0x3F)));
        }
        else if (c < 0xF8 && i + 2 < len) {
            out += String.fromCharCode((((c & 0x07) << 18) | ((arr[i++] & 0x3F) << 12) | ((arr[i++] & 0x3F) << 6) | (arr[i++] & 0x3F)));
        }
        else if (c < 0xFC && i + 3 < len) {
            out += String.fromCharCode((((c & 0x03) << 24) | ((arr[i++] & 0x3F) << 18) | ((arr[i++] & 0x3F) << 12) | ((arr[i++] & 0x3F) << 6) | (arr[i++] & 0x3F)));
        }
        else if (c < 0xFE && i + 4 < len) {
            out += String.fromCharCode((((c & 0x01) << 30) | ((arr[i++] & 0x3F) << 24) | ((arr[i++] & 0x3F) << 18) | ((arr[i++] & 0x3F) << 12) | ((arr[i++] & 0x3F) << 6) | (arr[i++] & 0x3F)));
        }
        else
            throw new Error("invalid utf8");
    }
    return out;
};
});
