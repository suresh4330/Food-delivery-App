const Order = require('../models/Order');
const Cart = require('../models/Cart');
const crypto = require('crypto');
const Razorpay = require('razorpay');

const getRazorpay = () => {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        return null;
    }

    return new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    });
};

const getCartSummary = async (userId) => {
    const cart = await Cart.findOne({ userId }).populate('items.foodId');

    if (!cart || cart.items.length === 0) {
        return { cart: null, totalAmount: 0, items: [] };
    }

    const subtotal = cart.items.reduce((total, item) => total + (item.foodId.price * item.quantity), 0);
    const deliveryFee = subtotal > 500 ? 0 : 40;

    return {
        cart,
        totalAmount: subtotal + deliveryFee,
        items: cart.items.map(item => ({
            foodId: item.foodId._id,
            name: item.foodId.name,
            price: item.foodId.price,
            quantity: item.quantity
        }))
    };
};

// @desc    Create new order
// @route   POST /api/order
// @access  Private
// @desc    Create new order
// @route   POST /api/order
// @access  Private
exports.createOrder = async (req, res) => {
    const { deliveryAddress, location, paymentMethod, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    try {
        const { cart, totalAmount, items } = await getCartSummary(req.user.id);

        if (!cart || items.length === 0) {
            return res.status(400).json({ message: 'Your cart is empty' });
        }

        let paymentStatus = paymentMethod === 'Online' ? 'Pending' : 'Pending';

        if (paymentMethod === 'Online') {
            if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
                return res.status(400).json({ message: 'Payment verification details are missing' });
            }

            const expectedSignature = crypto
                .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                .update(`${razorpayOrderId}|${razorpayPaymentId}`)
                .digest('hex');

            if (expectedSignature !== razorpaySignature) {
                return res.status(400).json({ message: 'Payment verification failed' });
            }

            paymentStatus = 'Paid';
        }

        const order = new Order({
            userId: req.user.id,
            items,
            totalAmount,
            deliveryAddress,
            location,
            paymentMethod: paymentMethod || 'COD',
            paymentStatus,
            razorpayOrderId,
            razorpayPaymentId,
            trackingHistory: [{
                status: 'Pending',
                note: 'Order placed successfully'
            }]
        });

        const createdOrder = await order.save();

        // Clear cart after order
        cart.items = [];
        cart.totalAmount = 0;
        await cart.save();

        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create Razorpay checkout order
// @route   POST /api/order/payment/create
// @access  Private
exports.createPaymentOrder = async (req, res) => {
    try {
        const razorpay = getRazorpay();
        if (!razorpay) {
            return res.status(500).json({ message: 'Razorpay keys are not configured' });
        }

        const { totalAmount, items } = await getCartSummary(req.user.id);
        if (items.length === 0) {
            return res.status(400).json({ message: 'Your cart is empty' });
        }

        const paymentOrder = await razorpay.orders.create({
            amount: totalAmount * 100,
            currency: 'INR',
            receipt: `qb_${Date.now()}`,
            notes: {
                userId: req.user.id
            }
        });

        res.json({
            key: process.env.RAZORPAY_KEY_ID,
            orderId: paymentOrder.id,
            amount: paymentOrder.amount,
            currency: paymentOrder.currency
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user orders
// @route   GET /api/orders/user
// @access  Private
const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            userId: req.user.id
        }).sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        console.error('getUserOrders error:', error);
        res.status(500).json({
            message: 'Failed to fetch orders',
            error: error.message
        });
    }
};

exports.getUserOrders = getUserOrders;

// @desc    Get all orders (Admin)
// @route   GET /api/order
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('userId', 'name email').sort('-createdAt');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get dashboard metrics (Admin)
// @route   GET /api/order/stats
// @access  Private/Admin
exports.getOrderStats = async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ createdAt: 1 });
        const buckets = {};

        orders.forEach((order) => {
            const day = new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
            buckets[day] = buckets[day] || { date: day, orders: 0, revenue: 0 };
            buckets[day].orders += 1;
            buckets[day].revenue += order.totalAmount || 0;
        });

        res.json({
            totalOrders: orders.length,
            revenue: orders.reduce((total, order) => total + (order.totalAmount || 0), 0),
            chart: Object.values(buckets).slice(-10),
            statusBreakdown: ['Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'].map((status) => ({
                status,
                count: orders.filter((order) => order.status === status).length
            }))
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/order/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.status = req.body.status || order.status;
            order.trackingHistory.push({
                status: order.status,
                note: req.body.note || `Order marked as ${order.status}`
            });
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
