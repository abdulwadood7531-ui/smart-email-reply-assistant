import { createClient, createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function DELETE() {
  try {
    const supabase = await createClient()
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Delete user's replies from the database
    const { error: repliesError } = await supabase
      .from('replies')
      .delete()
      .eq('user_id', user.id)

    if (repliesError) {
      console.error('Error deleting replies:', repliesError)
      // Continue with account deletion even if replies deletion fails
    }

    // Delete the user account using Supabase Admin API
    // This requires the service role key
    const adminClient = createAdminClient()
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id)

    if (deleteError) {
      return NextResponse.json(
        { error: 'Failed to delete account: ' + deleteError.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Account deleted successfully' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error in delete-account:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    )
  }
}
