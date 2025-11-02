import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { emailText, action, tone } = await request.json()

    if (!emailText || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Build the prompt based on action and tone
    let prompt = ''
    if (action === 'reply') {
      const toneInstruction = tone === 'friendly' ? 'friendly and warm' : 
                              tone === 'professional' ? 'professional and formal' : 
                              'concise and to the point'
      prompt = `Generate a ${toneInstruction} reply to the following email. Keep it polite and appropriate:\n\n${emailText}\n\nReply:`
    } else if (action === 'summarize') {
      prompt = `Summarize the following email in 2-3 sentences:\n\n${emailText}\n\nSummary:`
    }

    // Call OpenRouter API
    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'Smart Email Reply Assistant',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.2-3b-instruct:free', // Free model
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    if (!openRouterResponse.ok) {
      const errorData = await openRouterResponse.text()
      console.error('OpenRouter API error:', errorData)
      return NextResponse.json({ 
        error: 'Failed to generate AI response. Please check your API key.' 
      }, { status: 500 })
    }

    const data = await openRouterResponse.json()
    const aiResponse = data.choices[0]?.message?.content || 'No response generated'

    // Save to database
    const { error: dbError } = await supabase
      .from('replies')
      .insert({
        user_id: user.id,
        original_email: emailText,
        ai_response: aiResponse,
        action_type: action,
        tone: tone || null,
      })

    if (dbError) {
      console.error('Database error:', dbError)
      // Still return the AI response even if saving fails
    }

    return NextResponse.json({ response: aiResponse })
  } catch (error: any) {
    console.error('Error in generate-reply:', error)
    return NextResponse.json({ 
      error: error.message || 'An unexpected error occurred' 
    }, { status: 500 })
  }
}
