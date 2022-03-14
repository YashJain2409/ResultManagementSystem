const Class = require("../models/class");
const Student = require("../models/student");
const Result = require("../models/result");
const HttpError = require("../models/http-error");
const mongoose = require("mongoose");

const dashboard = (req, res, next) => {
  res.render("dashboard");
};

const classDashboard = (req, res, next) => {
  res.render("class");
};

const studentDashboard = (req, res, next) => {
  res.render("students");
};

const resultDashboard = async (req, res, next) => {
  const classIds = await Class.find({}, "_id");
  res.render("result", { classes: classIds });
};

const getClass = async (req, res, next) => {
  let classes;
  try {
    classes = await Class.find();
  } catch (err) {
    return next(new HttpError("couldn't get classes", 500));
  }
  console.log(classes[0].toObject({ getters: true }));
};

const addClass = async (req, res, next) => {
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
    return next(new HttpError("creating class failed", 500));
  }
  res.render("class");
};

const deleteClass = async (req, res, next) => {
  const classId = req.params.cid;
  let classDoc;
  try {
    classDoc = await Class.findById(classId);
  } catch (err) {
    return next(new HttpError("could not delete", 500));
  }
  if (!classDoc) return next(new HttpError("could not find", 404));
  try {
    await classDoc.remove();
  } catch (err) {
    return next(new HttpError("could not delete", 500));
  }
  res.status(200).json({ message: "deleted place" });
};

const addStudents = async (req, res, next) => {
  const { cid, name, enrolment_no } = req.body;
  console.log(cid);
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
    return next(new HttpError("creating student failed", 500));
  }
  if (!classDoc)
    return next(new HttpError("could not find class for provided id", 404));
  try {
    const sess = await mongoose.startSession();
    await sess.startTransaction();
    await createdStudent.save({ session: sess });
    classDoc.students.push(createdStudent);
    await classDoc.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    return next(new HttpError("creating student failed", 500));
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
  const studentDoc = await Student.findById(req.body.enrolment_no);
  const subjects = classDoc.subjects;
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
    return next(new HttpError("creating result failed", 500));
  }
  const classIds = await Class.find({}, "_id");
  res.render("result", { classes: classIds });
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
