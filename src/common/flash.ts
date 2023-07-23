import { Response, Request } from 'express';
import dev_log from './dev_log';

export default function flash(key: string, value: string, res: Response) {
    res.cookie(key, value);
}

export function getFlash(key: string, req: Request, res: Response) {
    const value = req.cookies[key];

    dev_log({ flash: { key, value } });
    res.clearCookie(key);
    return value;
}