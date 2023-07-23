import { Router } from "express";
import { index } from "../controllers/website";
import { blog } from "../controllers/website/blog";
import protectRoute from "../common/protect_route";
import { getFlash } from "../common/flash";


export const websiteRouter = Router();

websiteRouter.get('/', index);
websiteRouter.get('/blog', blog);
websiteRouter.get('/makepost', protectRoute, (req, res) => {
    res.render('makepost', { user: req.user, flash: getFlash('message', req, res)});
});
websiteRouter.get('/login', (req, res) => {
    res.render('login', { user: req.user, flash: getFlash('message', req, res)});
});
websiteRouter.get('/register', (req, res) => {
    res.render('register', { user: req.user, flash: getFlash('message', req, res)});
});
websiteRouter.get('/logout', (req, res) => {
    return res.render('logout', { user: req.user, flash: getFlash('message', req, res)});
});
websiteRouter.get('/robots.txt', (req, res) => {
    return res.redirect('/public/robots.txt');
});
websiteRouter.get('/sitemap.xml', (req, res) => {
    return res.redirect('/public/sitemap.xml');
});