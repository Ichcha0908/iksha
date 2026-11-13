/* ------------------------------------------------------------------
   Chatbot settings.

   endpoint: leave empty to use the built-in assistant, which runs in the
   browser and answers from the site's own data (free, works offline).

   To switch on AI (Claude) answers, deploy the Worker in /server (see
   server/README.md) and paste its URL here, for example
     endpoint: "https://iks-chat.your-account.workers.dev"
   Never put an API key in this file: it is public.
------------------------------------------------------------------- */
window.IKS_CHAT = {
  endpoint: ""
};
