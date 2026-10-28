import type { Skill } from "@/config/mvp";
export type Talent = {
  id: string;
  name: string;
  headline: string;
  category: string;
  skills: Skill[];
  state: string;
  city: string;
  availability: string;
  experience: string;
  stipend: { min: number; max: number };
  bio: string;
  education: { school: string; course: string; years: string }[];
  certifications: string[];
  workSamples: string[];
  idVerified: boolean;
  hasVideoCv: boolean;
  joined: string;
  country: string;
  initials: string;
  photo?: string;
};
const enrich = (profile: Omit<Talent, "country" | "initials">): Talent => ({
  ...profile,
  country: "Nigeria",
  initials: profile.name
    .split(" ")
    .map((name) => name[0])
    .slice(0, 2)
    .join("")
    .toUpperCase(),
});
export const talent: Talent[] = [
  enrich({
    id: `amara-okafor`,
    name: `Amara Okafor`,
    headline: `Frontend developer building fast, accessible web apps`,
    category: `Tech`,
    skills: [
      { name: `React`, level: `Professional` },
      { name: `TypeScript`, level: `Intermediate` },
      { name: `Tailwind CSS`, level: `Intermediate` },
    ],
    state: `Lagos`,
    city: `Ikeja`,
    availability: `Full-time`,
    experience: `1-2 years`,
    stipend: { min: 300, max: 450 },
    bio: `Computer science graduate who has shipped three production React apps for local startups. I care about clean UI and accessible components.`,
    education: [
      {
        school: `University of Lagos`,
        course: `B.Sc. Computer Science`,
        years: `2019 – 2023`,
      },
    ],
    certifications: [`Meta Front-End Developer Certificate`],
    workSamples: [`https://github.com/amaraokafor`, `https://amara.dev`],
    idVerified: !0,
    hasVideoCv: !0,
    joined: `2026-09-28`,
  }),
  enrich({
    id: `chinedu-eze`,
    name: `Chinedu Eze`,
    headline: `Data analyst turning spreadsheets into decisions`,
    category: `Business`,
    skills: [
      { name: `SQL`, level: `Intermediate` },
      { name: `Excel`, level: `Professional` },
      { name: `Power BI`, level: `Intermediate` },
    ],
    state: `Anambra`,
    city: `Onitsha`,
    availability: `Full-time`,
    experience: `6-12 months`,
    stipend: { min: 250, max: 400 },
    bio: `I build dashboards and reports that help small teams understand sales and operations data.`,
    education: [
      {
        school: `Nnamdi Azikiwe University`,
        course: `B.Sc. Economics`,
        years: `2018 – 2022`,
      },
    ],
    certifications: [`Google Data Analytics Certificate`],
    workSamples: [`https://public.tableau.com/chinedu`],
    idVerified: !0,
    hasVideoCv: !0,
    joined: `2026-09-20`,
  }),
  enrich({
    id: `wanjiru-adeyemi`,
    name: `Funke Adeyemi`,
    headline: `Backend engineer focused on APIs and payments`,
    category: `Tech`,
    skills: [
      { name: `Node.js`, level: `Professional` },
      { name: `PostgreSQL`, level: `Intermediate` },
      { name: `Python`, level: `Intermediate` },
    ],
    state: `Oyo`,
    city: `Ibadan`,
    availability: `Remote only`,
    experience: `3-5 years`,
    stipend: { min: 400, max: 600 },
    bio: `Built Paystack and Flutterwave integrations for two fintech startups. Comfortable owning a service end to end.`,
    education: [
      {
        school: `University of Ibadan`,
        course: `B.Sc. Computer Science`,
        years: `2016 – 2020`,
      },
    ],
    certifications: [`AWS Cloud Practitioner`],
    workSamples: [`https://github.com/fadeyemi`],
    idVerified: !0,
    hasVideoCv: !1,
    joined: `2026-10-02`,
  }),
  enrich({
    id: `thandi-balogun`,
    name: `Temi Balogun`,
    headline: `Marketing associate with a knack for social content`,
    category: `Business`,
    skills: [
      { name: `Social media`, level: `Professional` },
      { name: `Copywriting`, level: `Intermediate` },
      { name: `Canva`, level: `Professional` },
    ],
    state: `Lagos`,
    city: `Lekki`,
    availability: `Part-time`,
    experience: `1-2 years`,
    stipend: { min: 200, max: 350 },
    bio: `Grew a local fashion brand's Instagram from 2k to 30k followers in a year with consistent, on-brand content.`,
    education: [
      {
        school: `Covenant University`,
        course: `B.Sc. Mass Communication`,
        years: `2020 – 2023`,
      },
    ],
    certifications: [`HubSpot Content Marketing`],
    workSamples: [`https://behance.net/temibalogun`],
    idVerified: !0,
    hasVideoCv: !0,
    joined: `2026-09-15`,
  }),
  enrich({
    id: `yusuf-bello`,
    name: `Yusuf Bello`,
    headline: `Mobile developer shipping Flutter apps`,
    category: `Tech`,
    skills: [
      { name: `Flutter`, level: `Intermediate` },
      { name: `Dart`, level: `Intermediate` },
      { name: `Firebase`, level: `Beginner` },
    ],
    state: `Kano`,
    city: `Kano`,
    availability: `Full-time`,
    experience: `6-12 months`,
    stipend: { min: 350, max: 500 },
    bio: `Self-taught mobile developer with two apps on the Play Store and 10k+ combined downloads.`,
    education: [],
    certifications: [`Google Associate Android Developer`],
    workSamples: [`https://github.com/ybello`],
    idVerified: !1,
    hasVideoCv: !1,
    joined: `2026-08-30`,
  }),
  enrich({
    id: `chiamaka-nwosu`,
    name: `Chiamaka Nwosu`,
    headline: `Executive assistant who keeps teams on schedule`,
    category: `Administrative`,
    skills: [
      { name: `Scheduling`, level: `Professional` },
      { name: `Google Workspace`, level: `Professional` },
      { name: `Notion`, level: `Intermediate` },
    ],
    state: `FCT`,
    city: `Abuja`,
    availability: `Full-time`,
    experience: `3-5 years`,
    stipend: { min: 150, max: 250 },
    bio: `Managed calendars, travel and documentation for a 40-person NGO. Organised and quick to respond.`,
    education: [
      {
        school: `University of Abuja`,
        course: `B.A. English`,
        years: `2016 – 2020`,
      },
    ],
    certifications: [`Google Workspace Administrator`],
    workSamples: [],
    idVerified: !0,
    hasVideoCv: !0,
    joined: `2026-09-05`,
  }),
  enrich({
    id: `abebe-obi`,
    name: `Kelechi Obi`,
    headline: `UI designer crafting simple, usable interfaces`,
    category: `Tech`,
    skills: [
      { name: `Figma`, level: `Professional` },
      { name: `UI design`, level: `Intermediate` },
      { name: `Prototyping`, level: `Intermediate` },
    ],
    state: `Enugu`,
    city: `Enugu`,
    availability: `Remote only`,
    experience: `1-2 years`,
    stipend: { min: 250, max: 400 },
    bio: `I design dashboards and mobile apps, and I hand off clean Figma files developers enjoy working with.`,
    education: [
      {
        school: `University of Nigeria, Nsukka`,
        course: `B.Sc. Computer Science`,
        years: `2019 – 2023`,
      },
    ],
    certifications: [`Google UX Design Certificate`],
    workSamples: [`https://dribbble.com/kelechiobi`],
    idVerified: !0,
    hasVideoCv: !0,
    joined: `2026-09-25`,
  }),
  enrich({
    id: `fatou-musa`,
    name: `Amina Musa`,
    headline: `Customer support specialist, English and Hausa`,
    category: `Administrative`,
    skills: [
      { name: `Customer support`, level: `Professional` },
      { name: `Zendesk`, level: `Intermediate` },
      { name: `Hausa`, level: `Professional` },
    ],
    state: `Kaduna`,
    city: `Kaduna`,
    availability: `Part-time`,
    experience: `1-2 years`,
    stipend: { min: 150, max: 220 },
    bio: `Handled 60+ support tickets a day for an e-commerce company, keeping satisfaction above 95%.`,
    education: [
      {
        school: `Ahmadu Bello University`,
        course: `B.A. Linguistics`,
        years: `2019 – 2022`,
      },
    ],
    certifications: [],
    workSamples: [],
    idVerified: !1,
    hasVideoCv: !1,
    joined: `2026-08-18`,
  }),
  enrich({
    id: `nia-adewale`,
    name: `Ngozi Adewale`,
    headline: `Finance intern with bookkeeping experience`,
    category: `Business`,
    skills: [
      { name: `Bookkeeping`, level: `Intermediate` },
      { name: `QuickBooks`, level: `Beginner` },
      { name: `Excel`, level: `Intermediate` },
    ],
    state: `Rivers`,
    city: `Port Harcourt`,
    availability: `Full-time`,
    experience: `Less than 6 months`,
    stipend: { min: 200, max: 300 },
    bio: `Kept the books for three small businesses and prepared monthly reports for their owners.`,
    education: [
      {
        school: `University of Port Harcourt`,
        course: `B.Sc. Accounting`,
        years: `2020 – 2024`,
      },
    ],
    certifications: [`ICAN ATS Level 1`],
    workSamples: [],
    idVerified: !0,
    hasVideoCv: !1,
    joined: `2026-10-04`,
  }),
  enrich({
    id: `tendai-igwe`,
    name: `Emeka Igwe`,
    headline: `DevOps learner automating deployments`,
    category: `Tech`,
    skills: [
      { name: `Docker`, level: `Intermediate` },
      { name: `Linux`, level: `Intermediate` },
      { name: `CI/CD`, level: `Beginner` },
    ],
    state: `Delta`,
    city: `Asaba`,
    availability: `Remote only`,
    experience: `6-12 months`,
    stipend: { min: 300, max: 450 },
    bio: `I set up CI pipelines and container deployments for university projects and an open-source tool.`,
    education: [
      {
        school: `University of Benin`,
        course: `B.Eng. Computer Engineering`,
        years: `2019 – 2024`,
      },
    ],
    certifications: [`Linux Foundation LFCS`],
    workSamples: [`https://github.com/eigwe`],
    idVerified: !0,
    hasVideoCv: !0,
    joined: `2026-09-10`,
  }),
  enrich({
    id: `aisha-sule`,
    name: `Aisha Sule`,
    headline: `Project coordinator keeping work moving`,
    category: `Administrative`,
    skills: [
      { name: `Project coordination`, level: `Intermediate` },
      { name: `Trello`, level: `Professional` },
      { name: `Reporting`, level: `Intermediate` },
    ],
    state: `Borno`,
    city: `Maiduguri`,
    availability: `Full-time`,
    experience: `1-2 years`,
    stipend: { min: 180, max: 280 },
    bio: `Coordinated a 6-month community health project across four teams, tracking timelines and budgets.`,
    education: [
      {
        school: `University of Maiduguri`,
        course: `B.Sc. Business Administration`,
        years: `2018 – 2022`,
      },
    ],
    certifications: [`Google Project Management Certificate`],
    workSamples: [],
    idVerified: !1,
    hasVideoCv: !0,
    joined: `2026-09-01`,
  }),
  enrich({
    id: `kofi-adeleke`,
    name: `Seun Adeleke`,
    headline: `Sales development rep who loves cold outreach`,
    category: `Business`,
    skills: [
      { name: `Sales`, level: `Intermediate` },
      { name: `HubSpot`, level: `Beginner` },
      { name: `Lead research`, level: `Intermediate` },
    ],
    state: `Ogun`,
    city: `Abeokuta`,
    availability: `Part-time`,
    experience: `6-12 months`,
    stipend: { min: 200, max: 320 },
    bio: `Booked 40+ discovery calls a month for a B2B SaaS startup through email and LinkedIn outreach.`,
    education: [
      {
        school: `Olabisi Onabanjo University`,
        course: `B.Sc. Marketing`,
        years: `2019 – 2023`,
      },
    ],
    certifications: [`HubSpot Inbound Sales`],
    workSamples: [`https://linkedin.com/in/seunadeleke`],
    idVerified: !1,
    hasVideoCv: !1,
    joined: `2026-08-25`,
  }),
];

export const interns = talent;
