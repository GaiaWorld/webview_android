_$define("pi/util/util", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 空回调函数，返回第一个参数
exports.EmptyFunc = (arg, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) => arg;
/**
 * @description 判断参数是否为字符串
 * @example
 */
exports.isString = (str) => {
    return (typeof str === 'string');
};
/**
 * @description 判断参数是否为数字
 * @example
 */
exports.isNumber = (num) => {
    return (typeof num === 'number');
};
/**
 * @description 判断参数是否为boolean
 * @example
 */
exports.isBoolean = (bool) => {
    return (typeof bool === 'boolean');
};
exports.isPrimaryDataType = (data) => {
    return data === null || data === undefined || exports.isString(data) || exports.isNumber(data) || exports.isBoolean(data);
};
exports.ObjToPrimaryData = (data) => {
    // tslint:disable:variable-name
    const _data = {};
    for (const key in data) {
        if (exports.isString(data[key])) {
            _data[key] = data[key];
        }
        else {
            _data[key] = JSON.stringify(data[key]);
        }
    }
    return _data;
};
/**
 * @description 返回字符串
 * @example
 */
exports.toString = (o) => {
    if (o === undefined || o === null) {
        return o;
    }
    const t = typeof o;
    if (t === 'boolean' || t === 'number' || t === 'string' || t === 'function') {
        return o;
    }
    try {
        return JSON.stringify(o);
    }
    catch (e) {
        // tslint:disable:prefer-template
        return '' + o;
    }
};
/**
 * @description 比较2个Obj, 跳过所有_$开头的键， 值为undefined表示没有该键， 用===直接比较值。返回相同键的数量。先遍历长的，如果短的键都被长的覆盖，则不需要遍历短的
 * @example
 */
// tslint:disable-next-line:cyclomatic-complexity
exports.objDiff = (obj1, objSize1, obj2, objSize2, cb, args) => {
    let c = 0;
    if (objSize1 < objSize2) {
        for (const k in obj2) {
            if (k.charCodeAt(0) === 95 && k.charCodeAt(0) === 36) {
                continue;
            }
            const v1 = obj1[k];
            if (v1 !== undefined) {
                c++;
                const v2 = obj2[k];
                if (v1 !== v2) {
                    cb(args, k, v1, v2);
                }
            }
            else {
                cb(args, k, v1, obj2[k]);
            }
        }
        if (c < objSize1) {
            for (const k in obj1) {
                if (k.charCodeAt(0) === 95 && k.charCodeAt(0) === 36) {
                    continue;
                }
                const v2 = obj2[k];
                if (v2 === undefined) {
                    cb(args, k, obj1[k], v2);
                }
            }
        }
    }
    else {
        for (const k in obj1) {
            if (k.charCodeAt(0) === 95 && k.charCodeAt(0) === 36) {
                continue;
            }
            const v2 = obj2[k];
            if (v2 !== undefined) {
                c++;
                const v1 = obj1[k];
                if (v1 !== v2) {
                    cb(args, k, v1, v2);
                }
            }
            else {
                cb(args, k, obj1[k], v2);
            }
        }
        if (c < objSize2) {
            for (const k in obj2) {
                if (k.charCodeAt(0) === 95 && k.charCodeAt(0) === 36) {
                    continue;
                }
                const v1 = obj1[k];
                if (v1 === undefined) {
                    cb(args, k, v1, obj2[k]);
                }
            }
        }
    }
    return c;
};
/**
 * @description 比较2个Map， 值为undefined表示没有该键， 用===直接比较值。返回相同键的数量。先遍历长的，如果短的键都被长的覆盖，则不需要遍历短的
 * @example
 */
exports.mapDiff = (map1, map2, cb, args) => {
    let c = 0;
    if (map1.size < map2.size) {
        for (const [k, v2] of map2) {
            const v1 = map1.get(k);
            if (v1 !== undefined) {
                c++;
                if (v1 !== v2) {
                    cb(args, k, v1, v2);
                }
            }
            else {
                cb(args, k, v1, v2);
            }
        }
        if (c < map1.size) {
            for (const [k, v1] of map1) {
                const v2 = map2.get(k);
                if (v2 === undefined) {
                    cb(args, k, v1, v2);
                }
            }
        }
    }
    else {
        for (const [k, v1] of map1) {
            const v2 = map2.get(k);
            if (v2 !== undefined) {
                c++;
                if (v1 !== v2) {
                    cb(args, k, v1, v2);
                }
            }
            else {
                cb(args, k, v1, v2);
            }
        }
        if (c < map2.size) {
            for (const [k, v2] of map2) {
                const v1 = map1.get(k);
                if (v1 === undefined) {
                    cb(args, k, v1, v2);
                }
            }
        }
    }
    return c;
};
/**
 * @description 函数调用
 * @example
 */
exports.call = (func, args) => {
    if (Array.isArray(args)) {
        switch (args.length) {
            case 0:
                return func();
            case 1:
                return func(args[0]);
            case 2:
                return func(args[0], args[1]);
            case 3:
                return func(args[0], args[1], args[2]);
            case 4:
                return func(args[0], args[1], args[2], args[3]);
            case 5:
                return func(args[0], args[1], args[2], args[3], args[4]);
            case 6:
                return func(args[0], args[1], args[2], args[3], args[4], args[5]);
            case 7:
                return func(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
            case 8:
                return func(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7]);
            default:
                func.apply(undefined, args);
        }
    }
    else {
        return func(args);
    }
};
/**
 * @description 对象方法调用
 * @example
 */
exports.objCall = (obj, func, args) => {
    if (Array.isArray(args)) {
        switch (args.length) {
            case 0:
                return obj[func]();
            case 1:
                return obj[func](args[0]);
            case 2:
                return obj[func](args[0], args[1]);
            case 3:
                return obj[func](args[0], args[1], args[2]);
            case 4:
                return obj[func](args[0], args[1], args[2], args[3]);
            case 5:
                return obj[func](args[0], args[1], args[2], args[3], args[4]);
            case 6:
                return obj[func](args[0], args[1], args[2], args[3], args[4], args[5]);
            case 7:
                return obj[func](args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
            case 8:
                return obj[func](args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7]);
            default:
                obj[func].apply(obj, args);
        }
    }
    else {
        return obj[func](args);
    }
};
/**
 * @description 获得任意对象的深度Copy, 不支持循环引用
 * @example
 */
exports.deepCopy = (v) => {
    if (v === undefined || v === null) {
        return v;
    }
    const t = typeof v;
    if (t === 'boolean' || t === 'number' || t === 'string' || t === 'function') {
        return v;
    }
    if (v instanceof ArrayBuffer) {
        return v.slice(0);
    }
    if (ArrayBuffer.isView(v) && v.BYTES_PER_ELEMENT > 0) {
        return v.slice(0);
    }
    return JSON.parse(JSON.stringify(v));
};
/**
 * @description 复制Map
 * @example
 */
exports.mapCopy = (src, dst) => {
    for (const [k, v] of src) {
        dst.set(k, v);
    }
    return dst;
};
/**
 * @description 根据指定的键路径，获得对象的值。键可以多层，数组或字符串，字符串默认用"."分隔
 * @example
 */
exports.getValue = (obj, path, split) => {
    if (typeof path === 'string') {
        split = split || '.';
        let i = path.indexOf(split);
        let j = 0;
        while (i > j) {
            const k = path.slice(j, i);
            const v = obj[k];
            if (v === undefined) {
                return undefined;
            }
            if (v === null) {
                return null;
            }
            obj = v;
            j = i + 1;
            i = path.indexOf(split, j);
        }
        if (j > 0) {
            path = path.slice(j);
        }
        return obj[path];
    }
    for (const k of path) {
        const v = obj[k];
        if (v === undefined) {
            return undefined;
        }
        if (v === null) {
            return null;
        }
        obj = v;
    }
    return obj;
};
/**
 * @description 根据指定的键路径，设置对象的值，层次更新值。键可以多层，数组或字符串，字符串默认用"."分隔。如果键是数字1-9开头，则认为是数组。 返回旧值
 * @example
 */
exports.setValue = (obj, path, value, split) => {
    let old;
    if (typeof path === 'string') {
        split = split || '.';
        let i = path.indexOf(split);
        let j = 0;
        while (i > j) {
            const k = path.slice(j, i);
            old = obj[k];
            if (!old) {
                // 如果键是数字1-9开头，则认为应该生成数组
                const c = path.charCodeAt(i + 1);
                obj[k] = old = (c > 57 || c < 49) ? {} : [];
            }
            obj = old;
            j = i + 1;
            i = path.indexOf(split, j);
        }
        if (j > 0) {
            path = path.slice(j);
        }
        old = obj[path];
        obj[path] = value;
        return old;
    }
    let i = 0;
    for (const len = path.length - 1; i < len; i++) {
        const k = path[i];
        old = obj[k];
        if (!old) {
            // 如果键是数字
            obj[k] = old = Number.isInteger(k) ? [] : {};
        }
        obj = old;
    }
    const k = path[i];
    old = obj[k];
    obj[k] = value;
    return old;
};
/**
 * @description utf8的Uint8Array解码成字符串
 * @example
 */
exports.utf8Decode = ((self !== undefined) && self.TextDecoder) ? (() => {
    const decoder = new TextDecoder('utf-8');
    return (arr) => {
        if ((!arr) || arr.byteLength === 0) {
            return '';
        }
        if (arr instanceof ArrayBuffer) {
            arr = new Uint8Array(arr);
        }
        return decoder.decode(arr);
    };
})() : (arr) => {
    if ((!arr) || arr.byteLength === 0) {
        return '';
    }
    if (arr instanceof ArrayBuffer) {
        arr = new Uint8Array(arr);
    }
    let c;
    let out = '';
    let i = 0;
    const len = arr.length;
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
            // tslint:disable:max-line-length
            out += String.fromCharCode((((c & 0x03) << 24) | ((arr[i++] & 0x3F) << 18) | ((arr[i++] & 0x3F) << 12) | ((arr[i++] & 0x3F) << 6) | (arr[i++] & 0x3F)));
        }
        else if (c < 0xFE && i + 4 < len) {
            out += String.fromCharCode((((c & 0x01) << 30) | ((arr[i++] & 0x3F) << 24) | ((arr[i++] & 0x3F) << 18) | ((arr[i++] & 0x3F) << 12) | ((arr[i++] & 0x3F) << 6) | (arr[i++] & 0x3F)));
        }
        else {
            throw new Error('invalid utf8');
        }
    }
    return out;
};
/**
 * @description 字符串编码成utf8的Uint8Array
 * @example
 */
