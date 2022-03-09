const mongoose = require('mongoose');

const { Schema } = mongoose;

const resultSchema = new Schema({
    student: {type: mongoose.Types.ObjectId, required: true, ref: "Student"},
    result: [{
         name: {type: String,required: true},
         score: {type: String,required: true}
    }]
  });
  
  module.exports = new mongoose.model("Result", resultSchema);
