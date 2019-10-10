_$define("app/view/home", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const widget_1 = require("../../pi/widget/widget");
const webview_1 = require("../../pi/browser/webview");
const listenerStore_1 = require("../postMessage/listenerStore");
/**
 * home
 */
class Home extends widget_1.Widget {
    goGame() {
        const gameUrl = 'http://192.168.31.226/game/app/boot/index.html';
        webview_1.WebViewManager.open('game', gameUrl, '游戏', '');
        webview_1.WebViewManager.close('wallet');
    }
}
exports.Home = Home;
listenerStore_1.addStoreListener('user', user => {
    console.log(`addStoreListener user ${user}`);
});
});
