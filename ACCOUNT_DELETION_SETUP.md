# Account Deletion Setup

## Required Environment Variable

To enable account deletion functionality, you need to add the Supabase Service Role Key to your environment variables.

### Local Development

Add the following to your `.env.local` file:

```
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### Vercel Deployment

Add the environment variable in your Vercel project settings:

1. Go to your project on Vercel
2. Navigate to Settings → Environment Variables
3. Add a new variable:
   - **Name**: `SUPABASE_SERVICE_ROLE_KEY`
   - **Value**: Your Supabase service role key (found in Supabase Dashboard → Project Settings → API)
   - **Environment**: Production, Preview, and Development

### Finding Your Service Role Key

1. Go to your Supabase project dashboard
2. Click on Settings (gear icon)
3. Navigate to API section
4. Copy the `service_role` key (⚠️ Keep this secret!)

## Important Security Notes

- **Never commit** the service role key to version control
- The service role key bypasses Row Level Security (RLS)
- Only use it in secure server-side code
- Keep it in environment variables only

## Features

- Users can delete their accounts from the Account page
- All user data (replies, history) is deleted
- Users can create a new account with the same email after deletion
- Secure deletion using Supabase Admin API
