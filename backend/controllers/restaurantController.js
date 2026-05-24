const Restaurant = require('../models/Restaurant');
const FoodItem = require('../models/FoodItem');
const uploadImage = require('../utils/uploadImage');

const buildRestaurantFilter = (query) => {
    const filter = {};
    if (query.includeInactive !== 'true') {
        filter.isActive = true;
    }

    if (query.search) {
        const searchRegex = new RegExp(query.search.trim(), 'i');
        filter.$or = [
            { name: searchRegex },
            { description: searchRegex },
            { address: searchRegex }
        ];
    }

    return filter;
};

// @desc    Get all restaurants
// @route   GET /api/restaurant
// @access  Public
exports.getRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find(buildRestaurantFilter(req.query)).sort({ createdAt: -1 });
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get restaurant by ID
// @route   GET /api/restaurant/:id
// @access  Public
exports.getRestaurantById = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (restaurant) {
            res.json(restaurant);
        } else {
            res.status(404).json({ message: 'Restaurant not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a restaurant
// @route   POST /api/restaurant
// @access  Private/Admin
exports.createRestaurant = async (req, res) => {
    const { name, image, description, address } = req.body;

    try {
        const uploadedImage = await uploadImage(req.file, 'quickbite/restaurants');
        const restaurant = await Restaurant.create({
            name,
            image: uploadedImage || image,
            description,
            address
        });
        res.status(201).json(restaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update restaurant
// @route   PUT /api/restaurant/:id
// @access  Private/Admin
exports.updateRestaurant = async (req, res) => {
    const { name, image, description, address, isActive } = req.body;

    try {
        const restaurant = await Restaurant.findById(req.params.id);

        if (restaurant) {
            const uploadedImage = await uploadImage(req.file, 'quickbite/restaurants');
            restaurant.name = name || restaurant.name;
            restaurant.image = uploadedImage || image || restaurant.image;
            restaurant.description = description || restaurant.description;
            restaurant.address = address || restaurant.address;
            restaurant.isActive = isActive ?? restaurant.isActive;

            const updatedRestaurant = await restaurant.save();
            res.json(updatedRestaurant);
        } else {
            res.status(404).json({ message: 'Restaurant not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update restaurant status
// @route   PUT /api/restaurant/:id/status
// @access  Private/Admin
exports.updateRestaurantStatus = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (restaurant) {
            restaurant.isActive = req.body.isActive ?? restaurant.isActive;
            const updatedRestaurant = await restaurant.save();
            res.json(updatedRestaurant);
        } else {
            res.status(404).json({ message: 'Restaurant not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete restaurant
// @route   DELETE /api/restaurant/:id
// @access  Private/Admin
exports.deleteRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);

        if (restaurant) {
            await FoodItem.deleteMany({ restaurantId: restaurant._id });
            await restaurant.deleteOne();
            res.json({ message: 'Restaurant removed' });
        } else {
            res.status(404).json({ message: 'Restaurant not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
