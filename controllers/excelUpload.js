const path = require("path");
const csv = require("csvtojson");
const Result = require("../models/result");
const Student = require("../models/student");
const Class = require("../models/class");
const mongoose = require("mongoose");

const uploadResult = (req, res, next) => {
  csv()
    .fromFile(req.file.path)
    .then(async (jsonobj) => {
      jsonobj.forEach(async (ele) => {
        const nameArr = ele.name.split(",");
        const marksArr = ele.marks.split(",");
        const result = nameArr.map((ele, i) => {
          return { name: ele, score: parseInt(marksArr[i]) };
        });
        delete ele.name;
        delete ele.marks;
        ele.result = result;
      });

      try {
        const results = await Result.insertMany(jsonobj);
        results.forEach(async (result) => {
          const classDoc = await Class.findById(result.class_id);
          const studentDoc = await Student.findById(result.student_id);
          classDoc.result.push(result._id);
          await classDoc.save();
          studentDoc.result.push(result._id);
          await studentDoc.save();
        });
      } catch (e) {
        res.redirect(
          "/dashboard/results?error=" + encodeURIComponent("uploading failed")
        );
        return;
      }
    });
  res.redirect("/dashboard/results");
};

const uploadStudent = (req, res) => {
  csv()
    .fromFile(req.file.path)
    .then(async (jsonobj) => {
      try {
        const students = await Student.insertMany(jsonobj);
        students.forEach(async (student) => {
          classDoc = await Class.findById(student.class_id);
          classDoc.students.push(student._id);
          await classDoc.save();
        });
      } catch (e) {
        res.redirect(
          "/dashboard/students?error=" + encodeURIComponent("uploading failed")
        );
        return;
      }
    });
  res.redirect("/dashboard/students");
};

exports.uploadResult = uploadResult;
exports.uploadStudent = uploadStudent;
