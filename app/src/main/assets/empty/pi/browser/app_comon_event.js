_$define("pi/browser/app_comon_event", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ============================== 导入
const native_1 = require("./native");
// ============================== 导出
/**
 * 添加对app退回后台的监听事件
 *
 * @param cb App退到后台处罚callback事件
 */
exports.addAppBackPressed = (cb) => {
    native_1.addEventListener(EventType.App, EventName.BackPressed, cb);
};
/**
 * 移除对app退回后台的监听事件
 *
 * @param cb App退到后台触发callback事件
 */
exports.removeAppBackPressed = (cb) => {
    native_1.removeEventListener(EventType.App, EventName.BackPressed, cb);
};
/**
 * 添加对app推到前台的监听事件
 *
 * @param cb App退到后台处罚callback事件
 */
exports.addAppResumed = (cb) => {
    native_1.addEventListener(EventType.App, EventName.Resumed, cb);
};
/**
 * 移除对app推到前台的监听事件
 *
 * @param cb App推到前台触发callback事件
 */
exports.removeAppResumed = (cb) => {
    native_1.removeEventListener(EventType.App, EventName.Resumed, cb);
};
/**
 * 添加对activity退回后台的监听事件
 *
 * @param cb App退到后台处罚callback事件
 */
exports.addActivityBackPressed = (cb) => {
    native_1.addEventListener(EventType.Activity, EventName.BackPressed, cb);
};
/**
 * 移除对app退回后台的监听事件
 *
 * @param cb App退到后台触发callback事件
 */
exports.removeActivityBackPressed = (cb) => {
    native_1.removeEventListener(EventType.Activity, EventName.BackPressed, cb);
};
/**
 * 底层主动往高层通知的 App相关 的 通用事件
 */
var EventName;
(function (EventName) {
    /**
     * 界面退出事件
     */
    EventName["BackPressed"] = "onBackPressed";
    /**
     * 界面复现事件
     */
    EventName["Resumed"] = "onResumed";
})(EventName = exports.EventName || (exports.EventName = {}));
/**
 * 事件来源
 */
var EventType;
(function (EventType) {
    EventType["App"] = "PI_App";
    EventType["Activity"] = "PI_Activity";
})(EventType = exports.EventType || (exports.EventType = {}));
});
