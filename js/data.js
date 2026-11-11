/* ------------------------------------------------------------------
   Content for the Jñāna Vṛkṣa (Tree of Knowledge).
   Each branch becomes a branch of the 3D tree; each centre becomes a
   clickable leaf whose panel shows the details below.

   Every centre is a real organisation. Facts come from the linked
   sources (checked November 2026); official pages were preferred and
   used wherever they could be read. People are named only when a source
   names them, with the date of that source, because office-holders
   change. Only institutional contacts are listed, never personal phones
   or e-mail addresses.

   Fields: name, type, state (key of STATE_ANCHORS), city, founded,
   summary, activities[], people[{name, role, asOf}], contact{address,
   phone, email, website}, sources[{label, url}].
   `was` records the placeholder name this leaf replaced.
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
        {
          name: "Karnataka Samskrit University",
          type: "State Sanskrit university",
          state: "ka", city: "Bengaluru", founded: "2010",
          was: "Darshana Research Centre",
          summary: "Set up by the Government of Karnataka in 2010 to bring the Sanskrit śāstras under one university. Its departments teach and research the darśanas (Nyāya–Vaiśeṣika, Sāṅkhya–Yoga and Vedānta) alongside Vyākaraṇa, Alaṅkāra and manuscriptology.",
          activities: [
            "UG, PG, PhD, diploma and certificate programmes in Sanskrit śāstras",
            "Departments of Nyāya & Vaiśeṣika, Sāṅkhya & Yoga and Vedānta",
            "Manuscriptology department and Yoga therapy & counselling",
            "Samskrita Evening College on the Chamarajpet campus"
          ],
          people: [
            { name: "Dr. S. Ahalya", role: "Vice-Chancellor", asOf: "Prospectus 2025–26" },
            { name: "Prof. V. Girishchandra", role: "Registrar (in charge)", asOf: "Prospectus 2025–26" },
            { name: "Dr. K.E. Sri Venkatanathan", role: "Head, Nyāya & Vaiśeṣika", asOf: "Prospectus 2025–26" },
            { name: "Dr. Rishidev Bhargav N.", role: "Head, Sāṅkhya & Yoga", asOf: "Prospectus 2025–26" },
            { name: "Dr. Vinay P.", role: "Head, Vedānta; Dean, Vedānta Faculty", asOf: "Prospectus 2025–26" }
          ],
          contact: {
            address: "Pampa Mahakavi Road, Chamarajpet, Bengaluru 560018, Karnataka",
            phone: "080 2670 1303 (University) · 080 2670 5387 (Registrar)",
            email: "registrarksu@gmail.com (Registrar's office)",
            website: "https://ksu.ac.in/"
          },
          sources: [
            { label: "KSU Prospectus 2025–26 (official PDF)", url: "https://ksu.ac.in/wp-content/uploads/2023/05/Final-Prospectus-2025-26.pdf" },
            { label: "KSU Prospectus 2023–24 (address)", url: "https://dse.ksu.ac.in/wp-content/uploads/2023/05/Final-Prospectus-2023-24.pdf" }
          ]
        },
        {
          name: "Maharshi Sandipani Rashtriya Veda Vidya Pratishthan",
          type: "Vedic education body, Ministry of Education",
          state: "mp", city: "Ujjain", founded: "1987",
          was: "Vedavidya Pratishthan (listed in Uttar Pradesh; the real Pratishthan is in Ujjain)",
          summary: "An autonomous body of the Ministry of Education, set up in 1987 to preserve the oral tradition of Vedic recitation. It funds Veda pathaśālās and guru–śiṣya units across India, runs the Rashtriya Adarsh Veda Vidyalayas and conducts the Veda Bhushan and Veda Vibhushan examinations.",
          activities: [
            "In 2023–24, honorarium for 595 teachers and stipends for 3,523 students in 119 Veda pathaśālās (outside the North-East)",
            "A further 42 teachers and 208 students in 7 pathaśālās in the North-Eastern states",
            "Veda Bhushan (to Class 10) and Veda Vibhushan (Class 12) courses and examinations",
            "Rashtriya Adarsh Veda Vidyalayas: residential Vedic schools, the first on the Ujjain campus",
            "Maharshi Sandipani Rashtriya Veda Sanskrit Shiksha Board; textbooks and research on the Vedas"
          ],
          people: [
            { name: "Prof. Viroopaksha V. Jaddipal", role: "Secretary (chief academic and executive officer); second term from 7 Aug 2022", asOf: "Annual Report 2023–24" },
            { name: "Prof. Prafulla Kumar Mishra", role: "Vice Chairman (from 20 Sep 2021)", asOf: "Annual Report 2023–24" },
            { name: "Union Minister of Education", role: "Chairman (ex officio)", asOf: "Annual Report 2023–24" }
          ],
          contact: {
            address: "Vedavidya Marg, Chintaman Ganesh, Post Jawasiya, Ujjain 456006, Madhya Pradesh",
            phone: "0734 250 2255 · 0734 250 2254",
            email: "msrvvpujn@gmail.com",
            website: "https://msrvvp.ac.in/"
          },
          sources: [
            { label: "MSRVVP Annual Report 2023–24 (official PDF)", url: "https://msrvvp.ac.in/Final_Annual_Report_English_2023-24.pdf" },
            { label: "MSRVVP RTI handbook, Jan 2026 (official PDF)", url: "https://msrvvp.ac.in/FINAL_RTI_MANUAL_ENG_30.01.2026.pdf" }
          ]
        },
        {
          name: "Gurukula Kangri (Deemed to be University)",
          type: "Gurukula university",
          state: "ut", city: "Haridwar", founded: "1902",
          was: "Himalaya Jnana Peeth",
          summary: "Founded on 4 March 1902 by Swami Shraddhanand on the banks of the Ganga to revive the gurukula system of education. It teaches Vedic literature and Indian philosophy alongside the sciences, engineering and management, and is funded by the UGC.",
          activities: [
            "B.A. (Hons) Vidyalankar & Vedalankar and M.A. in Veda",
            "Study of the śāstras and Vedas; Faculty of Ayurveda and Medical Sciences",
            "Kanya Gurukula campuses for women at Dehradun (1922) and Haridwar (1993)",
            "Shraddhanand Repository: digitised books from its library on archive.org"
          ],
          people: [
            { name: "Prof. Pratibha Mehta Luthra", role: "Vice-Chancellor", asOf: "University website, Nov 2026" }
          ],
          contact: {
            address: "P.O. Gurukula Kangri, Kankhal, Haridwar 249404, Uttarakhand",
            phone: "+91 93094 55455 (listed on the university homepage)",
            email: "registrar@gkv.ac.in (Registrar)",
            website: "https://www.gkv.ac.in/"
          },
          sources: [
            { label: "Gurukula Kangri: About the University (official)", url: "https://www.gkv.ac.in/" },
            { label: "Gurukula Kangri: The Vice-Chancellor (official)", url: "https://www.gkv.ac.in/the-vice-chancellor/" },
            { label: "Gurukula Kangri: Admission queries (official)", url: "https://gkv.ac.in/?p=1997" }
          ]
        }
      ]
    },
    {
      id: "language",
      name: "Language & Literature",
      sanskrit: "भाषा · साहित्य",
      color: "#b8463a",
      blurb: "Sanskrit and the many languages of India: grammar, poetics and a literary heritage stretching from kāvya to folk narrative.",
      centres: [
        {
          name: "Central Institute of Classical Tamil",
          type: "Research institute, Ministry of Education",
          state: "tn", city: "Chennai", founded: "2008 (in Chennai)",
          was: "Bhasha Bharati Institute",
          summary: "An autonomous institute of the Ministry of Education for research on classical Tamil, establishing the antiquity and uniqueness of the language. It moved to Chennai in 2008, and its own building at Perumbakkam was opened in 2022. It is translating the Tirukkuṟaḷ into many Indian and world languages.",
          activities: [
            "Research, critical editions and translations of the 41 classical Tamil texts",
            "Tirukkuṟaḷ translations into dozens of languages, including tribal languages such as Irula",
            "Library and digital library of classical Tamil works"
          ],
          people: [
            { name: "Prof. R. Chandrasekaran", role: "Director", asOf: "PTI report, Dec 2025" }
          ],
          contact: {
            address: "Chemmozhi Salai, Perumbakkam, Chennai 600100, Tamil Nadu",
            website: "https://www.cict.in/"
          },
          sources: [
            { label: "Ministry of Education: CICT", url: "https://education.gov.in/node/237" },
            { label: "Deccan Herald: PM opens CICT's new building", url: "https://www.deccanherald.com/india/pm-modi-launches-new-building-of-cict-in-chennai-1070553.html" },
            { label: "The Week (PTI), Dec 2025: Tirukkuṟaḷ translations", url: "https://www.theweek.in/wire-updates/national/2025/12/07/mes2-tn-thirukkural-translation.amp.html" },
            { label: "DT Next: 30 more Kural translations", url: "https://www.dtnext.in/news/tamilnadu/pms-dream-of-kural-in-100-languages-moves-closer-as-cict-readies-30-more-translations-including-irula-director-855645" }
          ]
        },
        {
          name: "Sahitya Akademi",
          type: "National academy of letters; publisher",
          state: "dl", city: "New Delhi", founded: "1954",
          was: "Sampreshana Studio",
          summary: "India's national academy of letters. It publishes literature and translations across Indian languages, gives the Sahitya Akademi awards, publishes the journal Indian Literature and runs a large multilingual library at Rabindra Bhavan.",
          activities: [
            "Books and translations in 24 recognised languages",
            "Sahitya Akademi Awards, translation prizes, Bal and Yuva Puraskar",
            "Journals: Indian Literature (English), Samakaleen Bharatiya Sahitya (Hindi), Samskrita Pratibha (Sanskrit)",
            "Festival of Letters, readings and seminars; library open to readers"
          ],
          people: [
            { name: "Dr. Madhav Kaushik", role: "President (term 2023–27)", asOf: "Akademi Executive Board page" },
            { name: "Prof. Kumud Sharma", role: "Vice-President", asOf: "Akademi newsletter, Jul 2026" },
            { name: "Dr. Varun Gulati", role: "Secretary", asOf: "Akademi newsletter, Jul 2026" }
          ],
          contact: {
            address: "Rabindra Bhavan, 35 Ferozeshah Road, New Delhi 110001",
            phone: "011 2338 6626 / 27 / 28",
            email: "secretary@sahitya-akademi.gov.in",
            website: "https://sahitya-akademi.gov.in/"
          },
          sources: [
            { label: "Sahitya Akademi: Contact (official)", url: "https://sahitya-akademi.gov.in/publications/contect.jsp" },
            { label: "Sahitya Akademi: Executive Board (official)", url: "https://sahitya-akademi.gov.in/aboutus/executive_board_member.jsp" },
            { label: "Sahitya Akademi newsletter, July 2026 (official PDF)", url: "https://sahitya-akademi.gov.in/e-newsletter/July_2026_Newsletter.pdf" }
          ]
        },
        {
          name: "Maharshi Panini Sanskrit Evam Vedic Vishwavidyalaya",
          type: "State Sanskrit and Vedic university",
          state: "mp", city: "Ujjain", founded: "2008",
          was: "Sambhashana Sangha",
          summary: "Madhya Pradesh's university for Sanskrit and Vedic studies. Besides degree teaching in Vyākaraṇa, Veda, Jyotiṣa and Darśana, it runs a free communicative Sanskrit programme open to the public, which is the 'sambhāṣaṇa' (spoken Sanskrit) work this leaf stands for.",
          activities: [
            "Free communicative (spoken) Sanskrit campus programme for the public",
            "UG, PG and PhD in Vyākaraṇa, Veda, Jyotiṣa, Darśana and Sāhitya",
            "Sanskrit teacher training and knowledge centre (an IKS Division–funded centre)"
          ],
          people: [
            { name: "Prof. Shiv Shankar Mishra", role: "Vice-Chancellor", asOf: "University homepage; Governor's office, Aug 2026" },
            { name: "Dr. Dilip Soni", role: "Registrar", asOf: "University homepage" }
          ],
          contact: {
            address: "Dewas Road, Ujjain 456010, Madhya Pradesh",
            website: "https://mpsvv.ac.in/"
          },
          sources: [
            { label: "MPSVV homepage (official)", url: "https://mpsvv.ac.in/index.php" },
            { label: "MPSVV: Free communicative Sanskrit campus (official)", url: "https://www.mpsvv.ac.in/index.php/en/activities/free-communicative-sanskrit-campus/free-communicative-sanskrit-campus" },
            { label: "Raj Bhavan Uttarakhand, Aug 2026", url: "https://governoruk.gov.in/?p=62415" },
            { label: "IKS Division: list of IKS centres", url: "https://iksindia.org/search_site_centers/index.php" }
          ]
        },
        {
          name: "The Asiatic Society",
          type: "Learned society, library and museum",
          state: "wb", city: "Kolkata", founded: "1784",
          was: "Kavya Sadan",
          summary: "Founded by Sir William Jones in 1784, the oldest institution of Asian studies in India. It holds a large library and manuscript collection, a museum, and publishes the Bibliotheca Indica series of Sanskrit, Persian and other classical texts.",
          activities: [
            "Library and manuscript collection with a public reading room",
            "Museum of manuscripts, paintings, coins and inscriptions",
            "Publications, including the Bibliotheca Indica series and a monthly bulletin",
            "Lectures, seminars and digital archives of its holdings"
          ],
          people: [
            { name: "Lt Col Anant Sinha", role: "Administrator (government-appointed)", asOf: "Society notice, early 2025" }
          ],
          contact: {
            address: "1 Park Street, Kolkata 700016, West Bengal",
            phone: "033 2229 0779",
            website: "https://asiaticsocietykolkata.org/"
          },
          sources: [
            { label: "Asiatic Society notice, Feb 2025 (official PDF)", url: "https://asiaticsocietykolkata.org/sites/default/files/2025-02/IMG_20250217_0001.pdf" },
            { label: "Asiatic Society Bulletin, Jan 2026 (official PDF)", url: "https://www.asiaticsocietykolkata.org/uploads/Bulletin January 2026.pdf" },
            { label: "Business Standard: digital archives", url: "https://www.business-standard.com/article/pti-stories/asiatic-society-launches-digital-archives-website-117110700043_1.html" }
          ]
        }
      ]
    },
    {
      id: "arts",
      name: "Arts & Aesthetics",
      sanskrit: "कला · सौन्दर्य",
      color: "#c4517f",
      blurb: "Nāṭya, music, sculpture and craft, shaped by the Nāṭyaśāstra and the theory of rasa.",
      centres: [
        {
          name: "Kerala Kalamandalam",
          type: "Deemed university for art and culture",
          state: "kl", city: "Cheruthuruthy, Thrissur", founded: "1930",
          was: "Natyashala Trust",
          summary: "Founded in 1930 by the poet Vallathol Narayana Menon, Kalamandalam trains students in Kerala's classical performing arts in the gurukula way, from school level to doctoral research.",
          activities: [
            "Training in Kathakali, Kūṭiyāṭṭam, Mohiniyāṭṭam, Thullal, Chakyar Koothu and percussion",
            "M.A. programmes in performing arts, including Kūṭiyāṭṭam and Kathakali; M.Phil. and PhD",
            "Performances and festivals on its Cheruthuruthy campus"
          ],
          people: [
            { name: "Prof. B. Ananthakrishnan", role: "Vice-Chancellor (joined 27 Oct 2023)", asOf: "University website" }
          ],
          contact: {
            address: "Vallathol Nagar, Cheruthuruthy, Thrissur 679531, Kerala",
            website: "https://kalamandalam.ac.in/"
          },
          sources: [
            { label: "Kerala Kalamandalam: Vice-Chancellor (official)", url: "https://kalamandalam.ac.in/?p=335" },
            { label: "Kerala Tourism: Kalamandalam", url: "https://www.keralatourism.org/leadinglights/kalamandalam/29" },
            { label: "Telangana Today: VC appointment, Oct 2023", url: "https://telanganatoday.com/uoh-faculty-member-appointed-vice-chancellor-of-kerala-kalamandalam" }
          ]
        },
        {
          name: "Kala Bhoomi – Odisha Crafts Museum",
          type: "State crafts museum and workshop centre",
          state: "or", city: "Bhubaneswar", founded: "2018",
          was: "Shilpa Kala Mandir",
          summary: "Opened on 22 March 2018 by the Odisha government's Handlooms, Textiles and Handicrafts Department to preserve the state's craft and handloom heritage, revive fading traditions and support research. Visitors can watch and work with craftspeople.",
          activities: [
            "Galleries of metal crafts (dhokra, silver filigree) and natural-material crafts such as seashell work",
            "Live craft demonstrations and hands-on workshops, including pottery",
            "Open-air theatre, cultural programmes and guided museum walks"
          ],
          people: [],
          contact: {
            address: "Shilpi Vihar, Pokhariput, Bhubaneswar 751014, Odisha",
            email: "info@odishacraftsmuseum.com",
            hours: "10:00 to 17:30; closed on Mondays (check before visiting)",
            website: "https://www.odishacraftsmuseum.com/"
          },
          sources: [
            { label: "RTI Odisha: Odisha Crafts Museum – Kalabhoomi (official)", url: "https://rtiodisha.gov.in/Pages/getDisclouser/office_id:23261/section_id:2/page:3" },
            { label: "Incredible India: Kala Bhoomi", url: "https://www.incredibleindia.gov.in/en/odisha/bhubaneswar/kala-bhoomi-odisha-crafts-museum" },
            { label: "Museums of India: Kala Bhoomi", url: "https://museumsofindia.org/museum/11934/kala-bhoomi-odisha-crafts-museum" }
          ]
        }
      ]
    },
    {
      id: "health",
      name: "Health & Wellbeing",
      sanskrit: "आरोग्य",
      color: "#4f8a4a",
      blurb: "Āyurveda, Yoga and traditional practices for a balanced body, mind and life.",
      centres: [
        {
          name: "Arya Vaidya Sala, Kottakkal",
          type: "Ayurveda hospitals, research and medicine",
          state: "kl", city: "Kottakkal, Malappuram", founded: "1902",
          was: "Ayu Sutra Foundation",
          summary: "A charitable institution founded in 1902 by Vaidyaratnam P.S. Varier. It runs Ayurveda hospitals and research centres, manufactures classical medicines and is linked to the Vaidyaratnam P.S. Varier Ayurveda College.",
          activities: [
            "Ayurvedic Hospitals & Research Centres at Kottakkal and Kochi",
            "Manufacture of classical Ayurvedic medicines",
            "Research publications, including the Aryavaidyan journal",
            "Ayurveda education through the Vaidyaratnam P.S. Varier Ayurveda College"
          ],
          people: [
            { name: "Dr. P. Madhavankutty Varier (P.M. Varier)", role: "Managing Trustee and Chief Physician", asOf: "AVS 'About'; news reports, 2026" }
          ],
          contact: {
            address: "Kottakkal P.O., Malappuram district, Kerala 676503",
            phone: "+91 483 280 8000",
            email: "mail@aryavaidyasala.com",
            website: "https://aryavaidyasala.com/"
          },
          sources: [
            { label: "Arya Vaidya Sala: Contact (official)", url: "https://aryavaidyasala.com/?p=258" },
            { label: "Aryavaidyan journal: About AVS", url: "https://www.aryavaidyanjournal.org/about/about_avs" },
            { label: "Brand Kerala, Feb 2026", url: "https://brandkeralaonline.com/?p=5105" }
          ]
        },
        {
          name: "Kaivalyadhama Yoga Institute",
          type: "Yoga research and training institute",
          state: "mh", city: "Lonavala", founded: "1924",
          was: "Yoga Vidya Kendra",
          summary: "Founded in 1924 by Swami Kuvalayananda, a pioneer of scientific research on yoga. It combines a research department, a yoga college, teacher training and a health-care centre.",
          activities: [
            "Scientific Research Department; a recognised PhD centre",
            "Yoga teacher certification courses (for example a 200-hour course) at Lonavala and Pune",
            "Health-care centre offering yoga-based therapy and residential programmes",
            "Publishes the research journal Yoga Mīmāṃsā"
          ],
          people: [
            { name: "Subodh Tiwari", role: "Honorary Secretary and CEO", asOf: "Kaivalyadhama leadership page" }
          ],
          contact: {
            address: "Swami Kuvalayananda Marg, Lonavala 410403, Maharashtra",
            phone: "02114 273001",
            website: "https://kdham.com/"
          },
          sources: [
            { label: "Kaivalyadhama: Leadership team (official)", url: "https://kdham.com/?p=565844" },
            { label: "Kaivalyadhama newsletter, Jan–Mar 2026 (official PDF)", url: "https://kdham.com/wp-content/uploads/2026/04/Newsletter-Jan-Mar-2026.pdf" },
            { label: "Kaivalyadhama: Pune centre (official)", url: "https://kdham.com/pune-center/" }
          ]
        }
      ]
    },
    {
      id: "science",
      name: "Science & Technology",
      sanskrit: "विज्ञान · तन्त्र",
      color: "#2f7f8f",
      blurb: "Gaṇita, Jyotiṣa, metallurgy and Vāstu: India's mathematical, astronomical and engineering traditions.",
      centres: [
        {
          name: "Central Sanskrit University, Jaipur Campus",
          type: "Department of Jyotiṣa",
          state: "rj", city: "Jaipur", founded: "1983 (campus); 1998 (Jyotiṣa dept.)",
          was: "Ganita Jyotisha Parishad",
          summary: "The Jaipur campus of the Central Sanskrit University began in 1983 as the Kendriya Sanskrit Vidyapeeth. Its Jyotiṣa department carries forward Rajasthan's long tradition of astronomical and astrological learning, teaching both siddhānta (mathematical astronomy) and phalita.",
          activities: [
            "Teaching and research in siddhānta and phalita Jyotiṣa",
            "Shastri, Acharya and PhD programmes",
            "Sarvadarśana and other traditional śāstra departments on the same campus"
          ],
          people: [
            { name: "Prof. Lok Manya Mishra", role: "Director, Jaipur Campus (from 16 Jan 2026)", asOf: "Campus website" }
          ],
          contact: {
            address: "Gopalpura Bypass, Triveni Nagar, Jaipur 302018, Rajasthan",
            website: "https://csu-jaipur.edu.in/"
          },
          sources: [
            { label: "CSU Jaipur: Department of Jyotiṣa (official)", url: "https://csu-jaipur.edu.in/dept_jyatisha.html" },
            { label: "CSU Jaipur: Director (official)", url: "https://csu-jaipur.edu.in/Dirctor.htm" },
            { label: "CSU Jaipur: About the campus (official)", url: "https://csu-jaipur.edu.in/about_us.html" }
          ]
        },
        {
          name: "Centre of Excellence for Indian Knowledge Systems, IIT Kharagpur",
          type: "IIT research centre",
          state: "wb", city: "Kharagpur", founded: "2020",
          was: "Vastu Shilpa Sansthan (listed in Telangana)",
          summary: "Announced by the Ministry of Education in November 2020 for interdisciplinary research linking India's knowledge traditions with modern science and engineering: from history and archaeology to language, aesthetics, geometry, mathematics and astronomy.",
          activities: [
            "Special Digital Exploration Laboratory",
            "Planned labs for deep archaeological exploration (GIS, GPR, LiDAR, AR/VR) and for epigraphy and textual archiving",
            "Courses on the history of science and technology in ancient India",
            "Faculty development programmes on India's knowledge traditions"
          ],
          people: [
            { name: "Prof. Arijit De", role: "Head", asOf: "IIT Kharagpur website, Nov 2026" }
          ],
          contact: {
            address: "IIT Kharagpur, Kharagpur 721302, West Bengal",
            phone: "+91 3222 282044 · +91 3222 255303",
            email: "hoc@iks.iitkgp.ac.in",
            website: "https://www.iitkgp.ac.in/department/KS"
          },
          sources: [
            { label: "IIT Kharagpur: CoE for IKS (official)", url: "https://www.iitkgp.ac.in/department/KS" },
            { label: "PIB: Centre announced, Nov 2020", url: "https://pib.gov.in/PressReleasePage.aspx?PRID=1670700" }
          ]
        }
      ]
    },
    {
      id: "heritage",
      name: "Heritage & Manuscripts",
      sanskrit: "धरोहर · पाण्डुलिपि",
      color: "#4b5aa8",
      blurb: "Palm-leaf and paper manuscripts, libraries and archives that carry thousands of years of knowledge.",
      centres: [
        {
          name: "Krishna Kanta Handiqui Library, Gauhati University",
          type: "University library; Manuscript Conservation Centre",
          state: "as", city: "Guwahati", founded: "1948",
          was: "Pandulipi Bhandar",
          summary: "Gauhati University's central library, named after its founding Vice-Chancellor. It is a Manuscript Conservation Centre of the National Mission for Manuscripts and keeps Assamese manuscripts written on sāñcipāt (agarwood bark) and tulāpāt (cotton paper).",
          activities: [
            "About 4,500 manuscripts, with 1,50,000 pages digitised",
            "Manuscript conservation under the National Mission for Manuscripts",
            "K.K. Handiqui collection of 7,593 volumes in 11 languages",
            "2.83 lakh books and 34,000+ bound periodicals for researchers"
          ],
          people: [
            { name: "Dr. Prasanta Kumar Deka", role: "Librarian", asOf: "Library web page, Nov 2026" }
          ],
          contact: {
            address: "Gauhati University, Gopinath Bordoloi Nagar, Guwahati 781014, Assam",
            website: "https://gauhati.ac.in/library/"
          },
          sources: [
            { label: "Gauhati University: Library (official)", url: "https://gauhati.ac.in/library/" },
            { label: "PIB: Manuscript Resource and Conservation Centres", url: "https://www.pib.gov.in/newsite/PrintRelease.aspx?relid=73331&reg=48&lang=2" }
          ]
        },
        {
          name: "Oriental Research Institute, Sri Venkateswara University",
          type: "Manuscript library and research institute",
          state: "ap", city: "Tirupati", founded: "1939",
          was: "Granthalaya Trust",
          summary: "Started in July 1939 by Tirumala Tirupati Devasthanams as the Sri Venkateswara Oriental Institute and now part of Sri Venkateswara University. Its research library preserves palm-leaf and paper manuscripts, and it is a Manuscript Resource Centre and Conservation Centre of the National Mission for Manuscripts.",
          activities: [
            "16,948 manuscripts and 50,000 printed books",
            "Critical editions and the Oriental Journal (62+ volumes)",
            "Descriptive catalogues of its manuscripts",
            "Workshops in manuscriptology, palaeography and Telugu inscriptions"
          ],
          people: [
            { name: "Dr. P. Chinna Venkateswarlu", role: "Faculty (Telugu; epigraphy)", asOf: "SVU ORI web page" }
          ],
          contact: {
            address: "Sri Venkateswara University, Tirupati 517502, Andhra Pradesh",
            email: "registrar@svumail.edu.in (University Registrar)",
            website: "https://svuori.com/"
          },
          sources: [
            { label: "SVU: Oriental Research Institute (official)", url: "https://svuniversity.edu.in/ori-center/" },
            { label: "PIB: Manuscript Resource and Conservation Centres", url: "https://www.pib.gov.in/newsite/PrintRelease.aspx?relid=73331&reg=48&lang=2" }
          ]
        }
      ]
    }
  ]
};

/* Kinds of place in "Find IKS places near me" (js/places.js).
   Colours reuse the branch palette. `kinds` groups the data's `kind` values
   behind one filter chip. */
