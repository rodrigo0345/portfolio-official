import { Request, Response } from 'express';

export async function index(req: Request, res: Response) {
    res.render('index', { title: 'Express', user: req.user});
}