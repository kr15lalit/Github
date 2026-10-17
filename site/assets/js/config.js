/* ==========================================================================
   SITE CONFIG — edit this file to update the site.
   Everything on the pages (name, tagline, links, episodes, stats) reads from here.
   ========================================================================== */

window.SITE = {
  channelName: "Insightoholix",
  handle: "@insightoholix",
  tagline: "Deep Conversations. Powerful Insights.",
  intro:
    "Candid conversations with professionals from diverse industries — entrepreneurs, creatives, doctors, investors and experts — about their journeys, their struggles and the lessons learned along the way.",
  youtubeUrl: "https://www.youtube.com/@insightoholix",
  subscribeUrl: "https://www.youtube.com/@insightoholix?sub_confirmation=1",
  logo: "assets/img/logo.jpg",

  // Shown in the hero "by the numbers" strip — update as the channel grows
  stats: [
    { value: "14.7K", label: "Subscribers" },
    { value: "66", label: "Videos" },
    { value: "∞", label: "Curiosity" },
  ],

  // Topics strip + topics section
  topics: [
    { name: "Health & Wellbeing", note: "Women's health, mental health, and the habits that shape both." },
    { name: "Money & Markets", note: "Trading, investing, insurance and the emotions behind every rupee." },
    { name: "Careers & Ambition", note: "UPSC, entrepreneurship and what it really takes to succeed." },
    { name: "Life Abroad", note: "Sweden, migration and the reality behind the dream destination." },
    { name: "Tech & AI", note: "LLMs, generative AI and building it responsibly." },
    { name: "Mind & Meaning", note: "Spirituality, astrology, numerology and the big questions." },
  ],

  // Featured episode in the hero (ID from https://www.youtube.com/watch?v=THIS_PART)
  featuredVideo: {
    id: "_TPYlhVhpy4",
    title: "Your Birth Date Is Deciding Success? Ignorance Could Affect Your Life",
    guest: "Ft. Sanddeep Bajaj & Arviend Sud",
    duration: "54:12",
  },

  // Episodes grid
  videos: [
    { id: "4ojqBPlD0Jo", title: "Kya Kismat Badli Ja Sakti Hai? Astrology & Numerology Explained", duration: "1:04:08", tag: "Mind & Meaning" },
    { id: "ahI9osLXDBY", title: "Children's Day Special — Gen Alpha vs 90s Kids: Who's Smarter?", duration: "48:20", tag: "Life" },
    { id: "XcICUW9XrS4", title: "Women's Health Secrets Doctors Rarely Tell You — Part 2", duration: "42:35", tag: "Health" },
    { id: "sDGD1Q-FGDk", title: "I Lost ₹3 Lakhs in 3 Months Trading — Here's What No One Tells You", duration: "19:59", tag: "Money" },
    { id: "Db8uUA9dlYA", title: "Anxiety, Depression & Mobile Addiction: The Hidden Effects on the Brain", duration: "1:10:33", tag: "Mental Health" },
    { id: "dM9CqdQ6ApI", title: "Why 90% of UPSC Aspirants Fail — Former IAS Officer Explains", duration: "1:16:57", tag: "Careers" },
    { id: "dYmflUeeVqM", title: "Is Sweden Still a Dream Destination? The Harsh Reality", duration: "46:00", tag: "Life Abroad" },
    { id: "Wlg7mH0H8mo", title: "Do You Really Need a Guru? An Eye-Opening Truth About Spirituality", duration: "58:56", tag: "Spirituality" },
    { id: "Cy5MKpEZcs0", title: "What's Next for Large Language Models? Responsible AI", duration: "45:56", tag: "Tech & AI" },
  ],

  about: {
    heading: "Real people. Unfiltered stories. Lessons you can use.",
    body: [
      "Insightoholix is a podcast for the curious. Every episode sits down with someone who has lived the thing we're talking about — the doctor, the investor, the officer, the person who packed up and moved across the world — and asks the questions most interviews skip.",
      "We talk about resilience, growth and the power of failure. The journal on this site goes one step further: episode notes, the thinking behind each conversation, and the everyday moments that never make the final cut.",
    ],
  },

  socials: [
    { name: "YouTube", url: "https://www.youtube.com/@insightoholix" },
    { name: "Instagram", url: "https://instagram.com/" },
    { name: "LinkedIn", url: "https://linkedin.com/" },
    { name: "Email", url: "mailto:hello@example.com" },
  ],

  contactEmail: "hello@example.com",
};
