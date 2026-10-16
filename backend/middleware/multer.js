import multer from "multer";

// ফাইল কোথায় এবং কী নামে save হবে
const storage = multer.diskStorage({
  // backend-এর public folder-এ image save করা
  destination: (req, file, cb) => {
    cb(null, "./public");
  },

  // Image-এর original filename রাখা
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

// Multer configuration
const upload = multer({
  storage: storage,
});

export default upload;
