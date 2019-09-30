_$define("pi/widget/scroller/pull-down/propertiesConfig", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sourcePrefix = 'plugins.pullDownRefresh';
const propertiesMap = [
    {
        key: 'finishPullDown',
        name: 'finish'
    },
    {
        key: 'openPullDown',
        name: 'open'
    },
    {
        key: 'closePullDown',
        name: 'close'
    },
    {
        key: 'autoPullDownRefresh',
        name: 'autoPull'
    }
];
exports.default = propertiesMap.map(item => {
    return {
        key: item.key,
        sourceKey: `${sourcePrefix}.${item.name}`
    };
});
});
