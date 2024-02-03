import { Request, Response } from 'express';
import { mDatabase } from '../..';
import { ApiError, ApiResponse } from '../../common/api_response';
import mysql from 'mysql2';
import dev_log from '../../common/dev_log';
import { flash, getFlash } from '../../common/flash';

export async function blog(req: Request, res: Response) {

    let searchParams = req.query.search? req.query.search as string: '';
    searchParams = searchParams.toLocaleLowerCase();

    const index = req.query.index ? parseInt(req.query.index as string) : 0;
    const pageSize = 10;


    let data: ApiResponse<any> = ApiError("No data");
    if(searchParams) {
        data = await mDatabase.exec(async (connection) => {
            const offset = index * pageSize;
            const rows = await mDatabase.execute(
                "SELECT * FROM posts WHERE title LIKE '%' || $1 || '%' ORDER BY id DESC LIMIT $2 OFFSET $3;",
                [searchParams, pageSize, offset]
            );
            return rows; 
        })
    } else {
        const offset = index * pageSize;
        data = await mDatabase.execute(
            "SELECT * FROM posts WHERE title LIKE '%' || $1 || '%' ORDER BY id DESC OFFSET $2 FETCH FIRST $3 ROWS ONLY;",
            [searchParams, offset, pageSize]
        );
    }

    if(data.status === 'error') {
        flash('message', data.message, res);
        return res.redirect('/');
    }

    let posts = data.data as mysql.RowDataPacket[];
    if(!posts) {
        posts = [];
    }

    dev_log({ posts, user: req.user });
    
    return res.render('blog', { posts, index: index + 1, searchParams, user: req.user, flash: getFlash('message', req, res) });
}
