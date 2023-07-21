import { Request, Response } from 'express';
import { ApiError, ApiSuccess } from '../../common/api_response';
import { Role, userSchema } from '../../types/user';
import { mDatabase } from '../../';
import tables from '../../types/db';
import { ResultSetHeader } from 'mysql2';
import bcrypt from 'bcrypt';
import dev_log from '../../common/dev_log';

export default async function postRegister(req: Request, res: Response) {
  dev_log({ body: req.body });
  const { username, password, name } = req.body;
  const email = username;

  if (!email || !password || !name) {
    return res.status(400).json(ApiError('Missing required fields'));
  }

  try {
    userSchema.parse({
      email,
      password,
      name,
    });
  } catch (err: any) {
    return res.status(400).json(ApiError(err.message));
  }

  let hashedPassword: string;
  try {
    hashedPassword = await bcrypt.hash(password, 10);
  } catch (err: any) {
    return res.status(500).json(ApiError(err.message));
  }

  const sqlCommand = tables.find(
    (table) => table.name === 'users',
  )?.insertTable;

  const result = await mDatabase.exec(async (connection) => {
    return await connection.query(sqlCommand, [
      name,
      email,
      hashedPassword,
    ]);
  });

  if (result.status === 'error') {
    return res.redirect('/register');
  }

  return res.redirect('/login');
}
