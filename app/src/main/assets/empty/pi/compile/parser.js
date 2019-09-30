_$define("pi/compile/parser", function (require, exports, module){
"use strict";
/**
 * 语法分析（Syntax analysis或Parsing）和语法分析程序（Parser）
 * 支持左结合的递归语法，
 * 语法解析器，创建抽象语法树
 * 需要设置操作符配置表，描述所有能直接读取的操作符号及这些操作符的优先级和处理函数
 * http://www.cnblogs.com/rubylouvre/archive/2012/09/08/2657682.html
 */
Object.defineProperty(exports, "__esModule", { value: true });
const ebnf_1 = require("./ebnf");
// ============================== 导出
/**
 * @description 语法节点
 */
class Syntax {
    constructor() {
        this.type = null;
        this.value = null;
        this.left = null;
        this.right = null;
        this.token = null;
        this.preNotes = null;
        this.sufNotes = null;
        this.parent = null;
    }
}
exports.Syntax = Syntax;
/**
 * @description 记号
 */
class RuleToken {
    constructor() {
        this.type = null;
        this.value = null;
        this.index = 0;
        this.line = 0;
        this.column = 0;
        this.rule = null;
        this.parent = null;
        this.loc = 0;
    }
}
exports.RuleToken = RuleToken;
/**
 * @description 语法分析器
 */
class Parser {
    constructor() {
        this.scanner = null;
        this.tokenMap = new Map;
        this.syntaxMap = new Map;
        this.defaultRule = new TokenRule;
        this.cur = null;
        this.last = [];
        this.lastIndex = 0;
        this.lastMatch = new RuleToken;
    }
    /**
     * @description 设置规则及优先级
     * @example
     */
    setRule(s, cfgs) {
        let reader = ebnf_1.createRuleReader(s);
        let r = reader();
        while (r) {
            buildSyntax(r, this.syntaxMap);
            r = reader();
        }
        merge(this.syntaxMap);
        for (let r of cfgs)
            buildCfg(r, this.tokenMap, this.syntaxMap);
        for (let r of this.tokenMap.values())
            buildNext(r);
    }
    /**
     * @description 初始化设置语法扫描器
     * @example
     */
    initScanner(s) {
        this.scanner = s;
        this.cur = null;
        this.last.length = 0;
        this.lastIndex = 0;
        this.next();
    }
    /**
     * @description 读取下一个记号
     * @example
     */
    next() {
        do {
            if (this.lastIndex >= this.last.length) {
                let t = new RuleToken;
                if (this.scanner.scan(t)) {
                    t.rule = this.tokenMap.get(t.type);
                    if (!t.rule)
                        t.rule = this.defaultRule;
                    t.loc = this.last.length;
                    this.lastIndex++;
                    this.last.push(t);
                    this.cur = t;
                    if (t.index > this.lastMatch.index)
                        this.lastMatch = t;
                }
                else {
                    this.lastIndex++;
                    this.cur = null;
                }
            }
            else
                this.cur = this.last[this.lastIndex++];
            if (!this.cur)
                return this;
        } while (this.cur.rule.ignore || this.cur.rule.note);
        return this;
    }
    /**
     * @description 刷新
     * @example
     */
    flush() {
        this.last = this.last.slice(this.lastIndex - 1);
        this.lastIndex = 1;
    }
    /**
     * @description 设置当前的字符及位置
     * @example
     */
    setCur(lastIndex, lastDeep) {
        if (lastIndex === this.lastIndex)
            return;
        let reback = false;
        while (lastDeep < this.scanner.stateDeep()) {
            this.scanner.backState();
            reback = true;
        }
        // 将多读取的token，推回到scanner
        if (reback) {
            this.scanner.reback(this.last.slice(lastIndex));
            this.last.length = lastIndex;
        }
        this.cur = this.last[lastIndex - 1];
        this.lastIndex = lastIndex;
    }
    /**
     * @description 解析表达式，返回一个表达式的抽象语法树，返回null表示该表达式是null，返回undefined表示结束
     * @example
     */
    parseExpr() {
        if (!this.cur)
            return;
        let s = expression(this, 0);
        this.belongNote();
        this.flush();
        return s;
    }
    /**
     * @description 解析规则，可以","分隔多个规则名，返回一个规则的抽象语法树，返回null表示该表达式是null，返回undefined表示结束
     * @example
     */
    parseRule(rules) {
        if (!this.cur)
            return;
        let arr = rules.split(",");
        for (let rule of arr) {
            let rr = this.syntaxMap.get(rule.trim());
            if (!rr)
                throw new Error("parser, parseRule fail, invalid rule: " + rule);
            let s = new Syntax;
            s.type = rr.rule.name;
            s.right = [];
            s.token = this.cur;
            this.cur && (this.cur.parent = s);
            let b = rr.match(this, s);
            if (!b)
                continue;
            this.belongNote();
            this.flush();
            return s;
        }
        return null;
    }
    /**
     * @description 计算注解和注释的归属
     * @example
     */
    belongNote() {
        for (let r of this.last) {
            if (r.rule.note)
                addNote(this.last, r);
        }
    }
}
exports.Parser = Parser;
/**
 * @description 内建的表达式函数
 */
exports.builtIn = {
    expr: (p) => {
        return expression(p, 0);
    },
    all: (p) => {
        if (!p.cur)
            return null;
        let s = itself(p, p.cur);
        p.next();
        return s;
    }
};
// ============================== 本地
/**
 * @description 词法规则的配置
 */
class TokenRule {
    constructor() {
        this.type = null; // 类型，和词法单元类型要相同
        this.lbp = 0; // 左结合优先级，越大越优先，默认为0，表示右结合
        this.rbp = 0; // 右结合优先级，越大越优先，默认为左结合优先级
        this.nud = itself; // 空指称函数，向右及自身结合，常用于值（例如变量和直接量）以及前缀操作符
        this.led = error; // 左指称函数，向左结合，常用于中缀和后缀运算符
        this.ignore = false;
    }
}
/**
 * @description 语法规则
 */
class SyntaxRule {
    constructor() {
        this.rule = null;
        this.match = null;
    }
}
// 构建语法规则
const buildSyntax = (rule, map) => {
    let r = new SyntaxRule;
    r.rule = rule;
    r.match = makeRuleEntry(r, r.rule.entry, map);
    map.set(rule.name, r);
};
// 联合语法规则
const merge = (map) => {
    let oldlen, len = 0, size = map.size, name;
    do {
        oldlen = len;
        len = 0;
        for (let r of map.values()) {
            if (!r.match) {
                r.match = makeRuleEntry(r, r.rule.entry, map);
                if (!r.match) {
                    name = r.rule.name;
                    continue;
                }
            }
            len++;
        }
    } while (len > oldlen && len < size);
    if (len < size)
        throw new Error("parser, rule merge fail, name: " + name);
};
// 构建词法规则
const buildCfg = (cfg, map, syntaxMap) => {
    let r = map.get(cfg.type);
    if (!r) {
        r = new TokenRule;
        r.type = cfg.type;
    }
    if (cfg.lbp)
        r.lbp = cfg.lbp;
    if (cfg.rbp)
        r.rbp = cfg.rbp;
    if (cfg.suf)
        r.suf = cfg.suf;
    if (cfg.ignore)
        r.ignore = cfg.ignore;
    if (cfg.note)
        r.note = cfg.note;
    if (cfg.nud) {
        let func = getNuds(cfg.nud, syntaxMap);
        r.nud = (p, token) => {
            let s = func(p, token);
            if (s)
                return s;
            throw new Error("SyntaxError, type: " + cfg.type + ", nud: " + cfg.nud + ", token: " + token.value + ", line: " + token.line + ", column: " + token.column);
        };
    }
    if (cfg.led) {
        let func = getLeds(cfg.led, syntaxMap);
        r.led = (p, token, left) => {
            let s = func(p, token, left);
            if (s)
                return s;
            throw new Error("SyntaxError, type: " + cfg.type + ", led: " + cfg.led + ", token: " + token.value + ", line: " + token.line + ", column: " + token.column);
        };
    }
    map.set(r.type, r);
};
// 获得ebnf定义的nud函数
const getNud = (rr) => {
    return (p, token) => {
        let s = new Syntax;
        s.type = rr.rule.name;
        s.right = [];
        s.token = token;
        token.parent = s;
        return rr.match(p, s) ? s : null;
    };
};
// 获得ebnf定义的led函数
const getLed = (rr) => {
    return (p, token, left) => {
        let s = new Syntax;
        s.type = rr.rule.name;
        s.left = left;
        left.parent = s;
        s.right = [];
        s.token = token;
        token.parent = s;
        return rr.match(p, s) ? s : null;
    };
};
// 获得ebnf定义的nud函数
const getNuds = (s, syntaxMap) => {
    let arr = makeRuleArray(s, syntaxMap, getNud);
    return arr.length > 1 ? (p, token) => {
        for (let f of arr) {
            let s = f(p, token);
            if (s)
                return s;
        }
        return null;
    } : arr[0];
};
// 获得ebnf定义的led函数
const getLeds = (s, syntaxMap) => {
    let arr = makeRuleArray(s, syntaxMap, getLed);
    return arr.length > 1 ? (p, token, left) => {
        for (let f of arr) {
            let s = f(p, token, left);
            if (s)
                return s;
        }
        return null;
    } : arr[0];
};
// 创建规则数组
const makeRuleArray = (s, syntaxMap, func) => {
    let ss = s.split(",");
    let arr = [];
    for (let s of ss) {
        s = s.trim();
        let rr = syntaxMap.get(s);
        if (!rr)
            throw new Error("parser, makeRuleArray fail, invalid name: " + s);
        arr.push(func(rr));
    }
    return arr;
};
// 构建词法规则
const buildNext = (r) => {
    r.lbp = r.lbp || 0;
    r.rbp = r.rbp || r.lbp || 0;
    if (r.nud === itself && r.rbp !== 0)
        r.nud = r.rbp > 0 ? prefix : null;
    if (r.led === error && r.lbp)
        r.led = r.suf ? suffix : infix;
};
/**
 * @description 内置的表达式函数
 */
const expression = (p, rbp) => {
    let t = p.cur;
    if (!t)
        return null;
    let r = t.rule;
    if (!r.nud)
        return null;
    p.next();
    let left = r.nud(p, t);
    while ((t = p.cur) && rbp < t.rule.lbp) {
        p.next();
        left = t.rule.led(p, t, left);
    }
    return left;
};
// 返回自身token的符号
const itself = (p, token) => {
    let s = new Syntax;
    s.type = token.rule.type || token.type;
    s.value = token.value;
    s.token = token;
    token.parent = s;
    return s;
};
// 抛出错误
const error = (p, token) => {
    throw new Error("invalid token: " + token.value + ", line: " + token.line + ", column: " + token.column);
};
// 返回 前缀符号解析函数
const prefix = (p, token) => {
    let s = new Syntax;
    s.type = token.rule.type;
    s.right = [expression(p, token.rule.rbp)];
    s.right[0].parent = s;
    s.token = token;
    token.parent = s;
    return s;
};
// 返回 中缀符号解析函数
const infix = (p, token, left) => {
    let s = new Syntax;
    s.type = token.rule.type;
    s.left = left;
    left.parent = s;
    s.right = [expression(p, token.rule.rbp)];
    s.right[0].parent = s;
    s.token = token;
    token.parent = s;
    return s;
};
// 返回 后缀符号解析函数
const suffix = (p, token, left) => {
    let s = new Syntax;
    s.type = token.rule.type;
    s.left = left;
    left.parent = s;
    s.token = token;
    token.parent = s;
    return s;
};
// 创建语法规则函数
const makeRuleEntry = (r, re, map) => {
    let func = ruleTab[re.type];
    if (!func)
        throw new Error("parser, make rule fail, invalid name: " + re.type);
    return func(r, re, map);
};
// 创建语法规则函数数组
const makeMatchs = (r, arr, map) => {
    let matchs = [];
    for (let rr of arr) {
        let func = makeRuleEntry(r, rr, map);
        if (!func)
            return;
        matchs.push(func);
    }
    return matchs;
};
// 检查是否进行状态转换
const checkOption = (p, option, backCur) => {
    if (!option)
        return false;
    if (option.back || option.state) {
        // 将当前的token，推回到scanner
        if (backCur)
            p.lastIndex--;
        // 将还未读取的token，推回到scanner
        if (p.lastIndex < p.last.length) {
            p.scanner.reback(p.last.slice(p.lastIndex));
            p.last.length = p.lastIndex;
        }
        if (option.back) {
            for (let i = option.back; i > 0; i--)
                p.scanner.backState();
        }
        else if (option.state) {
            p.scanner.setState(option.state);
        }
        // 读出当前的token
        if (backCur)
            p.next();
    }
    return option.ignore;
};
// 添加注释和注解
const addNote = (last, note) => {
    let s, r;
    if (note.rule.note < 0) {
        // 向前注释
        for (let i = note.loc - 1; i >= 0; i--) {
            r = last[i];
            if (r.rule.note || r.rule.ignore)
                continue;
            s = r.parent;
            if (!s.right)
                s = s.parent;
            s.preNotes = s.preNotes || [];
            s.preNotes.push(note);
            break;
        }
    }
    else {
        // 向后注释
        for (let i = note.loc + 1, n = last.length; i < n; i++) {
            r = last[i];
            if (r.rule.note || r.rule.ignore)
                continue;
            s = r.parent;
            if (!s.right)
                s = s.parent;
            s.sufNotes = s.sufNotes || [];
            s.sufNotes.push(note);
            break;
        }
    }
};
// 词法规则函数表
const ruleTab = {
    "series": (r, re, map) => {
        let arr = makeMatchs(r, re.childs, map);
        if (!arr)
            return;
        return (p, s) => {
            let sss = re.str;
            let i = p.lastIndex;
            let deep = p.scanner.stateDeep();
            let c = s.right.length;
            for (let func of arr) {
                let r = func(p, s);
                if (!r) {
                    p.setCur(i, deep);
                    s.right.length = c;
                    return false;
                }
            }
            return true;
        };
    },
    "and": (r, re, map) => {
        let arr = makeMatchs(r, re.childs, map);
        if (!arr)
            return;
        return (p, s) => {
            let sss = re.str;
            let i = p.lastIndex;
            let deep = p.scanner.stateDeep();
            let c = s.right.length;
            let r = arr[0](p, s);
            if (!r)
                return false;
            let old = p.lastIndex > i ? p.lastIndex : -1;
            for (let j = 1, len = arr.length; j < len; j++) {
                p.setCur(i, deep);
                s.right.length = c;
                let r = arr[j](p, s);
                if (!r)
                    return false;
                if (i === p.lastIndex)
                    continue;
                if (old >= 0) {
                    if (old !== p.lastIndex) {
                        p.setCur(i, deep);
                        s.right.length = c;
                        return false;
                    }
                }
                else
                    old = p.lastIndex;
            }
            return true;
        };
    },
    "or": (r, re, map) => {
        let arr = makeMatchs(r, re.childs, map);
        if (!arr)
            return;
        return (p, s) => {
            let sss = re.str;
            for (let func of arr) {
                if (func(p, s))
                    return true;
            }
            return false;
        };
    },
    "not": (r, re, map) => {
        let func = makeRuleEntry(r, re.child, map);
        if (!func)
            return;
        return (p, s) => {
            let sss = re.str;
            return !func(p, s);
        };
    },
    "terminal": (r, re, map) => {
        let str = re.value;
        return (p, s) => {
            let sss = re.str;
            if ((!p.cur) || p.cur.type !== str)
                return false;
            if (!checkOption(p, re.option, false)) {
                let ss = itself(p, p.cur);
                s.right.push(ss);
                ss.parent = s;
            }
            else
                p.cur.parent = s;
            p.next();
            return true;
        };
    },
    "name": (r, re, map) => {
        let rule = map.get(re.value);
        if (!rule)
            return;
        return (p, s) => {
            let sss = re.str;
            let ss = new Syntax;
            ss.type = re.value;
            ss.right = [];
            ss.token = p.cur;
            p.cur && (p.cur.parent = s);
            let r = rule.match(p, ss);
            if (!r)
                return false;
            if (!checkOption(p, re.option, true)) {
                s.right.push(ss);
                ss.parent = s;
            }
            return true;
        };
    },
    "optional": (r, re, map) => {
        let func = makeRuleEntry(r, re.child, map);
        if (!func)
            return;
        return (p, s) => {
            let sss = re.str;
            func(p, s);
            return true;
        };
    },
    "repeat": (r, re, map) => {
        let func = makeRuleEntry(r, re.child, map);
        if (!func)
            return;
        return (p, s) => {
            let sss = re.str;
            let r = func(p, s);
            if (!r)
                return false;
            while (r)
                r = func(p, s);
            return true;
        };
    },
    "builtIn": (r, re, map) => {
        let func = exports.builtIn[re.value];
        if (!func)
            throw new Error("scanner, make rule fail, invalid builtIn: " + re.value);
        return (p, s) => {
            let ss = func(p);
            if (!ss)
                return false;
            if (re.option !== "") {
                s.right.push(ss);
                ss.parent = s;
            }
            return true;
        };
    },
};
// ============================== 立即执行
});
