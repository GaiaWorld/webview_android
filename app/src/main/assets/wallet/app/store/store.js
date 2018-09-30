_$define("app/store/store", function (require, exports, module){
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file store
 * @author donghr
 */
// ============================================ 导入
var event_1 = require("../../pi/util/event");
var math_1 = require("../../pi/util/math");
var tools_1 = require("../utils/tools");
// tslint:disable-next-line:max-line-length
var interface_1 = require("./interface");
// ============================================ 导出
/**
 * 根据keyName返回相应的数据，map数据会被转换为数组
 * 若传入id参数,则会取相应map的值
 */
// tslint:disable-next-line:no-any
exports.find = function (keyName, id) {
    if (!id) {
        var _value = store[keyName];
        if (!(_value instanceof Map)) {
            return _value instanceof Object ? tools_1.depCopy(_value) : _value;
        }
        var arr = [];
        for (var _iterator = _value, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
            var _ref;

            if (_isArray) {
                if (_i >= _iterator.length) break;
                _ref = _iterator[_i++];
            } else {
                _i = _iterator.next();
                if (_i.done) break;
                _ref = _i.value;
            }

            var _ref2 = _ref,
                _ref3 = _slicedToArray(_ref2, 2),
                v = _ref3[1];

            arr.push(v);
        }
        return tools_1.depCopy(arr);
    }
    var value = store[keyName].get(id);
    if (value instanceof Map) {
        var result = value.get(id);
        return result && tools_1.depCopy(result);
    } else {
        return value && tools_1.depCopy(value);
    }
};
/**
 * 返回原始数据结构
 */
exports.getBorn = function (keyname) {
    return store[keyname];
};
/**
 * 更新store并通知
 */
// tslint:disable-next-line:no-any
exports.updateStore = function (keyName, data) {
    var notified = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    store[keyName] = data;
    if (notified) handlerMap.notify(keyName, [data]);
};
/**
 * 更新store---后续考虑移除
 */
exports.notify = function (keyName, data) {
    handlerMap.notify(keyName, [data]);
};
/**
 * 消息处理器
 */
exports.register = function (keyName, cb) {
    handlerMap.add(keyName, cb);
};
exports.unregister = function (keyName, cb) {
    handlerMap.remove(keyName, cb);
};
/**
 * 初始化store
 */
exports.initStore = function () {
    // 从localStorage中取wallets
    var wallets = findByLoc('wallets');
    store.walletList = wallets && wallets.walletList || [];
    store.curWallet = wallets && wallets.walletList.length > 0 && wallets.walletList.filter(function (v) {
        return v.walletId === wallets.curWalletId;
    })[0];
    var firstEthAddr = tools_1.getFirstEthAddr();
    // 从localStorage中取addrs
    store.addrs = new Map(findByLoc('addrsMap')).get(firstEthAddr) || [];
    // 从localStorage中取transactions
    store.transactions = new Map(findByLoc('transactionsMap')).get(firstEthAddr) || [];
    // 从localStorage中的wallets中初始化salt
    store.salt = wallets && wallets.salt || math_1.cryptoRandomInt().toString();
    // 从localStorage中的wallets中初始化curWallet
    // 从localStorage中取readedPriAgr
    store.token = findByLoc('token');
    // 从localStorage中取lockScreen
    store.lockScreen = findByLoc('lockScreen') || {};
    // 从localStorage中取sHisRecMap
    var sHisRecMap = new Map(findByLoc('sHisRecMap'));
    store.sHisRec = sHisRecMap.get(tools_1.getFirstEthAddr());
    // 从localStorage中取cHisRecMap
    var cHisRecMap = new Map(findByLoc('cHisRecMap'));
    store.cHisRec = cHisRecMap.get(tools_1.getFirstEthAddr());
    // 从localStorage中取inviteRedBagRecMap
    var inviteRedBagRecMap = new Map(findByLoc('inviteRedBagRecMap'));
    store.inviteRedBagRec = inviteRedBagRecMap.get(tools_1.getFirstEthAddr());
    // 从localStorage中取inviteRedBagRecMap
    store.shapeShiftTxsMap = new Map(findByLoc('shapeShiftTxsMap'));
    // 从localStorage中取nonceMap
    store.nonceMap = new Map(findByLoc('nonceMap'));
    // 从localStorage中取realUserMap
    store.realUserMap = new Map(findByLoc('realUserMap'));
    // 初始化默认兑换汇率列表
    store.exchangeRateJson = tools_1.fetchDefaultExchangeRateJson();
};
var findByLoc = function findByLoc(keyName) {
    var value = JSON.parse(localStorage.getItem(keyName));
    return value instanceof Object ? tools_1.depCopy(value) : value;
};
// ============================================ 立即执行
/**
 * 消息处理列表
 */
var handlerMap = new event_1.HandlerMap();
// tslint:disable-next-line:no-object-literal-type-assertion
var store = {
    flag: {},
    // 基础数据
    hashMap: new Map(),
    salt: '',
    conUser: '',
    conUserPublicKey: '',
    conRandom: '',
    conUid: 0,
    userInfo: null,
    loginState: interface_1.LoginState.init,
    coinGain: new Map(),
    token: '',
    // 本地钱包
    walletList: [],
    curWallet: null,
    addrs: [],
    transactions: [],
    exchangeRateJson: new Map(),
    lockScreen: null,
    nonceMap: new Map(),
    gasPrice: {},
    btcMinerFee: {},
    realUserMap: new Map(),
    // 云端数据
    cloudBalance: new Map(),
    // tslint:disable-next-line:type-literal-delimiter
    accountDetail: new Map(),
    sHisRec: null,
    cHisRec: null,
    inviteRedBagRec: null,
    miningTotal: null,
    dividTotal: null,
    miningHistory: null,
    dividHistory: null,
    addMine: [],
    mineRank: null,
    miningRank: null,
    mineItemJump: '',
    // tslint:disable-next-line:type-literal-delimiter
    rechargeLogs: new Map(),
    // tslint:disable-next-line:type-literal-delimiter
    withdrawLogs: new Map(),
    // shapeshift
    shapeShiftCoins: [],
    shapeShiftMarketInfo: null,
    shapeShiftTxsMap: new Map(),
    // 理财
    // 所有理财产品
    productList: [],
    // 已购买理财产品
    purchaseRecord: [],
    lastGetSmsCodeTime: 0,
    languageSet: null
};
//重置云端数据
exports.logoutInit = function () {
    exports.updateStore('loginState', interface_1.LoginState.init);
    exports.updateStore('flag', {});
    exports.updateStore('salt', "");
    exports.updateStore('conUser', '');
    exports.updateStore('conUserPublicKey', '');
    exports.updateStore('conRandom', '');
    exports.updateStore('conUid', '');
    exports.updateStore('userInfo', null);
    exports.updateStore('curWallet', null);
    exports.updateStore('addrs', null);
    exports.updateStore('transactions', null);
    exports.updateStore('lockScreen', null);
    exports.updateStore('sHisRec', null);
    exports.updateStore('cHisRec', null);
    exports.updateStore('inviteRedBagRec', null);
    exports.updateStore('token', "");
    exports.updateStore('cloudBalance', new Map());
    exports.updateStore('accountDetail', new Map());
    exports.updateStore('miningTotal', null);
    exports.updateStore('dividTotal', null);
    exports.updateStore('miningHistory', null);
    exports.updateStore('dividHistory', null);
    exports.updateStore('addMine', []);
    exports.updateStore('mineRank', null);
    exports.updateStore('miningRank', null);
    exports.updateStore('mineItemJump', "");
    exports.updateStore('rechargeLogs', new Map());
    exports.updateStore('withdrawLogs', new Map());
    exports.updateStore('shapeShiftTxsMap', new Map());
    exports.updateStore('productList', []);
    exports.updateStore('purchaseRecord', []);
};
})