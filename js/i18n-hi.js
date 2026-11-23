/* ------------------------------------------------------------------
   Hindi text for the site (used by js/i18n.js when Hindi is chosen).

   ui:       interface messages; the key is the English text used in the
             code, with {placeholders} filled in at run time
   html:     the page's fixed text (elements marked data-i18n="key")
   data:     content data, by exact English text (branches, the curated
             centres, place descriptions, labels)
   patterns: [RegExp, replacement] for repeated data text, such as the
             IKS Division centres' summaries
   states / cities: display names (the data keeps the English names)

   Names of centres, people, towns and addresses, and official project
   titles, are deliberately not translated.
------------------------------------------------------------------- */
window.IKS_HI = {
  title: "ज्ञान वृक्ष · भारतीय ज्ञान प्रणाली",
  description: "भारतीय ज्ञान प्रणाली का एक इंटरैक्टिव वृक्ष: वेद और दर्शन से लेकर धरोहर और पांडुलिपियों तक छह शाखाएँ, और उन्हें आगे बढ़ाने वाले शोध केंद्र।",

  html: {
    title: "भारतीय ज्ञान प्रणाली",
    lede: `<span class="tree-name">ज्ञान वृक्ष</span>, ज्ञान का पेड़। एक ही जड़ से छह शाखाएँ निकलती हैं, और हर पत्ता एक ऐसा केंद्र है जो किसी परंपरा को जीवित रखता है। वृक्ष को घुमाइए और कोई पत्ता चुनिए।`,
    heroNear: "मेरे आसपास IKS स्थान खोजें",
    stageLabel: "ज्ञान का इंटरैक्टिव 3D वृक्ष",
    hint: "वृक्ष घुमाने के लिए खींचें · किसी चमकते पत्ते पर क्लिक करें",
    noWebgl: "आपका ब्राउज़र 3D ग्राफ़िक्स शुरू नहीं कर सका। नीचे दिए बटनों से आप फिर भी हर शाखा देख सकते हैं।",
    branchesLabel: "ज्ञान की शाखाएँ",
    nearTitle: "आपके आसपास IKS स्थान",
    nearLede: "आपके आसपास के IKS केंद्र, धरोहर स्थल और जीवंत परंपराएँ, हर एक Google Maps पर रास्ता देखने से बस एक क्लिक दूर।",
    useLocation: "मेरा स्थान इस्तेमाल करें",
    or: "या",
    searchNearCity: "किसी शहर के पास खोजें",
    cityPh: "शहर का नाम लिखें, जैसे चंडीगढ़",
    search: "खोजें",
    distance: "दूरी",
    within: "दायरा",
    kindsOfPlace: "स्थानों के प्रकार",
    show: "दिखाएँ",
    nearNote: `आपका स्थान इसी ब्राउज़र में रहता है और केवल दूरी मापने के लिए इस्तेमाल होता है। दूरियाँ सीधी रेखा में हैं।
        <em>अनुमानित</em> चिह्न वाले स्थान उनके शहर पर दिखाए गए हैं, क्योंकि स्रोत में उनका पता नहीं है।
        स्रोत: <a href="https://iksindia.org/" target="_blank" rel="noopener">iksindia.org</a>,
        <a href="https://iks.uem.edu.in/iks-centres/" target="_blank" rel="noopener">iks.uem.edu.in</a> और
        <a href="https://iksguru.in/" target="_blank" rel="noopener">iksguru.in</a>।`,
    verseTr: "“सत्य एक है; ज्ञानी उसे अनेक नामों से पुकारते हैं।”",
    close: "बंद करें",
    acksTitle: "आभार",
    acksLede: "यह साइट इन संस्थानों और परियोजनाओं द्वारा प्रकाशित जानकारी को एक साथ लाती है। इन सभी का धन्यवाद। हर पत्ता अपने ठीक-ठीक स्रोतों से जुड़ा है।",
    acksNote: "कुछ पुराना दिखा? “जानकारी अपडेट सुझाएँ” का उपयोग करें।",
    ack_iksDiv: "IKS केंद्रों की आधिकारिक सूची, उनके मेज़बान संस्थान और प्रधान अन्वेषक, और IKS का अर्थ।",
    ack_atlas: "लगभग 500 धरोहर स्थल, जीवंत परंपराएँ, संग्रहालय, अभिलेखागार और ग्रंथ (इसकी प्रविष्टियाँ अभी समीक्षाधीन हैं)।",
    ack_iish: "इसका काम, प्रकाशन और राष्ट्रीय धरोहर केंद्र।",
    ack_uem: "भारत में स्थित IKS केंद्र और संस्थान।",
    ack_iksguru: "धरोहर स्थल, जीवंत परंपराएँ और आयुर्वेद व योग संस्थान, नक्शे पर उनके स्थानों सहित।",
    ack_hindupedia: "प्राच्य शोध संस्थान और पांडुलिपि पुस्तकालय।",
    ack_hmml: "भारत के वे पांडुलिपि भंडार जिनका यह डिजिटलीकरण कर रहा है।",
    ack_aarya: "गुरुकुल, उनके स्थान और सूचीबद्ध संपर्क।",
    ack_vedic: "और गुरुकुल तथा वेद पाठशालाएँ, और गुरुकुल क्या होता है।",
    ack_official: "नेतृत्व पेज, विवरणिकाएँ और वार्षिक रिपोर्टें, जो हर पत्ते में “स्रोत” के अंतर्गत जुड़ी हैं।",
    ack_osm: "IKS एटलस के स्थानों की जगहें (डेटा © OpenStreetMap योगदानकर्ता, ODbL)।",
    ack_svgmaps: "भारत के राज्यों का रूपरेखा नक्शा (CC BY 4.0)।",
    sibTitle: "इस शाखा के अन्य पत्ते"
  },

  ui: {
    /* leaf finder and branch details */
    "Search leaves": "पत्ते खोजें",
    "Search all {n} leaves: a name, town or state": "सभी {n} पत्तों में खोजें: नाम, शहर या राज्य",
    "Search this branch's {n} leaves": "इस शाखा के {n} पत्तों में खोजें",
    "State": "राज्य",
    "All states": "सभी राज्य",
    "Kind of leaf": "पत्ते का प्रकार",
    "All": "सभी",
    "Showing {a} of {b} leaf": "{b} में से {a} पत्ता दिखाया जा रहा है",
    "Showing {a} of {b} leaves": "{b} में से {a} पत्ते दिखाए जा रहे हैं",
    "No leaf matches. Try another word, kind or state.": "कोई पत्ता नहीं मिला। कोई और शब्द, प्रकार या राज्य आज़माइए।",
    "Show {n} more": "{n} और दिखाएँ",
    "Choose a branch to see its leaves, or click any leaf on the tree. Every IKS place on this site is a leaf: search them all here.":
      "कोई शाखा चुनिए और उसके पत्ते देखिए, या वृक्ष के किसी भी पत्ते पर क्लिक कीजिए। इस साइट का हर IKS स्थान एक पत्ता है: यहाँ सबको खोजिए।",
    "{a} IKS centres and {b} more places (gurukuls, institutes, heritage sites, traditions) grow on this branch. Large glowing leaves are IKS centres; the small leaves cluster on twigs by kind.":
      "इस शाखा पर {a} IKS केंद्र और {b} अन्य स्थान (गुरुकुल, संस्थान, धरोहर स्थल, परंपराएँ) उगते हैं। बड़े चमकते पत्ते IKS केंद्र हैं; छोटे पत्ते अपने प्रकार के अनुसार टहनियों पर गुच्छों में हैं।",
    "{a} IKS centres grow on this branch.": "इस शाखा पर {a} IKS केंद्र उगते हैं।",

    /* centre panel */
    "What happens here": "यहाँ क्या होता है",
    "People": "लोग",
    "As listed in: {src}": "स्रोत में दिए अनुसार: {src}",
    "The sources don't name the people who run it. Contact the institution below.": "स्रोतों में इसे चलाने वालों के नाम नहीं दिए गए हैं। नीचे दिए संस्थान से संपर्क करें।",
    "Address": "पता",
    "Listed phone": "सूचीबद्ध फ़ोन",
    "Phone": "फ़ोन",
    "Listed email": "सूचीबद्ध ईमेल",
    "Email": "ईमेल",
    "Hours": "समय",
    "Website": "वेबसाइट",
    "Directions": "रास्ता",
    "Open in Google Maps": "Google Maps में खोलें",
    "Search for its contact details": "इसके संपर्क विवरण खोजें",
    "Visit & contact": "भेंट और संपर्क",
    "The official list doesn't give an address, phone or e-mail for this centre.": "आधिकारिक सूची में इस केंद्र का पता, फ़ोन या ईमेल नहीं दिया गया है।",
    "Sources": "स्रोत",
    "Fetched November 2026. Office-holders change, so confirm with the institution before visiting.": "नवंबर 2026 में लिया गया। पदाधिकारी बदलते रहते हैं, इसलिए जाने से पहले संस्थान से पुष्टि कर लें।",
    "Checked November 2026. Office-holders change, so confirm with the institution before visiting.": "नवंबर 2026 में जाँचा गया। पदाधिकारी बदलते रहते हैं, इसलिए जाने से पहले संस्थान से पुष्टि कर लें।",
    "Founded {year}.": "स्थापना: {year}।",
    "{name} is in {place}.": "{name} यहाँ स्थित है: {place}।",
    "More {kind} ({region} twig)": "और {kind} ({region} टहनी)",
    "More {kind}": "और {kind}",
    "Other IKS centres on this branch": "इस शाखा के अन्य IKS केंद्र",
    "Show {n} more of {total}": "{total} में से {n} और दिखाएँ",
    "Search all {n} leaves of this branch": "इस शाखा के सभी {n} पत्तों में खोजें",

    /* regions (gurukul twigs) */
    "North": "उत्तर",
    "North-west": "उत्तर-पश्चिम",
    "West": "पश्चिम",
    "South": "दक्षिण",
    "Deccan & Central": "दक्कन और मध्य",
    "East & North-east": "पूर्व और पूर्वोत्तर",

    /* near me */
    "{n} km": "{n} किमी",
    "Person in charge": "प्रभारी व्यक्ति",
    "A public heritage site, not an institution, so no single person is in charge. Visitor details are on the site's official page.":
      "यह एक सार्वजनिक धरोहर स्थल है, कोई संस्थान नहीं, इसलिए इसका कोई एक प्रभारी नहीं है। आगंतुकों के लिए जानकारी स्थल के आधिकारिक पेज पर है।",
    "A living tradition carried by a community, not an institution, so no single person is in charge.":
      "यह किसी समुदाय द्वारा जीवित रखी गई परंपरा है, कोई संस्थान नहीं, इसलिए इसका कोई एक प्रभारी नहीं है।",
    "The source doesn't name a person in charge.": "स्रोत में किसी प्रभारी का नाम नहीं दिया गया है।",
    "Office phone": "कार्यालय फ़ोन",
    "Office email": "कार्यालय ईमेल",
    "The IKS Division doesn't publish phone numbers or e-mails for its centres.": "IKS प्रभाग अपने केंद्रों के फ़ोन नंबर या ईमेल प्रकाशित नहीं करता।",
    "The gurukul directories don't list a phone number for it.": "गुरुकुल निर्देशिकाओं में इसका फ़ोन नंबर नहीं दिया गया है।",
    "The source doesn't list a phone number or e-mail.": "स्रोत में फ़ोन नंबर या ईमेल नहीं दिया गया है।",
    "Search for {name}'s contact": "{name} का संपर्क खोजें",
    "Search for their contact": "उनका संपर्क खोजें",
    "About this centre": "इस केंद्र के बारे में",
    "Status: {s}": "स्थिति: {s}",
    "Funded by the IKS Division, Ministry of Education": "शिक्षा मंत्रालय के IKS प्रभाग द्वारा वित्तपोषित",
    "and the leaf's full source list": "और पत्ते की पूरी स्रोत सूची",
    "IKS Division list of centres": "IKS प्रभाग की केंद्र सूची",
    " and ": " और ",
    " (directory listings may be out of date; confirm before visiting)": " (निर्देशिका की जानकारी पुरानी हो सकती है; जाने से पहले पुष्टि करें)",
    "HMML repository list": "HMML भंडार सूची",
    "Source: {src}.": "स्रोत: {src}।",
    "Learn more": "और जानें",
    "Shown at the city centre: the source gives no street address": "शहर के केंद्र पर दिखाया गया है: स्रोत में सड़क का पता नहीं है",
    "approx.": "अनुमानित",
    "What it is": "यह क्या है",
    "What they study": "यहाँ क्या पढ़ा-पढ़ाया जाता है",
    "Contact": "संपर्क",
    "On the tree": "वृक्ष पर",
    "Hide contact": "संपर्क छिपाएँ",
    "{n} IKS place within {r} km of {where}.": "{where} से {r} किमी के भीतर {n} IKS स्थान।",
    "{n} IKS places within {r} km of {where}.": "{where} से {r} किमी के भीतर {n} IKS स्थान।",
    "Nothing within {r} km of {where}.": "{where} से {r} किमी के भीतर कुछ नहीं मिला।",
    "The nearest place is below; try a wider distance.": "सबसे नज़दीकी स्थान नीचे है; बड़ी दूरी चुनकर देखें।",
    "The nearest places are below; try a wider distance.": "सबसे नज़दीकी स्थान नीचे हैं; बड़ी दूरी चुनकर देखें।",
    "“{q}” isn't in the city list yet. Try a nearby larger city, or use your location.": "“{q}” अभी शहरों की सूची में नहीं है। पास का कोई बड़ा शहर आज़माइए, या अपना स्थान इस्तेमाल कीजिए।",
    "Type a city name, or use your location.": "किसी शहर का नाम लिखें, या अपना स्थान इस्तेमाल करें।",
    "This browser can't share its location. Type a city instead.": "यह ब्राउज़र अपना स्थान साझा नहीं कर सकता। इसकी जगह किसी शहर का नाम लिखें।",
    "Finding your location…": "आपका स्थान खोजा जा रहा है…",
    "your location (near {city})": "आपका स्थान ({city} के पास)",
    "your location": "आपका स्थान",
    "Location access was blocked. Type a city instead, or allow location for this site in your browser.": "स्थान की अनुमति नहीं मिली। किसी शहर का नाम लिखें, या ब्राउज़र में इस साइट के लिए स्थान की अनुमति दें।",
    "Couldn't get your location just now. Type a city instead.": "अभी आपका स्थान नहीं मिल सका। इसकी जगह किसी शहर का नाम लिखें।",
    "Use your location or type a city to see what's nearby.": "आसपास क्या है यह देखने के लिए अपना स्थान इस्तेमाल करें या किसी शहर का नाम लिखें।",

    /* chatbot */
    "Open on the tree": "वृक्ष पर खोलें",
    "(as listed in {src})": "({src} में दिए अनुसार)",
    "The site's sources don't name a person in charge here.": "साइट के स्रोतों में यहाँ के प्रभारी का नाम नहीं दिया गया है।",
    "(listed by {who})": "({who} द्वारा सूचीबद्ध)",
    "The site's sources don't list a phone number or e-mail for it.": "साइट के स्रोतों में इसका फ़ोन नंबर या ईमेल नहीं दिया गया है।",
    "Namaste. Ask me anything about Indian Knowledge Systems. I use this website's information on {n} centres, institutes and gurukuls first, and search the web when I need to, showing my sources.":
      "नमस्ते। भारतीय ज्ञान प्रणाली के बारे में मुझसे कुछ भी पूछिए। मैं पहले इस वेबसाइट पर दी गई {n} केंद्रों, संस्थानों और गुरुकुलों की जानकारी देखता हूँ, और ज़रूरत होने पर वेब पर खोजता हूँ, अपने स्रोतों के साथ।",
    "Namaste. I answer from the information on this website: the centres on the tree, {n} IKS places and gurukuls, their people, contacts and sources.":
      "नमस्ते। मैं इस वेबसाइट की जानकारी से उत्तर देता हूँ: वृक्ष के केंद्र, {n} IKS स्थान और गुरुकुल, उनके लोग, संपर्क और स्रोत।",
    "Try asking what IKS is, about a place near a city, centres in a state, who runs a centre, or how to contact one.":
      "पूछकर देखिए: IKS क्या है, किसी शहर के पास कौन-से स्थान हैं, किसी राज्य में कौन-से केंद्र हैं, किसी केंद्र के प्रमुख कौन हैं, या उनसे संपर्क कैसे करें।",
    "Search Google": "Google पर खोजें",
    "IKS places, centres and gurukuls": "IKS स्थान, केंद्र और गुरुकुल",
    "The site lists <b>{n}</b> {what} in {state}.": "इस साइट पर {state} में <b>{n}</b> {what} हैं।",
    "The site lists <b>{n}</b> {what}.": "इस साइट पर <b>{n}</b> {what} हैं।",
    "Ask \"{what} in {state}\" to see them.": "इन्हें देखने के लिए पूछिए: “{state} में {what}”।",
    "places": "स्थान",
    "a state": "किसी राज्य",
    "I don't have any {what} within {r} km of {city}.": "मेरे पास {city} से {r} किमी के भीतर कोई {what} नहीं है।",
    "IKS places": "IKS स्थान",
    "Show nearest to {city}": "{city} के सबसे नज़दीकी दिखाएँ",
    "{n} {what} within {r} km of <b>{city}</b>, nearest first:": "<b>{city}</b> से {r} किमी के भीतर {n} {what}, सबसे नज़दीकी पहले:",
    "{n} {what} within {r} km of <b>{city}</b>:": "<b>{city}</b> से {r} किमी के भीतर {n} {what}:",
    "See all near {city}": "{city} के पास सब देखें",
    "I don't have any {what} in {state} on this site.": "इस साइट पर {state} में कोई {what} नहीं है।",
    "{n} {what} in <b>{state}</b> (first 8):": "<b>{state}</b> में {n} {what} (पहले 8):",
    "{n} {what} in <b>{state}</b>:": "<b>{state}</b> में {n} {what}:",
    "IKS places and centres": "IKS स्थान और केंद्र",
    "Ask about one by name for details, or narrow it down, e.g. \"gurukuls near {city}\".": "विवरण के लिए किसी एक का नाम लेकर पूछिए, या खोज सीमित कीजिए, जैसे “{city} के पास गुरुकुल”।",
    "a city": "किसी शहर",
    "{n} IKS centres on this branch of the tree, including:": "वृक्ष की इस शाखा पर {n} IKS केंद्र, जिनमें:",
    "{n} IKS centres on this branch of the tree:": "वृक्ष की इस शाखा पर {n} IKS केंद्र:",
    "…and {n} more.": "…और {n} अन्य।",
    "The branch also has {n} smaller leaves (gurukuls, institutes, heritage sites and traditions). Open the branch to search them all.":
      "इस शाखा पर {n} छोटे पत्ते भी हैं (गुरुकुल, संस्थान, धरोहर स्थल और परंपराएँ)। सबको खोजने के लिए शाखा खोलिए।",
    "Show the {name} branch": "{name} शाखा दिखाएँ",
    "Here's what I found on the site that best matches your question:": "आपके प्रश्न से सबसे अधिक मेल खाने वाली जानकारी जो मुझे साइट पर मिली:",
    "Ask about one of them by name for its details and contacts, or search the web for more.": "विवरण और संपर्क के लिए इनमें से किसी का नाम लेकर पूछिए, या और जानकारी के लिए वेब पर खोजिए।",
    "That isn't in this site's information. I can tell you about IKS centres, institutes, gurukuls, manuscript libraries and heritage places listed here, or you can search the web for it.":
      "यह जानकारी इस साइट पर नहीं है। मैं यहाँ सूचीबद्ध IKS केंद्रों, संस्थानों, गुरुकुलों, पांडुलिपि पुस्तकालयों और धरोहर स्थलों के बारे में बता सकता हूँ, या आप इसे वेब पर खोज सकते हैं।",
    "Ask about IKS": "IKS के बारे में पूछें",
    "Ask about Indian Knowledge Systems": "भारतीय ज्ञान प्रणाली के बारे में पूछें",
    "AI answers from this site and the web": "इस साइट और वेब से AI उत्तर",
    "Answers from this site's data": "इस साइट की जानकारी से उत्तर",
    "Close chat": "चैट बंद करें",
    "Your question": "आपका प्रश्न",
    "Ask about centres, gurukuls, people…": "केंद्रों, गुरुकुलों, लोगों के बारे में पूछें…",
    "Send": "भेजें",
    "AI can make mistakes; check the linked sources.": "AI से गलती हो सकती है; दिए गए स्रोत जाँच लें।",
    "Built-in assistant: it knows this site's data and can send you to a web search.": "अंतर्निहित सहायक: यह इस साइट की जानकारी जानता है और आपको वेब खोज तक ले जा सकता है।",
    "(The AI service didn't respond, so this is the built-in answer.)": "(AI सेवा ने उत्तर नहीं दिया, इसलिए यह अंतर्निहित उत्तर है।)",
    // kinds the chatbot names in its answers
    "gurukuls": "गुरुकुल",
    "Āyurveda, Yoga and health places": "आयुर्वेद, योग और स्वास्थ्य से जुड़े स्थान",
    "manuscript libraries and oriental institutes": "पांडुलिपि पुस्तकालय और प्राच्य संस्थान",
    "heritage sites": "धरोहर स्थल",
    "living traditions": "जीवंत परंपराएँ",
    "IKS centres and institutions": "IKS केंद्र और संस्थान",
    EXPLAIN_IKS: `<p><b>भारतीय ज्ञान प्रणाली (IKS)</b> वे ज्ञान-परंपराएँ हैं जो भारत में हज़ारों वर्षों में विकसित हुईं: दर्शन, भाषा और साहित्य, कलाएँ, स्वास्थ्य, गणित, खगोलशास्त्र, स्थापत्य, कृषि और बहुत कुछ। IKS प्रभाग के अनुसार ये ज्ञान-परंपराएँ तमिल, संस्कृत, पालि, प्राकृत, अरबी, फ़ारसी, कन्नड़, मलयालम, तेलुगु, ओड़िया, बांग्ला जैसी भारत की सभी भाषाओं में पली-बढ़ी हैं, और अनेक ग्रंथों, मौखिक परंपराओं तथा आज भी निभाई जाने वाली कुल-परंपराओं में सुरक्षित रही हैं।</p>
        <p>शिक्षा मंत्रालय का <b>IKS प्रभाग</b> (2020 में स्थापित) भारतीय ज्ञान प्रणाली को आज के संसार के लिए पुनर्जीवित करने और मुख्यधारा में लाने के लिए IKS केंद्रों, शोध परियोजनाओं, इंटर्नशिप और पाठ्यपुस्तकों को वित्तपोषित करता है।</p>
        <p class="cb-dim">स्रोत: iksindia.org (About; IKS Centres)। उद्धरणों का हिन्दी अनुवाद इस साइट ने किया है।</p>`,
    EXPLAIN_GURUKUL: `<p><b>गुरुकुल</b> (गुरुकुलम्) एक आवासीय शिक्षण संस्था है, जिसमें विद्यार्थी आचार्य या गुरु के साथ रहकर पढ़ता है। पारंपरिक गुरुकुलों में वेद, वेदांग, दर्शन, संस्कृत व्याकरण और कुछ में आयुर्वेद व योग पढ़ाए जाते हैं; आज कई गुरुकुल किसी स्कूल बोर्ड के साथ मिली-जुली पद्धति अपनाते हैं।</p>
        <p>इस साइट पर {n} गुरुकुल और वेद पाठशालाएँ सूचीबद्ध हैं। कोई गुरुकुल खोजने के लिए पूछिए: “<i>आपके शहर</i> के पास गुरुकुल”।</p>
        <p class="cb-dim">स्रोत: vediconcepts.org (Gurukul list)। हिन्दी अनुवाद इस साइट का है।</p>`,

    /* suggest an update (js/feedback.js) */
    "Suggest an update": "जानकारी अपडेट सुझाएँ",
    "Something here out of date?": "क्या यहाँ कुछ पुराना है?",
    "Close": "बंद करें",
    "Know a newer phone number, a new head of a centre, or a place we've missed? Tell us, with a source if you can, and we'll check it and update the site.":
      "क्या आप कोई नया फ़ोन नंबर, किसी केंद्र के नए प्रमुख, या कोई छूटा हुआ स्थान जानते हैं? हमें बताइए, हो सके तो स्रोत के साथ; हम उसकी जाँच करके साइट अपडेट करेंगे।",
    "Which entry is it about?": "यह किस प्रविष्टि के बारे में है?",
    "(optional)": "(वैकल्पिक)",
    "Start typing a name, or leave empty": "नाम लिखना शुरू करें, या खाली छोड़ दें",
    "What kind of update?": "किस तरह का अपडेट?",
    "New or changed contact (phone, e-mail, address)": "नया या बदला हुआ संपर्क (फ़ोन, ईमेल, पता)",
    "The person in charge has changed": "प्रभारी व्यक्ति बदल गए हैं",
    "A detail is wrong or out of date": "कोई जानकारी गलत या पुरानी है",
    "A missing IKS place, centre or gurukul": "कोई छूटा हुआ IKS स्थान, केंद्र या गुरुकुल",
    "Something else": "कुछ और",
    "The update": "अपडेट",
    "For example: the new Director is …, since …; the office number is now …": "उदाहरण: नए निदेशक … हैं, … से; कार्यालय का नंबर अब … है",
    "Where can we check it?": "हम इसकी पुष्टि कहाँ कर सकते हैं?",
    "A link to an official page, notice or news report": "किसी आधिकारिक पेज, सूचना या समाचार का लिंक",
    "Your name": "आपका नाम",
    "E-mail or phone, if we may ask you about it": "ईमेल या फ़ोन, अगर हम आपसे इस बारे में पूछ सकें",
    "Only the site's editors see your answers. Your name and contact details are never published.": "आपके उत्तर केवल साइट के संपादक देखते हैं। आपका नाम और संपर्क विवरण कभी प्रकाशित नहीं किए जाते।",
    "Send update": "अपडेट भेजें",
    "Cancel": "रद्द करें",
    "Thank you!": "धन्यवाद!",
    "Your update has been sent. The editors will check it against the sources before changing the site.": "आपका अपडेट भेज दिया गया है। साइट बदलने से पहले संपादक स्रोतों से इसकी जाँच करेंगे।",
    "Send another": "एक और भेजें",
    "The feedback form isn't connected yet, so updates can't be sent from here at the moment.": "सुझाव फ़ॉर्म अभी जुड़ा नहीं है, इसलिए फ़िलहाल यहाँ से अपडेट नहीं भेजे जा सकते।",
    "Please describe the update in a few words.": "कृपया अपडेट को कुछ शब्दों में बताइए।",
    "The source should be a web link starting with http:// or https://.": "स्रोत http:// या https:// से शुरू होने वाला वेब लिंक होना चाहिए।",
    "Sending…": "भेजा जा रहा है…",
    "Too many updates from here just now; please try again in a while.": "अभी यहाँ से बहुत सारे अपडेट भेजे गए हैं; कृपया थोड़ी देर बाद फिर कोशिश करें।",
    "It couldn't be sent just now. Please try again in a few minutes.": "अभी यह भेजा नहीं जा सका। कृपया कुछ मिनट बाद फिर कोशिश करें।",

    /* IKS Atlas and IISH entries (js/places-atlas.js) */
    "IISH's contact page still lists its founder, Dr. N. Gopalakrishnan, as Director, but he died in April 2023, so no current head is named here. Contact the office below.":
      "IISH का संपर्क पेज अब भी इसके संस्थापक डॉ. एन. गोपालकृष्णन को निदेशक बताता है, पर अप्रैल 2023 में उनका निधन हो गया, इसलिए यहाँ किसी वर्तमान प्रमुख का नाम नहीं दिया गया है। नीचे दिए कार्यालय से संपर्क करें।",
    "Museums & archives": "संग्रहालय और अभिलेखागार",
    "Classical texts": "शास्त्रीय ग्रंथ",
    "Archaeology and architecture": "पुरातत्त्व और स्थापत्य",
    "Built and community heritage": "निर्मित और सामुदायिक धरोहर",
    "Museums and collections": "संग्रहालय और संग्रह",
    "Archives and manuscripts": "अभिलेखागार और पांडुलिपियाँ",
    "Digital archives": "डिजिटल अभिलेखागार",
    "Research institutions": "शोध संस्थान",
    "Kerala": "केरल",
    "Across India": "पूरे भारत में",
    "IKS Atlas": "IKS एटलस",
    "IKS Atlas record {id}": "IKS एटलस प्रविष्टि {id}",
    "IKS Atlas record {id} (draft, in review)": "IKS एटलस प्रविष्टि {id} (मसौदा, समीक्षाधीन)",
    "Source listed by the IKS Atlas (not yet checked by the Atlas)": "IKS एटलस द्वारा दिया गया स्रोत (एटलस ने अभी इसकी जाँच नहीं की है)",
    "From the IKS Atlas, record {id}. The Atlas lists it as a draft in review.": "IKS एटलस से, प्रविष्टि {id}। एटलस इसे समीक्षाधीन मसौदे के रूप में सूचीबद्ध करता है।",
    "A text, not a place, so it has no map location.": "यह एक ग्रंथ है, कोई स्थान नहीं, इसलिए नक्शे पर इसका कोई स्थान नहीं है।",
    "Its location couldn't be matched on OpenStreetMap, so it is shown by state.": "OpenStreetMap पर इसका स्थान नहीं मिल सका, इसलिए इसे राज्य के आधार पर दिखाया गया है।",
    "Located at its town from OpenStreetMap; check the exact spot before visiting.": "OpenStreetMap से इसके शहर पर दिखाया गया है; जाने से पहले सटीक जगह की पुष्टि कर लें।",
    "The IKS Atlas doesn't name the people who run it.": "IKS एटलस इसे चलाने वालों के नाम नहीं देता।",
    "A text, not an institution.": "यह एक ग्रंथ है, कोई संस्थान नहीं।",
    "The IKS Atlas doesn't list contact details.": "IKS एटलस संपर्क विवरण नहीं देता।",
    "From the IKS Atlas (draft)": "IKS एटलस से (मसौदा)",
    "This entry's description comes from the IKS Atlas, a collection still in review that hasn't checked its sources yet. Check before relying on it.":
      "इस प्रविष्टि का विवरण IKS एटलस से है, जो अभी समीक्षाधीन संग्रह है और जिसने अपने स्रोतों की जाँच अभी नहीं की है। इस पर भरोसा करने से पहले पुष्टि कर लें।",
    "(The description is in English.)": "(विवरण अंग्रेज़ी में है।)",
    "(a draft in review; its descriptions and sources aren't verified yet)": "(समीक्षाधीन मसौदा; इसके विवरण और स्रोत अभी सत्यापित नहीं हैं)",
    "(From the IKS Atlas, a draft in review.)": "(IKS एटलस से, समीक्षाधीन मसौदा।)",
    "museums and archives": "संग्रहालय और अभिलेखागार",

    /* small leaves (js/tree-places.js) */
    "IKS & research centres": "IKS और शोध केंद्र",
    "Gurukuls & pāṭhaśālās": "गुरुकुल और पाठशालाएँ",
    "Oriental institutes & libraries": "प्राच्य संस्थान और पुस्तकालय",
    "Institutions": "संस्थान",
    "Heritage sites": "धरोहर स्थल",
    "Living traditions": "जीवंत परंपराएँ",
    "Āyurveda & Yoga": "आयुर्वेद और योग",
    "Gurukul / Veda pāṭhaśālā": "गुरुकुल / वेद पाठशाला",
    "Heritage site · {host}": "धरोहर स्थल · {host}",
    "Living tradition": "जीवंत परंपरा",
    "Āyurveda & Yoga institute": "आयुर्वेद और योग संस्थान",
    "Oriental research institute": "प्राच्य शोध संस्थान",
    "Manuscript collection": "पांडुलिपि संग्रह",
    "Institution": "संस्थान",
    "Campus: {host}": "परिसर: {host}",
    "Host / campus: {host}": "मेज़बान संस्थान / परिसर: {host}",
    "Listed in the gurukul directories as a gurukul or Veda pāṭhaśālā.": "गुरुकुल निर्देशिकाओं में गुरुकुल या वेद पाठशाला के रूप में सूचीबद्ध।",
    "The directories give no town for it, so it is shown by state.": "निर्देशिकाओं में इसका शहर नहीं दिया गया है, इसलिए इसे राज्य के आधार पर दिखाया गया है।",
    "The source gives no street address; the map and directions point to the town.": "स्रोत में सड़क का पता नहीं है; नक्शा और रास्ता शहर तक ले जाते हैं।",
    "A public heritage site, not an institution, so no single person is in charge.": "यह एक सार्वजनिक धरोहर स्थल है, कोई संस्थान नहीं, इसलिए इसका कोई एक प्रभारी नहीं है।",
    "Contact details as listed by {who}. Directory listings can be out of date, so confirm before visiting.": "संपर्क विवरण {who} में दिए अनुसार। निर्देशिका की जानकारी पुरानी हो सकती है, इसलिए जाने से पहले पुष्टि कर लें।",
    "A public place: no office contact is listed.": "यह एक सार्वजनिक स्थान है: कोई कार्यालय संपर्क सूचीबद्ध नहीं है।"
  },

  states: {
    "Andaman and Nicobar Islands": "अंडमान और निकोबार द्वीपसमूह", "Andhra Pradesh": "आंध्र प्रदेश", "Arunachal Pradesh": "अरुणाचल प्रदेश",
    "Assam": "असम", "Bihar": "बिहार", "Chandigarh": "चंडीगढ़", "Chhattisgarh": "छत्तीसगढ़", "Dadra and Nagar Haveli": "दादरा और नगर हवेली",
    "Daman and Diu": "दमन और दीव", "Delhi": "दिल्ली", "Goa": "गोवा", "Gujarat": "गुजरात", "Haryana": "हरियाणा",
    "Himachal Pradesh": "हिमाचल प्रदेश", "Jammu and Kashmir": "जम्मू और कश्मीर", "Jharkhand": "झारखंड", "Karnataka": "कर्नाटक",
    "Kerala": "केरल", "Ladakh": "लद्दाख", "Lakshadweep": "लक्षद्वीप", "Madhya Pradesh": "मध्य प्रदेश", "Maharashtra": "महाराष्ट्र",
    "Manipur": "मणिपुर", "Meghalaya": "मेघालय", "Mizoram": "मिज़ोरम", "Nagaland": "नागालैंड", "Odisha": "ओडिशा",
    "Puducherry": "पुडुचेरी", "Punjab": "पंजाब", "Rajasthan": "राजस्थान", "Sikkim": "सिक्किम", "Tamil Nadu": "तमिलनाडु",
    "Telangana": "तेलंगाना", "Tripura": "त्रिपुरा", "Uttar Pradesh": "उत्तर प्रदेश", "Uttarakhand": "उत्तराखंड", "West Bengal": "पश्चिम बंगाल"
  },

  cities: {
    "Agra": "आगरा", "Ahmedabad": "अहमदाबाद", "Amritsar": "अमृतसर", "Ayodhya": "अयोध्या", "Bengaluru": "बेंगलुरु", "Bhopal": "भोपाल",
    "Bhubaneswar": "भुवनेश्वर", "Bodh Gaya": "बोधगया", "Chandigarh": "चंडीगढ़", "Chennai": "चेन्नई",
    "Chhatrapati Sambhajinagar": "छत्रपति संभाजीनगर", "Coimbatore": "कोयंबटूर", "Darbhanga": "दरभंगा", "Dehradun": "देहरादून",
    "Delhi": "दिल्ली", "Dharamshala": "धर्मशाला", "Gangtok": "गंगटोक", "Gorakhpur": "गोरखपुर", "Guwahati": "गुवाहाटी",
    "Gwalior": "ग्वालियर", "Haridwar": "हरिद्वार", "Hyderabad": "हैदराबाद", "Imphal": "इंफाल", "Indore": "इंदौर", "Jaipur": "जयपुर",
    "Jammu": "जम्मू", "Jodhpur": "जोधपुर", "Kanpur": "कानपुर", "Kanyakumari": "कन्याकुमारी", "Kochi": "कोच्चि", "Kolkata": "कोलकाता",
    "Kozhikode": "कोझिकोड", "Leh": "लेह", "Lucknow": "लखनऊ", "Madurai": "मदुरै", "Mangaluru": "मंगलुरु", "Mathura": "मथुरा",
    "Mumbai": "मुंबई", "Mysuru": "मैसूरु", "Nagpur": "नागपुर", "Panaji": "पणजी", "Patna": "पटना", "Prayagraj": "प्रयागराज",
    "Puducherry": "पुडुचेरी", "Pune": "पुणे", "Puri": "पुरी", "Raipur": "रायपुर", "Ranchi": "रांची", "Rishikesh": "ऋषिकेश",
    "Shillong": "शिलांग", "Shimla": "शिमला", "Srinagar": "श्रीनगर", "Surat": "सूरत", "Thanjavur": "तंजावुर",
    "Thiruvananthapuram": "तिरुवनंतपुरम", "Tirupati": "तिरुपति", "Udaipur": "उदयपुर", "Ujjain": "उज्जैन", "Vadodara": "वडोदरा",
    "Varanasi": "वाराणसी", "Visakhapatnam": "विशाखापत्तनम"
  },

  /* repeated text in the IKS Division centres and HMML entries */
  patterns: [
    [/^An IKS Centre at (.+?), funded by the Ministry of Education's IKS Division\. Official titles?: (.+)\.$/,
      "शिक्षा मंत्रालय के IKS प्रभाग द्वारा वित्तपोषित एक IKS केंद्र, $1 में। आधिकारिक शीर्षक: $2।"],
    [/^An IKS Centre at (.+?), funded by the Ministry of Education's IKS Division\.$/,
      "शिक्षा मंत्रालय के IKS प्रभाग द्वारा वित्तपोषित एक IKS केंद्र, $1 में।"],
    [/^An IKS Centre, funded by the Ministry of Education's IKS Division\. Official titles?: (.+)\.$/,
      "शिक्षा मंत्रालय के IKS प्रभाग द्वारा वित्तपोषित एक IKS केंद्र। आधिकारिक शीर्षक: $1।"],
    [/^Host institution: (.+)$/, "मेज़बान संस्थान: $1"],
    [/^A manuscript repository listed by the Hill Museum & Manuscript Library \(HMML\), which is digitising its manuscripts \(HMML project (.+)\)\.$/,
      "हिल म्यूज़ियम एंड मैनुस्क्रिप्ट लाइब्रेरी (HMML) द्वारा सूचीबद्ध एक पांडुलिपि भंडार, जिसकी पांडुलिपियों का HMML डिजिटलीकरण कर रहा है (HMML परियोजना $1)।"]
  ],

  data: {
    /* branches */
    "Veda & Darshana": "वेद और दर्शन",
    "The Vedas, Upanishads and the six schools of philosophy: Nyāya, Vaiśeṣika, Sāṅkhya, Yoga, Mīmāṃsā and Vedānta.":
      "वेद, उपनिषद और दर्शन के छह संप्रदाय: न्याय, वैशेषिक, सांख्य, योग, मीमांसा और वेदांत।",
    "Language & Literature": "भाषा और साहित्य",
    "Sanskrit and the many languages of India: grammar, poetics and a literary heritage stretching from kāvya to folk narrative.":
      "संस्कृत और भारत की अनेक भाषाएँ: व्याकरण, काव्यशास्त्र और काव्य से लोककथाओं तक फैली साहित्यिक धरोहर।",
    "Arts & Aesthetics": "कला और सौंदर्यशास्त्र",
    "Nāṭya, music, sculpture and craft, shaped by the Nāṭyaśāstra and the theory of rasa.":
      "नाट्य, संगीत, मूर्तिकला और शिल्प, जिन्हें नाट्यशास्त्र और रस-सिद्धांत ने आकार दिया।",
    "Health & Wellbeing": "स्वास्थ्य और कल्याण",
    "Āyurveda, Yoga and traditional practices for a balanced body, mind and life.":
      "संतुलित शरीर, मन और जीवन के लिए आयुर्वेद, योग और पारंपरिक पद्धतियाँ।",
    "Science & Technology": "विज्ञान और प्रौद्योगिकी",
    "Gaṇita, Jyotiṣa, metallurgy and Vāstu: India's mathematical, astronomical and engineering traditions.":
      "गणित, ज्योतिष, धातुकर्म और वास्तु: भारत की गणितीय, खगोलीय और अभियांत्रिकी परंपराएँ।",
    "Heritage & Manuscripts": "धरोहर और पांडुलिपियाँ",
    "Palm-leaf and paper manuscripts, libraries and archives that carry thousands of years of knowledge.":
      "ताड़पत्र और कागज़ की पांडुलिपियाँ, पुस्तकालय और अभिलेखागार, जो हज़ारों वर्षों का ज्ञान सँजोए हुए हैं।",

    /* kinds of place ("near me") */
    "IKS centres": "IKS केंद्र", "IKS centre": "IKS केंद्र",
    "Heritage sites": "धरोहर स्थल", "Heritage site": "धरोहर स्थल",
    "Living traditions": "जीवंत परंपराएँ", "Living tradition": "जीवंत परंपरा",
    "Āyurveda & Yoga": "आयुर्वेद और योग",
    "Gurukuls": "गुरुकुल", "Gurukul": "गुरुकुल",

    /* IKS Division centres */
    "IKS Centre (IKS Division)": "IKS केंद्र (IKS प्रभाग)",
    "University IKS centre": "विश्वविद्यालय का IKS केंद्र",
    "Host institution: not named in the official list": "मेज़बान संस्थान: आधिकारिक सूची में नाम नहीं दिया गया",
    "Status: in progress": "स्थिति: प्रगति पर",
    "In Progress": "प्रगति पर",
    "Every IKS centre works on three pillars set by the IKS Division: research, education and mentoring, and outreach.":
      "हर IKS केंद्र IKS प्रभाग द्वारा तय तीन स्तंभों पर काम करता है: शोध, शिक्षा और मार्गदर्शन, तथा जन-संपर्क।",
    "Funded by the IKS Division, Ministry of Education": "शिक्षा मंत्रालय के IKS प्रभाग द्वारा वित्तपोषित",
    "Principal Investigator (PI), IKS Centre": "प्रधान अन्वेषक (PI), IKS केंद्र",
    "Contact person (as listed)": "संपर्क व्यक्ति (सूची में दिए अनुसार)",
    "Placed on this branch by this site, from the centre's official title.": "केंद्र के आधिकारिक शीर्षक के आधार पर इस साइट ने इसे इस शाखा पर रखा है।",
    "Placed on this branch by this site: a general IKS centre.": "इस साइट ने इसे इस शाखा पर रखा है: यह एक सामान्य IKS केंद्र है।",
    "Town not verified: the map shows the state given in the official list": "शहर की पुष्टि नहीं हुई: नक्शा आधिकारिक सूची में दिया गया राज्य दिखाता है",
    "An IKS Centre funded by the IKS Division, Ministry of Education, for research, education and outreach.":
      "शिक्षा मंत्रालय के IKS प्रभाग द्वारा शोध, शिक्षा और जन-संपर्क के लिए वित्तपोषित एक IKS केंद्र।",
    "The University of Engineering and Management's IKS centre: courses, events, a student chapter and the Jñāna Pravāha magazine.":
      "यूनिवर्सिटी ऑफ़ इंजीनियरिंग एंड मैनेजमेंट का IKS केंद्र: पाठ्यक्रम, कार्यक्रम, विद्यार्थी चैप्टर और ज्ञान प्रवाह पत्रिका।",
    "Courses in Indian Knowledge Systems": "भारतीय ज्ञान प्रणाली के पाठ्यक्रम",
    "Upcoming and past events, workshops and speakers": "आगामी और पिछले कार्यक्रम, कार्यशालाएँ और वक्ता",
    "Students' Chapter and institutional memberships": "विद्यार्थी चैप्टर और संस्थागत सदस्यताएँ",
    "Jñāna Pravāha magazine": "ज्ञान प्रवाह पत्रिका",

    /* place descriptors */
    "Ancient seat of learning": "प्राचीन विद्या-केंद्र",
    "Observatory": "वेधशाला",
    "Temple": "मंदिर",
    "Living centre of learning": "जीवंत विद्या-केंद्र",
    "Gurukul / Veda pāṭhaśālā": "गुरुकुल / वेद पाठशाला",
    "Oriental research institute": "प्राच्य शोध संस्थान",
    "Manuscript collection": "पांडुलिपि संग्रह",
    "Ministry of Culture": "संस्कृति मंत्रालय",

    /* --- curated centres --- */
    // Karnataka Samskrit University
    "State Sanskrit university": "राज्य संस्कृत विश्वविद्यालय",
    "Set up by the Government of Karnataka in 2010 to bring the Sanskrit śāstras under one university. Its departments teach and research the darśanas (Nyāya–Vaiśeṣika, Sāṅkhya–Yoga and Vedānta) alongside Vyākaraṇa, Alaṅkāra and manuscriptology.":
      "संस्कृत शास्त्रों को एक विश्वविद्यालय के अंतर्गत लाने के लिए कर्नाटक सरकार ने 2010 में इसकी स्थापना की। इसके विभाग व्याकरण, अलंकार और पांडुलिपि-विज्ञान के साथ-साथ दर्शनों (न्याय–वैशेषिक, सांख्य–योग और वेदांत) का अध्यापन और शोध करते हैं।",
    "UG, PG, PhD, diploma and certificate programmes in Sanskrit śāstras": "संस्कृत शास्त्रों में स्नातक, स्नातकोत्तर, पीएचडी, डिप्लोमा और प्रमाणपत्र कार्यक्रम",
    "Departments of Nyāya & Vaiśeṣika, Sāṅkhya & Yoga and Vedānta": "न्याय और वैशेषिक, सांख्य और योग तथा वेदांत के विभाग",
    "Manuscriptology department and Yoga therapy & counselling": "पांडुलिपि-विज्ञान विभाग तथा योग चिकित्सा और परामर्श",
    "Samskrita Evening College on the Chamarajpet campus": "चामराजपेट परिसर में संस्कृत सांध्य महाविद्यालय",
    "Vice-Chancellor": "कुलपति",
    "Registrar (in charge)": "कुलसचिव (प्रभारी)",
    "Head, Nyāya & Vaiśeṣika": "विभागाध्यक्ष, न्याय और वैशेषिक",
    "Head, Sāṅkhya & Yoga": "विभागाध्यक्ष, सांख्य और योग",
    "Head, Vedānta; Dean, Vedānta Faculty": "विभागाध्यक्ष, वेदांत; अधिष्ठाता, वेदांत संकाय",
    // MSRVVP
    "Vedic education body, Ministry of Education": "वैदिक शिक्षा संस्था, शिक्षा मंत्रालय",
    "An autonomous body of the Ministry of Education, set up in 1987 to preserve the oral tradition of Vedic recitation. It funds Veda pathaśālās and guru–śiṣya units across India, runs the Rashtriya Adarsh Veda Vidyalayas and conducts the Veda Bhushan and Veda Vibhushan examinations.":
      "शिक्षा मंत्रालय की एक स्वायत्त संस्था, जिसकी स्थापना 1987 में वेदपाठ की मौखिक परंपरा को सुरक्षित रखने के लिए हुई। यह पूरे भारत में वेद पाठशालाओं और गुरु–शिष्य इकाइयों को वित्तपोषित करती है, राष्ट्रीय आदर्श वेद विद्यालय चलाती है और वेद भूषण तथा वेद विभूषण परीक्षाएँ आयोजित करती है।",
    "In 2023–24, honorarium for 595 teachers and stipends for 3,523 students in 119 Veda pathaśālās (outside the North-East)":
      "2023–24 में 119 वेद पाठशालाओं (पूर्वोत्तर के बाहर) के 595 अध्यापकों को मानदेय और 3,523 विद्यार्थियों को छात्रवृत्ति",
    "A further 42 teachers and 208 students in 7 pathaśālās in the North-Eastern states": "इसके अतिरिक्त पूर्वोत्तर राज्यों की 7 पाठशालाओं में 42 अध्यापक और 208 विद्यार्थी",
    "Veda Bhushan (to Class 10) and Veda Vibhushan (Class 12) courses and examinations": "वेद भूषण (कक्षा 10 तक) और वेद विभूषण (कक्षा 12) पाठ्यक्रम और परीक्षाएँ",
    "Rashtriya Adarsh Veda Vidyalayas: residential Vedic schools, the first on the Ujjain campus": "राष्ट्रीय आदर्श वेद विद्यालय: आवासीय वैदिक विद्यालय, जिनमें पहला उज्जैन परिसर में है",
    "Maharshi Sandipani Rashtriya Veda Sanskrit Shiksha Board; textbooks and research on the Vedas": "महर्षि सांदीपनि राष्ट्रीय वेद संस्कृत शिक्षा बोर्ड; वेदों पर पाठ्यपुस्तकें और शोध",
    "Secretary (chief academic and executive officer); second term from 7 Aug 2022": "सचिव (मुख्य शैक्षणिक और कार्यकारी अधिकारी); 7 अगस्त 2022 से दूसरा कार्यकाल",
    "Vice Chairman (from 20 Sep 2021)": "उपाध्यक्ष (20 सितंबर 2021 से)",
    "Chairman (ex officio)": "अध्यक्ष (पदेन)",
    // Gurukula Kangri
    "Gurukula university": "गुरुकुल विश्वविद्यालय",
    "Founded on 4 March 1902 by Swami Shraddhanand on the banks of the Ganga to revive the gurukula system of education. It teaches Vedic literature and Indian philosophy alongside the sciences, engineering and management, and is funded by the UGC.":
      "गुरुकुल शिक्षा-पद्धति को पुनर्जीवित करने के लिए स्वामी श्रद्धानंद ने 4 मार्च 1902 को गंगा तट पर इसकी स्थापना की। यहाँ विज्ञान, अभियांत्रिकी और प्रबंधन के साथ वैदिक साहित्य और भारतीय दर्शन पढ़ाए जाते हैं, और इसे UGC से वित्तीय सहायता मिलती है।",
    "B.A. (Hons) Vidyalankar & Vedalankar and M.A. in Veda": "बी.ए. (ऑनर्स) विद्यालंकार और वेदालंकार तथा वेद में एम.ए.",
    "Study of the śāstras and Vedas; Faculty of Ayurveda and Medical Sciences": "शास्त्रों और वेदों का अध्ययन; आयुर्वेद और चिकित्सा विज्ञान संकाय",
    "Kanya Gurukula campuses for women at Dehradun (1922) and Haridwar (1993)": "महिलाओं के लिए देहरादून (1922) और हरिद्वार (1993) में कन्या गुरुकुल परिसर",
    "Shraddhanand Repository: digitised books from its library on archive.org": "श्रद्धानंद रिपॉज़िटरी: इसके पुस्तकालय की डिजिटल पुस्तकें archive.org पर",
    // CICT
    "Research institute, Ministry of Education": "शोध संस्थान, शिक्षा मंत्रालय",
    "An autonomous institute of the Ministry of Education for research on classical Tamil, establishing the antiquity and uniqueness of the language. It moved to Chennai in 2008, and its own building at Perumbakkam was opened in 2022. It is translating the Tirukkuṟaḷ into many Indian and world languages.":
      "शास्त्रीय तमिल पर शोध के लिए शिक्षा मंत्रालय का एक स्वायत्त संस्थान, जो इस भाषा की प्राचीनता और विशिष्टता को स्थापित करता है। यह 2008 में चेन्नई आया, और पेरुंबक्कम में इसके अपने भवन का उद्घाटन 2022 में हुआ। यह तिरुक्कुरल का अनेक भारतीय और विदेशी भाषाओं में अनुवाद करवा रहा है।",
    "Research, critical editions and translations of the 41 classical Tamil texts": "41 शास्त्रीय तमिल ग्रंथों पर शोध, उनके आलोचनात्मक संस्करण और अनुवाद",
    "Tirukkuṟaḷ translations into dozens of languages, including tribal languages such as Irula": "इरुला जैसी जनजातीय भाषाओं सहित दर्जनों भाषाओं में तिरुक्कुरल के अनुवाद",
    "Library and digital library of classical Tamil works": "शास्त्रीय तमिल कृतियों का पुस्तकालय और डिजिटल पुस्तकालय",
    "Director": "निदेशक",
    "2008 (in Chennai)": "2008 (चेन्नई में)",
    // Sahitya Akademi
    "National academy of letters; publisher": "राष्ट्रीय साहित्य अकादमी; प्रकाशक",
    "India's national academy of letters. It publishes literature and translations across Indian languages, gives the Sahitya Akademi awards, publishes the journal Indian Literature and runs a large multilingual library at Rabindra Bhavan.":
      "भारत की राष्ट्रीय साहित्य अकादमी। यह भारतीय भाषाओं में साहित्य और अनुवाद प्रकाशित करती है, साहित्य अकादमी पुरस्कार देती है, ‘इंडियन लिटरेचर’ पत्रिका प्रकाशित करती है और रवींद्र भवन में एक बड़ा बहुभाषी पुस्तकालय चलाती है।",
    "Books and translations in 24 recognised languages": "24 मान्यता प्राप्त भाषाओं में पुस्तकें और अनुवाद",
    "Sahitya Akademi Awards, translation prizes, Bal and Yuva Puraskar": "साहित्य अकादमी पुरस्कार, अनुवाद पुरस्कार, बाल और युवा पुरस्कार",
    "Journals: Indian Literature (English), Samakaleen Bharatiya Sahitya (Hindi), Samskrita Pratibha (Sanskrit)": "पत्रिकाएँ: इंडियन लिटरेचर (अंग्रेज़ी), समकालीन भारतीय साहित्य (हिन्दी), संस्कृत प्रतिभा (संस्कृत)",
    "Festival of Letters, readings and seminars; library open to readers": "साहित्योत्सव, पाठ और संगोष्ठियाँ; पाठकों के लिए खुला पुस्तकालय",
    "President (term 2023–27)": "अध्यक्ष (कार्यकाल 2023–27)",
    "Vice-President": "उपाध्यक्ष",
    "Secretary": "सचिव",
    // Maharshi Panini
    "State Sanskrit and Vedic university": "राज्य संस्कृत और वैदिक विश्वविद्यालय",
    "Madhya Pradesh's university for Sanskrit and Vedic studies. Besides degree teaching in Vyākaraṇa, Veda, Jyotiṣa and Darśana, it runs a free communicative Sanskrit programme open to the public, which is the 'sambhāṣaṇa' (spoken Sanskrit) work this leaf stands for.":
      "संस्कृत और वैदिक अध्ययन के लिए मध्य प्रदेश का विश्वविद्यालय। व्याकरण, वेद, ज्योतिष और दर्शन में उपाधि-शिक्षण के अलावा यह जनता के लिए निःशुल्क संवादात्मक संस्कृत कार्यक्रम चलाता है, और यही ‘संभाषण’ (बोलचाल की संस्कृत) का काम है जिसका प्रतिनिधित्व यह पत्ता करता है।",
    "Free communicative (spoken) Sanskrit campus programme for the public": "जनता के लिए परिसर में निःशुल्क संवादात्मक (बोलचाल की) संस्कृत कार्यक्रम",
    "UG, PG and PhD in Vyākaraṇa, Veda, Jyotiṣa, Darśana and Sāhitya": "व्याकरण, वेद, ज्योतिष, दर्शन और साहित्य में स्नातक, स्नातकोत्तर और पीएचडी",
    "Sanskrit teacher training and knowledge centre (an IKS Division–funded centre)": "संस्कृत शिक्षक प्रशिक्षण और ज्ञान केंद्र (IKS प्रभाग द्वारा वित्तपोषित केंद्र)",
    "Registrar": "कुलसचिव",
    "Principal Investigator (PI), Sanskrit teaching and knowledge centre (IKS Division–funded)": "प्रधान अन्वेषक (PI), संस्कृत शिक्षण और ज्ञान केंद्र (IKS प्रभाग द्वारा वित्तपोषित)",
    // Asiatic Society
    "Learned society, library and museum": "विद्वत् संस्था, पुस्तकालय और संग्रहालय",
    "Founded by Sir William Jones in 1784, the oldest institution of Asian studies in India. It holds a large library and manuscript collection, a museum, and publishes the Bibliotheca Indica series of Sanskrit, Persian and other classical texts.":
      "1784 में सर विलियम जोन्स द्वारा स्थापित, भारत में एशियाई अध्ययन की सबसे पुरानी संस्था। इसके पास एक बड़ा पुस्तकालय, पांडुलिपि संग्रह और संग्रहालय है, और यह संस्कृत, फ़ारसी तथा अन्य शास्त्रीय ग्रंथों की ‘बिब्लियोथेका इंडिका’ शृंखला प्रकाशित करती है।",
    "Library and manuscript collection with a public reading room": "सार्वजनिक वाचनालय सहित पुस्तकालय और पांडुलिपि संग्रह",
    "Museum of manuscripts, paintings, coins and inscriptions": "पांडुलिपियों, चित्रों, सिक्कों और अभिलेखों का संग्रहालय",
    "Publications, including the Bibliotheca Indica series and a monthly bulletin": "प्रकाशन, जिनमें बिब्लियोथेका इंडिका शृंखला और एक मासिक बुलेटिन शामिल हैं",
    "Lectures, seminars and digital archives of its holdings": "व्याख्यान, संगोष्ठियाँ और इसके संग्रह के डिजिटल अभिलेख",
    "Administrator (government-appointed)": "प्रशासक (सरकार द्वारा नियुक्त)",
    // Kerala Kalamandalam
    "Deemed university for art and culture": "कला और संस्कृति का सम-विश्वविद्यालय",
    "Founded in 1930 by the poet Vallathol Narayana Menon, Kalamandalam trains students in Kerala's classical performing arts in the gurukula way, from school level to doctoral research.":
      "कवि वल्लत्तोल नारायण मेनन द्वारा 1930 में स्थापित कलामंडलम विद्यार्थियों को केरल की शास्त्रीय प्रदर्शन कलाओं का प्रशिक्षण गुरुकुल पद्धति से देता है, विद्यालय स्तर से लेकर डॉक्टरेट शोध तक।",
    "Training in Kathakali, Kūṭiyāṭṭam, Mohiniyāṭṭam, Thullal, Chakyar Koothu and percussion": "कथकली, कूडियाट्टम, मोहिनीअट्टम, तुल्लल, चाक्यार कूत्तु और ताल-वाद्यों का प्रशिक्षण",
    "M.A. programmes in performing arts, including Kūṭiyāṭṭam and Kathakali; M.Phil. and PhD": "कूडियाट्टम और कथकली सहित प्रदर्शन कलाओं में एम.ए. कार्यक्रम; एम.फ़िल. और पीएचडी",
    "Performances and festivals on its Cheruthuruthy campus": "चेरुतुरुत्ती परिसर में प्रस्तुतियाँ और उत्सव",
    "Vice-Chancellor (joined 27 Oct 2023)": "कुलपति (27 अक्टूबर 2023 से)",
    // Kala Bhoomi
    "State crafts museum and workshop centre": "राज्य शिल्प संग्रहालय और कार्यशाला केंद्र",
    "Opened on 22 March 2018 by the Odisha government's Handlooms, Textiles and Handicrafts Department to preserve the state's craft and handloom heritage, revive fading traditions and support research. Visitors can watch and work with craftspeople.":
      "ओडिशा सरकार के हथकरघा, वस्त्र और हस्तशिल्प विभाग ने 22 मार्च 2018 को इसे खोला, ताकि राज्य की शिल्प और हथकरघा धरोहर सुरक्षित रहे, लुप्त होती परंपराएँ फिर जीवित हों और शोध को सहारा मिले। आगंतुक कारीगरों को काम करते देख सकते हैं और उनके साथ काम भी कर सकते हैं।",
    "Galleries of metal crafts (dhokra, silver filigree) and natural-material crafts such as seashell work": "धातु शिल्प (ढोकरा, चाँदी की तारकशी) और सीपी के काम जैसे प्राकृतिक-सामग्री शिल्प की दीर्घाएँ",
    "Live craft demonstrations and hands-on workshops, including pottery": "मिट्टी के बर्तन बनाने सहित शिल्प के सजीव प्रदर्शन और व्यावहारिक कार्यशालाएँ",
    "Open-air theatre, cultural programmes and guided museum walks": "खुला रंगमंच, सांस्कृतिक कार्यक्रम और गाइड के साथ संग्रहालय भ्रमण",
    "10:00 to 17:30; closed on Mondays (check before visiting)": "सुबह 10:00 से शाम 5:30; सोमवार को बंद (जाने से पहले पुष्टि करें)",
    // Arya Vaidya Sala
    "Ayurveda hospitals, research and medicine": "आयुर्वेद अस्पताल, शोध और औषधियाँ",
    "A charitable institution founded in 1902 by Vaidyaratnam P.S. Varier. It runs Ayurveda hospitals and research centres, manufactures classical medicines and is linked to the Vaidyaratnam P.S. Varier Ayurveda College.":
      "वैद्यरत्नम पी.एस. वारियर द्वारा 1902 में स्थापित एक धर्मार्थ संस्था। यह आयुर्वेद अस्पताल और शोध केंद्र चलाती है, शास्त्रीय औषधियाँ बनाती है और वैद्यरत्नम पी.एस. वारियर आयुर्वेद महाविद्यालय से जुड़ी है।",
    "Ayurvedic Hospitals & Research Centres at Kottakkal and Kochi": "कोट्टक्कल और कोच्चि में आयुर्वेदिक अस्पताल और शोध केंद्र",
    "Manufacture of classical Ayurvedic medicines": "शास्त्रीय आयुर्वेदिक औषधियों का निर्माण",
    "Research publications, including the Aryavaidyan journal": "शोध प्रकाशन, जिनमें ‘आर्यवैद्यन’ पत्रिका शामिल है",
    "Ayurveda education through the Vaidyaratnam P.S. Varier Ayurveda College": "वैद्यरत्नम पी.एस. वारियर आयुर्वेद महाविद्यालय के माध्यम से आयुर्वेद शिक्षा",
    "Managing Trustee and Chief Physician": "प्रबंध न्यासी और मुख्य चिकित्सक",
    // Kaivalyadhama
    "Yoga research and training institute": "योग शोध और प्रशिक्षण संस्थान",
    "Founded in 1924 by Swami Kuvalayananda, a pioneer of scientific research on yoga. It combines a research department, a yoga college, teacher training and a health-care centre.":
      "योग पर वैज्ञानिक शोध के अग्रणी स्वामी कुवलयानंद द्वारा 1924 में स्थापित। यहाँ एक शोध विभाग, योग महाविद्यालय, शिक्षक प्रशिक्षण और एक स्वास्थ्य-देखभाल केंद्र है।",
    "Scientific Research Department; a recognised PhD centre": "वैज्ञानिक शोध विभाग; मान्यता प्राप्त पीएचडी केंद्र",
    "Yoga teacher certification courses (for example a 200-hour course) at Lonavala and Pune": "लोनावला और पुणे में योग शिक्षक प्रमाणन पाठ्यक्रम (जैसे 200 घंटे का पाठ्यक्रम)",
    "Health-care centre offering yoga-based therapy and residential programmes": "योग-आधारित चिकित्सा और आवासीय कार्यक्रम वाला स्वास्थ्य-देखभाल केंद्र",
    "Publishes the research journal Yoga Mīmāṃsā": "शोध पत्रिका ‘योग मीमांसा’ का प्रकाशन",
    "Honorary Secretary and CEO": "मानद सचिव और मुख्य कार्यकारी अधिकारी",
    // CSU Jaipur
    "Department of Jyotiṣa": "ज्योतिष विभाग",
    "The Jaipur campus of the Central Sanskrit University began in 1983 as the Kendriya Sanskrit Vidyapeeth. Its Jyotiṣa department carries forward Rajasthan's long tradition of astronomical and astrological learning, teaching both siddhānta (mathematical astronomy) and phalita.":
      "केंद्रीय संस्कृत विश्वविद्यालय का जयपुर परिसर 1983 में केंद्रीय संस्कृत विद्यापीठ के रूप में शुरू हुआ। इसका ज्योतिष विभाग राजस्थान की खगोल और ज्योतिष विद्या की लंबी परंपरा को आगे बढ़ाता है और सिद्धांत (गणितीय खगोलशास्त्र) तथा फलित, दोनों पढ़ाता है।",
    "Teaching and research in siddhānta and phalita Jyotiṣa": "सिद्धांत और फलित ज्योतिष में अध्यापन और शोध",
    "Shastri, Acharya and PhD programmes": "शास्त्री, आचार्य और पीएचडी कार्यक्रम",
    "Sarvadarśana and other traditional śāstra departments on the same campus": "उसी परिसर में सर्वदर्शन और अन्य पारंपरिक शास्त्र विभाग",
    "Director, Jaipur Campus (from 16 Jan 2026)": "निदेशक, जयपुर परिसर (16 जनवरी 2026 से)",
    "1983 (campus); 1998 (Jyotiṣa dept.)": "1983 (परिसर); 1998 (ज्योतिष विभाग)",
    // IIT Kharagpur
    "IIT research centre": "IIT शोध केंद्र",
    "Announced by the Ministry of Education in November 2020 for interdisciplinary research linking India's knowledge traditions with modern science and engineering: from history and archaeology to language, aesthetics, geometry, mathematics and astronomy.":
      "भारत की ज्ञान-परंपराओं को आधुनिक विज्ञान और अभियांत्रिकी से जोड़ने वाले अंतर्विषयी शोध के लिए शिक्षा मंत्रालय ने नवंबर 2020 में इसकी घोषणा की: इतिहास और पुरातत्त्व से लेकर भाषा, सौंदर्यशास्त्र, ज्यामिति, गणित और खगोलशास्त्र तक।",
    "Special Digital Exploration Laboratory": "विशेष डिजिटल अन्वेषण प्रयोगशाला",
    "Planned labs for deep archaeological exploration (GIS, GPR, LiDAR, AR/VR) and for epigraphy and textual archiving": "गहन पुरातात्त्विक अन्वेषण (GIS, GPR, LiDAR, AR/VR) तथा अभिलेख-विज्ञान और ग्रंथ-संग्रहण के लिए प्रस्तावित प्रयोगशालाएँ",
    "Courses on the history of science and technology in ancient India": "प्राचीन भारत में विज्ञान और प्रौद्योगिकी के इतिहास पर पाठ्यक्रम",
    "Faculty development programmes on India's knowledge traditions": "भारत की ज्ञान-परंपराओं पर संकाय विकास कार्यक्रम",
    "Head": "प्रमुख",
    // KK Handiqui Library
    "University library; Manuscript Conservation Centre": "विश्वविद्यालय पुस्तकालय; पांडुलिपि संरक्षण केंद्र",
    "Gauhati University's central library, named after its founding Vice-Chancellor. It is a Manuscript Conservation Centre of the National Mission for Manuscripts and keeps Assamese manuscripts written on sāñcipāt (agarwood bark) and tulāpāt (cotton paper).":
      "गुवाहाटी विश्वविद्यालय का केंद्रीय पुस्तकालय, जिसका नाम इसके संस्थापक कुलपति के नाम पर है। यह राष्ट्रीय पांडुलिपि मिशन का पांडुलिपि संरक्षण केंद्र है और साँचीपात (अगर की छाल) तथा तुलापात (सूती कागज़) पर लिखी असमिया पांडुलिपियाँ सँजोए हुए है।",
    "About 4,500 manuscripts, with 1,50,000 pages digitised": "लगभग 4,500 पांडुलिपियाँ, जिनके 1,50,000 पृष्ठ डिजिटल किए जा चुके हैं",
    "Manuscript conservation under the National Mission for Manuscripts": "राष्ट्रीय पांडुलिपि मिशन के अंतर्गत पांडुलिपि संरक्षण",
    "K.K. Handiqui collection of 7,593 volumes in 11 languages": "11 भाषाओं में 7,593 खंडों का के.के. हांडिक संग्रह",
    "2.83 lakh books and 34,000+ bound periodicals for researchers": "शोधार्थियों के लिए 2.83 लाख पुस्तकें और 34,000 से अधिक जिल्दबंद पत्रिकाएँ",
    "Librarian": "पुस्तकालयाध्यक्ष",
    // SVU ORI
    "Manuscript library and research institute": "पांडुलिपि पुस्तकालय और शोध संस्थान",
    "Started in July 1939 by Tirumala Tirupati Devasthanams as the Sri Venkateswara Oriental Institute and now part of Sri Venkateswara University. Its research library preserves palm-leaf and paper manuscripts, and it is a Manuscript Resource Centre and Conservation Centre of the National Mission for Manuscripts.":
      "तिरुमला तिरुपति देवस्थानम ने जुलाई 1939 में इसे श्री वेंकटेश्वर प्राच्य संस्थान के रूप में शुरू किया; अब यह श्री वेंकटेश्वर विश्वविद्यालय का हिस्सा है। इसका शोध पुस्तकालय ताड़पत्र और कागज़ की पांडुलिपियाँ सुरक्षित रखता है, और यह राष्ट्रीय पांडुलिपि मिशन का पांडुलिपि संसाधन केंद्र और संरक्षण केंद्र है।",
    "16,948 manuscripts and 50,000 printed books": "16,948 पांडुलिपियाँ और 50,000 मुद्रित पुस्तकें",
    "Critical editions and the Oriental Journal (62+ volumes)": "आलोचनात्मक संस्करण और ‘ओरिएंटल जर्नल’ (62 से अधिक खंड)",
    "Descriptive catalogues of its manuscripts": "इसकी पांडुलिपियों की विवरणात्मक सूचियाँ",
    "Workshops in manuscriptology, palaeography and Telugu inscriptions": "पांडुलिपि-विज्ञान, पुरालिपि-विज्ञान और तेलुगु अभिलेखों पर कार्यशालाएँ",
    "Faculty (Telugu; epigraphy)": "संकाय सदस्य (तेलुगु; अभिलेख-विज्ञान)",

    /* --- more places (js/places-atlas.js) --- */
    "Museums & archives": "संग्रहालय और अभिलेखागार",
    "Museum or archive": "संग्रहालय या अभिलेखागार",
    "Charitable trust · National Heritage Centre": "धर्मार्थ न्यास · राष्ट्रीय धरोहर केंद्र",
    "A charitable trust founded in August 1999 to study and teach India's scientific and cultural heritage through lectures, study classes, seminars, exhibitions and publications, including e-books on the four Vedas.":
      "भारत की वैज्ञानिक और सांस्कृतिक धरोहर के अध्ययन और शिक्षण के लिए अगस्त 1999 में स्थापित धर्मार्थ न्यास, जो व्याख्यानों, अध्ययन कक्षाओं, संगोष्ठियों, प्रदर्शनियों और प्रकाशनों (चारों वेदों की ई-पुस्तकों सहित) के माध्यम से काम करता है।",
    "Founded on Śrāvaṇa Pūrṇimā in August 1999 and registered as a charitable trust, IISH works to teach India's scientific, technological and cultural heritage, the Vedas, Vedāṅgas, Upavedas and darśanas, to a wide public. It publishes books, recordings and e-books (including the four Vedas), holds lectures, study classes, seminars, exhibitions, camps and study tours, and runs the National Heritage Centre at Mazhuvanchery near Thrissur. Its founder, the CSIR scientist Dr. N. Gopalakrishnan, died in April 2023.":
      "अगस्त 1999 में श्रावण पूर्णिमा के दिन स्थापित और धर्मार्थ न्यास के रूप में पंजीकृत IISH भारत की वैज्ञानिक, प्रौद्योगिकीय और सांस्कृतिक धरोहर (वेद, वेदांग, उपवेद और दर्शन) को व्यापक जनता तक पहुँचाने का काम करता है। यह पुस्तकें, रिकॉर्डिंग और ई-पुस्तकें (चारों वेदों सहित) प्रकाशित करता है; व्याख्यान, अध्ययन कक्षाएँ, संगोष्ठियाँ, प्रदर्शनियाँ, शिविर और अध्ययन यात्राएँ आयोजित करता है; और त्रिशूर के पास मळुवंचेरी में राष्ट्रीय धरोहर केंद्र चलाता है। इसके संस्थापक, CSIR वैज्ञानिक डॉ. एन. गोपालकृष्णन, का अप्रैल 2023 में निधन हो गया।",

    /* --- place descriptions (js/places.js) --- */
    "IIT Kharagpur's centre for teaching and research in Indian Knowledge Systems.": "भारतीय ज्ञान प्रणाली में अध्यापन और शोध के लिए IIT खड़गपुर का केंद्र।",
    "UEM Kolkata's IKS centre: courses, events, a student chapter and the Jñāna Pravāha magazine.": "UEM कोलकाता का IKS केंद्र: पाठ्यक्रम, कार्यक्रम, विद्यार्थी चैप्टर और ज्ञान प्रवाह पत्रिका।",
    "State Sanskrit university teaching the darśanas, Vyākaraṇa and manuscriptology.": "दर्शन, व्याकरण और पांडुलिपि-विज्ञान पढ़ाने वाला राज्य संस्कृत विश्वविद्यालय।",
    "National body for the oral tradition of the Vedas; funds pathaśālās and runs Vedic schools.": "वेदों की मौखिक परंपरा की राष्ट्रीय संस्था; पाठशालाओं को वित्तपोषित करती है और वैदिक विद्यालय चलाती है।",
    "Gurukula university founded in 1902 by Swami Shraddhanand; Vedic literature and Indian philosophy.": "स्वामी श्रद्धानंद द्वारा 1902 में स्थापित गुरुकुल विश्वविद्यालय; वैदिक साहित्य और भारतीय दर्शन।",
    "Research on classical Tamil and translations of the Tirukkuṟaḷ.": "शास्त्रीय तमिल पर शोध और तिरुक्कुरल के अनुवाद।",
    "National academy of letters: publications, awards and a multilingual library.": "राष्ट्रीय साहित्य अकादमी: प्रकाशन, पुरस्कार और बहुभाषी पुस्तकालय।",
    "Sanskrit and Vedic university with a free spoken-Sanskrit programme.": "निःशुल्क बोलचाल-संस्कृत कार्यक्रम वाला संस्कृत और वैदिक विश्वविद्यालय।",
    "Founded 1784; library, manuscripts, museum and the Bibliotheca Indica series.": "1784 में स्थापित; पुस्तकालय, पांडुलिपियाँ, संग्रहालय और बिब्लियोथेका इंडिका शृंखला।",
    "Deemed university for Kathakali, Kūṭiyāṭṭam, Mohiniyāṭṭam and other classical arts.": "कथकली, कूडियाट्टम, मोहिनीअट्टम और अन्य शास्त्रीय कलाओं का सम-विश्वविद्यालय।",
    "State crafts museum with live craft demonstrations and workshops.": "शिल्प के सजीव प्रदर्शन और कार्यशालाओं वाला राज्य शिल्प संग्रहालय।",
    "Ayurveda hospitals, research and classical medicines since 1902.": "1902 से आयुर्वेद अस्पताल, शोध और शास्त्रीय औषधियाँ।",
    "Yoga research and training institute founded in 1924.": "1924 में स्थापित योग शोध और प्रशिक्षण संस्थान।",
    "Jyotiṣa and other śāstra departments.": "ज्योतिष और अन्य शास्त्र विभाग।",
    "Manuscript Conservation Centre with about 4,500 manuscripts.": "लगभग 4,500 पांडुलिपियों वाला पांडुलिपि संरक्षण केंद्र।",
    "16,948 manuscripts; critical editions and the Oriental Journal.": "16,948 पांडुलिपियाँ; आलोचनात्मक संस्करण और ओरिएंटल जर्नल।",
    "Educational and cultural trust founded by K. M. Munshi in 1938, with centres across India.": "के. एम. मुंशी द्वारा 1938 में स्थापित शैक्षिक और सांस्कृतिक न्यास, जिसके केंद्र पूरे भारत में हैं।",
    "National centre for research, archives and exhibitions on the arts, with a major manuscripts collection.": "कलाओं पर शोध, अभिलेखागार और प्रदर्शनियों का राष्ट्रीय केंद्र, जिसके पास पांडुलिपियों का एक बड़ा संग्रह है।",
    "Organisation promoting spoken Sanskrit through camps, courses and publications.": "शिविरों, पाठ्यक्रमों और प्रकाशनों के माध्यम से बोलचाल की संस्कृत को बढ़ावा देने वाला संगठन।",
    "The Ministry of Education division that funds IKS centres, research projects and internships.": "शिक्षा मंत्रालय का वह प्रभाग जो IKS केंद्रों, शोध परियोजनाओं और इंटर्नशिप को वित्तपोषित करता है।",
    "One of the world's earliest residential universities, hosting up to 10,000 students and 2,000 teachers.": "विश्व के सबसे पुराने आवासीय विश्वविद्यालयों में से एक, जहाँ 10,000 तक विद्यार्थी और 2,000 अध्यापक रहते थे।",
    "Founded by the Pāla king Dharmapāla, it rivalled Nālandā and specialised in tantric studies and logic.": "पाल राजा धर्मपाल द्वारा स्थापित, यह नालंदा का प्रतिद्वंद्वी था और तांत्रिक अध्ययन तथा तर्कशास्त्र में विशेषज्ञ था।",
    "A leading centre of Hīnayāna Buddhist learning and secular subjects like law, politics and administration; a western counterpart to Nālandā.": "हीनयान बौद्ध विद्या और विधि, राजनीति तथा प्रशासन जैसे लौकिक विषयों का प्रमुख केंद्र; पश्चिम भारत में नालंदा का समकक्ष।",
    "One of the oldest Pāla-era mahāvihāras, a model later cited for Tibetan monastic universities.": "पाल काल के सबसे पुराने महाविहारों में से एक, जिसे बाद में तिब्बती मठ-विश्वविद्यालयों के आदर्श के रूप में उद्धृत किया गया।",
    "The reference meridian (madhya-rekhā) of classical Indian astronomy passed through Ujjain, the prime centre for calculating longitudes and calendars.": "शास्त्रीय भारतीय खगोलशास्त्र की संदर्भ याम्योत्तर रेखा (मध्य-रेखा) उज्जैन से होकर गुज़रती थी, जो देशांतर और पंचांग गणना का प्रमुख केंद्र था।",
    "Built by Sawai Jai Singh II; a UNESCO site with the world's largest stone sundial (Samrat Yantra) accurate to two seconds, and instruments to track celestial bodies.": "सवाई जयसिंह द्वितीय द्वारा निर्मित; यूनेस्को धरोहर स्थल, जहाँ दुनिया की सबसे बड़ी पत्थर की धूपघड़ी (सम्राट यंत्र) है, जो दो सेकंड तक सटीक है, और आकाशीय पिंडों को देखने के यंत्र हैं।",
    "The first of Jai Singh II's five observatories, with the Samrat, Rama and Jai Prakash yantras for measuring time and celestial positions.": "जयसिंह द्वितीय की पाँच वेधशालाओं में पहली, जिसमें समय और आकाशीय स्थिति मापने के लिए सम्राट, राम और जयप्रकाश यंत्र हैं।",
    "Jai Singh II's observatory on the ghats of the Ganges, with masonry instruments overlooking the sacred river at Kāśī.": "काशी में गंगा के घाटों पर जयसिंह द्वितीय की वेधशाला, जहाँ पवित्र नदी के सामने चिनाई से बने यंत्र हैं।",
    "A UNESCO temple conceived as the sun-god Sūrya's chariot with 24 carved wheels functioning as sundials and 7 horses — a marvel of astronomy in stone.": "यूनेस्को धरोहर मंदिर, जिसकी कल्पना सूर्यदेव के रथ के रूप में की गई है: 24 नक्काशीदार पहिये जो धूपघड़ी का काम करते हैं, और 7 घोड़े; पत्थर में खगोलशास्त्र का चमत्कार।",
    "Raja Raja Chola's granite masterpiece with a 66 m vimāna; the shadow of the tower reportedly never falls outside its base — a feat of Cōḷa engineering.": "राजराज चोल की ग्रेनाइट की उत्कृष्ट कृति, जिसका विमान 66 मीटर ऊँचा है; कहा जाता है कि इसके शिखर की छाया कभी इसके आधार से बाहर नहीं पड़ती: चोल अभियांत्रिकी की उपलब्धि।",
    "The world's largest monolithic rock-cut temple, carved top-down from a single basalt cliff by the Rāṣṭrakūṭas — an astonishing subtractive-architecture achievement.": "दुनिया का सबसे बड़ा एकाश्म शैलकृत मंदिर, जिसे राष्ट्रकूटों ने बेसाल्ट की एक ही चट्टान को ऊपर से नीचे की ओर काटकर बनाया: काटकर गढ़ने वाली स्थापत्य कला की अद्भुत उपलब्धि।",
    "A Solaṅkī-era temple designed so the equinox sun illuminates the sanctum; its stepwell (kuṇḍa) and geometry reflect solar and calendrical alignment.": "सोलंकी काल का मंदिर, जिसकी रचना ऐसी है कि विषुव के दिन सूर्य की किरणें गर्भगृह को प्रकाशित करती हैं; इसका कुंड और ज्यामिति सौर और पंचांगीय संरेखण को दर्शाते हैं।",
    "A vast temple-city with towering painted gopurams and the famed 'hall of a thousand pillars', a hub of Tamil art, music and learning.": "ऊँचे रंगीन गोपुरमों और प्रसिद्ध ‘सहस्र स्तंभ मंडप’ वाला विशाल मंदिर-नगर, तमिल कला, संगीत और विद्या का केंद्र।",
    "Chandela temples renowned for their nāgara architecture, mathematical proportion and exquisite sculpture depicting all facets of life.": "चंदेल मंदिर, जो अपनी नागर स्थापत्य शैली, गणितीय अनुपात और जीवन के हर पहलू को दर्शाने वाली उत्कृष्ट मूर्तिकला के लिए प्रसिद्ध हैं।",
    "The first of the twelve Jyotirliṅgas, on the western coast; an inscription notes there is no land between it and Antarctica in a straight line (Bāṇastambha).": "बारह ज्योतिर्लिंगों में प्रथम, पश्चिमी तट पर; एक शिलालेख (बाणस्तंभ) बताता है कि यहाँ से अंटार्कटिका तक सीधी रेखा में कोई भूमि नहीं है।",
    "One of the oldest living cities and the enduring heart of Sanskrit study, Vedic recitation, grammar, Mīmāṃsā and Vedānta debate.": "सबसे पुराने जीवित नगरों में से एक, और संस्कृत अध्ययन, वेदपाठ, व्याकरण, मीमांसा और वेदांत शास्त्रार्थ का स्थायी केंद्र।",
    "The home of Navya-Nyāya (New Logic) developed by Gaṅgeśa Upādhyāya, a sophisticated system of logic and epistemology.": "गंगेश उपाध्याय द्वारा विकसित नव्य-न्याय का घर, जो तर्कशास्त्र और ज्ञानमीमांसा की एक परिष्कृत पद्धति है।",
    "A renowned seat of Nyāya logic, Dharmaśāstra and Sanskrit scholarship, with a famous oral examination tradition (śālākā-parīkṣā).": "न्याय-तर्क, धर्मशास्त्र और संस्कृत विद्वत्ता का प्रसिद्ध केंद्र, जहाँ मौखिक परीक्षा की प्रसिद्ध परंपरा (शलाका-परीक्षा) रही है।",
    "The southern maṭha established by Ādi Śaṅkara, a continuing seat of Advaita Vedānta learning and Vedic scholarship.": "आदि शंकराचार्य द्वारा स्थापित दक्षिणी मठ, अद्वैत वेदांत विद्या और वैदिक विद्वत्ता का निरंतर केंद्र।",
    "One of the seven sacred cities (mokṣapurīs) and a historic centre of Vaiṣṇava, Śaiva and Buddhist learning, silk-weaving and temple arts.": "सात पवित्र नगरों (मोक्षपुरियों) में से एक, और वैष्णव, शैव तथा बौद्ध विद्या, रेशम-बुनाई और मंदिर कलाओं का ऐतिहासिक केंद्र।",
    "A lineage from Mādhava to Nīlakaṇṭha and Jyeṣṭhadeva that developed infinite series, the value of π, and results anticipating calculus and heliocentric refinements.": "माधव से नीलकंठ और ज्येष्ठदेव तक की परंपरा, जिसने अनंत श्रेणियाँ, π का मान और कलन (कैलकुलस) तथा सूर्यकेंद्रिक संशोधनों का पूर्वाभास देने वाले परिणाम विकसित किए।",
    "Water wisdom of the arid land: one of India's deepest stepwells.": "सूखी धरती का जल-ज्ञान: भारत की सबसे गहरी बावड़ियों में से एक।",
    "Water systems, heat-adaptive homes and crafts tuned to an arid ecology.": "जल-प्रणालियाँ, गर्मी के अनुकूल घर और सूखी पारिस्थितिकी के अनुरूप शिल्प।",
    "Rajasthan's traditional water harvesting and architecture that stays cool without electricity.": "राजस्थान का पारंपरिक जल-संचयन, और ऐसा स्थापत्य जो बिना बिजली के ठंडा रहता है।",
    "Living community institutions of the Northeast, where knowledge is taught face to face.": "पूर्वोत्तर की जीवंत सामुदायिक संस्थाएँ, जहाँ ज्ञान आमने-सामने सिखाया जाता है।",
    "Indigenous agriculture and forest knowledge of the Northeast.": "पूर्वोत्तर की देशज खेती और वन-ज्ञान।",
    "Village institutions where ethics, governance and farming are passed on.": "ग्राम संस्थाएँ, जहाँ नैतिकता, शासन-व्यवस्था और खेती का ज्ञान अगली पीढ़ी को सौंपा जाता है।",
    "Adivasi knowledge of ecology, healing and community law.": "पारिस्थितिकी, उपचार और सामुदायिक विधि का आदिवासी ज्ञान।",
    "Adivasi traditions linking health, food, forest and governance.": "स्वास्थ्य, भोजन, वन और शासन-व्यवस्था को जोड़ने वाली आदिवासी परंपराएँ।",
    "Tribal ecological and pastoral knowledge in the Nilgiri hills.": "नीलगिरि पहाड़ियों में जनजातीय पारिस्थितिक और पशुपालन ज्ञान।",
    "Desert ecology: abundance in the arid Thar.": "मरुस्थल की पारिस्थितिकी: सूखे थार में समृद्धि।",
    "Bishnoi village famed for protecting trees: water as sacred, trees as kin.": "पेड़ों की रक्षा के लिए प्रसिद्ध बिश्नोई गाँव: जल पवित्र है, पेड़ परिवार हैं।",
    "Survival knowledge of the world's most densely populated desert.": "दुनिया के सबसे घनी आबादी वाले मरुस्थल में जीवित रहने का ज्ञान।",
    "Coastal knowledge: boat-building, fishing and reading the monsoon.": "तटीय ज्ञान: नाव बनाना, मछली पकड़ना और मानसून को पढ़ना।",
    "Mangrove and tidal knowledge of the delta communities.": "डेल्टा के समुदायों का मैंग्रोव और ज्वार-भाटे का ज्ञान।",
    "Mangrove knowledge along the Coromandel coast.": "कोरोमंडल तट के मैंग्रोव का ज्ञान।",
    "Lost-wax bronze icons made in hereditary guru–śiṣya lineages.": "वंशानुगत गुरु–शिष्य परंपराओं में लुप्त-मोम विधि से बनी कांस्य प्रतिमाएँ।",
    "Apex Ayurveda institute for education, research and integrative healthcare.": "शिक्षा, शोध और एकीकृत स्वास्थ्य-सेवा का शीर्ष आयुर्वेद संस्थान।",
    "Apex body for research in Ayurveda — drug development, surveys and clinical studies.": "आयुर्वेद में शोध की शीर्ष संस्था: औषधि विकास, सर्वेक्षण और नैदानिक अध्ययन।",
    "National research council for the Unani system of medicine.": "यूनानी चिकित्सा पद्धति की राष्ट्रीय शोध परिषद।",
    "National institute for yoga education, therapy and research.": "योग शिक्षा, चिकित्सा और शोध का राष्ट्रीय संस्थान।",
    "Traditional gurukul or Veda pāṭhaśālā teaching Vedic recitation and Sanskrit.": "वेदपाठ और संस्कृत पढ़ाने वाला पारंपरिक गुरुकुल या वेद पाठशाला।",
    "Traditional gurukul or Veda pāṭhaśālā teaching Vedic recitation and Sanskrit, supported by the Maharshi Sandipani Rashtriya Veda Vidya Pratishthan.": "वेदपाठ और संस्कृत पढ़ाने वाला पारंपरिक गुरुकुल या वेद पाठशाला, जिसे महर्षि सांदीपनि राष्ट्रीय वेदविद्या प्रतिष्ठान का सहयोग प्राप्त है।",
    "Started in 1886 by Col. Olcott at the Theosophical Society, Adyar; about 1,75,000 printed books and 18,600 manuscripts. Its Adyar Library Series published the 108 Upaniṣads with Upaniṣad Brahmayogin's Advaita commentary.":
      "1886 में कर्नल ओल्कॉट द्वारा थियोसॉफ़िकल सोसाइटी, अड्यार में शुरू; लगभग 1,75,000 मुद्रित पुस्तकें और 18,600 पांडुलिपियाँ। इसकी अड्यार लाइब्रेरी सीरीज़ ने उपनिषद् ब्रह्मयोगी की अद्वैत टीका के साथ 108 उपनिषद् प्रकाशित किए।",
    "Founded in 1917 to honour R.G. Bhandarkar; library of about 82,000 volumes and a large manuscript collection. Known for the critical edition of the Mahābhārata, manuscript catalogues and a Prakrit dictionary.":
      "आर.जी. भांडारकर के सम्मान में 1917 में स्थापित; लगभग 82,000 खंडों का पुस्तकालय और बड़ा पांडुलिपि संग्रह। महाभारत के आलोचनात्मक संस्करण, पांडुलिपि सूचियों और प्राकृत शब्दकोश के लिए प्रसिद्ध।",
    "Established in 1934 in memory of the Indologist Gaṅgānāth Jhā and taken over by the Government of India in 1945 under the Rashtriya Sanskrit Sansthan. A research institute for PhD and D.Litt. work that publishes rare Sanskrit texts and a quarterly journal.":
      "भारतविद् गंगानाथ झा की स्मृति में 1934 में स्थापित, और 1945 में राष्ट्रीय संस्कृत संस्थान के अंतर्गत भारत सरकार ने इसे अपने अधीन लिया। पीएचडी और डी.लिट. शोध का संस्थान, जो दुर्लभ संस्कृत ग्रंथ और एक त्रैमासिक पत्रिका प्रकाशित करता है।",
    "Founded in 1944 in memory of S. Kuppuswami Sastri. Publishes the Journal of Oriental Research; library of about 30,000 volumes; spoken-Sanskrit classes, a Śaivāgama Kośa and microfilming of manuscripts.":
      "एस. कुप्पुस्वामी शास्त्री की स्मृति में 1944 में स्थापित। ‘जर्नल ऑफ़ ओरिएंटल रिसर्च’ प्रकाशित करता है; लगभग 30,000 खंडों का पुस्तकालय; बोलचाल की संस्कृत की कक्षाएँ, शैवागम कोश और पांडुलिपियों की माइक्रोफ़िल्मिंग।",
    "Founded in 1905 by V. Krishnaswamy Iyer; affiliated to the University of Madras in 1912, teaching the traditional Sanskrit śāstras.":
      "वी. कृष्णस्वामी अय्यर द्वारा 1905 में स्थापित; 1912 में मद्रास विश्वविद्यालय से संबद्ध, पारंपरिक संस्कृत शास्त्र पढ़ाता है।",
    "Founded in 1909 for the study of religion, philosophy, history and culture, housed in Daly Memorial Hall since 1917. Library of about 36,000 volumes and manuscripts in Sanskrit, Kannada, Tamil, Telugu, Malayalam and Marathi; publishes a journal and runs seminars and courses.":
      "धर्म, दर्शन, इतिहास और संस्कृति के अध्ययन के लिए 1909 में स्थापित, 1917 से डेली मेमोरियल हॉल में। लगभग 36,000 खंडों और संस्कृत, कन्नड़, तमिल, तेलुगु, मलयालम और मराठी पांडुलिपियों का पुस्तकालय; एक पत्रिका प्रकाशित करता है और संगोष्ठियाँ तथा पाठ्यक्रम चलाता है।",
    "Begun in 1893 under Sayajirao Gaekwad III and formally constituted in 1927; part of the M.S. University of Baroda since 1949. Publishes the Gaekwad's Oriental Series and produced the critical edition of the Rāmāyaṇa.":
      "सयाजीराव गायकवाड़ तृतीय के समय 1893 में शुरू और 1927 में औपचारिक रूप से गठित; 1949 से एम.एस. यूनिवर्सिटी ऑफ़ बड़ौदा का हिस्सा। ‘गायकवाड़ ओरिएंटल सीरीज़’ प्रकाशित करता है और रामायण का आलोचनात्मक संस्करण तैयार किया।",
    "Started in 1911 by the Travancore government and merged with the University of Kerala's manuscripts library in 1940; over 50,000 manuscripts in Sanskrit, Malayalam and other languages, with journals in Sanskrit and Malayalam.":
      "त्रावणकोर सरकार द्वारा 1911 में शुरू और 1940 में केरल विश्वविद्यालय के पांडुलिपि पुस्तकालय में विलय; संस्कृत, मलयालम और अन्य भाषाओं की 50,000 से अधिक पांडुलिपियाँ, तथा संस्कृत और मलयालम में पत्रिकाएँ।",
    "Founded in 1891 as the Oriental Library by the Maharaja of Mysore; part of the University of Mysore since 1916. Here R. Shama Sastri discovered and published Kauṭilya's Arthaśāstra in 1909. Collects and publishes Sanskrit and Kannada manuscripts.":
      "मैसूर के महाराजा द्वारा 1891 में प्राच्य पुस्तकालय के रूप में स्थापित; 1916 से मैसूर विश्वविद्यालय का हिस्सा। यहीं आर. शामशास्त्री ने कौटिल्य के अर्थशास्त्र की खोज की और 1909 में उसे प्रकाशित किया। संस्कृत और कन्नड़ पांडुलिपियाँ एकत्र और प्रकाशित करता है।",
    "Started in 1927 at the University of Madras, inaugurated by Madan Mohan Malaviya. Sanskrit research, a Sanskrit journal, critical editions, free Sanskrit classes and scholarships.":
      "1927 में मद्रास विश्वविद्यालय में शुरू, उद्घाटन मदन मोहन मालवीय ने किया। संस्कृत शोध, संस्कृत पत्रिका, आलोचनात्मक संस्करण, निःशुल्क संस्कृत कक्षाएँ और छात्रवृत्तियाँ।",
    "Founded in 1916 by Sanskrit paṇḍitas; about 20,000 manuscripts, a research library and journal, and free catuṣpāṭhī teaching in Vedānta, Navya-Nyāya, Sāṅkhya, Smṛti, Pāṇini and Kāvya.":
      "संस्कृत पंडितों द्वारा 1916 में स्थापित; लगभग 20,000 पांडुलिपियाँ, शोध पुस्तकालय और पत्रिका, तथा वेदांत, नव्य-न्याय, सांख्य, स्मृति, पाणिनि और काव्य का निःशुल्क चतुष्पाठी शिक्षण।",
    "Established in 1824; Īśvaracandra Vidyāsāgara became principal in 1851. Its Sanskrit College Series has over 130 titles, including the Paippalāda Saṃhitā.":
      "1824 में स्थापित; 1851 में ईश्वरचंद्र विद्यासागर इसके प्राचार्य बने। इसकी ‘संस्कृत कॉलेज सीरीज़’ में पैप्पलाद संहिता सहित 130 से अधिक ग्रंथ हैं।",
    "One of the world's most important manuscript libraries, begun under the Nāyaks and enlarged by the Marathas and Mahārāja Serfoji II; a public trust since 1918, with more than 50,000 manuscripts.":
      "विश्व के सबसे महत्त्वपूर्ण पांडुलिपि पुस्तकालयों में से एक, जो नायकों के समय शुरू हुआ और मराठों तथा महाराजा सरफ़ोजी द्वितीय ने इसे बढ़ाया; 1918 से एक सार्वजनिक न्यास, जिसमें 50,000 से अधिक पांडुलिपियाँ हैं।",
    "Grew from a 1903 project to index the four Vedic Saṃhitās; published the Vedic Word Concordance (16 parts, 11,000 pages, 1965) and works on a Dictionary of Vedic Interpretation.":
      "चारों वैदिक संहिताओं की अनुक्रमणिका बनाने की 1903 की एक परियोजना से विकसित; ‘वैदिक पदानुक्रम कोश’ (16 भाग, 11,000 पृष्ठ, 1965) प्रकाशित किया और वैदिक व्याख्या-कोश पर काम कर रहा है।"
  }
};
