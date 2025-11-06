# Smart Email Reply Assistant 

A modern, AI-powered web application that helps you generate professional email replies and summaries using OpenRouter's AI models. Built with Next.js 14, Supabase, and TailwindCSS.

## Features

- **AI-Powered Replies** - Generate professional email responses instantly
- **Email Summaries** - Get concise summaries of long emails
- **Account Management** - Full account control with secure deletion
- **Beautiful UI** - Modern green & blue design with smooth animations
- **Secure Authentication** - Powered by Supabase Auth
- **Fully Responsive** - Works perfectly on all devices
- **Fast & Optimized** - Built with Next.js 14 for maximum performance
- **AI-Powered Responses**: Generate professional email replies or summaries using free AI models
- **Tone Customization**: Choose between Friendly, Professional, or Concise tones for replies
- **User Authentication**: Secure email/password authentication via Supabase
- **History Management**: View, search, and delete past AI-generated responses
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Scalable Architecture**: Modular codebase ready for SaaS expansion

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Authentication & Database**: Supabase
- **AI Integration**: OpenRouter API (free tier with Llama 3.2)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Language**: TypeScript

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Supabase account (free tier works)
- An OpenRouter API key (free tier available)

## 🔧 Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd "e:/MVP 2"
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once your project is ready, go to **Settings** → **API**
3. Copy your **Project URL** and **anon/public key**

### 3. Create Database Table

In your Supabase project, go to **SQL Editor** and run this query:

```sql
-- Create replies table
CREATE TABLE replies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  original_email TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('reply', 'summarize')),
  tone TEXT CHECK (tone IN ('friendly', 'professional', 'concise')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE replies ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only see their own replies
CREATE POLICY "Users can view own replies"
  ON replies FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy: Users can insert their own replies
CREATE POLICY "Users can insert own replies"
  ON replies FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can delete their own replies
CREATE POLICY "Users can delete own replies"
  ON replies FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX idx_replies_user_id ON replies(user_id);
CREATE INDEX idx_replies_created_at ON replies(created_at DESC);
```

### 4. Get OpenRouter API Key

1. Go to [openrouter.ai](https://openrouter.ai)
2. Sign up for a free account
3. Navigate to **Keys** section
4. Create a new API key
5. Copy the key (it starts with `sk-or-...`)

### 5. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
# Copy the example file
cp .env.local.example .env.local
```

Edit `.env.local` and add your credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# OpenRouter API Configuration
OPENROUTER_API_KEY=sk-or-your-openrouter-api-key
```

**Important**: To enable account deletion, you need to add the `SUPABASE_SERVICE_ROLE_KEY`:
1. Go to your Supabase project → **Settings** → **API**
2. Copy the **service_role** key (keep this secret!)
3. Add it to your `.env.local` file

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage Guide

### First Time Setup

1. **Sign Up**: Navigate to the signup page and create an account
2. **Login**: Use your credentials to log in
3. **Generate Reply**: Click "New Reply" to create your first AI-generated response

### Generating Replies

1. Choose action type: **Generate Polite Reply** or **Summarize Email**
2. If generating a reply, select the tone (Friendly, Professional, or Concise)
3. Paste or type the email text
4. Click **Generate** and wait for the AI response
5. Copy the response or save it to your history

### Managing History

- View all your past interactions on the dashboard
- Delete entries you no longer need
- See timestamps and metadata for each interaction

## 🏗️ Project Structure

```
e:/MVP 2/
├── app/
│   ├── api/
│   │   └── generate-reply/
│   │       └── route.ts          # AI generation API endpoint
│   ├── dashboard/
│   │   └── page.tsx               # User history dashboard
│   ├── login/
│   │   └── page.tsx               # Login page
│   ├── new-reply/
│   │   └── page.tsx               # New reply generation page
│   ├── signup/
│   │   └── page.tsx               # Signup page
│   ├── globals.css                # Global styles
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Home page (redirects)
├── components/
│   ├── DashboardClient.tsx        # Dashboard client component
│   └── NewReplyClient.tsx         # New reply client component
├── lib/
│   └── supabase/
│       ├── client.ts              # Supabase client (browser)
│       ├── server.ts              # Supabase client (server)
│       └── middleware.ts          # Supabase middleware
├── middleware.ts                  # Next.js middleware
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## 🔒 Security Features

- **Row Level Security**: Users can only access their own data
- **Server-side API calls**: AI API key never exposed to client
- **Secure authentication**: Handled by Supabase
- **Protected routes**: Middleware ensures authentication

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel dashboard
5. Deploy!

### Environment Variables for Production

Make sure to add these in your deployment platform:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (required for account deletion)
- `OPENROUTER_API_KEY`

## 🎨 Customization

### Change AI Model

Edit `app/api/generate-reply/route.ts` and modify the `model` parameter:

```typescript
model: 'meta-llama/llama-3.2-3b-instruct:free', // Change this
```

Available free models on OpenRouter:
- `meta-llama/llama-3.2-3b-instruct:free`
- `google/gemma-2-9b-it:free`
- `mistralai/mistral-7b-instruct:free`

### Customize Styling

All styles use Tailwind CSS. Modify classes in component files or update `tailwind.config.ts` for theme changes.

## 🐛 Troubleshooting

### "Unauthorized" Error
- Check that your `.env.local` file has correct Supabase credentials
- Ensure you're logged in

### AI Generation Fails
- Verify your OpenRouter API key is correct
- Check you have credits/quota remaining
- Review browser console for detailed error messages

### Database Errors
- Ensure the `replies` table was created correctly
- Verify Row Level Security policies are in place
- Check that user is authenticated

## 📝 Future Enhancements

- Email template library
- Multi-language support
- Bulk email processing
- Chrome extension integration
- Team collaboration features
- Analytics dashboard

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js, Supabase, and OpenRouter
