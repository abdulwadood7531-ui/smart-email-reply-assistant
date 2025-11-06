# Setting Up Service Role Key for Account Deletion

The account deletion feature requires the Supabase Service Role Key to be configured. Follow these steps:

## 🔑 Getting Your Service Role Key

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **Settings** (gear icon in sidebar)
4. Click on **API** in the settings menu
5. Scroll down to **Project API keys** section
6. Find the **service_role** key (⚠️ **Secret** - never expose this publicly!)
7. Click the eye icon to reveal the key
8. Copy the entire key (starts with `eyJ...`)

## 💻 Local Development Setup

1. Open your `.env.local` file in the project root
2. Add the following line:
   ```
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```
3. Replace `your_service_role_key_here` with the actual key you copied
4. Save the file
5. Restart your development server:
   ```bash
   npm run dev
   ```

## 🚀 Vercel Deployment Setup

1. Go to your Vercel dashboard: https://vercel.com
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Set:
   - **Key**: `SUPABASE_SERVICE_ROLE_KEY`
   - **Value**: Your service role key (paste it here)
   - **Environment**: Select all (Production, Preview, Development)
6. Click **Save**
7. Redeploy your application:
   - Go to **Deployments** tab
   - Click the three dots on the latest deployment
   - Select **Redeploy**

## ⚠️ Security Warning

**NEVER commit the service role key to Git!**

- The `.env.local` file is already in `.gitignore`
- Never share this key publicly
- Never include it in client-side code
- Only use it in server-side API routes

## ✅ Verify Setup

After adding the key:

1. Go to your app's account page
2. Try to delete your account
3. If configured correctly, the deletion will work
4. If not configured, you'll see: "Account deletion is not configured. Please contact support."

## 🆘 Troubleshooting

### Error: "supabaseKey is required"
- The `SUPABASE_SERVICE_ROLE_KEY` is not set in your environment variables
- Follow the setup steps above

### Error: "Account deletion is not configured"
- The environment variable is not being read
- Make sure you restarted your dev server after adding the variable
- For Vercel, make sure you redeployed after adding the variable

### Still having issues?
- Check that the key is correct (no extra spaces)
- Verify the key is the **service_role** key, not the **anon** key
- Check your Vercel deployment logs for any errors
