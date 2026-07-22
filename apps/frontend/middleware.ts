import { NextResponse, type NextRequest } from 'next/server'

const protectedPaths = ['/dashboard', '/editor', '/workspace', '/project', '/settings', '/templates']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get('accessToken')

  if (protectedPaths.some(p => pathname.startsWith(p)) && !accessToken) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/editor/:path*', '/workspace/:path*', '/project/:path*', '/settings/:path*', '/templates/:path*'],
}
