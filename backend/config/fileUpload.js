const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
const photosDir = path.join(uploadsDir, 'photos');
const certificatesDir = path.join(uploadsDir, 'certificates');

[uploadsDir, photosDir, certificatesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'professionalPhoto') {
      cb(null, photosDir);
    } else if (file.fieldname === 'registrationCertificate') {
      cb(null, certificatesDir);
    } else {
      cb(null, uploadsDir);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Allowed extensions
  const allowedImageTypes = /jpeg|jpg|png/;
  const allowedDocTypes = /pdf|jpeg|jpg|png/;
  
  const extname = allowedImageTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedImageTypes.test(file.mimetype);

  if (file.fieldname === 'professionalPhoto') {
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only .png, .jpg and .jpeg format allowed for photos!'));
    }
  } else if (file.fieldname === 'registrationCertificate') {
    const docExtname = allowedDocTypes.test(path.extname(file.originalname).toLowerCase());
    if (docExtname) {
      return cb(null, true);
    } else {
      cb(new Error('Only .pdf, .png, .jpg and .jpeg format allowed for certificates!'));
    }
  } else {
    cb(null, true);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB default
  },
  fileFilter: fileFilter
});

module.exports = upload;
