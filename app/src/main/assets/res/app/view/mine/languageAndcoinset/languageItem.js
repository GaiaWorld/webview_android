_$define("app/view/mine/languageAndcoinset/languageItem", function (require, exports, module){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * languageItem
 */
var event_1 = require("../../../../pi/widget/event");
var widget_1 = require("../../../../pi/widget/widget");

var LanguageItem = function (_widget_1$Widget) {
    _inherits(LanguageItem, _widget_1$Widget);

    function LanguageItem() {
        _classCallCheck(this, LanguageItem);

        var _this = _possibleConstructorReturn(this, (LanguageItem.__proto__ || Object.getPrototypeOf(LanguageItem)).call(this));

        _this.props = {
            index: 0,
            lan: '',
            checked: false
        };
        return _this;
    }

    _createClass(LanguageItem, [{
        key: "itemclick",
        value: function itemclick(event) {
            this.props.checked = true;
            event_1.notify(event.node, 'ev-radio-change', { index: this.props.index });
        }
    }]);

    return LanguageItem;
}(widget_1.Widget);

exports.LanguageItem = LanguageItem;
})