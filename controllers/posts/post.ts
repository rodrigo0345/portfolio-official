import { mDatabase } from '../..';
import { Request, Response } from 'express';
import tables from '../../types/db';
import { ApiSuccess } from '../../common/api_response';
import { ResultSetHeader } from 'mysql2';
import dev_log from '../../common/dev_log';

export default async function postPost(req: Request, res: Response) {
  const { title, content } = req.body;
  const author = 'dunno';

  const result = await mDatabase.exec(async (connection) => {
    return await connection.query(
      tables.find((entity) => entity.name === 'posts')?.insertTable,
      [title, content, author],
    );
  });

  dev_log({ result });

  if (result.status === 'error') {
    return res.status(500).json(result);
  }

  const [data] = result;
  dev_log({ data });

  const resp = ApiSuccess<number>((data as ResultSetHeader).insertId);
  return res.json(resp);
}
