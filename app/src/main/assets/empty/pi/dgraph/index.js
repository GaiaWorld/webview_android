_$define("pi/dgraph/index", function (require, exports, module) {
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./clientstub"));
__export(require("./client"));
__export(require("./txn"));
__export(require("./errors"));
})
