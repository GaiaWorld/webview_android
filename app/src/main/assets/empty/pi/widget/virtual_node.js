_$define("pi/widget/virtual_node", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util/util");
const painter = require("./painter");
/**
 * @description 转换类型获得VirtualNode
 * @example
 */
exports.isVirtualNode = (node) => {
    if (node.children) {
        return node;
    }
};
/**
 * @description 转换类型获得VirtualNode
 * @example
 */
exports.isVirtualWidgetNode = (node) => {
    if (node.hasChild !== undefined || node.child !== undefined) {
        return node;
    }
};
/**
 * @description 转换类型获得VirtualNode
 * @example
 */
exports.isVirtualTextNode = (node) => {
    if (node.text !== undefined) {
        return node;
    }
};
/**
 * @description 获得指定属性的值
 * @example
 */
exports.getAttribute = (attrs, name) => {
    return attrs[name];
};
/**
 * @description 寻找满足指定属性的第一个节点，递归调用，遍历vdom树。value为undefined，有属性就可以
 * @example
 */
exports.findNodeByAttr = (node, key, value) => {
    const arr = node.children;
    for (let n of arr) {
        if (n.children) {
            const r = exports.getAttribute(n.attrs, key);
            if (value !== undefined) {
                if (value === r) {
                    return n;
                }
            }
            else if (r !== undefined) {
                return n;
            }
            n = exports.findNodeByAttr(n, key, value);
            if (n) {
                return n;
            }
        }
        else if (exports.isVirtualWidgetNode(n)) {
            const r = exports.getAttribute(n.attrs, key);
            if (value !== undefined) {
                if (value === r) {
                    return n;
                }
            }
            else if (r !== undefined) {
                return n;
            }
        }
    }
};
/**
 * @description 寻找满足指定Tag的第一个节点，递归调用，遍历vdom树
 * @example
 */
exports.findNodeByTag = (node, tag) => {
    const arr = node.children;
    for (let n of arr) {
        if (node.children) {
            if (n.tagName === tag) {
                return n;
            }
            n = exports.findNodeByTag(n, tag);
            if (n) {
                return n;
            }
        }
        else if (exports.isVirtualWidgetNode(n)) {
            if (n.tagName === tag) {
                return n;
            }
        }
    }
};
/**
 * @description 用新节点创建
 * @example
 */
exports.create = (n) => {
    if (exports.isVirtualWidgetNode(n)) {
        painter.createWidget(n);
    }
    else if (n.children) {
        createNode(n);
    }
    else if (n.text) {
        painter.createTextNode(n);
    }
};
/**
 * @description 用新节点替换旧节点
 * replace的前提是，已经判断这是同一个节点了，替换后对旧节点做标记，
 * @example
 */
exports.replace = (oldNode, newNode) => {
    let b;
    if (oldNode.text !== undefined && oldNode.text !== null && newNode.text !== undefined && newNode.text !== null) {
        newNode.link = oldNode.link;
        newNode.oldOffset = oldNode.offset;
        oldNode.offset = -1;
        if (oldNode.text === newNode.text) {
            return false;
        }
        painter.modifyText(newNode, newNode.text, oldNode.text);
        return true;
    }
    painter.replaceNode(oldNode, newNode);
    newNode.oldOffset = oldNode.offset;
    oldNode.offset = -1;
    b = replaceAttr(oldNode, newNode);
    if (oldNode.childHash !== newNode.childHash || painter.forceReplace) {
        if (oldNode.children && newNode.children) {
            replaceChilds(oldNode, newNode);
        }
        else if (exports.isVirtualWidgetNode(oldNode) && exports.isVirtualWidgetNode(newNode)) {
            painter.modifyWidget(oldNode, newNode.child, oldNode.child);
        }
        b = true;
    }
    else if (oldNode.children && newNode.children) {
        // 将oldNode上的子节点及索引移动到新节点上
        newNode.didMap = oldNode.didMap;
        newNode.childHashMap = oldNode.childHashMap;
        newNode.textHashMap = oldNode.textHashMap;
        newNode.children = oldNode.children;
        for (const n of newNode.children) {
            n.parent = newNode;
        }
    }
    return b;
};
// ============================== 本地
/**
 * @description 替换属性，计算和旧节点属性的差异
 * @example
 */
const replaceAttr = (oldNode, newNode) => {
    const oldArr = oldNode.attrs;
    if (oldNode.attrHash === newNode.attrHash && !painter.forceReplace) {
        return false;
    }
    if (newNode.attrSize && !newNode.ext) {
        newNode.ext = {};
    }
    util_1.objDiff(newNode.attrs, newNode.attrSize, oldArr, oldNode.attrSize, attrDiff, newNode);
    return true;
};
/**
 * @description 替换属性，计算和旧节点属性的差异
 * @example
 */
const attrDiff = (newNode, key, v1, v2) => {
    if (v1 === undefined) {
        return painter.delAttr(newNode, key);
    }
    if (v2 === undefined) {
        return painter.addAttr(newNode, key, v1);
    }
    painter.modifyAttr(newNode, key, v1, v2);
};
/**
 * @description 在数组中寻找相同节点
 * @example
 */
const findSameHashNode = (arr, node) => {
    if (!arr) {
        return;
    }
    for (let n, i = 0, len = arr.length; i < len; i++) {
        n = arr[i];
        if (n.offset >= 0 && n.tagName === node.tagName && n.sid === node.sid && n.attrHash === node.attrHash) {
            return n;
        }
    }
};
/**
 * @description 在数组中寻找相似节点
 * @example
 */
const findLikeHashNode = (arr, node) => {
    if (!arr) {
        return;
    }
    for (let n, i = 0, len = arr.length; i < len; i++) {
        n = arr[i];
        if (n.offset >= 0 && n.tagName === node.tagName && n.sid === node.sid) {
            return n;
        }
    }
};
/**
 * @description 寻找相同节点的函数
 * VirtualNode根据 did attrHash childHash 寻找相同节点，如果没有找到，则返回undefined
 * @example
 */
const findSameVirtualNode = (oldParent, newParent, child) => {
    let n;
    if (child.did && oldParent.didMap) {
        n = oldParent.didMap.get(child.did);
        if (n && n.offset >= 0 && n.tagName === child.tagName && n.sid === child.sid) {
            return n;
        }
    }
    else if (oldParent.childHashMap) {
        return findSameHashNode(oldParent.childHashMap.get(child.childHash), child);
    }
};
/**
 * @description 寻找相似节点的函数
 * VirtualNode根据 childHash attrHash offset 依次寻找相似节点，如果没有找到，则返回undefined
 * @example
 */
const findLikeVirtualNode = (oldParent, newParent, child, offset) => {
    if (!oldParent.childHashMap) {
        return;
    }
    let n;
    const arr = oldParent.childHashMap.get(child.childHash);
    n = findLikeHashNode(arr, child);
    if (n) {
        return n;
    }
    n = oldParent.children[offset];
    if (n && n.childHash !== undefined && n.offset >= 0 && child.tagName === n.tagName && child.sid === n.sid) {
        return n;
    }
};
/**
 * @description 寻找相同文本节点的函数
 * VirtualNode根据 textHash依次寻找相同节点，如果没有找到，则返回undefined
 * @example
 */
const findSameVirtualTextNode = (oldParent, newParent, child) => {
    const arr = oldParent.textHashMap && oldParent.textHashMap.get(child.childHash);
    if (arr && arr.length > 0) {
        return arr.shift();
    }
};
/**
 * @description 寻找相似文本节点的函数
 * VirtualNode根据 offset 寻找相似节点，如果没有找到，则返回undefined
 * @example
 */
// tslint:disable:max-line-length
const findLikeVirtualTextNode = (oldParent, newParent, child, offset) => {
    const n = oldParent.children[offset];
    if (n && n.text && n.offset >= 0) {
        return n;
    }
};
/**
 * @description 初始化子节点，并在父节点上添加索引
 * @example
 */
const initAndMakeIndex = (n, i, parent) => {
    let map;
    let nodes;
    n.parent = parent;
    n.offset = i;
    n.widget = parent.widget;
    if (n.did) {
        if (!parent.didMap) {
            parent.didMap = new Map();
        }
        parent.didMap.set(n.did, n);
    }
    else {
        map = parent.childHashMap;
        if (!map) {
            parent.childHashMap = map = new Map();
        }
        nodes = map.get(n.childHash) || [];
        nodes.push(n);
        map.set(n.childHash, nodes);
        nodes = map.get(n.attrHash) || [];
        nodes.push(n);
        map.set(n.attrHash, nodes);
    }
};
/**
 * @description 文本索引
 * @example
 */
const makeTextIndex = (n, i, parent) => {
    n.parent = parent;
    n.offset = i;
    let map = parent.textHashMap;
    if (!map) {
        parent.textHashMap = map = new Map();
    }
    const nodes = map.get(n.childHash) || [];
    nodes.push(n);
    map.set(n.childHash, nodes);
};
/**
 * @description 用新节点创建
 * @example
 */
const createNode = (node) => {
    const arr = node.children;
    painter.createNode(node);
    const parent = node.link;
    for (let n, i = 0, len = arr.length; i < len; i++) {
        n = arr[i];
        if (exports.isVirtualWidgetNode(n)) {
            initAndMakeIndex(n, i, node);
            painter.createWidget(n);
        }
        else if (n.children) {
            initAndMakeIndex(n, i, node);
            createNode(n);
        }
        else {
            makeTextIndex(n, i, node);
            painter.createTextNode(n);
        }
        painter.addNode(parent, n, true);
    }
};
/**
 * @description 子节点替换方法，不应该使用编辑距离算法
 * 依次处理所有删除的和一般修改的节点。最后处理位置变动和新增的，如果位置变动超过1个，则清空重新添加节点
 * @example
 */
// tslint:disable-next-line:cyclomatic-complexity
const replaceChilds = (oldNode, newNode) => {
    let n;
    let same;
    let arr = newNode.children;
    const len = arr.length;
    let next = false;
    let insert = false;
    let move = 0;
    for (let i = 0, offset = 0; i < len; i++) {
        n = arr[i];
        if (n.tagName !== undefined) {
            initAndMakeIndex(n, i, newNode);
            // 在旧节点寻找相同节点
            same = findSameVirtualNode(oldNode, newNode, n);
        }
        else {
            makeTextIndex(n, i, newNode);
            // 在旧节点寻找相同节点
            same = findSameVirtualTextNode(oldNode, newNode, n);
        }
        if (!same) {
            offset++;
            // 猜测用最新的位置差能够找到变动的节点
            n.oldOffset = -offset;
            next = true;
            continue;
        }
        // 记录最新相同节点的位置差
        offset = same.offset + 1;
        exports.replace(same, n);
        // 计算有无次序变动
        if (move >= 0) {
            move = (move <= offset) ? offset : -1;
        }
    }
    if (next) {
        move = 0;
        // 寻找相似节点
        for (let i = 0; i < len; i++) {
            n = arr[i];
            if (n.oldOffset >= 0) {
                // 计算有无次序变动
                if (move >= 0) {
                    move = (move <= n.oldOffset) ? n.oldOffset : -1;
                }
                continue;
            }
            if (n.tagName !== undefined) {
                same = findLikeVirtualNode(oldNode, newNode, n, -n.oldOffset - 1);
            }
            else {
                same = findLikeVirtualTextNode(oldNode, newNode, n, -n.oldOffset - 1);
            }
            if (!same) {
                exports.create(n);
                insert = true;
                continue;
            }
            exports.replace(same, n);
            // 计算有无次序变动
            if (move >= 0) {
                move = (move <= n.oldOffset) ? n.oldOffset : -1;
            }
        }
    }
    // 删除没有使用的元素
    arr = oldNode.children;
    for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i].offset >= 0) {
            painter.delNode(arr[i]);
        }
    }
    arr = newNode.children;
    const parent = newNode.link;
    // 如果有节点次序变动，则直接在新节点上加入新子节点数组，代码更简单，性能更好
    if (move < 0) {
        // painter.paintCmd3(parent, "innerHTML", ""); //不需要清空，重新加一次，一样保证次序
        for (let i = 0; i < len; i++) {
            painter.addNode(parent, arr[i]);
        }
    }
    else if (insert) {
        // 如果没有节点次序变动，则插入节点
        for (let i = 0; i < len; i++) {
            n = arr[i];
            if (n.oldOffset < 0) {
                painter.insertNode(parent, n, n.offset);
            }
        }
    }
};
// ============================== 立即执行
});
