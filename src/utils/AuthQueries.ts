import { mDatabase } from '..';
import mysql from 'mysql2';

/* to check for errors, check the .status === 'error' property */
export function getUserByEmail(email: string) {
  return mDatabase.exec(async (connection) => {
    let rows: any = await mDatabase.execute('SELECT * FROM users WHERE email = ? LIMIT 1', [email]); 
    console.log("Get user by email ", rows);
    const result = rows[0] as mysql.RowDataPacket;
    return result;
  });
}

/* to check for errors, check the .status === 'error' property */
export function getUserByID(id: number) {
  return mDatabase.exec(async (connection) => {
    let rows: any =  await mDatabase.execute('SELECT * FROM users WHERE id = ? LIMIT 1 ', [id]);
    console.log("Get user by id ", rows);
    const result = rows[0] as mysql.RowDataPacket;
    return result;
  });
}
