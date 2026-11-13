# AI answers for the chatbot (optional)

The website's chatbot works without this: by default it runs in the browser
and answers from the site's own data. This folder adds **AI answers from
Claude**. It's a small Cloudflare Worker that keeps your Anthropic API key
secret and passes each question, with the site records relevant to it, to
Claude. Claude is told to answer only from those records.

## What it costs

- **Cloudflare Workers:** the free plan covers 100,000 requests a day.
- **Anthropic API:** charged per question. With the default model, Claude
  Opus 5.5 ($4 / $20 per million input / output tokens), a typical question
  sends a few thousand tokens of site records and gets a short answer:
  roughly **2 to 4 US cents per question**. For about a tenth of that, set
  `MODEL = "claude-haiku-5-5"` in `wrangler.toml` (answers are a little less
  polished).
- Set a monthly **spend limit** in the Anthropic Console
  (console.anthropic.com → Settings → Limits) so costs can't run away.

## Deploy (about 10 minutes)

You need a free [Cloudflare account](https://dash.cloudflare.com/sign-up),
an [Anthropic API key](https://console.anthropic.com/settings/keys) and
Node.js 18 or newer.

1. Install the tools, in this `server` folder:

   ```bash
   npm install
   ```

2. Sign in to Cloudflare:

   ```bash
   npx wrangler login
   ```

3. Store your API key as a Worker secret (paste it when asked; it is never
   written to a file):

   ```bash
   npx wrangler secret put ANTHROPIC_API_KEY
   ```

4. In `wrangler.toml`, set `ALLOWED_ORIGINS` to the address your site is
   published at (for GitHub Pages, `https://<your-username>.github.io`).
   Only those sites can use the Worker.

5. Deploy:

   ```bash
   npm run deploy
   ```

   Wrangler prints the Worker's address, like
   `https://iks-chat.<your-account>.workers.dev`.

6. Paste that address into `js/chat-config.js`:

   ```js
   window.IKS_CHAT = { endpoint: "https://iks-chat.<your-account>.workers.dev" };
   ```

   Commit and publish the site. The chat window now says "AI answers from this
   site's data".

If the Worker is unreachable or returns an error, the chatbot shows its
built-in answer instead, so the site keeps working.

## How it works

- `js/chat.js` picks the records most relevant to the question (the same
  search the built-in assistant uses, plus the nearest places when a city is
  named) and POSTs `{ question, history, context }` to the Worker.
- `worker.js` calls Claude through the official Anthropic SDK with a system
  prompt that confines answers to those records, treats the records as data
  rather than instructions, and asks for short answers with roles and sources
  for any person named. It uses `low` effort (quick, inexpensive chat
  answers) and server-side refusal fallbacks (if a request is declined, the API
  retries it on a fallback model in the same call).
- Built-in limits: questions up to 500 characters, the last three exchanges as
  history, about 40,000 characters of site records, and roughly 20 questions
  per visitor per 10 minutes.
