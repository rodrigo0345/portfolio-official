import { Request, Response } from 'express';
import { ApiError, ApiSuccess } from '../../common/api_response';
import { Role, userSchema } from '../../types/user';
import { mDatabase } from '../../';
import tables from '../../types/db';
import { ResultSetHeader } from 'mysql2';
import bcrypt from 'bcrypt';
import dev_log from '../../common/dev_log';
import flash from '../../common/flash';

export default async function postRegister(req: Request, res: Response) {
  dev_log({ body: req.body });
  const { username, password, name } = req.body;
  const email = username;

  if (!email || !password || !name) {
    flash('message', 'Missing required fields', res)
    return res.redirect('/register');
  }

  try {
    userSchema.parse({
      email,
      password,
      name,
    });
  } catch (err: any) {
    flash('message', 'Invalid data, try again', res)
    return res.redirect('/register');
  }

  let hashedPassword: string;
  try {
    hashedPassword = await bcrypt.hash(password, 10);
  } catch (err: any) {
    flash('message', 'Problem hashing password, please try again later', res)
    return res.redirect('/register');
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
    flash('message', result.message, res);
    return res.redirect('/register');
  }

  return res.redirect('/login');
}
