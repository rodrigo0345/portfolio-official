import { Router } from "express";
import { index } from "../controllers/website";
import { blog } from "../controllers/website/blog";
import protectRoute from "../common/protect_route";


export const websiteRouter = Router();

websiteRouter.get('/', index);
websiteRouter.get('/blog', blog);
websiteRouter.get('/makepost', protectRoute, (req, res) => {
    res.render('makepost', { user: req.user});
});
websiteRouter.get('/login', (req, res) => {
    res.render('login', { user: req.user});
});
websiteRouter.get('/register', (req, res) => {
    res.render('register', { user: req.user});
});