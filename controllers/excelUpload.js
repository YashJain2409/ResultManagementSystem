const path = require("path");
const csv = require("csvtojson");
const Result = require("../models/result");
const uploadFile = (req, res) => {
  csv()
    .fromFile(req.file.path)
    .then((jsonobj) => {
      jsonobj.forEach((ele) => {
        const nameArr = ele.name.split(",");
        const marksArr = ele.marks.split(",");
        const result = nameArr.map((ele, i) => {
          return { name: ele, score: parseInt(marksArr[i]) };
        });
        delete ele.name;
        delete ele.marks;
        ele.result = result;
      });
      Result.insertMany(jsonobj, (err, data) => {
        if (err) console.log(err);
        else res.redirect("/dashboard/results");
      });
    });
};

exports.uploadFile = uploadFile;
