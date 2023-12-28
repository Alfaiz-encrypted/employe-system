const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    emp_id: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
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
    position: {
        type: String,
        required: true,
    },
    joining: {
        type: String,
        required: true,
    },
    leave: {
        type: Number,
        required: true,
        default: 30,
    },
    mobileNo: {
        type: Number,
        required: true,
    },
    address: {
        type: String
    },
    country: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    pincode: {
        type: Number,
        required: true,
    },
    file_upload_name: {
        type: String,
        required: true,
    },
    document: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model("users", userSchema);
