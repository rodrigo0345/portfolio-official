export default function protectRoute(req: any, res: any, next: any) {
  devLog({ user: req.user, req: req.header });

  if(req.au)
  return next();
}
