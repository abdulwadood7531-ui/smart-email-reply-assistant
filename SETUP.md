# Quick Setup Guide

## Step-by-Step Setup (5 minutes)

### 1. Install Dependencies

```bash
npm install
```

### 2. Supabase Setup

**Create Project:**
1. Visit https://supabase.com
2. Click "New Project"
3. Fill in project details
4. Wait for database to initialize (~2 minutes)

**Get Credentials:**
1. Go to Settings → API
2. Copy "Project URL" 
3. Copy "anon public" key

**Create Database Table:**
1. Go to SQL Editor
2. Click "New Query"
3. Paste and run this SQL:

```sql
CREATE TABLE replies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  original_email TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('reply', 'summarize')),
  tone TEXT CHECK (tone IN ('friendly', 'professional', 'concise')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own replies"
  ON replies FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own replies"
  ON replies FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own replies"
  ON replies FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_replies_user_id ON replies(user_id);
CREATE INDEX idx_replies_created_at ON replies(created_at DESC);
```

### 3. OpenRouter Setup

1. Visit https://openrouter.ai
2. Sign up (free)
3. Go to Keys section
4. Create new API key
5. Copy the key (starts with `sk-or-`)

### 4. Environment Variables

Create `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxx
```

### 5. Run the App

```bash
npm run dev
```

Visit http://localhost:3000

## Verification Checklist

- [ ] Dependencies installed (`node_modules` folder exists)
- [ ] Supabase project created
- [ ] Database table created (check in Supabase Table Editor)
- [ ] `.env.local` file created with all 3 variables
- [ ] Dev server running without errors
- [ ] Can access http://localhost:3000

## Common Issues

**Port 3000 already in use:**
```bash
# Use different port
npm run dev -- -p 3001
```

**Module not found errors:**
```bash
# Delete and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Supabase connection errors:**
- Double-check URL and key in `.env.local`
- Ensure no extra spaces or quotes
- Restart dev server after changing `.env.local`

## Testing the App

1. **Sign Up**: Create a test account
2. **Generate Reply**: 
   - Paste: "Hi, I need help with my order #12345"
   - Click Generate Reply
   - Should see AI response in ~3-5 seconds
3. **Check History**: Navigate to dashboard to see saved reply
4. **Delete Entry**: Click trash icon to remove

## Next Steps

- Customize AI prompts in `app/api/generate-reply/route.ts`
- Adjust styling in component files
- Add custom features
- Deploy to Vercel

Need help? Check README.md for detailed documentation.
