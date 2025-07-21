# CI/CD Setup Guide

This guide explains how to set up GitHub Actions CI/CD for the Pokemon Pokedex project.

## Required GitHub Secrets

To run the CI/CD pipeline successfully, you need to configure the following secrets in your GitHub repository:

### Supabase Credentials

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Your Supabase project URL
   - Format: `https://your-project-id.supabase.co`

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Your Supabase anonymous key (public)
   - This is safe to expose in client-side code

## Setting up GitHub Secrets

1. Go to your repository on GitHub
2. Click on **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret listed above

## CI Build Process

The CI pipeline will:
1. Run TypeScript type checking
2. Run ESLint
3. Run tests
4. Build the application with Next.js

If GitHub Secrets are not configured, the CI will use dummy values that allow the build to complete but won't connect to a real database.

## Note

The application requires Supabase credentials to build successfully due to static generation (SSG) that pre-fetches Pokemon data at build time. Dummy values are provided as fallbacks for CI environments where real credentials are not available.