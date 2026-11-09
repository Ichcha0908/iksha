/* ------------------------------------------------------------------
   Content for the Jñāna Vṛkṣa (Tree of Knowledge).
   Each branch becomes a branch of the 3D tree; each centre becomes a
   clickable leaf. To add a centre, append an object to `centres` —
   `state` must be one of the state ids in STATE_ANCHORS below.
------------------------------------------------------------------- */
window.IKS = {
  branches: [
    {
      id: "veda",
      name: "Veda & Darshana",
      sanskrit: "वेद · दर्शन",
      color: "#d97b29",
      blurb: "The Vedas, Upanishads and the six schools of philosophy: Nyāya, Vaiśeṣika, Sāṅkhya, Yoga, Mīmāṃsā and Vedānta.",
      centres: [
        { name: "Darshana Research Centre", type: "University IKS Centre", state: "ka" },
        { name: "Vedavidya Pratishthan", type: "Gurukula network", state: "up" },
        { name: "Himalaya Jnana Peeth", type: "Study centre", state: "ut" }
      ]
    },
    {
      id: "language",
      name: "Language & Literature",
      sanskrit: "भाषा · साहित्य",
      color: "#b8463a",
      blurb: "Sanskrit and the many languages of India: grammar, poetics and a literary heritage stretching from kāvya to folk narrative.",
      centres: [
        { name: "Bhasha Bharati Institute", type: "Research institute", state: "tn" },
        { name: "Sampreshana Studio", type: "Media and publishing", state: "dl" },
        { name: "Sambhashana Sangha", type: "Community body", state: "mp" },
        { name: "Kavya Sadan", type: "Cultural society", state: "wb" }
      ]
    },
    {
      id: "arts",
      name: "Arts & Aesthetics",
      sanskrit: "कला · सौन्दर्य",
      color: "#c4517f",
      blurb: "Nāṭya, music, sculpture and craft, shaped by the Nāṭyaśāstra and the theory of rasa.",
      centres: [
        { name: "Natyashala Trust", type: "Performing arts school", state: "kl" },
        { name: "Shilpa Kala Mandir", type: "Traditional craft body", state: "or" }
      ]
    },
    {
      id: "health",
      name: "Health & Wellbeing",
      sanskrit: "आरोग्य",
      color: "#4f8a4a",
      blurb: "Āyurveda, Yoga and traditional practices for a balanced body, mind and life.",
      centres: [
        { name: "Ayu Sutra Foundation", type: "Ayurveda research", state: "kl" },
        { name: "Yoga Vidya Kendra", type: "Training centre", state: "mh" }
      ]
    },
    {
      id: "science",
      name: "Science & Technology",
      sanskrit: "विज्ञान · तन्त्र",
      color: "#2f7f8f",
      blurb: "Gaṇita, Jyotiṣa, metallurgy and Vāstu: India's mathematical, astronomical and engineering traditions.",
      centres: [
        { name: "Ganita Jyotisha Parishad", type: "Research society", state: "rj" },
        { name: "Vastu Shilpa Sansthan", type: "Design institute", state: "tg" }
      ]
    },
    {
      id: "heritage",
      name: "Heritage & Manuscripts",
      sanskrit: "धरोहर · पाण्डुलिपि",
      color: "#4b5aa8",
      blurb: "Palm-leaf and paper manuscripts, libraries and archives that carry thousands of years of knowledge.",
      centres: [
        { name: "Pandulipi Bhandar", type: "Manuscript library", state: "as" },
        { name: "Granthalaya Trust", type: "Library trust", state: "ap" }
      ]
    }
  ]
};

/* A point well inside each state, in the map's 612 × 696 viewBox
   (pre-computed from the state outlines). Used to place the map pin. */
window.STATE_ANCHORS = {"an":[515.7,573.9],"ap":[225.5,528.3],"ar":[556.6,214.1],"as":[516.4,266.6],"br":[376.6,280.6],"ch":[179.5,160],"ct":[302.3,359.4],"dn":[101.3,404.5],"dd":[53.7,391.4],"dl":[186.8,209.8],"ga":[123.7,511.6],"gj":[72.4,336.7],"hr":[169.1,198.5],"hp":[188.7,129.5],"jk":[156.6,67.1],"jh":[350.9,328.7],"ka":[156.5,503.7],"kl":[180.9,641.5],"ld":[98.8,627.2],"mp":[246.4,335.6],"mh":[149.5,424.6],"mn":[535.6,305.6],"ml":[465.4,282.7],"mz":[516.3,327.8],"nl":[553.4,269.9],"or":[346.5,391.9],"py":[241.2,587.2],"pb":[154.2,160.9],"rj":[119,252.7],"sk":[423.7,238.2],"tn":[211.4,606.6],"tg":[225.2,456.6],"tr":[489.5,326.9],"up":[277.1,260.3],"ut":[234.3,173.6],"wb":[409.6,339.1]};
