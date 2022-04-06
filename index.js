const express = require("express");
const handlebars = require("express-handlebars");
const path = require("path");
const cookieParser = require("cookie-parser");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = "em15bE6JqWCCimwd3H00MfHcyXZ2w18nR3XXPpsA";
const User = require("./models/userModel");

app.use(express.urlencoded({ extended: true }));

mongoose
	.connect(
		"mongodb+srv://Djibril:sheL5tKPZLk8PQ5F@cluster0.qzfvb.mongodb.net/LeBonPlan?retryWrites=true&w=majority",
		{
			useNewUrlParser: true,
		}
	)
	.then(() => console.log("Connected to MongoDB"));

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");

app.use(express.static(path.join(__dirname, "/public")));


app.get("/", (req,res) =>{
    res.render("homepage")
})

app.get("/signup", (req,res) =>{
    res.render("signup")
})

app.post("/signup", async(req,res) =>{
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    User.create({
        email: req.body.email,
        password: hashedPassword
    })
    res.redirect("/login")
})

app.get("/login", (req,res) =>{
    res.render("login")
})

app.post("/login", async(req,res) =>{
    const user = await User.findOne({email: req.body.email})
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    if(!isPasswordValid){
        res.json({
            message: "mot de passe ou adresse email incorrect"
        })
    }
    const token = jwt.sign({id: user._id},secret);
    res.cookie("jwt", token,{httpOnly:true, secure:false});

    res.redirect("/profile")
})

app.get("/profile", async (req, res) => {
    const token =  req.cookies.jwt;
    const id = user._id
    if (!token) {
		return res.redirect("/");
	}
    // res.render("profile")
    console.log(id);
});



app.listen(8000, () =>{
    console.log("listening");
})