/**
 * Based on:
 * https://github.com/vercel/next.js/tree/canary/examples/cms-prismic
 */

import { NextApiRequest, NextApiResponse } from 'next';

import { linkResolver } from 'prismic/linkResolver';

import { prismicClient } from 'api/prismic';
import { getStringFromQueryString } from 'utils/queryString';

export default async function preview(req: NextApiRequest, res: NextApiResponse) {
  const ref = getStringFromQueryString(req.query.token);
  const documentId = getStringFromQueryString(req.query.documentId);

  if (!prismicClient) {
    return null;
  }

  if (!ref) {
    return res.status(401).json({ message: 'Missing ref from querystring' });
  }

  // Check the token parameter against the Prismic SDK
  const url = await prismicClient.resolvePreviewURL({
    linkResolver,
    previewToken: ref,
    documentID: documentId,
    defaultURL: '/',
  });

  if (!url) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  // Enable Preview Mode by setting the cookies
  res.setPreviewData({
    ref, // pass the ref to pages so that they can fetch the draft ref
  });

  // Redirect the user to the share endpoint from same origin. This is
  // necessary due to a Chrome bug:
  // https://bugs.chromium.org/p/chromium/issues/detail?id=696204
  res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
  res.write(
    `<!DOCTYPE html><html><head><meta http-equiv="Refresh" content="0; url=${url}" />
      <script>window.location.href = '${url}'</script>
      </head>`
  );

  res.end();
}
