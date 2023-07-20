import { Router } from 'express';
import getPosts from '../controllers/posts/get';
import postPost from '../controllers/posts/post';
import multer from 'multer';
import { fileUploadSettings } from '../common/initial_config';

export const router = Router();

router.get('/',getPosts);
router.post('/', fileUploadSettings.single('image'), postPost);
