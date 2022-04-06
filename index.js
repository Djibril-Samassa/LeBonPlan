const express = require("express");
const handlebars = require("express-handlebars");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = "em15bE6JqWCCimwd3H00MfHcyXZ2w18nR3XXPpsA";
const User = require("./models/userModel");
const cookieParser = require("cookie-parser");
let isLoggedIn = false;

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
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
    res.render("homepage",{isLoggedIn, username: user.username })
})

app.get("/signup", (req,res) =>{
    res.render("signup")
})

app.post("/signup", async(req,res) =>{
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    User.create({
        username: req.body.username,
        password: hashedPassword
    })
    res.redirect("/login")
})

app.get("/login", (req,res) =>{
    res.render("login")
})

app.post("/login", async(req,res) =>{
    const user = await User.findOne({username: req.body.username})
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    if(!isPasswordValid){
        res.json({
            message: "mot de passe ou adresse email incorrect"
        })
    }
    isLoggedIn = true;
    const token = jwt.sign({id: user._id},secret);
    res.cookie("jwt", token,{httpOnly:true, secure:false});

    res.redirect("/profile")
})

app.get("/logout", (req,res) =>{
    isLoggedIn = false;
    res.clearCookie("jwt")
    res.redirect("/")
})

app.get("/profile", async (req, res) => {
    const token =  jwt.verify(req.cookies.jwt, secret);
    if (!token) {
		return res.redirect("/");
	}
    const user = await User.findOne({_id : token.id});
    res.render("profile",{isLoggedIn, username: user.username })
})



app.listen(8000, () =>{
    console.log("listening");
})