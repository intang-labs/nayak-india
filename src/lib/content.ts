// Shared copy and options for the NAYAK website.
// Headlines are Hindi (Devanagari); supporting text is everyday Hinglish.

export const SITE = {
  name: "NAYAK",
  fullName: "NavBharat Association of Young, Accountable Karyakartas",
  tagline: "कोटा को सर्वश्रेष्ठ बनाने का संकल्प",
  hashtag: "#EverythingWillGoOnRecord",
  instagramHandle: "n.a.y.a.k_india",
  instagramUrl: "https://www.instagram.com/n.a.y.a.k_india/",
  // Paste the full WhatsApp group invite link here to show the "WhatsApp group" buttons.
  whatsappGroupUrl: "",
};

export const VALUES = [
  { title: "जवाबदेही", text: "Jo zimmedaar hai, usse jawab maanga jaayega — officer ho ya hum khud." },
  { title: "पारदर्शिता", text: "Paisa, kaam aur faisle — sab kuch khule mein, sab ke saamne." },
  { title: "जनभागीदारी", text: "Sheher ke faisle sheher ke log milkar lein." },
  { title: "संस्थागत सुधार", text: "Ek-ek problem nahi, poora system theek karna hai." },
  { title: "जनहित", text: "Har kadam aam aadmi ke fayde ke liye." },
];

export const WHAT_WE_DO = [
  {
    title: "ग्राउंड पर जाँच",
    text: "Jahan kaam ruka hai ya galat ho raha hai, wahan hum khud jaate hain. Photo, video, documents — sab record pe.",
  },
  {
    title: "सवाल और फॉलो-अप",
    text: "Complaint, RTI aur officers se seedhi baat. Jab tak jawab nahi milta, follow-up chalta rahega.",
  },
  {
    title: "संवाद और समाधान",
    text: "Manthan jaise public sessions, jahan aap apni baat rakhte ho aur milkar solution nikalte hain.",
  },
];

// From the Manthan 2026 vision document
export const VISION_POINTS = [
  "Kota sirf rehne aur padhne ka sheher nahi, balki rozgaar aur udyamita ka kendra bane.",
  "Technology, clean energy aur modern infrastructure ko badhava.",
  "Har nagrik ko behtar zindagi, behtar suvidhayein aur naye mauke.",
  "Vikas jo samaveshi, paardarshi aur jawabdeh ho.",
];

export const SHORT_TERM_GOALS = [
  { name: "Trash Free – Spit Free", hindi: "स्वच्छ और थूक-मुक्त कोटा", goal: "Saaf sheher, behtar kachra management aur green jobs." },
  { name: "Smash The Mobile", hindi: "मोबाइल की लत से सक्रिय बचपन", goal: "Har ward mein surakshit park aur khel maidan, 'Phone-free Sunday'." },
  { name: "KEDL", hindi: "मनमानी के खिलाफ जनता की आवाज़", goal: "Galat bills par helpdesk, kanooni madad aur independent meter testing." },
  { name: "Education and Employment", hindi: "शिक्षा से रोजगार तक", goal: "ITI, college aur industry ki partnership; EV, solar, cyber security par focus." },
  { name: "Health", hindi: "सुलभ और समय पर स्वास्थ्य सेवा", goal: "Hospital audit, mohalla clinic aur students ke liye mental health centre." },
];

export const LONG_TERM_GOALS = [
  { name: "Better City Planning", hindi: "सुनियोजित और जाम-मुक्त कोटा", goal: "Parking, bus routes, EV charging, water audit aur ward-wise budget online." },
  { name: "Tech and Data Centre Hub", hindi: "उच्च-कौशल रोजगार का नया केंद्र", goal: "IT/ITES park, AI, cloud aur data centre ke mauke." },
  { name: "Agriculture and Food Processing Hub", hindi: "खेत से बाजार तक मूल्य संवर्धन", goal: "Food processing, cold storage aur kisan utpadak sangathan." },
  { name: "Tourism and Heritage Circuit", hindi: "चम्बल से विरासत तक", goal: "Chambal riverfront, Garadia Mahadev, Geparnath ko jodna." },
  { name: "Startup and Manufacturing", hindi: "स्थानीय उत्पादन, नए व्यवसाय", goal: "EV components, solar services, incubation aur MSME support." },
];

// Join form options (keys are stored in the database)
export const JOIN_REASONS = [
  { key: "change_kota", label: "Kota mein badlaav laana chahta/chahti hoon" },
  { key: "anti_corruption", label: "Bhrashtachar ke khilaaf awaaz uthana" },
  { key: "ward_problems", label: "Apne ward/mohalle ki problems solve karwana" },
  { key: "youth_public_life", label: "Youth ko public life mein aage laana" },
  { key: "volunteer", label: "Volunteer ke roop mein time dena" },
  { key: "skills", label: "Apni skills se contribute karna (design, social media, law, tech)" },
] as const;

export const KOTA_CHANGES = [
  { key: "roads", label: "Sadkein aur gaddhe" },
  { key: "drainage", label: "Naali, sewer aur paani ki nikasi" },
  { key: "transport", label: "Traffic, parking aur public transport" },
  { key: "cleanliness", label: "Safai aur kachra management" },
  { key: "water_power", label: "Paani aur bijli (bill, katauti)" },
  { key: "parks", label: "Park, khel maidan aur public spaces" },
  { key: "health", label: "Hospital aur health services" },
  { key: "encroachment", label: "Avaidh nirmaan aur atikraman" },
  { key: "streetlights", label: "Street lights aur suraksha" },
] as const;

// Report categories (keys must match the database check constraint)
export const REPORT_CATEGORIES = [
  { key: "roads", label: "Sadak / gaddhe" },
  { key: "drainage", label: "Naali / sewer" },
  { key: "garbage", label: "Kachra / safai" },
  { key: "water", label: "Paani" },
  { key: "electricity", label: "Bijli / bill" },
  { key: "streetlight", label: "Street light" },
  { key: "traffic", label: "Traffic / parking" },
  { key: "encroachment", label: "Avaidh nirmaan / atikraman" },
  { key: "corruption", label: "Bhrashtachar / rishwat" },
  { key: "other", label: "Kuch aur" },
] as const;

export const REPORT_STATUSES = [
  { key: "new", label: "Naya" },
  { key: "verifying", label: "Verify ho raha hai" },
  { key: "in_progress", label: "Kaam chal raha hai" },
  { key: "resolved", label: "Hal ho gaya" },
  { key: "rejected", label: "Reject" },
] as const;

export const MEMBER_STATUSES = [
  { key: "new", label: "Naya" },
  { key: "contacted", label: "Contact kiya" },
  { key: "active", label: "Active" },
  { key: "inactive", label: "Inactive" },
] as const;

export function labelFor<T extends { key: string; label: string }>(list: readonly T[], key: string) {
  return list.find((item) => item.key === key)?.label ?? key;
}

export const PHONE_PATTERN = /^\+?[0-9 -]{10,15}$/;
export function isValidPhone(value: string) {
  const v = value.trim();
  return PHONE_PATTERN.test(v) && v.replace(/\D/g, "").length >= 10;
}
