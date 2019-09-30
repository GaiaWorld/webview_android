_$define("pi/browser/service", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 服务器应用管理
 */
// ============================== 导入
const native_1 = require("./native");
// ============================== 导出
class ServiceManager {
    /**
     * bind事件回应
     */
    static resoleBind(webViewName, initData) {
        window.sendBindMessage(webViewName, initData);
    }
    /**
     * 添加bind监听事件
     */
    static bindServiceListener(cb) {
        native_1.addEventListener('ServiceAction', 'bind', cb);
    }
    /**
     * 添加unbind监听事件
     */
    static unbindServiceListener(cb) {
        native_1.addEventListener('ServiceAction', 'unbind', cb);
    }
}
exports.ServiceManager = ServiceManager;
});
