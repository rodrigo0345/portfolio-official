import { Request, Response } from 'express';
import { getFlash } from '../../common/flash';

export async function index(req: Request, res: Response) {
    return res.render('index', { title: 'Express', user: req.user, flash: getFlash('message', req, res)});
}