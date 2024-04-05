import redis, { Commands, RedisClient } from 'redis';
import util from 'util';

import { logger } from 'utils/logger';

const { REDIS_URL: url } = process.env;

let client: RedisClient | null = null;

if (url) {
  // Required on heroku for redis ssl to work since they use self-signed certs
  // https://devcenter.heroku.com/articles/connecting-heroku-redis#connecting-in-node-js
  const tls =
    url.indexOf('rediss') >= 0
      ? {
          rejectUnauthorized: false,
        }
      : undefined;

  try {
    client = redis.createClient({ url, tls });
    logger.info('redis cache active');
  } catch (e) {
    logger.error('redis cache unable to start', {
      exception: e as Error,
      category: 'redis',
    });
  }
}

const asyncGet = client ? util.promisify(client.get).bind(client) : null;

const asyncSet: Commands<Promise<unknown>>['set'] | null = client
  ? util.promisify(client.set).bind(client)
  : null;

const asyncFlushall = client ? util.promisify(client.flushall).bind(client) : null;

export async function clear(): Promise<boolean> {
  if (!client || !asyncFlushall) {
    return true;
  }

  return await client.flushall();
}

export async function get<T = unknown | null>(cacheKey: string): Promise<T | null> {
  if (!client || !asyncGet) {
    return null;
  }

  let cached;

  try {
    cached = await asyncGet(cacheKey);
  } catch (e) {
    if (e instanceof Error) {
      logger.error('unable to get from cache', {
        exception: e,
        metadata: { cacheKey },
        category: 'redis',
      });
    }
    return null;
  }

  if (!cached) {
    return null;
  }

  let result;

  try {
    result = JSON.parse(cached);
  } catch (e) {
    if (e instanceof Error) {
      logger.error('unable to parse data from cache', {
        exception: e,
        metadata: { cacheKey },
        category: 'redis',
      });
    }
    return null;
  }

  return result as T;
}

export async function set<T>(cacheKey: string, data: T, ttl = 10): Promise<boolean> {
  if (!client || !asyncSet) {
    return false;
  }

  try {
    const serialized = JSON.stringify(data);
    await asyncSet(cacheKey, serialized, 'EX', ttl);
  } catch (e) {
    logger.error('unable to set cache', {
      exception: e as Error,
      metadata: { cacheKey },
      category: 'redis',
    });
    return false;
  }

  return true;
}
