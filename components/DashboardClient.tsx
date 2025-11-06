'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Mail, Trash2, Plus, TrendingUp, FileText, Clock, Sparkles, ArrowRight } from 'lucide-react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'

interface Reply {
  id: string
  original_email: string
  ai_response: string
  action_type: string
  tone: string | null
  created_at: string
}

interface DashboardClientProps {
  replies: Reply[]
  userEmail: string
}

export default function DashboardClient({ replies: initialReplies, userEmail }: DashboardClientProps) {
  const [replies, setReplies] = useState(initialReplies)
  const [deleting, setDeleting] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const userName = userEmail.split('@')[0]

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) return

    setDeleting(id)
    const { error } = await supabase
      .from('replies')
      .delete()
      .eq('id', id)

    if (!error) {
      setReplies(replies.filter(r => r.id !== id))
    }
    setDeleting(null)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50">
      <Sidebar />
      <Navbar userEmail={userEmail} />
      
      <main className="lg:ml-64 p-4 sm:p-6 lg:p-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {userName}! 👋
          </h1>
          <p className="text-gray-600">Here's what's happening with your email assistant today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-l-4 border-l-emerald-500 bg-gradient-to-br from-white to-emerald-50/50 hover:shadow-xl transition-all hover:scale-105">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-emerald-700 font-semibold">Total Replies</CardDescription>
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <FileText className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">{replies.length}</div>
              <p className="text-xs text-emerald-600 mt-1 font-medium">All time</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-cyan-500 bg-gradient-to-br from-white to-cyan-50/50 hover:shadow-xl transition-all hover:scale-105">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-cyan-700 font-semibold">This Month</CardDescription>
                <div className="p-2 bg-cyan-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-cyan-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                {replies.filter(r => new Date(r.created_at).getMonth() === new Date().getMonth()).length}
              </div>
              <p className="text-xs text-cyan-600 mt-1 font-medium">Generated replies</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500 bg-gradient-to-br from-white to-blue-50/50 hover:shadow-xl transition-all hover:scale-105">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-blue-700 font-semibold">Last Activity</CardDescription>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {replies.length > 0 ? formatDate(replies[0].created_at).split(',')[0] : 'No activity'}
              </div>
              <p className="text-xs text-blue-600 mt-1 font-medium">Most recent</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8 bg-gradient-to-br from-emerald-500 via-green-500 to-cyan-500 text-white border-0 shadow-2xl shadow-emerald-300/40">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2 text-2xl">
              <Sparkles className="h-7 w-7 animate-pulse" />
              Quick Actions
            </CardTitle>
            <CardDescription className="text-emerald-50 text-base">
              Get started with your AI email assistant
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/new-reply" className="flex-1">
              <Button 
                variant="outline" 
                className="w-full bg-white text-emerald-700 hover:bg-emerald-50 border-0 h-auto py-5 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Plus className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-base">Generate New Reply</div>
                    <div className="text-xs text-emerald-600">Create AI-powered email response</div>
                  </div>
                </div>
              </Button>
            </Link>
            <Link href="/summarize" className="flex-1">
              <Button 
                variant="outline" 
                className="w-full bg-white text-cyan-700 hover:bg-cyan-50 border-0 h-auto py-5 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-100 rounded-lg">
                    <FileText className="h-5 w-5 text-cyan-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-base">Summarize Email</div>
                    <div className="text-xs text-cyan-600">Get concise email summaries</div>
                  </div>
                </div>
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="flex-1 bg-white/20 text-white hover:bg-white/30 border-white/40 h-auto py-5 backdrop-blur-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              onClick={() => document.getElementById('history')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-base">View History</div>
                  <div className="text-xs text-emerald-50">Browse past conversations</div>
                </div>
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* History Section */}
        <div id="history">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Recent History</h2>
              <p className="text-sm text-gray-600 mt-1">Your AI-generated email responses</p>
            </div>
            {replies.length > 0 && (
              <Link href="/new-reply">
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Reply
                </Button>
              </Link>
            )}
          </div>

          {replies.length === 0 ? (
            <Card className="text-center py-16">
              <CardContent className="pt-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-100 to-cyan-100 rounded-full mb-6">
                  <Mail className="h-10 w-10 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No replies yet</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Get started by creating your first AI-powered email reply
                </p>
                <Link href="/new-reply">
                  <Button size="lg" className="gap-2">
                    <Sparkles className="h-5 w-5" />
                    Create First Reply
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {replies.map((reply) => (
                <Card key={reply.id} className="hover:shadow-2xl transition-all duration-300 group border-2 border-transparent hover:border-emerald-200 bg-gradient-to-br from-white to-emerald-50/30">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md">
                            {reply.action_type === 'reply' ? '✉️ Reply' : '📝 Summary'}
                          </span>
                          {reply.tone && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 capitalize border border-cyan-200">
                              {reply.tone}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
                          <Clock className="h-3 w-3" />
                          {formatDate(reply.created_at)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(reply.id)}
                        disabled={deleting === reply.id}
                        className="text-gray-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition disabled:opacity-50 opacity-0 group-hover:opacity-100 border border-transparent hover:border-red-200"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-emerald-700 uppercase mb-2 flex items-center gap-1">
                        <span className="w-1 h-4 bg-emerald-500 rounded"></span>
                        Original Email
                      </h4>
                      <p className="text-sm text-gray-700 bg-white border-2 border-emerald-100 p-3 rounded-lg line-clamp-2 shadow-sm">
                        {reply.original_email}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-cyan-700 uppercase mb-2 flex items-center gap-1">
                        <span className="w-1 h-4 bg-cyan-500 rounded"></span>
                        AI Response
                      </h4>
                      <p className="text-sm text-gray-900 bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 p-3 rounded-lg line-clamp-3 whitespace-pre-wrap border-2 border-cyan-100 shadow-sm">
                        {reply.ai_response}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
