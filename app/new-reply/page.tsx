import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import NewReplyClient from '@/components/NewReplyClient'

export default async function NewReplyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return <NewReplyClient userId={user.id} userEmail={user.email || ''} />
}
