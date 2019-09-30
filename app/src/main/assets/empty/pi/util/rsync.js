_$define("pi/util/rsync", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*!
* 数据同步,可以计算数据的差异，并根据差异和原有数据构建出新的数据
* 算法原理参考http://blog.csdn.net/russell_tao/article/details/7240661
*/
const Hash = require("./hash");
const md5_1 = require("./md5");
class RSync {
    constructor(blockSize) {
        this.size = blockSize || 64;
    }
    //计算校验和
    checksum(data) {
        let length = data.length, incr = this.size, start = 0, end = incr > length ? length : incr, blockIndex = 0;
        let results = [], result;
        while (start < length) {
            var chunk = data.slice(start, end), weak = Hash.weak32(chunk).sum, strong = md5_1.str_md5(chunk);
            result = { weak: weak, strong: strong, index: blockIndex };
            results.push(result);
            start += incr;
            end = (end + incr) > length ? length : end + incr;
            blockIndex++;
        }
        return results;
    }
    //计算差异
    diff(newData, oldChecksums) {
        let results = [], length = newData.length, start = 0, end = this.size > length ? length : this.size, lastMatchedEnd = 0, prevRollingWeak = null;
        const hashtable = createHashtable(oldChecksums);
        let weak, weak16, match;
        for (; end <= length;) {
            weak = Hash.weak32(newData, prevRollingWeak, start, end);
            weak16 = Hash.weak16(weak.sum);
            let checkSums = hashtable.get(weak16);
            if (checkSums) {
                for (let i = 0; i < checkSums.length; i++) {
                    if (checkSums[i].weak === weak.sum) {
                        const mightMatch = checkSums[i], chunk = newData.slice(start, end), strong = md5_1.str_md5(chunk);
                        if (mightMatch.strong === strong) {
                            match = mightMatch;
                            break;
                        }
                    }
                }
            }
            if (match) {
                let d;
                if (start > lastMatchedEnd) {
                    d = newData.slice(lastMatchedEnd, start);
                }
                results.push({ index: match.index, data: d });
                start = end;
                lastMatchedEnd = end;
                end += this.size;
                prevRollingWeak = null;
            }
            else {
                start++;
                end++;
                prevRollingWeak = weak;
            }
        }
        if (lastMatchedEnd < length) {
            results.push({
                data: newData.slice(lastMatchedEnd, length)
            });
        }
        return results;
    }
    //同步数据
    sync(oldData, diffs) {
        if (typeof oldData === 'undefined') {
            throw new Error("must do checksum() first");
        }
        let len = diffs.length, synced = new Uint8Array(0);
        for (let i = 0; i < len; i++) {
            let chunk = diffs[i];
            if (typeof chunk.data === 'undefined') { //use slice of original file
                synced = concatU8(synced, rawslice(oldData, chunk.index, this.size));
            }
            else {
                synced = concatU8(synced, chunk.data);
                if (typeof chunk.index !== 'undefined') {
                    synced = concatU8(synced, rawslice(oldData, chunk.index, this.size));
                }
            }
        }
        return synced;
    }
}
exports.RSync = RSync;
//序列化差异数据
exports.encodeDiffs = (diffs, bb) => {
    let diff;
    for (let i = 0; i < diffs.length; i++) {
        diff = diffs[i];
        if (diff.data) {
            bb.writeBin(diff.data);
        }
        if (diff.index !== undefined) {
            bb.writeInt(diff.index);
        }
    }
};
//反序列化差异数据
exports.decodeDiffs = (bb) => {
    let arr = [];
    while (bb.head < bb.tail) {
        let r = bb.read();
        if (typeof r === 'number') {
            arr.push({ index: r });
        }
        else //if(ArrayBuffer.isView(r)){
         {
            arr.push({ data: r });
        }
    }
    return arr;
};
//以校验和的弱校验值为key，创建映射表
const createHashtable = (checksums) => {
    let map = new Map();
    for (let i = 0; i < checksums.length; i++) {
        var checksum = checksums[i], weak16 = Hash.weak16(checksum.weak);
        let cs = map.get(weak16);
        if (cs) {
            cs.push(checksum);
        }
        else {
            map.set(weak16, [checksum]);
        }
    }
    return map;
};
//合并Uint8Array
const concatU8 = (data1, data2) => {
    var len1 = data1.length;
    var len2 = data2.length;
    var u8 = new Uint8Array(len1 + len2);
    u8.set(data1, 0);
    u8.set(data2, len1);
    return u8;
};
const rawslice = (raw, index, chunkSize) => {
    var start = index * chunkSize, end = start + chunkSize > raw.length
        ? raw.length
        : start + chunkSize;
    return raw.slice(start, end);
};
});
