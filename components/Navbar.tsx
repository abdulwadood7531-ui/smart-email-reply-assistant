'use client'

import { LogOut, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface NavbarProps {
  userEmail: string
}

export default function Navbar({ userEmail }: NavbarProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="lg:ml-64 bg-white/80 backdrop-blur-lg border-b-2 border-emerald-200/50 sticky top-0 z-20 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1" />
          
          <div className="flex items-center gap-4">
            {/* User info */}
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-xl border-2 border-emerald-200 shadow-sm">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 via-green-500 to-cyan-500 rounded-full flex items-center justify-center shadow-md">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-emerald-900">Account</p>
                <p className="text-xs text-emerald-600 font-medium">{userEmail}</p>
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-emerald-700 hover:text-white hover:bg-gradient-to-r hover:from-emerald-500 hover:to-cyan-500 rounded-xl transition-all border-2 border-emerald-300 hover:border-transparent shadow-sm hover:shadow-lg"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
