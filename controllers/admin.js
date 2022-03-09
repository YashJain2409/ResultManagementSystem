const Admin = require("../models/admin");
const HttpError = require("../models/http-error");

const getAdminPage = (req, res, next) => {
  res.render("admin", { navLink: "Home" });
};

const addUser = async (req, res, next) => {
  const { username, password } = req.body;
  const newUser = new Admin({
    username: username,
    password: password,
  });
  try {
    await newUser.save();
  } catch (err) {
    return next(new HttpError("creating user,failed", 500));
  }
  res.status(201).json({ user: newUser.toObject({ getters: true }) });
};
const authenticate = async (req, res, next) => {
  const { user, password } = req.body;
  console.log(user);
  console.log(password);
  let existingUser;
  try {
    existingUser = await Admin.findOne({ username: user });
  } catch (err) {
    return next(new HttpError("logging failed , try again later", 500));
  }
  console.log(existingUser);
  if (existingUser == null || existingUser.password != password) {
    return next(new HttpError("invalid credentials", 401));
  }
  res.status(200).redirect("/dashboard");
};


exports.authenticate = authenticate;
exports.getAdminPage = getAdminPage;
exports.addUser = addUser;
