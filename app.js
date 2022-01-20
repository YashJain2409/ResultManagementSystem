// jshint esversion:6
const express = require("express");
const ejs = require("ejs");
const app = express();
app.use(express.static('public'));
app.set("view engine","ejs");
const port = 3000;
app.get("/",(req,res) => {
    res.render("student");
});

app.listen(port, ()=> {
  console.log("listening on port 3000");
});