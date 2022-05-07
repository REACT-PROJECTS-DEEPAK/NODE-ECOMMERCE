const req = require("express/lib/request");
const multer = require("multer");
const storage = multer.memoryStorage();

exports.multerUploads = () => {
  console.log("IN multer");
  console.log(req);
  multer({ storage }).single("image");
};
