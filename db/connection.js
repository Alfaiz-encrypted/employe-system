const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://Alfaiz:Alfaiz@aalfaiz.dyut89c.mongodb.net/?retryWrites=true&w=majority")
.then(() =>{
    console.log("connection done for database");
})
.catch((e) =>{
    console.log("connection failed please connect network");
});