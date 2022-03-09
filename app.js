// jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();

const adminRoutes = require("./routes/admin");
const dashboardRoutes = require('./routes/dashboard');
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));
app.set("view engine", "ejs");
const port = 3000;

app.get("/", (req, res, next) => {
  res.render("student",{navLink : "Admin Login"});
});

app.use("/admin", adminRoutes);

app.use("/dashboard",dashboardRoutes);

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || "an unknown error occured" });
});

mongoose
  .connect(
    "mongodb+srv://admin-yash:Test123@cluster0.0cm8n.mongodb.net/resultDB?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