exports.utf8Encode = ((self !== undefined) && self.TextDecoder) ? (() => {
    const encoder = new TextEncoder('utf-8');
    return (s) => {
        return (s && s.length > 0) ? encoder.encode(s) : null;
    };
})() : (s) => {
    if ((!s) || s.length === 0) {
        return null;
    }
    return null;
};
/**
 * @description 将字符串解析成json，可以执行运算，可以加注释，obj的键可以不用引号引起来。必须使用缓冲，因为该函数对象v8中不会释放。
 * @note return的两边加上圆括号，是为了让s有空行（因为js引擎的自动加分号机制）和开头的注释时候也能生效
 * @example
 */
exports.toJson = (s) => {
    // tslint:disable:no-function-constructor-with-string-args
    return (new Function('return (' + s + ')'))();
};
/**
 * @description 获得指定模块的导出变量上，指定类型（包括父类型）的函数
 * @example
 */
exports.getExport = (mod, func, funcArgs) => {
    let k;
    let v;
    const exports = mod.exports;
    for (k in exports) {
        if (exports.hasOwnProperty(k)) {
            v = exports[k];
            if (func(v, funcArgs)) {
                return v;
            }
        }
    }
};
/**
 * @description 获得指定模块的导出变量上，指定类型（包括父类型）的函数
 * @example
 */
