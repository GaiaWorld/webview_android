_$define("pi/worker/client", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 该模块提供任务组，每组提供基于任务优先级的调度。优先级高的任务获得更高概率执行，相同优先级的按时间顺序执行。
 * 初始化任务组时，必须提供全部的模块代码的二进制数据。
 * 如果该组并发线程数大于1，不保证任务执行的次序性，但保证任务返回的次序是顺序的。
 * 任务执行的调用为： send(任务组的名称，模块名称，函数名称，参数，传送数据数组，任务优先级，任务类型，成功回调函数，失败回调函数)。
 */
// ============================== 导入
const mod_1 = require("../lang/mod");
const log_1 = require("../util/log");
const task_pool_1 = require("../util/task_pool");
// ============================== 导出
exports.level = log_1.logLevel;
/**
 * @description 创建任务组
 * @example
 */
exports.create = (groupName, workerCount, modNames, fileMap) => {
    let group = groupMap.get(groupName);
    if (group) {
        throw new Error(`group is created, name:${groupName}`);
    }
    group = { name: groupName, taskPool: new task_pool_1.TaskPool(), wait: [], workerCount: workerCount, count: 0 };
    groupMap.set(groupName, group);
    const initName = mod_1.butil.relativePath('./init.wjs', module.id);
    const initData = fileMap[initName];
    const fileList = initData ? [] : [mod_1.depend.get(initName)];
    const serverName = mod_1.butil.relativePath('./server', module.id);
    const mods = mod_1.commonjs.depend([serverName].concat(modNames));
    const map = {};
    for (const m of mods) {
        const path = m.info.path;
        map[path] = fileMap[path];
        if (!map[path]) {
            fileList.push(m.info);
        }
    }
    if (fileList.length === 0) {
        return createNext(group, initData, mods, map);
    }
    const down = mod_1.load.create(fileList, (r) => {
        createNext(group, initData || r[initName], mods, map);
    }, (e) => {
        log_1.warn(exports.level, 'create worker group fail, ', e);
    });
    down.fileTab = map;
    mod_1.load.start(down);
};
/**
 * @description 请求，任务组的名称，模块名称，函数名称，参数，传送数据数组，任务优先级，任务类型（异步0，同步顺序1，同步立即2），成功回调函数，失败回调函数
 * @example
 */
exports.request = (groupName, mod, func, args, transferrable, priority, type, successCallback, errorCallback) => {
    const group = groupMap.get(groupName);
    if (!group) {
        throw new Error(`group not found, name:${groupName}`);
    }
    const e = { mod: mod, func: func, args: args, sendResult: !!successCallback };
    group.taskPool.push(e, [successCallback || empty, errorCallback || empty, transferrable], priority, type);
    exec(group);
};
// 任务组表
const groupMap = new Map();
// 空函数
// tslint:disable-next-line:no-empty
const empty = () => { };
// 创建任务组
const createNext = (group, initData, mods, fileMap) => {
    let blob = new Blob([initData], { type: 'text/javascript' });
    const cfg = { url: URL.createObjectURL(blob), mods: mods, count: group.workerCount };
    for (let i = mods.length - 1; i >= 0; i--) {
        const m = mods[i];
        blob = new Blob([fileMap[m.info.path]], { type: 'text/javascript' });
        mods[i] = {
            id: m.id,
            exports: {},
            loaded: false,
            info: m.info,
            children: m.children,
            url: URL.createObjectURL(blob)
        };
    }
    for (let i = group.workerCount; i > 0; i--) {
        initWorker(group, cfg);
    }
};
// 初始化任务组的线程
const initWorker = (group, cfg) => {
    const worker = new Worker(cfg.url);
    // tslint:disable:prefer-template
    const name = group.name + ':' + group.count++;
    worker.name = name;
    worker.postMessage({ name: name, mods: cfg.mods });
    worker.onerror = (e) => {
        log_1.warn(exports.level, name + ' exec fail, msg:', e.message, 'lineno:', e.lineno);
    };
    worker.onmessage = (e) => {
        cfg.count--;
        if (cfg.count <= 0) {
            URL.revokeObjectURL(cfg.url);
            for (const m of cfg.mods) {
                URL.revokeObjectURL(m.url);
            }
        }
        const data = e.data;
        if (data.error) {
            return log_1.warn(exports.level, data);
        }
        group.wait.push(worker);
        exec(group);
    };
};
// 消息接收函数
const onmessage = (e, group, worker, args) => {
    const data = e.data;
    if (group.taskPool.pop(task_pool_1.temp)) {
        worker.onmessage = mod_1.butil.curryFirst(onmessage, group, worker, task_pool_1.temp.args);
        worker.postMessage(task_pool_1.temp.func, task_pool_1.temp.args[2]);
    }
    else {
        group.wait.push(worker);
    }
    if (data.error) {
        return args[1](data);
    }
    args[0](data.ok);
};
// 消息接收函数
const exec = (group) => {
    let worker;
    const arr = group.wait;
    const len = arr.length - 1;
    if (len < 0) {
        return;
    }
    if (!group.taskPool.pop(task_pool_1.temp)) {
        return;
    }
    worker = arr[len];
    arr.length = len;
    worker.onmessage = mod_1.butil.curryFirst(onmessage, group, worker, task_pool_1.temp.args);
    worker.postMessage(task_pool_1.temp.func, task_pool_1.temp.args[2]);
};
// ============================== 立即执行
});
