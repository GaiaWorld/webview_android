_$define("pi/browser/shareToPlatforms", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 分享
 */
// ============================== 导入
const native_1 = require("./native");
// ============================== 导出
class ShareToPlatforms extends native_1.NativeObject {
    /**
     * 分享
     * @param 参数
     *    + content:string         参数
     *    + type:ShareType         分享类型
     *    + platform:SharePlatform 分享平台
     */
    static shareCode(param) {
        shareToPlatforms.call('shareContent', param);
    }
    /**
     * 分享链接
     * @param 参数
     *    + webName:string         网站名
     *    + url:string             链接地址
     *    + title:string           分享标题
     *    + content:string         参数
     *    + comment:string         评论
     *    + platform:SharePlatform 分享平台
     */
    static shareLink(param) {
        shareToPlatforms.call('shareLink', param);
    }
    /**
     * 生成截图
     */
    static makeScreenShot(param) {
        shareToPlatforms.call('getScreenShot', param);
    }
    /**
     * 分享截图
     *     + platform:SharePlatform 分享平台
     */
    static shareScreenShot(param) {
        shareToPlatforms.call('shareScreen', param);
    }
}
exports.ShareToPlatforms = ShareToPlatforms;
/**
 * 分享类型枚举
 */
var ShareType;
(function (ShareType) {
    ShareType[ShareType["TYPE_IMG"] = 1] = "TYPE_IMG";
    ShareType[ShareType["TYPE_TEXT"] = 2] = "TYPE_TEXT";
    ShareType[ShareType["TYPE_LINK"] = 3] = "TYPE_LINK";
    ShareType[ShareType["TYPE_SCREEN"] = 4] = "TYPE_SCREEN";
})(ShareType = exports.ShareType || (exports.ShareType = {}));
/**
 * 分享平台枚举
 */
var SharePlatform;
(function (SharePlatform) {
    SharePlatform[SharePlatform["PLATFORM_DEFAULT"] = -1] = "PLATFORM_DEFAULT";
    SharePlatform[SharePlatform["PLATFORM_WEBCHAT"] = 1] = "PLATFORM_WEBCHAT";
    SharePlatform[SharePlatform["PLATFORM_MOMENTS"] = 2] = "PLATFORM_MOMENTS";
    SharePlatform[SharePlatform["PLATFORM_QZONE"] = 3] = "PLATFORM_QZONE";
    SharePlatform[SharePlatform["PLATFORM_QQ"] = 4] = "PLATFORM_QQ";
})(SharePlatform = exports.SharePlatform || (exports.SharePlatform = {}));
// ============================== 本地
/**
 * 底层接口和参数的声明
 */
native_1.registerSign(ShareToPlatforms, {
    shareContent: [
        {
            name: 'content',
            type: native_1.ParamType.String
        },
        {
            name: 'type',
            type: native_1.ParamType.Number
        },
        {
            name: 'platform',
            type: native_1.ParamType.Number
        }
    ], shareLink: [
        {
            name: 'webName',
            type: native_1.ParamType.String
        },
        {
            name: 'url',
            type: native_1.ParamType.String
        },
        {
            name: 'title',
            type: native_1.ParamType.String
        },
        {
            name: 'content',
            type: native_1.ParamType.String
        },
        {
            name: 'comment',
            type: native_1.ParamType.String
        },
        {
            name: 'platform',
            type: native_1.ParamType.Number
        }
    ],
    getScreenShot: [],
    shareScreen: [
        {
            name: 'platform',
            type: native_1.ParamType.Number
        }
    ]
});
const shareToPlatforms = new ShareToPlatforms();
shareToPlatforms.init();
});
