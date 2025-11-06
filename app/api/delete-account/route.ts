import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
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

    const userId = user.id

    // Delete user's data from replies table (will cascade automatically due to ON DELETE CASCADE)
    const { error: deleteDataError } = await supabase
      .from('replies')
      .delete()
      .eq('user_id', userId)

    if (deleteDataError) {
      console.error('Error deleting user data:', deleteDataError)
      // Continue with account deletion even if data deletion fails
    }

    // Create admin client with service role key to delete the user
    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Delete the user account from Supabase Auth using admin client
    const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (deleteUserError) {
      console.error('Failed to delete user:', deleteUserError)
      return NextResponse.json(
        { error: 'Failed to delete account. Please contact support.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Account deleted successfully' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error in delete-account route:', error)
    return NextResponse.json(
      { error: error.message || 'An error occurred while deleting the account' },
      { status: 500 }
    )
  }
}
