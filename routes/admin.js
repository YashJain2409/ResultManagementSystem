const express = require("express");

const adminControllers = require("../controllers/admin");

const Router = express.Router();

Router.get("/login", adminControllers.getAdminPage);
Router.post("/login",adminControllers.authenticate);
Router.post("/",adminControllers.addUser);


module.exports = Router;
