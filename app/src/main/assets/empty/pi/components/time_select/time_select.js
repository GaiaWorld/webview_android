_$define("pi/components/time_select/time_select", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 输入框的逻辑处理
 */
const widget_1 = require("../../widget/widget");
const event_1 = require("../../widget/event");
class TimeSelect extends widget_1.Widget {
    constructor() {
        super();
    }
    setProps(props, oldProps) {
        super.setProps(props, oldProps);
        let timeList = this.calcTimeList();
        this.state = {
            timeList,
            showTimeList: false,
            currentValue: "",
            currentIndex: -1
        };
    }
    focus() {
        this.state.showTimeList = true;
        this.paint();
    }
    blur(event) {
        this.state.showTimeList = false;
        this.paint();
    }
    timeSelectItemClickListener(event, index) {
        this.state.currentIndex = index;
        this.state.currentValue = this.state.timeList[index];
        this.state.showTimeList = false;
        event_1.notify(event.node, "ev-input-select", { value: this.state.currentValue });
        this.paint(true);
    }
    clear() {
        this.state.currentIndex = -1;
        this.state.currentValue = "";
        this.paint();
    }
    //计算时间列表
    calcTimeList() {
        const start = this.props.start;
        const end = this.props.end;
        const step = this.props.step;
        const result = [];
        if (start && end && step) {
            let current = start;
            while (this.compareTime(current, end) <= 0) {
                result.push(current);
                current = this.nextTime(current, step);
            }
        }
        return result;
    }
    parseTime(time) {
        const values = (time || '').split(':');
        if (values.length >= 2) {
            const hours = parseInt(values[0], 10);
            const minutes = parseInt(values[1], 10);
            return {
                hours,
                minutes
            };
        }
        /* istanbul ignore next */
        return null;
    }
    ;
    formatTime(time) {
        return (time.hours < 10 ? '0' + time.hours : time.hours) + ':' + (time.minutes < 10 ? '0' + time.minutes : time.minutes);
    }
    ;
    compareTime(time1, time2) {
        const value1 = this.parseTime(time1);
        const value2 = this.parseTime(time2);
        const minutes1 = value1.minutes + value1.hours * 60;
        const minutes2 = value2.minutes + value2.hours * 60;
        if (minutes1 === minutes2) {
            return 0;
        }
        return minutes1 > minutes2 ? 1 : -1;
    }
    ;
    nextTime(time, step) {
        const timeValue = this.parseTime(time);
        const stepValue = this.parseTime(step);
        const next = {
            hours: timeValue.hours,
            minutes: timeValue.minutes
        };
        next.minutes += stepValue.minutes;
        next.hours += stepValue.hours;
        next.hours += Math.floor(next.minutes / 60);
        next.minutes = next.minutes % 60;
        return this.formatTime(next);
    }
    ;
}
exports.TimeSelect = TimeSelect;
});
