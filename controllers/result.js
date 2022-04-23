const Student = require("../models/student");
const Result = require("../models/result");
const Class = require("../models/class");

const resultPage = async (req, res) => {
  const enrolment_no = req.body.enrolment_no;
  const doc = await Student.findOne({ _id: enrolment_no }).populate("class_id");
  if (doc == null) {
    res.redirect("/?error=" + encodeURIComponent("Oops! No data found"));
    return;
  }
  // const result = await Result.findOne({
  //   student_id: enrolment_no,
  //   class_id: doc.class_id._id,
  // });
  // if (result == null) {
  //   res.redirect("/?error=" + encodeURIComponent("Oops! No data found"));
  //   return;
  // }

  res.render("studentResult", {
    enrolment_no: enrolment_no,
    studentName: doc.name,
    studentBranch: doc.class_id.branch,
    studentSem: doc.class_id.sem,
  });
};

const getResult = async (req, res) => {
  const sem = parseInt(req.query.sem);
  const class_id = await Class.findOne(
    { sem: sem, branch: req.query.branch },
    "_id"
  );

  const result = await Result.findOne({
    student_id: req.query.enrolment_no,
    class_id: class_id,
  });
  if(result == null){
      res.json({result: null});
      return;
  }
  res.json({ result: result.result });
};
exports.resultPage = resultPage;
exports.getResult = getResult;
