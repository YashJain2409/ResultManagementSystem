const multer = require("multer");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
var uploads = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "text/csv"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("please upload excel files"));
    }
  },
});

module.exports = uploads;
