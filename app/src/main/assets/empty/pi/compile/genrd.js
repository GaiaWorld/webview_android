_$define("pi/compile/genrd", function (require, exports, module){
"use strict";
/**
 * 分析rust定义的数据结构, 支持注释，注解， 将其转换为ts的数据结构定义， 并生成encode， decode， clone， copy等方法
 * 例：
 * #[path=../../ecs/]   --注解
 * use world::{Component};   --导入
 * #[type=rpc,readonly=true,noCopy=true]---注解
 * struct setName {
 * 	id: i16,
 * 	name:str,
 * }
 *
 * 结构体支持注解有：
 * 		type-类型，用户自定义类型，为运行时注解,
 * 		readonly（默认false）-只读，表示结构体的所有属性都是只读属性，编译为ts的类时，提供了构造方法设置属性，为编译期注解
 * 		noCopy（默认true）-不能copy，不会生成copy和clone方法，为编译期注解
 * 		noBinSeri（默认false）-不能序列化，没有binEncode，bindecode方法，为编译期注解
 * 		hasmgr（默认true）-有管理者，该注解为true时， 表示该结构体的实例应该被元数据管理起来， 当调用结构体的set方法时，会通知元数据中的修改监听器，为编译期注解
 * 		extends-继承， 表示继承另一个结构体， 为编译期注解
 * 属性支持注解：
 * 		default-默认值
 * 		readonly（默认false）-只读，当类的readonly注解为false时生效
 * 		noBinSeri（默认false）-不能序列化，当类的noBinSeri注解为false时生效
 * 导入支持注解：
 * 		path：表示导入模块的路径
 */
Object.defineProperty(exports, "__esModule", { value: true });
// ====================================== 导入
const hash = require("../util/hash");
const tpl_str_1 = require("../util/tpl_str");
const tpl_1 = require("../util/tpl");
const Gendrust = require("./gendrust");
//import {tsTypeStr} from "./genrust2ts";
const drust_1 = require("./drust");
const util_1 = require("../util/util");
const util_2 = require("./util");
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
        return type.name.replace(/::/, ".");
    }
    else {
        throw "无法处理泛型类型：" + type.name;
    }
}
var pathMode = require("path");
//rs编译为ts
exports.translate = (code, path, cfg, scrRoot) => {
    cfg = initCfg(path, cfg);
    let compiler = new drust_1.Compiler();
    compiler.reset(code);
    let r = compiler.parser.parseRule("file");
    let arr = Gendrust.gen(r);
    return tsFunc(arr, util_2.relativePath(scrRoot, path), cfg, getEnumList(arr), getEnumcList(arr));
};
//取到所有的枚举类型
const getEnumList = (arr) => {
    let first = arr[0];
    if (!first) {
        return null;
    }
    let arr_e = [];
    let annotate = first.annotate;
    if (annotate && annotate.enum) {
        arr_e = annotate.enum.split(",");
        delete annotate.enum;
    }
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] instanceof Gendrust.DefEnum) {
            arr_e.push(arr[i].name);
        }
    }
    return arr_e;
};
//取到所有的枚举类型
const getEnumcList = (arr) => {
    let first = arr[0];
    if (!first) {
        return null;
    }
    let arr_e = [];
    let annotate = first.annotate;
    if (annotate && annotate.enumc) {
        arr_e = annotate.enumc.split(",");
        delete annotate.enumc;
    }
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] instanceof Gendrust.DefEnumC) {
            arr_e.push(arr[i].name);
        }
    }
    return arr_e;
};
const initCfg = (path, cfg) => {
    let c = {};
    c.bin = parsePath(path, cfg.bin);
    c.mgr = parsePath(path, cfg.mgr);
    c.sinfo = parsePath(path, cfg.sinfo);
    return c;
};
const getImportNames = (arr) => {
    let r = [];
    for (let i = 0; i < arr.length; i++) {
        let e = arr[i];
        if (e instanceof Gendrust.Import && e.contents) {
            r.concat(e.contents);
        }
    }
    return r;
};
const toMap = (arr) => {
    let r = new Map();
    for (let i = 0; i < arr.length; i++) {
        let e = arr[i];
        if (!(e instanceof Gendrust.Import)) {
            r.set(e.name, e);
        }
    }
    return r;
};
const resolve = (path) => {
    let rp = pathMode.resolve(path); //绝对路径
    let ps = path.split("\\");
    let rps = rp.split("\\");
    let len = ps.length;
    for (let i = 0; i < len; i++) {
        if (ps[i] === "..") {
            ps[i] = rps[rps.length - (len - i)];
        }
        else if (ps[i] === ".") { //i = 0时才可能是"."
            ps = ps.slice(1, len);
            break;
        }
        else {
            break;
        }
    }
    return ps.join("/");
};
//计算路径
const parsePath = (selfPath, dstPath) => {
    let p = pathMode.relative(selfPath, dstPath).replace(/\\/g, "/");
    let pp = p.split("/");
    if (pp[0] && pp[0] === "..") {
        if (pp[1] !== "..") {
            pp[0] = ".";
        }
        else {
            pp = pp.slice(1, pp.length);
        }
    }
    return pp.join("/");
};
//将一个json转换成二元数组
const jsonToArray = (data) => {
    let arr = [];
    for (let k in data) {
        arr.push([k, data[k]]);
    }
    return arr;
};
const isNativeObject = (t) => {
    if (t.name === "Option") {
        return isNativeObject(t.genType[0]);
    }
    if (t.name === "HashMap") {
        return false;
    }
    else {
        return Gendrust.isNativeObject(t.name);
    }
};
let tsTpl = `{{let _path = it1}}{{let _cfg = it2}}{{let _enums = it3}}{{let _enumcs = it4}}
	import { BonBuffer } from "{{_cfg.bin}}";
	import { addToMeta, removeFromMeta, Struct, notifyModify, StructMgr, structMgr} from "{{_cfg.mgr}}";
	import { StructInfo, Type, FieldInfo, EnumType, EnumInfo} from "{{_cfg.sinfo}}";
	{{for k, v of it}}
	{{if v.type === "import" || "importOne"}}
	{{if v.sufComment}}{{for i, v1 of v.sufComment}}{{v1}}{{end}}{{end}}
	{{if v.type === "import"}}
	{{if v.annotate && v.annotate.path}}
	import { {{for index, c of v.contents}}{{if index > 0}},{{end}}{{c}}{{end}} } from "{{v.annotate.path + v.path}}";
	{{else}}
	import { {{for index, c of v.contents}}{{if index > 0}},{{end}}{{c}}{{end}} } from "./{{v.path}}";
	{{end}}
	{{elseif v.type === "importOne"}}
	{{if v.annotate && v.annotate.path}}
	import * as {{v.contents[0].endsWith(".s")?v.contents[0].slice(0, v.contents[0].length - 2): v.contents[0]}} from "{{v.annotate.path + (v.path?v.path + "/":"") + v.contents[0]}}";
	{{else}}
	import * as {{v.contents[0].endsWith(".s")?v.contents[0].slice(0, v.contents[0].length - 2): v.contents[0]}} from "./{{v.path+ (v.path?v.path + "/":"") + v.contents[0]}}";
	{{end}}
	{{end}}
	{{if v.preComment}}{{for i, v1 of v.preComment}}{{v1}}{{end}}{{end}}
	{{end}}
	{{end}}

	{{for k, v of it}}
	{{if v.type === "Struct" || v.type === "Empty"}}
	{{if v.sufComment}}{{for i, v1 of v.sufComment}}{{v1}}{{end}}{{end}}
	{{let members = v.members}}
	{{let clazz = v.name }}
	export class {{clazz}} {{if v.genType}}<{{for i, v1 of v.genType}}{{if i > 0}},{{end}}{{_tsTypeStr(v1)}}{{end}}>{{end}} extends {{if v.annotate && v.annotate.extends}}{{v.annotate.extends}}{{else}}Struct{{end}} {

		{{for i, v1 of members}}
		{{if v1.sufComment}}
		{{for j, vv of v.sufComment}}
		
		{{ vv }}
		{{end}}
		{{end}}
		{{if (v.annotate && v.annotate.readonly === "true") || (v1.annotate && v1.annotate.readonly === "true")}}
		readonly {{v1.name}}: {{_tsTypeStr(v1.type)}}
		{{else}}

		{{"    " + v1.name}}: {{_tsTypeStr(v1.type)}}
		{{end}}
		{{if v1.annotate && v1.annotate.default != undefined}} = {{v1.annotate.default}}{{end}};
        {{if v1.preComment}}{{for j, vv of v.preComment}}{{ vv }}{{end}}{{end}}
        {{if v1.annotate.enum}}
        {{: v1.type = {name:"u8"} }}
        {{end}}
        {{end}}
		static _$info =  {{_sinfoFunc(_path+ "." + clazz, v.members, v.annotate, _enums, _enumcs)}};

		{{% 构造方法}}
		{{if v.annotate && (v.annotate.readonly === "true" || v.annotate.constructor==="true")}}
		constructor({{for j, v1 of members}}{{if j > 0}},{{end}}{{v1.name}}?: {{_tsTypeStr(v1.type)}}{{end}}, old?: {{clazz}}){
			super();
			if(!old){
				{{for j, v1 of members}}
				this.{{v1.name}} = {{v1.name}};
				{{end}}
			}else{
				{{for j, v1 of members}}
				this.{{v1.name}} = {{v1.name}} === undefined? old.{{v1.name}}:{{v1.name}};
				{{end}}
			}
		}
		{{end}}

		{{% 添加}}
		{{if false && !v.annotate || v.annotate.hasmgr !== "false"}}
		addMeta(mgr: StructMgr){
			if(this._$meta)
				return;
			{{for j, v1 of members}}
			{{if _isNativeObject(v1.type)}}
			this.{{v1.name}} && this.{{v1.name}}.addMeta(mgr);
			{{elseif v1.type === "Array" && _isNativeObject(v1.type.genType[0])}}
			if(this.{{v1.name}}){
				for(let i = 0; i < this.{{v1.name}}.length; i++){
					if(this.{{v1.name}}[i]){
						this.{{v1.name}}[i].addMeta(mgr);
					}
				}
			}
			{{elseif v1.type === "Tuple"}}
			{{for j2,v2 of v1.childs}}
			{{if _isNativeObject(v2)}}
			if(this.{{v1.name}}[j2])
				this.{{v1.name}}[j2].addMeta(mgr);
			{{end}}
			{{end}}
			{{elseif v1.type === "Map" && _isNativeObject(v1.type.genType[1])}}
			if(this.{{v1.name}}){
				this.{{v1.name}}.forEach((v,k) => {
					v && c.addMeta(mgr);
				});
			}
			{{end}}
			{{end}}
			addToMeta(mgr, this);
		}

		{{% 移除}}
		removeMeta(){
			removeFromMeta(this);
			{{for j, v1 of members}}
			{{if _isNativeObject(v1.type)}}
			this.{{v1.name}} && this.{{v1.name}}.removeMeta();
			{{elseif v1.type === "Array" && _isNativeObject(v1.type.genType[0])}}
			if(this.{{v1.name}}){
				for(let i = 0; i < this.{{v1.name}}.length; i++){
					if(this.{{v1.name}}[i]){
						this.{{v1.name}}[i].removeMeta();
					}
				}
			}
			{{elseif v1.type === "Tuple"}}
			{{for j2,v2 of v1.childs}}
			{{if _isNativeObject(v2)}}
			if(this.{{v1.name}}[j2])
				this.{{v1.name}}[j2].removeMeta();
			{{end}}
			{{end}}
			{{elseif v1.type === "Map" && _isNativeObject(v1.type.genType[1])}}
			if(this.{{v1.name}}){
				this.{{v1.name}}.forEach((v,k) => {
					v && c.removeMeta();
				});
			}
			{{end}}
			{{end}}			
		}
		{{end}}

		{{% set 设置}}
		{{if false && (!v.annotate || !v.annotate.readonly || v.annotate.readonly === "false")}}
		{{for j, v1 of members}}
		{{let _type = _tsTypeStr(v1.type)}}
		{{if v1.type.name === "Array"}}
		set{{_upperFirst(v1.name)}} (value: {{_tsTypeStr(v1.type)}}, index: number | string){
			!this.{{v1.name}} && (this.{{v1.name}} = [] as {{_tsTypeStr(v1.type)}});
			{{if _isNativeObject(v1.type)}}
			let old = this.{{v1.name}}[index];
			this.{{v1.name}}[index] = value;
			if(this._$meta){
				if(old)
					old.removeMeta();
				value.addMeta(this._$meta.mgr);
				{{if v.annotate && v.annotate.hasmgr === "true"}}			
				notifyModify(this, "{{v1.name}}", value, old, index);
				{{end}}
			}
			{{else}}
			let old = this.{{v1.name}}[index];
			this.{{v1.name}}[index] = value;
			{{if v.annotate && v.annotate.hasmgr === "true"}}
			if(this._$meta)
				notifyModify(this, "{{v1.name}}", value, old, index);
			{{end}}
			{{end}}
		}
		{{elseif v1.type.name === "Tuple"}}
		{{for j2, v2 of v1.type.childs}}
		set{{_upperFirst(v1.name)}}_{{j2}} (value: {{_tsTypeStr(v2)}}){
			!this.{{v1.name}} && (this.{{v1.name}} = [] as {{_tsTypeStr(v1.type)}});
			{{if _isNativeObject(v2)}}
			let old = this.{{v1.name}}[{{j2}}];
			this.{{v1.name}}[{{j2}}] = value;
			if(this._$meta){
				if(old)
					old.removeMeta();
				value.addMeta(this._$meta.mgr);	
				{{if v.annotate && v.annotate.hasmgr === "true"}}		
				notifyModify(this, "{{v1.name}}", value, old, {{j2}});
				{{end}}
			}
			{{else}}
			let old = this.{{v1.name}}[{{j2}}];
			this.{{v1.name}}[{{j2}}] = value;
			{{if v.annotate && v.annotate.hasmgr === "true"}}
			if(this._$meta)
				notifyModify(this, "{{v1.name}}", value, old, {{j2}});
			{{end}}
			{{end}}
		}
		{{end}}
		{{elseif v1.type.name === "Map"}}
		set{{_upperFirst(v1.name)}} (value: {{_tsTypeStr(v1.type.genType[1])}}, key: number | string){
			!this.{{v1.name}} && (this.{{v1.name}} = [] as Map<{{_tsTypeStr(v1.type.genType[0])}}, {{_tsTypeStr(v1.type.genType[1])}}>);
			{{if _isNativeObject(v1.type.genType[0])}}
			let old = this.{{v1.name}}.get(key);
			this.{{v1.name}}.set(key,value);
			if(this._$meta){
				if(old)
					old.removeMeta();
				value.addMeta(this._$meta.mgr);
				{{if v.annotate && v.annotate.hasmgr === "true"}}
				notifyModify(this, "{{v1.name}}", value, old, key);
				{{end}}
			}
			{{else}}
			let old = this.{{v1.name}}.get(key);
			this.{{v1.name}}.set(key,value);
			{{if v.annotate && v.annotate.hasmgr === "true"}}
			if(this._$meta)
				notifyModify(this, "{{v1.name}}", value, old, key);
			{{end}}
			{{end}}
		}
		{{else}}
		set{{_upperFirst(v1.name)}} (value: {{_type}}){	
			{{if _isNativeObject(v1.type)}}
			let old = this.{{v1.name}};
			this.{{v1.name}} = value;
			if(this._$meta){
				if(old)
					old.removeMeta();
				value.addMeta(this._$meta.mgr);
				{{if v.annotate && v.annotate.hasmgr === "true"}}
				notifyModify(this, "{{v1.name}}", value, old);
				{{end}}
			}
			{{else}}
			let old = this.{{v1.name}};
			this.{{v1.name}} = value;
			{{if v.annotate && v.annotate.hasmgr === "true"}}
			if(this._$meta)
				notifyModify(this, "{{v1.name}}", value, old);
			{{end}}
			{{end}}			
		}
		{{end}}
		{{end}}
		{{end}}

		{{%如果字段noCopy注解为false，应该设置copy和clone方法}}
		{{if v.annotate && v.annotate.noCopy && v.annotate.noCopy === "false"}}
		copy(o: {{clazz}}) : {{clazz}} {
			{{for i, v1 of members}}
			{{if (v.annotate && v.annotate.readonly === "true") || (v1.annotate && v1.annotate.readonly === "true")}}
			{{elseif _isNativeObject(v1.type)}}
			o.{{v1.name}} && ((<any>this).{{v1.name}} = o.{{v1.name}}.clone());
			{{elseif v1.type.name === "Array"}}
			if(o.{{v1.name}}){
				(<any>this).{{v1.name}} = [] as {{_tsTypeStr(v1.type)}};
				for(let i = 0; i < o.{{v1.name}}.length; i++){
					{{if _isNativeObject(v1.type.type)}}
					o.{{v1.name}}[i] && ((<any>this).{{v1.name}}[i] = o.{{v1.name}}[i].clone());
					{{else}}
					(<any>this).{{v1.name}} = o.{{v1.name}};
					{{end}}
				}
			}
			{{elseif v1.type.name === "Tuple"}}
			if(o.{{v1.name}}){
				this.{{v1.name}} = [] as {{_tsTypeStr(v1.type)}}
				{{for j2, v2 of v1.type.childs}}
				{{if _isNativeObject(v2)}}
				o.{{v1.name}}[{{j2}}] && ((<any>this).{{v1.name}}[{{j2}}] = o.{{v1.name}}[{{j2}}].clone());
				{{else}}
				(<any>this).{{v1.name}}[{{j2}}] = o.{{v1.name}}[{{j2}}];
				{{end}}
				{{end}}
			}
			{{elseif v1.type.name === "Map"}}
			if(o.{{v1.name}}){
				o.{{v1.name}}.forEach((v, k) => {
					{{if _isNativeObject(v1.type.genType)}}
					v && (this.{{v1.name}} = v.clone());
					{{else}}
					this.{{v1.name}} = v;
					{{end}}
				});
			}
			{{else}}
			this.{{v1.name}} = o.{{v1.name}};
			{{end}}
			{{end}}
			return this;
		}

		clone() : {{clazz}} {
			return new {{clazz}}().copy(this);
		}
		{{end}}

		{{%如果字段noBinSeri注解为false，应该设置_binDecode和_binEncode方法}}
		{{if !v.annotate || !v.annotate.noBinSeri}}
	
		bonDecode(bb:BonBuffer) {
			{{for j, v1 of members}}
			{{if !v1.annotate || (!v1.annotate.readonly && !v1.annotate.noBinSeri) }}
			{{if v1.type.name === "Option"}}
			if(!bb.isNil()){
				(<any>this).{{v1.name}} = {{_readFunc(v1.type.genType[0], v1.name, _enumcs)}};
			}
			{{else}}
			(<any>this).{{v1.name}} = {{_readFunc(v1.type, v1.name, _enumcs)}};
			{{end}}
			{{end}}
			{{end}}
		}


		bonEncode(bb:BonBuffer) {
			{{for j, v1 of members}}
			{{if !v1.annotate || !v1.annotate.noBinSeri}}
				{{_writeFunc(v1.type, "this." + v1.name, _enumcs, "        ")}}
			{{end}}
			{{end}}
		}
		{{end}}
    }
    structMgr.register({{clazz}}._$info.name_hash, {{clazz}}, {{clazz}}._$info.name);
	{{if v.preComment}}{{for i, v1 of v.preComment}}{{v1}}{{end}}{{end}}


	{{elseif v.type === "enumc"}}
    {{if v.sufComment}}{{for i, v1 of v.sufComment}}{{v1}}{{end}}
    {{end}}
	export enum {{v.name}}{
	{{let members = v.members}}
	{{for k1, v1 of members}}
		{{if k1 > 0}},
		{{end}}
		{{v1.name}}={{v1.value}}
	{{end}} }

	{{elseif v.type === "const"}}
	export const {{v.name}} = {{_parseConst(v.value)}}

	{{elseif v.type === "enum"}}
		{{_rustEnumFunc(v, _path, _enums, _enumcs)}}

	{{end}}
	{{end}}
`;
tsTpl = tsTpl.replace(/^\t/mg, "");
//根据类型不同使用不同的反序列化接口
let readTpl = `{{let type = it}}{{let name = it1}}{{let _enumcs = it2}}
{{if type.name === "Option"}}(() => {
    if(!bb.isNil()){
        return {{_readFunc(type.genType[0], name, _enumcs, "    ")}}};
    }
)()
{{elseif _enumcs.indexOf(type.name) > -1}}bb.readInt() as {{type.name}}
{{elseif _isInteger(type.name)}}bb.readInt()
{{elseif type.name === "u64"}}u64Merge(bb.readBigInt())
{{elseif type.name === "u128"}}u128Merge(bb.readBigInt())
{{elseif type.name === "f32" || type.name === "f64"}}bb.readf()
{{elseif _isStr(type.name)}}bb.readUtf8()
{{elseif type.name === "bool"}}bb.readBool()
{{elseif type.name === "Array"}}
{{if type.type.name === "u8"}}bb.readBin()
{{else}}bb.readArray(() => {
	return {{_readFunc(type.type, name, _enumcs, "    ")}};
})
{{end}}

{{elseif type.name === "HashMap"}}bb.readMap(() => {
	return [{{_readFunc(type.genType[0], null, _enumcs)}}, {{_readFunc(type.genType[1], name, _enumcs)}}];
})
{{%值为空的情况应该在外部判断， 该分支只处理了元组不为空的情况%}}
{{elseif type.name === "Tuple"}} [{{for i, v of type.childs}}{{i > 0? ", ": ""}}{{_readFunc(type.childs[i], name, _enumcs)}}{{end}}] as {{_tsTypeStr(type)}}
{{%结构体%}}
{{else}}
{{if name}} bb.readBonCode((<any>this)._$EnumTypeMap?(<any>this)._$EnumTypeMap(this.{{name}}):{{_tsTypeStr(type)}})
{{else}} bb.readBonCode({{_tsTypeStr(type)}})
{{end}}
{{end}}
`;
//根据类型不同使用不同的序列化接口
let writeTpl = `{{let type = it}}{{let valueName = it1}}{{let _enumcs = it2}}
{{if type.name === "Option"}}
if({{valueName}} === undefined || {{valueName}} === null){
    bb.writeNil();
}else{
{{_writeFunc(type.genType[0], valueName, _enumcs, "    ")}}
}
{{elseif _enumcs.indexOf(type.name) > -1}}
bb.writeInt({{valueName}});
{{elseif _isInteger(type.name)}}
bb.writeInt({{valueName}});

{{elseif type.name == "u64"}}
bb.writeBigInt(u64Unwrap({{valueName}}));

{{elseif type.name == "u128"}}
bb.writeBigInt(u128Unwrap({{valueName}}));

{{elseif type.name === "f32"}}
bb.writeF32({{valueName}});

{{elseif type.name === "f64"}}
bb.writeF64({{valueName}});

{{elseif _isStr(type.name)}}
bb.writeUtf8({{valueName}});

{{elseif type.name === "bool"}}
bb.writeBool({{valueName}});

{{elseif type.name === "Array"}}
{{if type.type.name === "u8"}}
bb.writeBin({{valueName}});
{{else}}
bb.writeArray({{valueName}}, (el) => {
	{{_writeFunc(type.type, "el", _enumcs, "    ")}}
});
{{end}}

{{elseif type.name === "HashMap"}}
bb.writeMap({{valueName}}, (k, v) => {
	{{_writeFunc(type.genType[0], "k", _enumcs, "    ")}}
	{{_writeFunc(type.genType[1], "v", _enumcs, "    ")}}
});

{{elseif type.name === "Tuple"}} {{%值为空的情况应该在外部判断， 该分支只处理了元组不为空的情况%}}
{{for i, v of type.childs}}
{{_writeFunc(type.childs[i], valueName + "[" + i + "]", _enumcs)}}
{{end}}

{{else}} {{%结构体%}}
bb.writeBonCode({{valueName}});

{{end}}
`;
//定义元信息， 当名称为""是认为是元组
let sinfoTpl = `{{let name = it}}{{let  members= it1}}{{let _annotate = it2}}{{let _enums = it3}}{{let _enumcs = it4}}new StructInfo("{{name}}",{{%name%}}
{{%name_hash%}}
{{_strHashCode(name, 0)}}, 
{{%note%}}
{{if _annotate}} new Map( {{JSON.stringify(_jsonToArray(_annotate))}} ){{else}}null
{{end}}, [
{{%如果不存再name， 表示匿名结构体, 收到的merber应该是一个Type， 需要封装为member%}}
{{for j,v1 of members}}{{j > 0? ", ": ""}}{{if !name}}{{:v1 = {name: j + "", type: v1} }}{{end}}new FieldInfo("{{v1.name}}", {{_enumTypeFunc(v1.type, _enums, _enumcs)}}, {{if v1.annotate}} new Map( {{JSON.stringify(_jsonToArray(v1.annotate))}} ){{else}}null{{end}})
{{end}} ])
`;
let enumTypeTpl = `{{let type = it}}{{let _enums = it1}}{{let _enumcs = it2}}
new EnumType(
{{if _enums.indexOf(type.name) > -1}} Type.Enum, {{type.name}}._$info
{{elseif _enumcs.indexOf(type.name) > -1}} Type.U8
{{elseif type.name === "Option"}} Type.Option, {{_enumTypeFunc(type.genType[0], _enums, _enumcs)}}
{{elseif type.name === "u8"}} Type.U8
{{elseif type.name === "u16"}} Type.U16
{{elseif type.name === "u32"}} Type.U32
{{elseif type.name === "u64"}} Type.U64
{{elseif type.name === "u128"}} Type.U128
{{elseif type.name === "u256"}} Type.U256
{{elseif type.name === "usize"}} Type.Usize
{{elseif type.name === "i8"}} Type.I8
{{elseif type.name === "i16"}} Type.I16
{{elseif type.name === "i32"}} Type.I32
{{elseif type.name === "i64"}} Type.I64
{{elseif type.name === "i128"}} Type.I128
{{elseif type.name === "i256"}} Type.I256
{{elseif type.name === "isize"}} Type.Isize
{{elseif type.name === "bool"}} Type.Bool
{{elseif type.name === "f32"}} Type.F32
{{elseif type.name === "f64"}} Type.F64
{{elseif type.name === "String" || type.name === "str"}} Type.Str
{{elseif type.name === "bin"}} Type.Bin
{{elseif type.name === "Array"}} Type.Arr, {{_enumTypeFunc(type.type, _enums, _enumcs)}}
{{elseif type.name === "Tuple"}} Type.Struct, {{_sinfoFunc("", type.childs, null, _enums, _enumcs)}}  {{%如果是元组， 则认为是一个匿名结构体%}}
{{elseif type.name === "HashMap"}} Type.Map, [{{_enumTypeFunc(type.genType[0], _enums, _enumcs)}}, {{_enumTypeFunc(type.genType[1], _enums, _enumcs)}}]
{{else}}Type.Struct, {{_tsTypeStr(type)}}._$info
{{end}} )
`;
//rust类型的枚举转换为ts的类型
let rustEnumTpl = `{{let obj = it}}{{let _path = it1}}{{let _enums = it2}}{{let _enumcs = it3}}
{{let members = obj.members}}
{{_enumIntoTnterface(obj)}}
export enum {{obj.name}}_Enum{
    {{for i, member of members}}{{i>0?",":""}}
    {{member.name}} = {{parseInt(i) + 1}}
    {{end}}
}
export class {{obj.name}} extends Struct{
    enum_type: {{obj.name}}_Enum;
    value: {{_toEnumType(obj)}};

    static _$info = {{_enumInfoFunc(obj, _path+"."+obj.name, obj.annotate, _enums, _enumcs)}}

    constructor(type?: {{obj.name}}_Enum, value?: {{_toEnumType(obj)}}){
        super();
        this.enum_type = type;
        this.value = value;
    }

    {{if !obj.annotate || !obj.annotate.noBinSeri}}
    bonEncode(bb: BonBuffer){
        bb.writeInt(this.enum_type);
        switch (this.enum_type){
            {{for i, member of members}}
            case {{parseInt(i) + 1}}:
                {{if member.type === "StructTuple"}}
                {{if member.members.length === 1 }}
                {{_writeFunc(member.members[0], "this.value as " + _tsTypeStr(member.members[0]), _enumcs,"                ")}}
                {{else}}
                {{_writeFunc({childs: member.members, name: "Tuple"}, "(<" + _tsTypeStr({name: "Tuple", childs:member.members}) + ">this.value)", _enumcs, "                ")}}
                {{end}}
                {{elseif member.type === "Struct"}}
                {{for j, smember of member.members}}
                {{_writeFunc(smember.type, "(<_$_" + obj.name + "_" + member.name + ">this.value)." + smember.name, _enumcs, "                ")}}
                {{end}}
                {{end}}
                break;
            {{end}}
            default:
                throw new Error("bonEncode type error, A is not exist index:" + this.enum_type);
        }
    }

    bonDecode(bb: BonBuffer){
        let t = bb.readInt();
        this.enum_type = t;
        switch (t){
            {{for i, member of members}}
            case {{parseInt(i) + 1}}:
                {{if member.type === "StructTuple"}}
                {{if member.members.length === 1 }}
                this.value = {{_readFunc(member.members[0], "", _enumcs)}}
                {{else}}
                this.value = {{_readFunc({childs: member.members, name: "Tuple"}, "", _enumcs)}}
                {{end}}
                {{elseif member.type === "Struct"}}
                let _$temp: _$_{{obj.name}}_{{member.name}} = {} as any;
                {{for j, smember of member.members}}
                _$temp.{{smember.name}} = {{_readFunc(smember.type, "", _enumcs)}};
                {{end}}
                this.value = _$temp;
                {{end}}
                break;
            {{end}}
            default:
                throw new Error("bonDecode type error, A is not exist index:" + t);
        }
    }
    {{end}}

    {{if obj.annotate && obj.annotate.noCopy && obj.annotate.noCopy === "false"}}
    copy(o: {{obj.name}}): {{obj.name}}{
        this.enum_type = o.index;
        switch (o.index){
            {{for i, member of members}}
            case {{parseInt(i) + 1}}:
                {{if member.type === "StructTuple"}}
                {{if member.members.length === 1 }}
                {{_copyFunc(member.members[0], "o.value", "this.value", "                ")}}
                {{else}}
                {{_copyFunc({childs: member.members, name: "Tuple"}, "o.value", "this.value", "                ")}}
                {{end}}
                {{elseif member.type === "Struct"}}
                let _$temp: _$_{{obj.name}}_{{member.name}} = {} as any;
                let _$o: _$_{{obj.name}}_{{member.name}} = o.value as any;
                {{for j, smember of member.members}}
                {{_copyFunc(smember.type, "_$temp." + smember.name, "_$o." + smember.name, "                ")}};
                {{end}}
                this.value = _$temp;
                {{end}}
                break;
            {{end}}
            default:
                throw new Error("copy type error, A is not exist index:" + o.index);
        }
        return this;
    }
    clone(): {{obj.name}}{
        return new {{obj.name}}().copy(this);
    }
    {{end}}
}
structMgr.register({{obj.name}}._$info.name_hash, {{obj.name}}, {{obj.name}}._$info.name);
`;
//rust类型的枚举转换为ts的类型
let enumIntoTnterfaceTpl = `{{let _obj = it}}{{let _namespace = it1}}
{{let members = _obj.members}}

export interface _$_{{_namespace}}_{{_obj.name}}{
    {{for i, member of members}}

    {{"    "}}{{member.name}}: {{_tsTypeStr(member.type)}};
    {{end}}
}
`;
//定义元信息
let enumInfo = `{{let _obj = it}}{{let _path = it1}}{{let _annotate = it2}}{{let _enums = it3}}{{let _enumcs = it4}}new EnumInfo('{{_path}}', {{_strHashCode(_path, 0)}}, {{if _annotate}} new Map( {{JSON.stringify(_jsonToArray(_annotate))}} ){{else}}null{{end}}, {{let members = _obj.members}} [
{{for i, member of members}}{{i > 0?",":""}}
{{if member.type === "StructTuple"}}
{{if member.members.length === 1}}
{{_enumTypeFunc(member.members[0], _enums, _enumcs)}}
{{else}} new EnumType(Type.Struct, {{_sinfoFunc("", member.members, null, _enums, _enumcs)}})
{{end}}
{{elseif member.type === "Struct"}} new EnumType(Type.Struct, {{_sinfoFunc("_$Json", member.members, null, _enums, _enumcs)}})
{{else}} null
{{end}}
{{end}}]);
`;
//copy数据
let copyTpl = `{{let type = it}}{{let src = it1}}{{let dst = it2}}
{{if _isNativeObject(type)}}

{{src}} && ({{dst}} = {{src}}.clone())
{{elseif type.name === "Array"}}
if({{src}}){
    {{dst}} = [] as {{_tsTypeStr(type)}};
    for(let i = 0; i < {{src}}.length; i++){
        {{_copyFunc(type.type, src+"[" + i + "]", dst+"[" + i + "]", "        ")}}
    }
}
{{elseif type.name === "Tuple"}}
if({{src}}){

    {{dst}} = [] as any;
    {{for j2, v2 of type.childs}}
    {{_copyFunc(type.childs[j2], src+"[" + j2 + "]", dst+"[" + j2 + "]", "    ")}}
    {{end}}
}
{{elseif type.name === "Map"}}
if({{src}}){
    {{src}}.forEach((v, k) => {
        let key, value;
        {{_copyFunc(type.genType[0], "k" , "key", "        ")}}
        {{_copyFunc(type.genType[0], "v" , "value", "        ")}}
        {{dst}}.set(key, value);
    });
}
{{else}}

{{dst}} = {{src}};
{{end}}
`;
const tsTypeStr1 = (type) => {
    if (type.name === "Option") {
        return tsTypeStr1(type.genType[0]);
    }
    else if (type.name === "HashMap") {
        return "Map<" + tsTypeStr1(type.genType[0]) + "," + tsTypeStr1(type.genType[1]) + ">";
    }
    else {
        return tsTypeStr(type, null, null);
    }
};
//确定枚举的类型，如 number | [string, string]
const toEnumType = (obj) => {
    let members = obj.members;
    let types = [];
    for (let i = 0; i < members.length; i++) {
        let str;
        let m = members[i];
        if (m.type === "StructTuple") {
            if (m.members.length === 1) { //如果元组中只存在一个元素， 则任务成员类型为其内部元素类型
                str = tsTypeStr1(m.members[0]);
            }
            else { //否则， 该成员类型为元组类型
                let s = [];
                for (let j = 0; j < m.members.length; j++) {
                    s.push(tsTypeStr1(m.members[j]));
                }
                str = "[" + s.join(",") + "]";
            }
        }
        else if (m.type === "Struct") {
            str = "_$_" + obj.name + "_" + members[i].name; //如果是一个结构体，其类型为“_$_+ 枚举名称 + _ + 成员的名称”， 该类型必须在外部定义出来
        }
        else {
            continue; //如果是一个空结构体，不需要描述其类型
        }
        if (types.indexOf(str) < 0) {
            types.push(str);
        }
    }
    return types.join(" | ");
};
const readFunc = (type, name, enumcs, tab) => {
    let str = tplFunc.readTpl(null, type, name, enumcs);
    if (tab) {
        str = str.replace(/^/mg, tab);
    }
    return str;
};
const writeFunc = (type, valueName, enumcs, tab) => {
    let str = tplFunc.writeTpl(null, type, valueName, enumcs);
    if (tab) {
        str = str.replace(/^/mg, tab);
    }
    return str;
};
const enumTypeFunc = (type, enums, enumcs, tab) => {
    let str = tplFunc.enumTypeTpl(null, type, enums, enumcs);
    if (tab) {
        str = str.replace(/^/mg, tab);
    }
    return str;
};
const sinfoFunc = (name, members, annotate, enums, enumcs, tab) => {
    let str = tplFunc.sinfoTpl(null, name, members, annotate, enums, enumcs);
    if (tab) {
        str = str.replace(/^/mg, tab);
    }
    return str;
};
const enumInfoFunc = (obj, path, annotate, enums, enumcs, tab) => {
    let str = tplFunc.enumInfo(null, obj, path, annotate, enums, enumcs);
    if (tab) {
        str = str.replace(/^/mg, tab);
    }
    return str;
};
//定义枚举内部结构体为interface
const enumIntoTnterface = (obj) => {
    let members = obj.members;
    let types = "";
    for (let i = 0; i < members.length; i++) {
        if (members[i].type === "Struct") {
            types += tplFunc.enumIntoTnterfaceTpl(null, members[i], obj.name);
        }
    }
    return types;
};
const rustEnumFunc = (obj, path, enums, enumcs, tab) => {
    let str = tplFunc.rustEnumTpl(null, obj, path, enums, enumcs);
    if (tab) {
        str = str.replace(/^/mg, tab);
    }
    return str;
};
const tsFunc = (objs, path, cfg, enums, enumcs, tab) => {
    let str = tplFunc.tsTpl(null, objs, path, cfg, enums, enumcs);
    if (tab) {
        str = str.replace(/^/mg, tab);
    }
    return str;
};
const copyFunc = (type, src, dst, tab) => {
    let str = tplFunc.copyTpl(null, type, src, dst);
    if (tab) {
        str = str.replace(/^/mg, tab);
    }
    return str;
};
const parseConst = (v) => {
    if (v.startsWith('"formula#')) { //是一个公式字符串 （不严谨， 分析该字符串的语法来确定）
        let s = v.slice(9, v.length - 1); //去掉字符串‘"formula#’
        let arr = s.split("#");
        let param = arr[0].replace(/:([^,)]*)/g, (word, v) => {
            let t = v.trim();
            if (Gendrust.isNumber(t)) {
                return ":number";
            }
            else if (Gendrust.isStr(t)) {
                return ":string";
            }
            else if (Gendrust.isBool(t)) {
                return ":boolean";
            }
            else {
                return ":" + t;
            }
        });
        return `${param} => {
	return ${arr[1]};
}`;
    }
    else {
        return v;
    }
};
/**
 * @description  返回定义的函数, 用定义字符串，转成匿名函数的返回函数
 * @example
 */
