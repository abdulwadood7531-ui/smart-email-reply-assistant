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
  const [loading, setLoading] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) {
        setUserEmail(user.email)
      } else {
        router.push('/login')
      }
    }
    getUser()
  }, [supabase, router])

  const handleDeleteAccount = async () => {
    setLoading(true)
    setError(null)

    try {
      // Call the delete account API
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

      // Sign out the user
      await supabase.auth.signOut()
      
      // Redirect to signup page with success message
      router.push('/signup?deleted=true')
    } catch (err: any) {
      setError(err.message || 'An error occurred while deleting your account')
      setShowConfirmDialog(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-emerald-50 to-green-50">
      <Sidebar />
      <Navbar userEmail={userEmail} />
      
      <main className="lg:ml-64 pt-20 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 animate-slide-up">
            <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-600 via-emerald-600 to-green-600 bg-clip-text text-transparent mb-2">
              Account Settings
            </h1>
            <p className="text-emerald-700 font-medium">
              Manage your account preferences and data
            </p>
          </div>

          {/* Account Information Card */}
          <Card className="mb-6 bg-white/80 backdrop-blur-lg border-2 border-emerald-200/50 shadow-lg animate-slide-up">
            <CardHeader className="bg-gradient-to-br from-cyan-50 via-emerald-50 to-green-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 via-green-500 to-cyan-500 rounded-full flex items-center justify-center shadow-md">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-emerald-900">Account Information</CardTitle>
                  <CardDescription className="text-emerald-600 font-medium">Your registered email address</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-emerald-800">Email Address</label>
                <div className="px-4 py-3 bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-xl border-2 border-emerald-200">
                  <p className="text-emerald-900 font-medium">{userEmail}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone Card */}
          <Card className="bg-white/80 backdrop-blur-lg border-2 border-red-200/50 shadow-lg animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="bg-gradient-to-br from-red-50 to-orange-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-md">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-red-900">Danger Zone</CardTitle>
                  <CardDescription className="text-red-600 font-medium">Irreversible actions</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {error && (
                <div className="mb-4 bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                  <h3 className="text-lg font-bold text-red-900 mb-2">Delete Account</h3>
                  <p className="text-sm text-red-700 mb-4">
                    Once you delete your account, all your data including email replies and history will be permanently removed. 
                    You will be able to create a new account with the same email address after deletion.
                  </p>
                  
                  {!showConfirmDialog ? (
                    <Button
                      onClick={() => setShowConfirmDialog(true)}
                      variant="destructive"
                      className="w-full sm:w-auto bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete My Account
                    </Button>
                  ) : (
                    <div className="space-y-3 p-4 bg-white rounded-lg border-2 border-red-300">
                      <p className="text-sm font-bold text-red-900">
                        Are you absolutely sure? This action cannot be undone.
                      </p>
                      <div className="flex gap-3">
                        <Button
                          onClick={handleDeleteAccount}
                          disabled={loading}
                          variant="destructive"
                          className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Deleting...
                            </>
                          ) : (
                            <>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Yes, Delete Forever
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={() => setShowConfirmDialog(false)}
                          disabled={loading}
                          variant="outline"
                          className="flex-1 border-2 border-emerald-300 hover:bg-emerald-50"
                        >
                          Cancel
                        </Button>
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
