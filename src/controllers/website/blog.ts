import { Request, Response } from 'express';
import { mDatabase } from '../..';
import { ApiResponse } from '../../common/api_response';
import mysql from 'mysql2';
import dev_log from '../../common/dev_log';
import { flash, getFlash } from '../../common/flash';

export async function blog(req: Request, res: Response) {

    let searchParams = req.query.search? req.query.search as string: '';
    searchParams = searchParams.toLocaleLowerCase();

    const index = req.query.index ? parseInt(req.query.index as string) : 0;
    const pageSize = 16;

    const data = searchParams?
        await mDatabase.exec(async (connection) => {
            const offset = index * pageSize;
            const [rows] = await connection.query(`
            SELECT * FROM posts 
            WHERE title LIKE CONCAT('%', ?, '%')
            ORDER BY id DESC LIMIT ?, ?`, 
            [searchParams, offset, pageSize]);
            return rows;
        })
        : 
        await mDatabase.exec(async (connection) => {
            const [rows] = await connection.query('SELECT * FROM posts ORDER BY id DESC LIMIT ?, ?', [index, pageSize]);
            return rows;
        });    

    if(data.status === 'error') {
        flash('message', 'Error getting the posts...', res);
        return res.redirect('/');
    }

    const posts = data.data as mysql.RowDataPacket[];

    dev_log({ posts, user: req.user });
    
    return res.render('blog', { posts, index: index + 1, searchParams, user: req.user, flash: getFlash('message', req, res) });
}