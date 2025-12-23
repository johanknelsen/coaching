# Coaching App - Dating Coach Contact Form

A simple contact form application for a dating coaching service, built for Cloudflare Pages with D1 database.

## Features

- Contact form with validation
- Stores inquiries in Cloudflare D1 database
- Responsive design
- Form submission feedback

## Setup for Cloudflare Deployment

### Prerequisites

1. Cloudflare account
2. Wrangler CLI installed: `npm install -g wrangler`

### Database Setup

1. **Create the D1 database:**
   ```bash
   npm run db:create
   ```

2. **Get the database ID from the output and update `wrangler.toml`:**
   - Replace `your-database-id-here` with your actual database ID

3. **Initialize the database schema:**
   ```bash
   npm run db:init
   ```

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up local database:**
   ```bash
   npm run db:local
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

### Deploy to Cloudflare Pages

1. **Deploy to Pages:**
   ```bash
   npm run deploy
   ```

   Or connect your GitHub repository to Cloudflare Pages dashboard.

2. **Configure the D1 binding in Cloudflare Dashboard:**
   - Go to your Pages project settings
   - Add a D1 database binding named `DB`
   - Select your `coaching-db` database

## Database Schema

The app uses a `contacts` table with the following structure:

```sql
CREATE TABLE contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER,
    gender TEXT,
    status TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

- `POST /api/submit` - Submit contact form data

## File Structure

```
├── functions/
│   └── api/
│       └── submit.js          # Cloudflare Pages Function for form submission
├── public/
│   ├── index.html            # Main contact form page
│   └── thank-you.html        # Thank you page
├── wrangler.toml             # Cloudflare configuration
├── schema.sql                # Database schema
├── package.json              # npm configuration
├── _routes.json              # Pages routing configuration
└── README.md                 # This file
```

## Common Issues and Solutions

### "Database not configured" error
- Ensure D1 binding is properly configured in Cloudflare Dashboard
- Verify the binding name is `DB` (case-sensitive)

### API endpoint not found
- Check that `_routes.json` is present and correctly configured
- Verify the function file is at `functions/api/submit.js`

### Database table doesn't exist
- Run the database initialization: `npm run db:init`
- Ensure schema.sql was executed successfully
