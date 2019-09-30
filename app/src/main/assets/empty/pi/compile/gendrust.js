_$define("pi/compile/gendrust", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hash = require("../util/hash");
const tpl_1 = require("../util/tpl");
const util_1 = require("../util/util");
//rs编译为ts
exports.translate = (arr, path, cfg) => {
    return exports.tplFunc(null, arr, path, cfg);
};
//将语法树转换成ts代码
exports.gen = (syntax) => {
    if (!syntax) {
        return [];
    }
    let arr = preorder(syntax);
    return arr;
};
// ====================================== 本地
//先序遍历
const preorder = (syntax) => {
    let funcs = seekFunc(syntax);
    let childs = funcs.child() || [];
    let childNodes = [];
    for (let i = 0; i < childs.length; i++) {
        let childNode = preorder(childs[i]);
        if (childNode)
            childNodes.push(childNode); //存在空文本节点的情况		
    }
    let node = funcs.node(childNodes);
    return node;
};
//每一个节点都有pre字符串和suf字符串
const seekFunc = (syntax) => {
    try {
        return parserFunc[syntax.type](syntax);
    }
    catch (error) {
        throw `parserFunc[${syntax.type}]不是一个方法！`;
    }
};
//"extern"#?, "crate"#?, identifierd, ";"#?;
const declarCreatFunc = (syntax) => {
    return Object.assign({}, defaultParse, {
        "child": () => syntax.right,
        "node": (childs) => {
            let node = new DeclarCreat();
            node.name = childs[0];
            return node;
        }
    });
};
//["pub"], "mod"#?, identifierd, ";"#?;
const declarModFunc = (syntax) => {
    return Object.assign({}, defaultParse, {
        "child": () => syntax.right,
        "node": (childs) => {
            let node = new DeclarMod();
            node.name = childs[childs.length - 1];
            if (childs.length === 2) {
                node.power = childs[0];
            }
            return node;
        }
    });
};
//"*"#?, |"mut", "const"|, type;
const ptrTypeFunc = (syntax) => {
    return Object.assign({}, defaultParse, {
        "child": () => [syntax.right[1]],
        "node": (childs) => {
            let node = new Type();
            node.name = "*";
            let mutable = syntax.right[0].value;
            if (mutable === "mut") {
                node.isMut = true;
            }
            else { //mutable === "const"
                node.isMut = false;
            }
            node.type = childs[0];
            return node;
        }
    });
};
//"("#?, typeDesc, [{","#?, typeDesc}], ")"#?;
const tupleBodyFunc = (syntax) => {
    return Object.assign({}, defaultParse, {
        "child": () => syntax.right,
        "node": (childs) => {
            let node = new Type();
            node.name = "Tuple";
            node.childs = childs;
            return node;
        }
    });
};
//"["#?, typeDesc, [","#?, "integer"], "]"#?;
const arrBodyFunc = (syntax) => {
    return Object.assign({}, defaultParse, {
        "child": () => {
            return syntax.right; //type
        },
        "node": (childs) => {
            let node = new Type();
            node.name = "Array";
            node.type = childs[0];
            node.len = childs[1] - 0;
            return node;
        }
    });
};
//|"bool", "str", "char", "i8", "i16", "i32", "i64", "u8", "u16", "u32", "u64", "u128", "isize", "usize", "f32", "f64"|;
const baseTypeFunc = (syntax) => {
    return Object.assign({}, defaultParse, {
        "child": () => [],
        "node": (childs) => {
            let node = new Type();
            node.name = syntax.right[0].value;
            return node;
        }
    });
};
//|"!"#?, fnType, baseType, tupleBody, arrBody, igenType, importType, ptrType|
const typeFunc = (syntax) => {
    return Object.assign({}, defaultParse, {
        "child": () => syntax.right,
        "node": (childs) => {
            if (syntax.right[0].type === "Self") {
                let t = new Type();
                t.name = "Self";
                return t;
            }
            else {
                return childs[0];
            }
        }
    });
};
//["&"], ["mut"], "self";
const selfPronounFunc = (syntax) => {
    return Object.assign({}, defaultParse, {
        "child": () => [],
        "node": (childs) => {
            let node = new Type();
            node.name = "self";
            for (let i = 0; i < syntax.right.length; i++) {
                if (syntax.right[i].type === "&") {
                    node.isQuote = true;
                }
                else if (syntax.right[i].type === "mut") {
                    node.isMut = true;
                }
            }
            return node;
        }
    });
};
//["pub"]#?, ["ref"]#?, ["mut"], identifierd, ":"#?, typeDesc;
const keyTypeFunc = (syntax) => {
    return Object.assign({}, defaultParse, {
        "child": () => syntax.right,
        "node": (childs) => {
            let right = syntax.right;
            let node = new KeyType();
            let isMut;
            for (let i = 0; i < right.length; i++) {
                if (right[i].type === "mut") {
                    isMut = true;
                }
                else if (right[i].type === "identifierd") {
                    node.name = childs[i];
                }
                else if (right[i].type === "typeDesc") {
                    node.type = childs[i];
                }
            }
            let key;
            if (syntax.right.length === 2) {
                key = syntax.right[0];
            }
            else if (syntax.right.length === 3) {
                key = syntax.right[1];
            }
            parseNote(key, node); //解析注释和注解
            node.isMut = isMut;
            return node;
        }
    });
};
//["&"], ["lifetime"], ["mut"], type;
const typeDescFunc = (syntax) => {
    return Object.assign({}, defaultParse, {
        "child": () => syntax.right,
        "node": (childs) => {
            let t = childs[childs.length - 1];
            for (let i = 0; i < syntax.right.length; i++) {
                if (syntax.right[i].type === "&") {
                    t.isQuote = true;
                }
                else if (syntax.right[i].type === "mut") {
                    t.isMut = true;
                }
                else if (syntax.right[i].type === "lifetime") {
                    t.lifeTime = childs[i];
                }
            }
            return t;
        }
    });
};
//typeDesc, ":"#?, traitLimit;
const genAndTraitFun = (syntax) => {
    return Object.assign({}, defaultParse, {
        "child": () => syntax.right,
        "node": (childs) => {
            let genType = new Type();
            //genType.name = childs[0];
            genType.type = childs[0];
            genType.traitBound = [];
            for (let i = 1; i < childs[1].length; i++) {
                genType.traitBound[i - 1] = childs[1][i];
            }
            return genType;
        }
    });
};
//|identifierd, genIdentifier#?|, [{"::"#?, identifierd}];
const importTypeFunc = (syntax) => {
    return Object.assign({}, defaultParse, {
        "child": () => { return syntax.right; },
        "node": (childs) => {
            let node = new Type(), ts = [];
            for (var i = 0; i < syntax.right.length; i++) {
                ts.push(childs[i]);
            }
            node.name = ts.join("::");
            return node;
        }
    });
};
//importType, genType;
const igenTypeFunc = (syntax) => {
    return Object.assign({}, defaultParse, {
        "child": () => {
            return syntax.right; //genType
        },
        "node": (childs) => {
            let node = childs[0];
            node.genType = childs[1];
            return node;
        }
    });
};
//|"Fn", "FnMut", "FnOnce"|, func;
const fnTraitFunc = (syntax) => {
    return Object.assign({}, defaultParse, {
        "child": () => { return syntax.right; },
        "node": (childs) => {
            let node = new FnTrait();
            node.name = childs[0];
            node.func = childs[1];
            return node;
        }
    });
};
//"fn"#?, func;
const fnTypeFunc = (syntax) => {
    return Object.assign({}, defaultParse, {
        "child": () => syntax.right,
        "node": (childs) => {
            return childs[0];
        }
    });
};
//fnParam, [fnReturn];
const funcFunc = (syntax) => {
    return Object.assign({}, defaultParse, {
        "child": () => syntax.right,
        "node": (childs) => {
            let node = new Func();
            node.params = childs[0];
            childs[1] && (node.result = childs[1]);
            return node;
        }
    });
};
//["pub"], ["default"]#?, ["extern", "string"]#?, ["unsafe"], "fn"#?, identifierd, [genType], func, [where], |body#?, ";"#?|;
const defFnFunc = (syntax) => {
    return Object.assign({}, defaultParse, {
        "child": () => syntax.right,
        "node": (childs) => {
            let node = new DefFunc();
            for (let i = 0; i < syntax.right.length; i++) {
                if (syntax.right[i].type === "pub") {
                    node.power = "pub";
                }
                else if (syntax.right[i].type === "identifierd") {
                    node.name = childs[i];
                }
                else if (syntax.right[i].type === "genType") {
                    node.genType = childs[i];
                }
                else if (syntax.right[i].type === "func") {
                    node.func = childs[i];
                }
                else if (syntax.right[i].type === "where") {
                    for (let j = 0; j < childs[i].length; j++) {
                        if (node.genType) {
                            for (let k = 0; k < node.genType.length; k++) {
                                if (node.genType[k].name === childs[i][j].name) {
                                    node.genType[k].traitBound = childs[i][j].traitBound;
                                }
                            }
                        }
                    }
                }
                else if (syntax.right[i].type === "unsafe") {
                    node.unsafe = true;
                }
            }
            parseNote(syntax, node);
            return node;
        }
    });
};
//|"identifierd", "default"|;
const identifierdFunc = (syntax) => {
    return Object.assign({}, defaultParse, {
        "child": () => syntax.right,
        "node": (childs) => {
            return childs[0];
        }
    });
};
//"("#?, [self], [|keyType, typeDesc|], [{","#?, |keyType, typeDesc|}], ")"#?;
const fnParamFunc = (syntax) => {
    return Object.assign({}, defaultParse, {
        "child": () => syntax.right,
        "node": (childs) => {
            return childs;
        }
    });
};
//"->"#?, typeDesc;
const fnReturnFunc = (syntax) => {
    return Object.assign({}, defaultParse, {
        "child": () => syntax.right,
        "node": (childs) => {
            return childs[0];
        }
    });
};
// [{defFn}];
const funcsFunc = (syntax) => {
    return Object.assign({}, defaultParse, {
        "child": () => syntax.right,
        "node": (childs) => {
            return childs;
        }
    });
};
//"where"#?, genAndTrait, [{","#?, genAndTrait}];
const whereFunc = (syntax) => {
    return Object.assign({}, defaultParse, {
        "child": () => syntax.right,
        "node": (childs) => childs
    });
};
//"identifierd", "="#?, typeDesc;
const assocValueFunc = (syntax) => {
    return Object.assign({}, defaultParse, {
        "child": () => syntax.right,
        "node": (childs) => {
            let node = new AssocType();
            node.name = childs[0];
            node.type = childs[1];
            return node;
        }
    });
};
const onlyRightFunc = (syntax) => {
    return Object.assign({}, defaultParse, {
        "child": () => syntax.right
    });
};
const valueFunc = (syntax) => {
    return Object.assign({}, defaultParse, {
        "node": (childs) => {
            return syntax.value;
        }
    });
};
//{|defTriat#?, defStruct, defEnum, defStructEmpty, defStructTuple, importMany, importOne, impl, defFn, implTrait#?, newType|};
const fileFunc = (syntax) => {
    return Object.assign({}, defaultParse, {
        "child": () => syntax.right,
        "node": (childs) => {
            return childs;
        }
    });
};
//["pub"]#?, "const"#?5, "identifierd", ":"#?, typeDesc, "="#?, |"string", "integer", "float", "integer10", "integer16", "floate", "true", "false"|, ";"#?back;
const defConstFunc = (syntax) => {
    return Object.assign({}, defaultParse, {
        "child": () => syntax.right,
        "node": (childs) => {
            let node = new DefConst();
            defFunc(childs, node, syntax);
            node.value = childs[2];
            node.type = "const";
            return node;
        }
    });
};
//["pub"], "struct"#?, "identifierd", [genType], [where], dataBody;
const defStructFunc = (syntax) => {
    return Object.assign({}, defaultParse, {
        "child": () => syntax.right,
        "node": (childs) => {
            let node = new DefStruct();
            defFunc(childs, node, syntax);
            node.members = childs[childs.length - 1]; //dataBody
            node.type = "Struct";
            return node;
        }
    });
};
//["pub"], "enum"#?, "identifierd", [genType], [where], "{"#?, [{enumMemberc}], "}"#?;
const defEnumCFunc = (syntax) => {
    return Object.assign({}, defaultParse, {
        "child": () => syntax.right,
        "node": (childs) => {
            let node = new DefEnumC();
            node.type = "enumc";
            defFunc(childs, node, syntax);
            for (let i = 0; i < childs.length; i++) {
                if (syntax.right[i].type === "enumMemberc") {
                    node.members = node.members || [];
                    node.members.push(childs[i]);
                }
            }
            return node;
        }
    });
};
//["pub"], "enum"#?, identifierd, [genType], [where], "{"#?, [{enumMember}], "}"#?
const defEnumFunc = (syntax) => {
    return Object.assign({}, defaultParse, {
        "child": () => syntax.right,
        "node": (childs) => {
            let node = new DefEnum();
            node.type = "enum";
            defFunc(childs, node, syntax);
            for (let i = 0; i < childs.length; i++) {
                if (syntax.right[i].type === "enumMember") {
                    node.members = node.members || [];
                    node.members.push(childs[i]);
                }
                else {
                    continue;
                }
            }
            return node;
        }
    });
};
//"identifierd", ["="#?, |"string","integer", "float", "integer10", "integer16", "floate"|], ","#?;
const enumMembercFunc = (syntax) => {
    return Object.assign({}, defaultParse, {
        "child": () => syntax.right,
        "node": (childs) => {
            let node = new KeyValue();
            node.name = childs[0];
            node.value = childs[1];
            parseNote(syntax, node); //解析注释和注解
            return node;
        }
    });
};
//|@"identifierd", tupleBody@, @"identifierd", dataBody@, "identifierd"|, ","#?;
const enumMemberFunc = (syntax) => {
    return Object.assign({}, defaultParse, {
        "child": () => syntax.right,
        "node": (childs) => {
            let node = new DefStruct();
            node.name = childs[0];
            if (syntax.right[1]) {
                if (syntax.right[1].type === "tupleBody") {
                    node.type = "StructTuple";
                    node.members = childs[1].childs;
                }
                else if (syntax.right[1].type === "dataBody") {
                    node.type = "Struct";
                    node.members = childs[1];
                }
            }
            else {
                node.type = "Empty";
            }
            parseNote(syntax, node); //解析注释和注解
            return node;
        }
    });
};
//"{"#?, {keyType, ","#?}, [keyType], "}"#?;
const dataBodyFunc = (syntax) => {
    return Object.assign({}, defaultParse, {
        "child": () => syntax.right,
        "node": (childs) => {
            return childs;
        }
    });
};
//["pub"], "struct"#?, "identifierd", [genType], [where], tupleBody;
const defStructTupleFunc = (syntax) => {
    return Object.assign({}, defaultParse, {
        "child": () => syntax.right,
        "node": (childs) => {
            let node = new DefStruct();
            defFunc(childs, node, syntax);
            node.members = childs[childs.length - 1];
            node.type = "StructTuple";
            return node;
        }
    });
};
//["pub"], "struct"#?, "identifierd", ["{"#?, "}"#?];
const defStructEmptyFunc = (syntax) => {
    return Object.assign({}, defaultParse, {
        "child": () => syntax.right,
        "node": (childs) => {
            let node = new DefStruct();
            defFunc(childs, node, syntax);
            node.type = "StructEmpty";
            return node;
        }
    });
};
//["pub"], "type"#?, "identifierd", [genType], "="#?, typeDesc, ";"#?;
const newTypeFunc = (syntax) => {
    return Object.assign({}, defaultParse, {
        "child": () => syntax.right,
        "node": (childs) => {
            let node = new NewType();
            for (let i = 0; i < syntax.right.length; i++) {
                if (syntax.right[i].type === "identifierd") {
                    node.name = childs[i];
                }
                else if (syntax.right[i].type === "genType") {
                    node.genType = childs[i];
                }
                else if (syntax.right[i].type === "pub") {
                    node.power = "pub";
                }
                else if (syntax.right[i].type === "typeDesc") {
                    node.value = childs[i];
                }
            }
            return node;
        }
    });
};
// ["pub"], ["unsafe"]#?, "trait"#?, identifierd, [genType], [":"#?, traitLimit#?]#?, [where], "{"#?, [{defAssocType#?}], funcs, "}"#?;
const defTriatFunc = (syntax) => {
    return Object.assign({}, defaultParse, {
        "child": () => syntax.right,
        "node": (childs) => {
            let node = new DefStruct();
            for (let i = 0; i < syntax.right.length; i++) {
                if (syntax.right[i].type === "identifierd") {
                    node.name = childs[i];
                }
            }
            //defFunc(childs, node, syntax);
            //node.type = "StructEmpty";
            //暂不解析，似乎用不到
            return node;
        }
    });
};
//"impl"#?, [genType], type, "{"#?, funcs, "}"#?;
//implStruct
const implFunc = (syntax) => {
    return Object.assign({}, defaultParse, {
        "child": () => syntax.right,
        "node": (childs) => {
            let node = new Impl();
            defFunc(childs, node, syntax);
            node.type = childs[childs.length - 2];
            node.funcs = childs[childs.length - 1];
            return node;
        }
    });
};
//["unsafe"]#?, "impl"#?, [genType], type, "for"#?, typeDesc, [where], "{"#?, [{newType}]#?, funcs, "}"#?;
const implTraitFunc = (syntax) => {
    return Object.assign({}, defaultParse, {
        "child": () => syntax.right,
        "node": (childs) => {
            let node = new Impl();
            //defFunc(childs, node, syntax);
            for (let i = 0; i < syntax.right.length; i++) {
                if (syntax.right[i].type === "genType") {
                    node.genType = childs[i];
                }
                else if (syntax.right[i].type === "type") {
                    node.trait = childs[i];
                }
                else if (syntax.right[i].type === "typeDesc") {
                    node.type = childs[i];
                }
                else if (syntax.right[i].type === "where") {
                    let bounds = childs[i];
                    for (let j = 0; j < bounds.length; j++) {
                        for (let k = 0; k < node.genType.length; k++) {
                            if (node.genType[k].name === bounds[j].name) {
                                node.genType[k].traitBound = bounds[j].traitBound;
                                break;
                            }
                        }
                    }
                }
                else if (syntax.right[i].type === "funcs") {
                    node.funcs = childs[i];
                }
            }
            return node;
        }
    });
};
//定义结构体或枚举或方法
const defFunc = (childs, node, syntax) => {
    for (let i = 0; i < childs.length; i++) {
        if (syntax.right[i].type === "pub") {
            node.power = "pub";
        }
        else if (syntax.right[i].type === "identifierd") {
            node.name = childs[i];
        }
        else if (syntax.right[i].type === "genType") {
            node.genType = childs[i];
        }
        else if (syntax.right[i].type === "where") {
            for (let j = 0; j < childs[i].length; j++) {
                for (let k = 0; k < node.genType.length; k++) {
                    if (node.genType[k].name === childs[i][j].name) {
                        node.genType[k].traitBound = childs[i][j].traitBound;
                        break;
                    }
                }
            }
        }
    }
    parseNote(syntax, node); //解析注释和注解
};
//"<"#?, |assocValue#?, genAndTrait, typeDesc, traitLimit, "lifetime"#?|, [{","#?, |assocValue#?, genAndTrait, typeDesc, traitLimit, "lifetime"#?|}], ">"#?;
const genTypeFunc = (syntax) => {
    return Object.assign({}, defaultParse, {
        "child": () => syntax.right,
        "node": (childs) => {
            for (let i = 0; i < childs.length; i++) {
                if (syntax.right[i].type === "traitLimit" && childs[i].childs) {
                    if (childs[i].childs.length === 1) {
                        childs[i] = childs[i].childs[0];
                    }
                    else if (childs[i].childs.length === 0) {
                        childs = childs.slice(0, i).concat(childs.slice(i + 1, childs.length));
                        i--;
                    }
                }
            }
            return childs;
        }
    });
};
//|igenType, fnTrait, importType, "?Sized"#?, "lifetime"#?|, [{"+"#?, |fnTrait, igenType, importType, "?Sized"#?, "lifetime"#?|}];
const traitLimitFunc = (syntax) => {
    return Object.assign({}, defaultParse, {
        "child": () => syntax.right,
        "node": (childs) => {
            let node = new Type();
            node.name = "limits";
            node.childs = childs;
            return node;
        }
    });
};
//["pub"], "use"#?,"identifierd",[{"::"#?, "identifierd"}], "::"#?, importCs, [";"#?];
const importManyFunc = (syntax) => {
    return Object.assign({}, defaultParse, {
        "child": () => {
            return syntax.right;
        },
        "node": (childs) => {
            let node = new Import();
            node.type = "import";
            let paths = [], contents;
            let i = 0;
            if (childs[0] === "pub") {
                node.power = "pub";
                i = 1;
            }
            for (; i < childs.length; i++) {
                if (i < childs.length - 1) {
                    paths.push(childs[i]);
                }
                else {
                    contents = childs[i];
                }
            }
            node.path = paths.join("/");
            node.contents = contents;
            parseNote(syntax, node); //解析注释和注解
            return node;
        }
    });
};
//["pub"]#?, "use"#?6,"modname"#back, [{"::"#?6, "modname"#back}], ["::","*"], ["as", identifierd], [";"#?];
const importOneFunc = (syntax) => {
    return Object.assign({}, defaultParse, {
        "child": () => {
            return syntax.right;
        },
        "node": (childs) => {
            let node = new Import();
            node.type = "importOne";
            let paths = [], contents;
            let i = 0;
            if (childs[0] === "pub") {
                node.power = "pub";
                i = 1;
            }
            for (; i < childs.length; i++) {
                if (i < childs.length - 1) {
                    paths.push(childs[i]);
                }
                else {
                    contents = childs[i].split(",");
                }
            }
            node.path = paths.join("/");
            node.contents = contents;
            parseNote(syntax, node); //解析注释和注解
            return node;
        }
    });
};
//"{"#?, [{|importAs, identifierd|, ","#?}], "}"#?;
const importCsFunc = (syntax) => {
    return Object.assign({}, defaultParse, {
        "child": () => {
            return syntax.right;
            ;
        },
        "node": (childs) => {
            return childs;
        }
    });
};
//identifierd, "as"#?, identifierd;
const importAsFunc = (syntax) => {
    return Object.assign({}, defaultParse, {
        "child": () => {
            return syntax.right;
            ;
        },
        "node": (childs) => {
            return childs;
        }
    });
};
// ================ JS的处理整体要简单很多
// child -> node->pre -> suf
let defaultParse = {
    "child": () => [],
    "node": (childs) => {
        return null;
    }
};
//解析注释和注解
const parseNote = (syntax, node) => {
    if (syntax.preNotes) {
        let preNotes = syntax.preNotes;
        for (let i = 0; i < preNotes.length; i++) {
            if (preNotes[i].type === "commentBlockPre" || preNotes[i].type === "commentLinePre") {
                if (!node.preComment)
                    node.preComment = [];
                node.preComment.push(preNotes[i].value);
            }
            else if (preNotes[i].type === "annotatePre") {
                if (!node.annotate)
                    node.annotate = {};
                let ans = preNotes[i].value.slice(3, preNotes[i].value.length - 1).split(",");
                parseAnnotate(ans, node.annotate);
            }
        }
    }
    if (syntax.sufNotes) {
        let sufNotes = syntax.sufNotes;
        for (let i = 0; i < sufNotes.length; i++) {
            if (sufNotes[i].type === "commentBlockSuf" || sufNotes[i].type === "commentLineSuf") {
                if (!node.sufNotes)
                    node.sufNotes = [];
                node.sufNotes.push(sufNotes[i].value);
            }
            else if (sufNotes[i].type === "annotateSuf") {
                if (!node.annotate)
                    node.annotate = {};
                let ans = sufNotes[i].value.slice(2, sufNotes[i].value.length - 1).split(",");
                parseAnnotate(ans, node.annotate);
            }
        }
    }
};
//解析注解
const parseAnnotate = (ans, anno) => {
    let temp;
    for (let i = 0; i < ans.length; i++) {
        temp = ans[i].split("=");
        if (temp.length === 1) {
            anno[temp[0]] = true;
        }
        else if (temp.length === 2) {
            anno[temp[0]] = `${temp[1]}`;
        }
    }
};
const parserFunc = {
    "file": fileFunc,
    "declarCreat": declarCreatFunc,
    "declarMod": declarModFunc,
    "importOne": importOneFunc,
    "importMany": importManyFunc,
    "importCs": importCsFunc,
    "importAs": importAsFunc,
    "defConst": defConstFunc,
    "defStruct": defStructFunc,
    "defEnum": defEnumFunc,
    "defEnumC": defEnumCFunc,
    "defStructEmpty": defStructEmptyFunc,
    "defStructTuple": defStructTupleFunc,
    "defTriatTuple": defTriatFunc,
    "defTriat": defTriatFunc,
    "defFn": defFnFunc,
    "impl": implFunc,
    "implTrait": implTraitFunc,
    "newType": newTypeFunc,
    "enumMember": enumMemberFunc,
    "enumMemberc": enumMembercFunc,
    "dataBody": dataBodyFunc,
    "keyType": keyTypeFunc,
    "typeDesc": typeDescFunc,
    "selfPronoun": selfPronounFunc,
    "fnReturn": fnReturnFunc,
    "fnParam": fnParamFunc,
    "funcs": funcsFunc,
    "where": whereFunc,
    "genAndTrait": genAndTraitFun,
    "traitLimit": traitLimitFunc,
    "fnTrait": fnTraitFunc,
    "func": funcFunc,
    "assocValue": assocValueFunc,
    "ptrType": ptrTypeFunc,
    "fnType": fnTypeFunc,
    "genType": genTypeFunc,
    "importType": importTypeFunc,
    "type": typeFunc,
    "tupleBody": tupleBodyFunc,
    "igenType": igenTypeFunc,
    "arrBody": arrBodyFunc,
    "baseType": baseTypeFunc,
    "identifierd": identifierdFunc,
    "bool": valueFunc,
    "char": valueFunc,
    "str": valueFunc,
    "i8": valueFunc,
    "i16": valueFunc,
    "i32": valueFunc,
    "i64": valueFunc,
    "u8": valueFunc,
    "u16": valueFunc,
    "u32": valueFunc,
    "u64": valueFunc,
    "u128": valueFunc,
    "isize": valueFunc,
    "usize": valueFunc,
    "f32": valueFunc,
    "f64": valueFunc,
    "Self": valueFunc,
    "String": valueFunc,
    "default": valueFunc,
    "identifier": valueFunc,
    "float": valueFunc,
    "floate": valueFunc,
    "integer16": valueFunc,
    "integer": valueFunc,
    "integer10": valueFunc,
    "string": valueFunc,
    "true": valueFunc,
    "false": valueFunc,
    "modname": valueFunc,
    "pub": valueFunc,
    "unsafe": valueFunc,
    "self": valueFunc,
    "Fn": valueFunc,
    "FnMut": valueFunc,
    "FnOnce": valueFunc,
    "FnBox": valueFunc,
    "&": valueFunc,
    "mut": valueFunc,
    "!": valueFunc,
    "as": valueFunc,
    "dyn": valueFunc,
};
exports.enref = (type, name, mod, structName) => {
    let str = "";
    if (type.name === "Self" || type.name === "self") {
        str += name;
    }
    else if (type.name.endsWith("FnBox")) {
        str += name;
    }
    else {
        let full = mod.getFullMod(type.name);
        if (exports.isRef(full)) {
            str += full + "::new(";
            str += exports.enref(type.genType[0], name, mod, structName);
            str += ")";
        }
        else {
            str += name;
        }
    }
    return str;
};
class RustMod {
    constructor(modName, parent) {
        this.imports = []; //外部依赖模块
        this.modNote = ""; //模块注释
        //临时变量
        this.impls = [];
        this.funs = [];
        this.modName = modName;
        this.parentMod = parent;
        this.modHash = hash.strHashCode(modName, 0);
        this.mods = new Map();
    }
    setCfg(cfg) {
        this.cfg = cfg;
    }
    init(objects) {
        //设置模块注释
        if (objects[0]) {
            let o = objects[0];
            if (o.sufNotes) {
                for (let i = 0; i < o.sufNotes.length; i++) {
                    this.modNote += "\n" + o.sufNotes[i];
                }
            }
        }
        for (let i = 0; i < objects.length; i++) {
            if (objects[i] instanceof Import) {
                this.imports.push(objects[i]);
            }
            else if (objects[i] instanceof DefStruct || objects[i] instanceof DefEnum || objects[i] instanceof DefEnumC) {
                !this.classes && (this.classes = new Map());
                this.classes.set(objects[i].name, objects[i]);
            }
            else if (objects[i] instanceof Impl) {
                !this.impls && (this.impls = []);
                this.impls.push(objects[i]);
            }
            else if (objects[i] instanceof DefFunc) {
                if (objects[i].power === "pub") {
                    !this.funs && (this.funs = []);
                    this.funs.push(objects[i]);
                }
            }
            else if (objects[i] instanceof NewType) {
                !this.newTypeMap && (this.newTypeMap = new Map());
                this.newTypeMap.set(objects[i].name, objects[i]);
            }
        }
    }
    /**将类型转换为全路径， 如： "Vector" -> "pi_math::vector::Vector"
     * @param intoCatch 该类型转换后是否进入缓存
     * @param tree 如果存在tree参数， 表示需要给本库的类型加上库名
    */
    getFullMod(name, intoCatch = true, tree) {
        if (name === "fn" || name === "Fn" || name === "FnMut" || name === "FnOnce" || name === "FnBox") {
            return name;
        }
        if (!exports.isNativeObject(name)) {
            return name;
        }
        !this.typeCache && (this.typeCache = new Map());
        let p = name;
        let f = this.typeCache.get(name);
        if (f) {
            p = f.namespace;
        }
        else {
            let nickname = "";
            let names = name.split("::");
            let n = names[0];
            if (this.getClass(n)) {
                let pre = "";
                if (!this.cfg.default) {
                    pre += (tree.isMain ? "" : (tree.creatName + "::")) + (this.parentMod ? this.parentMod + "::" : "") + (this.modName ? (this.modName + "::") : "");
                }
                p = pre + name;
            }
            else {
                for (let i = 0; i < this.imports.length; i++) {
                    if (this.imports[i].type === "importOne") {
                        let ps = this.imports[i].path.split("/");
                        if (this.imports[i].contents[0] === n) {
                            //names = names.slice(1, names.length);
                            p = (ps.length > 0 && ps[0] ? (ps.join("::") + "::") : "") + names.join("::");
                        }
                    }
                    else {
                        let ps = this.imports[i].path.split("/");
                        for (let j = 0; j < this.imports[i].contents.length; j++) {
                            if (typeof this.imports[i].contents[j] === "string") {
                                if (this.imports[i].contents[j] === n) {
                                    p = (ps.length > 0 && ps[0] ? (ps.join("::") + "::") : "") + name;
                                    break;
                                }
                            }
                            else {
                                if (this.imports[i].contents[j][1] === n) {
                                    let name = names.length > 1 ? ("::" + names.slice(1, names.length).join("::")) : "";
                                    nickname = this.imports[i].contents[j][1];
                                    p = (ps.length > 0 && ps[0] ? (ps.join("::") + "::") : "") + this.imports[i].contents[j][0] + name;
                                    break;
                                }
                            }
                        }
                    }
                }
                if (tree) {
                    let pp = p.split("::");
                    if (tree.declarMods.indexOf(pp[0]) > -1) {
                        p = (tree.isMain ? "" : (tree.creatName + "::")) + p;
                    }
                }
            }
            if (intoCatch) {
                let r = { namespace: p, hash: hash.strHashCode(p, 0), nickname: nickname };
                this.typeCache.set(name, r);
                this.typeCache.set(p, r);
            }
        }
        if (p.startsWith("std::")) {
            let ss = p.split("::");
            return ss[ss.length - 1];
        }
        return p;
    }
    mod() {
        return (this.parentMod ? this.parentMod + "::" : "") + this.modName;
    }
    isImport(s) {
        let arr = s.split("::");
        for (let i = 0; i < this.imports.length; i++) {
            // if(this.imports[i].type === "importOne"){
            // 	let ps = this.imports[i].path.split("/");
            // 	if(ps[ps.length - 1] === s){
            // 		return true;
            // 	}
            // }else{
            let ps = this.imports[i].path.split("/");
            let j = 0;
            let r = 0;
            if (ps.length > 0 && ps[0]) {
                for (; j < arr.length; j++) {
                    if (ps[r] === arr[j]) {
                        r++;
                        continue;
                    }
                    if (r === ps.length || ps[j] !== arr[j] && r > 0) {
                        break;
                    }
                }
            }
            for (let k = 0; k < this.imports[i].contents.length; k++) {
                if (typeof this.imports[i].contents[k] === "string") {
                    if (this.imports[i].contents[k] === arr[j]) {
                        return true;
                    }
                }
                else {
                    if (this.imports[i].contents[k][0] === arr[j]) {
                        return true;
                    }
                }
            }
            //}
        }
    }
    getClass(s) {
        if (this.classes) {
            let r = this.classes.get(s);
            if (r)
                return r;
        }
        if (this.newTypeMap) {
            let r = this.newTypeMap.get(s);
            if (r)
                return r;
        }
        if (this.traits) {
            let r = this.traits.get(s);
            if (r)
                return r;
        }
        return null;
    }
    //根据配置设置方法的调用方式(同步，异步，阻塞)， 如果是异步或阻塞方法，会分析该方法的回调函数的参数类型
    setCallMode(fn, cfg, tree, parent) {
        let flag = false;
        let fun = fn.fn;
        if (cfg.async && cfg.async.indexOf(fn.fullPath) > -1) {
            flag = fn.async = true;
        }
        if (cfg.sync && cfg.sync.indexOf(fn.fullPath) > -1) {
            flag = fn.sync = true;
        }
        if (flag) {
            let params = fn.fn.func.params;
            if (!params || params.length < 1) {
                throw `函数${fn.name}不含有参数， 无法构建为一个异步或阻塞方法！`;
            }
            let ct = params[params.length - 1].type; //回调函数类型
            let genType = getGen(fun.genType, ct.name) || (parent && getGen(parent.genType, ct.name));
            let callBackFunc; //回调方法
            if (!ct.genType) { //如果函数类型被定义为一个newtype
                let name = this.getFullMod(ct.name);
                let mod = tree.getMod(name.replace("::" + ct.name, "").replace(tree.creatName + "::", ""));
                let t = mod.newTypeMap.get(ct.name);
                fn.callBack = t.value;
            }
            else {
                fn.callBack = ct;
            }
            let fnValue = exports.deref(fn.callBack, this);
            if (fnValue.name === "limits") { //traitobj, 含有多个特征绑定
                for (let i = 0; i < fnValue.childs.length; i++) {
                    if (fnValue.childs[i].name === "Fn" || fnValue.childs[i].name === "FnOnce" || fnValue.childs[i].name === "FnMut" || fnValue.childs[i].name === "FnBox") {
                        fnValue = fnValue.childs[i];
                        break;
                    }
                }
            }
            if (fnValue) {
                if (fnValue.func.params && fnValue.func.params.length === 1) {
                    let p = fnValue.func.params[0];
                    if (p instanceof KeyType) {
                        fn.callBackPT = exports.newTypeToType(p.type, this, tree);
                    }
                    else {
                        fn.callBackPT = exports.newTypeToType(p, this, tree);
                    }
                }
                else if (fnValue.func.params && fnValue.func.params.length > 1) {
                    throw "回调函数的参数只能有一个或0个！";
                }
            }
            else {
                throw "阻塞或异步方法要求函数最后一个参数必须是一个回调函数";
            }
        }
    }
}
exports.RustMod = RustMod;
class ModTree extends RustMod {
    /*构造函数
    * @param  creatName 库名
    * @param  lib lib.rs中定义的类型
    * */
    constructor(creatName, lib, isMain, isDef) {
        super("", "");
        this.map = new Map();
        this.creatName = creatName;
        this.isMain = isMain;
        this.isDef = isDef;
        this.declarMods = [];
        this.declarCreats = [];
        this.pubDeclarMods = [];
        for (let i = 0; i < lib.length; i++) {
            if (lib[i] instanceof DeclarCreat) {
                this.declarCreats.push(lib[i].name);
            }
            else if (lib[i] instanceof DeclarMod) {
                if (lib[i].power === "pub") {
                    this.pubDeclarMods.push(lib[i].name);
                }
                this.declarMods.push(lib[i].name);
            }
        }
        this.init(lib);
    }
    addMod(name, objs) {
        let names = name.split("::");
        let m = this.map;
        let p = "";
        for (let i = 0; i < names.length; i++) {
            let mc = m.get(names[i]);
            if (!mc) {
                mc = new RustMod(names[i], p);
                m.set(names[i], mc);
            }
            if (i === names.length - 1) {
                mc.init(objs);
            }
            m = mc.mods;
        }
    }
    getMod(name) {
        if (name === "") {
            return this;
        }
        let names = typeof name === "string" ? name.split("::") : name;
        let map = this.map;
        for (let i = 0; i < names.length; i++) {
            if (i === names.length - 1) {
                return map.get(names[i]);
            }
            else {
                let r = map.get(names[i]);
                if (r && r.mods) {
                    map = r.mods;
                }
                else {
                    //throw "找不到模块：" + name;
                    return null;
                }
            }
        }
    }
    getClass(name) {
        let names = typeof name === "string" ? name.split("::") : name;
        if (names.length == 1) {
            return super.getClass(names[0]);
        }
        let mod = this.getMod(names.slice(0, names.length - 1));
        if (!mod) {
            return null;
        }
        return mod.getClass(names[names.length - 1]);
    }
    analyze(map) {
        if (map.size === 0) {
            return;
        }
        map.forEach((mod, k) => {
            this.analyzeMod(mod);
        });
    }
    analyzeMod(mod) {
        if (mod.impls) {
            mod.classFunc = new Map();
            for (let i = 0; i < mod.impls.length; i++) {
                analyzeImpl(mod, mod.impls[i], this);
            }
        }
        if (mod.funs) {
            let funMap = new Map();
            for (let i = 0; i < mod.funs.length; i++) {
                exports.sumFunc(funMap, mod.funs[i], mod, this, null, null, null, mod.cfg);
            }
            mod.funMap = funMap;
        }
    }
}
exports.ModTree = ModTree;
//解析impl
const analyzeImpl = function (mod, obj, tree) {
    let m = mod.cfg.default ? "" : mod.mod() + "::";
    let path = (tree.isMain ? "" : (tree.creatName + "::")) + m + exports.typeToString(obj.type) + (obj.trait ? "::" + exports.typeToString(obj.trait) : "");
    if (mod.classes) {
        let c = mod.classes.get(obj.type.name);
        if ((c && c.power !== "pub") || !exports.isInclude(path, mod.cfg)) {
            return;
        }
        else if (c && c.genType && c.genType.length > 0 && !mod.cfg.genType[path]) {
            return;
        }
        else if (exports.isBase(obj.type) || exports.isArray(obj.type.name) || exports.isTuple(obj.type.name)) { //如果是基础类型或数组或元组， 不需要解析
            return;
        }
        if (c && obj.trait && mod.getFullMod(obj.trait.name, true, tree) === "std::ops::Deref") {
            c.deref = obj.funcs[0];
        }
        let genTypeCfgs = obj.genType ? exports.initGenCfg(obj.genType, path, mod.cfg.genType) : exports.initGenCfg(obj.type.genType, path, mod.cfg.genType);
        let name = obj.type.name;
        let funMap = mod.classFunc.get(name);
        let objType = exports.getActType(obj.type, genTypeCfgs);
        if (!funMap) {
            funMap = new Map();
            mod.classFunc.set(name, funMap);
        }
        let funcs = obj.funcs;
        for (let z = 0; z < genTypeCfgs.length; z++) {
            for (let j = 0; j < funcs.length; j++) {
                exports.sumFunc(funMap, funcs[j], mod, tree, obj, path, genTypeCfgs[z], mod.cfg);
            }
        }
    }
};
// export const tansType = (t: Type): string => {
// 	return typeToString(parseType(t));
// }
exports.isInteger = (type) => {
    if (type === "i8" || type === "i16" || type === "i32" || type === "u8" || type === "u16" || type === "u32" || type === "isize" || type === "usize")
        return true;
};
exports.isBigInt = (type) => {
    if (type === "i64" || type === "u64") {
        return 8;
    }
    else if (type === "i128" || type === "u128") {
        return 16;
    }
    else if (type === "i256" || type === "u256") {
        return 32;
    }
    else {
        return false;
    }
};
// export const isFloat = (type: string) => {
// 	if(type === "f32" || type === "f64" ) return true;
// }
// export const isString = (type: string) => {
// 	if(type === "str" || type === "char" ) return true;
// }
exports.isInclude = (name, cfg) => {
    if (cfg.include) {
        if (cfg.include.indexOf(name) > -1)
            return true;
    }
    else {
        if (!cfg.ignore || cfg.ignore.indexOf(name) < 0)
            return true;
    }
    return false;
};
exports.isNumber = (type) => {
    if (type === "i8" || type === "i16" || type === "i32" || type === "i64" || type === "u8" || type === "u16" || type === "u32" || type === "isize" || type === "usize" || type === "f32" || type === "f64")
        return true;
};
exports.isStr = (type) => {
    if (type === "str" || type === "char" || type === "String")
        return true;
};
exports.isBool = (type) => {
    if (type === "bool")
        return true;
};
exports.isArray = (type) => {
    if (type === "Array") {
        return true;
    }
    else {
        return false;
    }
};
//是否为引用类型
exports.isAtom = (type) => {
    if (type === "atom::Atom") {
        return true;
    }
    else {
        return false;
    }
};
//是否为引用类型
exports.isRef = (type) => {
    if (type === "std::sync::Arc" || type === "std::rc::Rc" || type === "Box" || type === "std::boxed::Box" || type === "std::cell::RefCell" || type === "std::sync::RwLock" || type === "std::sync::Mutex" || type === "std::cell::Cell" || type === "Arc" || type === "Rc" || type === "RefCell" || type === "RwLock" || type === "Mutex" || type === "Cell") {
        return true;
    }
};
//如果为引用类型, 对其进行解引用
exports.deref = (type, mod, structName) => {
    if (type.name === "Self" || type.name === "self") {
        let t = new Type();
        t.name = structName;
        return t;
    }
    if (exports.isRef(mod.getFullMod(type.name))) {
        return exports.deref(type.genType[0], mod, structName);
    }
    else {
        return type;
    }
};
exports.isArrayBuffer = (type) => {
    // if(type.name === "Vec" && type.genType && type.genType[0].name === "u8"){
    // 	return true;
    // }else 
    if (type.name === "Array" || type.type.name === "u8") {
        return true;
    }
    else {
        return false;
    }
};
exports.isTuple = (type) => {
    if (type === "Tuple") {
        return true;
    }
    else {
        return false;
    }
};
//是否为c枚举
exports.isEnumC = (type, mod, tree) => {
    let arr = type.split("::");
    let last = arr[arr.length - 1];
    if (mod.classes) {
        let r = mod.classes.get(last);
        if (r && r instanceof DefEnumC) {
            // let mod_name = type.slice(0, type.length - last.length - 2);
            // for(let i = 0; i < r.members.length; i++){
            //     if tree.getMod(mod_name)
            // }
            return r;
        }
    }
    return false;
};
exports.isNativeObject = (type) => {
    if (!exports.isNumber(type) && !exports.isStr(type) && !exports.isBool(type) && !exports.isArray(type) && !exports.isTuple(type) && !exports.isBigInt(type))
        return true;
};
exports.isBase = (type) => {
    if (!exports.isNumber(type.name) && !exports.isStr(type.name) && !exports.isBool(type.name))
        return false;
    else
        return true;
};
//检查数组中是否存在NativeObject
exports.arrHasNObj = (type) => {
    let t;
    // if (type.name === "Vec"){
    //     t = type.genType[0];
    // }else{
    t = type.type;
    //}
    if (exports.isArray(t.name)) {
        return exports.arrHasNObj(t);
    }
    else if (exports.isTuple(t.name)) {
        return exports.tupleHasNObj(t);
    }
    else if (!exports.isBase(t)) { // 是NativeObject
        return true;
    }
};
//检查元组中是否存在NativeObject
exports.tupleHasNObj = (type) => {
    for (let i = 0; i < type.childs.length; i++) {
        let t = type.childs[i];
        if (exports.isArray(t.name) /* || t.name === "Vec"*/) {
            return exports.arrHasNObj(t);
        }
        else if (exports.isTuple(t.name)) {
            return exports.tupleHasNObj(t);
        }
        else if (!exports.isBase(t)) { // 是NativeObject
            return true;
        }
    }
};
//合并泛型
exports.mergeGenType = (cfg1, cfg2) => {
    let o = {};
    for (let k in cfg1) {
        o[k] = cfg1[k];
    }
    for (let k in cfg2) {
        if (!o[k]) {
            o[k] = cfg2[k];
        }
    }
    return o;
};
//对照rust定义的泛型和配置的泛型是否匹配， 得出需要实现的泛型数组
exports.getGenType = (genTypes, genTypeCfg) => {
    if (!genTypes || genTypes.length === 0) { //如果泛型为定义
        return [{ "": "" }];
    }
    if (!genTypeCfg) { //如果泛型未配置
        return [];
    }
    let arr = [];
    for (let i = 0; i < genTypeCfg.length; i++) {
        if (typeof genTypeCfg[i] === "string") { //如果配置中的泛型是一个字符串，表示泛型只有一个，将其转换成数组再与定义的泛型个数比较
            genTypeCfg[i] = [genTypeCfg[i]];
        }
        if (genTypes.length != genTypeCfg[i].length) { //泛型个数不相等，抛出异常
            let gen1 = genTypeCfg[i].join(",");
            let gen2 = "";
            for (let j = 0; j < genTypes.length; i++) {
                if (j > 0) {
                    gen2 += ",";
                }
                gen2 += genTypes[j].name;
            }
            throw `You want to implement generic ${gen1}, in fact he is ${gen2}`;
        }
        let map = {};
        for (let j = 0; j < genTypes.length; j++) {
            let name = genTypes[j].name ? genTypes[j].name : genTypes[j].type.name;
            map[name] = genTypeCfg[i][j];
        }
        arr.push(map);
    }
    return arr;
};
// export const isParamSelf = (type: Type) => {
// 	if(type instanceof self) return true;
// }
exports.mut = (type) => {
    if (type.isMut) {
        return "mut";
    }
    else {
        return "";
    }
};
exports.quote = (type) => {
    if (type.isQuote) {
        return "&";
    }
    else {
        return "";
    }
};
exports.getActType = (type, genType) => {
    if (!type) {
        return;
    }
    if (genType && genType[type.name]) {
        let t = genType[type.name].clone();
        t.isQuote = type.isQuote;
        return t;
    }
    let t = type.clone();
    if (t.type) {
        t.type = exports.getActType(t.type, genType);
    }
    if (t.childs) {
        let childs = t.childs;
        t.childs = [];
        for (let i = 0; i < childs.length; i++) {
            t.childs[i] = exports.getActType(childs[i], genType);
        }
    }
    if (t.genType) {
        let gens = t.genType;
        t.genType = [];
        for (let i = 0; i < gens.length; i++) {
            t.genType[i] = exports.getActType(gens[i], genType);
        }
    }
    return t;
};
exports.typeToString = (type, isAll, struct, r, tranself = true, tree) => {
    let str = "";
    if (isAll) {
        str += exports.quote(type);
        str += exports.mut(type);
    }
    if (type.name === "Array") {
        str += "[";
        str += exports.typeToString(type.type, true, struct, r, tranself, tree);
        if (type.len) {
            str += "," + type.len;
        }
        str += "]";
    }
    else if (type.name === "Tuple") {
        str += "(";
        for (let i = 0; i < type.childs.length; i++) {
            if (i > 0) {
                str += ",";
            }
            str += exports.typeToString(type.childs[i], true, struct, r, tranself, tree);
        }
        str += ")";
    }
    else if (type.name === "self" || type.name === "Self") {
        if (tranself) {
            if (!struct) {
                throw "类型self无法转换成对应类型";
            }
            return struct;
        }
        else {
            return type.name;
        }
    }
    else if (type.name === "*") {
        let mc = type.isMut ? "mut" : "const";
        return "*" + mc + " " + exports.typeToString(type.type, true, struct, r, true, tree);
    }
    else {
        let t = r ? r.getFullMod(type.name, true, tree) : type.name;
        if (tree && tree.isDef && t.startsWith(tree.creatName)) {
            let start = (t.lastIndexOf("::") === -1) ? 0 : (t.lastIndexOf("::") + 2);
            t = t.slice(start, t.length);
        }
        str += t;
        if (type.genType && type.genType.length > 0) {
            str += exports.genTypeToString(type.genType, r, tree);
        }
    }
    return str;
};
//如果一个类型是一个NewType, 将会被替换成真正的类型, 如果不是全路径， 也将转换类型的全路径
exports.newTypeToType = (type, mod, tree, useOld /*是否使用传入类型作为返回值*/) => {
    if (!type) {
        return;
    }
    let t = useOld ? type : type.clone();
    if (type.type || type.genType || type.childs) {
        let genType = type.genType, tt = type.type, childs = type.childs;
        tt && exports.newTypeToType(tt, mod, tree, useOld);
        if (genType) {
            t.genType = [];
            for (let i = 0; i < genType.length; i++) {
                t.genType.push(exports.newTypeToType(genType[i], mod, tree, useOld));
            }
        }
        if (childs) {
            t.childs = [];
            for (let i = 0; i < childs.length; i++) {
                t.childs.push(exports.newTypeToType(childs[i], mod, tree, useOld));
            }
        }
    }
    let namefull, name;
    if (!tree.isDef) {
        namefull = mod.getFullMod(type.name, true, tree);
        let start = (namefull.lastIndexOf("::") === -1) ? 0 : (namefull.lastIndexOf("::") + 2);
        name = namefull.slice(start, namefull.length); //取到名字
    }
    else {
        namefull = name = type.name;
    }
    t.name = namefull;
    let modname = (namefull.lastIndexOf("::") === -1) ? "" : namefull.replace("::" + name, "").replace(tree.creatName + "::", "");
    let m = tree.getMod(modname);
    if (!m) {
        return t;
    }
    if (m.newTypeMap) {
        let newType = m.newTypeMap.get(name);
        if (newType) {
            let value = newType.value;
            let newt = exports.newTypeToType(value, mod, tree, false);
            if (newType.genType) {
                for (let i = 0; i < newType.genType.length; i++) {
                    for (let j = 0; j < newt.genType.length; j++) {
                        if (newType.genType[i].name === newt.genType[j].name) {
                            newt.genType[j] = t.genType[i];
                        }
                    }
                }
            }
            return newt;
        }
        else {
            return t;
        }
    }
    else {
        return t;
    }
};
//将一个genType还原为字符串
exports.genTypeToString = (types, r, tree) => {
    let arr = exports.genTypes(types, r, tree);
    let str = "<" + arr.join(",") + ">";
    return str;
};
exports.genTypes = (types, r, tree) => {
    let strs = [];
    for (let i = 0; i < types.length; i++) {
        let t = types[i];
        if (!t.name && t.type) {
            strs.push(exports.typeToString(types[i].type, true, null, r, false, tree));
        }
        else {
            strs.push(exports.typeToString(types[i], true, null, r, false, tree));
        }
    }
    return strs;
};
exports.fnGenTypes = (uses, genCfg, r, tree) => {
    let strs = [];
    for (let i = 0; i < uses.length; i++) {
        strs.push(r.getFullMod(exports.typeToString(genCfg[uses[i]], false, null, r, false, tree)));
    }
    return strs;
};
exports.useGen = (params, result, gens) => {
    let arr = [];
    if (params && params.length > 0) {
        for (let i = 0; i < params.length; i++) {
            if (params[i].name != "self") {
                let s = gontainType(gens, params[i].type, arr);
                //s && arr.indexOf(s) < 0 && arr.push(s);
            }
        }
    }
    if (result) {
        let s = gontainType(gens, result, arr);
        //s && arr.indexOf(s) < 0 && arr.push(s);
    }
    return arr;
};
//
exports.allGens = (fn, impl) => {
    let arr = [];
    fn.genType && (arr = arr.concat(exports.genTypes(fn.genType)));
    if (impl) {
        if (impl.genType) {
            arr = arr.concat(exports.genTypes(impl.genType));
        }
        else if (impl.type.genType) {
            for (let i = 0; i < impl.type.genType.length; i++) {
                arr.push(impl.type.genType[i].name);
            }
        }
    }
    return arr;
};
//泛型包含某个类型
const gontainType = (gens, type, arr) => {
    let index = gens.indexOf(type.name);
    if (gens.indexOf(type.name) > -1) {
        if (arr.indexOf(gens[index]) < 0) {
            arr.push(gens[index]);
        }
    }
    else if (type.genType) {
        for (let i = 0; i < type.genType.length; i++) {
            gontainType(gens, type.genType[i], arr);
        }
    }
    else if (type.type) {
        gontainType(gens, type.type, arr);
    }
    else if (type.childs) {
        for (let i = 0; i < type.childs.length; i++) {
            gontainType(gens, type.childs[i], arr);
        }
    }
};
//计算方法的hash值， 规则 fnHash.nextHash(traitHash).nexHash(gen)
exports.funHash = (modHash, fnNameStr, traitStr, gens) => {
    let h = modHash;
    h = hash.strHashCode(fnNameStr, h);
    if (traitStr) {
        h = hash.strHashCode(traitStr, h);
    }
    if (gens) {
        for (let i = 0; i < gens.length; i++) {
            h = hash.strHashCode(gens[i], h);
        }
    }
    return h;
};
class GenRustContex {
    constructor(outMode) {
        this.typeCache = new Map();
        this.registerObjMap = new Map();
        this.stds = new Map();
        this.usesOther = new Map();
        this.outMode = outMode;
    }
}
exports.GenRustContex = GenRustContex;
class GenFun {
}
exports.GenFun = GenFun;
const getGen = (genTypes, name) => {
    if (genTypes) {
        for (let i = 0; i < genTypes.length; i++) {
            if (genTypes[i].name === name) {
                return genTypes[i];
            }
        }
    }
};
/**
 * 函数命名规则: 函数名 + 特征名 + 函数泛型
 * */
exports.sumFunc = (funcMap, fn, mod, tree, impl, pMod, parentCfg, cfg) => {
    let path;
    let fType = new Type();
    fType.name = fn.name;
    fType.genType = fn.genType;
    if (tree.isDef) { }
    if (impl) {
        path = pMod + "::" + exports.typeToString(fType);
    }
    else {
        path = (tree.isMain ? "" : (tree.creatName + "::")) + mod.mod() + "::" + exports.typeToString(fType);
    }
    if (!impl && fn.power !== "pub") {
        return;
    }
    else if (impl && !impl.trait && fn.power !== "pub") {
        return;
    }
    else if (!exports.isInclude(path, cfg)) {
        return;
    }
    else if (fn.genType && !cfg.genType[path]) {
        return;
    }
    let genTypeCfgs = exports.initGenCfg(fn.genType, path, cfg.genType);
    let result = fn.func.result;
    let params = fn.func.params;
    let gens = exports.allGens(fn, impl ? impl : null);
    let fnName = fn.name, trait, type;
    if (impl) {
        trait = impl.trait, type = impl.type;
        trait && (fnName += "_" + trait.name);
    }
    for (let j = 0; j < genTypeCfgs.length; j++) {
        let g = exports.mergeGenType(parentCfg, genTypeCfgs[j]);
        let usegens = exports.useGen(params, result, gens);
        let fnGenType = exports.fnGenTypes(usegens, g, mod, tree);
        let gn = exports.fnGenName(fnGenType);
        let name = fnName;
        gn && (name += "_" + gn);
        let fun = funcMap.get(name);
        if (fun) {
            continue;
        }
        fun = new GenFun();
        funcMap.set(name, fun);
        fun.fn = fn;
        //fun.genTypeCfg = g;
        fun.name = name;
        if (impl) {
            fun.structName = impl.type.name;
            let t = exports.getActType(impl.type, parentCfg);
            fun.structStr = exports.typeToString(t, false, null, mod, false, tree);
            fun.implGenStr = t.genType ? exports.genTypeToString(t.genType, mod, tree) : "";
            trait && (fun.traitName = mod.getFullMod(trait.name, false, tree));
        }
        fun.hash = exports.funHash(mod.modHash, fn.name + (fun.structName ? fun.structName : ""), trait ? trait.name : "", fnGenType);
        fun.fullPath = (fun.structName ? fun.structName + "::" : "") + exports.typeToString(fType);
        let r = exports.analyzeParam(params, g, mod, tree);
        fun.params = r[0];
        fun.hasJs = r[1];
        if (fun.hasJs) {
            fn.func.params = params.slice(0, params.length - 1);
        }
        fun.result = exports.newTypeToType(exports.getActType(result, g), mod, tree, true);
        if (fn.genType) {
            let gs = [];
            for (let k = 0; k < fn.genType.length; k++) {
                gs[k] = exports.getActType(gs[k], g);
            }
            fun.genType = gs;
        }
        mod.setCallMode(fun, cfg, tree, impl);
    }
};
//解析参数（替换参数中的泛型）
exports.analyzeParam = (params, genTypeCfg, mod, tree) => {
    if (!params) {
        return [null, false];
    }
    let r = [];
    let hasJs = false;
    for (let i = 0; i < params.length; i++) {
        let p = params[i];
        if (p instanceof KeyType) {
            let pNew = exports.getActType(p.type, genTypeCfg);
            pNew = exports.newTypeToType(pNew, mod, tree, true);
            let nn = exports.deref(pNew, mod, "");
            if (i === params.length - 1 && nn.name === "pi_vm::adapter::JS") {
                hasJs = true;
                continue;
            }
            r.push({ name: p.name, type: pNew });
        }
        else if (p.name === "self") {
            r.push(p);
        }
        else { //p instanceof Type
            r.push(exports.newTypeToType(exports.getActType(p, genTypeCfg), mod, tree, true));
        }
    }
    return [r, hasJs];
};
exports.fnGenName = (gens) => {
    //let uses = useGen(params, result, gens);
    let strs = [];
    for (let i = 0; i < gens.length; i++) {
        let s = gens[i];
        let li = s.indexOf("<");
        if (li > -1) {
            s = s.slice(0, li);
        }
        li = s.lastIndexOf("::");
        if (li > -1) {
            s = s.slice(li + 2, s.length);
        }
        strs.push(s);
    }
    return strs.join("_");
};
exports.initGenCfg = (genType, path, cfg) => {
    if (!genType || genType.length === 0) {
        return [{ "": "" }];
    }
    let genTypeCfgs = cfg[path];
    if (!genTypeCfgs) {
        return [{ "": "" }];
    }
    return exports.getGenType(genType, genTypeCfgs);
};
// export const isBool = (type: string) => {
// 	if(type === "bool") return true;
// }
// export const isStruct = (type: string) => {
// 	if(!isNumber(type) && !isString(type) && type !== "bool" && type !== "Array"&& type !== "Map" && type !== "Tuple") return true;
// }
class Type {
    clone() {
        let t = new Type();
        t.name = this.name;
        t.genType = this.genType;
        t.traitBound = this.traitBound;
        t.isMut = this.isMut;
        t.isQuote = this.isQuote;
        t.lifeTime = this.lifeTime;
        t.childs = this.childs;
        t.childs = this.childs;
        t.type = this.type;
        t.len = this.len;
        return t;
    }
}
exports.Type = Type;
//库
class DeclarCreat {
}
exports.DeclarCreat = DeclarCreat;
//模块
class DeclarMod {
}
exports.DeclarMod = DeclarMod;
//关联类型
class AssocType {
}
exports.AssocType = AssocType;
class NewType {
}
exports.NewType = NewType;
class FnTrait {
    clone() {
        let f = new FnTrait();
        f.name = this.name;
        f.func = new Func();
        if (this.func.params) {
            f.func.params = [];
            for (let i = 0; i < this.func.params.length; i++) {
                f.func.params[i] = this.func.params[i].clone();
            }
        }
        if (this.func.result) {
            f.func.result = this.func.result.clone();
        }
        return f;
    }
}
exports.FnTrait = FnTrait;
class Func {
}
exports.Func = Func;
class Note {
}
exports.Note = Note;
class Def extends Note {
}
exports.Def = Def;
class DefStruct extends Def {
}
exports.DefStruct = DefStruct;
class DefConst extends Def {
}
exports.DefConst = DefConst;
class DefEnumC extends Def {
}
exports.DefEnumC = DefEnumC;
class DefEnum extends Def {
}
exports.DefEnum = DefEnum;
class DefFunc extends Def {
}
exports.DefFunc = DefFunc;
class Import extends Note {
}
exports.Import = Import;
class Member {
}
exports.Member = Member;
class KeyType extends Note {
    clone() {
        let kv = new KeyType();
        kv.name = this.name;
        kv.type = this.type.clone();
        kv.isMut = this.isMut;
        return kv;
    }
}
exports.KeyType = KeyType;
class KeyValue extends Note {
}
exports.KeyValue = KeyValue;
class Impl extends Def {
}
exports.Impl = Impl;
// export const restoreType = (t: Type): string => {
// 	return typeToString(parseType(t));
// }
// export const typeToString = (tg: TG): string => {
// 	if(tg.type === "Tuple"){
// 		return "[" + tg.genType.join(",") + "]";
// 	}
// 	let type;
// 	if(isNumber(tg.type)){
// 		type = "number";
// 	}else if(isString(tg.type)){
// 		type = "string";
// 	}else if(tg.type === "bool"){
// 		type = "boolean";
// 	}else{
// 		type = tg.type;
// 	}
// 	if(!tg.genType)
// 		return type;
// 	let str;			
// 	if(tg.genType){
// 		str += type + "<" + tg.genType.join(",") + ">";
// 	}
// 	return str;
// }
// export const parseType = (t: Type): TG => {
// 	let type : TG = {type: t.type};
// 	if(!t.genType){
// 		return type;
// 	}
// 	type.genType = [];
// 	for(let i = 0; i < t.genType.length; i++){
// 		type.genType.push(typeToString(parseType(t.genType[i])));
// 	}
// 	return type;
// }
const createWBStr = (type, key) => {
    if (type.name === "f32") {
        return `bb.writeF32(this.${key});`;
    }
    else if (type.name === "f64") {
        return `bb.writeF64(this.${key});`;
    }
    else if (exports.isInteger(type.name)) {
        return `bb.writeInt(this.${key});`;
    }
    else if (exports.isStr(type.name)) {
        return `bb.writeUtf8(this.${key});`;
    }
    else if (type.name === "bool") {
        return `bb.writeBool(this.${key});`;
    }
};
/**
 * @description  返回定义的函数, 用定义字符串，转成匿名函数的返回函数
 * @example
 */
exports.toFunc = (s) => {
    try {
        return (new Function("_stringify", "_tsTypeStr", "_typeToString", "_isNativeObject", "_isInteger", "_isString", "_createWBStr", "_isBase", "_strHashCode", "_upperFirst", "return " + s))(tpl_1.toString, tsTypeStr, exports.typeToString, exports.isNativeObject, exports.isInteger, exports.isStr, createWBStr, exports.isBase, hash.strHashCode, util_1.upperFirst);
    }
    catch (e) {
        //warn(level, "tpl toFun, path: "+", s: ", s, e);
        throw (e);
    }
};
function tsTypeStr(type, mod, structName) {
    if (exports.isNumber(type.name)) {
        return "number";
    }
    else if (exports.isBigInt(type.name)) {
        return "bigInt.BigInteger";
    }
    else if (exports.isStr(type.name)) {
        return "string";
    }
    else if (exports.isArray(type.name)) {
        return "Array<" + tsTypeStr(type.type, mod, structName) + ">";
    }
    else if (exports.isBool(type.name)) {
        return "boolean";
    }
    else if (exports.isTuple(type.name)) {
        let elems = [];
        for (let i = 0; i < type.childs.length; i++) {
            elems.push(tsTypeStr(type.childs[i], mod, structName));
        }
        return "[" + elems.join(",") + "]";
    }
    else if (mod && exports.isRef(mod.getFullMod(type.name))) {
        return tsTypeStr(exports.deref(type, mod, structName), mod, structName);
    }
    else if (type.name === "*") { //指针类型
    }
    else if (exports.isNativeObject(type.name)) {
        return type.name;
    }
    else {
        throw "无法处理泛型类型：" + type.name;
    }
}
exports.typeStr = tsTypeStr;
});
