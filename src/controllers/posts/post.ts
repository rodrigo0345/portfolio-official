import { cache, mDatabase } from '../../';
import { Request, Response } from 'express';
import tables from '../../types/db';
import { ApiError, ApiSuccess } from '../../common/api_response';
import { ResultSetHeader } from 'mysql2';
import dev_log from '../../common/dev_log';
import sharp from 'sharp';
import fs from 'fs';
import protectRoute from '../../common/protect_route';
import {flash} from '../../common/flash';

export default async function postPost(req: Request, res: Response) {
  protectRoute(req, res, () => {});
  
  let { title, content, category } = req.body;
  const file = req.file;

  if (!title || !content || !category) {
    flash('message', 'Missing required fields', res);
    return res.redirect('/makepost');
  }

  if (typeof title !== 'string' || typeof content !== 'string' || typeof category !== 'string') {
    flash('message', 'Invalid data, try again', res);
    return res.redirect('/makepost');
  }

  category = category.toLowerCase();

  if (!file) {
    flash('message', 'Missing image', res);
    return res.redirect('/makepost');
  }

  if (!req.file?.path) {
    flash('message', 'Missing image', res);
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
    flash('message', 'Problem compressing image, please try again', res);
    return res.redirect('/makepost');
  }

  const result = await mDatabase.exec(async (connection) => {
    return await connection.query(
      tables.find((entity) => entity.name === 'posts')?.insertTable,
      [title, content, finalFilename, category],
    );
  });

  if (result.status === 'error') {
    flash('message', result.message, res);
    return res.redirect('/makepost');
  }
  return res.redirect('/blog');
}
