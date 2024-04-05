import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const FORCE_HTTPS = process.env.FORCE_HTTPS;
const REDIRECT_FROM_WWW = process.env.REDIRECT_FROM_WWW;

export function middleware(req: NextRequest) {
  const host = req.headers.get('host');

  if (
    FORCE_HTTPS === 'true' &&
    req.headers.get('x-forwarded-proto') !== 'https' &&
    !host?.includes('localhost')
  ) {
    return NextResponse.redirect(`https://${host}${req.nextUrl.pathname}`, 301);
  }

  if (REDIRECT_FROM_WWW === 'true' && host?.toLowerCase().startsWith('www.')) {
    return NextResponse.redirect(
      `https://${host.substring(4)}${req.nextUrl.pathname}`,
      301
    );
  }
}
