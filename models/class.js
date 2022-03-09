const mongoose = require("mongoose");

const { Schema } = mongoose;

const classSchema = new Schema({
  _id: {type: String, required: true},
  branch: { type: String, required: true },
  sem: { type: Number, required: true },
  subjects: [{ type: String, required: true }],
  students: [{ type: mongoose.Types.ObjectId, required: true, ref: "Student" }],
});

module.exports = new mongoose.model("Class", classSchema);
