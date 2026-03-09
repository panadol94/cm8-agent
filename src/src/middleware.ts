import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl
  const hostname = request.headers.get('host') || ''

  // Canonical redirect: non-www → www
  if (hostname === 'cm8vvip.com') {
    const redirectUrl = new URL(url.pathname + url.search, 'https://www.cm8vvip.com')
    return NextResponse.redirect(redirectUrl, 301)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
}
