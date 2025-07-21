# Supabase Environment Variables Setup Guide

This guide explains how to set up your environment variables for Supabase integration.

## Required Credentials

From your Supabase project dashboard, you'll need:

1. **Project URL** - Found in Settings → API
2. **Anon Key** (public) - Found in Settings → API
3. **Service Role Key** (secret) - Found in Settings → API

## Client-Side Setup (Next.js)

### 1. Create `.env.local` file

Copy the example file and add your credentials:

```bash
cd client
cp .env.local.example .env.local
```

### 2. Update `.env.local` with your credentials:

```env
# Replace with your actual Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key

# Service role key (only for server-side operations)
SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key

# Keep existing GraphQL config during transition
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
```

## Server-Side Setup (Data Sync Service)

### 1. Create `.env` file

```bash
cd server
cp .env.example .env
```

### 2. Update `.env` with your credentials:

```env
# Supabase credentials for data sync
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key

# Keep other configurations as is
PORT=4000
CORS_ORIGIN=http://localhost:3000,http://localhost:3002
POKEAPI_BASE_URL=https://pokeapi.co/api/v2
```

## Security Notes

⚠️ **IMPORTANT**: 
- Never commit `.env.local` or `.env` files to version control
- The `SUPABASE_SERVICE_ROLE_KEY` bypasses Row Level Security - keep it secret!
- Only use the service role key in server-side code
- The anon key is safe for client-side use

## Verifying Your Setup

### 1. Test Supabase Connection

Create a test file `test-supabase.js`:

```javascript
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  const { data, error } = await supabase
    .from('pokemon')
    .select('count');
    
  if (error) {
    console.error('Connection failed:', error);
  } else {
    console.log('Connection successful!');
  }
}

testConnection();
```

### 2. Environment Variables Checklist

- [ ] Created `.env.local` in client directory
- [ ] Added Supabase URL
- [ ] Added Supabase Anon Key
- [ ] Added Service Role Key (for server operations)
- [ ] Created `.env` in server directory
- [ ] Added credentials to server `.env`
- [ ] Both `.env` files are in `.gitignore`

## Next Steps

1. Run the database schema setup SQL scripts
2. Install Supabase SDK: `npm install @supabase/supabase-js`
3. Create Supabase client configuration
4. Start implementing data sync scripts

## Troubleshooting

### Invalid API Key Error
- Double-check you're using the correct key (anon vs service role)
- Ensure there are no extra spaces or quotes in your .env file

### Connection Refused
- Verify your project URL is correct
- Check if your project is active in Supabase dashboard

### CORS Issues
- Supabase allows all origins by default
- If issues persist, check browser console for specific error messages