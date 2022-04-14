const express = require("express");

const excelControllers = require("../controllers/excelUpload");
const upload = require("../middlewares/upload");

const Router = express.Router();

Router.post("/upload", upload.single("csv"), excelControllers.uploadFile);

module.exports = Router;
