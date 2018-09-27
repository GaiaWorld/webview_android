_$define("app/view/wallet/cloudWallet/otherRecord", function (require, exports, module){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * other record
 */
var widget_1 = require("../../../../pi/widget/widget");
var pull_1 = require("../../../net/pull");
var store_1 = require("../../../store/store");
var forelet_1 = require("../../../../pi/widget/forelet");
var interface_1 = require("../../../store/interface");
var tools_1 = require("../../../utils/tools");
exports.forelet = new forelet_1.Forelet();
exports.WIDGET_NAME = module.id.replace(/\//g, '-');

var otherRecord = function (_widget_1$Widget) {
    _inherits(otherRecord, _widget_1$Widget);

    function otherRecord() {
        _classCallCheck(this, otherRecord);

        return _possibleConstructorReturn(this, (otherRecord.__proto__ || Object.getPrototypeOf(otherRecord)).apply(this, arguments));
    }

    _createClass(otherRecord, [{
        key: "setProps",
        value: function setProps(props, oldProps) {
            _get(otherRecord.prototype.__proto__ || Object.getPrototypeOf(otherRecord.prototype), "setProps", this).call(this, props, oldProps);
            this.init();
        }
    }, {
        key: "init",
        value: function init() {
            if (this.props.isActive) {
                pull_1.getAccountDetail(this.props.currencyName);
            }
            this.state = {
                recordList: [],
                nextStart: 0,
                canLoadMore: false,
                isRefreshing: false
            };
        }
    }, {
        key: "updateRecordList",
        value: function updateRecordList() {
            var accountDetail = store_1.getBorn('accountDetail').get(interface_1.CurrencyType[this.props.currencyName]);
            console.log(accountDetail);
            var list = accountDetail.list;
            this.state.nextStart = accountDetail.start;
            this.state.canLoadMore = accountDetail.canLoadMore;
            this.state.recordList = this.parseRecordList(list);
            this.state.isRefreshing = false;
            this.paint();
        }
    }, {
        key: "parseRecordList",
        value: function parseRecordList(list) {
            list.forEach(function (item) {
                item.amountShow = item.amount >= 0 ? "+" + item.amount : "" + item.amount;
                item.timeShow = tools_1.timestampFormat(item.time).slice(5);
                item.iconShow = "" + item.behaviorIcon;
            });
            return list;
        }
    }, {
        key: "loadMore",
        value: function loadMore() {
            pull_1.getAccountDetail(this.props.currencyName, this.state.nextStart);
        }
    }, {
        key: "getMoreList",
        value: function getMoreList() {
            var h1 = document.getElementById('recharge-scroller-container').offsetHeight;
            var h2 = document.getElementById('recharge-content-container').offsetHeight;
            var scrollTop = document.getElementById('recharge-scroller-container').scrollTop;
            if (this.state.canLoadMore && !this.state.isRefreshing && h2 - h1 - scrollTop < 20) {
                this.state.isRefreshing = true;
                this.paint();
                console.log('加载中，请稍后~~~');
                this.loadMore();
            }
        }
    }]);

    return otherRecord;
}(widget_1.Widget);

exports.otherRecord = otherRecord;
store_1.register('accountDetail', function () {
    var w = exports.forelet.getWidget(exports.WIDGET_NAME);
    if (w) {
        w.updateRecordList();
    }
});
})