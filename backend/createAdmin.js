const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB...");

        const adminEmail = 'admin@quickbite.com';
        const adminPassword = 'admin123';

        const adminExists = await User.findOne({ email: adminEmail });

        if (adminExists) {
            console.log("⚠️ Admin already exists!");
            process.exit();
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        const admin = new User({
            name: "Admin",
            email: adminEmail,
            password: hashedPassword,
            role: "admin"
        });

        await admin.save();

        console.log("✅ Admin created successfully!");
        console.log(`📧 Email: ${adminEmail}`);
        console.log(`🔑 Password: ${adminPassword}`);

        process.exit();
    } catch (error) {
        console.error("❌ Failed:" + error);
        process.exit(1);
    }
};

createAdmin();
