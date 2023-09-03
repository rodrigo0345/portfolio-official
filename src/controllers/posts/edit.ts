import { Request, Response } from 'express';
import { flash } from '../../common/flash';
import { mDatabase } from '../..';

export default async function editPost(req: Request, res: Response) {
    const id = req.params.id;

    if(!id) {
        flash('message', 'Missing id', res)
        return res.redirect('/blog');
    }

    const { content } = req.body;

    if(!content) {
        flash('message', 'Missing content', res)
        return res.redirect('/posts/' + id);
    }

    const result = await mDatabase.exec(async (connection) => {
        await mDatabase.execute("UPDATE posts SET content = ? WHERE id = ?", [content, id]);
    });

    if(result.status === 'error') {
        flash('message', 'Error editing post', res)
        return res.redirect('/posts/' + id);
    }

    return res.redirect('/posts/' + id);
}
