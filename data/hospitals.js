/* =========================================================================
   hospitals.js  —  the entire data layer of this site.
   Loaded as a plain script so the site also works from file:// (no fetch,
   no CORS, no server). Replace the array below with your real dataset.

   ---------------------------------------------------------------- SCHEMA
   {
     id:            "unique-slug",            // required, stable, URL-safe
     name:          "Full registered name",   // required
     aka:           "Common short name",      // optional
     type:          "government" | "private" | "trust",   // drives the colour rail
     beds:          1234,                     // number, optional
     accreditation: ["NABH", "JCI", "NABL"],  // optional
     specialties:   ["Cardiology", ...],      // controlled vocabulary — keep spellings
                                              // consistent or the facet list fragments
     services:      ["Blood bank", ...],      // optional
     ownership: {
       owner:       "Legal owner / operating group",
       foundedBy:   "Person or body",
       founded:     1956,                     // number
       history:     "Two or three factual sentences."
     },
     location: {
       address: "", city: "", district: "", state: "", pincode: "",
       lat: 0, lng: 0                          // optional, enables the Maps button
     },
     contact:  { phone: "", emergency: "", email: "", website: "" },
     insurance: {
       schemes:  ["Ayushman Bharat PM-JAY", "CGHS"],   // government schemes
       cashless: ["Insurer name", ...],                // direct cashless tie-ups
       tpa:      ["TPA name", ...]
     },
     keyDoctors: [
       { name: "", role: "", department: "", qualification: "" }
     ],
     ratings:    { source: "Google", score: 4.2, count: 5100 },  // aggregate only
     sources:    [{ label: "", url: "" }],
     dataStatus: "verified" | "seed-unverified",
     lastUpdated: "2026-09-03"
   }

   Every field is optional except id, name and type. Missing fields render an
   explicit "not recorded" state rather than a fabricated value. That is
   deliberate: an empty field is honest, an invented one is a liability.

   ------------------------------------------------------- ABOUT THIS SEED
   The 16 records below exist to demonstrate the interface. Founding years,
   bed counts and ownership are from general public knowledge and are NOT
   verified against a primary source — hence dataStatus "seed-unverified".
   Doctor names are deliberately left empty for private hospitals: naming a
   real clinician who no longer works there is a real-world harm, not a
   cosmetic bug. Verify or delete this seed before you publish.
   ========================================================================= */

