import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import postImage from '../controllers/image/post';

export const upload = Router();

export const storageConfig = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve('public'));
  },
  filename: function (req, file, cb) {
    const time = new Date().getTime();
    cb(null, `${time}_${file.originalname}`);
  },
});

const fileUploadSettings = multer({
  storage: storageConfig,
  limits: { fileSize: 5 * 1000 * 1000 }, // 5MB limit
});

// .single($string), $string = name of the file input field,
// dont forget to set enctype="multipart/form-data" in the form
upload.post('/', fileUploadSettings.single('image'), postImage);
