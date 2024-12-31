import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, search, hash } = request.nextUrl;

  // Skip paths that don't require localization
  if (pathname.startsWith('/_next') || pathname.includes('.')) return;

  const locale = request.headers.get('accept-language')?.split(',')[0]?.slice(0, 2) || 'en';
  const availableLocales = ['en', 'th'];

  // Redirect if no locale is set in the URL
  if (!availableLocales.some((l) => pathname.startsWith(`/${l}`))) {
    const newPathname = `/${availableLocales.includes(locale) ? locale : 'en'}${pathname}`;
    const newUrl = new URL(newPathname, request.url);
    newUrl.search = search; // Retain query parameters
    newUrl.hash = hash; // Retain hash fragment

    return NextResponse.redirect(newUrl);
  }
}
