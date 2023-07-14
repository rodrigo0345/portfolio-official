import { Request, Response } from 'express';
import { ApiError } from '../../common/api_response';

export default function postRegister(req: Request, res: Response) {
  return res.json(ApiError('Not implemented'));
}
