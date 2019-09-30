_$define("pi/widget/scroller/pull-up/propertiesConfig", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sourcePrefix = 'plugins.pullUpLoad';
const propertiesMap = [
    {
        key: 'finishPullUp',
        name: 'finish'
    },
    {
        key: 'openPullUp',
        name: 'open'
    },
    {
        key: 'closePullUp',
        name: 'close'
    }
];
exports.default = propertiesMap.map(item => {
    return {
        key: item.key,
        sourceKey: `${sourcePrefix}.${item.name}`
    };
});
});
