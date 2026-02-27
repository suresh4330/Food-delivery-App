const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

// Routes Imports
const authRoutes = require('./routes/auth');
const restaurantRoutes = require('./routes/restaurant');
const foodRoutes = require('./routes/food');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes Middleware (both singular + plural aliases so frontend & backend match)
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/restaurant', restaurantRoutes);   // alias
app.use('/api/foods', foodRoutes);
app.use('/api/food', foodRoutes);               // alias
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/order', orderRoutes);             // alias

// Basic Route
app.get('/', (req, res) => {
    res.send('QuickBite API is running...');
});

// Port configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
