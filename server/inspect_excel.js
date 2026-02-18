const XLSX = require('xlsx');
const path = require('path');

const files = ['../hospitals_expanded.xls', '../doctors_expanded.xls'];

files.forEach(file => {
    try {
        const workbook = XLSX.readFile(path.join(__dirname, file));
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        console.log(`\n--- Headers for ${file} ---`);
        console.log(data[0]);
        console.log('--- First Row of Data ---');
        console.log(data[1]);
    } catch (err) {
        console.error(`Error reading ${file}:`, err.message);
    }
});
