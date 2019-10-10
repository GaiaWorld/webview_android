_$define("app/postMessage/thirdPush", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const event_1 = require("../../pi/util/event");
/**
 * 三方推送
 */
/**
 * 消息处理列表
 */
const handlerMap = new event_1.HandlerMap();
/**
 * 监听vm loaded
 * @param cb 回调
 */
exports.addThirdPushListener = (key, cb) => {
    handlerMap.add(key, cb);
};
/**
 * 触发server push事件
 * @param args 参数
 */
exports.emitThirdPush = (args) => {
    handlerMap.notify(args.cmd, args.payload);
};
});
