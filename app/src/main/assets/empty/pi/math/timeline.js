_$define("pi/math/timeline", function (require, exports, module){
"use strict";
/*
 * 时间线函数

 */
Object.defineProperty(exports, "__esModule", { value: true });
// ============================== 导入
const math_1 = require("../util/math");
// ============================== 导出
/**
 * @description  线性折线
 * @example
 */
exports.linear = (k, v) => {
    const m = v.length - 1;
    if (k <= 0) {
        return v[0];
    }
    if (k >= 1) {
        return v[m];
    }
    const f = m * k;
    const i = Math.floor(f);
    return math_1.linear(f - i, v[i], v[i + 1 > m ? m : i + 1]);
};
/**
 * @description  n阶贝塞尔曲线
 * @example
 */
exports.bezier = (k, v) => {
    let b = 0;
    const pw = Math.pow;
    for (let i = 0, n = v.length - 1; i <= n; i++) {
        b += pw(1 - k, n - i) * pw(k, i) * v[i] * math_1.bernstein(i, n);
    }
    return b;
};
/**
 * @description  Catmull-Rom 样条曲线
 * @example
 */
exports.catmullRom = (k, v) => {
    const m = v.length - 1;
    if (v[0] === v[m]) {
        if (k <= 0) {
            return v[m - 1];
        }
        if (k >= 1) {
            return v[0];
        }
        const f = m * k;
        const i = Math.floor(f);
        return math_1.catmullRom(f - i, v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m]);
    }
    if (k <= 0) {
        return v[0];
    }
    if (k >= 1) {
        return v[m];
    }
    const f = m * k;
    const i = Math.floor(f);
    return math_1.catmullRom(f - i, v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2]);
};
// ============================== 本地
});
