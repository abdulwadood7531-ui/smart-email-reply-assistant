'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { User, Trash2, Loader2, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'

export default function AccountPage() {
  const [userEmail, setUserEmail] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [confirmEmail, setConfirmEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        setUserEmail(user.email || '')
      }
      setLoading(false)
    }
    getUser()
  }, [router, supabase.auth])

  const handleDeleteAccount = async () => {
    if (confirmEmail !== userEmail) {
      setError('Email does not match. Please type your email correctly.')
      return
    }

    setDeleting(true)
    setError(null)

    try {
      const response = await fetch('/api/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete account')
      }

      // Sign out and redirect to signup page
      await supabase.auth.signOut()
      router.push('/signup')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'An error occurred while deleting your account')
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 via-emerald-50 to-green-50">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-emerald-50 to-green-50">
      <Sidebar />
      <Navbar userEmail={userEmail} />
      
      <main className="lg:ml-64 p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-600 via-emerald-600 to-green-600 bg-clip-text text-transparent mb-2">
              Account Settings
            </h1>
            <p className="text-emerald-700 font-medium">Manage your account preferences</p>
          </div>

          {/* Account Information Card */}
          <Card className="mb-6 bg-white/80 backdrop-blur-sm border-2 border-emerald-200/50 shadow-lg">
            <CardHeader className="bg-gradient-to-br from-cyan-50 via-emerald-50 to-green-50">
              <CardTitle className="text-2xl font-bold text-emerald-900 flex items-center gap-2">
                <User className="h-6 w-6" />
                Account Information
              </CardTitle>
              <CardDescription className="text-emerald-700">Your account details</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-emerald-800">Email Address</label>
                  <div className="mt-2 p-3 bg-emerald-50 border-2 border-emerald-200 rounded-lg">
                    <p className="text-emerald-900 font-medium">{userEmail}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone Card */}
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-red-200 shadow-lg">
            <CardHeader className="bg-gradient-to-br from-red-50 to-orange-50">
              <CardTitle className="text-2xl font-bold text-red-900 flex items-center gap-2">
                <AlertTriangle className="h-6 w-6" />
                Danger Zone
              </CardTitle>
              <CardDescription className="text-red-700">Irreversible actions</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                  <h3 className="text-lg font-bold text-red-900 mb-2">Delete Account</h3>
                  <p className="text-sm text-red-700 mb-4">
                    Once you delete your account, there is no going back. This will permanently delete your account and all associated data including email replies and summaries.
                  </p>
                  
                  {!showConfirmDialog ? (
                    <Button
                      onClick={() => setShowConfirmDialog(true)}
                      variant="destructive"
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  ) : (
                    <div className="space-y-4 animate-slide-up">
                      <div className="p-4 bg-white border-2 border-red-300 rounded-lg">
                        <p className="text-sm font-bold text-red-900 mb-3">
                          Are you absolutely sure? This action cannot be undone.
                        </p>
                        <p className="text-sm text-red-700 mb-3">
                          Please type <span className="font-bold">{userEmail}</span> to confirm.
                        </p>
                        <input
                          type="email"
                          value={confirmEmail}
                          onChange={(e) => setConfirmEmail(e.target.value)}
                          placeholder="Enter your email"
                          className="w-full px-3 py-2 border-2 border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mb-3"
                        />
                        
                        {error && (
                          <div className="mb-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                            {error}
                          </div>
                        )}
                        
                        <div className="flex gap-3">
                          <Button
                            onClick={handleDeleteAccount}
                            disabled={deleting || confirmEmail !== userEmail}
                            variant="destructive"
                            className="bg-red-600 hover:bg-red-700"
                          >
                            {deleting ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Deleting...
                              </>
                            ) : (
                              <>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Yes, Delete My Account
                              </>
                            )}
                          </Button>
                          <Button
                            onClick={() => {
                              setShowConfirmDialog(false)
                              setConfirmEmail('')
                              setError(null)
                            }}
                            disabled={deleting}
                            variant="outline"
                            className="border-2 border-emerald-300"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
