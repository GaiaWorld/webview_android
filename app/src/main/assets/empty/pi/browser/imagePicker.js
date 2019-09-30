_$define("pi/browser/imagePicker", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 图片导入（本地、相机）
 */
// ============================== 导入
const base64_1 = require("../util/base64");
const native_1 = require("./native");
// ============================== 导出
class ImagePicker extends native_1.NativeObject {
    /**
     * 将图片保存到本地相册
     *
     * @param param  saveImg：传图片的URL
     */
    saveImageToAlbum(param) {
        this.call('saveImageToAlbum', param);
    }
    /**
     * 从本地选择图片
     * @param param 参数
     * @param success 返回选择图片的url（iOS返回base64编码）
     */
    selectFromLocal(param) {
        this.call('chooseImage', param);
    }
    /**
     * 获取当前选择的图片资源
     * @param param {success: ArrayBuffer}
     * @note 保证方法的准确性，需要在selectFromLocal方法成功回调后调用
     */
    getContent(param) {
        const old = param.success;
        if (old) {
            param.success = base64 => {
                const buffer = base64_1.base64ToArrayBuffer(base64);
                old(buffer);
            };
        }
        this.call('getContent', param);
    }
    /**
     * 获取当前选择图片的AHASH
     * @param param {success: string}
     * @note 保证方法的准确性，需要在selectFromLocal方法成功回调后调用
     */
    getAHash(param) {
        this.call('getAHash', param);
    }
}
exports.ImagePicker = ImagePicker;
// ============================== 本地
/**
 * 底层接口和参数的声明
 */
native_1.registerSign(ImagePicker, {
    chooseImage: [
        {
            name: 'useCamera',
            type: native_1.ParamType.Number
        },
        {
            name: 'single',
            type: native_1.ParamType.Number
        },
        {
            name: 'max',
            type: native_1.ParamType.Number
        }
    ],
    saveImageToAlbum: [
        {
            name: 'imgName',
            type: native_1.ParamType.String
        },
        {
            name: 'saveImg',
            type: native_1.ParamType.String
        }
    ],
    getContent: [{
            name: 'quality',
            type: native_1.ParamType.Number
        }],
    getAHash: []
});
});
