import { Router } from 'express';
import postRegister from '../controllers/auth/postRegister';
import getUser from '../controllers/auth/getUser';
import protectRoute from '../common/protect_route';
import passport from 'passport';

export const authRouter = Router();

authRouter.post('/register', postRegister);
authRouter.post('/login', passport.authenticate('local'));
authRouter.get('/user', protectRoute, getUser);
