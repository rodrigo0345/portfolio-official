import { ApiError } from './api_response';
import dev_log from './dev_log';

export default function protectRoute(req: any, res: any, next: any) {
  dev_log({ user: req.user });

  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/blog');
}