window.HOSPITALS = [

  {
    id: "aiims-delhi",
    name: "All India Institute of Medical Sciences, New Delhi",
    aka: "AIIMS Delhi",
    type: "government",
    beds: 2500,
    accreditation: [],
    specialties: ["Cardiology", "Cardiothoracic surgery", "Neurology", "Neurosurgery", "Oncology",
      "Nephrology", "Gastroenterology", "Orthopaedics", "Paediatrics", "Ophthalmology",
      "Trauma & critical care", "General medicine", "General surgery", "Radiology"],
    services: ["24×7 casualty", "Blood bank", "Organ transplant", "Trauma centre", "Medical college"],
    ownership: {
      owner: "Ministry of Health and Family Welfare, Government of India",
      foundedBy: "Government of India",
      founded: 1956,
      history: "Established by an Act of Parliament as an autonomous institute of national importance, combining undergraduate and postgraduate medical education with patient care and research."
    },
    location: { address: "Ansari Nagar East", city: "New Delhi", district: "New Delhi", state: "Delhi", pincode: "110029" },
    contact: { phone: "011 2658 8500", emergency: "011 2659 3308", website: "https://www.aiims.edu" },
    insurance: { schemes: ["Ayushman Bharat PM-JAY", "CGHS"], cashless: [], tpa: [] },
    keyDoctors: [],
    sources: [{ label: "National Hospital Directory (data.gov.in)", url: "https://data.gov.in/catalog/hospital-directory-national-health-portal" }],
    dataStatus: "seed-unverified",
    lastUpdated: "2026-09-03"
  },

  {
    id: "pgimer-chandigarh",
    name: "Postgraduate Institute of Medical Education and Research",
    aka: "PGIMER",
    type: "government",
    beds: 2000,
    specialties: ["Cardiology", "Neurology", "Neurosurgery", "Nephrology", "Oncology",
      "Gastroenterology", "Endocrinology", "Paediatrics", "Transplant surgery", "General medicine",
      "Trauma & critical care"],
    services: ["24×7 casualty", "Blood bank", "Trauma centre", "Medical college"],
    ownership: {
      owner: "Ministry of Health and Family Welfare, Government of India",
      founded: 1962,
      history: "Founded as a postgraduate teaching and research institute serving north India, later granted institute-of-national-importance status."
    },
    location: { address: "Sector 12", city: "Chandigarh", district: "Chandigarh", state: "Chandigarh", pincode: "160012" },
    contact: { phone: "0172 274 7585", emergency: "0172 275 6666", website: "https://pgimer.edu.in" },
    insurance: { schemes: ["Ayushman Bharat PM-JAY", "CGHS"], cashless: [], tpa: [] },
    keyDoctors: [],
    sources: [],
    dataStatus: "seed-unverified",
    lastUpdated: "2026-09-03"
  },

  {
    id: "jipmer-puducherry",
    name: "Jawaharlal Institute of Postgraduate Medical Education and Research",
    aka: "JIPMER",
    type: "government",
    beds: 2100,
    specialties: ["Cardiology", "Neurology", "Oncology", "Nephrology", "Obstetrics & gynaecology",
      "Paediatrics", "General surgery", "General medicine", "Psychiatry", "Emergency medicine"],
    services: ["24×7 casualty", "Blood bank", "Medical college"],
    ownership: {
      owner: "Ministry of Health and Family Welfare, Government of India",
      founded: 1823,
      history: "Traces its origin to a medical school founded under French colonial administration in Puducherry, reconstituted after 1954 and later designated an institute of national importance."
    },
    location: { address: "Dhanvantari Nagar", city: "Puducherry", district: "Puducherry", state: "Puducherry", pincode: "605006" },
    contact: { phone: "0413 229 6000", emergency: "0413 229 6666", website: "https://jipmer.edu.in" },
    insurance: { schemes: ["Ayushman Bharat PM-JAY", "CGHS"], cashless: [], tpa: [] },
    keyDoctors: [],
    sources: [],
    dataStatus: "seed-unverified",
    lastUpdated: "2026-09-03"
  },

  {
    id: "kgmu-lucknow",
    name: "King George's Medical University",
    aka: "KGMU",
    type: "government",
    beds: 4500,
    specialties: ["Cardiology", "Neurosurgery", "Orthopaedics", "Oncology", "Paediatrics",
      "General surgery", "General medicine", "Dermatology", "Trauma & critical care", "Plastic surgery"],
    services: ["24×7 casualty", "Trauma centre", "Blood bank", "Medical college"],
    ownership: {
      owner: "Government of Uttar Pradesh",
      founded: 1905,
      history: "Began as King George's Medical College in Lucknow and was converted into a state medical university in 2002."
    },
    location: { address: "Shah Mina Road, Chowk", city: "Lucknow", district: "Lucknow", state: "Uttar Pradesh", pincode: "226003" },
    contact: { phone: "0522 225 7450", emergency: "0522 225 8880", website: "https://www.kgmu.org" },
    insurance: { schemes: ["Ayushman Bharat PM-JAY"], cashless: [], tpa: [] },
    keyDoctors: [],
    sources: [],
    dataStatus: "seed-unverified",
    lastUpdated: "2026-09-03"
  },

  {
    id: "rgggh-chennai",
    name: "Rajiv Gandhi Government General Hospital",
    aka: "GH Chennai",
    type: "government",
    beds: 2800,
    specialties: ["General medicine", "General surgery", "Cardiology", "Neurology", "Orthopaedics",
      "Obstetrics & gynaecology", "Paediatrics", "Trauma & critical care", "Emergency medicine"],
    services: ["24×7 casualty", "Trauma centre", "Blood bank", "Medical college"],
    ownership: {
      owner: "Government of Tamil Nadu",
      founded: 1664,
      history: "One of the oldest hospitals in India, originating as a garrison hospital in Madras and attached to Madras Medical College since the nineteenth century."
    },
    location: { address: "EVR Periyar Salai, Park Town", city: "Chennai", district: "Chennai", state: "Tamil Nadu", pincode: "600003" },
    contact: { phone: "044 2530 5000", emergency: "044 2530 5000" },
    insurance: { schemes: ["Ayushman Bharat PM-JAY", "Chief Minister's Comprehensive Health Insurance Scheme"], cashless: [], tpa: [] },
    keyDoctors: [],
    sources: [],
    dataStatus: "seed-unverified",
    lastUpdated: "2026-09-03"
  },

  {
    id: "cmc-vellore",
    name: "Christian Medical College, Vellore",
    aka: "CMC Vellore",
    type: "trust",
    beds: 2900,
    specialties: ["Cardiology", "Neurology", "Neurosurgery", "Oncology", "Nephrology",
      "Transplant surgery", "Gastroenterology", "Haematology", "Paediatrics", "Psychiatry",
      "General surgery", "General medicine"],
    services: ["24×7 casualty", "Blood bank", "Bone marrow transplant", "Medical college", "Rural outreach"],
    ownership: {
      owner: "Christian Medical College Vellore Association",
      foundedBy: "Ida S. Scudder",
      founded: 1900,
      history: "Started as a single-bed clinic by American medical missionary Ida Scudder and grew into a teaching hospital and medical college run by a Christian charitable association."
    },
    location: { address: "Ida Scudder Road", city: "Vellore", district: "Vellore", state: "Tamil Nadu", pincode: "632004" },
    contact: { phone: "0416 228 1000", emergency: "0416 228 2010", website: "https://www.cmch-vellore.edu" },
    insurance: { schemes: [], cashless: [], tpa: [] },
    keyDoctors: [],
    sources: [],
    dataStatus: "seed-unverified",
    lastUpdated: "2026-09-03"
  },

  {
    id: "tata-memorial-mumbai",
    name: "Tata Memorial Hospital",
    aka: "TMH",
    type: "trust",
    beds: 700,
    specialties: ["Oncology", "Radiology", "Haematology", "Transplant surgery", "General surgery", "Paediatrics"],
    services: ["Radiotherapy", "Bone marrow transplant", "Cancer registry", "Research centre"],
    ownership: {
      owner: "Tata Memorial Centre, under the Department of Atomic Energy",
      foundedBy: "Sir Dorabji Tata Trust",
      founded: 1941,
      history: "Founded by the Sir Dorabji Tata Trust as a dedicated cancer hospital and later handed to the Government of India; now operates under the Department of Atomic Energy as a national cancer centre."
    },
    location: { address: "Dr E Borges Road, Parel", city: "Mumbai", district: "Mumbai", state: "Maharashtra", pincode: "400012" },
    contact: { phone: "022 2417 7000", website: "https://tmc.gov.in" },
    insurance: { schemes: ["Ayushman Bharat PM-JAY", "CGHS"], cashless: [], tpa: [] },
    keyDoctors: [],
    sources: [],
    dataStatus: "seed-unverified",
    lastUpdated: "2026-09-03"
  },

  {
    id: "sankara-nethralaya-chennai",
    name: "Sankara Nethralaya",
    type: "trust",
    beds: 200,
    specialties: ["Ophthalmology"],
    services: ["Eye bank", "Retina services", "Cornea services", "Research centre"],
    ownership: {
      owner: "Medical Research Foundation",
      founded: 1978,
      history: "Set up as a not-for-profit eye hospital in Chennai under the Medical Research Foundation, with a stated model of cross-subsidising free care from paying patients."
    },
    location: { address: "College Road, Nungambakkam", city: "Chennai", district: "Chennai", state: "Tamil Nadu", pincode: "600006" },
    contact: { phone: "044 2827 1616", website: "https://www.sankaranethralaya.org" },
    insurance: { schemes: [], cashless: [], tpa: [] },
    keyDoctors: [],
    sources: [],
    dataStatus: "seed-unverified",
    lastUpdated: "2026-09-03"
  },

  {
    id: "apollo-greams-road-chennai",
    name: "Apollo Hospitals, Greams Road",
    aka: "Apollo Chennai",
    type: "private",
    beds: 560,
    accreditation: ["JCI", "NABH"],
    specialties: ["Cardiology", "Cardiothoracic surgery", "Oncology", "Neurology", "Neurosurgery",
      "Orthopaedics", "Transplant surgery", "Gastroenterology", "Nephrology", "Emergency medicine"],
    services: ["24×7 casualty", "Blood bank", "Organ transplant", "Health check programmes"],
    ownership: {
      owner: "Apollo Hospitals Enterprise Limited",
      foundedBy: "Dr Prathap C. Reddy",
      founded: 1983,
      history: "The first hospital of the Apollo group and widely described as India's first corporate hospital, opened in Chennai by cardiologist Prathap C. Reddy."
    },
    location: { address: "21 Greams Lane, off Greams Road", city: "Chennai", district: "Chennai", state: "Tamil Nadu", pincode: "600006" },
    contact: { phone: "044 2829 3333", emergency: "1066", website: "https://www.apollohospitals.com" },
    insurance: { schemes: [], cashless: [], tpa: [] },
    keyDoctors: [
      { name: "Dr Prathap C. Reddy", role: "Founder and Chairman", department: "Apollo Hospitals Enterprise", qualification: "Cardiologist" }
    ],
    sources: [],
    dataStatus: "seed-unverified",
    lastUpdated: "2026-09-03"
  },

  {
    id: "narayana-health-city-bengaluru",
    name: "Narayana Institute of Cardiac Sciences, Health City",
    aka: "Narayana Health City",
    type: "private",
    beds: 1000,
    accreditation: ["NABH"],
    specialties: ["Cardiology", "Cardiothoracic surgery", "Paediatrics", "Nephrology",
      "Transplant surgery", "Oncology", "Neurology", "Orthopaedics"],
    services: ["24×7 casualty", "Paediatric cardiac surgery", "Blood bank", "Organ transplant"],
    ownership: {
      owner: "Narayana Hrudayalaya Limited",
      foundedBy: "Dr Devi Prasad Shetty",
      founded: 2000,
      history: "Founded by cardiac surgeon Devi Shetty around a high-volume, low-cost model for cardiac surgery, later expanded into a multi-hospital campus in Bommasandra."
    },
    location: { address: "258/A Bommasandra Industrial Area, Anekal Taluk", city: "Bengaluru", district: "Bengaluru Urban", state: "Karnataka", pincode: "560099" },
    contact: { phone: "080 7122 2222", emergency: "1800 309 0309", website: "https://www.narayanahealth.org" },
    insurance: { schemes: [], cashless: [], tpa: [] },
    keyDoctors: [
      { name: "Dr Devi Prasad Shetty", role: "Founder and Chairman", department: "Cardiac surgery", qualification: "Cardiac surgeon" }
    ],
    sources: [],
    dataStatus: "seed-unverified",
    lastUpdated: "2026-09-03"
  },

  {
    id: "medanta-gurugram",
    name: "Medanta — The Medicity",
    aka: "Medanta Gurugram",
    type: "private",
    beds: 1250,
    accreditation: ["NABH"],
    specialties: ["Cardiology", "Cardiothoracic surgery", "Neurology", "Neurosurgery", "Oncology",
      "Transplant surgery", "Gastroenterology", "Orthopaedics", "Nephrology", "Emergency medicine"],
    services: ["24×7 casualty", "Organ transplant", "Blood bank", "Robotic surgery"],
    ownership: {
      owner: "Global Health Limited",
      foundedBy: "Dr Naresh Trehan",
      founded: 2009,
      history: "Built in Gurugram by cardiac surgeon Naresh Trehan as a multi-speciality institute organised around independent clinical institutes."
    },
    location: { address: "CH Baktawar Singh Road, Sector 38", city: "Gurugram", district: "Gurugram", state: "Haryana", pincode: "122001" },
    contact: { phone: "0124 414 1414", emergency: "0124 483 4567", website: "https://www.medanta.org" },
    insurance: { schemes: [], cashless: [], tpa: [] },
    keyDoctors: [
      { name: "Dr Naresh Trehan", role: "Chairman and Managing Director", department: "Cardiovascular surgery", qualification: "Cardiothoracic surgeon" }
    ],
    sources: [],
    dataStatus: "seed-unverified",
    lastUpdated: "2026-09-03"
  },

  {
    id: "kokilaben-mumbai",
    name: "Kokilaben Dhirubhai Ambani Hospital and Medical Research Institute",
    aka: "Kokilaben Hospital",
    type: "private",
    beds: 750,
    accreditation: ["NABH"],
    specialties: ["Cardiology", "Oncology", "Neurology", "Neurosurgery", "Orthopaedics",
      "Transplant surgery", "Nephrology", "Emergency medicine", "Paediatrics"],
    services: ["24×7 casualty", "Organ transplant", "Blood bank", "Robotic surgery"],
    ownership: {
      owner: "Reliance Foundation",
      founded: 2009,
      history: "Opened in Andheri, Mumbai under the Reliance Foundation and named after Kokilaben Ambani."
    },
    location: { address: "Rao Saheb Achutrao Patwardhan Marg, Four Bunglows, Andheri West", city: "Mumbai", district: "Mumbai Suburban", state: "Maharashtra", pincode: "400053" },
    contact: { phone: "022 4269 6969", emergency: "022 3096 6666", website: "https://www.kokilabenhospital.com" },
    insurance: { schemes: [], cashless: [], tpa: [] },
    keyDoctors: [],
    sources: [],
    dataStatus: "seed-unverified",
    lastUpdated: "2026-09-03"
  },

  {
    id: "lilavati-mumbai",
    name: "Lilavati Hospital and Research Centre",
    type: "trust",
    beds: 320,
    accreditation: ["NABH"],
    specialties: ["Cardiology", "Neurology", "Orthopaedics", "Gastroenterology", "Nephrology",
      "Oncology", "General surgery", "Emergency medicine"],
    services: ["24×7 casualty", "Blood bank", "Health check programmes"],
    ownership: {
      owner: "Lilavati Kirtilal Mehta Medical Trust",
      founded: 1997,
      history: "Run by a charitable trust established by the Mehta family and located in Bandra, Mumbai."
    },
    location: { address: "A-791 Bandra Reclamation, Bandra West", city: "Mumbai", district: "Mumbai Suburban", state: "Maharashtra", pincode: "400050" },
    contact: { phone: "022 2675 1000", emergency: "022 2675 1099", website: "https://www.lilavatihospital.com" },
    insurance: { schemes: [], cashless: [], tpa: [] },
    keyDoctors: [],
    sources: [],
    dataStatus: "seed-unverified",
    lastUpdated: "2026-09-03"
  },

  {
    id: "amrita-kochi",
    name: "Amrita Institute of Medical Sciences",
    aka: "Amrita Hospital Kochi",
    type: "trust",
    beds: 1300,
    accreditation: ["NABH"],
    specialties: ["Cardiology", "Cardiothoracic surgery", "Neurology", "Neurosurgery", "Oncology",
      "Transplant surgery", "Gastroenterology", "Nephrology", "Plastic surgery", "Paediatrics",
      "Emergency medicine"],
    services: ["24×7 casualty", "Organ transplant", "Blood bank", "Medical college"],
    ownership: {
      owner: "Mata Amritanandamayi Math",
      founded: 1998,
      history: "Established in Kochi by the Mata Amritanandamayi Math as a tertiary care teaching hospital."
    },
    location: { address: "Ponekkara, Edappally", city: "Kochi", district: "Ernakulam", state: "Kerala", pincode: "682041" },
    contact: { phone: "0484 285 1234", emergency: "0484 285 8000", website: "https://www.amritahospitals.org" },
    insurance: { schemes: [], cashless: [], tpa: [] },
    keyDoctors: [],
    sources: [],
    dataStatus: "seed-unverified",
    lastUpdated: "2026-09-03"
  },

  {
    id: "manipal-old-airport-bengaluru",
    name: "Manipal Hospital, Old Airport Road",
    aka: "Manipal Bengaluru",
    type: "private",
    beds: 600,
    accreditation: ["NABH"],
    specialties: ["Cardiology", "Neurology", "Orthopaedics", "Oncology", "Nephrology",
      "Gastroenterology", "Transplant surgery", "Emergency medicine", "Paediatrics"],
    services: ["24×7 casualty", "Blood bank", "Organ transplant"],
    ownership: {
      owner: "Manipal Health Enterprises",
      founded: 1991,
      history: "The flagship Bengaluru hospital of the Manipal group, which grew out of the Manipal education and healthcare institutions in coastal Karnataka."
    },
    location: { address: "98 Rustom Bagh, HAL Airport Road", city: "Bengaluru", district: "Bengaluru Urban", state: "Karnataka", pincode: "560017" },
    contact: { phone: "080 2502 4444", emergency: "1800 102 5555", website: "https://www.manipalhospitals.com" },
    insurance: { schemes: [], cashless: [], tpa: [] },
    keyDoctors: [],
    sources: [],
    dataStatus: "seed-unverified",
    lastUpdated: "2026-09-03"
  },

  {
    id: "sctimst-thiruvananthapuram",
    name: "Sree Chitra Tirunal Institute for Medical Sciences and Technology",
    aka: "SCTIMST",
    type: "government",
    beds: 260,
    specialties: ["Cardiology", "Cardiothoracic surgery", "Neurology", "Neurosurgery", "Radiology"],
    services: ["Biomedical device research", "Cardiac catheterisation", "Blood bank"],
    ownership: {
      owner: "Department of Science and Technology, Government of India",
      founded: 1976,
      history: "Set up in Thiruvananthapuram as a specialised cardiac and neurological centre combined with a biomedical technology wing, and later declared an institute of national importance."
    },
    location: { address: "Medical College PO", city: "Thiruvananthapuram", district: "Thiruvananthapuram", state: "Kerala", pincode: "695011" },
    contact: { phone: "0471 252 4266", website: "https://www.sctimst.ac.in" },
    insurance: { schemes: ["Ayushman Bharat PM-JAY", "CGHS"], cashless: [], tpa: [] },
    keyDoctors: [],
    sources: [],
    dataStatus: "seed-unverified",
    lastUpdated: "2026-09-03"
  }

];
