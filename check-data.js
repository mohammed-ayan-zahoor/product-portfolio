const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function check() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        process.exit(1);
    }

    try {
        await mongoose.connect(uri);
        console.log('Connected');

        const ProductSchema = new mongoose.Schema({
            title: String,
            features: [String]
        });

        const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

        const products = await Product.find({}, 'title features');
        console.log('PRODUCTS DATA:');
        products.forEach(p => {
            console.log(`- ${p.title}: [${(p.features || []).join(', ')}]`);
        });

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

check();
