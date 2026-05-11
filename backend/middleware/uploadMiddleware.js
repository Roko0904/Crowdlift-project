 /* global require, module */
 const multer = require("multer");
const path = require("path");
const fs = require("fs");

 
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");  
  },
  filename: function (req, file, cb) {
    // Unique naam: timestamp + original extension
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

 
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "video/mp4"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);  
  } else {
    cb(new Error("Only JPG, PNG, WEBP images and MP4 videos are allowed!"), false);
  }
};
 
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max
  },
});

module.exports = upload;