import express from 'express';
import initial_config from './common/initial_config';
import M_Database from './databases/MainDatabase';
import { router } from './routes/posts';
import Cache from './databases/Cache';
import dev_log from './common/dev_log';
import { upload } from './routes/image';

/* 
    Here is the entry point of the application.
    I have laid out some working examples of how to use the database and the router.
    The public folder is used to serve static files, such as images, html, etc...
    To test functionallity such as the database and the file uploads, use:
    - Postman
    - localhost:3000/public/file.html
    - localhost:3000/public/index.html
    This is also a good way to test if everything is working properly
*/

export const mDatabase = new M_Database(
  process.env.M_DATABASE_PORT,
  process.env.M_DATABASE_HOST,
  process.env.M_DATABASE_USER,
  process.env.M_DATABASE_PASSWORD,
  process.env.M_DATABASE_NAME,
);
export const cache = new Cache(process.env.REDIS_URL);

const app = express();
initial_config(app);

// for logging purposes
console.log('Node mode:', process.env.NODE_ENV ?? 'not set');

// example of how to use the router
app.use('/posts', router);
app.use('/image', upload);

// used '0.0.0.0' to use within docker, if not using docker, it is not needed
const server = app.listen(
  Number.parseInt(process.env.PORT ?? '3000'),
  '0.0.0.0',
  () => {
    console.log(`Server started on port ${process.env.PORT ?? 3000}`);
  },
);

// node needs to be told to close the database connection when the process is terminated
process.on('SIGTERM', () => {
  console.info('SIGTERM signal received.');
  console.log('Closing http server.');
  server.close((err) => {
    mDatabase.close();

    // redis kills itself automatically
    console.log('Http server closed.');
    process.exit(err ? 1 : 0);
  });
});
