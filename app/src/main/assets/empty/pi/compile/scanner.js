_$define("pi/compile/scanner", function (require, exports, module){
"use strict";
/**
 * 词法分析（Lexical analysis或Scanning）和词法分析程序（Lexical analyzer或Scanner）
 */
Object.defineProperty(exports, "__esModule", { value: true });
const ebnf_1 = require("./ebnf");
/**
 * @description 词法分析器
 */
class Scanner {
    constructor() {
        this.stateScanner = new Map;
        this.reader = null;
        this.index = 1;
        this.line = 1;
        this.column = 1;
        this.cur = null;
        this.last = [];
        this.lastIndex = 0;
        this.reset = false;
        this.ss = null;
        this.state = null;
        this.stateStack = [];
    }
    /**
     * @description 设置规则，可以指定规则所在的状态
     * @example
     */
    setRule(s, state) {
        state = state || "";
        let ss = this.stateScanner.get(state);
        if (!ss) {
            ss = new StateScanner;
            this.stateScanner.set(state, ss);
        }
        if (!this.ss) {
            this.state = state;
            this.ss = ss;
        }
        let reader = ebnf_1.createRuleReader(s);
        let r = reader();
        let arr = ss.rules;
        let map = ss.map;
        while (r) {
            build(r, arr, map);
            r = reader();
        }
        merge(arr, map);
    }
    /**
     * @description 初始化设置字符读取流
     * @example
     */
    initReader(r, index, line, column, state) {
        this.reader = r;
        this.index = index || 1;
        this.line = line || 1;
        this.column = column || 1;
        //if (!this.cur)
        this.next();
    }
    /**
     * @description 获取状态
     * @example
     */
    getState() {
        return this.state;
    }
    /**
     * @description 获取状态堆栈的深度
     * @example
     */
    stateDeep() {
        return this.stateStack.length;
    }
    /**
     * @description 设置状态
     * @example
     */
    setState(s) {
        this.stateStack.push(this.state);
        this.state = s;
        this.ss = this.stateScanner.get(s);
    }
    /**
     * @description 回退状态
     * @example
     */
    backState() {
        if (!this.stateStack.length)
            return null;
        this.state = this.stateStack.pop();
        this.ss = this.stateScanner.get(this.state);
        return this.state;
    }
    /**
     * @description 读取下一个字符
     * @example
     */
    next() {
        if (this.lastIndex >= this.last.length) {
            this.cur = this.reader();
            this.lastIndex++;
            this.last.push({ char: this.cur, index: this.index, line: this.line, column: this.column });
            this.index++;
            if (this.cur === '\n') {
                this.line++;
                this.column = 1;
            }
            else
                this.column++;
        }
        else {
            let t = this.last[this.lastIndex++];
            this.cur = t.char;
        }
        return this;
    }
    /**
     * @description 刷新，并返回前面匹配成功的字符串
     * @example
     */
    flush(ignore) {
        let s = "", index = this.lastIndex - 1;
        if (!ignore) {
            for (let i = 0; i < index; i++)
                s += this.last[i].char;
        }
        this.last = this.last.slice(index);
        this.lastIndex = 1;
        return s;
    }
    /**
     * @description 回退记号
     * @example
     */
    reback(arr) {
        if (!arr.length)
            return;
        let cc = [];
        for (let t of arr) {
            let i = t.index;
            let line = t.line;
            let column = t.column;
            for (let c of t.value) {
                cc.push({ char: c, index: i++, line: line, column: column });
                if (c === '\n') {
                    line++;
                    column = 0;
                }
                else
                    column++;
            }
        }
        this.last = cc.concat(this.last);
        this.lastIndex = 1;
        this.cur = this.last[0].char;
    }
    /**
     * @description 设置当前的字符及位置
     * @example
     */
    setCur(lastIndex) {
        if (lastIndex === this.lastIndex)
            return;
        let t = this.last[lastIndex - 1];
        this.cur = t.char;
        this.lastIndex = lastIndex;
        this.reset = true;
    }
    /**
     * @description 获得记号，返回undefined 表示结束
     * @example
     */
    scan(t) {
        return stateScan(this, this.ss, t);
    }
}
exports.Scanner = Scanner;
/**
 * @description 词法规则
 */
class LexRule {
    constructor() {
        this.rule = null;
        this.match = null;
        this.nameType = false;
    }
}
/**
 * @description 指定状态的词法扫描器
 */
class StateScanner {
    constructor() {
        this.rules = [];
        this.map = new Map;
        this.firstCharMap = new Map;
    }
}
// 状态扫描
const stateScan = (s, ss, t) => {
    if (!s.cur)
        return false;
    // 匹配
    let type, rule;
    // 检查该字符对应的匹配列表
    let mr = ss.firstCharMap.get(s.cur);
    if (!mr) {
        mr = { ok: [], unknown: ss.rules.concat() };
        ss.firstCharMap.set(s.cur, mr);
    }
    // 先匹配ok列表
    for (let arr = mr.ok, i = 0, len = arr.length; i < len; i++) {
        rule = arr[i];
        if (rule.match(s)) {
            type = rule.rule.name;
            break;
        }
    }
    if (!type) {
        // ok列表没有匹配上，则继续匹配unknown列表
        let arr = mr.unknown, i = 0, len = arr.length;
        s.reset = false;
        for (; i < len; i++) {
            rule = arr[i];
            if (rule.match(s)) {
                type = rule.rule.name;
                break;
            }
            // 将匹配时有更多读取的规则，放入到ok规则中
            if (s.reset)
                mr.ok.push(rule);
            else
                s.reset = false;
        }
        mr.unknown = arr.slice(i + 1);
        if (!type)
            return false;
        mr.ok.push(rule);
    }
    t.index = s.last[0].index;
    t.line = s.last[0].line;
    t.column = s.last[0].column;
    let v = s.flush(rule.nameType);
    if (rule.nameType)
        v = type;
    t.type = type;
    t.value = v;
    return true;
};
// 构建词法规则
const build = (rule, arr, map) => {
    let r = new LexRule;
    r.rule = rule;
    r.match = makeRuleEntry(rule.entry, map);
    if ((rule.entry.type === "terminal" && rule.name === rule.entry.value) || (rule.entry.type === "and" && rule.name === getAndTerminalValue(rule.entry.childs)))
        r.nameType = true;
    arr.push(r);
    map.set(rule.name, r);
};
// 创建词法规则函数
const makeRuleEntry = (re, map) => {
    let func = ruleTab[re.type];
    if (!func)
        throw new Error("scanner, make rule fail, invalid name: " + re.type);
    return func(re, map);
};
// 构建与规则中终结符的值
const getAndTerminalValue = (arr) => {
    for (let e of arr) {
        if (e.type === "terminal")
            return e.value;
    }
};
// 创建词法规则函数数组
const makeMatchs = (arr, map) => {
    let matchs = [];
    for (let r of arr) {
        let func = makeRuleEntry(r, map);
        if (!func)
            return;
        matchs.push(func);
    }
    return matchs;
};
// 联合词法规则
const merge = (arr, map) => {
    let oldlen, len = 0, name;
    do {
        oldlen = len;
        len = 0;
        for (let r of arr) {
            if (!r.match) {
                r.match = makeRuleEntry(r.rule.entry, map);
                if (!r.match) {
                    name = r.rule.name;
                    continue;
                }
            }
            len++;
        }
    } while (len > oldlen && len < arr.length);
    if (len < arr.length)
        throw new Error("scanner, rule merge fail, name: " + name);
};
// 词法规则函数表
const ruleTab = {
    "series": (re, map) => {
        let arr = makeMatchs(re.childs, map);
        if (!arr)
            return;
        return (s) => {
            let sss = re.str;
            let i = s.lastIndex;
            for (let func of arr) {
                let r = func(s);
                if (!r) {
                    s.setCur(i);
                    return false;
                }
            }
            return true;
        };
    },
    "and": (re, map) => {
        let arr = makeMatchs(re.childs, map);
        if (!arr)
            return;
        return (s) => {
            let sss = re.str;
            let i = s.lastIndex;
            let r = arr[0](s);
            if (!r)
                return false;
            let old = s.lastIndex > i ? s.lastIndex : -1;
            for (let j = 1, len = arr.length; j < len; j++) {
                s.setCur(i);
                let r = arr[j](s);
                if (!r)
                    return false;
                if (s.lastIndex === i)
                    continue;
                if (old >= 0) {
                    if (old !== s.lastIndex) {
                        s.setCur(i);
                        return false;
                    }
                }
                else
                    old = s.lastIndex;
            }
            return true;
        };
    },
    "or": (re, map) => {
        let arr = makeMatchs(re.childs, map);
        if (!arr)
            return;
        return (s) => {
            let sss = re.str;
            for (let func of arr) {
                if (func(s))
                    return true;
            }
            return false;
        };
    },
    "not": (re, map) => {
        let func = makeRuleEntry(re.child, map);
        if (!func)
            return;
        return (s) => {
            let sss = re.str;
            let i = s.lastIndex;
            let r = func(s);
            if (r) {
                s.setCur(i);
                return false;
            }
            return true;
        };
    },
    "terminal": (re, map) => {
        let str = re.value;
        return (s) => {
            let sss = re.str;
            let i = s.lastIndex;
            let x = 0;
            let c = str[x++];
            while (c) {
                if (s.cur !== c) {
                    s.setCur(i);
                    return false;
                }
                s.next();
                c = str[x++];
            }
            return true;
        };
    },
    "name": (re, map) => {
        let r = map.get(re.value);
        if (!r)
            return;
        return r.match;
    },
    "optional": (re, map) => {
        let func = makeRuleEntry(re.child, map);
        if (!func)
            return;
        return (s) => {
            let sss = re.str;
            func(s);
            return true;
        };
    },
    "repeat": (re, map) => {
        let func = makeRuleEntry(re.child, map);
        if (!func)
            return;
        return (s) => {
            let sss = re.str;
            let i = s.lastIndex;
            let r = func(s);
            if (!r)
                return false;
            while (r) {
                if (s.lastIndex === i)
                    throw new Error("scanner, repeat fail, endless loop: " + re.value + ", line: " + s.line + ", column: " + s.column);
                r = func(s);
            }
            return true;
        };
    },
    "builtIn": (re, map) => {
        let func = ebnf_1.builtIn[re.value];
        if (!func)
            throw new Error("scanner, make rule fail, invalid builtIn: " + re.value);
        return (s) => {
            let sss = re.str;
            let r = func(s.cur);
            if (r)
                s.next();
            return r;
        };
    }
};
// ============================== 立即执行
});
