_$define("pi/math/astar", function (require, exports, module){
"use strict";
/**
 * 通用的A*搜索算法
 */
Object.defineProperty(exports, "__esModule", { value: true });
// ============================== 导入
const heap_1 = require("../util/heap");
/**
 * A*寻路算法
 * @param paths 供内部填充，从start到end的最短路径
 * @param start 起点
 * @param end 终点
 * @param maxNodes 算法搜寻过程中产生的最大节点，超过该节点，算法终止，并返回到目前为止的最近路径
 * @return boolean 是否找到end节点
 */
exports.astar = (paths, start, end, maxNodes = 4096) => {
    // Open表，存即将计算的节点，每次取f最小值的节点
    const open = cache.open;
    // 总表，存所有的ANode节点
    const all = cache.all;
    const s = cache.get(start);
    open.insert(s); // 将开始点扔到open表
    all.set(start, s);
    let nearest = s; // 距离目标的最近点
    let distanceToEnd = nearest.h = nearest.src.h(end); // 距离目标的最近距离
    while (!open.empty()) {
        const curr = open.pop(); // 取最小的f的节点出来
        // 已经找到目标点，退出循环
        if (curr.src === end) {
            break;
        }
        // 如果当前点离终点更近，则记住当前点
        const distance = curr.h;
        if (distance < distanceToEnd) {
            distanceToEnd = distance;
            nearest = curr;
        }
        // 如果已找的点太多，则退出循环
        if (all.size >= maxNodes) {
            break;
        }
        curr.isClose = true;
        // 遍历邻居
        for (const n of curr.src) {
            const neighbor = n;
            let anode = all.get(neighbor);
            if (!anode) {
                anode = cache.get(neighbor, curr.g + neighbor.g(curr.src), neighbor.h(end), curr);
            }
            else {
                // 如果是原来就有，查看当前路径是否比原来的好
                const g = curr.g + neighbor.g(curr.src);
                const h = neighbor.h(end);
                if (anode.f <= g + h) {
                    continue;
                }
                if (!anode.isClose) {
                    open.remove(anode);
                }
                anode = cache.get(neighbor, g, h, curr);
            }
            open.insert(anode);
            all.set(neighbor, anode);
        }
    }
    // 如果找不到终点，那么就从离终点最近的点开始
    let n = all.get(end) || nearest;
    paths.length = 0;
    for (; n !== undefined; n = n.parent) {
        paths.push(n.src);
    }
    paths.reverse();
    cache.collate();
    return end !== nearest.src;
};
// ============================== 本地
/**
 * 接口：A*算法的节点
 */
class ANode {
    /* tslint:disable:no-reserved-keywords typedef no-unnecessary-initializer*/
    set(src, g = 0, h = 0, parent = undefined) {
        this.g = g;
        this.h = h;
        this.f = g + h;
        this.isClose = false;
        this.src = src;
        this.parent = parent;
    }
}
/**
 * Cache
 */
const cache = {
    unused: [],
    used: [],
    open: new heap_1.Heap((a, b) => a.f - b.f),
    all: new Map(),
    get(src, g = 0, h = 0, parent = undefined) {
        let r;
        /* tslint:disable:no-invalid-this */
        if (this.unused.length === 0) {
            r = new ANode();
        }
        else {
            r = this.unused.pop();
        }
        r.set(src, g, h, parent);
        this.used.push(r);
        return r;
    },
    collate(size = 500) {
        this.open.clear();
        this.all.clear();
        if (this.unused.length < this.used.length) {
            this.unused = this.used;
            this.used = [];
        }
        if (this.unused.length > size) {
            this.unused.length = size;
        }
    }
};
});
