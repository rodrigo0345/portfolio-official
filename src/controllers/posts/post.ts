import { cache, mDatabase } from '../../';
import { Request, Response } from 'express';
import tables from '../../types/db';
import { ApiError, ApiSuccess } from '../../common/api_response';
import { ResultSetHeader } from 'mysql2';
import dev_log from '../../common/dev_log';
import sharp from 'sharp';
import fs from 'fs';

export default async function postPost(req: Request, res: Response) {
  const { title, content, category } = req.body;
  const file = req.file;

  if (!file) {
    return res.redirect('/makepost');
  }

  if (!req.file?.path) {
    return res.redirect('/makepost');
  }

  // optional but recommended
  // to make the photos in .webp format
  const finalWebpPath = req.file?.path + '.webp';
  const finalFilename = req.file.filename + '.webp';
  const imageWidth = 1000;
  const imageHeight = 500;

  try {
    sharp(req.file?.path)
      .resize(imageWidth, imageHeight, {
        fit: 'cover',
      })
      .webp()
      .toFile(finalWebpPath ?? '', (err: any, info: any) => {
        if (err) {
          throw err;
        }
        fs.unlinkSync(req.file?.path ?? '');
      });
  } catch (err: any) {
    return res.redirect('/makepost');
  }

  const result = await mDatabase.exec(async (connection) => {
    return await connection.query(
      tables.find((entity) => entity.name === 'posts')?.insertTable,
      [title, content, finalFilename, category],
    );
  });

  if (result.status === 'error') {
    return res.status(500).json(result);
  }
  return res.redirect('/blog');
}
