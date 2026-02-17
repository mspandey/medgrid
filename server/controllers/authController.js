const Hospital = require('../models/Hospital');
// const bcrypt = require('bcryptjs'); // Add bcrypt for real security later
// const jwt = require('jsonwebtoken'); // Add JWT for real security later

// Simple mock auth for now, or basic implementation
const Patient = require('../models/Patient');

// Simple mock auth for now, or basic implementation
exports.register = async (req, res) => {
    try {
        const { role, name, email, password, location, phone, age, bloodGroup } = req.body;

        if (role === 'patient') {
            let patient = await Patient.findOne({ email });
            if (patient) return res.status(400).json({ msg: 'Patient already exists' });

            patient = new Patient({ name, email, password, phone, age, bloodGroup });
            await patient.save();

            // Auto login after register
            return res.status(201).json({
                msg: 'Patient registered successfully',
                token: 'dummy_patient_token',
                user: { id: patient._id, name: patient.name, role: 'user' }
            });
        }

        // Hospital Registration
        let hospital = await Hospital.findOne({ email });
        if (hospital) return res.status(400).json({ msg: 'Hospital already exists' });

        hospital = new Hospital({ name, email, password, location, phone });
        await hospital.save();

        res.status(201).json({ msg: 'Hospital registered successfully', hospitalId: hospital._id });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (role === 'user') {
            const patient = await Patient.findOne({ email });
            if (!patient) return res.status(400).json({ msg: 'Invalid Credentials' });
            if (password !== patient.password) return res.status(400).json({ msg: 'Invalid Credentials' });

            return res.json({
                msg: 'Login Success',
                token: 'dummy_patient_token',
                user: { id: patient._id, name: patient.name, role: 'user' }
            });
        }

        // Hospital Login
        const hospital = await Hospital.findOne({ email });
        if (!hospital) return res.status(400).json({ msg: 'Invalid Credentials' });

        if (password !== hospital.password) return res.status(400).json({ msg: 'Invalid Credentials' });

        res.json({
            msg: 'Login Success',
            token: 'dummy_token_123',
            user: { id: hospital._id, name: hospital.name, role: 'hospital' }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
