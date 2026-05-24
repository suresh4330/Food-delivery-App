const express = require('express');
const router = express.Router();
const {
    getRestaurants,
    getRestaurantById,
    createRestaurant,
    updateRestaurant,
    updateRestaurantStatus,
    deleteRestaurant
} = require('../controllers/restaurantController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getRestaurants);
router.get('/:id', getRestaurantById);
router.post('/', authMiddleware, adminMiddleware, upload.single('imageFile'), createRestaurant);
router.put('/:id', authMiddleware, adminMiddleware, upload.single('imageFile'), updateRestaurant);
router.put('/:id/status', authMiddleware, adminMiddleware, updateRestaurantStatus);
router.delete('/:id', authMiddleware, adminMiddleware, deleteRestaurant);

module.exports = router;
