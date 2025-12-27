import dbConnect from './lib/db.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function seed() {
    try {
        await dbConnect();

        const email = 'admin@example.com';
        const password = 'adminpassword123'; // CHANGE THIS IN PRODUCTION

        const existing = await User.findOne({ email });
        if (existing) {
            console.log('Admin user already exists.');
            process.exit(0);
        }

        const passwordHash = await bcrypt.compare(password, '$2a$10$...') ? '' : await bcrypt.hash(password, 10);

        await User.create({
            email,
            passwordHash,
            role: 'admin'
        });

        console.log('Admin user created successfully!');
        console.log('Email:', email);
        console.log('Password:', password);
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
}

seed();
