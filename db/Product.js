const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
     type:String,
     require: true,
    },
    price: {
        type:Number,
        require: true,
       },
    categary: {
        type:String,
        require: true,
       },
    company: {
        type:String,
        require: true,
       },
    userId: {
        type:String,
        require: true,
       }
});
module.exports = mongoose.model("products", productSchema);