_$define("pi/ui/imgfilter", function (require, exports, module){
"use strict";
/*
 * 图像滤镜
 * 支持多种滤镜，可以连续滤镜处理，包括 灰度-色相饱和度亮度-亮度对比度-腐蚀-锐化-高斯模糊
 * props = {"img":"./1.png", "path":"{{_path}}", arr":[["gray"], ["hsl", 180?, 1?, 1?],
 * ["brightnessContrast", 0.5, 0?], ["corrode", 3?], ["sharp", 3?], ["gaussBlur", 3?]]}
 * 如果arr不存在或长度为0, 表示使用标准图像
 */
Object.defineProperty(exports, "__esModule", { value: true });
// ============================== 导入
const mod_1 = require("../lang/mod");
const canvas_1 = require("../util/canvas");
const res_mgr_1 = require("../util/res_mgr");
const widget_1 = require("../widget/widget");
// ============================== 导出
/**
 * @description 导出组件Widget类
 * @example
 */
class ImgFilter extends widget_1.Widget {
    /**
     * @description 设置属性，默认外部传入的props是完整的props，重载可改变行为
     * @example
     */
    setProps(props, oldProps) {
        this.props = props;
        if (!(props.arr && props.arr.length)) {
            this.props.url = props.file || (props.img ? mod_1.butil.relativePath(props.img, props.path) : '');
            return;
        }
        const key = canvas_1.getImgFilterKey(props);
        let tab = this.resTab;
        if (!tab) {
            this.resTab = tab = new res_mgr_1.ResTab();
        }
        const res = tab.get(key);
        if (res) {
            props.url = res.link;
        }
        else {
            tab.load(key, canvas_1.RES_TYPE_IMGFILTER, props, tab, (res) => {
                props.url = res.link;
                this.paint();
            });
        }
    }
}
exports.ImgFilter = ImgFilter;
// ============================== 本地
// ============================== 立即执行
});
