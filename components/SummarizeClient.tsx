'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, FileText, Copy, Check, Loader2 } from 'lucide-react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { useToast } from './ui/toast'

interface SummarizeClientProps {
  userId: string
  userEmail: string
}

export default function SummarizeClient({ userId, userEmail }: SummarizeClientProps) {
  const [emailText, setEmailText] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
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
          action: 'summarize',
          tone: null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate summary')
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

  const handleNewSummary = () => {
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
              Summarize Email 📄
            </h1>
            <p className="text-gray-600">Paste your email and get a concise AI-powered summary</p>
          </div>

          <Card className="shadow-2xl border-2 border-emerald-100 bg-gradient-to-br from-white to-emerald-50/30">
            <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 border-b-2 border-cyan-100">
              <CardTitle className="text-2xl bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">📄 Email Input</CardTitle>
              <CardDescription className="text-cyan-700 font-medium">Paste the email content below to get a summary</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
                  placeholder="Paste or type the email you want to summarize..."
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
                    Generating Summary...
                  </>
                ) : (
                  <>
                    <FileText className="h-5 w-5" />
                    Generate Summary
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* AI Response */}
          {aiResponse && (
            <Card className="mt-6 shadow-2xl animate-slide-up border-2 border-cyan-200 bg-gradient-to-br from-white to-blue-50/30">
              <CardHeader className="bg-gradient-to-r from-cyan-50 via-blue-50 to-sky-50 border-b-2 border-blue-100">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <FileText className="h-6 w-6 text-cyan-600 animate-pulse" />
                      <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">AI Generated Summary</span>
                    </CardTitle>
                    <CardDescription className="text-cyan-700 font-medium">Your email summary is ready 📄</CardDescription>
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
                <div className="bg-gradient-to-br from-cyan-50 via-blue-50 to-sky-50 border-2 border-cyan-300 rounded-xl p-6 shadow-inner">
                  <p className="text-gray-900 whitespace-pre-wrap leading-relaxed font-medium">{aiResponse}</p>
                </div>
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleNewSummary}
                    variant="outline"
                    className="flex-1"
                  >
                    Summarize Another
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
