'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Sparkles, Copy, Check, Loader2, FileText } from 'lucide-react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { useToast } from './ui/toast'

interface NewReplyClientProps {
  userId: string
  userEmail: string
}

export default function NewReplyClient({ userId, userEmail }: NewReplyClientProps) {
  const [emailText, setEmailText] = useState('')
  const [action, setAction] = useState<'reply' | 'summarize'>('reply')
  const [tone, setTone] = useState<'friendly' | 'professional' | 'concise'>('professional')
  const [aiResponse, setAiResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const router = useRouter()
  const { showToast, ToastComponent } = useToast()

  const handleGenerate = async () => {
    if (!emailText.trim()) {
      setError('Please enter an email message')
      return
    }

    setError(null)
    setLoading(true)
    setAiResponse('')

    try {
      const response = await fetch('/api/generate-reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailText,
          action,
          tone: action === 'reply' ? tone : null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate response')
      }

      setAiResponse(data.response)
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(aiResponse)
    showToast('✓ Copied to clipboard!')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleNewReply = () => {
    setEmailText('')
    setAiResponse('')
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50">
      <Sidebar />
      <Navbar userEmail={userEmail} />
      {ToastComponent}
      
      <main className="lg:ml-64 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-slide-up">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition mb-4 font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Generate AI Reply ✨
            </h1>
            <p className="text-gray-600">Paste your email and let AI create a professional response</p>
          </div>

          <Card className="shadow-2xl border-2 border-emerald-100 bg-gradient-to-br from-white to-emerald-50/30">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-cyan-50 border-b-2 border-emerald-100">
              <CardTitle className="text-2xl bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">✨ Email Input</CardTitle>
              <CardDescription className="text-emerald-700 font-medium">Choose your action and paste the email content below</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Action Type Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Action Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setAction('reply')}
                    className={`py-5 px-4 rounded-xl border-3 font-bold transition-all ${
                      action === 'reply'
                        ? 'border-emerald-500 bg-gradient-to-br from-emerald-500 via-green-500 to-cyan-500 text-white shadow-xl shadow-emerald-300/40 scale-105'
                        : 'border-emerald-200 bg-white text-emerald-700 hover:border-emerald-300 hover:shadow-lg hover:scale-102'
                    }`}
                  >
                    <Sparkles className="h-6 w-6 mx-auto mb-2" />
                    Generate Reply
                  </button>
                  <button
                    onClick={() => setAction('summarize')}
                    className={`py-5 px-4 rounded-xl border-3 font-bold transition-all ${
                      action === 'summarize'
                        ? 'border-cyan-500 bg-gradient-to-br from-cyan-500 via-blue-500 to-sky-500 text-white shadow-xl shadow-cyan-300/40 scale-105'
                        : 'border-cyan-200 bg-white text-cyan-700 hover:border-cyan-300 hover:shadow-lg hover:scale-102'
                    }`}
                  >
                    <FileText className="h-6 w-6 mx-auto mb-2" />
                    Summarize
                  </button>
                </div>
              </div>

              {/* Tone Selection (only for reply) */}
              {action === 'reply' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Tone</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['friendly', 'professional', 'concise'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTone(t)}
                        className={`py-3 px-4 rounded-xl border-2 font-bold text-sm transition-all capitalize ${
                          tone === t
                            ? 'border-cyan-500 bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-300/40'
                            : 'border-cyan-200 bg-white text-cyan-700 hover:border-cyan-300 hover:shadow-md'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Email Input */}
              <div>
                <label htmlFor="emailText" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Message
                </label>
                <Textarea
                  id="emailText"
                  value={emailText}
                  onChange={(e) => setEmailText(e.target.value)}
                  rows={10}
                  className="resize-none text-base"
                  placeholder="Paste or type the email you want to reply to or summarize..."
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={loading || !emailText.trim()}
                size="lg"
                className="w-full gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Generate {action === 'reply' ? 'Reply' : 'Summary'}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* AI Response */}
          {aiResponse && (
            <Card className="mt-6 shadow-2xl animate-slide-up border-2 border-emerald-200 bg-gradient-to-br from-white to-cyan-50/30">
              <CardHeader className="bg-gradient-to-r from-emerald-50 via-cyan-50 to-blue-50 border-b-2 border-cyan-100">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <Sparkles className="h-6 w-6 text-emerald-600 animate-pulse" />
                      <span className="bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">AI Generated Response</span>
                    </CardTitle>
                    <CardDescription className="text-emerald-700 font-medium">Your professional email response is ready ✨</CardDescription>
                  </div>
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-green-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 border-2 border-emerald-300 rounded-xl p-6 shadow-inner">
                  <p className="text-gray-900 whitespace-pre-wrap leading-relaxed font-medium">{aiResponse}</p>
                </div>
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleNewReply}
                    variant="outline"
                    className="flex-1"
                  >
                    Generate Another
                  </Button>
                  <Link href="/dashboard" className="flex-1">
                    <Button variant="default" className="w-full">
                      View History
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
