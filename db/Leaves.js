const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    emp_id: {
        type: Number,
        required:true         
    },
    fromDate: {
        type: String,
        required: true,
    },
    toDate: {
        type: String,
        required: true,
    },
    leaveType: {
        type:String,
        required: true
    },
    days: {
        type: Number,
        require:true, 
    },
    reason: {
        type: String,
        required: true,
    },
    status: {
        type: Number,
        default: 0 
    },
});
module.exports = mongoose.model("Leaves", userSchema);
