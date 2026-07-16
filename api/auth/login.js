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
    res.status(500).json({ msg: 'Server Error' });
  }
};
