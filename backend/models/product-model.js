const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["Veg", "Non-Veg"],
        default: "Veg",
        required: true,
    },
    category: {
        type: String,
        enum: ["Normal", "Biryani", "Gravy", "Fried", "Dessert", "Drink"],
        default: "Normal",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;
