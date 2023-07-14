import { mDatabase } from '..';
import mysql from 'mysql2';

/* to check for errors, check the .status === 'error' property */
export function getUserByEmail(email: string) {
  return mDatabase.exec(async (connection) => {
    let [rows] = await connection.query(
      'SELECT * FROM users WHERE email = ? LIMIT 1',
      [email],
    );

    const result = rows[0] as mysql.RowDataPacket;
    return result;
  });
}

/* to check for errors, check the .status === 'error' property */
export function getUserByID(id: number) {
  return mDatabase.exec(async (connection) => {
    let [rows] = await connection.query(
      'SELECT * FROM users WHERE id = ? LIMIT 1',
      [id],
    );

    const result = rows[0] as mysql.RowDataPacket;
    return result;
  });
}
