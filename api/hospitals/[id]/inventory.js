const connectDB = require('../../lib/mongodb');
const Hospital = require('../../lib/Hospital');

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'PUT') {
    return res.status(405).json({ msg: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { id } = req.query;
    const { departments, blood } = req.body;

    let updateFields = {};
    if (departments) updateFields.departments = departments;
    if (blood) updateFields.blood = blood;

    const hospital = await Hospital.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    ).select('-password');

    if (!hospital) {
      return res.status(404).json({ msg: 'Hospital not found' });
    }

    res.json(hospital);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};
