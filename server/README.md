# AI answers for the chatbot (optional)

The website's chatbot works without this: by default it runs in the browser
and answers from the site's own data. This folder adds **AI answers from
Claude** (through [OpenRouter](https://openrouter.ai)), so visitors can ask
anything. It's a small Cloudflare Worker that keeps your OpenRouter API key
secret and passes each question, with the site records relevant to it, to
Claude, which answers:

1. from the **site's records** for anything about its centres, people and
   contacts (it never invents a name or number),
2. from **its own knowledge** for general questions such as "What is IKS?",
3. with **web search** (at most 2 searches per question, only when needed)
   for current or specific facts it doesn't have. The chat window lists the
   pages it used under the answer.

**Never put the API key in the website's files** (`js/chat-config.js` or
anywhere else in this repository): the site is public, and anyone could copy
the key and spend your credits. The key lives only in the Worker, as a secret.

## What it costs

Measured with the default model, Claude Sonnet 5.5 on OpenRouter ($2 / $10
per million input / output tokens), November 2026:

- a question answered from the site's records or Claude's knowledge: about
  **1 US cent**;
- a question that needs a web search: about **3 to 5 US cents** (the search,
  plus reading the pages it finds).

So **$10 of credits is roughly 300 to 900 questions**, depending on how often
it searches. To make credits last longer:

- set `MODEL = "anthropic/claude-haiku-5.5"` in `wrangler.toml` ($0.10 /
  $0.50 per million tokens, about a twentieth of the cost; answers are a
  little less polished), and/or
- set `WEB_SEARCH = "off"` (answers then come from the site's data and
  Claude's own knowledge only).

Spending can't go past the credits on your OpenRouter account unless you turn
on auto top-up. You can also give the key its own credit limit at
openrouter.ai → Settings → API Keys. When credits run out, the chatbot quietly
goes back to its built-in answers. Cloudflare Workers' free plan covers
100,000 requests a day.

## Deploy (about 10 minutes)

You need a free [Cloudflare account](https://dash.cloudflare.com/sign-up),
your OpenRouter API key (`sk-or-v1-…`) and Node.js 18 or newer.

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
   npx wrangler secret put OPENROUTER_API_KEY
   ```

4. In `wrangler.toml`, check that `ALLOWED_ORIGINS` is the address your site
   is published at (for GitHub Pages, `https://<your-username>.github.io`).
   Only those sites can use the Worker. (A copy opened straight from your
   computer, `file://…`, isn't allowed, so it uses the built-in answers.)

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

   Commit and publish the site. The chat window now says it answers with AI.

If the Worker is unreachable or returns an error, the chatbot shows its
built-in answer instead, so the site keeps working.

## How it works

- `js/chat.js` picks the records most relevant to the question (the same
  search the built-in assistant uses, plus the nearest places when a city is
  named) and POSTs `{ question, history, context }` to the Worker.
- `worker.js` calls Claude through OpenRouter's chat completions API. Its system
  prompt says to take facts about the site's centres, people and contacts only
  from those records, to answer general questions from Claude's own knowledge,
  and to use OpenRouter's web search server tool (Anthropic's own web search,
  for Claude models) for anything current. It
  treats the records and search results as data rather than instructions, and
  asks for short answers with roles and sources for any person named. The
  Worker returns the pages Claude cited as `sources`. It uses `low` reasoning
  effort, for quick, inexpensive chat answers.
- Built-in limits: questions up to 500 characters, the last three exchanges as
  history, about 40,000 characters of site records, and roughly 20 questions
  per visitor per 10 minutes.