const toFunc = (s) => {
    try {
        return (new Function("_stringify", "_tsTypeStr", "_typeToString", "_isNativeObject", "_isInteger", "_isStr", "_isBase", "_strHashCode", "_upperFirst", "_readFunc", "_jsonToArray", "_writeFunc", "_enumTypeFunc", "_sinfoFunc", "_isBigInt", "_parseConst", "_toEnumType", "_enumIntoTnterface", "_rustEnumFunc", "_enumInfoFunc", "_copyFunc", "return " + s))(tpl_1.toString, tsTypeStr1, Gendrust.typeToString, isNativeObject, Gendrust.isInteger, Gendrust.isStr, Gendrust.isBase, hash.strHashCode, util_1.upperFirst, readFunc, jsonToArray, writeFunc, enumTypeFunc, sinfoFunc, Gendrust.isBigInt, parseConst, toEnumType, enumIntoTnterface, rustEnumFunc, enumInfoFunc, copyFunc);
    }
    catch (e) {
        //warn(level, "tpl toFun, path: "+", s: ", s, e);
        throw (e);
    }
};
let tplFunc = {
    readTpl: toFunc(tpl_1.compile(readTpl, tpl_str_1.Parser)),
    writeTpl: toFunc(tpl_1.compile(writeTpl, tpl_str_1.Parser)),
    enumTypeTpl: toFunc(tpl_1.compile(enumTypeTpl, tpl_str_1.Parser)),
    sinfoTpl: toFunc(tpl_1.compile(sinfoTpl, tpl_str_1.Parser)),
    tsTpl: toFunc(tpl_1.compile(tsTpl, tpl_str_1.Parser)),
    enumIntoTnterfaceTpl: toFunc(tpl_1.compile(enumIntoTnterfaceTpl, tpl_str_1.Parser)),
    enumInfo: toFunc(tpl_1.compile(enumInfo, tpl_str_1.Parser)),
    rustEnumTpl: toFunc(tpl_1.compile(rustEnumTpl, tpl_str_1.Parser)),
    copyTpl: toFunc(tpl_1.compile(copyTpl, tpl_str_1.Parser)),
};
});
