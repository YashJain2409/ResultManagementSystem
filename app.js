// jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const passport = require("passport");
const session = require("express-session");
const mongoose = require("mongoose");
const User = require("./models/admin");
const app = express();
const Student = require("./models/student");
const adminRoutes = require("./routes/admin");
const dashboardRoutes = require("./routes/dashboard");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set("view engine", "ejs");
const port = 3000;

app.get("/", (req, res) => {
  res.render("student", { navLink: "Admin Login" });
});

app.post("/", async (req, res) => {
  const enrolment_no = req.body.enrolment_no;
  const doc = await Student.findOne({ _id: enrolment_no })
    .populate("class_id")
    .populate("result");
  res.render("studentResult", {
    enrolment_no: enrolment_no,
    studentName: doc.name,
    studentBranch: doc.class_id.branch,
    studentSem: doc.class_id.sem,
    studentResult: doc.result[0].result,
  });
});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/admin/login");
});

app.use("/admin", adminRoutes);

app.use("/dashboard", dashboardRoutes);

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || "an unknown error occured" });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(port);
  })
  .catch((err) => {
    console.log(err);
  });
