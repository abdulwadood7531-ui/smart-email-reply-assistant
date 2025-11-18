import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Paths that don't require authentication
const publicPaths = [
  '/login',
  '/signup',
  '/auth/callback',
  '/_next',
  '/favicon.ico',
  '/api/health',
  '/'
]

export async function updateSession(request: NextRequest) {
  // Skip middleware for static files, API routes, and assets
  if (request.nextUrl.pathname.startsWith('/_next/') || 
      request.nextUrl.pathname.startsWith('/api/') ||
      request.nextUrl.pathname.startsWith('/static/') ||
      request.nextUrl.pathname.match(/\.(css|js|jpg|jpeg|png|gif|ico|svg)$/)) {
    return NextResponse.next()
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Skip auth checks for public paths
  if (publicPaths.some(path => request.nextUrl.pathname === path || 
      (path.endsWith('*') && request.nextUrl.pathname.startsWith(path.slice(0, -1))))) {
    return response
  }

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            request.cookies.set({
              name,
              value,
              ...options,
            })
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            response.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name: string, options: CookieOptions) {
            request.cookies.set({
              name,
              value: '',
              ...options,
            })
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            response.cookies.set({
              name,
              value: '',
              ...options,
            })
          },
        },
      }
    )

    // Only check auth for protected routes
    const { data: { user }, error } = await supabase.auth.getUser()
    
    // If no user and trying to access protected route, redirect to login
    if (!user && !publicPaths.some(path => request.nextUrl.pathname === path)) {
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    return response

  } catch (error) {
    console.error('Middleware error:', error)
    // In case of error, continue with the response
    return response
  }
}
