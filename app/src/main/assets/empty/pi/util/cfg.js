_$define("pi/util/cfg", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Cfg {
    constructor() {
        this.map = new Map();
    }
    set(key, value) {
        this.map.set(key, value);
        let notes = value.get(0).constructor._$info.notes;
        if (notes) {
            let primary = notes.get("primary");
            if (primary) {
                let primarys = primary.split("-");
                for (let i = 0; i < primarys.length; i++) {
                    let primaryMap = new Map();
                    value.forEach((v, k) => {
                        primaryMap.set(v[primarys[i]], v);
                    });
                    this.map.set(`${key}#${primarys[i]}`, primaryMap);
                }
            }
        }
    }
    set_arr(key, value) {
        // this.map.set(key, value);
        if (value.length > 0) {
            let notes = value[0].constructor._$info.notes;
            if (notes) {
                let primary = notes.get("primary");
                if (primary) {
                    let primarys = primary.split("-");
                    for (let i = 0; i < primarys.length; i++) {
                        let primaryMap = new Map();
                        for (let j = 0; j < value.length; j++) {
                            let v = value[j];
                            primaryMap.set(v[primarys[i]], v);
                        }
                        this.map.set(`${key}#${primarys[i]}`, primaryMap);
                    }
                    return;
                }
            }
            let primaryMap = new Map();
            for (let j = 0; j < value.length; j++) {
                let v = value[j];
                primaryMap.set(j, v);
            }
            this.map.set(`${key}`, primaryMap);
        }
    }
    update(key, value) {
        let m = this.map.get(key);
        if (!m) {
            this.set(key, value);
        }
        else {
            let size = m.size;
            value.forEach((v, _) => {
                m.set(size++, v);
            });
            if (value.size === 0) {
                return;
            }
            let notes = value.get(0).constructor._$info.notes;
            if (notes) {
                let primary = notes.get("primary");
                if (primary) {
                    let primarys = primary.split("-");
                    for (let i = 0; i < primarys.length; i++) {
                        let map = this.map.get(`${key}#${primarys[i]}`);
                        value.forEach((v, _) => {
                            map.set(v[primarys[i]], v);
                        });
                    }
                }
            }
        }
    }
    get(key) {
        return this.map.get(key);
    }
    getPrimary(key, primary) {
        return this.map.get(`${key}#${primary}`);
    }
}
exports.Cfg = Cfg;
exports.cfgMgr = new Cfg();
});
