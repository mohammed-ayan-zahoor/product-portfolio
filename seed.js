import dbConnect from './lib/db.js';
import User from './models/User.js';
import Category from './models/Category.js';
import Product from './models/Product.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function seed() {
    try {
        await dbConnect();
        console.log('Connected to MongoDB. Starting seed...');

        // 1. Seed Admin User
        const adminEmail = 'admin@example.com';
        const adminPassword = 'adminpassword123';
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (!existingAdmin) {
            const passwordHash = await bcrypt.hash(adminPassword, 10);
            await User.create({
                email: adminEmail,
                passwordHash,
                role: 'admin'
            });
            console.log('✅ Admin user created:', adminEmail);
        } else {
            console.log('ℹ️ Admin user already exists.');
        }

        // 2. Seed Initial Categories
        const categoriesData = [
            { name: 'Hardware', slug: 'hardware', isActive: true },
            { name: 'Software', slug: 'software', isActive: true },
            { name: 'Education', slug: 'education', isActive: true },
        ];

        const seededCategories = [];
        for (const cat of categoriesData) {
            let existingCat = await Category.findOne({ slug: cat.slug });
            if (!existingCat) {
                existingCat = await Category.create(cat);
                console.log(`✅ Category created: ${cat.name}`);
            } else {
                console.log(`ℹ️ Category exists: ${cat.name}`);
            }
            seededCategories.push(existingCat);
        }

        // 3. Seed Initial Products
        const productsData = [
            {
                title: 'Enterprise Server Pro',
                slug: 'enterprise-server-pro',
                description: 'High-performance server for demanding enterprise workloads.',
                price: 150000,
                images: ['https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=800&auto=format&fit=crop'],
                categoryId: seededCategories.find(c => c.slug === 'hardware')._id,
                isActive: true
            },
            {
                title: 'Cloud Security Suite',
                slug: 'cloud-security-suite',
                description: 'Comprehensive security solution for your cloud infrastructure.',
                price: 45000,
                images: ['https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop'],
                categoryId: seededCategories.find(c => c.slug === 'software')._id,
                isActive: true
            }
        ];

        for (const prod of productsData) {
            const existingProd = await Product.findOne({ slug: prod.slug });
            if (!existingProd) {
                await Product.create(prod);
                console.log(`✅ Product created: ${prod.title}`);
            } else {
                console.log(`ℹ️ Product exists: ${prod.title}`);
            }
        }

        console.log('🚀 Seeding complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
}

seed();
