/* ------------------------------------------------------------------
   Approved organisation listings ("List your organisation").

   Loads <Worker>/listings.js, which adds every listing the editors have
   approved to window.IKS_PLACES, before the tree, "near me" and the
   chatbot are built from it. It runs only when the Worker's address is
   set in js/chat-config.js. The script is written into the page here so
   it loads in order, like the site's other data files; if the Worker
   can't be reached the page simply goes on without the listings.
------------------------------------------------------------------- */
(function () {
  var e = ((window.IKS_CHAT || {}).endpoint || "").trim().replace(/\/+$/, "");
  if (!/^(https:\/\/|http:\/\/localhost(:\d+)?\/?)[^\s"'<>]*$/.test(e)) return;   // https, or a local test Worker
  document.write('<script src="' + e + '/listings.js"><\/script>');
})();
