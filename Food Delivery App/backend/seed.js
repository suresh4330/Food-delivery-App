const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Restaurant = require('./models/Restaurant');
const FoodItem = require('./models/FoodItem');

dotenv.config();

const restaurants = [
    {
        name: "Pizza Palace",
        description: "Pizzas • Pasta • Italian",
        address: "123 Main Street, Mumbai",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600",
        isActive: true
    },
    {
        name: "Burger Barn",
        description: "Burgers • Fast Food • American",
        address: "456 Park Avenue, Delhi",
        image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600",
        isActive: true
    },
    {
        name: "Noodle House",
        description: "Chinese • Noodles • Asian",
        address: "789 China Town, Bangalore",
        image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600",
        isActive: true
    },
    {
        name: "Sartaj Sweets",
        description: "Sweets • Desserts • South Indian",
        address: "21 Sweet Lane, Chennai",
        image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600",
        isActive: true
    },
    {
        name: "Biryani Blues",
        description: "Biryani • Mughlai • North Indian",
        address: "55 Spice Road, Hyderabad",
        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600",
        isActive: true
    },
    {
        name: "Roll Junction",
        description: "Rolls • Wraps • Street Food",
        address: "78 Food Street, Kolkata",
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600",
        isActive: true
    },
    {
        name: "Cake Factory",
        description: "Cakes • Bakery • Desserts",
        address: "12 Baker Lane, Pune",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600",
        isActive: true
    },
    {
        name: "South Spice",
        description: "South Indian • Dosa • Idli • Thali",
        address: "90 Temple Road, Mysore",
        image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600",
        isActive: true
    }
];

const foodsByRestaurant = {
    "Pizza Palace": [
        { name: "Margherita Pizza", price: 299, category: "Pizzas", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400", isAvailable: true },
        { name: "Pepperoni Pizza", price: 349, category: "Pizzas", image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400", isAvailable: true },
        { name: "Farmhouse Pizza", price: 329, category: "Pizzas", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400", isAvailable: true },
        { name: "Garlic Bread", price: 99, category: "Sides", image: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400", isAvailable: true },
        { name: "Pasta Alfredo", price: 249, category: "Pasta", image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400", isAvailable: true },
        { name: "Coke", price: 60, category: "Drinks", image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400", isAvailable: true },
    ],
    "Burger Barn": [
        { name: "Classic Chicken Burger", price: 199, category: "Burgers", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400", isAvailable: true },
        { name: "Veg Burger", price: 149, category: "Burgers", image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400", isAvailable: true },
        { name: "Double Patty Burger", price: 279, category: "Burgers", image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400", isAvailable: true },
        { name: "French Fries", price: 89, category: "Sides", image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=400", isAvailable: true },
        { name: "Chicken Sandwich", price: 169, category: "Sandwiches", image: "https://images.unsplash.com/photo-1553909489-cd47e0907980?w=400", isAvailable: true },
        { name: "Chocolate Shake", price: 129, category: "Drinks", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400", isAvailable: true },
    ],
    "Noodle House": [
        { name: "Veg Hakka Noodles", price: 149, category: "Chinese", image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400", isAvailable: true },
        { name: "Chicken Fried Rice", price: 179, category: "Chinese", image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400", isAvailable: true },
        { name: "Spring Rolls", price: 119, category: "Chinese", image: "https://images.unsplash.com/photo-1548869206-93b036288d7b?w=400", isAvailable: true },
        { name: "Manchurian", price: 159, category: "Chinese", image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400", isAvailable: true },
        { name: "Hot & Sour Soup", price: 99, category: "Soups", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400", isAvailable: true },
    ],
    "Sartaj Sweets": [
        { name: "Gulab Jamun", price: 79, category: "Desserts", image: "https://images.unsplash.com/photo-1666190094762-2514ea04b44a?w=400", isAvailable: true },
        { name: "Rasmalai", price: 99, category: "Desserts", image: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=400", isAvailable: true },
        { name: "Chocolate Cake", price: 199, category: "Cakes", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400", isAvailable: true },
        { name: "Ice Cream Sundae", price: 149, category: "Ice Cream", image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400", isAvailable: true },
        { name: "Jalebi", price: 69, category: "Desserts", image: "https://images.unsplash.com/photo-1601303516396-5449e7e35a0f?w=400", isAvailable: true },
    ],
    "Biryani Blues": [
        { name: "Chicken Biryani", price: 249, category: "Biryani", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400", isAvailable: true },
        { name: "Veg Biryani", price: 199, category: "Biryani", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400", isAvailable: true },
        { name: "Mutton Biryani", price: 349, category: "Biryani", image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=400", isAvailable: true },
        { name: "Raita", price: 49, category: "Sides", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400", isAvailable: true },
        { name: "Kebab Platter", price: 299, category: "Starters", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400", isAvailable: true },
    ],
    "Roll Junction": [
        { name: "Chicken Roll", price: 129, category: "Rolls", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400", isAvailable: true },
        { name: "Paneer Roll", price: 109, category: "Rolls", image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400", isAvailable: true },
        { name: "Egg Roll", price: 99, category: "Rolls", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400", isAvailable: true },
        { name: "Double Chicken Roll", price: 179, category: "Rolls", image: "https://images.unsplash.com/photo-1553909489-cd47e0907980?w=400", isAvailable: true },
    ],
    "Cake Factory": [
        { name: "Red Velvet Cake", price: 349, category: "Cakes", image: "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=400", isAvailable: true },
        { name: "Black Forest Cake", price: 299, category: "Cakes", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400", isAvailable: true },
        { name: "Blueberry Muffin", price: 89, category: "Desserts", image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400", isAvailable: true },
        { name: "Brownie", price: 119, category: "Desserts", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400", isAvailable: true },
        { name: "Pastry Box", price: 249, category: "Cakes", image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400", isAvailable: true },
    ],
    "South Spice": [
        { name: "Masala Dosa", price: 89, category: "South Indian", image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400", isAvailable: true },
        { name: "Idli Sambar", price: 69, category: "South Indian", image: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=400", isAvailable: true },
        { name: "Veg Thali", price: 149, category: "Thali", image: "https://images.unsplash.com/photo-1512058556646-c4da40fba323?w=400", isAvailable: true },
        { name: "Uttapam", price: 99, category: "South Indian", image: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=400", isAvailable: true },
        { name: "Filter Coffee", price: 39, category: "Drinks", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400", isAvailable: true },
    ],
};

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for seeding...");

        await Restaurant.deleteMany({});
        await FoodItem.deleteMany({});
        console.log("Cleared existing data.");

        await Restaurant.insertMany(restaurants);
        console.log("8 Restaurants inserted.");

        const dbRestaurants = await Restaurant.find({});
        const allFoodItems = [];

        dbRestaurants.forEach(res => {
            const foods = foodsByRestaurant[res.name] || [];
            foods.forEach(food => {
                allFoodItems.push({ ...food, restaurantId: res._id });
            });
        });

        await FoodItem.insertMany(allFoodItems);

        console.log("✅ Seed complete!");
        console.log(`🍕 ${dbRestaurants.length} restaurants`);
        console.log(`🍔 ${allFoodItems.length} food items`);
        process.exit();
    } catch (error) {
        console.error("❌ Seed failed:", error.message);
        process.exit(1);
    }
};

seedDB();
