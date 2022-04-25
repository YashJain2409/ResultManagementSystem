const Class = require("../models/class");
const Student = require("../models/student");
const Result = require("../models/result");
const mongoose = require("mongoose");

const dashboard = (req, res) => {
  if (req.isAuthenticated()) res.render("dashboard");
  else res.redirect("/admin/login");
};

const classDashboard = (req, res) => {
  if (req.isAuthenticated()) res.render("class");
  else res.redirect("/admin/login");
};

const studentDashboard = (req, res) => {
  if (req.isAuthenticated()) res.render("students");
  else res.redirect("/admin/login");
};

const resultDashboard = async (req, res) => {
  if (req.isAuthenticated()) {
    const classIds = await Class.find({}, "_id");
    res.render("result", { classes: classIds });
  } else res.redirect("/admin/login");
};

const getClass = async (req, res) => {
  let classes;
  classes = await Class.find();
  res.status(200).json({ classes: classes });
};

const getStudents = async (req, res) => {
  const students = await Student.find();
  res.status(200).json({ students: students });
};

const getResults = async (req, res) => {
  const results = await Result.find();
  res.status(200).json({ results: results });
};

const addClass = async (req, res) => {
  const { cid, branch, sem, subjects } = req.body;
  const subArray = subjects.split(",");
  const createdClass = new Class({
    _id: cid,
    branch,
    sem,
    subjects: subArray,
    students: [],
  });
  try {
    await createdClass.save();
  } catch (err) {
    res.redirect(
      "/dashboard/classes?error=" + encodeURIComponent("creating class failed")
    );
    return;
  }
  res.render("class");
};

const addStudents = async (req, res) => {
  const { cid, name, enrolment_no } = req.body;
  const createdStudent = new Student({
    _id: enrolment_no,
    name: name,
    class_id: cid,
    result: [],
  });

  let classDoc;
  try {
    classDoc = await Class.findById(cid);
  } catch (err) {
    res.redirect(
      "/dashboard/students?error=" +
        encodeURIComponent("creating student failed")
    );
    return;
  }
  if (!classDoc) {
    res.redirect(
      "/dashboard/students?error=" +
        encodeURIComponent("could not find class for id")
    );
    return;
  }
  if (classDoc.students.includes(enrolment_no)) {
    res.redirect(
      "/dashboard/students?error=" +
        encodeURIComponent("enrolment no already exists")
    );
    return;
  }
  try {
    const sess = await mongoose.startSession();
    await sess.startTransaction();
    await createdStudent.save({ session: sess });
    classDoc.students.push(createdStudent);
    await classDoc.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    res.redirect(
      "/dashboard/students?error=" +
        encodeURIComponent("creating student failed")
    );
    return;
  }
  res.render("students");
};

const subjectByClassid = async (req, res) => {
  const obj = await Class.findById(req.params.cid, "subjects");
  const subjects = obj.subjects;
  res.status(200).json({ subjects: subjects });
};

const addResult = async (req, res) => {
  const classDoc = await Class.findById(req.body.class_id);
  const subjects = classDoc.subjects;
  const studentDoc = await Student.findById(req.body.enrolment_no);

  const duplicate = await Result.findOne({
    student_id: req.body.enrolment_no,
    class_id: req.body.class_id,
  });
  if (duplicate != null) {
    res.redirect(
      "/dashboard/results?error=" + encodeURIComponent("Result already exists")
    );
    return;
  }
  if (!classDoc.students.includes(req.body.enrolment_no)) {
    res.redirect(
      "/dashboard/results?error=" +
        encodeURIComponent("Could not create, add valid enrolment!")
    );
    return;
  }
  let result = [];
  subjects.forEach((subject) => {
    const marks = req.body[subject];
    const obj = {
      name: subject,
      score: marks,
    };
    result.push(obj);
  });
  const createdResult = new Result({
    student_id: req.body.enrolment_no,
    class_id: req.body.class_id,
    result: result,
  });
  try {
    const sess = await mongoose.startSession();
    await sess.startTransaction();
    await createdResult.save({ session: sess });
    classDoc.result.push(createdResult);
    await classDoc.save({ session: sess });
    studentDoc.result.push(createdResult);
    await studentDoc.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    res.redirect(
      "/dashboard/results?error=" + encodeURIComponent("creating result failed")
    );
    return;
  }

  res.redirect("/dashboard/results");
};

const deleteClass = async (req, res) => {
  const id = req.query.cid;
  try {
    await Class.deleteOne({ _id: id });
  } catch (e) {
    res.redirect(
      "/dashboard/classes?error=" + encodeURIComponent("Delete failed")
    );
    return;
  }
  res.status(200).json({ message: "deleted" });
};

const deleteResult = async (req, res) => {
  const id = mongoose.Types.ObjectId(req.query.rid);
  let result;
  try {
    result = await Result.findById(id)
      .populate("student_id")
      .populate("class_id");
  } catch (err) {
    res.redirect(
      "/dashboard/results?error=" + encodeURIComponent("Could not delete")
    );
    return;
  }
  if (!result) {
    res.redirect(
      "/dashboard/results?error=" + encodeURIComponent("could not find result")
    );
    return;
  }
  try {
    const sess = await mongoose.startSession();
    await sess.startTransaction();
    await result.remove({ session: sess });
    result.student_id.result.pull(result);
    await result.student_id.save({ session: sess });
    result.class_id.result.pull(result);
    await result.class_id.save({ session: sess });
    sess.commitTransaction();
  } catch (err) {
    res.redirect(
      "/dashborad/results?error=" + encodeURIComponent("Could not delete")
    );
    return;
  }
  res.json({ message: "deleted" });
};

const deleteStudents = async (req, res) => {
  const id = req.query.sid;
  let student;

  try {
    student = await Student.findById(id).populate("class_id");
  } catch (err) {
    res.redirect(
      "/dashborad/students?error=" + encodeURIComponent("Could not delete")
    );
    return;
  }
  try {
    await Result.deleteMany({ student_id: id });
    const sess = await mongoose.startSession();
    await sess.startTransaction();
    await student.remove({ session: sess });
    student.class_id.students.pull(student);
    await student.class_id.save({ session: sess });
    sess.commitTransaction();
  } catch (e) {
    res.redirect(
      "/dashboard/students?error=" + encodeURIComponent("delete failed")
    );
    return;
  }
  res.status(200).json({ message: "deleted" });
};

exports.addStudents = addStudents;
exports.subjectByClassid = subjectByClassid;
exports.addResult = addResult;
exports.dashboard = dashboard;
exports.resultDashboard = resultDashboard;
exports.addClass = addClass;
exports.getClass = getClass;
exports.studentDashboard = studentDashboard;
exports.classDashboard = classDashboard;
exports.deleteClass = deleteClass;
exports.getStudents = getStudents;
exports.getResults = getResults;
exports.deleteResult = deleteResult;
exports.deleteStudents = deleteStudents;
