const Hospital = require('../models/Hospital');

// Get all hospitals (with optional search)
exports.getHospitals = async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};

        if (search) {
            query = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { location: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const hospitals = await Hospital.find(query).select('-password'); // Exclude password
        res.json(hospitals);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update Inventory (Beds/Blood)
exports.updateInventory = async (req, res) => {
    try {
        const { id } = req.params;
        const { departments, blood } = req.body;

        // Build update object
        let updateFields = {};
        if (departments) updateFields.departments = departments;
        if (blood) updateFields.blood = blood;

        const hospital = await Hospital.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { new: true }
        ).select('-password');

        res.json(hospital);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
