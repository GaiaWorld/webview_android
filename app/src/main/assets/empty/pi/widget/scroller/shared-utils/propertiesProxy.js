_$define("pi/widget/scroller/shared-utils/propertiesProxy", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const noop = function (val) { };
const sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop
};
const getProperty = (obj, key) => {
    const keys = key.split('.');
    for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]];
        if (typeof obj !== 'object' || !obj)
            return;
    }
    const lastKey = keys.pop();
    if (typeof obj[lastKey] === 'function') {
        return function () {
            return obj[lastKey].apply(obj, arguments);
        };
    }
    else {
        return obj[lastKey];
    }
};
const setProperty = (obj, key, value) => {
    const keys = key.split('.');
    let temp;
    for (let i = 0; i < keys.length - 1; i++) {
        temp = keys[i];
        if (!obj[temp])
            obj[temp] = {};
        obj = obj[temp];
    }
    obj[keys.pop()] = value;
};
function propertiesProxy(target, sourceKey, key) {
    sharedPropertyDefinition.get = function proxyGetter() {
        return getProperty(this, sourceKey);
    };
    sharedPropertyDefinition.set = function proxySetter(val) {
        setProperty(this, sourceKey, val);
    };
    Object.defineProperty(target, key, sharedPropertyDefinition);
}
exports.propertiesProxy = propertiesProxy;
});
