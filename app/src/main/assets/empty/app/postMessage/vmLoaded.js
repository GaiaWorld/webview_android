_$define("app/postMessage/vmLoaded", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constant_1 = require("../public/constant");
/**
 * vm 资源加载阶段  底层会保证webview到达相同阶段才会推送消息
 */
const storeLoadedCbs = []; // store加载完成回调
const vmLoadedCbs = []; // 所有资源加载完成回调
let vmLoadedStage = constant_1.LoadedStage.START; // vm资源准备阶段
/**
 * 触发vm loaded事件
 * @param args 参数
 */
exports.emitVmLoaded = (stage) => {
    vmLoadedStage = stage;
    const cbs = vmLoadedStage === constant_1.LoadedStage.STORELOADED ? storeLoadedCbs : vmLoadedCbs;
    for (const cb of cbs) {
        cb && cb();
    }
    cbs.length = 0;
};
/**
 * 监听vm loaded
 * @param cb 回调
 */
exports.addVmLoadedListener = (cb) => {
    if (vmLoadedStage === constant_1.LoadedStage.ALLLOADED)
        cb && cb();
    vmLoadedCbs.push(cb);
};
/**
 * 监听store loaded
 * @param cb 回调
 */
exports.addStoreLoadedListener = (cb) => {
    if (vmLoadedStage >= constant_1.LoadedStage.STORELOADED)
        cb && cb();
    storeLoadedCbs.push(cb);
};
});
