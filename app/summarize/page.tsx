import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import SummarizeClient from '@/components/SummarizeClient'

export default async function SummarizePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return <SummarizeClient userId={user.id} userEmail={user.email || ''} />
}
