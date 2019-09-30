_$define("pi/bigint/util", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bigInt = require("./biginteger");
//将大整数转化为ArrayBuffer
exports.u64ToBuffer = (n, littleEnd) => {
    var i = 0;
    if (littleEnd) {
        let arr = new Uint32Array(2); //小端序
        while (!n.isZero()) {
            var r = n.divmod(4294967296);
            arr[i] = r.remainder.value;
            n = r.quotient;
            i++;
        }
        return new Uint8Array(arr.buffer);
    }
    else {
        let buf = new ArrayBuffer(8);
        let view = new DataView(buf);
        while (!n.isZero()) {
            var r = n.divmod(4294967296);
            view.setUint32(i * 4, r.remainder.value);
            n = r.quotient;
            i++;
        }
        return new Uint8Array(buf);
    }
};
//将大整数转化为ArrayBuffer
exports.u128ToBuffer = (n, littleEnd) => {
    var i = 0;
    if (littleEnd) {
        let arr = new Uint32Array(4); //小端序
        while (!n.isZero()) {
            var r = n.divmod(4294967296);
            arr[i] = r.remainder.value;
            n = r.quotient;
            i++;
        }
        return new Uint8Array(arr.buffer);
    }
    else {
        let buf = new ArrayBuffer(16);
        let view = new DataView(buf);
        while (!n.isZero()) {
            var r = n.divmod(4294967296);
            view.setUint32(i * 4, r.remainder.value);
            n = r.quotient;
            i++;
        }
        return new Uint8Array(buf);
    }
};
exports.bufferToU64 = (buf, littleEnd) => {
    var i = 0;
    if (littleEnd) {
        let arr = new Uint32Array(buf.buffer); //小端序
        return bigInt(arr[1]).multiply(0x100000000).add(bigInt(arr[0]));
    }
    else {
        let view = new DataView(buf.buffer);
        return bigInt(view.getUint32(0)).multiply(bigInt(0x100000000)).add(bigInt(view.getUint32(1)));
    }
};
exports.bufferToU128 = (buf, littleEnd) => {
    var i = 0;
    if (littleEnd) {
        let arr = new Uint32Array(buf.buffer); //小端序
        return bigInt(arr[3]).multiply(bigInt("79228162514264337593543950336").add(bigInt(arr[2]).multiply(bigInt("18446744073709551616")))).add(bigInt(arr[1]).multiply(bigInt("0x100000000"))).add(bigInt(arr[0]));
    }
    else {
        let view = new DataView(buf.buffer);
        return bigInt(view.getUint32(0)).multiply(bigInt("79228162514264337593543950336").add(bigInt(view.getUint32(1)).multiply(bigInt("18446744073709551616")))).add(bigInt(view.getUint32(2)).multiply(bigInt("0x100000000"))).add(bigInt(view.getUint32(3)));
    }
};
exports.u64Unwrap = (v) => {
    if (typeof v.value === "number" && v.value <= 9007199254740991) {
        return v.value;
    }
    else {
        return exports.u64ToBuffer(v, true);
    }
};
exports.u128Unwrap = (v) => {
    if (typeof v.value === "number" && v.value <= 9007199254740991) {
        return v.value;
    }
    else {
        return exports.u128ToBuffer(v, true);
    }
};
exports.u64Merge = (v) => {
    if (typeof v === "number") {
        return bigInt(v);
    }
    else {
        return exports.bufferToU64(v, true);
    }
};
exports.u128Merge = (v) => {
    if (typeof v === "number") {
        return bigInt(v);
    }
    else {
        return exports.bufferToU128(v, true);
    }
};
class BigU64 {
    constructor(v) {
        this.big = exports.u64Merge(v);
    }
}
exports.BigU64 = BigU64;
class BigU128 {
    constructor(v) {
        this.big = exports.u128Merge(v);
    }
}
exports.BigU128 = BigU128;
});
