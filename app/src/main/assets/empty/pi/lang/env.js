_$define("pi/lang/env", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Env {
    get(name) {
        let r = this.other.get(name);
        if (!r) {
            return;
        }
        if (r instanceof Object) {
            if (r[0]) {
                if (r[1]) {
                    return r[1](r[0]);
                }
                else {
                    return r[0];
                }
            }
        }
        return r;
    }
    set(name, obj) {
        if (this.other.get(name)) {
            throw new Error("NativeObject is exist! name:" + name);
        }
        this.other.set(name, obj);
    }
}
exports.Env = Env;
});
