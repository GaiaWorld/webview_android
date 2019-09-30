_$define("pi/compile/ts", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * ts语法分析, 只处理注释, export方法， 其他语法暂不分析
 * https://kaisery.gitbooks.io/rust-book-chinese/content/content/Syntax%20Index%20%E8%AF%AD%E6%B3%95%E7%B4%A2%E5%BC%95.html
 */
// ============================== 导入
const reader_1 = require("./reader");
const parser_1 = require("./parser");
const scanner_1 = require("./scanner");
const tpl_1 = require("../util/tpl");
const tpl_str_1 = require("../util/tpl_str");
const util_1 = require("./util");
class Compiler {
    constructor() {
        this.scanner = new scanner_1.Scanner(); // 词法解析器
        this.parser = new parser_1.Parser; // 语法解析器
        this.scanner.setRule(lex, "0");
        this.scanner.setRule(block, "1");
        this.scanner.setRule(signore, "2");
        this.parser.setRule(syntax, cfgs);
    }
    reset(s) {
        let reader = reader_1.createByStr(s);
        this.scanner = new scanner_1.Scanner();
        this.scanner.setRule(lex, "0");
        this.scanner.setRule(block, "1");
        this.scanner.setRule(signore, "2");
        this.scanner.setRule(note, "3");
        this.scanner.initReader(reader);
        this.parser.initScanner(this.scanner);
    }
    compile(s) {
        this.reset(s);
        let r = this.parser.parseRule("file");
        return r;
    }
    compile_note(s) {
        this.reset(s);
        let r = this.parser.parseRule("note");
        return r;
    }
}
exports.Compiler = Compiler;
// ts的词法规则
let lex = `
	(* comment *)
	commentLineSuf  = "//" , [{?notbreakline?}] ;
    commentBlockSuf = "/**" , [ { & !"*/"!, ?all? & } ], "*/" ;

	const = "const";
	export = "export";
    let = "let";
    var = "var";
    class = "class";
    interface = "class";
    declare = "declare";
    import = "import";

	(* update operator *)
	(* enum operator *)
	(* separator *)
	"{" = "{";
	"}" = "}";
	"(" = "(";
	")" = ")";
	"[" = "[";
	"]" = "]";
    "=>" = "=>";
    ":" = ":";
    ";" = ";";
    "," = ",";
    "#" = "#";
    "." = ".";

	(* assignment operator *)
	"=" = "=";

	(* normal *)
	identifier = |"_", ?alphabetic?| , [ { ? word ? } ] ;
	whitespace = {?whitespace?};

`;
// 块的匹配状态, 函数体会进入此状态1
let block = `
	whitespace = {?whitespace?};
	"{" = "{";
	"}" = "}";
	content = {&!"{"!, !"}"!, ?all?&};
`;
// 语句忽略状态, 2
let signore = `
	";" = ";";
	"\n" = "\n";
    content = {&!";"!, !"\n"!, ?all?&};
    whitespace = {?whitespace?};
`;
// 注解状态,3
let note = `
    "#" = "#";
    "," = ",";
    "[" = "[";
    "]" = "]";
	"\n" = "\n";
    content = {& &!"]"!, !","!&, ?all?&};
    whitespace = {?whitespace?};
`;
// rust的语法规则
let syntax = `
    type = [{"identifier", "."}], "identifier", ["<", {"identifier"}, ">"], ["[", "]"];
    import = "import"#2, "content", |";"#back, "\n"#back|;
    sentence = ["export"], |"let", "const", "import"|, "identifier", "="#2, "content", |";"#back, "\n"#back|;
    declare = "declare", "var", "identifier", [":", "identifier"], [";"];
    struct = ["export"], |"class", "interface"|, "identifier"#1, block#back;
    func = ["export"], |"const", "let"|#?, "identifier", "=", arg, [":", type],  "=>", block;
    block = "{"#1, ["content"], [{block, ["content"]}], "}"#back, [";"#?];
    arg = "("#?, [{keyType, [","]#? }], ")"#?;
    keyType = "identifier", ":", type;

    file = {|func, struct#?, declare#?, sentence#?, import#?|};
    
    note = "#"#?3, "["#?, ["content"], [{","#?, "content"}], "]"#?;
`;
// rust的算符优先级及绑定函数
let cfgs = [
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
let genPath = (path, scrRoot) => {
    let srcs = scrRoot.split("\\");
    path = path.replace(scrRoot, "");
    let paths = path.split("\\");
    return paths.join("/");
};
exports.translate = (s, cfg, path, scrRoot) => {
    let compiler = new Compiler();
    let file = compiler.compile(s);
    let right = file.right;
    if (!right || right.length === 0) {
        return ["", ""];
    }
    let entrancePath = util_1.parsePath(path, cfg.entranceStruct); //定义结构体的路径
    let cfgPath = util_1.parsePath(path, cfg.cfgPath); //cfg类型的路径
    let entrances = [];
    let paths = [];
    let names = [];
    for (let i = 0; i < right.length; i++) {
        let obj = right[i];
        if (obj.type === "func" && obj.right[0].type === "export" && obj.sufNotes) {
            for (let j = 0; j < obj.sufNotes.length; j++) {
                if (obj.sufNotes[j].type === "commentLineSuf") {
                    let note = obj.sufNotes[j].value.replace("//", "");
                    let tree = compiler.compile_note(note);
                    let note1 = null;
                    if (tree && tree.right) {
                        note1 = tree.right[0];
                    }
                    if (!note1) {
                        continue;
                    }
                    let notes = note1.value.split(",");
                    let funName = obj.right[2].value;
                    let notesmap = [];
                    for (let i = 0; i < notes.length; i++) {
                        let ss = notes[i].split("=");
                        notesmap.push([ss[0].replace(/^\s+|\s+$/g, ""), ss[1] ? ss[1].replace(/^\s+|\s+$/g, "") : "true"]);
                    }
                    let p = genPath(path + "." + funName, scrRoot);
                    entrances.push({ path: p, notes: notesmap });
                    paths.push(p);
                    names.push(funName);
                }
            }
        }
    }
    return [tplFunc.entranceCfgTpl(null, cfgPath, entrances, entrancePath), tplFunc.pathTpl(null, paths, names)];
};
let pathTpl = `{{let paths = it}}{{let names = it1}}
{{for i, name of names}}
export const {{name}} = '{{paths[i]}}';
{{end}}
`;
let entranceCfgTpl = `{{let cfgPath = it}}{{let entrances = it1}}{{let entrancePath = it2}}` + '\nimport {cfgMgr} from "{{cfgPath}}";' + '\nimport {Entrance} from "{{entrancePath}}";' + `let _$c = (path, notes):Entrance => {return new Entrance(path, notes)};
let arr = [{{for i, v of entrances}}{{i > 0?",":""}}[{{i}}, _$c("{{v.path}}", new Map<string,string>({{JSON.stringify(v.notes)}}))]{{end}}] as any;
cfgMgr.update(Entrance._$info.name, new Map<number,any>(arr));
`;
entranceCfgTpl = entranceCfgTpl.replace(/^\t/mg, "");
/**
 * @description
 * @example
 */
const toFunc = (s) => {
    try {
        return (new Function("_stringify", "return " + s))(tpl_1.toString);
    }
    catch (e) {
        //warn(level, "tpl toFun, path: "+", s: ", s, e);
        throw (e);
    }
};
let tplFunc = {
    entranceCfgTpl: toFunc(tpl_1.compile(entranceCfgTpl, tpl_str_1.Parser)),
    pathTpl: toFunc(tpl_1.compile(pathTpl, tpl_str_1.Parser)),
};
});
