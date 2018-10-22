_$define("pi/util/bon", function (require, exports, module){
"use strict";
// 二进制对象表示法 模块
// Binary Object Notation

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
/**
 * @description 二进制数据缓存
 * @example
 */

var BonBuffer = function () {
    function BonBuffer(data, head, tail) {
        _classCallCheck(this, BonBuffer);

        if (!data || Number.isInteger(data)) {
            this.u8 = new Uint8Array(new ArrayBuffer(data || 32));
            this.view = new DataView(this.u8.buffer);
            this.head = 0;
            this.tail = 0;
        } else {
            this.u8 = data;
            this.view = new DataView(this.u8.buffer, this.u8.byteOffset, this.u8.byteLength);
            this.head = head || 0;
            this.tail = tail || this.u8.length;
        }
    }
    /**
     * @description 设置容量
     * @example
     */


    _createClass(BonBuffer, [{
        key: "setCapity",
        value: function setCapity(len) {
            if (this.tail > len) return;
            var u8 = new Uint8Array(len);
            u8.set(this.u8);
            this.u8 = u8;
            this.view = new DataView(u8.buffer);
        }
        /**
         * @description 扩大容量
         * @example
         */

    }, {
        key: "extendCapity",
        value: function extendCapity(len) {
            len = len + this.view.byteLength + 1;
            len *= factor;
            this.setCapity(len);
        }
        /**
         * @description 获得当前写入的数据
         * @example
         */

    }, {
        key: "getBuffer",
        value: function getBuffer() {
            return new Uint8Array(this.u8.buffer, this.u8.byteOffset + this.head, this.tail - this.head);
        }
        /**
         * @description 清空
         * @example
         */

    }, {
        key: "clear",
        value: function clear() {
            this.head = this.tail = 0;
        }
        /**
         * @description 写入任意类型
         * @example
         */

    }, {
        key: "write",
        value: function write(v) {
            var _this = this;

            if (v === undefined || v === null) return this.writeNil();
            var t = typeof v === "undefined" ? "undefined" : _typeof(v);
            if (t === 'number') return Number.isInteger(v) ? this.writeInt(v) : this.writeF64(v);
            if (t === "string") return this.writeUtf8(v);
            if (t === "boolean") return this.writeBool(v);
            if (v instanceof ArrayBuffer) return this.writeBin(new Uint8Array(v));
            if (ArrayBuffer.isView(v) && v.BYTES_PER_ELEMENT > 0) return this.writeBin(new Uint8Array(v.buffer, v.byteOffset, v.byteLength));
            if (Object.prototype.toString.call(v) == '[object Array]') return this.writeArray(v, function (el) {
                _this.write(el);
            });
            if (v instanceof Map) return this.writeMap(v, function (k, v) {
                _this.write(k);
                _this.write(v);
            });
            if (v.bonEncode) return this.writeBonCode(v);
            throw new Error("The serialization of this type is not supported");
        }
        /**
         * @description 写入U8
         * @example
         */

    }, {
        key: "writeU8",
        value: function writeU8(v) {
            if (this.tail + 1 > this.view.byteLength) this.extendCapity(1);
            this.view.setUint8(this.tail++, v);
            return this;
        }
        /**
         * @description 写入U16
         * @example
         */

    }, {
        key: "writeU16",
        value: function writeU16(v) {
            if (this.tail + 2 > this.view.byteLength) this.extendCapity(2);
            this.view.setUint16(this.tail++, v, true);
            this.tail += 2;
            return this;
        }
        /**
         * @description 写入U32
         * @example
         */

    }, {
        key: "writeU32",
        value: function writeU32(v) {
            if (this.tail + 4 > this.view.byteLength) this.extendCapity(4);
            this.view.setUint32(this.tail, v, true);
            this.tail += 4;
            return this;
        }
        /**
         * @description 写大整数, ArrayBuffer应该是一个小端序
         * @example
         */

    }, {
        key: "writeBigInt",
        value: function writeBigInt(v) {
            if (typeof v === "number") {
                this.writeInt(v);
            } else if (v.byteLength === 8) {
                if (this.tail + 9 > this.view.byteLength) this.extendCapity(9);
                this.view.setUint8(this.tail, 40);
                this.u8.set(v, this.tail + 1);
                this.tail += 9;
            } else if (v.byteLength === 17) {
                if (this.tail + 17 > this.view.byteLength) this.extendCapity(17);
                this.view.setUint8(this.tail, 41);
                this.u8.set(v, this.tail + 1);
                this.tail += 17;
            }
            return this;
        }
        /**
         * @description 写入一个基本类型
         * @example
         */

    }, {
        key: "writeBase",
        value: function writeBase(v) {
            if (v === undefined || v === null) return this.writeNil();
            var t = typeof v === "undefined" ? "undefined" : _typeof(v);
            if (t === 'number') return Number.isInteger(v) ? this.writeInt(v) : this.writeF64(v);
            if (t === "string") return this.writeUtf8(v);
            if (t === "boolean") return this.writeBool(v);
            if (v instanceof ArrayBuffer) return this.writeBin(new Uint8Array(v));
            if (ArrayBuffer.isView(v) && v.BYTES_PER_ELEMENT > 0) return this.writeBin(new Uint8Array(v.buffer, v.byteOffset, v.byteLength));
        }
        /**
         * @description 写入一个空
         * @example
         */

    }, {
        key: "writeNil",
        value: function writeNil() {
            if (this.tail >= this.view.byteLength) this.extendCapity(1);
            this.view.setUint8(this.tail++, 0);
            return this;
        }
        /**
         * @description 写入一个布尔值
         * @example
         */

    }, {
        key: "writeBool",
        value: function writeBool(b) {
            if (this.tail >= this.view.byteLength) this.extendCapity(1);
            this.view.setUint8(this.tail++, b === true ? 2 : 1);
            return this;
        }
        /**
         * @description 写入一个整数
         * @example
         */

    }, {
        key: "writeInt",
        value: function writeInt(v) {
            if (v >= -1 && v < 20) {
                if (this.tail >= this.view.byteLength) this.extendCapity(1);
                this.view.setUint8(this.tail++, v + 16);
                return this;
            }
            var i = 0;
            if (v < 0) {
                v = -v;
                i = 27;
            }
            if (v <= 0xFF) {
                if (this.tail + 2 > this.view.byteLength) this.extendCapity(2);
                this.view.setUint8(this.tail++, 36 - i);
                this.view.setUint8(this.tail++, v);
            } else if (v <= 0xFFFF) {
                if (this.tail + 3 > this.view.byteLength) this.extendCapity(3);
                this.view.setUint8(this.tail++, 37 - i);
                this.view.setUint16(this.tail, v, true);
                this.tail += 2;
            } else if (v <= 0xFFFFFFFF) {
                if (this.tail + 5 > this.view.byteLength) this.extendCapity(5);
                this.view.setUint8(this.tail++, 38 - i);
                this.view.setUint32(this.tail, v, true);
                this.tail += 4;
            } else if (v <= 0xFFFFFFFFFFFF) {
                if (this.tail + 7 > this.view.byteLength) this.extendCapity(7);
                this.view.setUint8(this.tail++, 39 - i);
                this.view.setUint16(this.tail, v & 0xffff, true);
                this.view.setUint32(this.tail + 2, Math.floor(v / 0x10000), true);
                this.tail += 6;
            } else if (v < 9007199254740992) {
                if (this.tail + 9 > this.view.byteLength) this.extendCapity(7);
                this.view.setUint8(this.tail++, 40 - i);
                this.view.setUint32(this.tail, v & 0xffffffff, true);
                this.view.setUint32(this.tail + 4, Math.floor(v / 0x100000000), true);
                this.tail += 8;
            } else {
                throw new Error("this is a bigInteger, can not write as number:" + v);
                // if (this.tail + 9 > this.view.byteLength)
                // 	this.extendCapity(9);
                // // js里不会出现这种情况，最大安全整数只有 55位 9007199254740991
                // this.view.setInt8(this.tail++, 34 - i);
                // this.view.setUint32(this.tail, v & 0xffffffff, true);
                // this.view.setUint32(this.tail + 4, Math.floor(v / 0x100000000), true);
                // this.tail += 8;
            }
            return this;
        }
        /**
         * @description 写入F32
         * @example
         */

    }, {
        key: "writeF32",
        value: function writeF32(v) {
            if (v === 0.0) {
                if (this.tail >= this.view.byteLength) this.extendCapity(1);
                this.view.setUint8(this.tail++, 3);
                return this;
            }
            if (v === 1.0) {
                if (this.tail >= this.view.byteLength) this.extendCapity(1);
                this.view.setUint8(this.tail++, 4);
                return this;
            }
            if (this.tail + 5 > this.view.byteLength) this.extendCapity(5);
            this.view.setInt8(this.tail++, 6);
            this.view.setFloat32(this.tail, v, true);
            this.tail += 4;
            return this;
        }
        /**
         * @description 写入F64
         * @example
         */

    }, {
        key: "writeF64",
        value: function writeF64(v) {
            if (v === 0.0) {
                if (this.tail >= this.view.byteLength) this.extendCapity(1);
                this.view.setUint8(this.tail++, 3);
                return this;
            }
            if (v === 1.0) {
                if (this.tail >= this.view.byteLength) this.extendCapity(1);
                this.view.setUint8(this.tail++, 4);
                return this;
            }
            if (this.tail + 9 > this.view.byteLength) this.extendCapity(9);
            this.view.setInt8(this.tail++, 7);
            this.view.setFloat64(this.tail, v, true);
            this.tail += 8;
            return this;
        }
        /**
         * @description 写入二进制数据
         * @example
         */

    }, {
        key: "writeBin",
        value: function writeBin(arr, offset, length) {
            return this.writeData(arr, 111, offset, length);
        }
        /**
         * @description 写入BonBuffer的二进制数据
         * @example
         */

    }, {
        key: "writeBon",
        value: function writeBon(arr) {
            this.extendCapity(arr.length);
            this.u8.set(arr, this.tail);
            this.tail += arr.length;
            return this;
        }
        /**
         * @description 写入字符串，用utf8格式
         * @example
         */

    }, {
        key: "writeUtf8",
        value: function writeUtf8(s) {
            var arr = util_1.utf8Encode(s);
            return this.writeData(arr, 42);
        }
        /**
         * @description 写map
         * @example
         */

    }, {
        key: "writeMap",
        value: function writeMap(map, callbackfn) {
            this.writeInt(map.size);
            map.forEach(function (v, k) {
                callbackfn(k, v);
            });
            return this;
        }
        /**
         * @description 写array
         * @example
         */

    }, {
        key: "writeArray",
        value: function writeArray(array, callbackfn) {
            this.writeInt(array.length);
            for (var i = 0; i < array.length; i++) {
                callbackfn(array[i]);
            }
            return this;
        }
        /**
         * @description 写array
         * @example
         */

    }, {
        key: "writeBonCode",
        value: function writeBonCode(bon) {
            bon.bonEncode(this);
            return this;
        }
        /**
         * @description 写入数据
         * @example
         */

    }, {
        key: "writeData",
        value: function writeData(arr, type, offset, length) {
            if (!arr || arr.length === 0) {
                if (this.tail >= this.view.byteLength) this.extendCapity(1);
                this.view.setUint8(this.tail++, type);
                return this;
            }
            length = length || arr.byteLength;
            if (length <= 64) {
                // 长度小于等于64， 本字节直接表达
                if (this.tail + length >= this.view.byteLength) this.extendCapity(1 + length);
                this.view.setUint8(this.tail++, type + length);
            } else if (length <= 0xff) {
                // 长度小于256， 用下一个1字节记录
                if (this.tail + length + 2 > this.view.byteLength) this.extendCapity(2 + length);
                this.view.setUint8(this.tail++, type + 65);
                this.view.setUint8(this.tail++, length);
            } else if (length <= 0xffff) {
                if (this.tail + length + 3 > this.view.byteLength) this.extendCapity(3 + length);
                this.view.setUint8(this.tail++, type + 66);
                this.view.setUint16(this.tail, length, true);
                this.tail += 2;
            } else if (length <= 0xffffffff) {
                if (this.tail + length + 5 > this.view.byteLength) this.extendCapity(5 + length);
                this.view.setUint8(this.tail++, type + 67);
                this.view.setUint32(this.tail, length, true);
                this.tail += 4;
            } else if (length <= 0xffffffffffff) {
                if (this.tail + length + 7 > this.view.byteLength) this.extendCapity(7 + length);
                this.view.setUint8(this.tail++, type + 68);
                this.view.setUint16(this.tail, length & 0xffff, true);
                this.view.setUint32(this.tail + 2, Math.floor(length / 0x10000), true);
                this.tail += 6;
            } else {
                if (this.tail + length + 9 > this.view.byteLength) this.extendCapity(9 + length);
                this.view.setUint8(this.tail++, type + 69);
                this.view.setUint32(this.tail, length & 0xffffffff, true);
                this.view.setUint32(this.tail + 4, Math.floor(length / 0x100000000), true);
                this.tail += 8;
            }
            this.u8.set(arr, this.tail);
            this.tail += length;
            return this;
        }
        /**
         * @description 写入一个正整数，不允许大于0x20000000，使用动态长度。这个地方需要使用网络序，大端在前
         * 1字节： 0xxxxxxx
         * 2字节： 10xxxxxx xxxxxxxx
         * 4字节： 110xxxxx xxxxxxxx xxxxxxxx xxxxxxxx
         * @example
         */

    }, {
        key: "writePInt",
        value: function writePInt(v) {
            if (v < 0x80) {
                if (this.tail >= this.view.byteLength) this.extendCapity(1);
                this.view.setUint8(this.tail++, v);
                return this;
            }
            if (v < 0x4000) {
                if (this.tail + 2 > this.view.byteLength) this.extendCapity(2);
                this.view.setUint16(this.tail, 0x8000 + v);
                this.tail += 2;
                return this;
            }
            if (v < 0x20000000) {
                if (this.tail + 4 > this.view.byteLength) this.extendCapity(4);
                this.view.setUint32(this.tail, 0xC0000000 + v);
                this.tail += 4;
                return this;
            }
            throw new Error("invalid pint:" + v);
        }
        /**
         * @description 写入一个容器类型（对象、数组或map、枚举）
         * @example
         */

    }, {
        key: "writeCt",
        value: function writeCt(o, writeNext, estimatedSize) {
            var t = this.tail;
            // 根据预估大小，预留出足够的空间来写入容器的总大小
            estimatedSize = estimatedSize || 0xffff;
            var limitSize = void 0;
            if (estimatedSize <= 64) {
                if (t + 5 > this.view.byteLength) this.extendCapity(5 + estimatedSize);
                this.tail++;
                limitSize = 64;
            } else if (estimatedSize <= 0xff) {
                if (t + 6 > this.view.byteLength) this.extendCapity(6 + estimatedSize);
                this.tail += 2;
                limitSize = 0xff;
            } else if (estimatedSize <= 0xffff) {
                if (t + 8 > this.view.byteLength) this.extendCapity(8 + estimatedSize);
                this.tail += 3;
                limitSize = 0xffff;
            } else if (estimatedSize <= 0xffffffff) {
                if (t + 10 > this.view.byteLength) this.extendCapity(10 + estimatedSize);
                this.tail += 5;
                limitSize = 0xffffffff;
            } else if (estimatedSize <= 0xffffffffffff) {
                if (t + 12 > this.view.byteLength) this.extendCapity(12 + estimatedSize);
                this.tail += 7;
                limitSize = 0xffffffffffff;
            } else {
                if (t + 14 > this.view.byteLength) this.extendCapity(14 + estimatedSize);
                this.tail += 9;
                limitSize = 0xffffffffffffffff;
            }
            var tt = this.tail;
            writeNext(this, o);
            //writeContainer(o, this, writeNext);
            var len = this.tail - tt;
            // 判断实际写入的大小超出预期的大小，需要移动数据
            if (limitSize < len) {
                var offset = void 0;
                if (len <= 0xff) {
                    offset = 2;
                    limitSize = 0xff;
                } else if (len <= 0xffff) {
                    offset = 3;
                    limitSize = 0xffff;
                } else if (len <= 0xffffffff) {
                    offset = 5;
                    limitSize = 0xffffffff;
                } else if (len <= 0xffffffffffff) {
                    offset = 7;
                    limitSize = 0xffffffffffff;
                } else {
                    offset = 9;
                    limitSize = 0xffffffffffffffff;
                }
                this.u8.set(new Uint8Array(this.u8.buffer, this.u8.byteOffset + tt, len), t + offset);
            }
            // 根据实际的限制大小，写入实际长度
            switch (limitSize) {
                case 64:
                    this.view.setUint8(t, 180 + len);
                    break;
                case 0xff:
                    this.view.setUint8(t, 245);
                    this.view.setUint8(t + 1, len);
                    break;
                case 0xffff:
                    this.view.setUint8(t, 246);
                    this.view.setUint16(t + 1, len, true);
                    break;
                case 0xffffffff:
                    this.view.setUint8(t, 247);
                    this.view.setUint32(t + 1, len, true);
                    break;
                case 0xffffffffffff:
                    this.view.setUint8(t, 248);
                    this.view.setUint16(t + 1, len & 0xffff, true);
                    this.view.setUint32(t + 3, Math.floor(len / 0x10000), true);
                    break;
                default:
                    throw new Error("container overflow, the max len is 48bit");
                // this.view.setUint8(t, 249);
                // this.view.setUint32(t + 1, len & 0xffffffff, true);
                // this.view.setUint32(t + 5, Math.floor(len / 0x100000000), true);
                //break;
            }
            return this;
        }
        /**
         * @description 读出当前的类型（第一个字节，可能包含值或长度）
         * @example
         */

    }, {
        key: "getType",
        value: function getType() {
            if (this.head >= this.tail) throw new Error("getType overflow: " + this.head);
            return this.view.getUint8(this.head);
        }
        /**
         * @description 是否为空
         * @example
         */

    }, {
        key: "isNil",
        value: function isNil() {
            if (this.getType() === 0) {
                this.head++;
                return true;
            }
            return false;
        }
        /**
         * @description 读u8
         * @example
         */

    }, {
        key: "readU8",
        value: function readU8() {
            return this.view.getUint8(this.head++);
        }
        /**
         * @description 读U16
         * @example
         */

    }, {
        key: "readU16",
        value: function readU16() {
            this.head += 2;
            return this.view.getUint16(this.head - 2, true);
        }
        /**
         * @description 读U32
         * @example
         */

    }, {
        key: "readU32",
        value: function readU32() {
            this.head += 4;
            return this.view.getUint32(this.head - 4, true);
        }
        /**
         * @description 读整数
         * @example
         */

    }, {
        key: "readInt",
        value: function readInt() {
            if (this.head >= this.tail) throw new Error("readInt overflow: " + this.head);
            var t = this.view.getUint8(this.head++);
            if (t < 9 || t > 40) {
                throw new Error("类型错误， 无法读, type: " + t);
            }
            var r = readContent(this, t);
            return r;
        }
        /**
         * @description 读大整数
         * @example
         */

    }, {
        key: "readBigInt",
        value: function readBigInt() {
            if (this.head >= this.tail) throw new Error("readBigInt overflow: " + this.head);
            var t = this.view.getUint8(this.head++);
            if (t < 9 || t > 41) {
                throw new Error("非大整数， 无法读, type: " + t);
            }
            return readContent(this, t);
        }
        /**
         * @description 读浮点
         * @example
         */

    }, {
        key: "readf",
        value: function readf() {
            if (this.head >= this.tail) throw new Error("readf overflow: " + this.head);
            var t = this.view.getUint8(this.head++);
            if (t < 3 || t > 8) {
                throw new Error("非浮点数， 无法读");
            }
            return readContent(this, t);
        }
        /**
         * @description 读boolean
         * @example
         */

    }, {
        key: "readBool",
        value: function readBool() {
            if (this.head >= this.tail) throw new Error("readBool overflow: " + this.head);
            var t = this.view.getUint8(this.head++);
            switch (t) {
                case 1:
                    return false;
                case 2:
                    return true;
                default:
                    throw new Error("非布尔值， 无法读");
            }
        }
        /**
         * @description 读字符串
         * @example
         */

    }, {
        key: "readUtf8",
        value: function readUtf8() {
            if (this.head >= this.tail) throw new Error("readUtf8 overflow: " + this.head);
            var t = this.view.getUint8(this.head++);
            if (t < 42 || t > 110) {
                throw new Error("非字符串， 无法读");
            }
            return readContent(this, t);
        }
        /**
         * @description 读二进制
         * @example
         */

    }, {
        key: "readBin",
        value: function readBin() {
            if (this.head >= this.tail) throw new Error("readBin overflow: " + this.head);
            var t = this.view.getUint8(this.head++);
            if (t < 111 || t > 179) {
                throw new Error("非字二进制， 无法读");
            }
            return readContent(this, t);
        }
        // /**
        //  * @description 读u16
        //  * @example
        //  */
        // readU16() {
        // 	this.head += 2;
        // 	return this.view.getUint16(this.head - 2);
        // }
        // /**
        //  * @description 读u16
        //  * @example
        //  */
        // readU32() {
        // 	this.head += 4;
        // 	return this.view.getUint32(this.head - 4);
        // }
        /**
         * @description 读入一个类型的值
         * @example
         */

    }, {
        key: "read",
        value: function read(readNext) {
            if (this.head >= this.tail) throw new Error("read overflow: " + this.head);
            var t = this.view.getUint8(this.head++);
            return readContent(this, t, readNext);
        }
        /**
         * @description 读出一个正整数，不允许大于0x20000000，使用动态长度
         * @example
         */

    }, {
        key: "readPInt",
        value: function readPInt() {
            var v = this.view.getUint8(this.head);
            if (v < 0x80) {
                this.head++;
                return v;
            }
            if (v < 0xC0) {
                this.head += 2;
                return this.view.getUint16(this.head - 2) - 0x8000;
            }
            if (v < 0xE0) {
                this.head += 4;
                return this.view.getUint32(this.head - 4) - 0xC0000000;
            }
            throw new Error("invalid pint:" + v);
        }
        /**
         * @description 读map
         * @example
         */

    }, {
        key: "readMap",
        value: function readMap(callbackfn) {
            var map = new Map();
            var size = this.readInt();
            for (var i = 0; i < size; i++) {
                var item = callbackfn();
                map.set(item[0], item[1]);
            }
            return map;
        }
        /**
         * @description 读array
         * @example
         */

    }, {
        key: "readArray",
        value: function readArray(callbackfn) {
            var array = [];
            var length = this.readInt();
            for (var i = 0; i < length; i++) {
                var el = callbackfn();
                array.push(el);
            }
            return array;
        }
        /**
         * @description 读array, 返回Boncode
         * @example
         */

    }, {
        key: "readBonCode",
        value: function readBonCode(constructor) {
            var r = new constructor();
            r.bonDecode(this);
            return r;
        }
    }, {
        key: "readCt",
        value: function readCt(next) {
            var t = this.view.getUint8(this.head++);
            if (t < 180 || t > 249) {
                throw new Error("非容器， 无法读");
            }
            var a = readContent(this, t, next);
            return a;
        }
    }]);

    return BonBuffer;
}();

exports.BonBuffer = BonBuffer;
// ============================== 本地
// 增长因子
var factor = 1.6;
var readContent = function readContent(bb, t, readNext) {
    var len = void 0;
    switch (t) {
        case 0:
            return null;
        case 1:
            return false;
        case 2:
            return true;
        case 3:
            return 0.0;
        case 4:
            return 1.0;
        case 5:
            throw new Error("unused type :" + t);
        case 6:
            bb.head += 4;
            return bb.view.getFloat32(bb.head - 4, true);
        case 7:
            bb.head += 8;
            return bb.view.getFloat64(bb.head - 8, true);
        case 8:
            throw new Error("unused type :" + t);
        case 36:
            return bb.view.getUint8(bb.head++);
        case 37:
            bb.head += 2;
            return bb.view.getUint16(bb.head - 2, true);
        case 38:
            bb.head += 4;
            return bb.view.getUint32(bb.head - 4, true);
        case 39:
            bb.head += 6;
            return bb.view.getUint16(bb.head - 6, true) + bb.view.getUint32(bb.head - 4, true) * 0x10000;
        case 40:
            bb.head += 8;
            var u64_1 = bb.view.getUint32(bb.head - 8, true);
            var u64_2 = bb.view.getUint32(bb.head - 4, true);
            if (u64_1 === 0 && u64_2 <= 2097152 || u64_1 > 0 && u64_2 < 2097152) {
                //在9007199254740992范围内
                bb.u8.slice(bb.head - 8, bb.head);
                return u64_1 + u64_2 * 0x100000000;
            } else {
                //大于9007199254740992，返回一个u8array
                return bb.u8.slice(bb.head - 8, bb.head);
            }
        case 41:
            bb.head += 16;
            var u128_1 = bb.view.getUint32(bb.head - 16, true);
            var u128_2 = bb.view.getUint32(bb.head - 12, true);
            var u128_3 = bb.view.getUint32(bb.head - 8, true);
            var u128_4 = bb.view.getUint32(bb.head - 4, true);
            if (u128_3 === 0 && u128_4 === 0 && (u128_1 === 0 && u128_2 <= 2097152 || u128_1 > 0 && u128_2 < 2097152)) {
                //在9007199254740992范围内
                return u128_1 + u128_2 * 0x100000000;
            } else {
                //大于9007199254740992，返回一个u8array
                return bb.u8.slice(bb.head - 16, bb.head);
            }
        case 9:
            return -bb.view.getUint8(bb.head++);
        case 10:
            bb.head += 2;
            return -bb.view.getUint16(bb.head - 2, true);
        case 11:
            bb.head += 4;
            return -bb.view.getUint32(bb.head - 4, true);
        case 12:
            bb.head += 6;
            return -bb.view.getUint16(bb.head - 6, true) - bb.view.getUint32(bb.head - 4, true) * 0x10000;
        case 13:
            bb.head += 8;
            var i64_1 = bb.view.getUint32(bb.head - 8, true);
            var i64_2 = bb.view.getUint32(bb.head - 4, true);
            if (i64_1 === 0 && i64_2 <= 2097152 || i64_1 > 0 && i64_2 < 2097152) {
                return -(i64_1 + i64_2 * 0x100000000);
            } else {
                return bb.u8.slice(bb.head - 8, bb.head); //todo
            }
        case 14:
            bb.head += 16;
            var i128_1 = bb.view.getUint32(bb.head - 16, true);
            var i128_2 = bb.view.getUint32(bb.head - 12, true);
            var i128_3 = bb.view.getUint32(bb.head - 8, true);
            var i128_4 = bb.view.getUint32(bb.head - 4, true);
            if (i128_3 === 0 && i128_4 === 0 && (i128_1 === 0 && i128_2 <= 2097152 || i128_1 > 0 && i128_2 < 2097152)) {
                //在9007199254740992范围内
                return i128_1 + i128_2 * 0x100000000;
            } else {
                //大于9007199254740992，返回一个u8array
                return bb.u8.slice(bb.head - 16, bb.head);
            }
        case 176:
            len = bb.view.getUint8(bb.head);
            bb.head += len + 1;
            return bb.u8.slice(bb.head - len, bb.head);
        case 177:
            len = bb.view.getUint16(bb.head, true);
            bb.head += len + 2;
            return bb.u8.slice(bb.head - len, bb.head);
        case 178:
            len = bb.view.getUint32(bb.head, true);
            bb.head += len + 4;
            return bb.u8.slice(bb.head - len, bb.head);
        case 179:
            len = bb.view.getUint16(bb.head, true) + bb.view.getUint32(bb.head + 2, true) * 0x10000;
            bb.head += len + 6;
            return bb.u8.slice(bb.head - len, bb.head);
        case 107:
            len = bb.view.getUint8(bb.head);
            bb.head += len + 1;
            return util_1.utf8Decode(new Uint8Array(bb.view.buffer, bb.view.byteOffset + bb.head - len, len));
        case 108:
            len = bb.view.getUint16(bb.head, true);
            bb.head += len + 2;
            return util_1.utf8Decode(new Uint8Array(bb.view.buffer, bb.view.byteOffset + bb.head - len, len));
        case 109:
            len = bb.view.getUint32(bb.head, true);
            bb.head += len + 4;
            return util_1.utf8Decode(new Uint8Array(bb.view.buffer, bb.view.byteOffset + bb.head - len, len));
        case 110:
            len = bb.view.getUint16(bb.head, true) + bb.view.getUint32(bb.head + 2, true) * 0x10000;
            bb.head += len + 6;
            return util_1.utf8Decode(new Uint8Array(bb.view.buffer, bb.view.byteOffset + bb.head - len, len));
        case 245:
            len = bb.view.getUint8(bb.head);
            bb.head += 5;
            return readNext(bb, bb.view.getUint32(bb.head - 4, true), len);
        case 246:
            len = bb.view.getUint16(bb.head, true);
            bb.head += 6;
            return readNext(bb, bb.view.getUint32(bb.head - 4, true), len);
        case 247:
            len = bb.view.getUint32(bb.head, true);
            bb.head += 8;
            return readNext(bb, bb.view.getUint32(bb.head - 4, true), len);
        case 248:
            len = bb.view.getUint16(bb.head, true) + bb.view.getUint32(bb.head + 2, true) * 0x10000;
            bb.head += 10;
            return readNext(bb, bb.view.getUint32(bb.head - 4, true), len);
        default:
            if (t < 36) return t - 16;
            if (t < 176) {
                // 读取二进制数据
                len = t - 42;
                bb.head += len;
                return util_1.utf8Decode(new Uint8Array(bb.view.buffer, bb.view.byteOffset + bb.head - len, len));
            }
            if (t < 107) {
                // 读取utf8编码的字符串
                len = t - 111;
                bb.head += len;
                return bb.u8.slice(bb.head - len, bb.head);
            }
            if (t < 245) {
                bb.head += 4;
                // 读取容器类型
                return readNext(bb, bb.view.getUint32(bb.head - 4, true), t - 180);
            }
            throw new Error("invalid type :" + t);
    }
};
})