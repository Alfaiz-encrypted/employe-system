const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    empcode: {
        type: String,
        required: true,
        unique: true,
    },
    empname: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    clockIn: {
        type: Date,
        required: true,
    },
      clockOut: {
        type: Date,
        required: true,
    },
      LunchStart: {
        type: Date,
        required: true,
    },
      LunchComplete: {
        type: Date,
        required: true,
    }      
});

module.exports = mongoose.model("infos", userSchema);
