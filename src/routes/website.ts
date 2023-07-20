import { Router } from "express";
import { index } from "../controllers/website";


export const websiteRouter = Router();

websiteRouter.get('/', index);
