'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold tracking-tight text-blue-600">KonsulIn</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex md:items-center md:space-x-8">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-blue-600">
            Beranda
          </Link>
          <Link href="/consultants" className="text-sm font-medium transition-colors hover:text-blue-600">
            Cari Konsultan
          </Link>
          <Link href="/about" className="text-sm font-medium transition-colors hover:text-blue-600">
            Tentang
          </Link>
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex md:items-center md:space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="relative h-10 w-10 rounded-full cursor-pointer hover:opacity-80 transition-opacity">
                  <Avatar className="h-10 w-10 border border-slate-200">
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.user_metadata?.full_name || 'User'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/dashboard/user" className="flex items-center w-full">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/settings" className="flex items-center w-full">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Keluar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Masuk</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Daftar</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isMenuOpen && (
        <div className="border-b bg-white p-4 md:hidden">
          <div className="flex flex-col space-y-4">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium">Beranda</Link>
            <Link href="/consultants" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium">Cari Konsultan</Link>
            <Link href="/about" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium">Tentang</Link>
            <hr />
            {user ? (
              <>
                <Link href="/dashboard/user" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium">Dashboard</Link>
                <button onClick={handleLogout} className="text-left text-sm font-medium text-red-600">Keluar</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium">Masuk</Link>
                <Link href="/register" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium">Daftar</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
