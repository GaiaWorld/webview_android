_$define("pi/xlsx/xlsx_decoder", function (require, exports, module){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tableInterval = 2;
/**
 * 解析xls（一个sheet表中可能含有多个表）
 */
exports.decode = (s, space) => {
    const sheet = initSheet(s);
    const tables = getTables(sheet, space || tableInterval);
    return [tables, sheet];
};
/**
 * 读表(每次读一行)
 */
exports.readTable = (sheet, table) => {
    const row = table.rowHand + table.start.row;
    let col = table.colHand + table.start.col;
    if (row > table.end.row) {
        return null;
    }
    const arr = [];
    let i = 0;
    while (col) {
        arr[i] = sheet.data.get(`${col}-${row}`);
        i++;
        col = exports.next(col, table.end.col);
    }
    table.rowHand++;
    return arr;
};
// 下一单元格
exports.nextCell = (curRow, curCol, endRow, endCol, startCol = 1) => {
    curCol = exports.next(curCol, endCol);
    if (!curCol) {
        curRow = exports.next(curRow, endRow);
        if (!curRow) {
            return null;
        }
        curCol = startCol;
    }
    return { row: curRow, col: curCol };
};
// 下一列或下一行
exports.next = (cur, end) => {
    const nextIndex = cur + 1;
    // 超出图表范围
    if (nextIndex > end) {
        return null;
    }
    else {
        return nextIndex;
    }
};
/**
 * 默认空两行和两列为表的边界
 */
const initSheet = (data) => {
    const sheet = { ref: null, merge: null, data: null };
    initSheetRef(data['!ref'], sheet);
    // sheet.data = data;
    // initSheetMerge(data["!merges"], sheet);
    initSheetData(data, sheet);
    return sheet;
};
const initSheetData = (data, sheet) => {
    sheet.data = new Map();
    for (const k in data) {
        if (k.indexOf('!') < 0) {
            const cell = getCell(k);
            // tslint:disable:prefer-template
            sheet.data.set(cell.col + '-' + cell.row, data[k]);
        }
    }
};
const initSheetMerge = (m, sheet) => {
    if (m) {
        sheet.merge = new Map();
        for (let i = 0; i < m.length; i++) {
            const col = m[i].s.col + 1;
            const row = m[i].s.row + 1;
            sheet.merge.set(`${col}-${row}`, { start: { row: row, col: col }, end: { row: m[i].e.row + 1, col: m[i].e.col + 1 } });
        }
    }
};
/*
* @param "A1:CF200"
*/
const initSheetRef = (r, sheet) => {
    const ref = { start: null, end: null };
    if (r) {
        const arr = r.split(':');
        ref.start = getCell(arr[0]);
        ref.end = getCell(arr[1]);
        sheet.ref = ref;
    }
};
const getCell = (name) => {
    let i = 0;
    while (i < name.length) {
        if (name.charCodeAt(i) < 65) {
            return { col: colParseInt(name.slice(0, i)), row: +name.slice(i, name.length) };
        }
        i++;
    }
};
/**
 * 默认空两行和两列为表的边界
 */
const getTables = (sheet, space) => {
    // 空表
    if (!sheet.ref) {
        return null;
    }
    const tables = [];
    let cell = { row: 1, col: 1 };
    while (cell) {
        const table = findTable(sheet, cell.col, cell.row, tables);
        if (table) {
            tables.push(table);
            cell = exports.nextCell(table.start.row, table.end.col, sheet.ref.end.row, sheet.ref.end.col);
        }
        else {
            break;
        }
    }
    if (tables.length > 0) {
        return mergeTables(tables, sheet.ref.end.col, space);
    }
    else {
        return null;
    }
};
/**
 * 合并表
 */
const mergeTables = (tables, maxCol, space) => {
    const preScan = (curIndex, tables) => {
        for (let i = curIndex - 1; i >= 0; i--) {
            if (tables[i] && isSameTable(tables[curIndex], tables[i], maxCol, space)) {
                mergeTable(tables[i], tables[curIndex]);
                delete tables[i];
                preScan(curIndex, tables);
            }
        }
    };
    for (let i = 0; i < tables.length - 1; i++) {
        if (!tables[i]) {
            continue;
        }
        for (let j = i + 1; j < tables.length; j++) {
            if (tables[j] && isSameTable(tables[i], tables[j], maxCol, space)) {
                mergeTable(tables[i], tables[j]);
                delete tables[i];
                preScan(j, tables);
                break;
            }
        }
    }
    const t = [];
    for (let i = 0; i < tables.length; i++) {
        tables[i] && t.push(tables[i]);
    }
    return t;
};
const mergeTable = (table1, table2) => {
    table1.start.row < table2.start.row && (table2.start.row = table1.start.row);
    table1.start.col < table2.start.col && (table2.start.col = table1.start.col);
    table1.end.row > table2.end.row && (table2.end.row = table1.end.row);
    table1.end.col > table2.end.col && (table2.end.col = table1.end.col);
};
/**
 * 是否为同一个表（每个表格应该是一个矩形， 表格间的间距大于等于2个单元格， 一个表格不能出现在另一个表格内部）
 */
const isSameTable = (table1, table2, maxCol, space) => {
    const start1 = table1.start;
    const start2 = table2.start;
    const end1 = table1.end;
    const end2 = table2.end;
    if (start1.row - end2.row > space || start2.row - end1.row > space) {
        return false;
    }
    else if (start1.col - end2.col > space || start2.col - end1.col > space) {
        return false;
    }
    else {
        return true;
    }
};
/**
 * 找table
 */
const findTable = (sheet, startCol, startRow, tables) => {
    let cell = { row: startRow, col: startCol };
    while (true) {
        const start = findTableStart(sheet, cell.col, cell.row);
        if (start) {
            for (let i = 0; i < tables.length; i++) {
                const t = tables[i];
                if (start.row <= t.end.row && start.row >= t.start.row && start.col <= t.end.col && start.col >= t.start.col) {
                    cell = exports.nextCell(start.row, t.end.col, sheet.ref.end.row, sheet.ref.end.col);
                    continue;
                }
            }
            const end = findTableEnd(sheet, start.row, start.col);
            return { start: start, end: end, rowHand: 0, colHand: 0 };
        }
        else {
            return null;
        }
    }
};
/**
 * 找table开始
 */
const findTableStart = (sheet, startCol, startRow) => {
    while (startRow) {
        startCol = rowStart(sheet, startRow, startCol, sheet.ref.end.col);
        if (startCol) {
            return { row: startRow, col: startCol };
        }
        startRow = exports.next(startRow, sheet.ref.end.row);
        startCol = 1;
    }
    return null;
};
// 找table
const findTableEnd = (sheet, startRow, startCol) => {
    const endCol = rowEnd(sheet, startRow, startCol, sheet.ref.end.col);
    const endRow = colEnd(sheet, startCol, startRow, sheet.ref.end.row);
    return { row: endRow, col: endCol };
};
// 找某一行的结束 默认空两行为结束
const rowEnd = (sheet, row, startCol, endCol) => {
    let col = startCol;
    while (true) {
        const next1 = exports.next(col, endCol);
        if (!next1) {
            return col;
        }
        if (!sheet.data.get(`${next1}-${row}`)) {
            const next2 = exports.next(next1, endCol);
            if (!next2 || !sheet.data.get(`${next2}-${row}`)) {
                return col;
            }
            col = next2;
        }
        else {
            col = next1;
        }
    }
};
// 找某一行的结束 默认空两列为结束
const colEnd = (sheet, col, startRow, endRow) => {
    let row = startRow;
    while (true) {
        const next1 = exports.next(row, endRow);
        if (!next1) {
            return row;
        }
        if (!sheet.data.get(`${col}-${next1}`)) {
            const next2 = exports.next(next1, endRow);
            if (!next2 || !sheet.data.get(`${col}-${next2}`)) {
                return row;
            }
            row = next2;
        }
        else {
            row = next1;
        }
    }
};
// 找某一列的开始
const colStart = (sheet, col, startRow, endRow) => {
    let row = startRow;
    while (row) {
        if (sheet.data.get(`${col}-${row}`)) {
            return row;
        }
        row = exports.next(row, endRow);
    }
    return null;
};
// 找某一行的开始
const rowStart = (sheet, row, startCol, endCol) => {
    let col = startCol;
    while (col) {
        if (sheet.data.get(`${col}-${row}`)) {
            return col;
        }
        col = exports.next(col, endCol);
    }
    return null;
};
// 比较列的大小
const compareCol = (max, min) => {
    const value = '';
    const minLen = min.length;
    const maxLen = max.length;
    if (maxLen < minLen) {
        return -1;
    }
    else if (maxLen > minLen) {
        return 1;
    }
    for (let i = 0; i < min.length; i++) {
        if (max.charAt(i) < min.charAt(i)) {
            return -1;
        }
        else if (max.charAt(i) > min.charAt(i)) {
            return 1;
        }
    }
    return 0; // 相等
};
// 上一列
const preCol = (curCol, startCol) => {
    const arr = curCol.split('');
    let i = curCol.length - 1;
    let r;
    while (i >= 0) {
        const v = curCol.charCodeAt(i);
        if (v === 65) { // v = "A"
            arr[i] = 'Z';
            i--;
        }
        else {
            arr[i] = String.fromCharCode(v - 1);
            break;
        }
    }
    if (i === -1) {
        return null;
    }
    else {
        r = arr.join('');
    }
};
// 把列号转成z整数
const colParseInt = (str) => {
    let j = 0;
    let value = 0;
    for (let i = str.length - 1; i >= 0; i--) {
        const code = str.charCodeAt(i);
        value += (code - 64) * Math.pow(26, j);
        j++;
    }
    return value;
};
// 把列号转成字符串
const colParseStr = (n) => {
    let str = '';
    let i = 1;
    while (n > 0) {
        const sur = n % Math.pow(26, i);
        if (sur > 0) {
            str = String.fromCharCode(sur / Math.pow(26, i - 1) + 64) + str;
            n = n - sur;
        }
        else {
            str = 'Z' + str;
            n = n - Math.pow(26, i - 1);
        }
        i++;
    }
    return str;
};
});
