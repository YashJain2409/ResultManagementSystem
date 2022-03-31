const mongoose = require("mongoose");

const { Schema } = mongoose;

const classSchema = new Schema({
  _id: { type: String, required: true },
  branch: { type: String, required: true },
  sem: { type: Number, required: true },
  subjects: [{ type: String, required: true }],
  students: [{ type: Number, required: true, ref: "Student" }],
  result: [{ type: mongoose.Types.ObjectId, required: true, ref: "Result" }],
});

module.exports = new mongoose.model("Class", classSchema);
