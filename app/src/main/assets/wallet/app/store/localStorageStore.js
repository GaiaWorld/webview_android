_$define("app/store/localStorageStore", function (require, exports, module){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 处理localStorage上的数据
 */
// ===================================================== 导入
var tools_1 = require("../utils/tools");
var store_1 = require("./store");
// ===================================================== 导出
// ===================================================== 本地
// ===================================================== 立即执行
var setLocalStorage = function setLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
};
var getLocalStorage = function getLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
};
// tslint:disable-next-line:max-func-body-length
exports.initLocalStorageStore = function () {
    store_1.register('walletList', function (walletList) {
        var locWallets = JSON.parse(localStorage.getItem('wallets'));
        if (!locWallets) locWallets = { curWalletId: '', salt: '', walletList: [] };
        locWallets.walletList = walletList;
        localStorage.setItem('wallets', JSON.stringify(locWallets));
    });
    store_1.register('curWallet', function (curWallet) {
        var locWallets = JSON.parse(localStorage.getItem('wallets'));
        if (!curWallet) {
            var logoutAccountSave = store_1.find('flag').logoutAccountSave;
            if (logoutAccountSave) {
                locWallets.curWalletId = '';
            } else {
                var index = -1;
                for (var i = 0; i < locWallets.walletList.length; i++) {
                    if (locWallets.curWalletId === locWallets.walletList[i].walletId) {
                        index = i;
                        break;
                    }
                }
                locWallets.walletList.splice(index, 1);
                locWallets.salt = '';
                locWallets.curWalletId = '';
            }
        } else {
            locWallets.walletList = locWallets.walletList.map(function (v) {
                if (v.walletId === curWallet.walletId) {
                    v = curWallet;
                    locWallets.curWalletId = curWallet.walletId;
                }
                return v;
            });
        }
        localStorage.setItem('wallets', JSON.stringify(locWallets));
        // ===============================更新walletList
        var walletList = JSON.parse(localStorage.getItem('wallets')).walletList;
        store_1.updateStore('walletList', walletList);
    });
    store_1.register('salt', function (salt) {
        var locWallets = JSON.parse(localStorage.getItem('wallets'));
        if (!locWallets) locWallets = { curWalletId: '', salt: '', walletList: [] };
        locWallets.salt = salt;
        localStorage.setItem('wallets', JSON.stringify(locWallets));
    });
    store_1.register('addrs', function (addrs) {
        if (!addrs) return;
        var firstEthAddr = tools_1.getFirstEthAddr();
        var addrsMap = new Map(getLocalStorage('addrsMap'));
        addrsMap.set(firstEthAddr, addrs);
        localStorage.setItem('addrsMap', JSON.stringify(addrsMap));
    });
    store_1.register('transactions', function (transactions) {
        if (!transactions) return;
        var firstEthAddr = tools_1.getFirstEthAddr();
        var transactionsMap = new Map(getLocalStorage('transactionsMap'));
        transactionsMap.set(firstEthAddr, transactions);
        localStorage.setItem('transactionsMap', JSON.stringify(transactionsMap));
    });
    // 锁屏相关
    store_1.register('lockScreen', function (ls) {
        setLocalStorage('lockScreen', ls);
    });
    // 发送红包记录
    store_1.register('sHisRec', function (sHisRec) {
        var sHisRecMap = new Map(getLocalStorage('sHisRecMap'));
        if (!sHisRec) {
            sHisRecMap.delete(tools_1.getFirstEthAddr());
        } else {
            sHisRecMap.set(tools_1.getFirstEthAddr(), sHisRec);
        }
        setLocalStorage('sHisRecMap', sHisRecMap);
    });
    // 兑换红包记录
    store_1.register('cHisRec', function (cHisRec) {
        var cHisRecMap = new Map(getLocalStorage('cHisRecMap'));
        if (!cHisRec) {
            cHisRecMap.delete(tools_1.getFirstEthAddr());
        } else {
            cHisRecMap.set(tools_1.getFirstEthAddr(), cHisRec);
        }
        setLocalStorage('cHisRecMap', cHisRecMap);
    });
    // 邀请红包记录
    store_1.register('inviteRedBagRec', function (inviteRedBagRec) {
        var inviteRedBagRecMap = new Map(getLocalStorage('inviteRedBagRecMap'));
        if (!inviteRedBagRec) {
            inviteRedBagRecMap.delete(tools_1.getFirstEthAddr());
        } else {
            inviteRedBagRecMap.set(tools_1.getFirstEthAddr(), inviteRedBagRec);
        }
        setLocalStorage('inviteRedBagRecMap', inviteRedBagRecMap);
    });
    // shapeshift交易记录
    store_1.register('shapeShiftTxsMap', function (shapeShiftTxsMap) {
        setLocalStorage('shapeShiftTxsMap', shapeShiftTxsMap);
    });
    store_1.register('lastGetSmsCodeTime', function (lastGetSmsCodeTime) {
        setLocalStorage('lastGetSmsCodeTime', lastGetSmsCodeTime);
    });
    // 本地eth nonce
    store_1.register('nonceMap', function (nonceMap) {
        setLocalStorage('nonceMap', nonceMap);
    });
    // 本地realUserMap
    store_1.register('realUserMap', function (realUserMap) {
        setLocalStorage('realUserMap', realUserMap);
    });
    // 本地token
    store_1.register('token', function (token) {
        setLocalStorage('token', token);
    });
    // 缓存gasPrice
    store_1.register('gasPrice', function (gasPrice) {
        setLocalStorage('gasPrice', gasPrice);
    });
    // gasLimitMap
    store_1.register('gasLimitMap', function (gasLimitMap) {
        setLocalStorage('gasLimitMap', gasLimitMap);
    });
    // 缓存gasPrice
    store_1.register('btcMinerFee', function (btcMinerFee) {
        setLocalStorage('btcMinerFee', btcMinerFee);
    });
    // 语言设置
    store_1.register('languageSet', function (language) {
        setLocalStorage('languageSet', language);
    });
    // 涨跌颜色设置
    store_1.register('changeColor', function (changeColor) {
        setLocalStorage('changeColor', changeColor);
    });
    // 涨跌颜色设置
    store_1.register('currencyUnit', function (currencyUnit) {
        setLocalStorage('currencyUnit', currencyUnit);
    });
    // 人民币美元汇率
    store_1.register('USD2CNYRate', function (USD2CNYRate) {
        setLocalStorage('USD2CNYRate', USD2CNYRate);
    });
    // 货币对比USDT的比率
    store_1.register('currency2USDTMap', function (currency2USDTMap) {
        setLocalStorage('currency2USDTMap', currency2USDTMap);
    });
};
})