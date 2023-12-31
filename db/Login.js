const mongoose = require('mongoose');

const loginSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    leave: {
        type: Number,
        required: true,
    },

});

module.exports = mongoose.model("users", loginSchema);
