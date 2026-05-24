const express = require('express');
const router = express.Router();
const {
    getFoodByRestaurant,
    addFoodItem,
    updateFoodItem,
    deleteFoodItem
} = require('../controllers/foodController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public / User routes
router.get('/restaurant/:restaurantId', getFoodByRestaurant);
router.get('/:restaurantId', getFoodByRestaurant); // Also allow direct ID for frontend simplicity

// Admin routes
router.post('/:restaurantId', authMiddleware, adminMiddleware, upload.single('imageFile'), addFoodItem);
router.put('/:id', authMiddleware, adminMiddleware, upload.single('imageFile'), updateFoodItem);
router.put('/:id/availability', authMiddleware, adminMiddleware, updateFoodItem);
router.delete('/:id', authMiddleware, adminMiddleware, deleteFoodItem);

module.exports = router;
