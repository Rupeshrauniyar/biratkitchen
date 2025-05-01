const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true,
    },
    ph_num:{
        type: Number,
        required: true,
        unique: true,
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
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const AdminModel = mongoose.model("Admin", adminSchema);

module.exports = AdminModel; 
