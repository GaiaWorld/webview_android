_$define("pi/widget/scroller/core/index", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventEmitter_1 = require("./base/EventEmitter");
const Options_1 = require("./Options");
const Scroller_1 = require("./scroller/Scroller");
const index_1 = require("../shared-utils/index");
const bubbling_1 = require("./utils/bubbling");
const propertiesConfig_1 = require("./propertiesConfig");
const enforce_order_1 = require("./enums/enforce-order");
class BScroll extends EventEmitter_1.EventEmitter {
    constructor(el, options) {
        super([
            'refresh',
            'enable',
            'disable',
            'beforeScrollStart',
            'scrollStart',
            'scroll',
            'scrollEnd',
            'scrollCancel',
            'touchEnd',
            'flick',
            'destroy'
        ]);
        const wrapper = index_1.getElement(el);
        if (!wrapper) {
            index_1.warn('Can not resolve the wrapper DOM.');
            return;
        }
        const content = wrapper.children[0];
        if (!content) {
            index_1.warn('The wrapper need at least one child element to be scroller.');
            return;
        }
        this.plugins = {};
        this.options = new Options_1.Options().merge(options).process();
        this.hooks = new EventEmitter_1.EventEmitter([
            'init',
            'refresh',
            'enable',
            'disable',
            'destroy'
        ]);
        this.init(wrapper);
    }
    static use(ctor) {
        const name = ctor.pluginName;
        const installed = this.plugins.some(plugin => ctor === plugin.ctor);
        if (installed)
            return this;
        if (index_1.isUndef(name)) {
            index_1.warn(`Plugin Class must specify plugin's name in static property by 'pluginName' field.`);
            return this;
        }
        if (this.pluginsMap[name]) {
            index_1.warn(`This plugin has been registered, maybe you need change plugin's name`);
            return this;
        }
        this.pluginsMap[name] = true;
        this.plugins.push({
            name,
            enforce: ctor.enforce,
            ctor
        });
        return this;
    }
    init(wrapper) {
        this.wrapper = wrapper;
        wrapper.isBScroll = true;
        this.scroller = new Scroller_1.Scroller(wrapper, this.options);
        this.eventBubbling();
        this.handleAutoBlur();
        this.innerRefresh();
        this.scroller.scrollTo(this.options.startX, this.options.startY);
        this.enable();
        this.proxy(propertiesConfig_1.propertiesConfig);
        this.applyPlugins();
    }
    applyPlugins() {
        const options = this.options;
        this.constructor.plugins
            .sort((a, b) => {
            const enforeOrderMap = {
                [enforce_order_1.EnforceOrder.Pre]: -1,
                [enforce_order_1.EnforceOrder.Post]: 1
            };
            const aOrder = a.enforce ? enforeOrderMap[a.enforce] : 0;
            const bOrder = b.enforce ? enforeOrderMap[b.enforce] : 0;
            return aOrder - bOrder;
        })
            .forEach((item) => {
            let ctor = item.ctor;
            if (options[item.name] && typeof ctor === 'function') {
                this.plugins[item.name] = new ctor(this);
            }
        });
    }
    handleAutoBlur() {
        if (this.options.autoBlur) {
            this.on(this.eventTypes.beforeScrollStart, () => {
                let activeElement = document.activeElement;
                if (activeElement &&
                    (activeElement.tagName === 'INPUT' ||
                        activeElement.tagName === 'TEXTAREA')) {
                    activeElement.blur();
                }
            });
        }
    }
    eventBubbling() {
        bubbling_1.bubbling(this.scroller.hooks, this, [
            'beforeScrollStart',
            'scrollStart',
            'scroll',
            'scrollEnd',
            'scrollCancel',
            'touchEnd',
            'flick'
        ]);
    }
    innerRefresh() {
        this.scroller.refresh();
        this.hooks.trigger(this.hooks.eventTypes.refresh);
        this.trigger(this.eventTypes.refresh);
    }
    proxy(propertiesConfig) {
        propertiesConfig.forEach(({ key, sourceKey }) => {
            index_1.propertiesProxy(this, sourceKey, key);
        });
    }
    refresh() {
        this.innerRefresh();
        this.scroller.resetPosition();
    }
    enable() {
        this.scroller.enable();
        this.hooks.trigger(this.hooks.eventTypes.enable);
        this.trigger(this.eventTypes.enable);
    }
    disable() {
        this.scroller.disable();
        this.hooks.trigger(this.hooks.eventTypes.disable);
        this.trigger(this.eventTypes.disable);
    }
    destroy() {
        this.hooks.trigger(this.hooks.eventTypes.destroy);
        this.trigger(this.eventTypes.destroy);
        this.scroller.destroy();
    }
    eventRegister(names) {
        this.registerType(names);
    }
}
BScroll.plugins = [];
BScroll.pluginsMap = {};
exports.BScroll = BScroll;
// export { Options }
});
