# Hospital Directory — India

A static, dependency-free front end for browsing hospitals in India. Search, filter by state,
city, ownership, department, accreditation and insurance scheme; open a record for departments,
leadership, insurance empanelment, ownership history and contact details.

No build step, no framework, no backend, no tracking. Three files do the work:
`index.html`, `assets/app.js`, `data/hospitals.js`.

---

## Read this before you publish

**This repository ships 16 sample records, not every hospital in India.** That gap is the point
of this section.

1. **No free, complete dataset exists** covering all ~70,000 Indian hospitals with doctors,
   ownership, history and insurance panels. The government open data covers name, location and
   category — not the 360° profile. The rest has to be collected hospital by hospital.
2. **Never invent a field.** A wrong doctor name, a wrong owner, or a wrong claim about an
   insurance tie-up on a public site is a defamation and consumer-harm problem, not a cosmetic
   bug. Every field in this app renders an explicit "not recorded" state when empty. Leave it
   empty. That is the correct behaviour, not a bug to paper over.
3. **Do not copy reviews.** Google, Practo and JustDial reviews are licensed content. Republishing
   them from a static site is a licence violation. Link out, or use an official API from your own
   backend and store only the aggregate score in `ratings`.
4. **Emergency numbers must be right or absent.** Someone may dial what you publish. Verify or
   omit.
5. The seed records are marked `dataStatus: "seed-unverified"` and the app displays an "Unverified"
   tag for them. Change it to `"verified"` only for rows you have actually checked against a source
   you recorded in `sources`.

---

## Run it

Open `index.html` in a browser. That is all — data is loaded as a plain script, not `fetch`, so
it works from `file://` with no local server.

## Deploy to GitHub Pages

```bash
git init
git add .
git commit -m "Hospital directory"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

Then: **Settings → Pages → Source: Deploy from a branch → `main` / `(root)`**.
Live at `https://<you>.github.io/<repo>/` in a minute or two. No workflow file needed.

---

## Getting real data in

### Bulk import (recommended starting point)

Open `tools/import.html` in a browser, load a CSV, map its columns to the schema, and download a
generated `hospitals.js`. Everything runs in the tab; nothing is uploaded.

### Sources worth starting from

| Source | What it gives you |
| --- | --- |
| [National Hospital Directory, data.gov.in](https://data.gov.in/catalog/hospital-directory-national-health-portal) | State-wise names, addresses, category, systems of medicine, contact details, PIN codes, specialisations. Open Government Licence — India. |
| National Hospital Directory with geo-codes (data.gov.in) | The same, plus latitude/longitude, facility type and government/private ownership. |
| All India Health Centres Directory (data.gov.in) | Public facilities — sub-centres, PHCs, CHCs, district and state hospitals. |
| Hospital's own website | The only reliable source for doctors, departments and insurance desks. |
| PM-JAY / state scheme empanelment lists | Authoritative for government scheme coverage. |

Attribute the Open Government Licence where required, and expect quality problems: the national
directory has known duplicate entries, stale phone numbers and some badly wrong coordinates.
Deduplicate on name + PIN code before importing.

### Schema

Documented in full at the top of `data/hospitals.js`. Only `id`, `name` and `type` are required.

```js
{
  id: "cmc-vellore",
  name: "Christian Medical College, Vellore",
  aka: "CMC Vellore",
  type: "government" | "private" | "trust",
  beds: 2900,
  accreditation: ["NABH"],
  specialties: ["Cardiology", "Neurology"],
  services: ["Blood bank"],
  ownership: { owner: "", foundedBy: "", founded: 1900, history: "" },
  location: { address: "", city: "", district: "", state: "", pincode: "", lat: 0, lng: 0 },
  contact: { phone: "", emergency: "", email: "", website: "" },
  insurance: { schemes: [], cashless: [], tpa: [] },
  keyDoctors: [{ name: "", role: "", department: "", qualification: "" }],
  ratings: { source: "Google", score: 4.2, count: 5100 },
  sources: [{ label: "", url: "" }],
  dataStatus: "seed-unverified",
  lastUpdated: "2026-09-03"
}
```

**Keep spellings consistent.** Facet lists are built from exact string matches, so
`"Obstetrics & gynaecology"` and `"Obstetrics and Gynecology"` become two separate filters.

---

## Scale

Filtering and sorting run over the full array in memory; results render 30 at a time via
`IntersectionObserver`, so DOM size stays flat however long the list is.

- **Up to ~15,000 records** — works as shipped.
- **Beyond that**, the single `hospitals.js` file becomes a slow first paint. Split it by state
  (`data/tamil-nadu.js`, etc.), load the national index lazily, or move search server-side.
  A ~70,000-record file with full profiles would be tens of megabytes and is not a sensible
  static payload.

---

## Display settings

Stored per-browser in `localStorage`, wrapped so that a browser blocking storage degrades to
session-only rather than breaking.

- Appearance: light, dark, match device
- Accent: six palettes, applied through CSS custom properties
- Text size: four steps, scaling the whole layout from the root font size
- Row spacing: comfortable or compact
- Result layout: list or cards
- Motion: on or reduced (`prefers-reduced-motion` is honoured regardless)

## Accessibility and responsiveness

Single-column below 720px with the filters in a bottom sheet, sidebar layout above 960px.
Keyboard-navigable throughout, visible focus rings, `/` focuses search, live-region result counts,
semantic landmarks, and a print stylesheet that strips the chrome.

## URLs

Filters and the open record live in the hash — `#state=Tamil+Nadu&spec=Cardiology&h=cmc-vellore` —
so any view is linkable and the browser back button works.

## Licence

Code: use it however you like. Data: whatever licence applies to the source you imported from —
the Open Government Licence (India) for data.gov.in material requires attribution.
