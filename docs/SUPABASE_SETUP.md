# Supabase Setup Guide

This guide walks through setting up Supabase for the Pokemon Pokedex project.

## Prerequisites

- A Supabase account (free tier is sufficient for development)
- Node.js 18+ installed
- Access to the project repository

## Step 1: Create Supabase Project

1. **Go to Supabase Dashboard**
   - Navigate to [https://supabase.com](https://supabase.com)
   - Sign up or log in to your account

2. **Create New Project**
   - Click "New Project"
   - Fill in the project details:
     - **Organization**: Select or create an organization
     - **Project name**: `pokemon-pokedex-db`
     - **Database Password**: Generate a strong password (save this!)
     - **Region**: `US East (N. Virginia)` for best performance with Vercel
     - **Pricing Plan**: Free tier (can upgrade later)

3. **Wait for Project Setup**
   - Project creation takes 1-2 minutes
   - You'll be redirected to the project dashboard when ready

## Step 2: Get Project Credentials

Once your project is created, you'll need to collect the following credentials:

1. **Project URL**
   - Found in Settings → API
   - Format: `https://[PROJECT_ID].supabase.co`

2. **Anon Key**
   - Found in Settings → API
   - This is the public API key for client-side access

3. **Service Role Key** (for server-side operations)
   - Found in Settings → API
   - Keep this secret! Only use in server environments

## Step 3: Configure Environment Variables

### For Development (Local)

Create or update `.env.local` in the client directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# For server-side operations (if needed)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### For Production (Vercel)

Add these environment variables in Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (if needed)

### For Data Sync Server (Railway)

Add these environment variables in Railway:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (for write operations)

## Step 4: Database Schema Setup

The database schema will be set up using the SQL scripts in the next steps. The schema includes:

- `pokemon` table: Main Pokemon data
- `evolution_chains` table: Evolution chain data
- `pokemon_forms` table: Regional variants, Mega evolutions, etc.

## Step 5: Enable Required Extensions

In the Supabase SQL Editor, run:

```sql
-- Enable UUID generation (if needed for future features)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable full-text search (for Pokemon search functionality)
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
```

## Step 6: Verify Setup

To verify your setup is working:

1. **Test Connection from SQL Editor**
   ```sql
   SELECT current_database(), version();
   ```

2. **Test API Access**
   ```bash
   curl 'https://[PROJECT_ID].supabase.co/rest/v1/' \
     -H "apikey: your-anon-key-here" \
     -H "Authorization: Bearer your-anon-key-here"
   ```

   Should return: `{"hint":"No tables or views found","message":"Not found"}`

## Next Steps

1. Run the database schema creation script (`/docs/sql/01-schema.sql`)
2. Set up indexes and RLS policies (`/docs/sql/02-indexes-rls.sql`)
3. Configure the data sync service
4. Update the client to use Supabase SDK

## Troubleshooting

### Connection Issues
- Verify your project URL and API keys are correct
- Check if your IP is allowed (Supabase allows all IPs by default)
- Ensure you're using the correct environment variables

### Performance Considerations
- Choose a region close to your users
- The free tier includes:
  - 500MB database space
  - 2GB bandwidth
  - 50MB file storage
  - This is sufficient for development and small production loads

## Security Notes

1. **Never expose the Service Role Key** in client-side code
2. **Use Row Level Security (RLS)** for all tables
3. **Enable SSL** for all connections (enabled by default)
4. **Regularly rotate** database passwords

## Useful Links

- [Supabase Dashboard](https://app.supabase.com)
- [Supabase Docs](https://supabase.com/docs)
- [Supabase Status](https://status.supabase.com)