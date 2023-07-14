import { AggregateGroupByReducers, AggregateSteps, createClient } from 'redis';
import dev_log from '../common/dev_log';
import { ApiError } from '../common/api_response';

export default class Cache {
  connection;

  constructor(redis_url?: string | undefined) {
    dev_log({ redis_url });
    this.connection = redis_url
      ? createClient({
          url: redis_url,
        })
      : createClient();
    this.connection.on('error', (err) =>
      console.log('Redis Client Error', err),
    );
    process.on('exit', () => {
      console.log('closing redis...');
      this.connection.quit();
    });
    this.connection.connect();

    console.log('Redis connected');
  }

  async save(key: string, value: {}): Promise<boolean> {
    try {
      await this.connection.set(key, JSON.stringify(value), {
        EX: 60, // The cache is valid for 60 seconds
      });
      return true;
    } catch (error: any) {
      dev_log(error);
      return false;
    }
  }

  async get(key: string) {
    try {
      return await this.connection.get(key);
    } catch (error: any) {
      dev_log(error);
      return ApiError(error.message);
    }
  }

  async delete(key: string) {
    try {
      return await this.connection.del(key);
    } catch (error: any) {
      dev_log(error);
      return ApiError(error.message);
    }
  }
}
