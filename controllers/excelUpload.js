const path = require("path");
const csv = require("csvtojson");
const Result = require("../models/result");
const Student = require("../models/student");
const Class = require("../models/class");
const mongoose = require("mongoose");
const { json } = require("express/lib/response");

const uploadResult = (req, res) => {
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
      res.redirect("/dashboard/results");
    });
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
      res.redirect("/dashboard/students");
    });
};

const updateClass = (req, res) => {
  csv()
    .fromFile(req.file.path)
    .then(async (jsonobj) => {
      for await (const ele of jsonobj) {
        const student = await Student.findById(ele.enrolment_no);
        const classdoc = await Class.findById(student.class_id);
        const newClassdoc = await Class.findById(ele.class_id);
        student.class_id = ele.class_id;
        await student.save();

        await Class.findOneAndUpdate(
          { _id: classdoc._id },
          { $pull: { students: student._id } }
        );

        await Class.findOneAndUpdate(
          { _id: newClassdoc._id },
          { $push: { students: student._id } }
        );
      }
      res.redirect("/dashboard/students");
    });
};

exports.uploadResult = uploadResult;
exports.uploadStudent = uploadStudent;
exports.updateClass = updateClass;
