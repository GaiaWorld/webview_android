_$define("pi/compile/genhjson", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hash = require("../util/hash");
const tpl_1 = require("../util/tpl");
const log_1 = require("../util/log");
const mod_1 = require("../lang/mod");
// ====================================== 导出
exports.level = log_1.logLevel;
const setParent = (syntax, parent) => {
    syntax.parent = parent;
    let right = syntax.right;
    if (!right)
        return;
    for (var i = 0; i < right.length; i++) {
        setParent(right[i], syntax);
    }
};
exports.gen = (syntax) => {
    nodeIndex = 0;
    sid = 0;
    funcStrArr = [`let _$temp, node; let _set = new Set();`];
    funcStrIndex = 1;
    setParent(syntax, null);
    preorder(syntax, null);
    return joinStr();
};
//判断父节点是否是widget
exports.parentIsWidget = (syntax) => {
    if (!syntax)
        return false;
    let type = syntax.type;
    if (type === "tag" || type === "html") {
        let flag = false;
        if (type === "tag") {
            let tagName = syntax.right[0].value;
            if (tagName.indexOf("-") > 0 || tagName.indexOf("$") > 0 || tagName.indexOf("widget") >= 0) {
                flag = true;
            }
        }
        return flag;
    }
    let parent = syntax.parent;
    return exports.parentIsWidget(parent);
};
let nodeIndex = 0; //根节点为1， 第二层子为2，第三层为3...
// ====================================== 本地
//先序遍历
// child -> node -> pre -> suf
const preorder = (syntax, parent) => {
    let index = funcStrIndex;
    let funcs = seekFunc(syntax, parent);
    let childs = funcs.child();
    let childNodes = [];
    funcStrIndex++;
    if (syntax.type === "jobj" || syntax.type === "jarr" || syntax.type === "jpair" || syntax.type === "text" || syntax.type === "jsexpr") {
        nodeIndex++;
    }
    for (let i = 0; i < childs.length; i++) {
        let childNode = preorder(childs[i], syntax);
        if (childNode)
            childNodes.push(childNode); //存在空文本节点的情况		
    }
    let node = funcs.node(childNodes);
    funcStrArr[index] = funcs.pre(node);
    funcStrArr[funcStrIndex++] = funcs.suf(node);
    if (syntax.type === "jobj" || syntax.type === "jarr" || syntax.type === "jpair" || syntax.type === "text" || syntax.type === "jsexpr") {
        nodeIndex--;
    }
    return node;
};
//每一个节点都有pre字符串和suf字符串
const seekFunc = (syntax, parent) => {
    try {
        return parserFunc[syntax.type](syntax, parent);
    }
    catch (error) {
        throw `parserFunc[${syntax.type}]不是一个方法！`;
    }
};
const joinStr = () => {
    return `(function(_cfg,it,it1){${funcStrArr.join("")} })`;
};
// 用来存储位置的
let funcStrIndex = 0;
// 需要拼接成函数字符串
let funcStrArr = [];
//还没想好里面存什么
class ParserNode {
    constructor() {
        this.childHash = 0;
        this.attrs = {};
        this.attrHash = 0;
        this.hash = 0;
        this.str = ""; //当前节点对应的文本值,暂时只在js中拼表达式用到
        this.v = ""; //v字段专门处理value是jsexpr的情况
        this.cs = false; //判断子节点中是否存在脚本
        // childfuncstr:Array<String> = [];
    }
}
const baseFunc = (syntax) => {
    return Object.assign({}, defaultParse, {
        "node": (childs) => {
            let node = new ParserNode();
            node.str = syntax.value;
            node.hash = hash.anyHash(node.str);
            return node;
        },
        "pre": (node) => {
            let p = findJsonContainer(syntax.parent);
            if (p) {
                let str = getJarrJpair(p, node.str);
                let ps = findSJpairJarr(syntax.parent);
                if (ps.type === "script") {
                    str += `node["_$hash"] = _nextHash(node["_$hash"], ${node.hash});`;
                }
                return str;
            }
        }
    });
};
const jstringFunc = (syntax) => {
    return Object.assign({}, defaultParse, {
        "node": (childs) => {
            let node = new ParserNode();
            if (syntax.right === null && syntax.right.length === 0) {
                node.str = `""`;
            }
            else {
                node.str = `"${syntax.right[0].value}"`;
            }
            node.hash = hash.anyHash(node.str);
            return node;
        },
        "pre": (node) => {
            let p = findJsonContainer(syntax.parent);
            if (p) {
                let str = ``;
                let ps = findSJpairJarr(syntax.parent);
                ;
                if (p.type != "jpair" || p.right[0] !== syntax) {
                    str = getJarrJpair(p, node.str);
                }
                if (ps.type === "script") {
                    str += `node["_$hash"] = _nextHash(node["_$hash"], ${node.hash});`;
                }
                return str;
            }
        }
    });
};
const jpairFunc = (syntax, parent) => {
    return Object.assign({}, defaultParse, {
        "child": () => {
            return syntax.right;
        },
        "node": (childs) => {
            let node = containScript(childs);
            node.childs = childs;
            node.hash = hash.nextHash(node.hash, node.childs[0].hash); //计算key的hash值
            if (node.cs === false || syntax.right[1].type === "jscript") {
                node.hash = hash.nextHash(node.hash, node.childs[1].hash); //计算值的hash值
            }
            return node;
        },
        "pre": (node) => {
            let str = ``;
            const findP = (syntax) => {
                if (!syntax) {
                    return null;
                }
                if (syntax.type === "script" || syntax.type === "jobj") {
                    return syntax;
                }
                return findP(syntax.parent);
            };
            let p = findP(syntax);
            if (p.type === "script") {
                str += `node["_$hash"] = _nextHash(node["_$hash"], ${node.hash});`;
            }
            return str;
        }
    });
};
//单指json中的数组
//且数组中的元素必须为同一类型
// 暂时没有处理["aa","aa {{it.name}}"]这种情况
// jarr其实有BUG,无法处理数组嵌套，且其中有变量的情况,除非变量放在尾部，不然顺序会被换掉
//"["#?10, [|"jstring", "number","bool","null", jobj, jarr, script, jscript|, [{","#?, |"jstring", "number","bool","null", jobj, jarr, script, jscript|}]], "]"#?back;
const jarrFunc = (syntax, parent) => {
    return Object.assign({}, defaultParse, {
        "child": () => {
            return syntax.right;
        },
        "node": (childs) => {
            let node = containScript(childs);
            node.childs = childs;
            for (let i = 0; i < syntax.right.length; i++) {
                if (isBuildIn(syntax.right[i]) || syntax.right[i].type === "jscript") { //所有静态子节点的hash组成该节点的静态hash
                    node.hash = hash.nextHash(node.hash, node.childs[i].hash);
                }
            }
            return node;
        },
        "pre": (node) => `_$temp=node;{let _$parent = _$temp;let node = [];node["_$hash"] = ${node.hash};`,
        "suf": (node) => {
            let str = ``;
            let p = findJsonContainer(syntax.parent);
            if (!p) {
                str += "return node;";
            }
            else {
                if (node.cs === true) { //如果含有script,父节点hash应该计算子节点hash， 否则， 子节点的hash为静态hash，已经被包含在父节点中
                    str += `_$parent["_$hash"] = _nextHash(_$parent["_$hash"],node["_$hash"]);`;
                }
                else {
                    let pp = findSJpairJarr(syntax.parent);
                    if (pp.type === "script") {
                        str += `_$parent["_$hash"] = _nextHash(_$parent["_$hash"],node["_$hash"]);`;
                    }
                }
                if (p.type === "jarr") {
                    str += `_$parent.push(node);`;
                }
                else { //jpair
                    let key = getJsonKey(p.right[0]);
                    str += `_$parent[${key}] = node;`;
                }
            }
            return str + "};";
        }
    });
};
const findSJpairJarr = (syntax) => {
    if (!syntax) {
        return null;
    }
    if (syntax.type === "script" || syntax.type === "jpair" || syntax.type === "jarr") {
        return syntax;
    }
    return findSJpairJarr(syntax.parent);
};
//"{"#?10,  [|jpair,script|], [{[","#?], |jpair,script|}], "}"#?back ;
const jobjFunc = (syntax, parent) => {
    return Object.assign({}, defaultParse, {
        "child": () => syntax.right,
        "node": (childs) => {
            let node = containScript(childs);
            calHash(childs, node); //jpair和script都需要计算静态hash，因为，jobj环境中script的body也是jpair
            return node;
        },
        "pre": (node) => `_$temp=node;{let _$parent = _$temp;let node = {};node["_$hash"] = ${node.hash};`,
        "suf": (node) => {
            let str = ``;
            let p = findJsonContainer(syntax);
            if (!p) {
                str += `return node;`;
            }
            else {
                if (node.cs === true) { //如果含有script,父节点hash应该计算子节点hash， 否则， 子节点的hash为静态hash，已经被包含在父节点中
                    str += `_$parent["_$hash"] = _nextHash(_$parent["_$hash"],node["_$hash"]);`;
                }
                else {
                    let pp = findSJpairJarr(syntax.parent);
                    if (pp.type === "script") {
                        str += `_$parent["_$hash"] = _nextHash(_$parent["_$hash"],node["_$hash"]);`;
                    }
                }
                if (p.type === "jarr") {
                    str += `_$parent.push(node);`;
                }
                else { //jpair
                    let key = getJsonKey(p.right[0]);
                    str += `_$parent[${key}] = node;`;
                }
            }
            return str + "};";
        }
    });
};
const jsExprFunc = (syntax, parent) => {
    let find = (syntax) => {
        if (syntax.type === "jarr" || syntax.type === "jpair" || syntax.type === "jscript") {
            return syntax;
        }
        return find(syntax.parent);
    };
    return Object.assign({}, defaultParse, {
        "child": () => syntax.right,
        "node": (childs) => {
            let node = new ParserNode;
            node.str = childs[0].str.trim();
            return node;
        },
        "suf": (node) => {
            let str = ``;
            let p = find(parent);
            if (!p) {
                throw "jsExpr必须是在jarr，jpair环境中 ";
            }
            let ptype = p.type;
            if (syntax.parent.parent.type === "jscript") {
                str = `jvalue += ` + node.str + `;`;
            }
            else { //script
                str = getJarrJpair(p, node.str);
            }
            str += `_set.clear();node["_$hash"] = _nextHash(node["_$hash"],_anyHash(${node.str}, 0,_set));`; //计算script的hash
            return str;
        }
    });
};
const jscriptFunc = (syntax, parent) => {
    return Object.assign({}, defaultParse, {
        "child": () => {
            return syntax.right;
        },
        "node": (childs) => {
            let node = new ParserNode();
            node.cs = true;
            for (let i = 0; i < syntax.right.length; i++) {
                if (syntax.right[i].type === "stringstr") {
                    node.hash = hash.nextHash(node.hash, childs[i].hash);
                }
            }
            return node;
        },
        "pre": (node) => {
            return `{let jvalue = "";`;
        },
        "suf": (node) => {
            let p = findJsonContainer(syntax);
            if (!p) {
                throw "jscript类型必须以jarr或jpair做为容器";
            }
            let str = getJarrJpair(p, "jvalue");
            str += "}";
            return str;
        }
    });
};
const stringstrFunc = (syntax, parent) => {
    return Object.assign({}, defaultParse, {
        "node": (childs) => {
            let node = new ParserNode();
            node.str = `"${syntax.value}"`;
            node.hash = hash.strHashCode(node.str, 0);
            return node;
        },
        "pre": (node) => {
            return `jvalue += ${node.str};`;
        }
    });
};
const bodyFunc = (syntax, parent) => {
    return Object.assign({}, defaultParse, {
        "child": () => {
            return syntax.right;
        },
        "node": (childs) => {
            let node = containScript(childs);
            node.childs = childs;
            calHash(childs, node);
            return node;
        },
        "pre": (node) => {
            let str = ``;
            if (parent && isBuildIn(syntax)) { //基础类型
                let p = findJsonContainer(syntax);
                if (!p) {
                    throw "基础类型必须以jarr或jpair做为容器";
                }
                if (p.type === "jpair") {
                    let key = getJsonKey(p.right[0]);
                    str += `node[${key}] = ${node.childs[0].str};`;
                }
                else { //jarr
                    str += `node.push(${node.childs[0].str});`;
                }
                str += `node["_$hash"] = _nextHash(node["_$hash"], ${node.childs[0].hash})};`;
            }
            else if (parent && (parent.type == "if" || parent.type == "elseif" || parent.type == "else"))
                str = `{`;
            return str;
        },
        "suf": () => {
            let str = ``;
            if (parent && (parent.type == "if" || parent.type == "elseif" || parent.type == "else"))
                str = `}`;
            return str;
        }
    });
};
const genMathChildFunc = (syntax) => {
    return () => {
        let childs = [];
        if (syntax.left !== null && !isBuildIn(syntax.left))
            childs.push(syntax.left);
        if (!isBuildIn(syntax.right[0]))
            childs.push(syntax.right[0]);
        return childs;
    };
};
const genMathNodeFunc = (operator, syntax) => {
    return (childs) => {
        let node = new ParserNode;
        if (syntax.left === null) {
            node.str = operator;
        }
        else if (!isBuildIn(syntax.left)) {
            node.str = childs[0].str + operator;
        }
        else {
            node.str = syntax.left.value + operator;
        }
        if (!isBuildIn(syntax.right[0])) {
            node.str += childs[childs.length - 1].str;
        }
        else {
            node.str += syntax.right[0].value;
        }
        return node;
    };
};
const genMathFunc = (operator) => {
    return (syntax, parent) => {
        return Object.assign({}, defaultParse, {
            "child": genMathChildFunc(syntax),
            "node": genMathNodeFunc(operator, syntax)
        });
    };
};
const genAutoFunc = (operator) => {
    return (syntax, parent) => {
        return Object.assign({}, defaultParse, {
            "child": () => {
                let childs = [];
                if (syntax.left && !isBuildIn(syntax.left)) {
                    childs.push(syntax.left);
                }
                if (syntax.right && syntax.right[0] && !isBuildIn(syntax.right[0])) {
                    childs.push(syntax.right[0]);
                }
                return childs;
            },
            "node": (childs) => {
                let node = new ParserNode;
                if (childs.length == 1) {
                    if (syntax.left) {
                        node.str = childs[0].str + operator;
                    }
                    else {
                        node.str = operator + childs[0].str;
                    }
                }
                else {
                    if (syntax.left) {
                        node.str = syntax.left.value + operator;
                    }
                    else {
                        node.str = operator + syntax.right[0].value;
                    }
                }
                return node;
            }
        });
    };
};
const genKvDvChildFunc = (syntax) => {
    return () => isBuildIn(syntax.right[1]) ? [] : [syntax.right[1]];
};
const genKvDvNodeFunc = (operator, syntax) => {
    return (childs) => {
        let node = new ParserNode;
        node.str = syntax.right[0].value + operator + (childs.length == 0 ? syntax.right[1].value : childs[0].str);
        calHash(childs, node);
        return node;
    };
};
const genifelseifChildFunc = (syntax) => {
    return () => {
        let childs = [];
        if (!isBuildIn(syntax.right[0])) {
            syntax.right[0].parent = syntax;
            childs.push(syntax.right[0]);
        }
        for (let i = 1; i < syntax.right.length; i++) {
            syntax.right[i].parent = syntax;
            childs.push(syntax.right[i]);
        }
        return childs;
    };
};
const genifelseifNodeFunc = (operator, syntax) => {
    return (childs) => {
        let node = new ParserNode;
        if (!isBuildIn(syntax.right[0]))
            node.str = operator + `(${childs[0].str})`;
        else
            node.str = operator + `(${syntax.right[0].value})`;
        return node;
    };
};
const scriptFunc = (syntax, parent) => {
    return Object.assign({}, defaultParse, {
        "child": () => {
            syntax.parent = parent;
            for (let i = 0; i < syntax.right.length; i++) {
                syntax.right[i].parent = syntax;
            }
            return syntax.right;
        },
        "node": (childs) => {
            let node = new ParserNode;
            //node.str = childs[0].str;
            node.cs = true;
            return node;
        }
    });
};
const execFunc = (syntax, parent) => {
    return Object.assign({}, defaultParse, {
        "child": () => syntax.right,
        "node": (childs) => {
            let node = new ParserNode;
            node.str = childs[0].str;
            return node;
        },
        "suf": (node) => node.str + `;`
    });
};
const fieldeFunc = (syntax, parent) => {
    return Object.assign({}, defaultParse, {
        "child": () => {
            let childs = [];
            (!isBuildIn(syntax.left)) && childs.push(syntax.left);
            (!isBuildIn(syntax.right[0])) && childs.push(syntax.right[0]);
            return childs;
        },
        "node": (childs) => {
            let node = new ParserNode;
            let left = "";
            let right = "";
            if (childs.length == 2) {
                left = childs[0].str;
                right = childs[1].str;
            }
            else if (childs.length == 1) {
                if (isBuildIn(syntax.left)) {
                    left = syntax.left.value;
                    right = childs[0].str;
                }
                else {
                    left = childs[0].str;
                    right = syntax.right[0].value;
                }
            }
            else {
                left = syntax.left.value;
                right = syntax.right[0].value;
            }
            node.str = left + `[` + right + `]`;
            return node;
        }
    });
};
const fieldFunc = (syntax, parent) => {
    return Object.assign({}, defaultParse, {
        "child": () => {
            let childs = [];
            if (!isBuildIn(syntax.left))
                childs.push(syntax.left);
            if (!isBuildIn(syntax.right[0])) //理论上右边肯定是identifier
                childs.push(syntax.right[0]);
            return childs;
        },
        "node": (childs) => {
            let node = new ParserNode;
            if (!isBuildIn(syntax.left)) {
                node.str += childs[0].str + `.`;
            }
            else {
                node.str += syntax.left.value + `.`;
            }
            if (!isBuildIn(syntax.right[0])) {
                node.str += childs.length == 2 ? childs[1].str : childs[0].str;
            }
            else {
                node.str += syntax.right[0].value;
            }
            return node;
        }
    });
};
const callFunc = (syntax, parent) => {
    return Object.assign({}, defaultParse, {
        "child": () => {
            let childs = [];
            if (!isBuildIn(syntax.left))
                childs.push(syntax.left);
            for (let i = 0; i < syntax.right.length; i++) {
                if (!isBuildIn(syntax.right[i]))
                    childs.push(syntax.right[i]);
            }
            return childs;
        },
        "node": (childs) => {
            let node = new ParserNode;
            let index = 0;
            if (!isBuildIn(syntax.left))
                node.str += childs[index++].str + "(";
            else
                node.str += syntax.left.value + "(";
            for (let i = 0; i < syntax.right.length - 1; i++) {
                if (!isBuildIn(syntax.right[i]))
                    node.str += childs[index++].str + ",";
                else
                    node.str += syntax.right[i].value + ",";
            }
            if (syntax.right.length > 0) {
                if (!isBuildIn(syntax.right[syntax.right.length - 1]))
                    node.str += childs[childs.length - 1].str;
                else
                    node.str += syntax.right[syntax.right.length - 1].value;
            }
            node.str += ")";
            return node;
        }
    });
};
//子节点一定是一个dv
const defFunc = (syntax, parent) => {
    return Object.assign({}, defaultParse, {
        "child": () => [syntax.right[0]],
        "node": (childs) => {
            let node = new ParserNode;
            node.str = `let ` + childs[0].str + `;`;
            return node;
        },
        "suf": (node) => node.str
    });
};
const dvFunc = (syntax, parent) => {
    return Object.assign({}, defaultParse, {
        "child": genKvDvChildFunc(syntax),
        "node": genKvDvNodeFunc(`=`, syntax)
    });
};
const kvFunc = (syntax, parent) => {
    return Object.assign({}, defaultParse, {
        "child": genKvDvChildFunc(syntax),
        "node": genKvDvNodeFunc(`:`, syntax)
    });
};
//自增自减
const mulmulFunc = genAutoFunc(`--`);
const addaddFunc = genAutoFunc(`++`);
const negFunc = genAutoFunc(`!`);
//赋值是不会被嵌套的，可以等到返回了再赋值
const assignFunc = genMathFunc(`=`);
const addFunc = genMathFunc(`+`);
const subFunc = genMathFunc(`-`);
const mulFunc = genMathFunc(`*`);
const divFunc = genMathFunc(`/`);
const remFunc = genMathFunc(`%`);
const addEqualFunc = genMathFunc(`+=`);
const subEqualFunc = genMathFunc(`-=`);
const mulEqualFunc = genMathFunc(`*=`);
const divEqualFunc = genMathFunc(`/=`);
const remEqualFunc = genMathFunc(`%=`);
const tripleEqualFunc = genMathFunc(`===`);
const tripleUnequalFunc = genMathFunc(`!==`);
const doubleEqualFunc = genMathFunc(`==`);
const doubleUnequalFunc = genMathFunc(`!=`);
const lessEqualFunc = genMathFunc(`<=`);
const bigEqualFunc = genMathFunc(`>=`);
const lessFunc = genMathFunc(`<`);
const bigFunc = genMathFunc(`>`);
const orFunc = genMathFunc(`|`);
const andFunc = genMathFunc(`&`);
const ororFunc = genMathFunc(`||`);
const andandFunc = genMathFunc(`&&`);
const bracketFunc = (syntax, parent) => {
    return Object.assign({}, defaultParse, {
        "child": () => isBuildIn(syntax.right[0]) ? [] : [syntax.right[0]],
        "node": (childs) => {
            let node = new ParserNode;
            node.str = `(` + (childs.length == 0 ? syntax.right[0].value : childs[0].str) + `)`;
            return node;
        }
    });
};
const objFunc = (syntax, parent) => {
    return Object.assign({}, defaultParse, {
        "child": () => syntax.right,
        "node": (childs) => {
            let node = new ParserNode;
            node.str = `{`;
            for (let i = 0; i < childs.length - 1; i++) {
                node.str += childs[i].str + `,`;
            }
            if (childs.length > 0) {
                node.str += childs[childs.length - 1].str;
            }
            node.str += `}`;
            return node;
        }
    });
};
const arrFunc = (syntax, parent) => {
    return Object.assign({}, defaultParse, {
        "child": () => syntax.right,
        "node": (childs) => {
            let node = new ParserNode;
            let lastIndex = childs.length - 1;
            node.str = `[`;
            for (let i = 0; i < lastIndex; i++) {
                node.str += childs[i].str + ",";
            }
            if (childs[lastIndex]) {
                node.str += childs[lastIndex].str;
            }
            node.str += `]`;
            return node;
        }
    });
};
const ifFunc = (syntax, parent) => {
    return Object.assign({}, defaultParse, {
        "child": genifelseifChildFunc(syntax),
        "node": genifelseifNodeFunc(`if`, syntax),
        "pre": (node) => node.str
    });
};
const elseifFunc = (syntax, parent) => {
    return Object.assign({}, defaultParse, {
        "child": genifelseifChildFunc(syntax),
        "node": genifelseifNodeFunc(`else if`, syntax),
        "pre": (node) => node.str
    });
};
const elseFunc = (syntax, parent) => {
    return Object.assign({}, defaultParse, {
        "child": () => syntax.right,
        "pre": (node) => `else`
    });
};
const forFunc = (syntax, parent) => {
    return Object.assign({}, defaultParse, {
        "child": () => {
            let childs = [], expr, body, right = syntax.right;
            if (right.length === 5) {
                expr = right[3];
                body = right[4];
            }
            else if (right.length === 4) {
                expr = right[2];
                body = right[3];
            }
            if (!isBuildIn(expr)) {
                childs.push(expr);
            }
            childs.push(body);
            return childs;
        },
        "node": (childs) => {
            let node = new ParserNode, expr, body, type, right = syntax.right, forRet, extra;
            node.str = "";
            if (right.length === 5) {
                type = right[2].value;
                if (type === "of") {
                    forRet = right[1].value;
                    extra = right[0].value;
                }
                else if (type === "in") {
                    forRet = right[0].value;
                    extra = right[1].value;
                }
                expr = childs.length == 2 ? childs[0].str : right[3].value;
                body = right[4];
            }
            else if (right.length === 4) {
                type = right[1].value;
                forRet = right[0].value;
                expr = childs.length == 2 ? childs[0].str : right[2].value;
                body = right[3];
            }
            if (type === "of" && right.length === 5) {
                node.str += `{let _$i = 0;
				`;
            }
            node.str += `for(let ${forRet} ${type} ${expr}){`;
            if (type === "of" && right.length === 5) {
                node.str += `let ${extra} = _$i++;`;
            }
            else if (type === "in" && right.length === 5) {
                node.str += `let ${extra} = ${expr}[${forRet}];`;
            }
            return node;
        },
        "pre": (node) => node.str,
        "suf": (node) => {
            let str = "}";
            if (syntax.right[2].value === "of") {
                str += "}";
            }
            return str;
        }
    });
};
const whileFunc = (syntax, parent) => {
    return Object.assign({}, defaultParse, {
        "child": () => {
            let childs = [];
            if (!isBuildIn(syntax.right[0])) {
                childs.push(syntax.right[0]);
            }
            childs.push(syntax.right[1]);
            return childs;
        },
        "node": (childs) => {
            let node = new ParserNode;
            node.str = `while(`;
            if (childs.length == 2)
                node.str += childs[0].str + `){`;
            else
                node.str += syntax.right[0] + `){`;
            return node;
        },
        "pre": (node) => node.str,
        "suf": (node) => `}`
    });
};
const jscontinueFunc = (syntax, parent) => {
    return Object.assign({}, defaultParse, {
        "pre": (node) => `continue;`
    });
};
const regularFunc = (syntax, parent) => {
    return Object.assign({}, defaultParse, {
        "node": (node) => syntax.value
    });
};
const jsbreankFunc = (syntax, parent) => {
    return Object.assign({}, defaultParse, {
        "pre": (node) => `break;`
    });
};
const newFunc = (syntax, parent) => {
    return Object.assign({}, defaultParse, {
        "child": () => isBuildIn(syntax.right[0]) ? [] : syntax.right,
        "node": (childs) => {
            let node = new ParserNode;
            if (!isBuildIn(syntax.right[0]))
                node.str = `new ` + childs[0].str + `;`;
            else
                node.str = `new ` + syntax.right[0].value + `;`;
            return node;
        }
    });
};
const condFunc = (syntax, parent) => {
    return Object.assign({}, defaultParse, {
        "child": () => {
            let childs = [];
            if (!isBuildIn(syntax.left))
                childs.push(syntax.left);
            if (!isBuildIn(syntax.right[0]))
                childs.push(syntax.right[0]);
            if (!isBuildIn(syntax.right[1]))
                childs.push(syntax.right[1]);
            return childs;
        },
        "node": (childs) => {
            let index = 0;
            let node = new ParserNode;
            if (!isBuildIn(syntax.left))
                node.str = childs[index++].str + `?`;
            else
                node.str = syntax.left.value + `?`;
            if (!isBuildIn(syntax.right[0]))
                node.str += childs[index++].str + `:`;
            else
                node.str += syntax.right[0].value + `:`;
            if (!isBuildIn(syntax.right[1]))
                node.str += childs[index].str;
            else
                node.str += syntax.right[1].value;
            return node;
        }
    });
};
const attrsFunc = (syntax, parent) => {
    return Object.assign({}, defaultParse, {
        "child": () => syntax.right,
        "node": (childs) => {
            let node = containScript(childs);
            calHash(childs, node);
            return node;
        },
        "pre": (node) => {
            let size = 0;
            let str = ``;
            for (let i = 0; i < syntax.right.length; i++) {
                let name = syntax.right[i].right[0].value;
                if (name != "w-tag" && name != "w-did") {
                    size++;
                }
            }
            if (size > 0) {
                str += `node.attrSize = ${size};`;
            }
            str += `node.attrHash = ${node.hash};`;
            return str;
        }
    });
};
const containScript = (childs, node) => {
    node = node ? node : new ParserNode;
    for (let i = 0; i < childs.length; i++) {
        if (childs[i].cs === true) {
            node.cs = true;
        }
    }
    return node;
};
//汇总静态hash
const calHash = (childs, node) => {
    for (let i = 0; i < childs.length; i++) {
        if (childs[i].hash) {
            node.hash = hash.nextHash(node.hash, childs[i].hash);
        }
    }
};
const lstringFunc = (syntax, parent) => {
    return Object.assign({}, defaultParse, {
        "node": (childs) => {
            let node = new ParserNode;
            node.hash = tpl_1.calTextHash(syntax.value);
            return node;
        },
        "pre": (node) => {
            let str = ``;
            let parentType = "";
            if (syntax.parent.type == "body") {
                if (syntax.parent.parent.type == "else") {
                    parentType = syntax.parent.parent.parent.parent.parent.type;
                }
                else {
                    parentType = syntax.parent.parent.parent.parent.type;
                }
            }
            else {
                parentType = syntax.parent.type;
            }
            if (parentType == "attrscript") {
                str = `attrvalue += "` + syntax.value + `";`;
            }
            else if (parentType == "singleattrscript") {
                str = `attrvalue += '` + syntax.value + `';`;
            }
            else if (parentType == "jscript") {
                str = `jvalue += "` + syntax.value + `";`;
            }
            return str;
        }
    });
};
const jsfnFunc = (syntax, parent) => {
    return Object.assign({}, defaultParse, {
        "child": () => {
            syntax.parent = parent;
            for (let i = 0; i < syntax.right.length; i++) {
                syntax.right[i].parent = syntax;
            }
            return syntax.right;
        },
        "node": (childs) => {
            let node = new ParserNode;
            node.str = "function" + childs[0].str + childs[1].str;
            return node;
        }
    });
};
const jsfnargsFunc = (syntax, parent) => {
    return Object.assign({}, defaultParse, {
        "node": (childs) => {
            let node = new ParserNode;
            let lastIndex = syntax.right.length - 1;
            node.str = "(";
            for (let i = 0; i < lastIndex; i++) {
                node.str += syntax.right[i].value + ",";
            }
            if (syntax.right[lastIndex])
                node.str += syntax.right[lastIndex].value;
            node.str += ")";
            return node;
        }
    });
};
const jsblockFunc = (syntax, parent) => {
    return Object.assign({}, defaultParse, {
        "child": () => syntax.right,
        "node": (childs) => {
            let node = new ParserNode;
            let index = 0;
            node.str = "{";
            for (let i = 0; i < syntax.right.length; i++) {
                if (!isBuildIn(syntax.right[i]))
                    node.str += childs[index++].str + ";";
                else
                    node.str += syntax.right[i].value + ";";
            }
            node.str += "}";
            return node;
        }
    });
};
const jsbodyFunc = (syntax, parent) => {
    return Object.assign({}, defaultParse, {
        "child": () => syntax.right,
        "node": (childs) => {
            let node = new ParserNode;
            let index = 0;
            node.str = "{";
            for (let i = 0; i < syntax.right.length; i++) {
                if (!isBuildIn(syntax.right[i]))
                    node.str += childs[index++].str + ";";
                else
                    node.str += syntax.right[i].value + ";";
            }
            node.str += "}";
            return node;
        }
    });
};
const jsdefFunc = (syntax, parent) => {
    return Object.assign({}, defaultParse, {
        "child": () => syntax.right,
        "node": (childs) => {
            let node = new ParserNode;
            let index = 0;
            node.str = "let ";
            for (let i = 0; i < childs.length - 1; i++) {
                node.str += childs[i].str + ",";
            }
            if (childs.length > 0) {
                node.str += childs[childs.length - 1].str;
            }
            return node;
        }
    });
};
const genjsifNodeFunc = (op, syntax) => {
    return (childs) => {
        let n = new ParserNode;
        n.str = op;
        if (syntax.right[0].type === "identifier" || isBuildIn(syntax.right[0])) {
            n.str += `(${syntax.right[0].value})`;
            if (childs[0]) {
                n.str += childs[0].str;
            }
        }
        else {
            n.str += `(${childs[0].str})`;
        }
        for (var i = 1; i < childs.length; i++) {
            if (childs[i]) {
                n.str += childs[i].str;
            }
        }
        return n;
    };
};
const genBaseFunc = (syntax, parent) => {
    return Object.assign({}, defaultParse, {
        "node": (childs) => {
            let node = new ParserNode;
            node.str = syntax.value;
            calHash(childs, node);
            return node;
        }
    });
};
const genRightBuiltIn = (syntax) => {
    let childs = [];
    for (let i = 0; i < syntax.right.length; i++) {
        if (!isBuildIn(syntax.right[i]))
            childs.push(syntax.right[i]);
    }
    return childs;
};
const jsifFunc = (syntax, parent) => {
    return Object.assign({}, defaultParse, {
        "child": genifelseifChildFunc(syntax),
        "node": genjsifNodeFunc("if", syntax)
    });
};
const jselseifFunc = (syntax, parent) => {
    return Object.assign({}, defaultParse, {
        "child": genifelseifChildFunc(syntax),
        "node": genjsifNodeFunc("else if", syntax)
    });
};
const jselseFunc = (syntax, parent) => {
    return Object.assign({}, defaultParse, {
        "child": () => syntax.right,
        "node": (childs) => {
            let node = new ParserNode;
            if (childs[0]) {
                node.str = `else `;
                node.str += childs[0].str;
            }
            return node;
        }
    });
};
const jsforFunc = (syntax, parent) => {
    return Object.assign({}, defaultParse, {
        "child": () => syntax.right,
        "node": (childs) => {
            if (syntax.right.length != 4) {
                throw "for语句,必须且只能包含三个条件和一个代码块！";
            }
            let node = new ParserNode;
            node.str = `for(${childs[0].str};${childs[1].str};${childs[2].str})${childs[3].str}`;
            return node;
        }
    });
};
const jswhileFunc = (syntax, parent) => {
    return Object.assign({}, defaultParse, {
        "child": () => genRightBuiltIn(syntax),
        "node": (childs) => {
            let node = new ParserNode;
            node.str = `while(`;
            if (isBuildIn(syntax.right[0])) {
                node.str += syntax.right[0].value + ")";
                node.str += childs[0].str;
            }
            else {
                node.str += childs[0].str + ")";
                node.str += childs[1].str;
            }
            return node;
        }
    });
};
const jsswitchFunc = (syntax, parent) => {
    return Object.assign({}, defaultParse, {
        "child": () => genRightBuiltIn(syntax),
        "node": (childs) => {
            let node = new ParserNode;
            let index = 0;
            node.str = `switch(`;
            if (isBuildIn(syntax.right[0])) {
                node.str += syntax.right[0].value;
            }
            else {
                node.str += childs[0].str;
                index = 1;
            }
            node.str += `){`;
            for (let i = index; i < childs.length; i++) {
                node.str += childs[i].str + ";";
            }
            node.str += `}`;
            return node;
        }
    });
};
const jscaseFunc = (syntax, parent) => {
    return Object.assign({}, defaultParse, {
        "child": () => genRightBuiltIn(syntax),
        "node": (childs) => {
            let node = new ParserNode;
            node.str = `case ${syntax.right[0].value}:
			`;
            for (let i = 0; i < childs.length; i++) {
                node.str += childs[i].str + ";";
            }
            return node;
        }
    });
};
const jsdefaultFunc = (syntax, parent) => {
    return Object.assign({}, defaultParse, {
        "child": () => syntax.right,
        "node": (childs) => {
            let node = new ParserNode;
            node.str = `default:`;
            for (let i = 0; i < childs.length; i++) {
                node.str += childs[i].str + ";";
            }
            return node;
        }
    });
};
const jstryFunc = (syntax, parent) => {
    return Object.assign({}, defaultParse, {
        "child": () => syntax.right,
        "node": (childs) => {
            let node = new ParserNode;
            node.str = `try${childs[0].str}`;
            for (let i = 1; i < childs.length; i++) {
                node.str += childs[i].str;
            }
            return node;
        }
    });
};
const jscatchFunc = (syntax, parent) => {
    return Object.assign({}, defaultParse, {
        "child": () => genRightBuiltIn(syntax),
        "node": (childs) => {
            let node = new ParserNode;
            node.str = `catch(${syntax.right[0].value})${childs[0].str}`;
            return node;
        }
    });
};
const jsfinallyFunc = (syntax, parent) => {
    return Object.assign({}, defaultParse, {
        "child": () => syntax.right,
        "node": (childs) => {
            let node = new ParserNode;
            node.str = `finally${childs[0].str}`;
            return node;
        }
    });
};
const jsreturnFunc = (syntax, parent) => {
    return Object.assign({}, defaultParse, {
        "child": () => syntax.right,
        "node": (childs) => {
            let node = new ParserNode;
            node.str = `return`;
            if (childs[0].str)
                node.str += " " + childs[0].str;
            return node;
        }
    });
};
const exprgroupFunc = (syntax, parent) => {
    return Object.assign({}, defaultParse, {
        "child": () => syntax.right,
        "node": (childs) => {
            let node = new ParserNode;
            node.str = "";
            if (childs === null)
                return node;
            let lastIndex = childs.length - 1;
            for (var i = 0; i < lastIndex; i++) {
                node.str += childs[i].str + ",";
            }
            if (childs[lastIndex]) {
                node.str += childs[lastIndex].str;
            }
            return node;
        }
    });
};
const singlelstringFunc = lstringFunc;
const parserFunc = {
    "jarr": jarrFunc,
    "jobj": jobjFunc,
    "jpair": jpairFunc,
    "stringstr": stringstrFunc,
    "jscript": jscriptFunc,
    "jstring": jstringFunc,
    "number": baseFunc,
    "bool": baseFunc,
    "null": baseFunc,
    "body": bodyFunc,
    "script": scriptFunc,
    "exec": execFunc,
    "fielde": fieldeFunc,
    "field": fieldFunc,
    "call": callFunc,
    "def": defFunc,
    "dv": dvFunc,
    "!": negFunc,
    "--": mulmulFunc,
    "++": addaddFunc,
    "=": assignFunc,
    "+": addFunc,
    "-": subFunc,
    "*": mulFunc,
    "/": divFunc,
    "%": remFunc,
    "+=": addEqualFunc,
    "-=": subEqualFunc,
    "*=": mulEqualFunc,
    "/=": divEqualFunc,
    "%=": remEqualFunc,
    "===": tripleEqualFunc,
    "!==": tripleUnequalFunc,
    "==": doubleEqualFunc,
    "!=": doubleUnequalFunc,
    "<=": lessEqualFunc,
    ">=": bigEqualFunc,
    "<": lessFunc,
    ">": bigFunc,
    "|": orFunc,
    "&": andFunc,
    "||": ororFunc,
    "&&": andandFunc,
    "bracket": bracketFunc,
    "obj": objFunc,
    "kv": kvFunc,
    "arr": arrFunc,
    "jsexpr": jsExprFunc,
    "if": ifFunc,
    "else": elseFunc,
    "elseif": elseifFunc,
    "for": forFunc,
    "while": whileFunc,
    "jscontinue": jscontinueFunc,
    "jsbreak": jsbreankFunc,
    "return": genBaseFunc,
    "new": newFunc,
    "cond": condFunc,
    "jsblock": jsblockFunc,
    "jsbody": jsbodyFunc,
    "jsfnargs": jsfnargsFunc,
    "jsfn": jsfnFunc,
    "jsdef": jsdefFunc,
    "jsif": jsifFunc,
    "jselseif": jselseifFunc,
    "jselse": jselseFunc,
    "jsfor": jsforFunc,
    "jswhile": jswhileFunc,
    "jsswitch": jsswitchFunc,
    "jscase": jscaseFunc,
    "jsdefault": jsdefaultFunc,
    "jstry": jstryFunc,
    "jscatch": jscatchFunc,
    "jsfinally": jsfinallyFunc,
    "jsreturn": jsreturnFunc,
    "exprgroup": exprgroupFunc,
    "identifier": genBaseFunc,
    "float": genBaseFunc,
    "floate": genBaseFunc,
    "integer16": genBaseFunc,
    "integer": genBaseFunc,
    "integer10": genBaseFunc,
    "string": genBaseFunc,
    "true": genBaseFunc,
    "false": genBaseFunc,
    ";": genBaseFunc
    // "identifier":identifierFunc//identifier,只在js中可能被解析到
};
parserFunc.html = parserFunc.body;
parserFunc.el = parserFunc.body;
/**
 * 将child的hash汇总为childhash
 */
const sumChildHash = (node, childs) => {
    for (let i = 0; i < childs.length; i++) {
        node.childHash ^= hash.nextHash(tpl_1.calTextHash(childs[i].hash + ""), i + 1);
    }
    node.hash ^= node.childHash;
};
/**
 * 只有tag才需要用到的
 */
const calTagHash = (node, tagName) => {
    node.hash = hash.nextHash(node.hash, tpl_1.calTextHash(tagName));
};
//字符都有双层引号，并不需要去掉，因为在字符串转函数的时候会自动去掉一层
const trimQuo = (str) => str.substring(1, str.length - 1);
const isBuildIn = (syntax) => syntax.type == "string" || syntax.type == "number" || syntax.type == "bool" || syntax.type == "true" || syntax.type == "false" || syntax.type == "null" || syntax.type == "undefined" ||
    syntax.type == "integer" || syntax.type == "integer16" || syntax.type == "float" || syntax.type == "identifier" || syntax.type == "singlequotestring" || syntax.type == "regular";
const isScript = (syntax) => syntax.type == "script";
const isjstrjscript = (syntax) => syntax.type == "jscript" || syntax.type == "jstr";
//本身就有引号了
const parseBuildIn = (syntax) => {
    return syntax.value;
};
const isAttrStr = (syntax) => syntax.type == "attrStr";
// ================ JS的处理整体要简单很多
// child -> node->pre -> suf
let defaultParse = {
    "child": () => [],
    "node": (childs) => {
        let node = new ParserNode();
        return node;
    },
    "pre": (node) => ``,
    "suf": (node) => ``
};
let sid = 0;
const getJsonKey = (syntax) => {
    if (syntax.type === "jstring") {
        return `"${syntax.right[0].value}"`;
    }
    else if (syntax.type === "identifier") {
        return `"${syntax.value}"`;
    }
};
const findJsonContainer = (syntax) => {
    if (!syntax) {
        return null;
    }
    if (syntax.type === "jarr" || syntax.type === "jpair") {
        return syntax;
    }
    return findJsonContainer(syntax.parent);
};
const getJarrJpair = (p, value) => {
    if (p.type === "jarr") {
        return `node.push(${value});`;
    }
    else { //jpair
        let key = getJsonKey(p.right[0]);
        return `node[${key}] = ${value};`;
    }
};
/**
 * @description 转换字符串成模板函数
 * @example
 */
exports.toFun = (s, path) => {
    try {
        return (new Function("_nextHash", "_anyHash", "_get", "return" + s.slice(0, s.length - 1)))(hash.nextHash, hash.anyHash, mod_1.commonjs ? mod_1.commonjs.relativeGet : null);
    }
    catch (e) {
        log_1.warn(exports.level, "tpl toFun, path: " + path + ", s: ", s, e);
        throw (e);
    }
};
});
