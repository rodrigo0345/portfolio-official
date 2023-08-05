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
import { getUserByEmail, getUserByID } from '../utils/AuthQueries';
import { ApiError, ApiResponse } from './api_response';
import bcrypt from 'bcrypt';
import dev_log from './dev_log';
import multer from 'multer';
import path from 'path';
import flash from 'connect-flash';
import { flash as myFlash } from './flash';
import { mDatabase } from '..';

export const rateLimiterUsingThirdParty = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutes in milliseconds
  max: 100,
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
        secure: process.env.NODE_ENV === 'development' ? false : false,
        httpOnly: process.env.NODE_ENV === 'development' ? false : true,
        sameSite: process.env.NODE_ENV === 'development' ? false : false,
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(
    new Strategy(async function (username, password, done) {
      let user: user | undefined = undefined;

      try {
        const result = await getUserByEmail(username);
        dev_log({ result });

        if ((result as any).status === 'error') {
          return done(null, false, { message: result.message });
        }

        if (!(result as any).data) {
          return done(null, false, { message: 'User not found.' });
        }
        user = {
          id: (result.data as user).id,
          name: (result.data as user).name,
          email: (result.data as user).email,
          password: (result.data as user).password,
        };
        if (!bcrypt.compareSync(password, user.password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      } catch (error: any) {
        return done(null, false, { message: 'Incorrect password.' });
      }
    }),
  );

  app.use(flash());
  
  // makes sure the main_database is connected
  // if not it retrys the connection
  app.use((req, res, next) => {
    if (mDatabase.isConnected()) return next();
    if(mDatabase.retryConnection()) return next();
    myFlash('message', 'Database not connected', res);
    return res.redirect('/');
  });


  app.use(function (req, res, next) {
    res.locals.messages = req.flash();
    next();
  });

  passport.serializeUser(function (user: any, done: any) {
    process.nextTick(function () {
      done(null, user);
    });
  });

  passport.deserializeUser(async function (user: any, done: any) {
    let userObj: user | undefined = undefined;

    try {
      const result = await getUserByID(user.id);
      if ((result as any).status === 'error') {
        return done(JSON.stringify(ApiError((result as any).message)));
      }
      userObj = {
        id: (result.data as user).id,
        name: (result.data as user).name,
        email: (result.data as user).email,
        password: (result.data as user).password,
      };
    } catch (error: any) {
      return done(JSON.stringify(ApiError(error.message)));
    }
    process.nextTick(function () {
      done(null, userObj);
    });
  });
}

export const storageConfig = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve('public'));
  },
  filename: function (req, file, cb) {
    const time = new Date().getTime();
    cb(null, `${time}_${file.originalname}`);
  },
});

export const fileUploadSettings = multer({
  storage: storageConfig,
  limits: { fileSize: 5 * 1000 * 1000 }, // 5MB limit
});