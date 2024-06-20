const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs-extra');
const crypto = require('crypto');
const { log } = require('console');
// 文件路径
// const filePath = path.join(__dirname, 'example.xlsx');

// 读取Excel文件
const workbook = XLSX.readFile("E:\\work_space\\zhenyulin_FCM_Dev_Next\\shared-S4-global\\excel\\PlayerExchange\\PlayerExchange_debug.xlsm");

// 获取第一个工作表
const firstSheetName = workbook.SheetNames[2];
const worksheet = workbook.Sheets[firstSheetName];

// 读取指定单元格（例如，第3行，第2列，注意索引从1开始）
const cellAddress = { c: 1, r: 2 }; // 对应于B3
const cellRef = XLSX.utils.encode_cell(cellAddress);
const cell = worksheet[cellRef];
module.exports = {
    test() {
        // 输出单元格内容
        console.log('指定单元格内容:', cell ? cell.v : '空单元格');
    },
    async getExcelFiles(dir) {
        let filesList = [];
        const fileAndDirs = await fs.readdir(dir);
        for (let fileOrDir of fileAndDirs) {
            const fileOrDirPath = path.join(dir, fileOrDir);
            const statItem = await fs.stat(fileOrDirPath);
            if (statItem.isDirectory()) {
                filesList.push(...await this.getExcelFiles(fileOrDirPath));
            } else if (fileOrDirPath.endsWith('.xlsm') || fileOrDirPath.endsWith('.xlsx')) {
                filesList.push({ filePath: fileOrDirPath });
            }
        }
        return filesList;
    },
    // 读取Excel文件中的所有Sheet
    getSheetNames(filePath) {
        const workbook = XLSX.readFile(filePath);
        return workbook.SheetNames;
    },
    // 读取Excel文件中指定Sheet的所有单元格数据
    getSheetData(filePath) {
        const workbook = XLSX.readFile(filePath);
        const firstSheetName = workbook.SheetNames[2];
        const worksheet = workbook.Sheets[firstSheetName];
        const csv = XLSX.utils.sheet_to_csv(worksheet);
        var table = Array();
        csv.split('\n').forEach(row => {
            table.push(row.split(','));
        });
        var firstElement = table[0][0];
        return XLSX.utils.sheet_to_json(worksheet);
    }

}


