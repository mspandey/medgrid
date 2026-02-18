const XLSX = require('xlsx');
const path = require('path');

const file = '../hospitals_expanded.xls';
const workbook = XLSX.readFile(path.join(__dirname, file));
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const headers = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0];
console.log(JSON.stringify(headers, null, 2));
