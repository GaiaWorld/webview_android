_$define("pi/browser/qrcode", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 二维码扫描
 */
// ============================== 导入
const native_1 = require("./native");
// ============================== 导出
class QRCode extends native_1.NativeObject {
    /**
     * 调用二维码扫描器
     * @param param {success: info(string)}
     */
    scan(param) {
        this.call('scan', param);
    }
}
exports.QRCode = QRCode;
// ============================== 本地
/**
 * 底层接口和参数的声明
 */
native_1.registerSign(QRCode, {
    scan: []
});
});
