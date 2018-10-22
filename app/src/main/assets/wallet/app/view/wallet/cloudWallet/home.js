_$define("app/view/wallet/cloudWallet/home", function (require, exports, module){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * cloud wallet home
 */
var root_1 = require("../../../../pi/ui/root");
var forelet_1 = require("../../../../pi/widget/forelet");
var widget_1 = require("../../../../pi/widget/widget");
var interface_1 = require("../../../store/interface");
var store_1 = require("../../../store/store");
var tools_1 = require("../../../utils/tools");
var pull_1 = require("../../../net/pull");
exports.forelet = new forelet_1.Forelet();
exports.WIDGET_NAME = module.id.replace(/\//g, '-');

var CloudWalletHome = function (_widget_1$Widget) {
    _inherits(CloudWalletHome, _widget_1$Widget);

    function CloudWalletHome() {
        _classCallCheck(this, CloudWalletHome);

        return _possibleConstructorReturn(this, (CloudWalletHome.__proto__ || Object.getPrototypeOf(CloudWalletHome)).apply(this, arguments));
    }

    _createClass(CloudWalletHome, [{
        key: "setProps",
        value: function setProps(props, oldProps) {
            _get(CloudWalletHome.prototype.__proto__ || Object.getPrototypeOf(CloudWalletHome.prototype), "setProps", this).call(this, props, oldProps);
            this.init();
            pull_1.getAccountDetail(props.currencyName, 0);
            pull_1.getAccountDetail(props.currencyName, 1);
            pull_1.getRechargeLogs(props.currencyName);
            pull_1.getWithdrawLogs(props.currencyName);
        }
    }, {
        key: "init",
        value: function init() {
            var currencyName = this.props.currencyName;
            var balance = store_1.getBorn('cloudBalance').get(interface_1.CurrencyType[currencyName]) || 0;
            var balanceValue = tools_1.formatBalanceValue(tools_1.fetchBalanceValueOfCoin(currencyName, balance));
            var cfg = tools_1.getLanguage(this);
            var color = store_1.find('changeColor');
            this.state = {
                tabs: [{
                    tab: cfg.total,
                    components: 'app-view-wallet-cloudWallet-totalRecord'
                }, {
                    tab: cfg.other,
                    components: 'app-view-wallet-cloudWallet-otherRecord'
                }, {
                    tab: cfg.recharge,
                    components: 'app-view-wallet-cloudWallet-rechargeRecord'
                }, {
                    tab: cfg.withdraw,
                    components: 'app-view-wallet-cloudWallet-withdrawRecord'
                }],
                activeNum: 0,
                gain: tools_1.fetchCoinGain(currencyName),
                rate: tools_1.formatBalanceValue(tools_1.fetchBalanceValueOfCoin(currencyName, 1)),
                balance: balance,
                balanceValue: balanceValue,
                cfgData: cfg,
                redUp: color ? color.selected === 0 : true
            };
        }
    }, {
        key: "updateBalance",
        value: function updateBalance() {
            var currencyName = this.props.currencyName;
            this.state.balance = store_1.getBorn('cloudBalance').get(interface_1.CurrencyType[currencyName]) || 0;
            this.state.balanceValue = tools_1.formatBalanceValue(tools_1.fetchBalanceValueOfCoin(currencyName, this.state.balance));
            this.paint();
        }
    }, {
        key: "tabsChangeClick",
        value: function tabsChangeClick(event, value) {
            this.state.activeNum = value;
            this.paint();
        }
    }, {
        key: "backPrePage",
        value: function backPrePage() {
            this.ok && this.ok();
        }
    }, {
        key: "rechargeClick",
        value: function rechargeClick() {
            if (this.props.currencyName === 'KT' || this.props.currencyName === 'CNYT') {
                tools_1.popNewMessage(this.state.cfgData.tips);
                return;
            }
            root_1.popNew('app-view-wallet-cloudWallet-recharge', { currencyName: this.props.currencyName });
        }
    }, {
        key: "withdrawClick",
        value: function withdrawClick() {
            if (this.props.currencyName === 'KT' || this.props.currencyName === 'CNYT') {
                tools_1.popNewMessage(this.state.cfgData.tips);
                return;
            }
            root_1.popNew('app-view-wallet-cloudWallet-withdraw', { currencyName: this.props.currencyName });
        }
    }]);

    return CloudWalletHome;
}(widget_1.Widget);

exports.CloudWalletHome = CloudWalletHome;
// ===========================
// 余额变化
store_1.register('cloudBalance', function () {
    var w = exports.forelet.getWidget(exports.WIDGET_NAME);
    if (w) {
        w.updateBalance();
    }
});
// 汇率变化
store_1.register('USD2CNYRate', function () {
    var w = exports.forelet.getWidget(exports.WIDGET_NAME);
    if (w) {
        w.updateBalance();
    }
});
// 涨跌幅变化
store_1.register('currency2USDTMap', function () {
    var w = exports.forelet.getWidget(exports.WIDGET_NAME);
    if (w) {
        w.updateBalance();
    }
});
})