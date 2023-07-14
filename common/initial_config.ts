import express, { Express } from 'express';
import rateLimit from 'express-rate-limit';
import bp from 'body-parser';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import compression from 'compression';
import dotenv from 'dotenv';
import passport from 'passport';
import session from 'express-session';
import { Strategy } from 'passport-local';
import { user } from '../types/user';

export const rateLimiterUsingThirdParty = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutes in milliseconds
  max: 300,
  message: 'You have exceeded the 100 requests in 2 minutes limit!',
  standardHeaders: true,
  legacyHeaders: false,
  skipFailedRequests: false,
});

export default function initial_config(app: Express) {
  dotenv.config();

  // use this when you are behind a proxy (e.g. nginx) (to me this made nginx not work... so I disable it as default)
  // app.set('trust proxy', 1);

  app.use('/public', express.static('public')); // serve files from the public directory
  app.use(cookieParser());
  app.use(rateLimiterUsingThirdParty); // rate limit users based on the IP address
  app.use(bp.urlencoded({ extended: true }));
  app.use(bp.json());
  app.use(morgan('dev')); // log every request to the console, this is very useful for debugging
  app.use(
    cors({
      origin: `*`, // allow all origins
      credentials: true,
    }),
  );
  app.use(compression());

  // used to send cookies from the client to the server
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Set-Cookie, Authorization, Access-Control-Allow-Credentials, X-CSRF-Token',
    );
    res.header('Access-Controll-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Credentials', 'true');

    next();
  });

  // express-session makes the login persist within the cookies
  app.use(
    session({
      secret: process.env.SESSION_SECRET ?? 'secret',
      resave: false,
      saveUninitialized: true,
      proxy: true,
      cookie: {
        secure: process.env.NODE_ENV === 'development' ? false : true,
        httpOnly: process.env.NODE_ENV === 'development' ? false : true,
        sameSite: process.env.NODE_ENV === 'development' ? false : 'none',
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new Strategy(function (username, password, done) {
      const user: user | undefined = undefined;
      // find user in the database
      // if error return done(error)
      
      return done(null, user);
    }),
  );

  passport.serializeUser(function (user: any, done: any) {
    process.nextTick(function () {
      done(null, user);
    });
  });

  passport.deserializeUser(function (user: any, done: any) {
    process.nextTick(function () {
      done(null, user);
    });
  });
}
