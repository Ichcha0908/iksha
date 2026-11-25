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
your OpenRouter API key (`sk-or-v1-…`) and Node.js 22.12 or newer.

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

## Feedback ("Suggest an update")

The same Worker stores what visitors send with the site's **Suggest an
update** button (bottom left, and in every leaf's panel): which entry, what
kind of update, the details, a source link, and optionally their name and
an e-mail or phone. Submissions are kept in a free Cloudflare **KV**
store. To switch it on (once, after the deploy steps above), in this
`server` folder:

1. Create the store:

   ```bash
   npx wrangler kv namespace create FEEDBACK
   ```

   It prints an `id`. In `wrangler.toml`, remove the `#` signs from the
   `[[kv_namespaces]]` lines at the bottom and paste that id.

2. Choose a password for downloading the submissions (a long random phrase),
   and store it as a secret:

   ```bash
   npx wrangler secret put ADMIN_KEY
   ```

3. Deploy again:

   ```bash
   npm run deploy
   ```

To read the submissions, open this address in your browser (your Worker's
address and your password):

`https://iks-chat.<your-account>.workers.dev/feedback.csv?key=<your password>`

It downloads `iks-feedback.csv` (newest first), which opens in Excel or
Google Sheets. You can also browse them in the Cloudflare dashboard →
Storage & Databases → KV → FEEDBACK. Keep the password private; anyone with
it can read the submissions, including visitors' contact details.

Built in: only your site can submit (`ALLOWED_ORIGINS`), about 6 submissions
per visitor per hour, length limits on every field, and a hidden field that
quietly drops most spam bots. Nothing visitors send is published
automatically: check each update against its source before changing the
data. Cloudflare's free plan allows 1,000 new submissions and 100,000 reads a
day.

Until the Worker's address is in `js/chat-config.js`, the form opens but
says it isn't connected yet.

## Organisation listings ("List your organisation")

IKS organisations can ask to be listed on the site with the **List your
organisation** button (the "Grow the tree with us" section near the bottom
of the page). **Nothing is published until an editor approves it.** Approved
listings appear on the site by themselves, within about five minutes, as
leaves on the tree, in "Find IKS places near me" and in the chatbot's
answers. No change to the site's files is needed.

How it works:

1. The form (`js/listing.js`) sends the request to `POST /listings`. The
   Worker checks it and stores it in a Cloudflare **KV** store, marked
   *pending*.
2. You open the editors' page, **`https://iks-chat.<your-account>.workers.dev/admin`**,
   and sign in with the same `ADMIN_KEY` password as for the feedback CSV.
   Each request shows what would be published, in fields you can correct,
   and, privately, who sent it, with links for checking it: its website,
   the pages it gave, a web search and Google Maps. A badge says whether the
   sender's e-mail is on the organisation's own domain or is a personal
   address.
3. **Approve and publish**, **Reject**, **Save changes**, **Move back to
   pending** or **Delete for good**. An approved listing can later be edited
   or unpublished in the same way.
4. The site loads the approved listings from `GET /listings.js`
   (`js/listings-loader.js`, cached for 5 minutes).

To switch it on (once, after the deploy steps above), in this `server` folder:

1. Create the store:

   ```bash
   npx wrangler kv namespace create LISTINGS
   ```

   In `wrangler.toml`, remove the `#` signs from the second
   `[[kv_namespaces]]` block (binding `LISTINGS`) and paste the id it printed.

2. If you haven't already for the feedback CSV, choose the editors'
   password (a long random phrase) and store it:

   ```bash
   npx wrangler secret put ADMIN_KEY
   ```

3. Deploy again:

   ```bash
   npm run deploy
   ```

4. Make sure the Worker's address is in `js/chat-config.js`. The "Grow the
   tree with us" section stays hidden until it is.

Protection against spam and mistakes:

- **The approval step**: every request waits for an editor; the site only
  ever receives approved listings.
- Only the site itself can send requests (`ALLOWED_ORIGINS`), at most 3
  stored requests per visitor per hour, a hidden field that catches bots,
  and requests sent faster than a person could fill in the form are quietly
  dropped.
- Every field has a length limit; links must be `http(s)://` web addresses;
  a description stuffed with links is refused; the state must be a real
  state or union territory.
- The editors' page needs the password (sent in a header, never in the
  address), allows 10 wrong attempts per 15 minutes, can't be framed by
  other sites, shows everything visitors typed as plain text, and is hidden
  from search engines.
- The sender's name, e-mail, phone and note are kept for the editors only
  and are never sent to the site.

When checking a request, use the checklist on the editors' page: is it a
real IKS organisation, does the sender belong to it (an e-mail on its own
domain, or confirm by writing to its listed office), is it already on the
site, are the phone and e-mail office contacts rather than personal ones,
and where exactly is it (paste a Google Maps link with coordinates, or tick
"approximate" to place it at its town).

Cloudflare's free plan allows 1,000 KV writes and 100,000 reads a day, far
more than the listings need.

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
