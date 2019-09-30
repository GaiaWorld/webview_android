_$define("pi/struct/meta_init", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const struct_mgr_1 = require("./struct_mgr");
exports.init = () => {
    exports.mgr = new struct_mgr_1.StructMgr();
    for (var id in pi_modules) {
        if (pi_modules.hasOwnProperty(id) && pi_modules[id].exports) {
            for (var kk in pi_modules[id].exports) {
                var c = pi_modules[id].exports[kk];
                if (struct_mgr_1.Struct.isPrototypeOf(c) && c._$info) {
                    //console.log(c._$info.name_hash, c._$info.name);
                    exports.mgr.register(c._$info.name_hash, c, c._$info.name);
                }
            }
        }
    }
};
});
