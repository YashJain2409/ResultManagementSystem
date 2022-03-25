const express = require("express");

const dashboardControllers = require("../controllers/dashboard");

const Router = express.Router();

Router.get("/", dashboardControllers.dashboard);

Router.get("/getClasses", dashboardControllers.getClass);

Router.get("/classes", dashboardControllers.classDashboard);

Router.post("/classes", dashboardControllers.addClass);

Router.delete("/classes/:cid", dashboardControllers.deleteClass);

Router.get("/students", dashboardControllers.studentDashboard);

Router.post("/students", dashboardControllers.addStudents);

Router.get("/results", dashboardControllers.resultDashboard);

Router.get("/results/:cid", dashboardControllers.subjectByClassid);

Router.post("/results", dashboardControllers.addResult);

module.exports = Router;
