const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    ph_num: {
        type: Number,
        required: true,
        unique: true,
    },
    cart: {
        type: Array,
        default: []
    },
    orders: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
    },
    favorites: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
