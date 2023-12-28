const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/E-service")
.then(() =>{
    console.log("connection done for database");
})
.catch((e) =>{
    console.log("connection failed ");
});