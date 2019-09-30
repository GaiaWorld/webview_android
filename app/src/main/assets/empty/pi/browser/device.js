_$define("pi/browser/device", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 获取设备信息
 */
// ============================== 导入
const native_1 = require("./native");
// ============================== 导出
class DeviceIdProvider extends native_1.NativeObject {
    constructor() {
        super();
        this.init();
    }
    /**
     * 读取当前包的渠道方名
     * @param success Chanel: 渠道名 string
     */
    getChannelName(success) {
        this.call("getChannelName", { success });
    }
    /**
     * 读取当前包的合作方名
     * @param success packageName: 游戏名 string
     */
    getGameName(success) {
        this.call("getGameName", { success });
    }
    /**
     * 获取设备唯一标示UUID
     * @param success uuid：设备唯一标识  string
     */
    getUUId(success) {
        this.call("getUUId", { success });
    }
    /**
     * 获取设备信息
     * @param success
     *    + manufacturer  设备制造商 string
     *    + model 设备名称  string
     *    + version 系统版本号 string
     */
    getSystem(success) {
        this.call("getSystem", { success });
    }
    /**
     * 获取设备总内存和当前可用内存
     * @param success
     *    + total  系统总内存 string  GB
     *    + avail  当前可用内存 string  GB
     */
    getMemSize(success) {
        this.call("getMemSize", { success });
    }
    /**
     * 获取当前网络状态
     * @param success netWorkStatus 网络状态 string （没有网络 wifi连接 2G 3G 4G 手机流量）
     */
    getNetWorkStatus(success) {
        this.call("getNetWorkStatus", { success });
    }
    /**
     * 获取网络供应商
     * @param success operator 网络供应商  string  若为空则没有sim卡
     */
    getOperatorName(success) {
        this.call("getOperatorName", { success });
    }
}
exports.DeviceIdProvider = DeviceIdProvider;
// ============================== 本地
/**
 * 底层接口和参数的声明
 */
native_1.registerSign(DeviceIdProvider, {
    getUUId: [],
    getSystem: [],
    getMemSize: [],
    getNetWorkStatus: [],
    getOperatorName: [],
    getGameName: [],
    getChannelName: []
});
});
