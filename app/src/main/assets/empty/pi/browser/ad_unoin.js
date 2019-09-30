_$define("pi/browser/ad_unoin", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ============================== 导入
const native_1 = require("./native");
// ============================== 导出
/**
 * 接入广告
 *
 * 支持广告平台
 *    + 腾讯广点通
 *    + 字节跳动的穿山甲
 *
 * 支持广告类型
 *    + 激励视频广告
 *
 */
class ADUnion extends native_1.NativeObject {
    /**
     * 获取每个平台当前可用的广告数量
     * @param cb(广点通, 穿山甲)
     * @note 必须等loadRewardVideoAD的cb调用之后，numberCb的参数才有效
     */
    static getADNumber(numberCb) {
        numberCb(adCount[AdPlatform.GDT], adCount[AdPlatform.CSJ]);
    }
    /**
     * 播放激励视频广告
     * @param platform
     * @param cb 播放期间的事件回调
     */
    static showRewardVideoAD(platform, cb) {
        adMrg.call("showRewardVideoAD", {
            platform, callback(isSuccess, event, info) {
                if (event === PlayEvent.Reward && isSuccess === 1 && adCount[platform] !== undefined) {
                    adCount[platform] = adCount[platform] < 1 ? 0 : adCount[platform] - 1;
                }
                cb(isSuccess, event, info);
            }
        });
    }
    /**
     * 播放激励视频广告
     * @param platform 广告平台
     * @param cb 加载结果回调
     */
    static loadRewardVideoAD(platform, cb) {
        adMrg.call("loadRewardVideoAD", {
            platform,
            success(info) {
                if (adCount[platform] !== undefined) {
                    adCount[platform] = adCount[platform] + 1;
                }
                cb(undefined, info);
            },
            fail(errInfo) {
                cb(errInfo, undefined);
            }
        });
    }
}
exports.ADUnion = ADUnion;
;
/**
 * 广告平台类型
 */
var AdPlatform;
(function (AdPlatform) {
    AdPlatform[AdPlatform["GDT"] = 1] = "GDT";
    AdPlatform[AdPlatform["CSJ"] = 2] = "CSJ";
})(AdPlatform = exports.AdPlatform || (exports.AdPlatform = {}));
/**
 * 播放事件类型
 */
var PlayEvent;
(function (PlayEvent) {
    PlayEvent[PlayEvent["Reward"] = 0] = "Reward";
    PlayEvent[PlayEvent["Close"] = 1] = "Close";
})(PlayEvent = exports.PlayEvent || (exports.PlayEvent = {}));
// ============================== 本地
/**
 * 每个平台的广告数
 */
let adCount = {
    [AdPlatform.GDT]: 0,
    [AdPlatform.CSJ]: 0,
};
/**
 * 底层接口和参数的声明
 */
native_1.registerSign(ADUnion, {
    showRewardVideoAD: [
        {
            name: 'platform',
            type: native_1.ParamType.Number
        }
    ],
    loadRewardVideoAD: [
        {
            name: 'platform',
            type: native_1.ParamType.Number
        }
    ]
});
const adMrg = new ADUnion();
adMrg.init();
});
