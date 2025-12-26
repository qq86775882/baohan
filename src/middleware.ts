import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // 定义需要认证的路径
  const protectedPaths = [
    /^\/admin\/.*$/,
    /^\/api\/admin\/.*$/,
    /^\/api\/guarantees\/.*$/,
    /^\/api\/auth\/.*$/
  ];

  // 检查当前路径是否需要认证
  const isProtected = protectedPaths.some(pattern => pattern.test(request.nextUrl.pathname));

  if (isProtected) {
    // 检查认证令牌
    const token = request.cookies.get('auth-token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '') ||
                  request.headers.get('authorization')?.replace('Basic ', '');

    if (!token) {
      // 重定向到登录页面
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * 匹配所有请求路径，除了以这些开头的：
     * - api (静态文件和_next/)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' }
      ]
    },
    {
      source: '/admin/:path*',
    },
    {
      source: '/api/:path*',
    }
  ],
};