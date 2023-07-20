import { Router } from "express";
import { index } from "../controllers/website";
import { blog } from "../controllers/website/blog";


export const websiteRouter = Router();

websiteRouter.get('/', index);
websiteRouter.get('/blog', blog);
websiteRouter.get('/makepost', (req, res) => {
    res.render('makepost');
});