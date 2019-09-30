_$define("pi/net/rpc", function (require, exports, module){
"use strict";
/**
 * RPC， 远程方法调用
 * 采用 mqtt上定义的每会话的$req和$resp主题，来发送请求和接受响应
 */
Object.defineProperty(exports, "__esModule", { value: true });
// ============================== 导入
const struct_mgr_1 = require("../struct/struct_mgr");
const util_1 = require("../struct/util");
const bon_1 = require("../util/bon");
/**
 * 创建一个RPC函数
 * @example
 */
exports.create = (client, mgr) => {
    const mqttRpc = new MqttRpc(client, mgr);
    client.onMessage((topic, payload) => {
        if (topic === "$r") {
            let bb = new bon_1.BonBuffer(payload, 0, payload.length);
            let rid = bb.readU32(); //消息开始表示此次请求的id
            let timeout = bb.readU8();
            if (mqttRpc.wait[rid]) {
                mqttRpc.wait[rid](util_1.read(bb, mgr));
                delete mqttRpc.wait[rid];
            }
        }
    });
    return (name, req, callback, timeout) => {
        mqttRpc.call(name, req, callback, timeout);
    };
};
class MqttRpc {
    constructor(client, mgr) {
        this.rid = 1;
        this.wait = {};
        this.client = client;
        this.mgr = mgr;
    }
    ;
    //远程调用
    call(name, req, callback, timeout) {
        let bb = new bon_1.BonBuffer();
        this.wait[this.rid] = callback;
        bb.writeU32(this.rid++);
        bb.writeU8(timeout);
        this.rid >= 0xffffffff && (this.rid = 1);
        if (req === null || req === undefined) {
            bb.writeNil();
        }
        else if (req instanceof struct_mgr_1.Struct) {
            util_1.writeBon(req, bb);
        }
        else {
            req.bonEncode(bb);
        }
        this.client.publish(name, bb.getBuffer(), 0, true);
    }
}
});
