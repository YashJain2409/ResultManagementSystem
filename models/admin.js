const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const { Schema } = mongoose;

const adminSchema = new Schema({
  username: { type: String, required: true },
  password: String,
});

adminSchema.plugin(passportLocalMongoose);

module.exports = new mongoose.model("Admin", adminSchema);
