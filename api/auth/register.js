const connectDB = require('../lib/mongodb');
const Hospital = require('../lib/Hospital');
const Patient = require('../lib/Patient');

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ msg: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { role, name, email, password, location, phone, age, bloodGroup } = req.body;

    if (role === 'patient') {
      let patient = await Patient.findOne({ email });
      if (patient) return res.status(400).json({ msg: 'Patient already exists' });

      patient = new Patient({ name, email, password, phone, age, bloodGroup });
      await patient.save();

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
    res.status(500).json({ msg: 'Server Error' });
  }
};
