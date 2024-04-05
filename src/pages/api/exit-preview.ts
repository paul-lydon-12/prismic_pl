import { NextApiRequest, NextApiResponse } from 'next';

export default function exitPreview(req: NextApiRequest, res: NextApiResponse) {
  const redirect = (req.query.redirect || '/') as string;
  res.clearPreviewData();

  res.writeHead(307, { Location: redirect });
  res.end();
}
