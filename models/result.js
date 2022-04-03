const mongoose = require("mongoose");

const { Schema } = mongoose;

const resultSchema = new Schema({
  student_id: { type: String, required: true, ref: "Student" },
  class_id: { type: String, required: true, ref: "Class" },
  result: [
    {
      name: { type: String, required: true },
      score: { type: String, required: true },
    },
  ],
});

module.exports = new mongoose.model("Result", resultSchema);
