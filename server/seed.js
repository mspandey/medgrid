const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Hospital = require('./models/Hospital');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Clear existing
        await Hospital.deleteMany({});

        // Create Admin Hospital
        const hospital = new Hospital({
            name: 'Metro General Hospital',
            email: 'admin@metro.com',
            password: 'password123', // In real app, hash this
            location: 'Downtown Metro',
            phone: '555-0123',
            departments: {
                icu: { avail: 5, total: 20 },
                general: { avail: 12, total: 50 },
                nicu: { avail: 2, total: 10 }
            },
            blood: {
                'A+': 15,
                'O-': 5,
                'B+': 8
            }
        });

        await hospital.save();
        console.log('Hospital Seeded: admin@metro.com / password123');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
