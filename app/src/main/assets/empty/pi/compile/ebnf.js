_$define("pi/compile/ebnf", function (require, exports, module){
"use strict";
/**
 * 扩展巴科斯范式
 * https://zh.wikipedia.org/wiki/%E6%89%A9%E5%B1%95%E5%B7%B4%E7%A7%91%E6%96%AF%E8%8C%83%E5%BC%8F
 * 支持 "'+*-/!|=:;&^%?@#$~`<>()[]{} 等基础符号用引号引起作为定义的name，但这类规则是无法被其他规则引用的
 * 重复的表达式可以通过花括号{ ... }表示，表示1-n次。如果要0-n次，可以用[{...}]表示。
 * 修改或操作(| ... , ... |, 间隔符为,)
 * 增加与操作(& ... , ... &, 间隔符为,), 取反操作(!...!)
 * 因为与或操作也使用","分割，所以增加 顺序操作符(@ ... , ... @, 间隔符为,)
 * 因为与操作联合取反操作可替代排除操作(-)，故取消排除操作。
 * 比如： all characters − '"'， 可改成 & !'"'! , all characters&
 * 如果规则项后为字符#，表示扩展信息，?表示可忽略，后面跟其他字符串表示状态切换或状态后退，back2为状态退后2次。
 */
Object.defineProperty(exports, "__esModule", { value: true });
// ============================== 导入
const reader_1 = require("./reader");
/**
 * @description 内建的字符函数
 */
exports.builtIn = {
    all: (c) => {
        return !!c;
    },
    visible: (c) => {
        return (c >= ' ' && c <= '~') || c.charCodeAt(0) > 256;
    },
    whitespace: (c) => {
        return c === ' ' || c === '\t' || c === '\v' || c === '\f' || c === '\n' || c === '\r';
    },
    notwhitespace: (c) => {
        return !((!c) || c === ' ' || c === '\t' || c === '\v' || c === '\f' || c === '\n' || c === '\r');
    },
    spacetab: (c) => {
        return c === ' ' || c === '\t' || c === '\v' || c === '\f';
    },
    breakline: (c) => {
        return c === '\n' || c === '\r';
    },
    notbreakline: (c) => {
        return !((!c) || c === '\n' || c === '\r');
    },
    digit: (c) => {
        return (c >= '0' && c <= '9');
    },
    notdigit: (c) => {
        return !((!c) || c >= '0' && c <= '9');
    },
    digit19: (c) => {
        return (c >= '1' && c <= '9');
    },
    alphabetic: (c) => {
        return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');
    },
    notalphabetic: (c) => {
        return !((!c) || (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z'));
    },
    lowercase: (c) => {
        return (c >= 'a' && c <= 'z');
    },
    uppercase: (c) => {
        return (c >= 'A' && c <= 'Z');
    },
    word: (c) => {
        return c === '_' || (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9');
    },
    notword: (c) => {
        return !((!c) || c === '_' || (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9'));
    }
};
/**
 * @description 创建规则读取器
 */
exports.createRuleReader = (s) => {
    const parser = new Parser();
    parser.reader = reader_1.createByStr(s.replace(regComment, '').trim());
    parser.nextIgnoreWhitespace();
    return () => {
        if (!parser.cur) {
            return;
        }
        const name = parseDefine(parser);
        parser.name = name;
        if (exports.builtIn.whitespace(parser.cur)) {
            parser.nextIgnoreWhitespace();
        }
        if (parser.cur !== '=') {
            throw new Error(`${parser.name}, parse rule error, need = !`);
        }
        const e = parseSeries(parser.next());
        if (parser.cur !== ';') {
            throw new Error(`${parser.name}, parse rule error, need ; !`);
        }
        parser.next();
        if (exports.builtIn.whitespace(parser.cur)) {
            parser.nextIgnoreWhitespace();
        }
        return { name: name, entry: e };
    };
};
// ============================== 本地
// 匹配注释，要排除"(*" "*)" 被放入到终止符的情况
const regComment = /\(\*[^"'][^\*]*[^"']\*\)/g;
/**
 * @description 解析器
 */
class Parser {
    constructor() {
        this.name = null;
        this.reader = null;
        this.cur = null;
    }
    // 读取下一个字符
    next() {
        this.cur = this.reader();
        return this;
    }
    // 读取下一个非空白字符
    nextIgnoreWhitespace() {
        do {
            this.cur = this.reader();
        } while (this.cur && this.cur <= ' ');
    }
}
// 解析定义的规则名，支持 "'+*-/!|=:;&^%?@#$~`<>()[]{} 等基础符号用引号引起作为定义的name
const parseDefine = (parser) => {
    switch (parser.cur) {
        case '"':
            return parseTerminal(parser.next(), '"').value;
        case '\'':
            return parseTerminal(parser.next(), '\'').value;
        default:
            if (exports.builtIn.word(parser.cur)) {
                return parseName(parser).value;
            }
    }
};
// 解析结果集
const parseResult = (parser) => {
    let s = '';
    while (parser.cur !== ';') {
        if (!parser.cur) {
            throw new Error(`${parser.name}, parse result incomplate!`);
        }
        s += parser.cur;
        parser.next();
    }
    return s.trim();
};
// 解析
const parse = (parser) => {
    while (parser.cur) {
        switch (parser.cur) {
            case '"':
                return parseTerminal(parser.next(), '"');
            case '\'':
                return parseTerminal(parser.next(), '\'');
            case '[':
                return parseOptional(parser.next());
            case '{':
                return parseRepeat(parser.next());
            case '|':
                return parseAndOr(parser, 'or');
            case '&':
                return parseAndOr(parser, 'and');
            case '!':
                return parseNot(parser.next());
            case '?':
                return parseBuiltIn(parser.next());
            case '@':
                return parseSeries(parser.next(), true);
            default:
                if (parser.cur === '_' || exports.builtIn.alphabetic(parser.cur)) {
                    return parseName(parser);
                }
        }
        parser.nextIgnoreWhitespace();
    }
};
// 解析规则项的可选项，#字符开始，?为忽略，?1为忽略并切换到状态1，back2为状态退后2次
const parseOption = (parser) => {
    if (exports.builtIn.whitespace(parser.cur)) {
        parser.nextIgnoreWhitespace();
    }
    if (parser.cur !== '#') {
        return;
    }
    parser.next();
    const s = { ignore: true, state: '', back: 0 };
    if (parser.cur !== '?') {
        s.ignore = false;
    }
    else {
        parser.next();
    }
    while (parser.cur && exports.builtIn.word(parser.cur)) {
        s.state += parser.cur;
        parser.next();
    }
    if (s.state.startsWith('back')) {
        s.back = parseInt(s.state.slice(4), 10) || 1;
    }
    return s;
};
// 解析终结符或规则名
const parseTerminal = (parser, char) => {
    let s = '';
    while (parser.cur !== char) {
        if (!parser.cur) {
            throw new Error(`${parser.name}, parse terminal incomplate!`);
        }
        s += parser.cur;
        parser.next();
    }
    parser.next();
    return {
        type: 'terminal',
        /* tslint:disable:prefer-template */
        str: '"' + s + '"',
        value: s,
        child: null,
        childs: null,
        option: parseOption(parser)
    };
};
// 解析规则名
const parseName = (parser) => {
    let s = '';
    while (parser.cur) {
        if (parser.cur !== ' ' && !exports.builtIn.word(parser.cur)) {
            break;
        }
        s += parser.cur;
        parser.next();
    }
    s = s.trim();
    return {
        type: 'name',
        str: s,
        value: s,
        child: null,
        childs: null,
        option: parseOption(parser)
    };
};
// 解析连续操作
const parseSeries = (parser, end) => {
    const arr = [];
    while (parser.cur) {
        arr.push(parse(parser));
        if (exports.builtIn.whitespace(parser.cur)) {
            parser.nextIgnoreWhitespace();
        }
        if (parser.cur !== ',') {
            break;
        }
        parser.next();
    }
    if (end) {
        parser.next();
    }
    if (arr.length === 1) {
        return arr[0];
    }
    return {
        type: 'series',
        str: getArrStr(arr),
        value: null,
        child: null,
        childs: arr,
        option: parseOption(parser)
    };
};
// 解析与或操作
const parseAndOr = (parser, type) => {
    const c = parser.cur;
    const arr = [];
    parser.next();
    while (parser.cur) {
        arr.push(parse(parser));
        if (exports.builtIn.whitespace(parser.cur)) {
            parser.nextIgnoreWhitespace();
        }
        if (parser.cur === c) {
            parser.next();
            if (arr.length === 1) {
                return arr[0];
            }
            return {
                type: type,
                str: c + ' ' + getArrStr(arr) + ' ' + c,
                value: null,
                child: null,
                childs: arr,
                option: parseOption(parser)
            };
        }
        if (parser.cur !== ',') {
            throw new Error(parser.name + ', parse ' + type + ' error, need , !');
        }
        parser.next();
    }
    throw new Error(parser.name + ', parse ' + type + ' incomplate!');
};
// 解析取反操作
const parseNot = (parser) => {
    const e = parseSeries(parser);
    if (exports.builtIn.whitespace(parser.cur)) {
        parser.nextIgnoreWhitespace();
    }
    if (parser.cur !== '!') {
        throw new Error(parser.name + ', parse not error, need ! !');
    }
    parser.next();
    return {
        type: 'not',
        str: '! ' + e.str + ' !',
        value: null,
        child: e,
        childs: null,
        option: parseOption(parser)
    };
};
// 解析重复操作
const parseRepeat = (parser) => {
    const e = parseSeries(parser);
    if (exports.builtIn.whitespace(parser.cur)) {
        parser.nextIgnoreWhitespace();
    }
    if (parser.cur !== '}') {
        throw new Error(parser.name + ', parse repeat error, need } !');
    }
    parser.next();
    return {
        type: 'repeat',
        str: '{ ' + e.str + ' }',
        value: null,
        child: e,
        childs: null,
        option: parseOption(parser)
    };
};
// 解析可选操作
const parseOptional = (parser) => {
    const e = parseSeries(parser);
    if (exports.builtIn.whitespace(parser.cur)) {
        parser.nextIgnoreWhitespace();
    }
    if (parser.cur !== ']') {
        throw new Error(parser.name + ', parse optional error, need ] !');
    }
    parser.next();
    return {
        type: 'optional',
        str: '[ ' + e.str + ' ]',
        value: null,
        child: e,
        childs: null,
        option: parseOption(parser)
    };
};
// 解析内置操作
const parseBuiltIn = (parser) => {
    let s = '';
    while (parser.cur !== '?') {
        if (!parser.cur) {
            throw new Error(parser.name + ', parse builtIn incomplate!');
        }
        s += parser.cur;
        parser.next();
    }
    parser.next();
    s = s.trim();
    return {
        type: 'builtIn',
        str: '? ' + s + ' ?',
        value: s,
        child: null,
        childs: null,
        option: parseOption(parser)
    };
};
// 获得数组字符串
const getArrStr = (arr) => {
    const a = [];
    a.length = arr.length;
    for (let i = arr.length - 1; i >= 0; i--) {
        a[i] = arr[i].str;
    }
    return a.join(' , ');
};
// ============================== 立即执行
});