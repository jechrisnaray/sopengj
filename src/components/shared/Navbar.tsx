'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { LogOut, User, LayoutDashboard, ChevronDown, Menu, X, Bell } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'

export default function Navbar() {
  const router = useRouter()
  const { user, profile, isLoading } = useCurrentUser()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Real-time notification count from Convex
  const notifications = useQuery(api.notifications.list, profile ? { userId: profile._id } : "skip")
  const unreadCount = notifications?.filter(n => !n.isRead).length ?? 0

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    
    // Clear mock cookies if any
    document.cookie = "mock-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
    document.cookie = "mock-role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
    
    toast.success('Berhasil keluar')
    setDropdownOpen(false)
    router.push('/login')
  }

  const dashboardLink = profile?.role === 'consultant' ? '/dashboard/consultant' : '/dashboard/user'
  const initials = profile?.fullName?.charAt(0)?.toUpperCase() ?? 'U'

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 transition-transform group-hover:scale-105">
              <span className="text-white font-black text-lg">K</span>
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">Konsul<span className="text-blue-600">In</span></span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/consultants"
              className="text-slate-600 hover:text-blue-600 text-sm font-bold transition-colors"
            >
              Cari Konsultan
            </Link>
            <Link
              href="/about"
              className="text-slate-600 hover:text-blue-600 text-sm font-bold transition-colors"
            >
              Tentang Kami
            </Link>
          </div>

          {/* Auth Area */}
          <div className="flex items-center gap-4">
            {isLoading ? (
              <div className="h-10 w-10 rounded-full bg-slate-100 animate-pulse hidden md:block" />
            ) : !user ? (
              <div className="hidden md:flex items-center gap-4">
                <Link
                  href="/login"
                  className="text-sm font-bold text-slate-600 hover:text-blue-600 transition"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-bold px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-95"
                >
                  Daftar Sekarang
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                {/* Notification Bell */}
                <button className="relative p-2 text-slate-400 hover:text-blue-600 transition-colors">
                  <Bell size={22} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Profile Dropdown */}
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
                  >
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white text-lg font-black shadow-md">
                      {initials}
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-black text-slate-900 leading-tight truncate max-w-[100px]">
                        {profile?.fullName}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                        {profile?.role}
                      </p>
                    </div>
                    <ChevronDown size={14} className={`text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {dropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                      <div className="absolute right-0 top-full mt-4 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="px-5 py-4 border-b border-slate-50">
                          <p className="text-xs font-bold text-slate-400 uppercase mb-1">Akun Terhubung</p>
                          <p className="text-sm font-black text-slate-900 truncate">{profile?.email}</p>
                        </div>

                        <div className="p-2">
                          <Link
                            href={dashboardLink}
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-all"
                          >
                            <LayoutDashboard size={18} />
                            Dashboard Utama
                          </Link>
                          <Link
                            href="/dashboard/profile"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-all"
                          >
                            <User size={18} />
                            Pengaturan Profil
                          </Link>
                        </div>

                        <div className="border-t border-slate-50 mt-1 p-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <LogOut size={18} />
                            Keluar Aplikasi
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-3 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white p-6 space-y-4 animate-in slide-in-from-top duration-300">
          <Link
            href="/consultants"
            onClick={() => setMobileOpen(false)}
            className="block text-lg font-black text-slate-900"
          >
            Cari Konsultan
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileOpen(false)}
            className="block text-lg font-black text-slate-900"
          >
            Tentang
          </Link>
          <div className="pt-4 border-t border-slate-50">
            {!user ? (
              <div className="space-y-3">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full py-4 text-center text-slate-900 font-bold border border-slate-200 rounded-2xl"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full py-4 text-center text-white bg-blue-600 font-bold rounded-2xl shadow-lg shadow-blue-100"
                >
                  Daftar
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  href={dashboardLink}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-4 py-4 text-slate-900 font-bold"
                >
                  <LayoutDashboard size={20} className="text-blue-600" /> Dashboard
                </Link>
                <Link
                  href="/dashboard/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-4 py-4 text-slate-900 font-bold"
                >
                  <User size={20} className="text-blue-600" /> Profil Saya
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-4 py-4 text-red-600 font-bold w-full"
                >
                  <LogOut size={20} /> Keluar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
