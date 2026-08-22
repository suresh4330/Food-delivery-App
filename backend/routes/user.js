const express = require('express');
const router = express.Router();
const { getAddresses, addAddress } = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');

router.get('/addresses', protect, getAddresses);
router.post('/addresses', protect, addAddress);

module.exports = router;
