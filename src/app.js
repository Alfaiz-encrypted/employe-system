const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const port = process.env.PORT || 5000;
require("./db/connection");
const Register = require("./db/registers");


const static_path = path.join(__dirname, "./public");
const template_patch = path.join(__dirname, "./template/views");
const partials_patch = path.join(__dirname, "./template/partials");

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_patch);
hbs.registerPartials(partials_patch);

app.get("/login", (req, res) => {
    res.render("index");
});

// LOGIN validation
app.post("/login", async(req, res) =>{
    try{
     const name = req.body.name;
     const password = req.body.password;  

    const userName = await Register.findOne({firstname : name});
    // res.send(userName.password);
    // console.log(userName);
    if(userName.password == password){
        res.render("Home");
    }else{
        res.send("invalied id, password ");
    }
    }catch(e) {
        res.send("invalied id paswword for catch")
    }
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", async(req, res) =>{
    try{
        const password = req.body.password;
        const cpassword = req.body.cpassword;
       if(password === cpassword){

        const registerCutemer = new Register({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            city: req.body.city,
            gender: req.body.email,
            password: req.body.password,
            cpassword: req.body.cpassword,
            phone: req.body.phone,
        });
            const registered = await registerCutemer.save();
            res.render("index");
       }else{
        res.send("password and cpassword is not match");
       } 
    }
    catch(e){
        console.log(e);
    }
})

// hashing password
// const bcrypt = require("bcryptjs");

// const securePassword = async(password) =>{
//     const passwordHash = await bcrypt.hash(password, 10);
//     console.log(passwordHash);
// }
// securePassword("ALF");

// hashing 
    // const isMatch = await bcrypt.compare(password, userName.password);
    // if(isMatch){
    //     res.send("thanks for hashing password");
    // }else{
    //     res.send("invalied hshing password");
    // }



app.listen(port, () => {
    console.log("connection successfull to localhost");
})