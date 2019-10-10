_$define("app/public/constant", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 服务器推送key
 */
var ServerPushKey;
(function (ServerPushKey) {
    ServerPushKey["CMD"] = "cmd";
    ServerPushKey["EVENTPAYOK"] = "event_pay_ok";
    ServerPushKey["EVENTINVITESUCCESS"] = "event_invite_success";
    ServerPushKey["EVENTCONVERTINVITE"] = "event_convert_invite";
    ServerPushKey["EVENTINVITEREAL"] = "event_invite_real";
    ServerPushKey["ALTERBALANCEOK"] = "alter_balance_ok"; // 余额变化事件
})(ServerPushKey = exports.ServerPushKey || (exports.ServerPushKey = {}));
/**
 * 推送消息模块
 */
var PostModule;
(function (PostModule) {
    PostModule[PostModule["LOADED"] = 0] = "LOADED";
    PostModule[PostModule["SERVER"] = 1] = "SERVER";
    PostModule[PostModule["THIRD"] = 2] = "THIRD";
    PostModule[PostModule["AUTHORIZE"] = 3] = "AUTHORIZE"; // 授权信息
})(PostModule = exports.PostModule || (exports.PostModule = {}));
/**
 * 加载阶段
 */
var LoadedStage;
(function (LoadedStage) {
    LoadedStage[LoadedStage["START"] = 0] = "START";
    LoadedStage[LoadedStage["STORELOADED"] = 1] = "STORELOADED";
    LoadedStage[LoadedStage["ALLLOADED"] = 2] = "ALLLOADED"; // 所有资源加载完毕
})(LoadedStage = exports.LoadedStage || (exports.LoadedStage = {}));
/**
 * 三方命令
 */
var ThirdCmd;
(function (ThirdCmd) {
    ThirdCmd[ThirdCmd["CLOSE"] = 0] = "CLOSE";
    ThirdCmd[ThirdCmd["MIN"] = 1] = "MIN";
    ThirdCmd[ThirdCmd["INVITE"] = 2] = "INVITE";
    ThirdCmd[ThirdCmd["RECHARGE"] = 3] = "RECHARGE";
    ThirdCmd[ThirdCmd["GAMESERVICE"] = 4] = "GAMESERVICE";
    ThirdCmd[ThirdCmd["OFFICIALGROUPCHAT"] = 5] = "OFFICIALGROUPCHAT"; // 官方群聊
})(ThirdCmd = exports.ThirdCmd || (exports.ThirdCmd = {}));
});
