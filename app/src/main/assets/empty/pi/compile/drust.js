_$define("pi/compile/drust", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 将rust的数据结构定义，转换成指定语言的数据结构定义
 * https://kaisery.gitbooks.io/rust-book-chinese/content/content/Syntax%20Index%20%E8%AF%AD%E6%B3%95%E7%B4%A2%E5%BC%95.html
 */
// ============================== 导入
const reader_1 = require("./reader");
const parser_1 = require("./parser");
const scanner_1 = require("./scanner");
const gendrust_1 = require("./gendrust");
class Compiler {
    constructor() {
        this.scanner = new scanner_1.Scanner(); // 词法解析器
        this.parser = new parser_1.Parser; // 语法解析器
        this.scanner.setRule(exports.lex, "0");
        this.scanner.setRule(block, "1");
        this.scanner.setRule(basket, "2");
        this.scanner.setRule(group, "3");
        this.scanner.setRule(gent, "4");
        this.scanner.setRule(con, "5");
        this.scanner.setRule(modName, "6");
        this.parser.setRule(syntax, exports.cfgs);
    }
    reset(s) {
        let reader = reader_1.createByStr(s);
        this.scanner.initReader(reader);
        this.parser.initScanner(this.scanner);
    }
    compileMod(s) {
        this.scanner = new scanner_1.Scanner(); // 词法解析器
        this.parser = new parser_1.Parser; // 语法解析器
        this.parser.setRule(syntax, exports.cfgs);
        this.scanner.setRule(exports.lex, "0");
        this.scanner.setRule(block, "1");
        this.scanner.setRule(basket, "2");
        this.scanner.setRule(group, "3");
        this.scanner.setRule(gent, "4");
        this.scanner.setRule(con, "5");
        this.scanner.setRule(modName, "6");
        let reader = reader_1.createByStr(s);
        this.scanner.initReader(reader);
        this.parser.initScanner(this.scanner);
        let r = this.parser.parseRule("file");
        let x = gendrust_1.gen(r);
        return x;
    }
    compileType(s) {
        this.reset(s);
        this.scanner = new scanner_1.Scanner(); // 词法解析器
        this.parser = new parser_1.Parser; // 语法解析器
        this.parser.setRule(syntax, exports.cfgs);
        this.scanner.setRule(exports.lex, "0");
        let reader = reader_1.createByStr(s);
        this.scanner.initReader(reader);
        this.parser.initScanner(this.scanner);
        let r = this.parser.parseRule("type");
        let x = gendrust_1.gen(r);
        return x;
    }
}
exports.Compiler = Compiler;
// rust的词法规则
exports.lex = `
	testFun = "#[test]";
	testMod = "#[cfg(test)]";
	(* comment *)
	commentLinePre = "//!" , [{?notbreakline?}] ;
	commentLineSuf  = "//" , [{?notbreakline?}] ;
	commentBlockSuf = "/*" , [ { & !"*/"!, ?all? & } ], "*/" ;
	commentBlockPre = "/*!" , [ { & !"*/"!, ?all? & } ], "*/" ;
	annotatePre = "#![" , [{ &!"]"!, ?all?& }], "]";
	annotateSuf = "#[" , [{ &!"]"!, ?all?&  }], "]";

	lifetime = "'", |identifier, static| ;

	(* class keyword *)
	struct = & "struct", identifier &;
	enum = & "enum", identifier &;
    (* keyword *)
    dyn = & "dyn", identifier &;
	use = & "use", identifier &;
	as = & "as", identifier &;
	break = & "break", identifier &;
	const = & "const", identifier &;
	continue = & "continue", identifier &;
	crate = & "crate", identifier &;
	else = & "else", identifier &;
	extern = & "extern", identifier &;
	false = & "false", identifier &;
	fn = & "fn", identifier &;
	Fn = & "Fn", identifier &;
	FnMut = & "FnMut", identifier &;
	FnOnce = & "FnOnce", identifier &;
	FnBox = & "FnBox", identifier &;
	for = & "for", identifier &;
	if = & "if", identifier &;
	impl = & "impl", identifier &;
	in = & "in", identifier &;
	let = & "let", identifier &;
	loop = & "loop", identifier &;
	match = & "match", identifier &;
	mod = & "mod", identifier &;
	move = & "move", identifier &;
	mut = & "mut", identifier &;
	pub = & "pub", identifier &;
	ref = & "ref", identifier &;
	return = & "return", identifier &;
	Self = & "Self", identifier &;
	self = & "self", identifier &;
	static = & "static", identifier &;
	struct = & "struct", identifier &;
	trait = & "trait", identifier &;
	true = & "true", identifier &;
	type = & "type", identifier &;
	unsafe = & "unsafe", identifier &;
	use = & "use", identifier &;
	where = & "where", identifier &;
	while = & "while", identifier &;
	(* type keyword *)
	bool = & "bool", identifier &;
	String = & "String", identifier &;
	str =  & "str", identifier &;
	i8 =  & "i8", identifier &;
	i16 =  & "i16", identifier &;
	i32 =  & "i32", identifier &;
    i64 =  & "i64", identifier &;
    isize =  & "isize", identifier &;
    u8 =  & "u8", identifier &;
    u16 =  & "u16", identifier &;
	u32 =  & "u32", identifier &;
    u64 =  & "u64", identifier &;
    u128 =  & "u128", identifier &;
	usize =  & "usize", identifier &;
	f32 =  & "f32", identifier &;
	f64 =  & "f64", identifier &;
	default = & "default", identifier &;
	"?Sized" = "?Sized";
	"macro_rules!" = "macro_rules!";

	(* update operator *)
	".." = "..";
	(* enum operator *)
	"::" = "::";
	(* separator *)
	"," = ",";
	"." = ".";
	";" = ";";
	":" = ":";
	"{" = "{";
	"}" = "}";
	"(" = "(";
	")" = ")";
	"[" = "[";
	"]" = "]";
	(* other *)
	"?" = "?";
	"@" = "@";
	"->" = "->";
	"=>" = "=>";
	"#!" = "#!";
	"#" = "#";
	"$" = "$";

	(* compare operator *)
	"==" = "==";
	"!=" = "!=";
	"<=" = "<=";
	">=" = ">=";
	(* assignment operator *)
	"=" = "=";
	"+=" = "+=";
	"-=" = "-=";
	"*=" = "*=";
	"/=" = "/=";
	"%=" = "%=";
	"<<=" = "<<=";
	">>=" = ">>=";
	"&=" = "&=";
	"|=" = "|=";
	"^=" = "^=";
	(* arithmetic operator *)
	"**" = "**";
	"+" = "+";
	"-" = "-";
	"*" = "*";
	"/" = "/";
	"%" = "%";
	(* bool operator *)
	"&&" = "&&";
	"||" = "||";
	"!" = "!";
	(* bit operator *)
	"&" = "&";
	"|" = "|";
	"~" = "~";
	"^" = "^";
	"<<" = "<<";
	(* compare operator *)
	"<" = "<";
	">" = ">";
	(* unmatch *)
	">>" = ">>";

	(* normal *)
	char = "'", | ?whitespace?, ?visible? |, "'";
	(* normal *)
	identifier = |"_", ?alphabetic?| , [ { ? word ? } ] ;
	float = [integer], ".", { ? digit ? }, [floate] ;
	floate = "e", |"+", "-"|, { ? digit ? } ;
	integer16 = [ "-" ] , "0x" , { |? digit ?, 'A', 'B', 'C', 'D', 'E', 'F', 'a', 'b', 'c', 'd', 'e', 'f' | } ;
	integer = | "0", integer10 | ;
	integer10 = [ "-" ] , ? digit19 ? , [ { ? digit ? } ] ;
	string = '"', { | '\\"', & !'"'!, ?visible? & | }, '"' ;
	whitespace = {?whitespace?};

`;
// 宏的匹配状态（宏内容可以以“[”开始， 以“]”结束）, 函数体也会进入此状态
let block = `
	whitespace = {?whitespace?};
	"{" = "{";
	"}" = "}";
	content = {&!"{"!, !"}"!, ?all?&};
`;
// 宏的匹配状态（宏内容可以以“(”开始， 以“)”结束）
let basket = `
	whitespace = {?whitespace?};
	"(" = "(";
	")" = ")";
	content = {&!"("!, !")"!, ?all?&};
`;
// 宏的匹配状态（宏内容可以以“[”开始， 以“]”结束）
let group = `
	whitespace = {?whitespace?};
	"[" = "[";
	"]" = "]";
	content = {&!"["!, !"]"!, ?all?&};
`;
// 泛型状态（有些泛型规则不被理解，现在也不用关心）
let gent = `
	whitespace = {?whitespace?};
	"<" = "<";
	">" = ">";
	content = {&!"<"!, !">"!, ?all?&};
`;
// 静态常量定义状态（因为常量不导出，此状态意在匹配常量的结束，并不关心常量的定义规则）
let con = `
	whitespace = {?whitespace?};
	";" = ";";
	content = {&!";"!, ?all?&};
`;
// use 模块名， 支持名称中含有"."(ts中文件名可以含有.)
let modName = `
	whitespace = {?whitespace?};
	"::" = "::";
    modname = {&!"::"!, !";"!, !"{"!, !"}"!, ?all?&};
    "{" = "{";
    identifier = |"_", ?alphabetic?| , [ { ? word ? } ] ;
`;
// rust的语法规则
let syntax = `
    identifierd = |"identifier", "default", "struct", "enum", "use", "as", "break", "const", "continue", "crate", "else", "extern", "false", "fn", "Fn", "FnMut", "FnOnce", "for", "if", "in", "let", "loop", "match", "mod", "move", "mut", "pub", "ref", "Self", "self", "static", "trait", "true", "type", "unsafe", "where", "while", "bool", "String", "str", "i8", "i16", "i32", "i64", "u16", "u64", "u128", "isize", "usize", "f32", "f64", "str","FnBox", "dyn"|;
    
    declarCreat = "extern"#?, "crate"#?, identifierd, ["as"#?, identifierd#?],";"#?;
    declarMod = ["pub"]#?, "mod"#?, identifierd, ";"#?;

	importOne = ["pub"]#?, "use"#?6,"modname"#back, [{"::"#?6, "modname"#back}], ["::","*"], ["as", identifierd], [";"#?];
	importMany = ["pub"]#?, "use"#?6,["modname"#back,[{"::"#?6, "modname"#back}], "::"#?], importCs, [";"#?];
    importCs = "{"#?,[|importAs, identifierd|], [{","#?, |importAs, identifierd|}], "}"#?;
    importAs = identifierd, "as"#?, identifierd;
	mod = ["pub"], "mod", identifierd, "{"#?, file, "}"#?;
	extern = "extern", "string", body;

	ptrType = "*"#?, |"mut", "const"|, type;
	defAssocType = "type"#?, identifierd, [":", type], ";"#?;
	type = |"!", fnType, fnTrait, igenType, importType, baseType, tupleBody, arrBody, ptrType|;
	genType = "<"#?, ["dyn"]#?, |assocValue#?, genAndTrait, traitLimit, typeDesc, "lifetime"#?|, [{","#?, |assocValue#?, genAndTrait, traitLimit, typeDesc, "lifetime"#?|}], ">"#?;
    traitLimit = |fnTrait, igenType, importType, "?Sized"#?, "lifetime"#?|, [{"+"#?, |fnTrait, igenType, importType, "?Sized"#?, "lifetime"#?|}];
	genAndTrait = typeDesc, ":"#?, traitLimit;
	where = "where"#?, genAndTrait, [{","#?, genAndTrait}], [","#?];
	assocValue = identifierd, "="#?, typeDesc;

	igenType = importType, genType;
	(* struct, enum, trait *)
	genIdentifier = "<"#4, ["content"], [{genIdentifier, ["content"]}], ">"#back;
	importType = |identifierd, genIdentifier#?|, [{"::"#?, identifierd}];
	tupleBody = "("#?, [typeDesc, [{","#?, typeDesc}]], ")"#?;
	arrBody = "["#?, typeDesc, [";"#?, "integer"], "]"#?;
	baseType = |"bool", "str", "char", "i8", "i16", "i32", "i64", "u8", "u16", "u32", "u64", "u128" , "isize", "usize", "f32", "f64", "String"|;
	newType = ["pub"], "type"#?, identifierd, [genType], "="#?, typeDesc, ";"#?;

    defConst1 = ["pub"], "const"#5, "content", ";"#?back;
    defConst = ["pub"]#?, "const"#?, identifierd, ":"#?, typeDesc, "="#?, |"string", "integer", "float", "integer10", "integer16", "floate", "true", "false"|, ";"#?back;
	bracket = ?expr?, ")"#?;

	defStructTuple = ["pub"], "struct"#?, identifierd, [genType], [where], tupleBody, ";"#?;
	defStructEmpty = ["pub"], "struct"#?, identifierd, |@"{"#?, "}"#?@, ";"#?|;

	defStruct = ["pub"], "struct"#?, identifierd, [genType], [where], dataBody;
	dataBody = "{"#?, [{keyType, ","#?}], [keyType], "}"#?;

	enumMember = |@identifierd, tupleBody@, @identifierd, dataBody@, identifierd|, ","#?;
	enumMemberc = identifierd, ["="#?, |"string","integer", "float", "integer10", "integer16", "floate"|], ","#?;
	defEnumC = ["pub"], "enum"#?, identifierd, "{"#?, [{enumMemberc}], "}"#?;
	defEnum = ["pub"], "enum"#?, identifierd, [genType], [where], "{"#?, [{enumMember}], "}"#?;

	defTriat = ["pub"], ["unsafe"]#?, "trait"#?, identifierd, [genType], [":"#?, traitLimit#?]#?, [where], "{"#?, [{defAssocType#?}], funcs, "}"#?;
	macro = |macroName1, macroName2|, |body, macroBody1, macroBody2|; 
	macroName1 = "macro_rules!", identifierd;
	macroName2 = identifierd, "!";
	macroBody1 = "("#?2, ["content"], [{macroBody1, ["content"]}], ")"#?back, [";"]#?;
	macroBody2 = "["#?3, ["content"], [{macroBody2, ["content"]}], "]"#?back, [";"]#?;

	defFn = ["pub"], ["default"]#?, ["extern"#?, "string"]#?, ["unsafe"], "fn"#?, identifierd, [genType], func, [where], |body#?, ";"#?|;
	fnTrait = |"Fn", "FnMut", "FnOnce", "FnBox"|, func;
	fnType = "fn"#?, func;
	func = fnParam, [fnReturn];
	fnParam = "("#?, [|keyType, selfPronoun|], [|keyType, typeDesc|], [{","#?, |keyType, typeDesc|}], [","#?]#?, ")"#?;
	fnReturn = "->"#?, typeDesc;

	impl = ["unsafe"]#?, "impl"#?, [genType], type, [where], "{"#?, funcs, "}"#?;
	implTrait = ["unsafe"]#?, "impl"#?, [genType], ["!"]#?, type, "for"#?, typeDesc, [where], "{"#?, [{newType}]#?, funcs, "}"#?;

	body = "{"#?1, ["content"], [{body, ["content"]}], "}"#?back;
	funcs = [{|defFn, testError#?|}];
	keyType = ["pub"]#?, ["ref"]#?, ["mut"], identifierd, ":"#?, typeDesc;
	typeDesc = ["pub"], ["&"], ["lifetime"#?], ["mut"], type;
	selfPronoun = ["&"], ["mut"], "self"#?;

	(* 一个错误的test匹配，当出现测试代码时，直接跳出匹配 *)
	testError = |"testFun", "testMod"|, |defFn, importOne, importMany, mod, macro|#?;

	file = {|defTriat, defStruct, defEnumC, defEnum, defStructEmpty, defStructTuple, importMany, importOne, impl, defFn, implTrait, newType, declarCreat, declarMod, macro#?, defConst, defConst1#?, testError#?, mod#?, extern#?|};
`;
// rust的算符优先级及绑定函数
exports.cfgs = [
    // 表达式结束符
    { type: ",", rbp: -1 },
    { type: ";", rbp: -1 },
    { type: ")", rbp: -1 },
    { type: "]", rbp: -1 },
    { type: "}", rbp: -1 },
    // 最低优先级运算符
    { type: "string" },
    // 赋值运算符
    { type: "=", lbp: 10, rbp: 9 },
    { type: "+=", lbp: 10, rbp: 9 },
    { type: "-=", lbp: 10, rbp: 9 },
    { type: "*=", lbp: 10, rbp: 9 },
    { type: "/=", lbp: 10, rbp: 9 },
    { type: "%=", lbp: 10, rbp: 9 },
    { type: "<<=", lbp: 10, rbp: 9 },
    { type: ">>=", lbp: 10, rbp: 9 },
    { type: ">>>=", lbp: 10, rbp: 9 },
    { type: "&=", lbp: 10, rbp: 9 },
    { type: "|=", lbp: 10, rbp: 9 },
    { type: "^=", lbp: 10, rbp: 9 },
    // 关系运算符
    { type: "||", lbp: 30, rbp: 29 },
    { type: "&&", lbp: 32, rbp: 31 },
    { type: "|", lbp: 35 },
    { type: "^", lbp: 36 },
    { type: "&", lbp: 37 },
    // 布尔运算符
    { type: "===", lbp: 40 },
    { type: "!==", lbp: 40 },
    { type: "==", lbp: 40 },
    { type: "!=", lbp: 40 },
    { type: "<=", lbp: 45 },
    { type: ">=", lbp: 45 },
    { type: "<", lbp: 45 },
    { type: ">", lbp: 45 },
    // 按位移动符
    { type: "<<", lbp: 50 },
    { type: ">>", lbp: 50 },
    { type: ">>>", lbp: 50 },
    // 算数运算符
    { type: "+", lbp: 60 },
    { type: "-", lbp: 60 },
    { type: "*", lbp: 70 },
    { type: "/", lbp: 70 },
    { type: "%", lbp: 70 },
    { type: "**", lbp: 70 },
    // 前缀运算符
    { type: "!", rbp: 80 },
    { type: "~", rbp: 80 },
    { type: "+", rbp: 80 },
    { type: "-", rbp: 80 },
    // 算数表达式
    { type: "(", lbp: 1000, nud: "bracket" },
    // statement 语句
    //{ type: "struct", nud: "struct, structTuple, structEmpty" },
    //{ type: "enum", nud: "enum" },
    // 忽略空白
    { type: "whitespace", ignore: true },
    // 注释
    { type: "commentBlockPre", note: -1 },
    { type: "commentBlockSuf", note: 1 },
    { type: "commentLinePre", note: -1 },
    { type: "commentLineSuf", note: 1 },
    //注解
    { type: "annotatePre", note: -1 },
    { type: "annotateSuf", note: 1 },
];
// ============================== 立即执行的代码
// scanner.setRule(lex);
// parser.setRule(syntax, cfgs);
// setSuffixTpl("", `
// 	{{if it.comments}}{{for i, v of it.comments}}{{ v.value }}{{end}}{{end}}
// 	{{if it.type === 'struct'}}
// 	{{let arr = it.childs}}
// 	{{let clazz = arr[0].value }}
// 	export class {{ clazz }} {{if arr[1].childs.length > 0 }} <{{ arr[1].childs[0].value }}>{{end}} {
// 		{{: arr = arr.slice(2)}}
// 		{{for i, v of arr}}
// 		{{if v.comments}}{{for i, vv of v.comments}}{{ vv.value }}{{end}}{{end}}
// 		{{let name = v.childs[1].value}}
// 		{{let type = v.childs[3].childs[0]}}
// 		{{let t = type.type}}
// 		{{if t==='identifier'}}
// 		{{ name }}: {{ type.value }} = null;
// 		{{elseif t==='bool'}}
// 		{{ name }}: boolean = false;
// 		{{elseif t==='f32' || t==='f64'}}
// 		{{ name }}: number = 0.0;
// 		{{else}}
// 		{{ name }}: number = 0;
// 		{{end}}
// 		{{end}}
// 		// 克隆
// 		copy() : {{ clazz }} -> {
// 			return new {{ clazz }}().copy(this);
// 		}
// 		// 拷贝
// 		copy(dst: {{ clazz }}) : {{ clazz }} -> {
// 		}
// 		// 从ArrayBuffer上序列化域
// 		decode(bs:BufferStream) -> {
// 		{{for i, v of arr}}
// 			{{let name = v.childs[1].value}}
// 			{{let type = v.childs[3].childs[0]}}
// 			{{let t = type.type}}
// 			{{if t==='identifier'}}
// 			if(bs.getU8()) {
// 				this.{{ name }} = new {{ type.value }};
// 				this.{{ name }}.decode(bs);
// 			}
// 			{{else}}
// 			this.{{ name }} = bs.get{{ t.charAt(0).toUpperCase() }}{{ t.slice(1) }}();
// 			{{end}}
// 		{{end}}
// 		}
// 		// 将域序列化到ArrayBuffer上
// 		encode(bs:BufferStream) -> {
// 		{{for i, v of arr}}
// 			{{let name = v.childs[1].value}}
// 			{{let type = v.childs[3].childs[0]}}
// 			{{let t = type.type}}
// 			{{if t==='identifier'}}
// 			if({{ name }}) {
// 				bs.setU8(1);
// 				this.{{ name }}.encode(bs);
// 			}else
// 				bs.setU8(0);
// 			{{else}}
// 			bs.set{{ t.charAt(0).toUpperCase() }}{{ t.slice(1) }}(this.{{ name }});
// 			{{end}}
// 		{{end}}
// 		}
// 	}
// 	{{end}}
// `);
});
