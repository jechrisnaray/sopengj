'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export async function logout() {
  const cookieStore = await cookies()

  // MOCK SIGNOUT
  if (cookieStore.get('mock-auth')?.value === 'true') {
    cookieStore.delete('mock-auth')
    cookieStore.delete('mock-role')
    cookieStore.delete('mock-email')
    cookieStore.delete('mock-name')
    redirect('/')
  }

  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

export async function getCurrentUser() {
  const cookieStore = await cookies()
  
  // MOCK AUTH CHECK
  const isMockAuth = cookieStore.get('mock-auth')?.value === 'true'
  if (isMockAuth) {
    return {
      user: {
        id: 'mock-user-id',
        email: cookieStore.get('mock-email')?.value || 'user@example.com',
        user_metadata: {
          full_name: cookieStore.get('mock-name')?.value || 'Demo User',
          role: cookieStore.get('mock-role')?.value || 'user'
        }
      },
      profile: {
        id: 'mock-user-id',
        full_name: cookieStore.get('mock-name')?.value || 'Demo User',
        email: cookieStore.get('mock-email')?.value || 'user@example.com',
        role: cookieStore.get('mock-role')?.value || 'user',
        avatar_url: null
      }
    }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { user: null, profile: null }

  // Fetch from Convex for server components
  const { ConvexHttpClient } = await import("convex/browser")
  const { api } = await import("../../../convex/_generated/api")
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)
  const profile = await convex.query(api.profiles.getByUserId, { userId: user.id })

  return { user, profile }
}
