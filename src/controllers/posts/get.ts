import mysql from 'mysql2';
import { mDatabase, cache } from '../../';
import { Request, Response } from 'express';
import dev_log from '../../common/dev_log';

export default async function getPost(req: Request, res: Response) {
  const id = req.params.id;
  if(!id) {
    return res.redirect('/blog');
  }

  const data = await mDatabase.exec(async (connection) => {
    const [rows] = await connection.query('SELECT * FROM posts WHERE id = ?', [id]);
    return rows;
  });

  if (data.status === 'error') {
    return res.redirect('/blog');
  }

  dev_log({ data });

  const post = data.data[0] as mysql.RowDataPacket;
  return res.render('post', { post, user: req.user });
}
