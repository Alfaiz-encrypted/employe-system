const mongoose = require("mongoose");

const custemerData = new mongoose.Schema({
    firstname:{
        type: String,
        require: true,
    },
    lastname:{
        type: String,
        require: true,
    },
    city: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    cpassword: {
        type: String,
        require: true,
    },
    phone:{
        type: Number,
        require: true,
    }

})
const Register = new mongoose.model("Register", custemerData);
module.exports = Register;