_$define("pi/widget/scroller/core/base/EventRegister", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../shared-utils/index");
class EventRegister {
    constructor(wrapper, events) {
        this.wrapper = wrapper;
        this.events = events;
        this.addDOMEvents();
    }
    destroy() {
        this.removeDOMEvents();
        this.events = [];
    }
    addDOMEvents() {
        this.handleDOMEvents(index_1.addEvent);
    }
    removeDOMEvents() {
        this.handleDOMEvents(index_1.removeEvent);
    }
    handleDOMEvents(eventOperation) {
        const wrapper = this.wrapper;
        this.events.forEach((event) => {
            eventOperation(wrapper, event.name, this, !!event.capture);
        });
    }
    handleEvent(e) {
        const eventType = e.type;
        this.events.some((event) => {
            if (event.name === eventType) {
                event.handler(e);
                return true;
            }
            return false;
        });
    }
}
exports.EventRegister = EventRegister;
});
