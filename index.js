const express = require("express");
const handlebars = require("express-handlebars");
const path = require("path");
const cookieParser = require("cookie-parser");
const app = express();

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");

app.use(express.static(path.join(__dirname, "/public")));


app.get("/", (req,res) =>{
    res.render("homepage")
})

app.get("/signup", (req,res) =>{
    res.render("signup")
})

app.listen(8000, () =>{
    console.log("listening");
})