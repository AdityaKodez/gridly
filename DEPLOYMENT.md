# Production Deployment Guide

Gridly is built heavily around the Vercel architecture (Next.js App Router, Edge runtime compatibilities, AI SDK). While you can deploy it on any Node.js hosting platform (Render, Railway, AWS, DigitalOcean), **Vercel is the recommended platform** for the simplest and most performant experience.

Here is the step-by-step guide to deploying your Gridly project from scratch in under 5 minutes.

---

## 1. Setup your Database (Neon)

Gridly uses Prisma and PostgreSQL. We highly recommend [Neon.tech](https://neon.tech/) for serverless Postgres since it plays perfectly with Vercel and Prisma.

1. Go to [Neon](https://neon.tech/) and create a free account.
2. Create a new Project. Name it whatever your SaaS is called.
3. Once created, you will be given a connection string that looks like this:
   `postgresql://neondb_owner:**********@ep-cool-snowflake-123456.us-east-2.aws.neon.tech/neondb?sslmode=require`
4. Copy this string. You will need it as your `DATABASE_URL` environment variable.

---

## 2. Generate Auth Secrets

Gridly uses [Better Auth](https://better-auth.com) to manage sessions securely.

1. Open a terminal on your computer.
2. Run this command to generate a cryptographically secure 32-character string:

   ```bash
   openssl rand -base64 32
   ```

3. Copy the output strings output. You will need it as your `BETTER_AUTH_SECRET` environment variable.

---

## 3. Get your AI API Key

Gridly uses the Vercel AI SDK and is configured to use Google's Gemini 2.0 Flash Lite by default (it's fast and practically free).

1. Go to [Google AI Studio](https://aistudio.google.com/).
2. Click **Get API key** on the left sidebar.
3. Create a new API key.
4. Copy the key. You will need it as your `GOOGLE_GENERATIVE_AI_API_KEY` environment variable.

---

## 4. Get your Arcjet Key (required for WAF / bot / rate limits)

Gridly enables Arcjet by default (`appConfig.arcjet.enabled`). In production, **`ARCJET_KEY` is required** when that flag is true; the app will throw on startup if the key is missing so protection cannot fail open silently.

1. Create an account at [Arcjet](https://arcjet.com) and create a site/key for your project.
2. Copy the key. You will need it as your `ARCJET_KEY` environment variable.

If you intentionally want to run without Arcjet, set `appConfig.arcjet.enabled` to `false` in `config.ts` before deploying.

---

## 5. Deploy to Vercel

Now that you have your external services ready, it's time to push your code.

1. Push your local Gridly repository to a public or private repository on GitHub.
2. Log into [Vercel](https://vercel.com/) and click **Add New... > Project**.
3. Import your Gridly GitHub repository.
4. Open the **Environment Variables** section before hitting Deploy.

### Add these Environment Variables to Vercel

| Name | Value |
| ---- | ----- |
| `DATABASE_URL` | Your Neon connection string (from Step 1) |
| `BETTER_AUTH_SECRET` | Your randomly generated string (from Step 2) |
| `BETTER_AUTH_URL` | The URL Vercel will give you (e.g., `https://my-gridly-app.vercel.app`) |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Your Google API Key (from Step 3) |
| `ARCJET_KEY` | Your Arcjet API key (from Step 4; required when Arcjet is enabled) |

*(Note: If you have set up OAuth providers like GitHub or Google, or Polar payments, add those API keys and Client IDs here as well).*

1. Hit **Deploy**.

Vercel will build the Next.js application.

---

## 6. Migrate your Database

Vercel just deployed the frontend code, but your Neon database is still completely empty. Your app will crash if you try to log in right now because the users tables don't exist yet!

1. Open a terminal locally (where your Gridly code lives).
2. Grab your Vercel deployment URL (e.g., `https://my-gridly-app.vercel.app`).
3. Make sure your local `.env` file has the exact same `DATABASE_URL` as Vercel.
4. Run this command locally to push your Prisma schema directly to your live Neon database:

   ```bash
   npx prisma db push
   ```

   *(Wait for it to confirm that the database is synced).*

---

## 7. You're Live! 🚀

Go to your Vercel URL. You should see the Gridly landing page. 
Click **Log in**, complete the sign-up flow, and enjoy your new blazing-fast SaaS stack.

### Optional Next Steps

* **Add a Custom Domain:** Go to to your project settings in Vercel to attach your own `.com`. Don't forget to update your `BETTER_AUTH_URL` to the new domain!
* **Configure Webhooks:** If using Polar for payments, log into your Polar dashboard and set the webhook URL to `https://your-domain.com/api/auth/polar/webhooks`.
