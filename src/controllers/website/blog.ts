import { Request, Response } from 'express';
import { mDatabase } from '../..';
import { ApiResponse } from '../../common/api_response';
import mysql from 'mysql2';
import dev_log from '../../common/dev_log';

export async function blog(req: Request, res: Response) {

    let searchParams = req.query.search? req.query.search as string: '';
    searchParams = searchParams.toLocaleLowerCase();

    const index = req.query.index ? parseInt(req.query.index as string) : 0;
    const pageSize = 16;

    const data = searchParams?
        await mDatabase.exec(async (connection) => {
            const [rows] = await connection.query(`
            SELECT * FROM posts 
            WHERE title LIKE CONCAT('%', ?, '%')
            ORDER BY id DESC LIMIT ?, ?`, 
            [searchParams, index, pageSize]);
            return rows;
        })
        : 
        await mDatabase.exec(async (connection) => {
            const [rows] = await connection.query('SELECT * FROM posts ORDER BY id DESC LIMIT ?, ?', [index, pageSize]);
            return rows;
        });    

    if(data.status === 'error') {
        return res.render('blog', { posts: [], error: data.message });
    }

    const posts = data.data as mysql.RowDataPacket[];

    dev_log({ posts, user: req.user });
    
    res.render('blog', { posts, index: index + 1, searchParams, user: req.user });
}