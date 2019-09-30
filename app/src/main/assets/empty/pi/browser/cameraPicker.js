_$define("pi/browser/cameraPicker", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 打开照相机
 */
// ============================== 导入
const base64_1 = require("../util/base64");
const native_1 = require("./native");
// ============================== 导出
class CameraPicker extends native_1.NativeObject {
    /**
     * 打开相机拍照并保存照片
     * @param param 不需要参数
     * @param success 返回该图片的url（iOS为压缩后的Base64编码）
     */
    takePhoto(param) {
        this.call('takePhoto', param);
    }
    /**
     * 获取当前拍照的图片资源
     * @param param quality为图片压缩质量百分比，传入1～100整型
     * @param success 返回该图片压缩后的base64编码
     * @note 该方法要保证其准确性一定要在takePhoto方法返回success后调用
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
}
exports.CameraPicker = CameraPicker;
// ============================== 本地
/**
 * 底层接口和参数的声明
 */
native_1.registerSign(CameraPicker, {
    takePhoto: [],
    getContent: [{
            name: 'quality',
            type: native_1.ParamType.Number
        }]
});
});