window.IKS.placeKinds = [
  { id: "centres", label: "IKS centres", color: "#d97b29", kinds: ["centre", "institution"] },
  { id: "heritage", label: "Heritage sites", color: "#4b5aa8", kinds: ["heritage"] },
  { id: "traditions", label: "Living traditions", color: "#c4517f", kinds: ["tradition"] },
  { id: "ayush", label: "Āyurveda & Yoga", color: "#4f8a4a", kinds: ["ayush"] }
];

/* A point well inside each state, in the map's 612 × 696 viewBox
   (pre-computed from the state outlines). Used to place the map pin. */
window.STATE_ANCHORS = {"an":[515.7,573.9],"ap":[225.5,528.3],"ar":[556.6,214.1],"as":[516.4,266.6],"br":[376.6,280.6],"ch":[179.5,160],"ct":[302.3,359.4],"dn":[101.3,404.5],"dd":[53.7,391.4],"dl":[186.8,209.8],"ga":[123.7,511.6],"gj":[72.4,336.7],"hr":[169.1,198.5],"hp":[188.7,129.5],"jk":[156.6,67.1],"jh":[350.9,328.7],"ka":[156.5,503.7],"kl":[180.9,641.5],"ld":[98.8,627.2],"mp":[246.4,335.6],"mh":[149.5,424.6],"mn":[535.6,305.6],"ml":[465.4,282.7],"mz":[516.3,327.8],"nl":[553.4,269.9],"or":[346.5,391.9],"py":[241.2,587.2],"pb":[154.2,160.9],"rj":[119,252.7],"sk":[423.7,238.2],"tn":[211.4,606.6],"tg":[225.2,456.6],"tr":[489.5,326.9],"up":[277.1,260.3],"ut":[234.3,173.6],"wb":[409.6,339.1]};
