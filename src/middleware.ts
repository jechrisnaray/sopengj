import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Route yang bisa diakses tanpa login
const PUBLIC_ROUTES = ['/login', '/register']

// Route yang HANYA bisa diakses saat BELUM login
const AUTH_ONLY_ROUTES = ['/login', '/register']

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })
  const { pathname } = request.nextUrl

  // MOCK AUTH CHECK: Untuk demo/pengerjaan
  const isMockAuth = request.cookies.get('mock-auth')?.value === 'true'
  const mockRole = request.cookies.get('mock-role')?.value || 'user'

  if (isMockAuth) {
    if (AUTH_ONLY_ROUTES.includes(pathname) || pathname === '/') {
      const dest = mockRole === 'consultant' ? '/dashboard/consultant' : '/dashboard/user'
      return NextResponse.redirect(new URL(dest, request.url))
    }
    return supabaseResponse
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // 1. Jika sudah login dan mencoba akses login/register atau landing page
  if (user && (AUTH_ONLY_ROUTES.includes(pathname) || pathname === '/')) {
    const role = user.user_metadata?.role || 'user'
    const dest = role === 'consultant' ? '/dashboard/consultant' : '/dashboard/user'
    return NextResponse.redirect(new URL(dest, request.url))
  }

  // 2. Jika belum login dan mencoba akses rute terproteksi (seluruh app)
  const isPublic = PUBLIC_ROUTES.includes(pathname) || pathname.startsWith('/api/ai/recommend')
  
  if (!user && !isPublic) {
    const url = new URL('/login', request.url)
    if (pathname !== '/') url.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
