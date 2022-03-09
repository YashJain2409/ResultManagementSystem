const Class = require("../models/class");
const HttpError = require("../models/http-error");

const dashboard = (req, res, next) => {
  res.render("dashboard");
};

const classDashboard = (req, res, next) => {
  res.render("class");
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
  console.log(subArray);
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

exports.dashboard = dashboard;
exports.addClass = addClass;
exports.getClass = getClass;
exports.classDashboard = classDashboard;
exports.deleteClass = deleteClass;
