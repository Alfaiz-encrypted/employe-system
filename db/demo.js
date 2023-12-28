const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    emp_id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
       
    },
    email: {
        type: String,
        
    },
    password: {
        type: String,
       
    },
    Position: {
        type: String,
    },
    joining: {
        type: String,
    },
    leave: {
        type: Number,
    },
    role: {
        type:String,
    },
    file_upload_name: {
        type: String,
    }
});

module.exports = mongoose.model("demo", userSchema);
