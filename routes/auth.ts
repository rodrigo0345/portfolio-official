import { Router } from 'express';

export const authRouter = Router();

authRouter.post('/register');
authRouter.post('/login');
authRouter.get('/user');
