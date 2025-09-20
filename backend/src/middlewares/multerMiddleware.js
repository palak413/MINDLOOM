// src/middlewares/multer.middleware.js
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp"); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

export const upload = multer({ 
  storage,
  fileFilter: function (req, file, cb) {
    console.log('Multer file filter - received file:', {
      fieldname: file.fieldname,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    });
    
    // Accept various audio formats
    const allowedMimeTypes = [
      'audio/wav',
      'audio/webm',
      'audio/mp4',
      'audio/mpeg',
      'audio/ogg',
      'audio/mp3',
      'audio/x-wav',
      'audio/wave'
    ];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
      console.log('File accepted:', file.originalname);
      cb(null, true);
    } else {
      console.log('Rejected file type:', file.mimetype);
      cb(new Error('Only audio files are allowed'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});