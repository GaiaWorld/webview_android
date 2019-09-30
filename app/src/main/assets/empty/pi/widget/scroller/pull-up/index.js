_$define("pi/widget/scroller/pull-up/index", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const direction_1 = require("../core/enums/direction");
const probe_1 = require("../core/enums/probe");
const propertiesConfig_1 = require("./propertiesConfig");
class PullUp {
    constructor(bscroll) {
        this.bscroll = bscroll;
        this.watching = false;
        if (bscroll.options.pullUpLoad) {
            this._watch();
        }
        this.bscroll.registerType(['pullingUp']);
        this.bscroll.proxy(propertiesConfig_1.default);
    }
    _watch() {
        if (this.watching) {
            return;
        }
        // must watch scroll in real time
        this.bscroll.options.probeType = probe_1.Probe.Realtime;
        this.watching = true;
        this.bscroll.on('scroll', this._checkToEnd, this);
    }
    _checkToEnd(pos) {
        if (!this.bscroll.options.pullUpLoad) {
            return;
        }
        const { threshold = 0 } = this.bscroll.options
            .pullUpLoad;
        if (this.bscroll.movingDirectionY === direction_1.Direction.Positive &&
            pos.y <= this.bscroll.maxScrollY + threshold) {
            // reset pullupWatching status after scroll end to promise that trigger 'pullingUp' only once when pulling up
            this.bscroll.once('scrollEnd', () => {
                this.watching = false;
            });
            this.bscroll.trigger('pullingUp');
            this.bscroll.off('scroll', this._checkToEnd);
        }
    }
    finish() {
        if (this.watching) {
            this.bscroll.once('scrollEnd', this._watch, this);
        }
        else {
            this._watch();
        }
    }
    open(config = true) {
        this.bscroll.options.pullUpLoad = config;
        this._watch();
    }
    close() {
        this.bscroll.options.pullUpLoad = false;
        if (!this.watching) {
            return;
        }
        this.watching = false;
        this.bscroll.off('scroll', this._checkToEnd);
    }
}
PullUp.pluginName = 'pullUpLoad';
exports.PullUp = PullUp;
});
