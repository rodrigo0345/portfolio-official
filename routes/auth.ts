import { Router } from 'express';
import postRegister from '../controllers/auth/postRegister';
import postLogin from '../controllers/auth/postLogin';
import getUser from '../controllers/auth/getUser';

export const authRouter = Router();

authRouter.post('/register', postRegister);
authRouter.post('/login', postLogin);
authRouter.get('/user', getUser);
