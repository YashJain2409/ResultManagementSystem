const mongoose = require("mongoose");

const { Schema } = mongoose;

const studentSchema = new Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  class_id: { type: String, required: true, ref: "Class" },
  result: [{ type: mongoose.Types.ObjectId, required: true, ref: "Result" }],
});

module.exports = new mongoose.model("Student", studentSchema);
