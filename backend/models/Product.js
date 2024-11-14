const mongoose = require('mongoose');

// Define the product schema
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true, // Product title is required
        trim: true,     // Remove leading/trailing spaces
    },
    description: {
        type: String,
        required: true, // Product description is required
    },
    tags: {
        type: [String], // Array of strings for tags (e.g., car_type, company, etc.)
        required: true, // Tags are required
    },
    userEmail: {
        type: String,
        required: true,
    },
    images: {
        type: [String], // Array of image URLs from Cloudinary
        required: true, // Images are required
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically set the creation date to now
    },
    updatedAt: {
        type: Date,
        default: Date.now, // Automatically set the update date to now
    },
});

// Update the `updatedAt` field before saving the product
productSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Create the Product model from the schema
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
