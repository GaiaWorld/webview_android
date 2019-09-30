_$define("pi/render3d/babylon/gui_creator", function (require, exports, module){
"use strict";
// tslint:disable-next-line:no-reference
/// <reference path='./babylon.d.ts'/>
Object.defineProperty(exports, "__esModule", { value: true });
const root_1 = require("../../ui/root");
const gui_anim_controller_1 = require("./gui_anim_controller");
// tslint:disable-next-line:one-variable-per-declaration
let host, UICfgMap = new Map(), CustomizeControlMap = new Map(), PatchBabylonControlMap = new Map();
/**
 * 修复 BABYLON.GUI.Container 销毁子节点的 bug
 */
class Container extends BABYLON.GUI.Container {
    dispose() {
        for (let i = this.children.length; i >= 0; i--) {
            this.children[i].dispose();
        }
        this.children.length = 0;
        super.dispose();
    }
}
exports.Container = Container;
/**
 * GUI 构建方法类
 */
// tslint:disable-next-line:no-unnecessary-class
class GUICreator {
    /**
     * 初始化创建 全屏 UI 根节点
     * @param scene
     */
    static initUI(scene) {
        host = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI('root');
        gui_anim_controller_1.GUIAnimController.init();
        return host;
    }
    /**
     * 返回 UI 根节点
     */
    static getUIRoot() {
        return host;
    }
    /**
     * 切换 UI 显示与隐藏
     */
    static triggerUIVisible() {
        host.rootContainer.isVisible = !host.rootContainer.isVisible;
    }
    /**
     * 更改 UI 显示与隐藏
     * @param b
     */
    static setUIVisible(b) {
        host.rootContainer.isVisible = b;
    }
    /**
     * 设置 节点属性 - 多属性
     * @param control
     * @param cfg
     */
    static setControlAttrs(control, cfg) {
        for (const key in cfg) {
            if (cfg[key] !== undefined) {
                GUICreator.setControlAttr(control, key, cfg[key]);
            }
        }
    }
    /**
     * 设置 节点指定属性
     * @param control
     * @param key
     * @param value
     */
    static setControlAttr(control, key, value) {
        if (Attr1.indexOf(key) >= 0) {
            control[key] = value;
        }
        else if (AttrFunc[key] !== undefined) {
            AttrFunc[key](control, value);
        }
        else if (EventFunc[key] !== undefined) {
            EventFunc[key](control, value);
        }
    }
    /**
     * 创建 控件
     * @param cfg
     */
    static CreateControl(cfg) {
        let control;
        if (UIType1.indexOf(cfg.type) >= 0) {
            if (PatchBabylonControlMap.get(cfg.type) !== undefined) {
                control = PatchBabylonControlMap.get(cfg.type)();
            }
            else {
                control = new BABYLON.GUI[cfg.type]();
            }
            GUICreator.setControlAttrs(control, cfg);
        }
        else if (UIButtonCreate[cfg.type] !== undefined) {
            control = UIButtonCreate[cfg.type](cfg);
            // 原生按钮 边框为 1, 此处取消边框 
            control.thickness = 0;
            GUICreator.setControlAttrs(control, cfg);
        }
        else if (UIImageCreate[cfg.type] !== undefined) {
            control = UIImageCreate[cfg.type](cfg);
            GUICreator.setControlAttrs(control, cfg);
        }
        else if (CustomizeControlMap.get(cfg.type) !== undefined) {
            let customizeControl;
            customizeControl = CustomizeControlMap.get(cfg.type);
            control = customizeControl(cfg);
            GUICreator.setControlAttrs(control, cfg);
        }
        else {
            let registerCfg;
            if (cfg.w_tag !== undefined) {
                registerCfg = GUICreator.readComponentCfg(cfg.w_tag);
                if (registerCfg instanceof Function) {
                    control = registerCfg(cfg.it, cfg.it1);
                }
                else {
                    cfg = mergeJson(registerCfg, cfg);
                    if (cfg.type !== undefined) {
                        control = GUICreator.CreateControl(cfg);
                    }
                }
            }
        }
        return control;
    }
    /**
     * 创建 控件
     * @param cfg
     */
    // tslint:disable-next-line:max-func-body-length
    static CreateControlWithWidget(cfg, parentW) {
        let control;
        if (UIType1.indexOf(cfg.type) >= 0) {
            if (PatchBabylonControlMap.get(cfg.type) !== undefined) {
                control = PatchBabylonControlMap.get(cfg.type)();
            }
            else {
                control = new BABYLON.GUI[cfg.type]();
            }
            GUICreator.setControlAttrs(control, cfg);
            control.pi_widget = parentW;
        }
        else if (UIButtonCreate[cfg.type] !== undefined) {
            control = UIButtonCreate[cfg.type](cfg);
            // 原生按钮 边框为 1, 此处取消边框 
            control.thickness = 0;
            GUICreator.setControlAttrs(control, cfg);
            control.pi_widget = parentW;
        }
        else if (UIImageCreate[cfg.type] !== undefined) {
            control = UIImageCreate[cfg.type](cfg);
            GUICreator.setControlAttrs(control, cfg);
            control.pi_widget = parentW;
        }
        else if (CustomizeControlMap.get(cfg.type) !== undefined) {
            let customizeControl;
            customizeControl = CustomizeControlMap.get(cfg.type);
            control = customizeControl(cfg);
            GUICreator.setControlAttrs(control, cfg);
            control.pi_widget = parentW;
        }
        else {
            let registerCfg;
            let widget;
            if (cfg.w_tag !== undefined) {
                registerCfg = GUICreator.readComponentCfg(cfg.w_tag);
                // 复杂组件
                if (registerCfg instanceof Function) {
                    widget = root_1.create(cfg.w_tag, cfg.it);
                    // 非 widget 组件，为 GUI 组件
                    if (widget === undefined || widget.forelet === undefined) {
                        control = registerCfg(cfg.it, cfg.it1, parentW);
                        control.pi_widget = parentW;
                        // widget 组件
                    }
                    else {
                        if (widget.control === undefined) {
                            widget.createGUI();
                        }
                        control = widget.control;
                        if (control !== undefined) {
                            control.pi_widget = widget;
                        }
                        parentW.children.push(widget);
                    }
                }
                else {
                    cfg = mergeJson(registerCfg, cfg);
                    if (cfg.type !== undefined) {
                        control = GUICreator.CreateControl(cfg);
                    }
                    control.pi_widget = parentW;
                }
            }
        }
        // if (cfg) {
        //     control.onAfterDrawObservable.add(() => {
        //     });
        // }
        return control;
    }
    /**
     * 创建带有树结构的UI
     * @param cfg
     */
    static CreateControlWithTree(cfg) {
        let control;
        control = GUICreator.CreateControl(cfg);
        if (cfg.children !== undefined) {
            cfg.children.forEach(eleCfg => {
                let _control;
                _control = GUICreator.CreateControlWithTree(eleCfg);
                control.addControl(_control);
            });
        }
        return control;
    }
    /**
     * 创建带有树结构的UI
     * @param cfg
     */
    static CreateControlWithTreeWidget(cfg, widget) {
        let control;
        control = GUICreator.CreateControlWithWidget(cfg, widget);
        if (cfg.children !== undefined) {
            cfg.children.forEach(eleCfg => {
                let _control;
                _control = GUICreator.CreateControlWithTreeWidget(eleCfg, control.pi_widget);
                control.addControl(_control);
            });
        }
        return control;
    }
    static formatControlEvents(control, events) {
        // 
    }
    ;
    /**
     * 注册组件
     * @param name 组件名称
     * @param cfg (it:any, it1:any) => {} 的方法 或 { type, width } 的配置
     */
    static registerComponentCfg(name, cfg) {
        UICfgMap.set(name, cfg);
    }
    /**
     * 获取组件配置
     * @param name 组件名称
     */
    static readComponentCfg(name) {
        return UICfgMap.get(name);
    }
    /**
     * 注册自定义控件构造函数
     * @param name 控件名称
     * @param createFunc 控件创建方法 | 构造函数方法
     */
    static registerCustomizeControl(name, createFunc) {
        CustomizeControlMap.set(name, createFunc);
    }
    /**
     * 刷新容器内容 - 该容器内容为自定义界面内容
     * @param control 指定刷新该容器内容
     * @param createFunc 自定义界面内容创建方法
     */
    static refreshWithCreateFunc(control, createFunc, param) {
        const newChild = createFunc(param);
        GUICreator.clearChildren(control);
        control.addControl(newChild);
    }
    /**
     * 刷新容器内容 - 该容器内容为已注册的组件
     * @param control 指定刷新该容器内容
     * @param registerName 已注册的组件名称
     * @param it 组件数据
     * @param it1 组件数据
     */
    static refreshWithComponentName(control, registerName, it, it1) {
        const registerFunc = UICfgMap.get(registerName);
        GUICreator.clearChildren(control);
        if (registerFunc !== undefined) {
            const newChild = registerFunc(it, it1);
            control.addControl(newChild);
        }
    }
    /**
     * 刷新容器内容 - 该容器内容为自定义界面
     * @param control 指定刷新该容器内容
     * @param cfg 自定义好的界面配置
     */
    static refreshWithCfg(control, cfg) {
        const newChild = GUICreator.CreateControlWithTree(cfg);
        GUICreator.clearChildren(control);
        control.addControl(newChild);
    }
    /**
     * 销毁容器所有子组件
     * @param control 目标容器
     */
    static clearChildren(control) {
        for (let len = control.children.length - 1; len >= 0; len--) {
            // child.dispose();
            GUICreator.disposeWithTree(control.children[len]);
        }
    }
    static disposeWithTree(control) {
        const pi_widget = control.pi_widget;
        if (pi_widget && pi_widget.control === control) {
            pi_widget.destroy();
        }
        if (control.children !== undefined) {
            control.children.forEach(child => {
                GUICreator.disposeWithTree(child);
            });
            control.children.length = 0;
        }
        control.dispose();
    }
}
exports.GUICreator = GUICreator;
// const controlGrayCheck = (control: BABYLON.GUI.Control) => {
//     if ((<IPiWidgetControl>control).pi_isGray === true) {
//         control.contains.
//     }
// };
/**
 * 返回 合并两个对象属性 的新对象
 * @param srcObj
 * @param newObj
 */
const mergeJson = (srcObj, newObj) => {
    let res;
    res = {};
    for (const key in srcObj) {
        res[key] = srcObj[key];
    }
    if (newObj === undefined) {
        return res;
    }
    else {
        for (const key in newObj) {
            if (newObj[key] !== undefined) {
                res[key] = newObj[key];
            }
        }
        return res;
    }
};
/**
 * Control 属性设置
 * @param control
 * @param left
 */
const _formatHCenter = (control, left) => {
    control.left = Math.abs(left) > 1 ? left + 'px' : left;
};
/**
 * Control 属性设置
 * @param control
 * @param top
 */
const _formatVCenter = (control, top) => {
    control.top = Math.abs(top) > 1 ? top + 'px' : top;
};
/**
 * Control 属性设置
 * @param control
 * @param left
 */
const _formatLeft = (control, left) => {
    control.left = Math.abs(left) > 1 ? left + 'px' : left;
    control.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
};
/**
 * Control 属性设置
 * @param control
 * @param top
 */
const _formatTop = (control, top) => {
    control.top = Math.abs(top) > 1 ? top + 'px' : top;
    control.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
};
/**
 * Control 属性设置
 * @param control
 * @param right
 */
const _formatRight = (control, right) => {
    right = -right;
    control.left = Math.abs(right) > 1 ? right + 'px' : right;
    control.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
};
/**
 * Control 属性设置
 * @param control
 * @param bottom
 */
const _formatBottom = (control, bottom) => {
    bottom = -bottom;
    control.top = Math.abs(bottom) > 1 ? bottom + 'px' : bottom;
    control.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
};
/**
 * Control 属性设置
 * @param control
 * @param z
 */
const _formatZ = (control, z) => {
    control.zIndex = z;
};
/**
 * Control 属性设置
 * @param control
 * @param s
 */
const _formatScale = (control, s) => {
    control.scaleX = s;
    control.scaleY = s;
};
/**
 * Control 属性设置
 * @param control
 * @param r
 */
const _formatRotation = (control, r) => {
    control.rotation = r;
    control.rotation = r;
};
/**
 * Control 属性设置
 * @param control
 */
const _formatTextLeft = (control) => {
    control.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
};
/**
 * Control 属性设置
 * @param control
 */
const _formatTextTop = (control) => {
    control.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
};
/**
 * Control 属性设置
 * @param control
 */
const _formatTextRight = (control) => {
    control.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
};
/**
 * Control 属性设置
 * @param control
 */
const _formatTextBottom = (control) => {
    control.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
};
const _formatTextClip = (control) => {
    control.textWrapping = BABYLON.GUI.TextWrapping.Clip;
};
const _formatTextEllipsis = (control) => {
    control.textWrapping = BABYLON.GUI.TextWrapping.Ellipsis;
};
const _formatTextWrap = (control) => {
    control.textWrapping = BABYLON.GUI.TextWrapping.WordWrap;
};
/**
 * Control 属性设置
 * @param control
 * @param height
 */
const _formatHeight = (control, height) => {
    control.height = Math.abs(height) > 1 ? height + 'px' : height;
};
/**
 * Control 属性设置
 * @param control
 * @param width
 */
const _formatWidth = (control, width) => {
    control.width = Math.abs(width) > 1 ? width + 'px' : width;
};
/**
 * Control 属性设置
 * @param control
 * @param image
 */
const _formatImage = (control, image) => {
    control.source = image;
};
/**
 * Control 属性设置
 * @param control
 * @param value
 */
const _formatPaddingLeft = (control, value) => {
    control.paddingLeft = Math.abs(value) >= 1 ? value + 'px' : value;
};
/**
 * Control 属性设置
 * @param control
 * @param value
 */
const _formatPaddingTop = (control, value) => {
    control.paddingTop = Math.abs(value) >= 1 ? value + 'px' : value;
};
/**
 * Control 属性设置
 * @param control
 * @param value
 */
const _formatPaddingRight = (control, value) => {
    control.paddingRight = Math.abs(value) >= 1 ? value + 'px' : value;
};
/**
 * Control 属性设置
 * @param control
 * @param value
 */
const _formatPaddingBottom = (control, value) => {
    control.paddingBottom = Math.abs(value) >= 1 ? value + 'px' : value;
};
/**
 * Control 属性设置
 * @param control
 */
const _formatStretchExtend = (control) => {
    control.stretch = BABYLON.GUI.Image.STRETCH_EXTEND;
};
/**
 * Control 属性设置
 * @param control
 */
const _formatStretchFill = (control) => {
    control.stretch = BABYLON.GUI.Image.STRETCH_FILL;
};
/**
 * Control 属性设置
 * @param control
 */
const _formatStretchNone = (control) => {
    control.stretch = BABYLON.GUI.Image.STRETCH_NONE;
};
const _formatMaxWidth = (control, value) => {
    control.maxWidth = value > 1 ? `${value}px` : value;
};
/**
 * Control 属性设置
 * @param control
 */
const _formatStretchUniform = (control) => {
    control.stretch = BABYLON.GUI.Image.STRETCH_UNIFORM;
};
/**
 * Control 属性设置
 * @param control
 * @param f
 */
const _up = (control, f) => {
    control.onPointerUpObservable.add(f);
};
/**
 * Control 属性设置
 * @param control
 * @param f
 */
const _down = (control, f) => {
    control.onPointerDownObservable.add(f);
};
/**
 * Control 属性设置
 * @param control
 * @param f
 */
const _enter = (control, f) => {
    control.onPointerEnterObservable.add(f);
};
/**
 * Control 属性设置
 * @param control
 * @param f
 */
const _out = (control, f) => {
    control.onPointerOutObservable.add(f);
};
/**
 * Control 属性设置
 * @param control
 * @param f
 */
const _click = (control, f) => {
    control.onPointerClickObservable.add(f);
};
/**
 * Control 属性设置
 * @param control
 * @param f
 */
const _move = (control, f) => {
    control.onPointerMoveObservable.add(f);
};
/**
 * Control 属性设置
 * @param control
 * @param f
 */
const _textChanged = (control, f) => {
    control.onTextChangedObservable.add(f);
};
/**
 * Control 属性设置
 * @param control
 * @param f
 */
const _blur = (control, f) => {
    control.onBlurObservable.add(f);
};
/**
 * 控件类型
 */
// const UITypeEnum = {
//     Grid: 'Grid',
//     Container: 'Container',
//     StackPanel: 'StackPanel',
//     Image: 'Image',
//     TextBlock: 'TextBlock',
//     ImageButton: 'ImageButton',
//     SimpleButton: 'SimpleButton',
//     ImageOnlyButton: 'ImageOnlyButton',
//     ImageWithCenterTextButton: 'ImageWithCenterTextButton',
// }
/**
 * 简单控件
 */
const UIType1 = ['TextBlock', 'Container', 'StackPanel', 'Rectangle', 'InputText', 'InputPassword', 'Grid', 'Line'];
/**
 * 图片控件
 */
const UIType2 = ['Image'];
/**
 * 按钮控件
 * _image           图片
 * _textBlock       文本
 *
 * ImageButton      左 20% Image, 右 80% TextBlock
 * SimpleButton:    文本居中
 * ImageOnlyButton: 图片充满
 * ImageWithCenterTextButton: 图片充满 & 文本居中
 */
const UITypeButton = ['ImageButton', 'SimpleButton', 'ImageOnlyButton', 'ImageWithCenterTextButton'];
/**
 * 图片控件创建方法
 */
const UIImageCreate = {
    [UIType2[0]]: (cfg) => {
        return new BABYLON.GUI.Image(cfg.name);
    }
};
/**
 * Button控件创建方法
 */
const UIButtonCreate = {
    [UITypeButton[0]]: (cfg) => {
        return BABYLON.GUI.Button.CreateImageButton(cfg.name, cfg.text, cfg.image);
    },
    [UITypeButton[1]]: (cfg) => {
        return BABYLON.GUI.Button.CreateSimpleButton(cfg.name, cfg.text);
    },
    [UITypeButton[2]]: (cfg) => {
        return BABYLON.GUI.Button.CreateImageOnlyButton(cfg.name, cfg.image);
    },
    [UITypeButton[3]]: (cfg) => {
        return BABYLON.GUI.Button.CreateImageWithCenterTextButton(cfg.name, cfg.text, cfg.image);
    }
};
/**
 * 控件属性
 */
/**
 * Control 属性名 相同，可直接赋值(无单位类型的影响)
 *
 * alpha:       不透明度
 * background:  背景颜色
 * color:       文本颜色，容器背景颜色, 边框颜色
 * text:        文本内容
 * fontSize:    文本尺寸
 */
const Attr1 = ['alpha', 'background',
    'zIndex', 'scaleX', 'scaleY', 'rotation',
    // 元素状态
    'isVertical', 'isVisible', 'isEnabled',
    // 元素对齐
    'horizontalAlignment', 'verticalAlignment',
    // 元素阴影
    'shadowBlur', 'shadowColor', 'shadowOffsetX', 'shadowOffsetY',
    // 容器裁剪
    'clipChildren',
    'margin',
    // 文本属性
    'color', 'text', 'fontSize', 'fontFamily', 'fontWeight',
    'lineSpacing', 'outlineColor', 'outlineWidth',
    // 调整以充满容器，类似文本行充满
    'resizeToFit',
    // 文本对齐设置 - 推荐 使用 Attr5 中属性名
    'textHorizontalAlignment', 'textVerticalAlignment',
    // 图片裁剪显示
    'cellId', 'cellHeight', 'cellWidth',
    // 图片控件大小自适应图片资源大小 
    'autoScale',
    // 图片资源截取显示的设置
    'sourceLeft', 'sourceTop', 'sourceWidth', 'sourceHeight',
    // Input 控件
    'placeholderText', 'placeholderColor', 'disabledColor',
    'focusedBackground',
    // line
    'x1', 'x2', 'y1', 'y2',
    'dash', 'lineWidth'
];
/**
 * Control 属性有多种处理
 *
 * left:    相对父节点 左边缘定位
 * top:     相对父节点 上边缘定位
 * right:   相对父节点 右边缘定位
 * bottom:  相对父节点 下边缘定位
 * hCenter: 相对父节点 水平方向中部定位
 * vCenter: 相对父节点 垂直方向中部定位
 */
const Attr2 = ['left', 'top', 'right', 'bottom', 'hCenter', 'vCenter'];
/**
 * Control 属性有多种单位
 *
 * 属性值 >  1, 视为 px    单位
 * 属性值 <= 1, 视为 百分比 单位
 * 属性值 =  0, 俩种单位无影响，所以视为 百分比单位
 */
const Attr3 = ['width', 'height', 'maxWidth'];
/**
 * Control 属性名有差异
 *
 * H5 中 图片路径属性 相对 Babylon 设置资源路径有所差异
 */
const Attr4 = ['image', 'src', 'z-index', 'z', 'rotate'];
/**
 * Control 属性名简写
 *
 */
const Attr5 = [
    // 文本对齐， 不设置 则分别有 重置居中，水平居中
    'txtLeft', 'txtTop', 'txtRight', 'txtBottom',
    // 文本换行
    'txtClip', 'txtEllipsis', 'txtWrap'
];
/**
 * Control 属性名共用
 */
const Attr6 = ['scale'];
/**
 * Control 属性有多种单位
 * 属性值 >=  1, 视为 px    单位
 * 属性值 < 1, 视为 百分比 单位
 * 属性值 =  0, 俩种单位无影响，所以视为 百分比单位
 */
const Attr7 = ['paddingLeft', 'paddingTop', 'paddingRight', 'paddingBottom'];
/**
 * Image 填充模式
 */
const Attr8 = ['stretch_extend', 'stretch_fill', 'stretch_none', 'stretch_uniform'];
/**
 * 特殊属性设置方法集合
 */
const AttrFunc = {
    [Attr2[0]]: _formatLeft,
    [Attr2[1]]: _formatTop,
    [Attr2[2]]: _formatRight,
    [Attr2[3]]: _formatBottom,
    [Attr2[4]]: _formatHCenter,
    [Attr2[5]]: _formatVCenter,
    [Attr3[0]]: _formatWidth,
    [Attr3[1]]: _formatHeight,
    [Attr3[2]]: _formatMaxWidth,
    [Attr4[0]]: _formatImage,
    [Attr4[1]]: _formatImage,
    [Attr4[2]]: _formatZ,
    [Attr4[3]]: _formatZ,
    [Attr4[4]]: _formatRotation,
    [Attr5[0]]: _formatTextLeft,
    [Attr5[1]]: _formatTextTop,
    [Attr5[2]]: _formatTextRight,
    [Attr5[3]]: _formatTextBottom,
    [Attr5[4]]: _formatTextClip,
    [Attr5[5]]: _formatTextEllipsis,
    [Attr5[6]]: _formatTextWrap,
    [Attr6[0]]: _formatScale,
    [Attr7[0]]: _formatPaddingLeft,
    [Attr7[1]]: _formatPaddingTop,
    [Attr7[2]]: _formatPaddingRight,
    [Attr7[3]]: _formatPaddingBottom,
    [Attr8[0]]: _formatStretchExtend,
    [Attr8[1]]: _formatStretchFill,
    [Attr8[2]]: _formatStretchNone,
    [Attr8[3]]: _formatStretchUniform
};
/**
 * event
 */
const EventTypeList = ['up', 'down', 'enter', 'out', 'move', 'click', 'textChanged', 'blur'];
/**
 * Event 绑定处理
 */
const EventFunc = {
    [EventTypeList[0]]: _up,
    [EventTypeList[1]]: _down,
    [EventTypeList[2]]: _enter,
    [EventTypeList[3]]: _out,
    [EventTypeList[4]]: _move,
    [EventTypeList[5]]: _click,
    [EventTypeList[6]]: _textChanged,
    [EventTypeList[7]]: _blur
};
const patchBabylonControls = () => {
    // PatchBabylonControlMap.set(
    //     'Container',
    //     (name?: string) => {
    //         return new Container(name);
    //     }
    // );
    const old = BABYLON.GUI.Container.prototype.dispose;
    BABYLON.GUI.Container.prototype.dispose = function () {
        for (let i = this.children.length - 1; i >= 0; i--) {
            this.children[i].dispose();
        }
        this.children.length = 0;
        old.call(this);
    };
};
patchBabylonControls();
});
