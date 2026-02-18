const mongoose = require('mongoose');
const dotenv = require('dotenv');
const XLSX = require('xlsx');
const path = require('path');
const Hospital = require('./models/Hospital');

dotenv.config();

const clean = (text) => text ? text.toString().trim() : '';

const seedData = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected!');

        // 1. Read Hospitals
        console.log('Reading Hospitals Excel...');
        const hospWorkbook = XLSX.readFile(path.join(__dirname, '../hospitals_expanded.xls'));
        const hospSheet = hospWorkbook.Sheets[hospWorkbook.SheetNames[0]];
        const hospData = XLSX.utils.sheet_to_json(hospSheet);

        // 2. Read Doctors
        console.log('Reading Doctors Excel...');
        const docWorkbook = XLSX.readFile(path.join(__dirname, '../doctors_expanded.xls'));
        const docSheet = docWorkbook.Sheets[docWorkbook.SheetNames[0]];
        const docData = XLSX.utils.sheet_to_json(docSheet);

        console.log(`Found ${hospData.length} hospitals and ${docData.length} doctors.`);

        // 3. Clear existing data (optional, but good for clean slate)
        await Hospital.deleteMany({});
        console.log('Cleared existing hospitals.');

        // 4. Map and Insert
        const hospitalMap = new Map(); // Hospital_ID -> Hospital Document

        for (const row of hospData) {
            const hid = row['Hospital_ID'];
            const name = clean(row['Name']);
            const contact = clean(row['Contact']);
            const email = contact.includes('@') ? contact : `admin@${name.replace(/\s+/g, '').toLowerCase()}.com`;

            const totalICU = parseInt(row['ICU_Beds'] || 0);
            const totalGen = parseInt(row['General_Ward_Beds'] || 0);

            // Create Hospital Object
            const hospital = new Hospital({
                name: name,
                email: email,
                password: 'password123', // Default password
                location: clean(row['Address']) || 'Unknown Location',
                phone: clean(row['Contact']) || '000-000-0000',
                departments: {
                    icu: {
                        total: totalICU,
                        avail: Math.floor(Math.random() * (totalICU + 1)) // Random availability for demo
                    },
                    general: {
                        total: totalGen,
                        avail: Math.floor(Math.random() * (totalGen + 1))
                    },
                    nicu: { avail: 5, total: 10 } // Default
                },
                blood: {
                    'A+': parseInt(row['A+'] || 0),
                    'A-': parseInt(row['A-'] || 0),
                    'B+': parseInt(row['B+'] || 0),
                    'B-': parseInt(row['B-'] || 0),
                    'AB+': parseInt(row['AB+'] || 0),
                    'AB-': parseInt(row['AB-'] || 0),
                    'O+': parseInt(row['O+'] || 0),
                    'O-': parseInt(row['O-'] || 0),
                },
                doctors: []
            });

            hospitalMap.set(hid, hospital);
        }

        // 5. Link Doctors
        let doctorsAdded = 0;
        for (const row of docData) {
            const hid = row['Hospital_ID'];
            const hospital = hospitalMap.get(hid);

            if (hospital) {
                hospital.doctors.push({
                    name: clean(row['Name']),
                    specialty: clean(row['Specialty']),
                    available: clean(row['Availability_Status']).toLowerCase() === 'available'
                });
                doctorsAdded++;
            }
        }

        console.log(`Linked ${doctorsAdded} doctors to hospitals.`);

        // 6. Save All
        console.log('Saving to database...');
        const hospitalsToSave = Array.from(hospitalMap.values());
        await Hospital.insertMany(hospitalsToSave);

        console.log('✅ Data seeding completed successfully!');
        process.exit(0);

    } catch (err) {
        console.error('Error seeding data:');
        if (err.name === 'ValidationError') {
            Object.keys(err.errors).forEach(field => {
                console.error(`- ${field}: ${err.errors[field].message}`);
                console.error(`  Value: ${err.errors[field].value}`);
            });
        } else {
            console.error(err);
        }
        process.exit(1);
    }
};

seedData();
