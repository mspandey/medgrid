const XLSX = require('xlsx');
const path = require('path');

const files = ['../hospitals_expanded.xls', '../doctors_expanded.xls'];

files.forEach(file => {
    try {
        console.log(`\n=== READING FILE: ${file} ===`);
        const workbook = XLSX.readFile(path.join(__dirname, file));
        const sheetName = workbook.SheetNames[0];
        console.log(`Sheet Name: ${sheetName}`);

        const sheet = workbook.Sheets[sheetName];
        // Get raw data as array of arrays to see structure
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        console.log('--- Row 1 (Potential Headers) ---');
        console.log(JSON.stringify(data[0], null, 2));

        console.log('--- Row 2 (Data Sample) ---');
        console.log(JSON.stringify(data[1], null, 2));

        console.log('--- Row 3 (Data Sample) ---');
        console.log(JSON.stringify(data[2], null, 2));

    } catch (err) {
        console.error(`Error reading ${file}:`, err.message);
    }
});
