const FoodItem = require('../models/FoodItem');
const uploadImage = require('../utils/uploadImage');

// @desc    Get food items by restaurant
// @route   GET /api/food/restaurant/:restaurantId (and /api/food/:restaurantId)
// @access  Public
exports.getFoodByRestaurant = async (req, res) => {
    try {
        const query = { restaurantId: req.params.restaurantId };
        if (req.query.available === 'true') {
            query.isAvailable = true;
        }
        if (req.query.category && req.query.category !== 'All') {
            query.category = req.query.category;
        }
        if (req.query.search) {
            query.name = new RegExp(req.query.search.trim(), 'i');
        }

        const foodItems = await FoodItem.find(query).sort({ createdAt: -1 });
        res.json(foodItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a food item
// @route   POST /api/food/:restaurantId
// @access  Private/Admin
exports.addFoodItem = async (req, res) => {
    const { name, image, price, category, isAvailable } = req.body;
    const restaurantId = req.params.restaurantId || req.body.restaurantId;

    try {
        const uploadedImage = await uploadImage(req.file, 'quickbite/foods');
        const foodItem = await FoodItem.create({
            restaurantId,
            name,
            image: uploadedImage || image,
            price,
            category,
            isAvailable: isAvailable ?? true
        });
        res.status(201).json(foodItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update food item (Generic / Availability)
// @route   PUT /api/food/:id
// @access  Private/Admin
exports.updateFoodItem = async (req, res) => {
    try {
        const foodItem = await FoodItem.findById(req.params.id);
        if (foodItem) {
            const uploadedImage = await uploadImage(req.file, 'quickbite/foods');
            foodItem.name = req.body.name || foodItem.name;
            foodItem.image = uploadedImage || req.body.image || foodItem.image;
            foodItem.price = req.body.price || foodItem.price;
            foodItem.category = req.body.category || foodItem.category;
            foodItem.isAvailable = req.body.isAvailable ?? foodItem.isAvailable;

            const updatedItem = await foodItem.save();
            res.json(updatedItem);
        } else {
            res.status(404).json({ message: 'Food item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete food item
// @route   DELETE /api/food/:id
// @access  Private/Admin
exports.deleteFoodItem = async (req, res) => {
    try {
        const foodItem = await FoodItem.findById(req.params.id);
        if (foodItem) {
            await foodItem.deleteOne();
            res.json({ message: 'Food item removed' });
        } else {
            res.status(404).json({ message: 'Food item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
