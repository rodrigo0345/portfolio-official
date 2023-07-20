import { Request, Response } from 'express';
import { mDatabase } from '../..';
import { ApiResponse } from '../../common/api_response';
import mysql from 'mysql2';
import dev_log from '../../common/dev_log';

export async function blog(req: Request, res: Response) {

    const index = req.query.index ? parseInt(req.query.index as string) : 0;
    const pageSize = 16;
    
    const data = await mDatabase.exec(async (connection) => {
        const [rows] = await connection.query('SELECT * FROM posts ORDER BY id DESC LIMIT ?, ?', [index, pageSize]);
        return rows;
    });

    if(data.status === 'error') {
        return res.render('blog', { posts: [], error: data.message });
    }

    const posts = data.data as mysql.RowDataPacket[];

    dev_log({ posts });
    
    res.render('blog', { posts });
}