_$define("pi/widget/scroller/shared-utils/env", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ssr support
exports.inBrowser = typeof window !== 'undefined';
exports.ua = exports.inBrowser && navigator.userAgent.toLowerCase();
exports.isWeChatDevTools = exports.ua && /wechatdevtools/.test(exports.ua);
exports.isAndroid = exports.ua && exports.ua.indexOf('android') > 0;
});
