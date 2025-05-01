const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    foodDetails: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
            quantity: {
                type: Number,
                required: true,
            },
            productTotalPrice: {
                type: Number,
                required: true,
            },
        }

    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    full_name: {
        type: String,
        required: true,
    },
    ph_num: {
        type: Number,
        required: true,
        unique: true,
    },
    address: {
        type: String,
        required: true,
    },
    deliveryCharges: {
        type: Number,
        default: 20

    },
    totalOrderPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "shipped", "delivered", "cancelled"],
        default: "pending",
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: ["cash", "online"],
        default: "cash",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const OrderModel = mongoose.model("Order", orderSchema);

module.exports = OrderModel;
