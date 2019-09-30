_$define("pi/util/sound", function (require, exports, module){
"use strict";
/*
 * 声音播放
 * 注意，时间单位是秒, 可以使用小数表示毫秒
 */
Object.defineProperty(exports, "__esModule", { value: true });
// ============================== 导入
const mod_1 = require("../lang/mod");
const log_1 = require("../util/log");
const util_1 = require("../util/util");
const res_mgr_1 = require("./res_mgr");
// ============================== 导出
exports.level = log_1.logLevel;
/**
 * @description 声音的资源类型
 * @example
 */
exports.RES_TYPE_SOUND = 'sound';
/**
 * @description 声音状态类型
 */
var StateType;
(function (StateType) {
    StateType[StateType["INIT"] = 0] = "INIT";
    StateType[StateType["READY"] = 1] = "READY";
    StateType[StateType["PLAY"] = 2] = "PLAY";
    StateType[StateType["PAUSE"] = 3] = "PAUSE"; // 暂停
})(StateType = exports.StateType || (exports.StateType = {}));
/**
 * @description 声音
 * @example
 */
class Sound {
    constructor() {
        this.res = null;
        this.src = null;
        this.volume = null;
        this.playTime = 0;
        this.pauseTime = 0;
        this.onended = null;
    }
    /**
     * @description 暂停
     * @example
     */
    getState() {
        if (!this.res) {
            return StateType.INIT;
        }
        if (this.playTime) {
            return StateType.PLAY;
        }
        if (this.pauseTime) {
            return StateType.PAUSE;
        }
        return StateType.READY;
    }
    /**
     * @description 获取声音时长
     * @example
     */
    getDuration() {
        if (!this.res) {
            return -1;
        }
        return this.res.link.duration;
    }
    /**
     * @description 播放声音
     * @example
     */
    play(volume, delay, offset) {
        if ((!this.res) && this.playTime) {
            return;
        }
        const s = this.src = context.createBufferSource();
        s.buffer = this.res.link;
        this.volume = context.createGain();
        this.volume.gain.value = volume || 1;
        s.connect(this.volume);
        this.volume.connect(context.destination);
        delay = delay ? context.currentTime + delay : 0;
        offset = offset || this.pauseTime;
        s.start(delay, offset);
        this.playTime = context.currentTime + delay - offset;
        this.pauseTime = 0;
        const func = this.onended;
        if (!func) {
            return;
        }
        s.onended = (ev) => {
            this.playTime = 0;
            if (this.onended === func) {
                func(this, ev);
            }
        };
    }
    /**
     * @description 暂停
     * @example
     */
    pause() {
        if ((!this.src) && !this.playTime) {
            return;
        }
        this.src.stop();
        this.pauseTime = context.currentTime - this.playTime;
        if (this.pauseTime < 0) {
            this.pauseTime = 0;
        }
        this.playTime = 0;
    }
    /**
     * @description 停止
     * @example
     */
    stop() {
        if ((!this.src) && !this.playTime) {
            return;
        }
        this.src.stop();
        this.playTime = this.pauseTime = 0;
    }
    /**
     * @description 销毁
     * @example
     */
    destroy() {
        if (!this.res) {
            return;
        }
        if (this.volume) {
            this.volume.disconnect();
        }
        this.res = null;
    }
}
/**
 * @description 声音管理器
 * @example
 */
class Mgr extends res_mgr_1.ResTab {
    constructor() {
        super(...arguments);
        // 当前播放的声音数组
        this.arr = [];
        // 音量， 0-1之间
        this.volume = 1;
    }
    /**
     * @description 播放指定的声音
     * @arg src 声音的文件名
     * @example
     */
    play(src, delay, repeat, repeatDelay) {
        if (!context) {
            return;
        }
        const name = `${exports.RES_TYPE_SOUND}:${src}`;
        const cfg = new Cfg();
        cfg.mgr = this;
        cfg.startTime = context.currentTime;
        cfg.delay = delay || 0;
        cfg.repeat = repeat || 0;
        cfg.repeatDelay = repeatDelay || 0;
        this.arr.push(cfg);
        return this.load(name, exports.RES_TYPE_SOUND, src, undefined, (res) => {
            if (!cfg.mgr) {
                return this.delete(res);
            }
            play(cfg, res);
        }, (error) => {
            throw new Error(`play failed, src = ${src}, error = ${error.reason}`);
        });
    }
    /**
     * @description 设置音量
     * @example
     */
    getVolume() {
        return this.volume;
    }
    /**
     * @description 设置音量
     * @example
     */
    setVolume(v) {
        if (v < 0) {
            v = 0;
        }
        else if (v > 1) {
            v = 1;
        }
        this.volume = v;
        for (const c of this.arr) {
            c.sound.volume.gain.value = v;
        }
    }
    /**
     * @description 暂停或取消暂停所有的声音
     * @example
     */
    pause(b) {
        if (b) {
            for (const c of this.arr) {
                c.sound.pause();
            }
        }
        else {
            for (const c of this.arr) {
                c.sound.play(c.delay);
            }
        }
    }
    /**
     * @description 停止所有的声音
     * @example
     */
    stop() {
        for (const c of this.arr) {
            c.mgr = null;
            if (!c.sound) {
                continue;
            }
            this.delete(c.sound.res);
            c.sound.destroy();
        }
        this.arr.length = 0;
    }
    /**
     * @description 释放资源表
     * @example
     */
    release() {
        if (!super.release()) {
            return false;
        }
        this.stop();
        return true;
    }
}
exports.Mgr = Mgr;
/**
 * @description 获得当前的音频环境
 * @example
 */
exports.getContext = () => {
    return context;
};
// ============================== 本地
// 声音配置
class Cfg {
    constructor() {
        this.mgr = null; // null 表示被销毁
        this.sound = null;
        this.delay = 0;
        this.repeat = 0;
        this.repeatDelay = 0;
        this.startTime = 0;
    }
}
// 播放声音
const play = (cfg, res) => {
    const s = new Sound();
    s.res = res;
    cfg.sound = s;
    s.onended = () => {
        const mgr = cfg.mgr;
        if (!mgr) {
            return;
        }
        if (cfg.repeat < 1) {
            cfg.mgr = null;
            s.destroy();
            mgr.delete(res);
            return util_1.arrDrop(mgr.arr, cfg);
        }
        cfg.repeat--;
        s.play(mgr.volume, cfg.repeatDelay);
    };
    const d = cfg.delay + cfg.startTime - context.currentTime;
    s.play(cfg.mgr.volume, d > 0 ? d : 0);
};
// 解码音频
// tslint:disable:no-reserved-keywords
const decode = (ab, name, type, file, construct) => {
    if (ab.byteLength === 0) {
        return res_mgr_1.loadError(name, {
            error: 'SOUND_ZERO_SIZE',
            reason: `decode fail: ${file}`
        });
    }
    context.decodeAudioData(ab, (buffer) => {
        res_mgr_1.loadOK(name, type, file, construct, buffer);
    }, (e) => {
        res_mgr_1.loadError(name, {
            error: 'SOUND_DECODE_ERROR',
            reason: `decode fail: ${e}`
        });
    });
};
/**
 * @description 创建声音资源
 * @example
 */
const createSoundRes = (name, type, file, fileMap, construct) => {
    if (!context) {
        return res_mgr_1.loadError(name, {
            error: 'not support web audio api',
            reason: `createSoundRes fail: ${file}`
        });
    }
    if (fileMap) {
        const data = fileMap[file];
        if (data) {
            return decode(data, name, type, file, construct);
        }
    }
    const info = mod_1.depend.get(file);
    if (!info) {
        return res_mgr_1.loadError(name, {
            error: 'FILE_NOT_FOUND',
            reason: `createSoundRes fail: ${file}`
        });
    }
    const down = mod_1.load.create([info], (r) => {
        return decode(r[file], name, type, file, construct);
    }, (err) => {
        res_mgr_1.loadError(name, err);
    });
    mod_1.load.start(down);
};
// ============================== 立即执行
// 创建音频环境
const context = (() => {
    const c = (window.AudioContext || window.webkitAudioContext);
    if (c) {
        return new c();
    }
    console.log('not support web audio api');
})();
res_mgr_1.register(exports.RES_TYPE_SOUND, (name, type, args, fileMap) => {
    createSoundRes(name, type, args, fileMap, res_mgr_1.Res);
});
});
