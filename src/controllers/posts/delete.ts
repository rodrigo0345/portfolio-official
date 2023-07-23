import { Request, Response } from 'express';
import { ApiError } from '../../common/api_response';
import { mDatabase } from '../..';
import flash from '../../common/flash';

export async function deletePost(req: Request, res: Response) {

    const id = req.params.id;

    if (!id) {
        flash('message', 'Missing id', res)
        return res.redirect('/blog');
    }

    const result = await mDatabase.exec(async (connection) => {
        return await connection.execute(`DELETE FROM posts WHERE id = ?`, [id]);
    });

    if (result.status === 'error') {
        flash('message', 'Error deleting post', res)
        return res.redirect('/posts/' + id);
    }

    return res.redirect('/blog');
}