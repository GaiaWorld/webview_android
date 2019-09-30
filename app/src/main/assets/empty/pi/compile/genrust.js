_$define("pi/compile/genrust", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hash = require("../util/hash");
const tpl_str_1 = require("../util/tpl_str");
const tpl_1 = require("../util/tpl");
const Gendrust = require("./gendrust");
// ====================================== 导出
/*将rust结构对象转换成可序列化的rust
**@param objects:rust中定义的结构体、枚举、函数等
**@param cfg:描述rust中哪些结构是公开的接口，默认pub类型的定义公开
**cfg: {}
**file = {|defTriat#?, defStruct, defEnum, defStructEmpty, defStructTuple, importMany, importOne, impl, defFn, implTrait#?, newType|};
*/
exports.gen = (mods, depend, tree) => {
    let dropStr = "";
    let registStr = "\npub fn register(mgr: &BonMgr){"; //结构体、枚举、函数注册
    let rObjs = [];
    let strs = gen1(mods, rObjs, depend, tree);
    let useStr = depend.join(";\n") + ";"; //取到配置中的依赖
    for (let i = 0; i < rObjs.length; i++) {
        let p = rObjs[i];
        let h = hash.strHashCode(p, 0);
        registStr += "\n" + `    mgr.regist_struct_meta(StructMeta{name:String::from("${p}"), drop_fn: drop_${h}}, ${h});`;
        dropStr += "\n" + dropTplFun(h, p);
    }
    if (!tree.isDef && !tree.isMain) {
        useStr += "\nuse " + tree.creatName + ";";
    }
    if (tree.isMain) {
        mods.forEach((mod, key) => {
            useStr += "\nuse " + mod.modName + ";";
        });
    }
    // mods.forEach((v, k) => {
    // 	useStr += "\nuse " + tree.creatName + "::" + k + ";"; //引入所有库内定义的模块
    // })
    return useStr + "\n" + strs[0] + dropStr + registStr + strs[1] + "\n}";
};
//解析导入的std库的模块, 以及外模依赖库
const gen_use = (typeCache, uses, declarCreats) => {
    if (!typeCache) {
        return;
    }
    else {
        typeCache.forEach((v, k) => {
            let s;
            if (!v.namespace.startsWith("std::")) {
                let names = v.namespace.split("::");
                if (declarCreats.indexOf(names[0]) > -1) {
                    s = `use ${names[0]}`;
                }
                else {
                    return;
                }
            }
            else {
                s = `use ${v.namespace}`;
            }
            if (uses.indexOf(s) < 0) {
                uses.push(s);
            }
        });
    }
};
const gen1 = (mods, rObjs, uses, tree) => {
    let str1 = "", str2 = "";
    mods.forEach((mod, k) => {
        let r = gen2(mod, rObjs, uses, tree);
        str1 += r[0];
        str2 += r[1];
    });
    return [str1, str2];
};
const gen2 = (mod, rObjs, uses, tree) => {
    let str1 = "", str2 = "";
    gen_use(mod.typeCache, uses, tree.declarCreats);
    if (mod.classFunc) {
        mod.classFunc.forEach((funcs, k) => {
            let c = mod.classes.get(k);
            if (funcs.size > 0) {
                c.rsflag = true;
            }
            if (!c) {
                return;
            }
            let arr = [funcs];
            if (c.deref) {
                let funcDeref = mod.classFunc.get(c.deref.func.result.name);
                arr.push(funcDeref);
            }
            for (let i = 0; i < arr.length; i++) {
                arr[i].forEach((func, name) => {
                    let mn = func.structName;
                    if (!mod.cfg.default) {
                        let modName = mod.mod();
                        mn = (modName ? modName + "::" : "") + mn;
                    }
                    let parentName = func.structStr;
                    let path = tree.creatName + "::" + mn;
                    if (tree.isDef) {
                        path = func.structName;
                    }
                    else if (tree.isMain) {
                        path = mn;
                    }
                    if (func.implGenStr) {
                        path += "::" + func.implGenStr;
                    }
                    // let h = func.hash;
                    // if(func.vectoslice){
                    //     h = hash.strHashCode("vectoslice", h);
                    // }
                    let s = fnFunc(func, path, parentName, func.hash, mod, tree, func.vectoslice ? true : false);
                    str1 += s[0];
                    str2 += s[1];
                    // if(func.vectoslice === "add"){
                    //     let s = fnFunc(func, path,  parentName, func.hash, mod, tree, false);
                    //     str1 += s[0];
                    //     str2 += s[1];
                    // }
                    if (func.traitName) {
                        let s = `use ${func.traitName}`;
                        if (uses.indexOf(s) < 0) {
                            uses.push(s);
                        }
                    }
                    let params = func.params;
                    if (func.sync || func.async) {
                        params.pop();
                    }
                    registerParamType(params, rObjs, mod, parentName, tree);
                    registerType(func.result, rObjs, mod, parentName, tree);
                    registerType(func.callBackPT, rObjs, mod, parentName, tree);
                });
            }
        });
    }
    if (mod.funMap) {
        let path = tree.creatName + "::" + mod.mod();
        if (tree.isDef) {
            path = "";
        }
        else if (tree.isMain) {
            path = mod.mod();
        }
        mod.funMap.forEach((func, k) => {
            let s = fnFunc(func, path, null, func.hash, mod, tree, func.vectoslice ? true : false);
            str1 += s[0];
            str2 += s[1];
            let params = func.params;
            if (func.sync || func.async) {
                params.pop();
            }
            registerParamType(params, rObjs, mod, null, tree);
            registerType(func.result, rObjs, mod, null, tree);
            registerType(func.callBackPT, rObjs, mod, null, tree);
        });
    }
    if (mod.classes) {
        mod.classes.forEach((v, k) => {
            if (v.rsflag === true || v.power !== "pub" || !Gendrust.isInclude(mod.getFullMod(v.name, false, tree), mod.cfg)) {
                return;
            }
            let m = mod.cfg.default ? "" : mod.mod() + "::";
            let path = (tree.isMain ? "" : (tree.creatName + "::")) + m + Gendrust.typeToString(v);
            let genTypeCfgs = Gendrust.initGenCfg(v.genType, path, mod.cfg.genType);
            for (let z = 0; z < genTypeCfgs.length; z++) {
                let t1 = new Gendrust.Type();
                t1.name = v.name;
                t1.genType = v.genType;
                let t = Gendrust.getActType(t1, genTypeCfgs[z]);
                registerType(t, rObjs, mod, null, tree);
            }
        });
    }
    return [str1, str2];
};
const genRegistObj = () => {
    let str = "";
    this.data.contex.registerObjMap.forEach((v, k) => {
        str += `
	mgr.regist_struct_meta(StructMeta{name:String::from("${k}")}, ${v});`;
    });
    return str;
};
const genUses = () => {
    let map = new Map;
    this.data.contex.typeCache.forEach((v, k) => {
        map.set(v.namespace, true);
    });
    let str = "";
    map.forEach((v, k) => {
        let i = k.indexOf("::");
        if (i > -1) {
            let u = k.slice(0, i);
            str += "\n" + `use ${u};`;
        }
    });
    return str;
};
const registerType = (type, arr, mod, structStr, tree) => {
    if (!type) {
        return;
    }
    if (type.name === "self" || type.name === "Self") {
        if (arr.indexOf(structStr) < 0) {
            arr.push(structStr);
        }
    }
    else if (type.name === "Option" || type.name === "Result") {
        registerType(type.genType[0], arr, mod, structStr, tree);
    }
    else if (Gendrust.isNativeObject(type.name)) {
        let name = Gendrust.typeToString(type, false, structStr, mod, true, tree);
        if (Gendrust.isAtom(name)) {
            return;
        }
        if (arr.indexOf(name) < 0) {
            arr.push(name);
        }
    }
    else if (Gendrust.isArray(type.name)) {
        registerType(type.type, arr, mod, structStr, tree);
    }
    else if (Gendrust.isTuple(type.name)) {
        for (let i = 0; i < type.childs.length; i++) {
            registerType(type.childs[i], arr, mod, structStr, tree);
        }
    }
};
const registerParamType = (types, arr, mod, structStr, tree) => {
    if (!types) {
        return;
    }
    for (let i = 0; i < types.length; i++) {
        registerType(types[i].type || types[i], arr, mod, structStr, tree);
    }
};
const fnFunc = (func, path, structName, h, mod, tree, vectoslice) => {
    let str = "", str1 = "", ps;
    if (func.sync || func.async) {
        if (func.sync) {
            let synch = hash.strHashCode("sync", func.hash);
            str += "\n" + tplFunc.fnSyncCallTpl(null, func, mod, path, synch, tree, tps_has_nobj, vectoslice);
            str1 += regist_fun_meta(synch, func.fn.func.params, func.fn.func.result, func.callBackPT, "sync");
            //registerType(func.callBackPT, genTypeCfg, structName, mod);
        }
        if (func.async) {
            let async = hash.strHashCode("async", func.hash);
            str += "\n" + tplFunc.fnAsyncCallTpl(null, func, mod, path, async, tree, tps_has_nobj, vectoslice);
            str1 += regist_fun_meta(async, func.fn.func.params, func.fn.func.result, func.callBackPT, "async");
            //registerType(func.callBackPT, genTypeCfg, structName, mod);
        }
        ps = func.fn.func.params.slice(0, func.fn.func.params.length - 1);
    }
    else {
        str += "\n" + tplFunc.fnCallTpl(null, func, mod, path, tree, tps_has_nobj, vectoslice); //fncall
        ps = func.fn.func.params;
        str1 += regist_fun_meta(func.hash, func.fn.func.params, func.fn.func.result);
    }
    //registerParamType(ps, genTypeCfg, structName, mod);
    //if(func.fn.func.result) registerType(func.fn.func.result, genTypeCfg, structName, mod);
    return [str, str1];
};
//生成接口注册代码， 根据参数，返回值，回调值的类型选择注册的接口类型
const regist_fun_meta = (hash, params, result, back, suf) => {
    let v = suf ? 1 : 0;
    if (params && params.length > v) {
        // for(let i = 0 ; i < params.length - v; i++){
        //     if(params[i].name === "self" || has_nobj(params[i].type)){
        //         return "\n    " + `mgr.regist_fun_meta(FnMeta::CallArgNobj(call_${hash}${suf?"_"+suf:""}), ${hash});`
        //     }
        // }
        if (suf) { //阻塞方法或异步方法
            // if(suf === "async" || result && has_nobj(result)){
            //     return "\n    " + `mgr.regist_fun_meta(FnMeta::CallArgNobj(call_${hash}_${suf}), ${hash});`
            // }if(back && has_nobj(back)){
            //     return "\n    " + `mgr.regist_fun_meta(FnMeta::CallArgNobj(call_${hash}_${suf}), ${hash});`
            // }else{
            return "\n    " + `mgr.regist_fun_meta(FnMeta::CallArg(call_${hash}_${suf}), ${hash});`;
            //}
            //}else if(result && has_nobj(result)){
            // return "\n    " + `mgr.regist_fun_meta(FnMeta::CallArgNobj(call_${hash}), ${hash});`
        }
        else {
            return "\n    " + `mgr.regist_fun_meta(FnMeta::CallArg(call_${hash}), ${hash});`;
        }
    }
    else {
        if (suf) { //阻塞方法或异步方法
            // if(back && has_nobj(back)){
            //     return "\n    " + `mgr.regist_fun_meta(FnMeta::CallNobj(call_${hash}_${suf}), ${hash});`
            // }else{
            return "\n    " + `mgr.regist_fun_meta(FnMeta::Call(call_${hash}_${suf}), ${hash});`;
            //}
            // }else if(result && has_nobj(result)){
            //     return "\n    " + `mgr.regist_fun_meta(FnMeta::CallNobj(call_${hash}), ${hash});`
        }
        else {
            return "\n    " + `mgr.regist_fun_meta(FnMeta::Call(call_${hash}), ${hash});`;
        }
    }
};
//检查参数和返回值中是否存在NativeObject
const tps_has_nobj = (params, result) => {
    if (params && params.length > 0) {
        for (let i = 0; i < params.length; i++) {
            if (params[i].name === "self") {
                return true;
            }
            else if (has_nobj(params[i].type)) {
                return true;
            }
        }
    }
    if (result) {
        if (has_nobj(result)) {
            return true;
        }
    }
    return false;
};
const has_nobj = (type) => {
    if (!has_nobj) {
        return false;
    }
    else if (Gendrust.isNativeObject(type.name)) {
        return true;
    }
    else if (Gendrust.isArray(type.name) && Gendrust.arrHasNObj(type)) {
        return true;
    }
    else if (Gendrust.isTuple(type.name) && Gendrust.tupleHasNObj(type)) {
        return true;
    }
};
//取到完整的路径名称
// const getFullMod = (name: string, r: Gendrust.Data): Json => {
// 	let names = name.split("::"), p = name;
// 	let n = names[0];
// 	let j = n.indexOf("<");
// 	if(j > 0){
// 		n = n.slice(0, j);
// 	}
// 	for(let i = 0 ; i < r.imports.length; i++){
// 		if(r.imports[i].type === "importOne"){
// 			let ps = r.imports[i].path.split("/");
// 			if(ps[ps.length - 1] === n){
// 				names = names.slice(1, names.length);
// 				p =  ps.join("::") + "::" + names.join("::");
// 			}
// 		}else{
// 			let ps = r.imports[i].path.split("/");
// 			for(let j = 0; j < r.imports[i].contents.length; j++){
// 				if(r.imports[i].contents[j] === n){
// 					p = ps.join("::") + "::" + name;
// 				}
// 			}
// 		}
// 	}
// 	if(r.objs[n]){
// 		p =  r.modName + "::" + name;
// 	}
// 	let i = p.indexOf("std::");
// 	if(i === 0){//如果类型以std开头,应该去掉"std::",并将其存入std列表中
// 		p = p.slice(5, p.length);
// 		let j = p.indexOf("::");
// 		r.contex.stds.set(p.slice(0,j), true);
// 	}else{
// 		let index = p.indexOf("::");
// 		if( index >= 0){
// 			r.contex.usesOther.set(p, true);
// 		}
// 	}
// 	return p;
// }
const parseJSTypeParamFun = (name, type, funcName, struct, r, tree, jsName) => {
    return tplFunc.parseJSTypePrama(null, name, type, funcName, struct, r, tree, Gendrust.deref, jsName);
};
const parseJSTypeResultFun = (name, type, funcName, struct, r, hasp, tree, iq, jsName) => {
    return tplFunc.parseJSTypeResult(null, name, type, funcName, struct, r, hasp, tree, iq, jsName);
};
const dropTplFun = (hash, name) => {
    return tplFunc.dropTpl(null, hash, name);
};
//结构体、枚举实现自动解应用特征  目前不需要
const implDerefTpl = `{{let name = it}}{{let contain = it1}}
impl Deref for {{name}} {
	type Target = {{contain}};
	fn deref(&self) -> &{{contain}} {
		&self.0
	}
}
impl DerefMut for {{name}} {
	fn deref_mut(&mut self) -> &mut {{contain}}{
		&mut self.0
	}
}
`;
//生成注册函数的代码
// const registFnTpl = `{{let fnName = it}}{{let params = it1}}{{let path = it2}}{{let genType = it3}}
// let params = Vec::new();
// {{if param.length > 0}}
// {{for i, param of params}}
// params.push((param.type.isQuote, param.type.isMut, NType::from_str("{{_typeToString(type, false, struct)(param.type, genType)}}")));
// {{end}}
// funcMgr.insert({{_strHashCode(path + fnName)}}, FnMeta::new({{fnName}}, call{{fnName}}, params));
// {{end}}
// `
//生成注册数据结构（枚举，结构体）的代码   目前不需要
const registObjTpl = `{{let obj = it}}{{let name = it1}}{{let genType = it2}}{{let path = it3}}{{let modeName = it4}}{{let _createName = it5}}
	let members = Vec::new();

{{if obj.type === "enum" }}

{{for i, member of obj.members}}
	let members1 = Vec::new();
{{if member.type === "Struct"}}
{{let members1 = member.members}}
{{for j, member1 of members1}}
	members1.push(Box::new(Property("{{member1.name}}", TypeDesc({{member1.type.isQuote?true:false}}, {{member1.type.isMut?true:false}},  NType::from_str('{{_typeToString(type, false, struct)(member1.type)}}')))));
{{end}}

{{elseif member.type === "StructTuple"}}
{{let members1 = member.members}}
{{for j, member1 of members1}}
	members1.push(Box::new(TypeDesc({{member1.type.isQuote?true:false}}, {{member1.type.isMut?true:false}},  NType::from_str('{{_typeToString(member1.type)}}'))));
{{end}}
{{end}}
	members.push(StructMeta{name:"{{member.name}}", tp:{{member.type}}, members:members });
	mgr.regist_obj_meta(EnumMeta{name:"{{name}}", members: members}, {{_strHashCode(_createName + "::" + path + name, 0)}} );
{{end}}

{{elseif obj.type === "Struct"}}
{{for i, member of obj.members}}
	members.push(Box::new(Property("{{member.name}}", TypeDesc({{member.type.isQuote?true:false}}, {{member.type.isMut?true:false}},  NType::from_str("{{_typeToString(member.type)}}")))));
{{end}}	
	mgr.regist_obj_meta(StructMeta{name:"{{name}}", str2:"Struct", members: members}, {{_strHashCode(_createName + "::" + path + name, 0)}} );


{{elseif obj.type === "StructTuple"}}
{{for i, member of obj.members}}
	members.push(Box::new(TypeDesc({{member.type.isQuote?true:false}}, {{member.type.isMut?true:false}},  NType::from_str("{{_typeToString(member.type, genType)}}"))));
{{end}}
	mgr.regist_obj_meta(StructMeta{name:"{{name}}", str2:"StructTuple", members: members}, {{_strHashCode(_createName + "::" + path + name, 0)}});

{{end}}`;
//函数实现  目前不需要
const fnBodyTpl = `{{let params = it}}{{let name = it1}}{{let genType = it2}}
{
{{name}}{{genType}}(
{{if params && params.length > 0}}
{{for i, param of params}}
{{if i > 0}},
{{end}}
{{if !isParamSelf(param)}}
	{{param.name}}:{{_typeToString(param.type)}}
{{else}}
	self
{{end}}
{{end}}
{{end}} )
}
`;
const parseJSTypePrama = `
{{%name: 变量名称， type:变量类型, funcName：方法名名称，tabCount: 每行缩进%}}
{{let name = it}}{{let type = it1}}{{let errorStrName = it2}}{{let struct = it3}}{{let _r = it4}}{{let _tree = it5}}{{let _deref = it6}}{{let iq = it7}}
{{: iq = iq?iq:type.isQuote}}{{let im = type.isMut}}
{{if type.name === "pi_vm::adapter::JSType"}}

{{elseif _isNumber(type.name)}}
	if !{{name}}.is_number(){ return Some(CallResult::Err(String::from(param_error)));}
	{{if type.name === "usize"}}
	let {{name}} = {{if iq}}&{{if im}}mut{{" "}}{{end}}{{end}}{{name}}.get_u32() as usize;
	{{elseif type.name === "isize"}}
	let {{name}} = {{if iq}}&{{if im}}mut{{" "}}{{end}}{{end}}{{name}}.get_i32() as isize;
	{{else}}
	let {{name}} = {{if iq}}&{{if im}}mut{{" "}}{{end}}{{end}}{{name}}.get_{{type.name}}();
	{{end}}

{{elseif _isStr(type.name)}}
	if !{{name}}.is_string(){ return Some(CallResult::Err(String::from(param_error)));}
    let {{name}} = {{if iq}}&{{if im}}mut{{" "}}{{end}}{{end}}{{name}}.get_str();

{{elseif _isBool(type.name)}}
	if !{{name}}.is_boolean(){ return Some(CallResult::Err(String::from(param_error))); }
    let {{name}} = {{if iq}}&{{if im}}mut{{" "}}{{end}}{{end}}{{name}}.get_boolean();
    
{{elseif type.name === "Option"}} {{%没考虑Option是引用的情况， 需要考虑？%}}
    let {{name}} = if {{name}}.is_undefined() || {{name}}.is_null(){
        None
    }else{
        {{_parseJSTypeParamFun(name, type.genType[0], errorStrName, struct, _r, _tree)}}
        Some({{name}})
    };

{{elseif _isArray(type.name)}}
{{if type.type.name === "u8" }}
	if !{{name}}.is_uint8_array() && !{{name}}.is_array_buffer(){return Some(CallResult::Err(String::from(param_error))); }
    {{if iq}}{{if im}} {{%引用%}}
    let mut {{name}} = {{name}}.into_vec();
    let {{name}} = {{name}}.as_mut_slice();{{else}}
    let {{name}} = {{name}}.to_bytes();{{end}}
    {{if type.len > 0}}
    if {{name}}.len() != {{type.len}}{return Some(CallResult::Err(String::from(param_error))); }
    let {{name}} = unsafe{*({{name}}.as_ptr() as * {{im?"mut ":"const "}}[u8; {{type.len}}])};
    let {{name}} = &{{name}};
	{{end}}
    {{else}}{{%所有权, 如果参数是数组的所有权， 由于无法从直接使用vm中的内存，需要拷贝%}}
    let {{name}}_ = {{name}}.to_bytes();
	if {{name}}_.len() != {{type.len}}{return Some(CallResult::Err(String::from(param_error))); }
    let mut {{name}} = [0u8; {{type.len}}];
    {{name}}.copy_from_slice({{name}}_);
    {{end}}

{{else}}
	if !{{name}}.is_array(){return Some(CallResult::Err(String::from(param_error)));}
	let a_len = {{name}}.get_array_length();
	{{if type.len > 0}}
	if a_len != {{type.len}}{return Some(CallResult::Err(String::from(param_error))); }
    {{end}}

    {{if type.len}}
    let mut {{name}}_: [{{_typeToString(type, false, struct)}}}}; {{type.len}}] =  usafe{uninitialized()};
    for i in 0..a_len{
		let {{name}}_e = {{name}}.get_index(i as u32);
		{{_parseJSTypeParamFun(name + "_e", type.type, errorStrName, struct, _r, _tree)}}
		{{"    "}}{{name}}[i] = {{name}}_e;
    }
    {{if iq}}
    let {{name}} = &{{im?"mut ": " "}}{{name}}_;
    {{else}}
    let{{im?" mut ": " "}}{{name}} = {{name}}_;
    {{end}}

    {{else}}
    let mut {{name}}_ = Vec::new();
    for i in 0..a_len{
		let {{name}}_e = {{name}}.get_index(i as u32);
		{{_parseJSTypeParamFun(name + "_e", type.type, errorStrName, struct, _r, _tree)}}
		{{"    "}}{{name}}_.push({{name}}_e);
    }
    {{if im}}
    let {{name}} = {{name}}_.as_mut_slice();
    {{else}}
    let {{name}} = {{name}}_.as_slice();
    {{end}}
    {{end}}
{{end}}

{{% 非匿名元组，因难以判断其是元组类型，因此按照NativeObject处理%}}
{{elseif _isTuple(type.name)}}
	if !{{name}}.is_array(){return Some(CallResult::Err(String::from(param_error)));}
	{{let len = type.childs.length}}
	{{let i = 0}}
	{{while i < len}}
	let {{name}}_{{i}} = {{name}}.get_index({{i}});
    {{_parseJSTypeParamFun(name + "_" + i, type.childs[i], errorStrName, struct, _r, _tree)}}
    {{:i++}}
	{{end}}
	{{:i = 0}}
	let {{name}} = (
    {{while i < len}}{{if i> 0}},{{end}}{{name}}_{{i}}
    {{:i++}}
    {{end}});
    {{if iq}}
    let {{name}} = &{{im?"mut ":""}}{{name}}
    {{end}}

{{elseif _isNativeObject(type.name)}}
{{let e = _isEnumC(type.name, _r, _tree)}}
{{if e}}
    if !{{name}}.is_number(){return Some(CallResult::Err(String::from(param_error)));}
    {{let mv = -1}}
    let {{name}} = match {{name}}.get_u32(){
        {{for j, member of e.members}}
        {{if member.value}}{{: mv = parseInt(member.value)}}
        {{else}}
        {{: mv += 1}}
        {{end}}
        
        {{mv}} => {{type.name}}::{{member.name}},
        {{end}}
        _ => panic!("enum type error")
    };
{{else}}
    {{let dtype = _deref(type, _r, struct)}} {{%解引用后的类型%}}
    {{let rType = _typeToString(type, false, struct)}} {{%全类型字符串%}}
    {{let rdType = _typeToString(dtype, false, struct)}} {{%解引用后的类型字符串%}}
    {{if _isAtom(rType)}}
    if !{{name}}.is_string(){ return Some(CallResult::Err(String::from(param_error)));}
    let {{if im}}mut{{" "}}{{end}}{{name}} = Atom::from({{name}}.get_str());
    {{if iq}}
    let {{name}} = &{{if im}}mut{{" "}}{{end}}{{name}};
    {{end}}
    {{else}}
    {{let isref = (rType === rdType)?false:true}} 
    let ptr = jstype_ptr(&{{name}}, js.clone(), {{_strHashCode(rType, 0)}}, {{iq?false: true}}, param_error).expect("");
    {{if iq}}
	let {{name}} = unsafe { &{{type.isMut?"mut ":""}}*(ptr as *{{type.isMut?"mut ":"const "}}{{rType}}) };
    {{else}}
	{{if isref}}
	let {{name}} = *unsafe { Box::from_raw(ptr as *mut {{rType}})}.clone();
	{{else}}
	let {{name}} = *unsafe { Box::from_raw(ptr as *mut {{rType}}) };
	{{end}}
    {{end}}
    {{end}}
{{end}}

{{elseif _isBigInt(type.name)}}
    {{let len = _isBigInt(type.name)}}
    if !{{name}}.is_uint8_array() && !{{name}}.is_array_buffer(){return Some(CallResult::Err(String::from(param_error))); }
    let arr = unsafe{*({{name}}.to_bytes().as_ptr() as usize as *const [u8; {{len}}])};
    let {{name}} = {{if iq}}&{{if im}}mut{{" "}}{{end}}{{end}}unsafe {
        transmute::<[u8; {{len}}], {{type.name}}>(arr)
    }; 

{{end}}
`;
const parseJSTypeResult = `
{{%name: 变量名称， type:变量类型, funType: 方法类型（同步，阻塞，异步） tabCount: 每行缩进%}}
{{let value = it}}{{let type = it1}}{{let funType = it2}}{{let struct = it3}}{{let _r = it4}}{{let hasp = it5}}{{let _tree= it6}}{{let iq = it7}}{{let jsName = it8}}
{{: iq = iq?iq:type.isQuote}}
{{let js  = jsName?jsName:"js"}}
{{let pre = value?"let mut " + value + " = ":""}}
{{if type.name === "pi_vm::adapter::JSType"}}
    {{if funType && funType.startsWith && funType.startsWith("sync,")}}
    {{pre}}{{js}}.new_undefined();
    {{end}}
{{elseif type.name === "i8"}}
    {{if iq}}
    {{pre}}{{js}}.new_i8({{value}}.clone());
    {{else}}
    {{pre}}{{js}}.new_i8({{value}});
    {{end}}

{{elseif type.name === "i16"}}
    {{if iq}}
    {{pre}}{{js}}.new_i16({{value}}.clone());
    {{else}}
    {{pre}}{{js}}.new_i16({{value}});
    {{end}}

{{elseif type.name === "i32"}}
    {{if iq}}
    {{pre}}{{js}}.new_i32({{value}}.clone());
    {{else}}
    {{pre}}{{js}}.new_i32({{value}});
    {{end}}

{{elseif type.name === "i64"}}
    {{if iq}}
    {{pre}}{{js}}.new_i64({{value}}.clone());
    {{else}}
    {{pre}}{{js}}.new_i64({{value}});
    {{end}}

{{elseif type.name === "u8"}}
    {{if iq}}
    {{pre}}{{js}}.new_u8({{value}}.clone());
    {{else}}
    {{pre}}{{js}}.new_u8({{value}});
    {{end}}

{{elseif type.name === "u16"}}
    {{if iq}}
    {{pre}}{{js}}.new_u16({{value}}.clone());
    {{else}}
    {{pre}}{{js}}.new_u16({{value}});
    {{end}}

{{elseif type.name === "u32"}}
    {{if iq}}
    {{pre}}{{js}}.new_u32({{value}}.clone());
    {{else}}
    {{pre}}{{js}}.new_u32({{value}});
    {{end}}

{{elseif type.name === "u64"}}
    {{if iq}}
    {{pre}}{{js}}.new_u64({{value}}.clone());
    {{else}}
    {{pre}}{{js}}.new_u64({{value}});
    {{end}}

{{elseif type.name === "f32"}}
    {{if iq}}
    {{pre}}{{js}}.new_f32({{value}}.clone());
    {{else}}
    {{pre}}{{js}}.new_f32({{value}});
    {{end}}

{{elseif type.name === "f64"}}
    {{if iq}}
    {{pre}}{{js}}.new_f64({{value}}.clone());
    {{else}}
    {{pre}}{{js}}.new_f64({{value}});
    {{end}}

{{elseif type.name === "usize"}}
    {{if iq}}
    {{pre}}{{js}}.new_u32({{value}}.clone() as u32);
    {{else}}
    {{pre}}{{js}}.new_u32({{value}} as u32);
    {{end}}

{{elseif type.name === "isize"}}
    {{if iq}}
    {{pre}}{{js}}.new_i32({{value}}.clone() as i32);
    {{else}}
    {{pre}}{{js}}.new_i32({{value}} as i32);
    {{end}}

{{elseif type.name === "bool"}}
    {{if iq}}
    {{pre}}{{js}}.new_boolean({{value}}.clone());
    {{else}}
    {{pre}}{{js}}.new_boolean({{value}});
    {{end}}

{{elseif type.name === "str"}}
	{{pre}}{{js}}.new_str(String::from({{value}}));

{{elseif type.name === "String"}}
    {{if iq}}
    {{pre}}{{js}}.new_str(String::from({{value}}.as_str()));
    {{else}}
    {{pre}}{{js}}.new_str({{value}});
    {{end}}

{{elseif type.name === "Result"}}
{{if funType && funType.startsWith && funType.startsWith("sync,")}}
    {{pre}}match {{value}}{
        Ok(r) => {
            block_reply({{js}}.clone(), Box::new(move |js: Arc<JS>| {
                {{_parseJSTypeResultFun("r", type.genType[0], funType, struct, _r, true, _tree)}}
            } ), Atom::from("{{funType}}"));
        }
        Err(v) => { 
            {{if type.genType[1] && type.genType[1].name === "String"}}
            block_throw({{js}}.clone(), v + ", Result is Err", Atom::from("block throw task"));
            {{else}}
            block_throw({{js}}.clone(), v.to_string() + ", Result is Err", Atom::from("block throw task"));
            {{end}}
            return;
        }
    };
{{elseif funType === "async"}}
    {{pre}}match {{value}}{
        Ok(r) => { {{_parseJSTypeResultFun("r", type.genType[0], funType, struct, _r, true, _tree)}} r }
        Err(v) => { 
            {{if type.genType[1] && type.genType[1].name === "String"}}
            {{js}}.new_str(v + ", Result is Err")
            {{else}}
            {{js}}.new_str(v.to_string() + ", Result is Err")
            {{end}}
        }
    };
{{else}}
    {{pre}}match {{value}}{
        Ok(r) => { {{_parseJSTypeResultFun("r", type.genType[0], funType, struct, _r, true, _tree)}} r }
        Err(v) => { 
            {{if type.genType[1] && type.genType[1].name === "String"}}
            return Some(CallResult::Err(v + ", Result is Err"));
            {{else}}
            return Some(CallResult::Err(v.to_string() + "Result is Err"));
            {{end}}
        }
    };
{{end}}

{{elseif type.name === "Option"}}
    {{pre}}match {{value}}{
        Some(v) => { {{_parseJSTypeResultFun("v", type.genType[0], funType, struct, _r, true, _tree)}} v}
        None => {{js}}.new_null()
    };

{{elseif _isNativeObject(type.name)}}
{{if _isEnumC(type.name, _r, _tree)}}
    {{pre}}{{js}}.new_i32({{value}} as i32);
{{else}}
    {{let dtype = _deref(type, _r, struct)}}
    {{let rtype = _typeToString(type, false, struct, _r, true, _tree)}}
    {{let rdtype = _typeToString(dtype, false, struct, _r, true, _tree)}}
    {{let isref = (rtype === rdtype)?false:true}}
    {{if _isAtom(rtype)}}
    {{pre}}{{js}}.new_str((*{{value}}).clone());
    {{else}}
	{{if iq}}
    let ptr = {{value}} as *const {{rtype}} as usize;
    {{pre}}ptr_jstype({{js}}.get_objs_ref(), {{js}}.clone(), ptr,{{_strHashCode(rtype, 0)}});
	{{else}}
    let ptr = Box::into_raw(Box::new({{value}})) as usize;
    {{pre}}ptr_jstype({{js}}.get_objs(), {{js}}.clone(), ptr,{{_strHashCode(rtype, 0)}});
    {{end}}
    {{end}}
{{end}}


{{elseif _isArray(type.name)}}
{{if type.type.name === "u8"}}
	{{if iq}}	
    let {{value}}_jstype = {{js}}.new_uint8_array({{value}}.len() as u32);
    {{value}}_jstype.from_bytes({{value}});
    {{if pre}}
    {{pre}}{{value}}_jstype;
    {{end}}
	{{else}}
    let {{value}}_jstype = {{js}}.new_uint8_array({{value}}.len() as u32);
    {{value}}_jstype.from_bytes(&{{value}});
    {{if pre}}
    {{pre}}{{value}}_jstype;
    {{end}}
	{{end}}
{{else}}
	let mut {{value}}_array = {{js}}.new_array();
	for {{value}}_index in 0..{{value}}.len(){
		let mut {{value}}_elem = &{{value}}[{{value}}_index];
{{_parseJSTypeResultFun(value + "_elem", type.type, funType, struct, _r, true, _tree, true)}}
		{{js}}.set_index(&{{value}}_array, {{value}}_index as u32, &mut {{value}}_elem);
    }
    {{if hasp}}
    {{"    "}}{{pre}}{{value}}_array;
    {{end}}
{{end}}

{{elseif _isTuple(type.name)}}
	let array = {{js}}.new_array();
    {{for i, child of type.childs}}
    let mut {{value}}_elem = {{value}}.{{i}};
    {{_parseJSTypeResultFun(value + "_elem", child, funType, struct, _r, true, _tree)}}
	{{js}}.set_index(&array, {{i}}, &mut {{value}}_elem);
    {{end}}
    {{if hasp}}
    {{"    "}}{{pre}}array;
    {{end}}

{{elseif _isBigInt(type.name)}}
    {{pre}}{{js}}.new_str({{value}}.to_string()); 
{{end}}
`;
//同步方法模板
const fnCallTpl = `
{{%fn: Gendrust.DefFunc, path: 方法路劲, genTypeCfg：泛型配置%}}
{{let fn = it}}{{let _r = it1}}{{let path = it2}}{{let _tree = it3}}{{let _tps_has_nobj = it4}}{{let _vectoslice = it5}}
{{let struct = fn.structStr}}
{{let h = fn.hash}}
{{let genT = ""}}
{{let params = fn.params}}
{{if fn.genType}}
{{: genT =  _genTypeToString(fn.genType, _r, _tree)}}
{{end}}

fn call_{{h}}(js: Arc<JS>{{if params && params.length > 0}}, v:Vec<JSType>{{end}}) -> Option<CallResult>{
{{if params && params.length > 0}}
	let param_error = "param error in {{fn.fn.name}}";
{{for i, p of params}}

	let jst{{i}} = &v[{{i}}];
{{_parseJSTypeParamFun("jst" + i, p.type || p, "param_error", struct, _r, _tree)}}
{{end}}
{{end}}

{{let pt = 0}}
{{if fn.result}}
{{let rtypr = _typeToString(fn.result, false, struct)}}
    let result{{struct && struct.indexOf("<") > -1 && (fn.result.name === "Self" || fn.result.name === fn.structName)?(":"+struct):""}} = {{path?path+"::":""}}{{fn.fn.name}}{{genT}}({{for i, p of params}}{{if i > 0}},{{end}}jst{{i}}{{:pt++}}{{end}}{{if fn.hasJs}}{{pt?",":""}}&js{{end}});
	{{_parseJSTypeResultFun("result", fn.result, path, struct, _r, false, _tree)}}
{{else}}

	{{"    "}}{{path?path +"::":""}}{{fn.fn.name}}{{genT}}(
	{{for i, p of params}}{{if i > 0}},{{end}}jst{{i}}{{:pt++}}
	{{end}}{{if fn.hasJs}}{{pt?",":""}}&js{{end}});
{{end}}
    Some(CallResult::Ok)
}
`;
//异步方法模板
const fnAsyncCallTpl = `
{{%fn: Gendrust.DefFunc, path: 方法路劲, genTypeCfg：泛型配置%}}
{{let fn = it}}{{let _r = it1}}{{let path = it2}}{{let h = it3}}{{let _tree = it4}}{{let _tps_has_nobj = it5}}{{let _vectoslice = it6}}
{{let struct = fn.structStr}}
{{let genT = ""}}
{{let params = fn.params}}
{{:params = params.slice(0, params.length - 1)}} {{%因为是异步方法，最后一个参数改为u64类型%}}

{{if fn.genType}}
{{: genT = _genTypeToString(fn.genType, _r, _tree)}}
{{end}}
fn call_{{h}}_async( js: Arc<JS>{{if params.length > 0}}, v:Vec<JSType>{{end}}) -> Option<CallResult>{

{{let j = 0;}}
{{if params && params.length > 0}}
    let param_error = "param error in {{fn.fn.name}}";
{{for i, p of params}}
    {{: j++}}
	let jst{{i}} = &v[{{i}}];
{{_parseJSTypeParamFun("jst" + i, p.type || p, "param_error", struct, _r, _tree)}}
{{end}}
{{end}}
    let call_index = &v[{{j}}];
    if !call_index.is_number(){ return Some(CallResult::Err(String::from(param_error)));}
    let call_index = call_index.get_u32();
    
    let jscopy = js.clone();
    {{if fn.callBackPT}}
	let call_back = move |r: {{_typeToString(fn.callBackPT, true, struct, _r, true, _tree)}}| {
		push_callback(jscopy.clone(), call_index, Box::new(move |js: Arc<JS>| {
            {{_parseJSTypeResultFun("r", fn.callBackPT, "async", struct, _r, "jscopy", _tree)}}
            1
        } ), Atom::from("call_{{h}}_async1"));
    };
    {{else}}
    let call_back = move || {
		push_callback(jscopy.clone(), call_index, Box::new(move |js: Arc<JS>| {0}), Atom::from("call_{{h}}_async2"));
    };
    {{end}}
{{let call_back = _enref(fn.callBack,"call_back", _r, struct)}}

{{let i = 0}}
{{if fn.result }}
{{let rtypr = _typeToString(fn.result, false, struct)}}
    let result{{struct && struct.indexOf("<") > -1 && (fn.result.name === "Self" || fn.result.name === fn.structName)?(":"+struct):""}} = {{path?path+"::":""}}{{fn.fn.name}}{{genT}}({{for i, p of params}}{{if i > 0}},{{end}}jst{{i}}{{end}}{{if params.length > 0}},{{end}} {{call_back}}{{if fn.hasJs}},&js{{end}});
	{{_parseJSTypeResultFun("result", fn.result, path, struct, _r, false, _tree)}}
{{else}}

	{{"    "}}{{path?path +"::":""}}{{fn.fn.name}}{{genT}}(
	{{for i, p of params}}{{if i > 0}},{{end}}jst{{i}}
	{{end}}{{if params.length > 0}},{{end}} {{call_back}}{{if fn.hasJs}},&js{{end}});
{{end}}
	Some(CallResult::Ok)
}
`;
//阻塞方法模板
const fnSyncCallTpl = `
{{%fn: Gendrust.DefFunc, path: 方法路劲, genTypeCfg：泛型配置%}}
{{let fn = it}}{{let _r = it1}}{{let path = it2}}{{let h = it3}}{{let _tree = it4}}{{let _tps_has_nobj = it5}}{{let _vectoslice = it6}}
{{let struct = fn.structStr}}
{{let genT = ""}}
{{let params = fn.params}}
{{:params = params.slice(0, params.length - 1)}} {{%因为是异步方法，应该去掉最后一个参数（最后一个参数是回调函数）%}}

{{if fn.genType}}
{{: genT = _genTypeToString(fn.genType, _r, _tree)}}
{{end}}
fn call_{{h}}_sync( js: Arc<JS>{{if params.length > 0}}, v:Vec<JSType>{{end}}) -> Option<CallResult>{

{{if params && params.length > 0}}
	let param_error = "param error in {{fn.fn.name}}";
{{for i, p of params}}

	let jst{{i}} = &v[{{i}}];
{{_parseJSTypeParamFun("jst" + i, p.type || p, "param_error", struct, _r, _tree)}}
{{end}}
{{end}}
    let jscopy = js.clone();
    {{if fn.callBackPT}}
	let call_back = move |r: {{_typeToString(fn.callBackPT, true, struct, _r, true, _tree)}}| {
        {{_parseJSTypeResultFun("r", fn.callBackPT, "sync," + h, struct, _r, "jscopy", _tree, null, "jscopy")}}
    };
    {{else}}
    let call_back = move || {
		block_reply(jscopy.clone(), Box::new(move |js: Arc<JS>| {js.new_null();}), Atom::from("call_{{h}}_sync"));
    };
    {{end}}
{{let call_back = _enref(fn.callBack,"call_back", _r, struct)}}

{{let i = 0}}
{{if fn.result}}
	{{"    let r = "}}{{path?path +"::":""}}{{fn.fn.name}}{{genT}}(
	{{for i, p of params}}{{if i > 0}},{{end}}jst{{i}}
    {{end}}{{if params.length > 0}},{{end}} {{call_back}}{{if fn.hasJs}},&js{{end}});
	if r.is_some(){
        let r = r.unwrap();
        {{_parseJSTypeResultFun("r", fn.callBackPT, "", struct, _r, false, _tree)}}
        return Some(CallResult::Ok);
    }
{{else}}
	{{"    "}}{{path?path +"::":""}}{{fn.fn.name}}{{genT}}(
	{{for i, p of params}}{{if i > 0}},{{end}}jst{{i}}
	{{end}}{{if params.length > 0}},{{end}} {{call_back}}{{if fn.hasJs}},&js{{end}});
{{end}}
	None
}
`;
const dropTpl = `{{let _h = it}}{{let _name = it1}}
fn drop_{{_h}}(ptr: usize){
    unsafe { Box::from_raw(ptr as *mut {{_name}}) };
}
`;
exports.toFunc = (s) => {
    try {
        return (new Function("_stringify", "_isNumber", "_isStr", "_isBool", "_isArray", "_isTuple", "_isNativeObject", "_strHashCode", "_typeToString", "_mut", "_quote", "_parseJSTypeParamFun", "_parseJSTypeResultFun", "_genTypeToString", "_enref", "_deref", "_has_nobj", "_isBigInt", "_isEnumC", "_isAtom", "return " + s))(tpl_1.toString, Gendrust.isNumber, Gendrust.isStr, Gendrust.isBool, Gendrust.isArray, Gendrust.isTuple, Gendrust.isNativeObject, hash.strHashCode, Gendrust.typeToString, Gendrust.mut, Gendrust.quote, parseJSTypeParamFun, parseJSTypeResultFun, Gendrust.genTypeToString, Gendrust.enref, Gendrust.deref, has_nobj, Gendrust.isBigInt, Gendrust.isEnumC, Gendrust.isAtom);
    }
    catch (e) {
        //warn(level, "tpl toFun, path: "+", s: ", s, e);
        throw (e);
    }
};
let tplFunc = {
    fnCallTpl: exports.toFunc(tpl_1.compile(fnCallTpl, tpl_str_1.Parser)),
    fnAsyncCallTpl: exports.toFunc(tpl_1.compile(fnAsyncCallTpl, tpl_str_1.Parser)),
    fnSyncCallTpl: exports.toFunc(tpl_1.compile(fnSyncCallTpl, tpl_str_1.Parser)),
    fnBodyTpl: exports.toFunc(tpl_1.compile(fnBodyTpl, tpl_str_1.Parser)),
    //registFnTpl:toFunc(compile(registFnTpl, TplParser)),
    implDerefTpl: exports.toFunc(tpl_1.compile(implDerefTpl, tpl_str_1.Parser)),
    registObjTpl: exports.toFunc(tpl_1.compile(registObjTpl, tpl_str_1.Parser)),
    parseJSTypePrama: exports.toFunc(tpl_1.compile(parseJSTypePrama, tpl_str_1.Parser)),
    parseJSTypeResult: exports.toFunc(tpl_1.compile(parseJSTypeResult, tpl_str_1.Parser)),
    dropTpl: exports.toFunc(tpl_1.compile(dropTpl, tpl_str_1.Parser)),
};
});
