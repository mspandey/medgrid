const mongoose = require('mongoose');

const HospitalSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // Admin email for login
    password: { type: String, required: true }, // Hashed password
    location: { type: String, required: true },
    phone: { type: String, required: true },
    departments: {
        icu: { avail: { type: Number, default: 0 }, total: { type: Number, default: 0 } },
        general: { avail: { type: Number, default: 0 }, total: { type: Number, default: 0 } },
        nicu: { avail: { type: Number, default: 0 }, total: { type: Number, default: 0 } }
    },
    blood: {
        'A+': { type: Number, default: 0 },
        'A-': { type: Number, default: 0 },
        'B+': { type: Number, default: 0 },
        'B-': { type: Number, default: 0 },
        'O+': { type: Number, default: 0 },
        'O-': { type: Number, default: 0 },
        'AB+': { type: Number, default: 0 },
        'AB-': { type: Number, default: 0 }
    },
    doctors: [{
        name: { type: String, required: true },
        specialty: { type: String, required: true },
        available: { type: Boolean, default: true }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Hospital', HospitalSchema);
