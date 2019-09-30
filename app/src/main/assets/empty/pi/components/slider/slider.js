_$define("pi/components/slider/slider", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 消息框
 */
const root_1 = require("../../ui/root");
const event_1 = require("../../widget/event");
const widget_1 = require("../../widget/widget");
const dom_1 = require("../../widget/scroller_deserted/dom");
class Message extends widget_1.Widget {
    constructor() {
        super();
        this.dragging = false;
        this.isClick = false;
        this.startX = 0;
        this.currentX = 0;
        this.sliderSize = 1;
    }
    setProps(props, oldProps) {
        super.setProps(props, oldProps);
        this.state = {};
        this.init();
    }
    /**
     * 处理按钮按下
     */
    doButtonDown(event) {
        event.preventDefault();
        this.onDragStart(event);
        dom_1.addEvent(window, 'mousemove', this, true);
        dom_1.addEvent(window, 'touchmove', this, true);
        dom_1.addEvent(window, 'mouseup', this, true);
        dom_1.addEvent(window, 'touchend', this, true);
        dom_1.addEvent(window, 'contextmenu', this, true);
    }
    handleEvent(e) {
        switch (e.type) {
            case 'mousemove':
            case 'touchmove':
                this.onDragging(e);
                break;
            case 'mouseup':
            case 'touchend':
            case 'contextmenu':
                this.onDragEnd(e);
                break;
            default:
        }
    }
    /**
     * 数量改变
     */
    selectCountChange(e) {
        this.showValue(e.value);
    }
    init() {
        this.props.value = this.props.value || 0;
        this.props.max = this.props.max || 100;
        this.props.min = this.props.min || 0;
        this.props.step = this.props.step || 1;
        this.props.precision = this.props.precision || 0;
        this.props.showValue = this.props.showValue || false;
        this.state.showValue = this.props.value / (this.props.max - this.props.min) * 100;
    }
    onDragStart(event) {
        this.dragging = true;
        this.isClick = true;
        if (event.type === 'touchstart') {
            event.clientY = event.touches[0].clientY;
            event.clientX = event.touches[0].clientX;
        }
        this.startX = event.clientX;
        this.sliderSize = event.currentTarget.parentNode.parentNode.offsetWidth / 100 * root_1.getScale();
        this.startPosition = this.state.showValue;
        this.newPosition = this.startPosition;
    }
    onDragging(event) {
        // todo 处理滑动事件
        if (this.dragging) {
            this.isClick = false;
            let diff = 0;
            if (event.type === 'touchmove') {
                event.clientY = event.touches[0].clientY;
                event.clientX = event.touches[0].clientX;
            }
            this.currentX = event.clientX;
            diff = (this.currentX - this.startX) / this.sliderSize;
            this.newPosition = this.startPosition + diff;
            this.setPosition(this.newPosition);
        }
    }
    onDragEnd(event) {
        if (this.dragging) {
            /*
             * 防止在 mouseup 后立即触发 click，导致滑块有几率产生一小段位移
             * 不使用 preventDefault 是因为 mouseup 和 click 没有注册在同一个 DOM 上
             */
            setTimeout(() => {
                this.dragging = false;
                if (!this.isClick) {
                    this.setPosition(this.newPosition);
                }
            }, 0);
            dom_1.removeEvent(window, 'mousemove', this, true);
            dom_1.removeEvent(window, 'touchmove', this, true);
            dom_1.removeEvent(window, 'mouseup', this, true);
            dom_1.removeEvent(window, 'touchend', this, true);
            dom_1.removeEvent(window, 'contextmenu', this, true);
        }
    }
    setPosition(newPosition) {
        if (newPosition === null)
            return;
        if (newPosition < 0) {
            newPosition = 0;
        }
        else if (newPosition > 100) {
            newPosition = 100;
        }
        const lengthPerStep = 100 / ((this.props.max - this.props.min) / this.props.step);
        const steps = Math.round(newPosition / lengthPerStep * Math.pow(10, this.props.precision));
        let value = steps * lengthPerStep * (this.props.max - this.props.min) * 0.01 + this.props.min;
        value = value / Math.pow(10, this.props.precision);
        this.showValue(value);
    }
    showValue(value) {
        this.state.showValue = value / (this.props.max - this.props.min) * 100;
        this.props.value = value;
        this.paint();
        event_1.notify(this.parentNode, 'ev-slider-change', { value: this.props.value });
    }
}
exports.Message = Message;
});