exports.getExportFunc = (mod, func, funcArgs) => {
    let k;
    let v;
    const exports = mod.exports;
    for (k in exports) {
        if (exports.hasOwnProperty(k)) {
            v = exports[k];
            if (func(v, funcArgs)) {
                return () => exports[k];
            }
        }
    }
};
/**
 * @description 检查对象是否为指定类型或其子类型
 * @example
 */
exports.checkType = (obj, typeClass) => {
    return obj.prototype && typeClass.isPrototypeOf(obj);
};
/**
 * @description 检查对象是否为指定类型或其子类型的实例
 * @example
 */
exports.checkInstance = (obj, typeClass) => {
    return obj instanceof typeClass;
};
/**
 * @description 数组去重
 * @example
 */
exports.unique = (arr) => {
    return Array.from(new Set(arr));
};
/**
 * @description 判断两个数组是否相等
 * @example
 */
exports.arrayEqual = (oldArr, newArr) => {
    if (oldArr === newArr) {
        return true;
    }
    if (oldArr.length !== newArr.length) {
        return false;
    }
    for (let i = oldArr.length - 1; i >= 0; i--) {
        if (oldArr[i] !== newArr[i]) {
            return false;
        }
    }
    return true;
};
/**
 * @description 数组删除子元素，将最后一个元素放到删除的位置上
 * @example
 */
