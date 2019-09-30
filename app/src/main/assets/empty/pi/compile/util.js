_$define("pi/compile/util", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pathMode = require("path");
let os = require("os");
exports.resolve = (path) => {
    let rp = pathMode.resolve(path); //绝对路径
    let ps = path.split("\\");
    let rps = rp.split("\\");
    let len = ps.length;
    for (let i = 0; i < len; i++) {
        if (ps[i] === "..") {
            ps[i] = rps[rps.length - (len - i)];
        }
        else if (ps[i] === ".") { //i = 0时才可能是"."
            ps = ps.slice(1, len);
            break;
        }
        else {
            break;
        }
    }
    return ps.join("/");
};
//计算路径
exports.parsePath = (selfPath, dstPath) => {
    let p = pathMode.relative(selfPath, dstPath).replace(/\\/g, "/");
    let pp = p.split("/");
    if (pp[0] && pp[0] === "..") {
        if (pp[1] !== "..") {
            pp[0] = ".";
        }
        else {
            pp = pp.slice(1, pp.length);
        }
    }
    return pp.join("/");
};
exports.relativePath = (root, path) => {
    let p;
    if (os.platform() == "linux") {
        root = root.replace(/\\/ig, "/");
        p = pathMode.relative(root, path);
    }
    else {
        p = pathMode.relative(pathMode.resolve(root), path);
    }
    p = p.replace(/\\/ig, "/");
    return p;
};
});
