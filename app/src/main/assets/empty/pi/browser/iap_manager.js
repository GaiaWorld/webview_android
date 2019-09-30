_$define("pi/browser/iap_manager", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * apple 应用内支付模块
 */
// ============================== 导入
const native_1 = require("./native");
// ============================== 导出
class IAPManager extends native_1.NativeObject {
    /**
     * 添加苹果支付队列监听事件
     * @param param
     */
    static addTransactionObserver(param) {
        ipaManager.call('addTransactionObserver', param);
    }
    /**
     * 移除苹果支付队列监听事件
     * 为了防止内存泄露，在成功完成支付之后建议移除掉队列监听
     * @param param
     */
    static removeTransactionObserver(param) {
        ipaManager.call('removeTransactionObserver', param);
    }
    /**
     * 发起支付请求
     * @param sm : 商品ID
     * @param sd : 订单ID
     */
    static IAPurchase(param) {
        ipaManager.call('IAPurchase', param);
    }
    /**
     * 监听底层是否有上次未支付成功的订单
     * 建议在程序加载时就监听此事件
     * 返回信息： issuccess：是否支付成功 sd: 订单ID， transation： 凭证
     */
    static addTransactionListener(cb) {
        cbNum = cbNum + 1;
        cbList.set(cbNum, cb);
        let cbCall = (issuccess, sd, transation) => {
            cb(issuccess, sd, transation, cbNum);
        };
        native_1.addEventListener('iap_manager', 'transation', cbCall);
    }
    /**
     * 移除监听事件
     * @param cb 必须和添加监听时cb保持一致
     */
    static removeTransactionListener(num) {
        if (cbList.has(num)) {
            let cb = cbList.get(num);
            cbList.delete(num);
            native_1.removeEventListener('iap_manager', 'transation', cb);
        }
    }
}
exports.IAPManager = IAPManager;
// ============================== 本地
/**
 * 底层接口和参数的声明
 */
native_1.registerSign(IAPManager, {
    addTransactionObserver: [],
    removeTransactionObserver: [],
    IAPurchase: [
        {
            name: 'sm',
            type: native_1.ParamType.String
        }, {
            name: 'sd',
            type: native_1.ParamType.String
        }
    ]
});
let cbNum = 0;
const cbList = new Map();
const ipaManager = new IAPManager();
ipaManager.init();
});
