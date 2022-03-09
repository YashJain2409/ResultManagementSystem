const mongoose = require("mongoose");

const { Schema } = mongoose;

const studentSchema = new Schema({
  name: { type: String, required: true },
  enrolment_no: { type: Number, required: true },
  class: { type: mongoose.Types.ObjectId, required: true, ref: "Class" },
});

module.exports = new mongoose.model("Student", studentSchema);
