import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
});

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

export default Category;
