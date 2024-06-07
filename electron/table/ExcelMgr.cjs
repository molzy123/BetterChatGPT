const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs-extra');
const crypto = require('crypto');
const ExcelUtil = require("./ExcelUtil.cjs");

module.exports = {
    excelList: [],
    async init() {
        var files = await ExcelUtil.getExcelFiles("E:/work_space/zhenyulin_FCM_Dev_Next/shared-S4-global/excel");
        for (let file of files) {
            var excel = XLSX.readFile(file.filePath);
            this.excelList.push({ filePath: file.filePath, sheets: excel.SheetNames });
        }
    },
    searchSheet(sheetName) {
        var result = []
        for (let excel of this.excelList) {
            for (let sheet of excel.sheets) {
                // 判断sheetName是否包含在sheet.sheetName中
                if (sheet.toLowerCase().includes(sheetName.toLowerCase())) {
                    result.push({ filePath: excel.filePath, sheetName: sheet });
                    break;
                }
            }
        }
        return result;
    }
}