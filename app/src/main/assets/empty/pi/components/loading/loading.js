_$define("pi/components/loading/loading", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * loading逻辑处理
 */
const widget_1 = require("../../widget/widget");
class Loading extends widget_1.Widget {
    constructor() {
        super();
    }
    create() {
        super.create();
        this.config = { value: { group: 'top' } };
    }
    setProps(props, oldProps) {
        super.setProps(props, oldProps);
        this.state = {
            circular: `<svg viewBox='25 25 50 50' class='pi-circular'>
            <circle cx='50' cy='50' r='20' fill='none' class="pi-path">
            </circle>
            </svg>`,
            startTime: new Date().getTime()
        };
    }
    close() {
        const INTERVAL = 500;
        const endTime = new Date().getTime();
        const interval = endTime - this.state.startTime;
        if (interval >= INTERVAL) {
            this.ok && this.ok();
        }
        else {
            setTimeout(() => {
                this.ok && this.ok();
            }, INTERVAL - interval);
        }
    }
}
exports.Loading = Loading;
});
