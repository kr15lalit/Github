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

  // Topics shown in the scrolling strip under the hero
  topics: [
    { name: "Health & Wellbeing" },
    { name: "Money & Markets" },
    { name: "Careers & Ambition" },
    { name: "Life Abroad" },
    { name: "Tech & AI" },
    { name: "Mind & Meaning" },
  ],

  // Hosts. Add a `photo` path (e.g. "assets/img/lalit.jpg") to replace the initials,
  // and LinkedIn/Instagram URLs to show profile links.
  hosts: [
    {
      name: "Lalit Sharma",
      role: "Co-host",
      work: "Program Manager · Adobe Firefly FDE team",
      bio: "Lalit works on Adobe Firefly, Adobe's family of generative AI models, as part of the Forward Deployed Engineering team. On the show, Lalit brings a builder's curiosity: how things really work, and what people learn on the way to getting there.",
      photo: "",
      links: [],
    },
    {
      name: "Vandana",
      role: "Co-host",
      work: "Manager · EY, DPIIT team",
      bio: "Vandana is a Manager with EY's team at DPIIT, the Government of India's Department for Promotion of Industry and Internal Trade. That view of policy, startups and public systems shapes the questions Vandana brings to every conversation.",
      photo: "",
      links: [],
    },
  ],

  // Guests. `episode` is the YouTube ID of their episode. Its thumbnail is the card image
  // unless you add `photo: "assets/img/guest-name.jpg"`.
  // Please double-check names and titles before going live.
  guests: [
    { name: "Aditya Nath Das", role: "Former IAS Officer", episode: "dM9CqdQ6ApI", topic: "Why 90% of UPSC aspirants fail" },
    { name: "Dr. Arun Tungaria", role: "Neurosurgeon", episode: "Db8uUA9dlYA", topic: "Anxiety, depression & mobile addiction" },
    { name: "Sanddeep Bajaj", role: "Numerologist", episode: "_TPYlhVhpy4", topic: "Does your birth date decide success?" },
    { name: "Nitisha Malhotra", role: "Astrologer & Numerologist", episode: "4ojqBPlD0Jo", topic: "Can destiny really be changed?" },
  ],

  // Featured episode in the hero (ID from https://www.youtube.com/watch?v=THIS_PART)
  featuredVideo: {
    id: "_TPYlhVhpy4",
    title: "Your Birth Date Is Deciding Success? Ignorance Could Affect Your Life",
    guest: "Ft. Sanddeep Bajaj, numerologist",
    duration: "54:12",
  },

  // Episodes grid
  videos: [
    { id: "4ojqBPlD0Jo", title: "Kya Kismat Badli Ja Sakti Hai? Astrology & Numerology Explained", duration: "1:04:08", tag: "Mind & Meaning" },
    { id: "Db8uUA9dlYA", title: "Anxiety, Depression & Mobile Addiction: The Hidden Effects on the Brain", duration: "1:10:33", tag: "Mental Health" },
    { id: "dM9CqdQ6ApI", title: "Why 90% of UPSC Aspirants Fail — Former IAS Officer Explains", duration: "1:16:57", tag: "Careers" },
    { id: "Wlg7mH0H8mo", title: "Do You Really Need a Guru? An Eye-Opening Truth About Spirituality", duration: "58:56", tag: "Spirituality" },
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

  // "Pitch your story" guest form. Answers go into your Google Form (and its Google Sheet).
  // Setup steps: see GUEST-FORM-SETUP.md. Until googleFormId and the entry IDs are filled in,
  // the form still works: it opens the visitor's email app with their answers filled in.
  guestForm: {
    googleFormId: "", // from your form's link: docs.google.com/forms/d/e/THIS_PART/viewform
    entries: {
      name: "", email: "", phone: "", city: "",
      role: "", link: "", industry: "",
      title: "", story: "", myth: "",
      language: "", mode: "", source: "",
    },
    // These must match the options in the Google Form exactly
    industries: ["Health & Medicine", "Money & Investing", "Government & Policy", "Tech & AI", "Business & Startups", "Careers & Education", "Spirituality & Wellbeing", "Arts, Media & Culture", "Something else"],
    languages: ["Hindi", "English", "Hinglish"],
    modes: ["In the studio", "Remote video call", "Either works"],
    sources: ["YouTube", "Instagram", "LinkedIn", "A friend", "Somewhere else"],
  },
};
