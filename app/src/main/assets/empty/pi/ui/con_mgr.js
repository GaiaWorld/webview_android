_$define("pi/ui/con_mgr", function (require, exports, module){
"use strict";
/**
 * 单连接管理器，提供登录，断点续连，慢请求提示等功能
 */
Object.defineProperty(exports, "__esModule", { value: true });
// ============================== 导入
const mod_1 = require("../lang/mod");
const time_1 = require("../lang/time");
const connect_1 = require("../net/websocket/connect");
const event_1 = require("../util/event");
const task_mgr_1 = require("../util/task_mgr");
const forelet_1 = require("../widget/forelet");
// ============================== 导出
/**
 * @description 枚举连接状态
 */
var ConState;
(function (ConState) {
    ConState[ConState["init"] = 0] = "init";
    ConState[ConState["opening"] = 1] = "opening";
    ConState[ConState["opened"] = 2] = "opened";
    ConState[ConState["closed"] = 3] = "closed";
})(ConState = exports.ConState || (exports.ConState = {}));
/**
 * @description 枚举登录状态
 */
var LoginState;
(function (LoginState) {
    LoginState[LoginState["init"] = 0] = "init";
    LoginState[LoginState["logining"] = 1] = "logining";
    LoginState[LoginState["logined"] = 2] = "logined";
    LoginState[LoginState["relogining"] = 3] = "relogining";
    LoginState[LoginState["logouting"] = 4] = "logouting";
    LoginState[LoginState["logouted"] = 5] = "logouted";
    LoginState[LoginState["logerror"] = 6] = "logerror";
})(LoginState = exports.LoginState || (exports.LoginState = {}));
/**
 * @description 导出的forelet
 */
exports.forelet = new forelet_1.Forelet();
/**
 * 获取通讯地址
 */
exports.getUrl = () => {
    return conUrl;
};
/**
 * 设置通讯地址
 */
exports.setUrl = (url) => {
    conUrl = url;
};
/**
 * 打开连接
 */
exports.open = (callback, errorCallback, timeout) => {
    timeout = timeout || defaultTimeout;
    let lastError;
    // 接收后台推送服务器时间，并设置成服务器时间
    connect_1.Connect.setNotify((msg) => {
        if (msg.type === 'closed') {
            setConState(ConState.closed);
        }
        else if (msg.msg) {
            if (msg.msg.type === 'echo_time') {
                localTime = con.getActiveTime();
                serverTime = msg.msg.param.stime;
                pingpong = localTime - msg.msg.param.ctime;
            }
            else {
                handlerMap.notify(msg.msg.type, msg.msg.param);
            }
        }
    });
    ping();
    timeout += time_1.now();
    const cfg = { encode: false, isText: (mod_1.commonjs.flags.os.name === 'Android') && (mod_1.commonjs.flags.os.version < '4.4.0') };
    const func = (result) => {
        if (result.error) {
            if (time_1.now() > timeout) {
                setConState(ConState.closed);
                return task_mgr_1.callTime(errorCallback, [lastError ? lastError : result], 'open');
            }
            lastError = result;
            setTimeout(() => {
                connect_1.Connect.open(conUrl, cfg, func, 10000);
            }, 3000);
        }
        else {
            con = result;
            setConState(ConState.opened);
            con.send({ type: 'app@time', param: { ctime: time_1.now() } });
            task_mgr_1.callTime(callback, [result], 'open');
        }
    };
    connect_1.Connect.open(conUrl, cfg, func, 10000);
    setConState(ConState.opening);
};
/**
 * 通讯请求
 */
exports.request = (msg, cb, timeout, force) => {
    if (!(conState === ConState.opened && (force || loginState === LoginState.logined))) {
        return waitArray.push({ msg: msg, cb: cb });
    }
    let ref = setTimeout(() => {
        ref = 0;
        slowReq++;
        show();
    }, waitTimeout);
    con.request(msg, (r) => {
        if (r.error) {
            if (conState === ConState.closed) {
                reopen();
            }
        }
        if (ref) {
            clearTimeout(ref);
        }
        else {
            slowReq--;
            show();
        }
        task_mgr_1.callTime(cb, [r], 'request');
    }, timeout || defaultTimeout);
};
/**
 * 发送请求
 */
exports.send = (msg) => {
    con && con.send(msg);
};
/**
 * 登录
 */
// tslint:disable:no-reserved-keywords
exports.login = (uid, type, password, cb, timeout) => {
    if (con === null) {
        if (conState !== ConState.init) {
            throw new Error(`login, invalid state: ${conState}`);
        }
        return exports.open(() => {
            exports.login(uid, type, password, cb, timeout);
        }, (result) => {
            task_mgr_1.callTime(cb, [result], 'login');
        }, timeout);
    }
    con.request({ type: 'login', param: { type: type, password: password, user: uid } }, (result) => {
        if (result.error) {
            setLoginState(LoginState.logerror);
            result.result = result.error;
            task_mgr_1.callTime(cb, [result], 'logerror');
        }
        else {
            setLoginState(LoginState.logined);
            requestWaits();
            user = uid;
            userType = type;
            tempPassword = result.password;
            result.result = 1;
            task_mgr_1.callTime(cb, [result], 'login');
        }
    }, timeout || defaultTimeout);
    setLoginState(LoginState.logining);
};
/**
 * 登出
 */
exports.logout = () => {
    setLoginState(LoginState.logouting);
    exports.request({ type: 'logout' }, (result) => {
        setLoginState(LoginState.logouted);
    }, defaultTimeout);
};
/**
 * 重登录成功或失败的回调
 */
exports.setReloginCallback = (cb) => {
    reloginCallback = cb;
};
/**
 * 消息处理器
 */
exports.setMsgHandler = (type, cb) => {
    handlerMap.add(type, (r) => {
        task_mgr_1.callTime(cb, [r], 'recv');
        return event_1.HandlerResult.OK;
    });
};
/**
 * 获取服务器时间
 */
exports.getSeverTime = () => {
    return time_1.now() - localTime + serverTime;
};
/**
 * 获取ping的来回时间
 */
exports.getPingPongTime = () => {
    return pingpong;
};
/**
 * 获取连接状态
 */
exports.getConState = () => {
    return conState;
};
/**
 * 获取登录状态
 */
exports.getLoginState = () => {
    return loginState;
};
// ============================== 本地
// 默认的超时时间
const defaultTimeout = 10000;
/**
 * 重登录回调
 */
let reloginCallback = null;
/**
 * 消息处理列表
 */
const handlerMap = new event_1.HandlerMap();
/**
 * con表示连接
 */
let con = null;
/**
 * 连接状态
 */
let conState = ConState.init;
/**
 * 登录状态
 */
let loginState = LoginState.init;
/**
 * 登录用户信息
 */
let user = '';
/**
 * 登录用户类型，为多平台相同用户名做准备
 */
let userType = 0;
/**
 * 登录成功后，生成临时密码，在重登陆需要配合使用
 */
let tempPassword = '';
// 连接中断时，需要等待连接并登录成功后的请求
const waitArray = [];
/**
 * 慢请求总数量
 */
let slowReq = 0;
// 通讯地址
let conUrl = '';
// 通讯等待时间
const waitTimeout = 200;
// 超时关闭链接
const closeTimeout = 30000;
// 心跳时间
const pingTime = 10000;
// 服务器时间
let serverTime = 0;
// 本地时间
let localTime = 0;
// 通讯时间，ping的来回时间
let pingpong = 0;
// 设置连接状态
const setConState = (s) => {
    if (conState === s) {
        return;
    }
    conState = s;
    show();
};
// 设置登录状态
const setLoginState = (s) => {
    if (loginState === s) {
        return;
    }
    loginState = s;
    show();
};
/**
 * 重新打开连接
 */
const reopen = () => {
    exports.open(() => {
        if (loginState === LoginState.logined || loginState === LoginState.relogining) {
            relogin();
        }
    }, null);
};
/**
 * 重登录
 */
const relogin = () => {
    exports.request({ type: 'relogin', param: { user: user, userType: userType, password: tempPassword } }, (result) => {
        if (result.error) {
            setLoginState(LoginState.logerror);
            reloginCallback && reloginCallback({ type: 'logerror', result: result });
        }
        else {
            setLoginState(LoginState.logined);
            requestWaits();
            reloginCallback && reloginCallback({ type: 'relogin', result: result });
        }
    }, defaultTimeout);
    setLoginState(LoginState.relogining);
};
/**
 * 将所有等待申请列表全部请求
 */
const requestWaits = () => {
    waitArray.map(elem => exports.request(elem.msg, elem.cb, defaultTimeout));
};
/**
 * 定时器：每隔10s调用一次，发送本地时间
 */
const ping = () => {
    const func = () => {
        if (conState === ConState.closed) {
            reopen();
        }
        else if (conState === ConState.opened) {
            if (time_1.now() > con.getActiveTime() + closeTimeout) {
                con.close();
                setConState(ConState.closed);
                reopen();
            }
            else {
                con.send({ type: 'app@time', param: { ctime: time_1.now() } });
            }
        }
        setTimeout(func, pingTime);
    };
    setTimeout(func, pingTime);
};
/**
 * 绘制
 */
const show = () => {
    exports.forelet.paint({ ping: pingpong, slowReq: slowReq, con: conState, login: loginState });
};
});
