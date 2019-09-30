_$define("pi/widget/slowdown", function (require, exports, module){
"use strict";
/**
 一般项目的目录结构：
    boot/ 启动页面
    app/a 选服界面或登录注册界面
    app/b 主界面，新手引导前3分钟用到的功能和3d显示配置（主城和开始的几个副本场景，以及马上要用到的模型、特效）
    app/b/ui
    app/c 剩余的全部的功能和3d显示配置
    app/c/ui
    app/init 选择角色 （可能的一场战斗）
    app/mod 最基础的模块
    app/ui 最基础的组件
    app/res 全部的场景资源， 进入场景前单独请求
    pi/ 底层模块

图标采用类似资源的做法，大部分放在c部分，如果需要完整显示（比如a部分），应用应该提前载入或放到app/a/中。否则需要的时候，直接实时载入。

流程：
    1、 显示封面。载入 100k 1-2秒。中间有loading显示，无进度显示。
        index.html + index.js + init.js + .depends + next.js
        同步建立通讯
    2、 显示进度条1 载入 500k 1-3秒。进度完毕后显示选服界面或登录注册界面
        加载 pi/ app/mod app/ui app/a/
        根据本地标志和服务器角色获取，判断是否第一次进入，启动slowdown选择不同流程载入。
            无角色进入是init b c的代码配置的慢加载和可选的c资源的慢下载。
            有角色进入是b c的代码配置的慢加载。
        根据首次进入或玩家进新服，进入3或4的流程
    3、选择角色
        3.1、 显示进度条2。载入 500k-1M 2-4秒。进度完毕后显示选择角色 （可能的一场战斗）
            app/init/
            渐进加载场景资源 3-5秒
            预计大概 操作3-5秒
        3.2、 显示进度条3。载入 4M 4-10秒。进度完毕后显示主界面
            app/b/
            渐进加载主城场景资源 3-5秒
            预计操作3-5分钟
        3.3、 后台载入无进度显示
            app/c/的代码配置 8M 慢加载20秒
            app/c/的资源 20M 可选的慢下载200秒
    4、 显示进度条2。加载 12M 4-10秒。 进度完毕后显示主界面
        加载 app/b/的全部 app/c/的代码配置

注意：术语加载和下载是不同的。加载包括下载，数据包括代码、组件、资源都要进内存，主要为了减少下载后写入硬盘后，然后又较短时间内被读取的损耗。 下载则仅下载，数据从内存中丢弃。

如果是微信小游戏，则代码都已经全部加载。应用也无需改变流程。
 */
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../widget/util");
const mod_1 = require("../lang/mod");
// ============================== 导出
// 默认检查时间
exports.checkTime = 100;
// 默认休眠时间
exports.sleepTime = 1000;
// 网络请求的同时下载的数量
exports.limitCount = 3;
/**
 * @description 用util.loadDir来加载文件列表，保证模块和组件会自动加载。下载顺序依赖数组的倒序。
 * @example
 */
exports.start = (filesArr, flags, resultMap, callback, ruleOut) => {
    const cb = (time) => {
        setTimeout(() => {
            exports.start(filesArr, flags, resultMap, callback, ruleOut);
        }, time || exports.sleepTime);
    };
    if (mod_1.load.loadingCount() >= exports.limitCount) {
        return cb(exports.checkTime);
    }
    let files = filesArr.pop();
    if (!files) {
        return callback();
    }
    util_1.loadDir(files, flags, resultMap, null, cb, cb, null, ruleOut, filesArr.length);
};
/**
 * @description 将目录中需要下载的文件（本地没有或不是最新的），按限制的大小（默认256k~1兆），按后缀的优先级拆成多后缀多文件列表。
 * @example
 */
exports.split = (dirs, flags, suffixSort, limitMinSize = 256 * 1024, limitMaxSize = 1024 * 1024, ruleOut) => {
    const fileList = [];
    const suffixMap = new Map;
    util_1.listDirFile(dirs, flags, fileList, suffixMap, null, null, ruleOut);
    const result = [];
    let last = 0;
    for (let suffix of suffixSort) {
        let files = suffixMap.get(suffix);
        if (!files)
            continue;
        suffixMap.delete(suffix);
        last = merge(result, last, files, limitMinSize, limitMaxSize);
    }
    // 处理剩余的后缀
    for (let files of suffixMap.values()) {
        last = merge(result, last, files, limitMinSize, limitMaxSize);
    }
    return result.reverse();
};
// ============================== 本地
const merge = (result, last, files, limitMinSize, limitMaxSize) => {
    let arr;
    if (last) {
        arr = result[result.length - 1];
    }
    else {
        arr = [];
        result.push(arr);
    }
    for (let f of files) {
        if (last + f.size > limitMaxSize) {
            arr = [];
            result.push(arr);
            last = 0;
        }
        last += f.size;
        arr.push(f.path);
    }
    return last >= limitMinSize ? 0 : last;
};
// ============================== 立即执行
});
