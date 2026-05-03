import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Profile } from '@/types'

export function useCurrentUser() {
  const [supabaseUser, setSupabaseUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  // Convex profile
  const profile = useQuery(api.profiles.getByUserId, supabaseUser ? { userId: supabaseUser.id } : "skip")
  const syncProfile = useMutation(api.profiles.syncProfile)

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setSupabaseUser(user)
      setIsLoading(false)

      if (user) {
        // Sync to Convex
        await syncProfile({
          userId: user.id,
          fullName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          email: user.email!,
          role: user.user_metadata?.role || 'user',
          avatarUrl: user.user_metadata?.avatar_url,
        })
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSupabaseUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return {
    user: supabaseUser,
    profile,
    isLoading: isLoading || (supabaseUser && profile === undefined),
  }
}
