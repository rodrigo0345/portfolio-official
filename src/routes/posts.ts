import { Router } from 'express';
import getPosts from '../controllers/posts/get';
import postPost from '../controllers/posts/post';

export const router = Router();

router.get('/', getPosts);
router.post('/', postPost);
