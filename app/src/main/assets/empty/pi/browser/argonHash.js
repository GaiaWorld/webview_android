_$define("pi/browser/argonHash", function (require, exports, module){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * memory hash
 */
const native_1 = require("./native");
class ArgonHash extends native_1.NativeObject {
    /**
     * 从本地选择图片
     * @param param 参数
     */
    calcHashValue(iParam, successF, failF) {
        const param = {
            success: successF,
            fail: failF,
            t: 12,
            m: 128 * 1024,
            p: 8,
            pwd: iParam.pwd || 'password',
            salt: iParam.salt || 'somesalt',
            type: 2,
            hashLen: 32
        };
        if (navigator.userAgent.indexOf('YINENG') < 0) {
            this.calcHashValueAtPc('getArgon2Hash', param);
        }
        else {
            this.call('getArgon2Hash', param);
        }
    }
    calcHashValuePromise(iParam) {
        return __awaiter(this, void 0, void 0, function* () {
            const start = new Date().getTime();
            return new Promise((resolve, reject) => {
                this.calcHashValue(iParam, (result) => {
                    console.log('计算hash耗时 ==', new Date().getTime() - start);
                    return resolve(result);
                }, (err) => {
                    alert(`失败${err}`);
                    return reject(err);
                });
            });
        });
    }
    calcHashValueAtPc(iType, param) {
        if (iType === 'getArgon2Hash') {
            setTimeout(() => {
                pi_modules.commonjs.exports.require(['app/utils_pc/argon2'], {}, (mods, fm) => {
                    // todo 这里考虑使用worker进行处理
                    const hash = mods[0].getArgonHash(param.pwd, param.salt, 2, param.m, param.hashLen, param.p, 1);
                    param.success(hash);
                    console.log(mods, fm);
                });
            }, 1000);
        }
    }
}
exports.ArgonHash = ArgonHash;
native_1.registerSign(ArgonHash, {
    getArgon2Hash: [
        {
            name: 't',
            type: native_1.ParamType.Number
        },
        {
            name: 'm',
            type: native_1.ParamType.Number
        },
        {
            name: 'p',
            type: native_1.ParamType.Number
        },
        {
            name: 'pwd',
            type: native_1.ParamType.String
        },
        {
            name: 'salt',
            type: native_1.ParamType.String
        },
        {
            name: 'type',
            type: native_1.ParamType.Number
        },
        {
            name: 'hashLen',
            type: native_1.ParamType.Number
        }
    ]
});
/**
 * 这是测试
 */
const test = () => {
    const hash = new ArgonHash();
    hash.init();
    hash.calcHashValue({ pwd: 'password', salt: 'somesalt' }, (result) => {
        alert(`成功${result}`);
    }, (result) => {
        alert(`失败${result}`);
    });
};
});
