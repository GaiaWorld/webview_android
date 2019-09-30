_$define("pi/compile/genrust2ts", function (require, exports, module){
"use strict";
/**
 * cfg: {
 * 		"genType":[elem, elem],    //elem: string | [string, string], 描述类型中只有一个泛型时，可以直接使用string表示，否则必须用数组表示
 * 		"include":[path, path], //需要导出的类型路径, 如果不配置，表示导出限制为“pub”的类型
 * 		"ignore":[path, path], //需要忽略的类型路径
 * }
 */
Object.defineProperty(exports, "__esModule", { value: true });
const hash = require("../util/hash");
const tpl_str_1 = require("../util/tpl_str");
const tpl_1 = require("../util/tpl");
const Gendrust = require("./gendrust");
var pathMode = require("path");
// ====================================== 导出
//将rust接口解析为ts接口
exports.gen = (mod, cfg, tree) => {
    let depend = cfg.depend || {};
    //let map = new Map();
    let pcfg = new PathCfg(cfg);
    let root = cfg.root;
    let str = mod.modNote ? mod.modNote : "";
    return str + gen1(mod, cfg.depend || {}, pcfg, tree, root);
};
exports.genCfg = (mods) => {
    let str = {};
    mods.forEach((mod, k) => {
        if (mod.classFunc) {
            mod.classFunc.forEach((c, k) => {
                str[k] = mod.mod();
            });
        }
    });
    return JSON.stringify(str);
};
const gen1 = (mod, depend, pcfg, tree, root) => {
    let str = "";
    let imports = new Map();
    pcfg.setModPath(mod, tree);
    for (let k in depend) {
        let dp = getRelPath(pcfg, depend[k][1].split("/"), tree);
        if (depend[k][0].startsWith("* as")) {
            str += `\nimport ${depend[k][0]} from "${dp}";`;
        }
        else {
            str += `\nimport {${depend[k][0]}} from "${dp}";`;
        }
    }
    let ss = "";
    if (mod.classFunc) {
        mod.classFunc.forEach((funMap, k) => {
            let c = mod.classes.get(k);
            if (!c) {
                return;
            }
            c.tsflag = true;
            let arr = [funMap];
            if (c.deref) {
                let funcDeref = mod.classFunc.get(c.deref.func.result.name);
                arr.push(funcDeref);
            }
            ss += structFun(k, arr, mod, imports, tree, c, root);
        });
    }
    if (mod.funMap) {
        mod.funMap.forEach((v, k) => {
            ss += funcFun(v, mod, imports, tree, null);
        });
    }
    if (mod.classes) {
        mod.classes.forEach((v, k) => {
            if (v.tsflag === true || v.power !== "pub" || !Gendrust.isInclude(mod.getFullMod(v.name, false, tree), mod.cfg)) {
                return;
            }
            else {
                if (v instanceof Gendrust.DefEnumC) {
                    ss += enumcFun(v);
                }
                else {
                    ss += structFun(k, [], mod, null, tree, v, root);
                }
            }
        });
    }
    // if(mod.newTypeMap){
    //     mod.newTypeMap.forEach((v, k) => {
    //         if(v.power !== "pub" || !Gendrust.isInclude( mod.getFullMod(v.name, true, tree), mod.cfg)){
    //             return;
    //         }else{
    //             let value = v.value;
    //             let name = mod.getFullMod(value.name, true, tree);
    //             imports.set(mod.typeCache.get(value.name).namespace, true);
    //             ss += "\n" + `export type ${k} = ${value.name}`;
    //         }
    //     });
    // }
    str += genImport(pcfg, mod, imports, tree);
    str += ss;
    // if(str){
    // 	map.set(mod.mod(), str);
    // }
    // if(mod.mods && mod.mods.size > 0){
    // 	gen1(mod.mods, map, depend, pcfg, defCfg, eve);
    // }
    return str;
};
class PathCfg {
    constructor(cfg) {
        this.outMode = cfg.outMode;
        this.buildPath = cfg.buildPath; //build.cfg的路径
        this.srcPath = pathMode.join(this.buildPath, "../../src"); //src路径
    }
    setModPath(mod, tree) {
        this.modPath = tree.creatName + (mod.mod() ? ("::" + mod.mod()) : "");
        this.selfPath = pathMode.join(this.srcPath, this.modPath.replace(/::/g, "/")); //模块本身的路径
    }
}
const genImport = (cfg, mod, imports, tree) => {
    let str = "";
    imports.forEach((v, k) => {
        let ks = k.split("::");
        if (tree.isMain && tree.pubDeclarMods.indexOf(ks[0]) > -1) {
            ks = [tree.creatName].concat(ks);
        }
        let last = ks[ks.length - 1];
        if (!mod.getClass(v || last) && !mod.isImport(k) && tree.pubDeclarMods.indexOf(ks[0]) < 0) {
            if (Gendrust.isRef(k)) {
                return;
            }
            if (tree.creatName === "def") { //如果是标准库
                let modName = findModByType(v || last, tree.map);
                if (modName) {
                    ks = [modName].concat(ks);
                }
            }
            else {
                ks = ["def", k.toLowerCase()].concat(ks);
            }
        }
        ks.length--;
        let p = getRelPath(cfg, ks, tree);
        if (p) {
            let r = v ? (last + " as " + v) : last;
            str += "\n" + `import {${r}} from "${p}"`;
        }
    });
    return str;
};
const findModByType = (name, map) => {
    for (let mod of map.values()) {
        if (mod.classes && mod.classes.get(name)) {
            return mod.mod();
        }
        else if (mod.newTypeMap && mod.newTypeMap.get(name)) {
            return mod.mod();
        }
        else if (mod.mods) {
            let s = findModByType(name, mod.mods);
            if (s) {
                return s;
            }
        }
    }
};
const getRelPath = (cfg, ks, tree) => {
    let first = ks[0];
    if (ks.length <= 0)
        return;
    let iPath;
    if (first === "..") {
        let r = [];
        for (let i = 0; i < cfg.modPath.split("::").length - 1; i++) {
            r.push("..");
        }
        let pre = r.join("/");
        return (pre ? pre + "/" : "") + ks.join("/");
    }
    if (first && (first === "def" || first === "std" || tree.declarCreats.indexOf(first) > -1) || first === "js_njs") { //引入外部库
        iPath = pathMode.join(cfg.buildPath, "../../src/" + ks.join("/")); //src路径
    }
    else if (ks.indexOf(cfg.modPath) === 0) {
        iPath = pathMode.join(cfg.srcPath, ks.join("/"));
    }
    else {
        iPath = pathMode.join(cfg.buildPath, "../../src/" + ks.join("/")); //src路径
    }
    if (iPath === cfg.selfPath) {
        return;
    }
    let p = preDir(pathMode.relative(cfg.selfPath, iPath).replace(/\\/g, "/"));
    return p;
};
const preDir = (s) => {
    let str = s.slice(3, s.length);
    if (str.indexOf("../") < 0) {
        str = "./" + str;
    }
    return str;
};
// 取到类型本身中含有的泛型类型
const genTypes = (cfg, type, result) => {
    if (cfg[type.name]) {
        result[type.name] = true;
    }
    if (type.genType) {
        for (let i = 0; i < type.genType.length; i++) {
            genTypes(cfg, type.genType[i], result);
        }
    }
};
//name, funcs, _funcFun
const structFun = (name, funcs, mod, imports, tree, c, root, tab) => {
    let str = c.sufNotes ? "\n" + c.sufNotes.join("\n") : "";
    let path = root + tree.creatName + "/" + mod.mod().replace("::", "/") + "." + name;
    str += tplFunc.structTpl(null, name, hash.strHashCode(mod.mod() + "::" + name, 0), funcs, funcFun, mod, imports, tree, path);
    if (tab) {
        str = str.replace(/^/mg, tab);
    }
    return str;
};
//fn, _callParamTpl, _tsTypeStr
const funcFun = (fn, mod, imports, tree, tab) => {
    let str = fn.fn.sufNotes ? "\n" + fn.fn.sufNotes.join("\n") : "";
    str += tplFunc.noteTpl(null, fn);
    let count = 0;
    if (fn.async || fn.sync) {
        if (fn.async) {
            str += tplFunc.funcAsyncTpl(null, fn, mod, hash.strHashCode("async", fn.hash), callParamFun, callResultFun, tree, imports);
        }
        if (fn.sync) {
            str += tplFunc.funcSyncTpl(null, fn, mod, hash.strHashCode("sync", fn.hash), callParamFun, callResultFun, tree, imports);
        }
        let type = fn.callBackPT;
        type && setImport(type, mod, tree, imports);
    }
    else {
        str += tplFunc.funcTpl(null, fn, mod, callParamFun, callResultFun, tree, imports);
    }
    if (tab) {
        str = str.replace(/^/mg, tab);
    }
    return str;
};
//type,name ,valueName, _arrHasNObj
const callParamFun = (type, name, valueName, _mod, indexN, tree, imports, tab) => {
    let str = tplFunc.callParamTpl(null, type, name, valueName, _mod, indexN, tree, imports, tab, callParamFun);
    if (tab) {
        str = str.replace(/^/mg, tab);
    }
    setImport(type, _mod, tree, imports);
    return str;
};
const setImport = (type, mod, tree, imports) => {
    if (type.name === "Tuple") {
        for (var i = 0; i < type.childs.length; i++) {
            setImport(type.childs[i], mod, tree, imports);
        }
    }
    else if (type.name === "Array") {
        setImport(type.type, mod, tree, imports);
    }
    else if (mod.typeCache && Gendrust.isNativeObject(type.name)) {
        var t = getRealType(type, mod, tree, "");
        if (Gendrust.isNativeObject(t.name)) {
            var ca = mod.typeCache.get(t.name);
            if (!ca || ca.namespace === "pi_vm::adapter::JSType" || ca.namespace === "atom::Atom") {
                return;
            }
            ca && imports.set(ca.namespace, ca.nickname);
        }
        else {
            setImport(t, mod, tree, imports);
        }
    }
};
const callResultFun = (type, name, valueName, _mod, indexN, tree, imports, structName, tab) => {
    let str = tplFunc.callResultTpl(null, type, name, valueName, _mod, indexN, tree, imports, structName, tab, callResultFun);
    if (tab) {
        str = str.replace(/^/mg, tab);
    }
    if (type.name !== structName && type.name && "Self") {
        setImport(type, _mod, tree, imports);
    }
    return str;
};
const enumcFun = (obj) => {
    let str = tplFunc.enumcTpl(null, obj);
    return str;
};
const getRealType = (type, mod, tree, structName) => {
    if (type.name === "Option" || type.name === "Result") {
        return getRealType(type.genType[0], mod, tree, structName);
    }
    return Gendrust.deref(type, mod, structName);
};
function tsTypeStr(type, mod, tree, structName) {
    if (type.name.indexOf("JSType") > -1) {
        return "any";
    }
    else if (Gendrust.isNumber(type.name)) {
        return "number";
    }
    else if (Gendrust.isBigInt(type.name)) {
        return "bigInt.BigInteger";
    }
    else if (Gendrust.isStr(type.name)) {
        return "string";
    }
    else if (Gendrust.isArray(type.name)) {
        if (type.type.name === "u8") {
            return "Uint8Array";
        }
        else {
            return "Array<" + tsTypeStr(type.type, mod, tree, structName) + ">";
        }
    } /*else if(type.name === "Vec"){
        if(type.genType[0].name === "u8"){
            return "Uint8Array";
        }else{
            return "Array<" + tsTypeStr(type.genType[0], mod, tree, structName) + ">";
        }
    }*/
    else if (Gendrust.isBool(type.name)) {
        return "boolean";
    }
    else if (type.name === "Option") {
        return tsTypeStr(type.genType[0], mod, tree, structName);
    }
    else if (Gendrust.isTuple(type.name)) {
        if (type.childs.length === 0) {
            return "void";
        }
        let elems = [];
        for (let i = 0; i < type.childs.length; i++) {
            elems.push(tsTypeStr(type.childs[i], mod, tree, structName));
        }
        return "[" + elems.join(",") + "]";
    }
    else if (type.name === "self" || type.name === "Self") {
        return structName;
    }
    else if (type.name === "Result") {
        return tsTypeStr(type.genType[0], mod, tree, structName);
    }
    else if (mod && Gendrust.isRef(mod.getFullMod(type.name))) {
        return tsTypeStr(Gendrust.deref(type, mod, structName), mod, tree, structName);
    }
    else if (type.name === "*") { //指针类型
    }
    else if (Gendrust.isNativeObject(type.name)) {
        //let t = Gendrust.newTypeToType(type, mod, tree);
        if (Gendrust.isAtom(type.name) || (mod && Gendrust.isAtom(mod.getFullMod(type.name)))) {
            return "string";
        }
        let i = type.name.lastIndexOf("::");
        if (i > -1) {
            return type.name.slice(i + 2, type.name.length); //取到名字;
        }
        else {
            return type.name;
        }
    }
    else {
        throw "无法处理泛型类型：" + type.name;
    }
}
exports.tsTypeStr = tsTypeStr;
const toTsFunName = (value) => {
    return value.replace(/([a-z])_([a-z])/gi, function (r, r1, r2) {
        return r1 + r2.toUpperCase();
    });
};
//c枚举
const enumcTpl = `{{let _obj = it}}
export enum {{_obj.name}}{
    {{for j, member of _obj.members}}{{j > 0?",":""}}

    {{member.name}}{{!member.value?"":("=" + member.value)}}
    {{end}}
}`;
//结构体、枚举实现自动解应用特征
const structTpl = `
{{let name = it}}{{let hash = it1}}{{let funcs = it2}}{{let _funcFun = it3}}{{let _mod = it4}}{{let _imports = it5}}{{let _tree = it6}}{{let _root = it7}}
export class {{name}} extends NObject{
    static _$info = new SInfo("{{_root}}", {{hash}} , new Map(), []);
	{{for j, funcs1 of funcs}}{{for i, func of funcs1}}
	{{_funcFun(func, _mod, _imports, _tree, "    ")}}
	{{end}}{{end}}
}`;
/**
 * TsFun{
 *	name: string;
 *	nextHash: boolean;
 *	hash:number
 *	fn:Gendrust.DefFunc;
 *	genTypeCfg?:Json;
 *	structStr: string;
 *	structName:string;
    }
 * pName:string
 */
//注释生成模板
const noteTpl = `{{let fn = it}}
/**
{{let params = fn.fn.func.params || []}}
{{if fn.sync || fn.async}}
{{:params = params.slice(0, params.length - 1)}}
{{end}}
{{for i, param of params}}
 * @param {{param.name}} {{if param.type}}:{{_typeToString(param.type, true)}}{{end}}
{{end}}
{{if fn.async}}
 * @param ({{fn.callBackPT?_typeToString(n.callBackPT, true):""}}) => void
{{end}}
{{if fn.sync && fn.callBackPT}}
 * @return {{_typeToString(fn.callBackPT, true)}}
{{elseif fn.result}}
 * @return {{_typeToString(fn.result, true)}}
{{end}}
 */
`;
const funcTpl = `
{{let fn = it}}{{let _mod = it1}}{{let _callParamFun = it2}}{{let _callResultFun = it3}}{{let _tree = it4}}{{let _imports = it5}}
{{let isStatic = false}}
{{let isFirst = true}}
{{let params = fn.params || []}}
{{let result1 = fn.result}}
{{let result = result1?_deref(fn.result, _mod, fn.structName):null}}

{{if fn.structName && (!params[0] || params[0].name !== "self")}}
{{let isStatic = true}}
{{end}}
{{fn.structName?"":"export const "}} {{isStatic?"static ":""}}{{_toTsFunName(fn.name)}} = (
{{for i, param of params}}
{{if param.name !== "self"}}{{isFirst===false?",":""}}
{{param.name}}:{{_tsTypeStr(param.type, _mod, _tree)}}
{{:isFirst = false}}
{{end}}
{{end}}){{if result}}: {{_tsTypeStr(result, _mod, _tree, fn.structName)}} {{end}} => {     {{%方法返回值%}}
	{{%如果参数中含有结构体，需要解包%}}
	{{for i, param of params}}{{if param.name !== "self"}}{{_callParamFun(param.type, param.name, param.name, _mod, "i", _tree, _imports, "    ")}} {{end}}
	{{end}}
    {{if result}}{{if _isBase(result)}}
    return call({{fn.hash}},[ {{for i, param of params}}{{i>0?",":""}}{{if param.name === "self"}}this.self{{else}}{{param.name}}{{end}}{{end}} ]); {{else}}
    let result = call({{fn.hash}},[ {{for i, param of params}}{{i>0?",":""}}{{if param.name === "self"}}this.self{{else}}{{param.name}}{{end}}{{end}} ]);
{{_callResultFun(result, "result", "result", _mod, "i", _tree, _imports, fn.structName, "    ")}}
    return result; {{end}}
    {{else}}
    call({{fn.hash}},[ {{for i, param of params}}{{i>0?",":""}}{{if param.name === "self"}}this.self{{else}}{{param.name}}{{end}}{{end}} ]);
    {{end}}
}
`;
const funcAsyncTpl = `
{{let fn = it}}{{let _mod = it1}}{{let _h = it2}}{{let _callParamFun = it3}}{{let _callResultFun = it4}}{{let _tree = it5}}{{let _imports = it6}}
{{let isStatic = false}}
{{let isFirst = true}}
{{let params = fn.fn.func.params.slice(0, fn.fn.func.params.length - 1)}}
{{let cbName = fn.fn.func.params[fn.fn.func.params.length - 1].name}}
{{let result1 = fn.fn.func.result}}
{{let result = result1?_deref(result1, _mod, fn.structName): null}}

{{let pttype = fn.callBackPT?_tsTypeStr(_deref(fn.callBackPT,  _mod, fn.structName), _mod, _tree, fn.structName): null}}
{{if fn.structName && (!params[0] || params[0].name !== "self")}}
{{let isStatic = true}}
{{end}}

{{fn.structName?"":"export const "}} {{isStatic?"static ":""}}{{_toTsFunName(fn.name)+ "Async"}} = (
{{for i, param of params}}{{if param.name !== "self"}}{{isFirst===false?",":""}}
{{param.name}}:{{_tsTypeStr(param.type, _mod, _tree)}} {{:isFirst = false}}{{end}}
{{end}}, {{cbName}}:({{pttype?pttype:""}}) => void) => {

    {{if fn.callBackPT && !_isBase(fn.callBackPT)}}
    let {{cbName}}_ = (r) => {
        {{_callResultFun(fn.callBackPT, "r", "r", _mod, "i", _tree, _imports, fn.structName, "    ")}}
        {{cbName}}(r);
    };
    {{else}}
    let {{cbName}}_ = {{cbName}};
    {{end}}

	{{%如果参数中含有结构体，需要解包%}}
	{{for i, param of params}}
	{{if param.name !== "self"}}
	{{_callParamFun(param.type, param.name, param.name, _mod, "i", _tree, _imports, "    ")}} 
	{{end}}
	{{end}}
    asyncCall({{_h}},[ {{:isFirst = true}}{{for i, param of params}}{{i>0?",":""}}{{:isFirst = false}}
		{{if param.name === "self"}}this.self{{else}}{{param.name}}
        {{end}}{{end}}], {{cbName}}_);
}`;
const funcSyncTpl = `
{{let fn = it}}{{let _mod = it1}}{{let _h = it2}}{{let _callParamFun = it3}}{{let _callResultFun = it4}}{{let _tree = it5}}{{let _imports = it6}}
{{let isStatic = false}}
{{let isFirst = true}}
{{let params = fn.fn.func.params.slice(0, fn.fn.func.params.length - 1)}}
{{let result1 = fn.fn.func.result}}
{{let result = result1?_deref(result1, _mod, fn.structName): null}}

{{let pttype = fn.callBackPT?_tsTypeStr(_deref(fn.callBackPT,  _mod, fn.structName), _mod, _tree, fn.structName): null}}
{{if fn.structName && (!params[0] || params[0].name !== "self")}}
{{let isStatic = true}}
{{end}}

{{fn.structName?"":"export const "}} {{isStatic?"static ":""}}{{_toTsFunName(fn.name)}} = (
{{for i, param of params}}{{if param.name !== "self"}}{{isFirst===false?",":""}}
{{param.name}}:{{_tsTypeStr(param.type, _mod, _tree)}} {{:isFirst = false}}{{end}}
{{end}}){{pttype?":" + pttype:""}} => {     {{%方法返回值%}}

	{{%如果参数中含有结构体，需要解包%}}
	{{for i, param of params}}
	{{if param.name !== "self"}}
	{{_callParamFun(param.type, param.name, param.name, _mod, "i", _tree, _imports, "    ")}} 
	{{end}}
	{{end}}
    {{if fn.callBackPT}}
    let r = syncCall({{_h}},[ {{:isFirst = true}}{{for i, param of params}}{{i>0?",":""}}{{:isFirst = false}}
		{{if param.name === "self"}}this.self{{else}}{{param.name}}
        {{end}}{{end}} ]);
    {{_callResultFun(fn.callBackPT, "r", "r", _mod, "i", _tree, _imports, fn.structName, "            ")}}
    return r;
    {{else}}
    syncCall({{_h}},[ {{:isFirst = true}}{{for i, param of params}}{{i>0?",":""}}{{:isFirst = false}}
		{{if param.name === "self"}}this.self{{else}}{{param.name}}
        {{end}}{{end}} ]);
    {{end}}
}`;
//解析调用call方法时的参数, 结构体需要解包, 参数不能是Result
const callParamTpl = `
{{let t = it}}{{let name = it1}}{{let valueName = it2}}{{let _mod = it3}}{{let indexN = it4}}{{let _tree = it5}}{{let _imports = it6}}{{let tabS = it7}}{{let _callParamFun = it8}}
{{let type = _deref(t, _mod)}}  {{%type不能是self%}}
{{if type.name === "Option"}}
if({{valueName}} !== null && {{valueName}} !== undefined){
{{_callParamFun(type.genType[0], valueName, valueName, _mod, indexN, _tree, _imports, tabS + "    ")}}
}

{{elseif type.name.indexOf("JSType") < 0 && (_isNativeObject(type.name) && !_isEnumC(type.name, _mod, _tree))}}
{{let fullName = _mod.getFullMod(type.name)}}
{{if _isAtom(fullName)}}
(<any>{{name}}) = {{valueName}};
{{else}}
(<any>{{name}}) = {{valueName}}.self;
{{end}}

{{elseif type.name === "u64"}}
(<any>{{name}}) = u64ToBuffer({{valueName}});

{{elseif type.name === "u128"}}
(<any>{{name}}) = u128ToBuffer({{valueName}});

{{elseif _isArray(type.name) && _arrHasNObj(type)}} {{%当为数组时，如果其内部包含NativeObject, 应该循环数组，取出ativeObject%}}
let {{name}}_arr = [];
for(let {{indexN}} = 0; {{indexN}} < {{valueName}}.length; {{indexN}}++){
    let {{indexN}}_e = {{valueName}}[{{indexN}}]; let {{indexN}}_e1;
{{_callParamFun(type.type, indexN + "_e1", indexN + "_e", _mod, indexN, _tree, _imports, tabS + "    ")}}
    {{valueName}}[{{indexN}}] = {{indexN}}_e1;
}
(<any>{{name}}) = {{name}}_arr;

{{elseif _isTuple(type.name) && _arrHasNObj(type)}}
let {{name}}_arr = [];
{{for i, elem of type.childs}}
{{_callParamFun(elem, name + "[" + i + "]", name + "[" + i + "]", _mod, indexN, _tree, _imports, tabS + "    ")}}
{{end}}
(<any>{{name}}) = {{name}}_arr;
{{end}}
`;
//解析调用call方法返回值, 结构体需要装包
const callResultTpl = `
{{let t = it}}{{let name = it1}}{{let valueName = it2}}{{let _mod = it3}}{{let indexN = it4}}{{let _tree = it5}}{{let _imports = it6}}{{let _structName = it7}}{{let tabS = it8}}
{{let type = _deref(t, _mod, _structName)}}  {{%type不能是Self%}}
{{if type.name === "pi_vm::adapter::JSType"}} {{%type是JsType,不需要做任何处理%}}

{{elseif type.name === "Result"}}
{{_callResultFun(type.genType[0], valueName, valueName, _mod, indexN, _tree, _imports, _structName, tabS)}}

{{elseif type.name === "Option"}}
if({{name}} !== undefined && {{name}} !== null){
{{_callResultFun(type.genType[0], valueName, valueName, _mod, indexN, _tree, _imports, _structName, tabS + "    ")}}
}

{{elseif _isNativeObject(type.name) && !_isEnumC(type.name, _mod, _tree)}}
{{let fullName = _mod.getFullMod(type.name)}}
{{if _isAtom(fullName)}}
<any>{{name}}) = {{valueName}};
{{else}}
(<any>{{name}}) = new {{_tsTypeStr(type, _mod, _tree)}}({{valueName}});
{{end}}

{{elseif _isBigInt(type.name)}}
(<any>{{name}}) = bigInt({{valueName}});

{{elseif _isArray(type.name) && _arrHasNObj(type)}} {{%当为数组时，如果其内部包含NativeObject, 应该循环数组，包装NativeObject%}}
for(let {{indexN}} = 0; {{indexN}} < {{valueName}}.length; {{indexN}}++){
{{_callResultFun(type.type, valueName + "[" + indexN + "]", valueName + "[" + indexN + "]", _mod, indexN, _tree, _imports, _structName, tabS + "    ")}}
}

{{elseif _isTuple(type.name)}}
{{if _tupleHasNObj(type)}}
{{for i, child of type.childs}}
{{_callResultFun(child, name + "[" + i + "]", valueName + "[" + i + "]", _mod, indexN, _tree, _imports, _structName, tabS)}}
{{end}}
{{end}}
{{end}}
`;
exports.toFunc = (s) => {
    try {
        return (new Function("_stringify", "_isNumber", "_isStr", "_isBool", "_isArray", "_isTuple", "_isNativeObject", "_isBase", "_tsTypeStr", "_arrHasNObj", "_deref", "_tupleHasNObj", "_isBigInt", "_toTsFunName", "_isEnumC", "_callResultFun", "_typeToString", "_isAtom", "return " + s))(tpl_1.toString, Gendrust.isNumber, Gendrust.isStr, Gendrust.isBool, Gendrust.isArray, Gendrust.isTuple, Gendrust.isNativeObject, Gendrust.isBase, tsTypeStr, Gendrust.arrHasNObj, Gendrust.deref, Gendrust.tupleHasNObj, Gendrust.isBigInt, toTsFunName, Gendrust.isEnumC, callResultFun, Gendrust.typeToString, Gendrust.isAtom);
    }
    catch (e) {
        //warn(level, "tpl toFun, path: "+", s: ", s, e);
        throw (e);
    }
};
let tplFunc = {
    funcTpl: exports.toFunc(tpl_1.compile(funcTpl, tpl_str_1.Parser)),
    funcSyncTpl: exports.toFunc(tpl_1.compile(funcSyncTpl, tpl_str_1.Parser)),
    funcAsyncTpl: exports.toFunc(tpl_1.compile(funcAsyncTpl, tpl_str_1.Parser)),
    structTpl: exports.toFunc(tpl_1.compile(structTpl, tpl_str_1.Parser, null, null, null, null, null, "es6")),
    callParamTpl: exports.toFunc(tpl_1.compile(callParamTpl, tpl_str_1.Parser)),
    callResultTpl: exports.toFunc(tpl_1.compile(callResultTpl, tpl_str_1.Parser)),
    enumcTpl: exports.toFunc(tpl_1.compile(enumcTpl, tpl_str_1.Parser)),
    noteTpl: exports.toFunc(tpl_1.compile(noteTpl, tpl_str_1.Parser)),
};
});
