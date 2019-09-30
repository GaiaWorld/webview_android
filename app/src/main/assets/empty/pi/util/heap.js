_$define("pi/util/heap", function (require, exports, module){
"use strict";
/*
 * 小堆
 * 支持删除和更新
 */
Object.defineProperty(exports, "__esModule", { value: true });
// ============================== 导出
/**
 * 小堆
 */
class Heap {
    constructor(cmp) {
        this.array = []; // 堆的实际数组，用来表示完全二叉树
        this.cmp = cmp;
    }
    /**
     * 判空
     */
    empty() {
        return this.array.length === 0;
    }
    /**
     * 返回内部数组
     */
    getImpl() {
        return this.array;
    }
    /**
     * 插入元素
     */
    insert(value) {
        this.array.push(value);
        this.up(this.array.length - 1);
    }
    /**
     * 删除元素
     */
    remove(value) {
        const index = this.array.indexOf(value);
        if (index < 0)
            return;
        // 把最后的叶子赋值给index位置
        this.array[index] = this.array[this.array.length - 1];
        --this.array.length;
        this.down(index);
    }
    /**
     * 删除堆顶元素并返回
     */
    pop() {
        const r = this.array[0];
        this.array[0] = this.array[this.array.length - 1];
        --this.array.length;
        this.down(0);
        return r;
    }
    /**
     * 清空
     */
    clear() {
        this.array.length = 0;
    }
    /**
     * 下沉
     */
    down(index) {
        const arr = this.array;
        if (arr.length <= index)
            return;
        const element = arr[index];
        let curr = index;
        const child = index;
        let left = curr * 2 + 1;
        let right = left + 1;
        while (left < arr.length) {
            // 选择左右孩子的最小值作为比较
            let child = left;
            if (right < arr.length && this.cmp(arr[right], arr[left]) < 0) {
                child = right;
            }
            // 待选择的值比孩子大，则将孩子移到当前的槽
            if (this.cmp(element, arr[child]) <= 0) {
                break;
            }
            else {
                arr[curr] = arr[child];
                // 往下迭代
                curr = child;
                left = curr * 2 + 1;
                right = left + 1;
            }
        }
        arr[curr] = element;
    }
    /**
     * 上朔
     */
    up(index) {
        const arr = this.array;
        if (arr.length <= index)
            return;
        const element = arr[index];
        let curr = index;
        let parent = Math.floor((curr - 1) / 2);
        while (parent >= 0 && this.cmp(element, arr[parent]) < 0) {
            arr[curr] = arr[parent];
            // 往上迭代
            curr = parent;
            parent = Math.floor((curr - 1) / 2);
        }
        arr[curr] = element;
    }
}
exports.Heap = Heap;
});
