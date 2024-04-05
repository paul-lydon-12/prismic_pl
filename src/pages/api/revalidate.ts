import { NextApiRequest, NextApiResponse } from 'next';

import { logger } from 'utils/logger';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const body = req.body;
  const { path, secret } = body;

  // use something like https://www.uuidgenerator.net to generate a "token"
  if (secret !== process.env.REVALIDATE_SECRET) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  try {
    // path is the actual path, i.e. /hafa-samband
    await res.revalidate(path);
    return res.json({ revalidated: true });
  } catch (e) {
    logger.error('Error revalidating', {
      exception: e as Error,
    });
    return res.status(500).send('Error revalidating');
  }
};
