import { Router } from 'express';
import postPost from '../controllers/posts/post';
import multer from 'multer';
import { fileUploadSettings } from '../common/initial_config';
import getPost from '../controllers/posts/get';
import protectRoute from '../common/protect_route';
import { deletePost } from '../controllers/posts/delete';

export const router = Router();

router.post('/', fileUploadSettings.single('image'), postPost);
router.get('/:id', getPost);
router.post('/delete/:id', protectRoute, deletePost);