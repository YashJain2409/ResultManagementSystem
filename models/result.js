const mongoose = require('mongoose');

const { Schema } = mongoose;

const resultSchema = new Schema({
    student_id: {type: Number, required: true, ref: "Student"},
    result: [{
         name: {type: String,required: true},
         score: {type: String,required: true}
    }]
  });
  
  module.exports = new mongoose.model("Result", resultSchema);
