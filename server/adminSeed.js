const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        const adminExists = await User.findOne({ email: 'admin@devcollab.com' });

        if (adminExists) {
            console.log('Admin already exists.');
            process.exit();
        }

        const adminUser = new User({
            name: 'System Admin',
            email: 'admin@devcollab.com',
            password: 'adminpassword123', // This will be hashed by the User model's pre-save hook
            role: 'admin',
            isVerified: true,
            bio: 'Lead administrator for DevCollab platform.',
            skills: ['Management', 'Cloud', 'Architecture'],
        });

        await adminUser.save();
        console.log('Admin user created successfully!');
        console.log('Email: admin@devcollab.com');
        console.log('Password: adminpassword123');
        
        process.exit();
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
