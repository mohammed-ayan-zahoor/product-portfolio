import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    images: [String],
    features: [String],
    categoryId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true
    },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
});

// Force delete model from cache to ensure schema changes are picked up
delete mongoose.models.Product;

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

export default Product;
