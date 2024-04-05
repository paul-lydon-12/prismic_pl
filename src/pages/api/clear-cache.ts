import { NextApiRequest, NextApiResponse } from 'next';

import { clear } from 'api/cache';

export default async function clearCache(req: NextApiRequest, res: NextApiResponse) {
  const result = await clear();

  res.write(result.toString());
  res.end();
}
