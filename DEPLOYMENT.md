# Cloudflare Pages Deployment Guide

## Quick Fix for Current Issues

The original repository was missing several critical files needed for Cloudflare deployment. This guide explains what was wrong and how to fix it.

## What Was Wrong

1. **Missing `wrangler.toml`** - No configuration for Cloudflare Workers/Pages
2. **Missing database schema** - D1 database had no table definitions
3. **Missing `package.json`** - No npm scripts for deployment
4. **Missing `_routes.json`** - No routing configuration for Functions
5. **No deployment documentation**

## Step-by-Step Fix

### 1. Create D1 Database

```bash
# Install wrangler if not installed
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Create the database
wrangler d1 create coaching-db
```

**Important:** Copy the database ID from the output and replace `your-database-id-here` in `wrangler.toml`.

### 2. Update wrangler.toml

Edit the `database_id` field with your actual database ID:

```toml
[[d1_databases]]
binding = "DB"
database_name = "coaching-db"
database_id = "your-actual-database-id-from-step-1"
```

### 3. Initialize Database

```bash
# Create the contacts table
wrangler d1 execute coaching-db --file=./schema.sql
```

### 4. Test Locally

```bash
# Install dependencies
npm install

# Start local development
npm run dev
```

Visit `http://localhost:8788` to test the form.

### 5. Deploy

Option A - Using CLI:
```bash
npm run deploy
```

Option B - Using GitHub (recommended):
1. Push code to GitHub repository
2. Connect repository to Cloudflare Pages
3. Set build command: (leave empty)
4. Set build output directory: `public`
5. Add D1 binding in Pages dashboard:
   - Variable name: `DB`
   - Database: `coaching-db`

## Troubleshooting

### Error: "Database not configured"
- Check D1 binding is set up in Cloudflare Pages dashboard
- Verify binding name is exactly `DB` (case-sensitive)

### Error: "Failed to save to database"
- Ensure database schema was created (`npm run db:init`)
- Check database binding configuration

### Form submission returns 404
- Verify `_routes.json` exists
- Check that function is at `functions/api/submit.js`

### Local development issues
- Run `npm run db:local` to set up local database
- Ensure wrangler is properly authenticated

## Verification Steps

1. **Form loads correctly** ✅
2. **Form validation works** ✅
3. **Successful submission shows success message** ✅
4. **Data is saved to D1 database** ✅
5. **Error handling works** ✅

## Security Notes

- The form includes basic validation
- SQL injection protection via prepared statements
- No sensitive data exposed in client-side code
- Consider adding rate limiting for production use
