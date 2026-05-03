'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import { 
  LayoutDashboard, 
  Calendar, 
  User, 
  Settings, 
  LogOut, 
  MessageSquare,
  BarChart3
} from 'lucide-react'

interface SidebarProps {
  role: 'user' | 'consultant'
  onLogout: () => void
}

export function Sidebar({ role, onLogout }: SidebarProps) {
  const pathname = usePathname()
  const isConsultant = role === 'consultant'

  const menuItems = isConsultant ? [
    { name: 'Ringkasan', href: '/dashboard/consultant', icon: LayoutDashboard },
    { name: 'Jadwal Saya', href: '/dashboard/consultant/schedule', icon: Calendar },
    { name: 'Statistik', href: '/dashboard/consultant/stats', icon: BarChart3 },
    { name: 'Pesan', href: '/dashboard/messages', icon: MessageSquare },
    { name: 'Profil', href: '/dashboard/profile', icon: User },
  ] : [
    { name: 'Dashboard', href: '/dashboard/user', icon: LayoutDashboard },
    { name: 'Booking Saya', href: '/dashboard/user/bookings', icon: Calendar },
    { name: 'Profil', href: '/dashboard/profile', icon: User },
    { name: 'Pengaturan', href: '/dashboard/settings', icon: Settings },
  ]

  return (
    <div className="flex h-full flex-col bg-white border-r border-slate-200 w-64">
      <div className="p-6">
        <Link href="/" className="text-2xl font-bold text-blue-600">KonsulIn</Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all",
                isActive 
                  ? "bg-blue-50 text-blue-600" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-all"
        >
          <LogOut className="h-5 w-5" />
          Keluar
        </button>
      </div>
    </div>
  )
}
