const express = require("express");
const passport = require("passport");

const adminControllers = require("../controllers/admin");

const Router = express.Router();

Router.get("/login", adminControllers.getAdminPage);
Router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect:
      "/admin/login?error=" + encodeURIComponent("Invalid Credentials"),
  })
);
Router.post("/", adminControllers.addUser);

module.exports = Router;
