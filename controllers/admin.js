const Admin = require("../models/admin");
const passport = require("passport");

const getAdminPage = (req, res, next) => {
  res.render("admin", { navLink: "Home" });
};

// const addUser = async (req, res, next) => {
//   const { username, password } = req.body;
//   const newUser = new Admin({
//     username: username,
//     password: password,
//   });
//   try {
//     await newUser.save();
//   } catch (err) {
//     return next(new HttpError("creating user,failed", 500));
//   }
//   res.status(201).json({ user: newUser.toObject({ getters: true }) });
// };

exports.getAdminPage = getAdminPage;
// exports.addUser = addUser;