exports.arrDrop = (arr, el) => {
    const i = arr.indexOf(el);
    if (i < 0) {
        return -1;
    }
    const len = arr.length - 1;
    if (i < len) {
        arr[i] = arr[len];
    }
    arr.length = len;
    return i;
};
/**
 * 设置数组指定位置的元素，不改变原数组，返回拷贝后的数组
 */
exports.arrSet = (arr, el, i) => {
    if (i < 0) {
        return arr;
    }
    if (i < arr.length) {
        const a = arr.slice();
        a[i] = el;
        return a;
    }
    return arr;
};
/**
 * 设置数组指定位置的元素，不改变原数组，返回拷贝后的数组，
 * 如果没有位置i或超过数组长度，则添加在尾部，i为负数或0表示添加在头部
 */
exports.arrInsert = (arr, el, i) => {
    const a = arr.slice();
    if (i === undefined) {
        a.push(el);
    }
    else if (i <= 0) {
        a.unshift(el);
    }
    else if (i < a.length) {
        a.splice(i, 0, el);
    }
    else {
        a.push(el);
    }
    return a;
};
/**
 * 删除数组指定位置的元素，不改变原数组，返回拷贝后的数组
 */
exports.arrDelete = (arr, i) => {
    if (i < 0) {
        return arr;
    }
    if (i === 0) {
        return arr.slice(1, arr.length);
    }
    if (i < arr.length - 1) {
        const a = arr.slice();
        a.splice(i, 1);
        return a;
    }
    if (i === arr.length - 1) {
        return arr.slice(0, arr.length - 1);
    }
    return arr;
};
/**
 * 删除元素
 */
exports.arrRemove = (arr, el) => {
    const i = arr.indexOf(el);
    if (i < 0) {
        return arr;
    }
    if (i === 0) {
        return arr.slice(1, arr.length);
    }
    if (i < arr.length - 1) {
        const a = arr.slice();
        a.splice(i, 1);
        return a;
    }
    return arr.slice(0, arr.length - 1);
};
/**
 * 首字母转为大写
 */
exports.upperFirst = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1, str.length);
};
exports.ab2hex = (buffer) => {
    var hexArr = Array.prototype.map.call(buffer, function (bit) {
        return ('00' + bit.toString(16)).slice(-2);
    });
    return hexArr.join('');
};
});
