const express = require("express");

const resultControllers = require("../controllers/result");

const Router = express.Router();

Router.post("/",resultControllers.resultPage);
Router.get("/",resultControllers.getResult);

module.exports = Router;