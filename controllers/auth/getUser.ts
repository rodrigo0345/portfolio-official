import { Request, Response } from 'express';
import { ApiSuccess } from '../../common/api_response';

export default function getUser(req: Request, res: Response) {
  const result = ApiSuccess<Express.User | undefined>(req.user);
  return res.json(result);
}
