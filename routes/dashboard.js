const express = require("express");

const dashboardControllers = require("../controllers/dashboard");

const Router = express.Router();

Router.get("/", dashboardControllers.dashboard);

Router.get("/getClasses",dashboardControllers.getClass);

Router.get("/classes",dashboardControllers.classDashboard);

Router.post("/classes", dashboardControllers.addClass);

Router.delete("/classes/:cid", dashboardControllers.deleteClass);

Router.get("/students",dashboardControllers.studentDashboard);

Router.post("/students",dashboardControllers.addStudents);

module.exports = Router;
