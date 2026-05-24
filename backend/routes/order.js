const express = require('express');
const router = express.Router();
const {
    createOrder,
    createPaymentOrder,
    getUserOrders,
    getAllOrders,
    getOrderStats,
    updateOrderStatus
} = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.post('/', authMiddleware, createOrder);
router.post('/payment/create', authMiddleware, createPaymentOrder);
router.get('/user', authMiddleware, getUserOrders);
router.get('/stats', authMiddleware, adminMiddleware, getOrderStats);
router.get('/', authMiddleware, adminMiddleware, getAllOrders);
router.get('/admin', authMiddleware, adminMiddleware, getAllOrders);  // alias
router.put('/:id/status', authMiddleware, adminMiddleware, updateOrderStatus);

module.exports = router;
