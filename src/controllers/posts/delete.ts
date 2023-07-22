import { Request, Response } from 'express';
import { ApiError } from '../../common/api_response';
import { mDatabase } from '../..';

export async function deletePost(req: Request, res: Response) {

    const id = req.params.id;

    if (!id) {
        return res.status(400).json(ApiError('Missing id'));
    }

    const result = await mDatabase.exec(async (connection) => {
        return await connection.execute(`DELETE FROM posts WHERE id = ?`, [id]);
    });

    if (result.status === 'error') {
        return res.status(400).json(ApiError(result.message));
    }

    return res.redirect('/blog');
}