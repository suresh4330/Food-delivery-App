const User = require('../models/User');

// @desc    Get user's saved addresses
// @route   GET /api/user/addresses
// @access  Private
exports.getAddresses = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user.addresses || []);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a new saved address
// @route   POST /api/user/addresses
// @access  Private
exports.addAddress = async (req, res) => {
    try {
        const { label, address, location } = req.body;
        const user = await User.findById(req.user.id);
        
        if (!user) return res.status(404).json({ message: 'User not found' });

        const newAddress = { label: label || 'Other', address, location };
        user.addresses.push(newAddress);
        await user.save();
        
        res.status(201).json(user.addresses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
