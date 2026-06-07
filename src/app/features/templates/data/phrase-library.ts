/**
 * Static, curated bullet-phrase suggestions for the Resume Builder.
 * No paid AI — just well-written, impact-oriented starter phrases users can
 * click to insert and then edit. Grouped by a coarse category bucket so we
 * can surface relevant phrasing for the selected template's profession.
 */
export type PhraseBucket =
  | 'engineering' | 'design' | 'product' | 'marketing' | 'sales'
  | 'finance' | 'operations' | 'people' | 'healthcare' | 'legal'
  | 'education' | 'general';

/** Map a category slug (from CATEGORIES) to a phrase bucket. */
export function bucketForCategory(slug: string): PhraseBucket {
  if (/(software|frontend|backend|fullstack|devops|cloud|data-scientist|ai-engineer|cybersecurity|mobile|game|civil|mechanical|electrical|architect)/.test(slug)) return 'engineering';
  if (/(ui-ux|graphic|product-designer|creative)/.test(slug)) return 'design';
  if (/(product-manager|project-manager|business-analyst|consultant)/.test(slug)) return 'product';
  if (/(marketing|digital-marketing|seo)/.test(slug)) return 'marketing';
  if (/(sales|real-estate)/.test(slug)) return 'sales';
  if (/(finance|accountant|banking)/.test(slug)) return 'finance';
  if (/(operations|customer-support|hospitality|freelancer|government)/.test(slug)) return 'operations';
  if (/(hr|recruiter)/.test(slug)) return 'people';
  if (/(doctor|nurse|pharmacist)/.test(slug)) return 'healthcare';
  if (/(lawyer)/.test(slug)) return 'legal';
  if (/(teacher|professor|academic|research)/.test(slug)) return 'education';
  return 'general';
}

const GENERAL: string[] = [
  'Led [project] that delivered [result] within [timeframe].',
  'Improved [metric] by [X]% through [action].',
  'Owned [area] end-to-end, from [start] to [outcome].',
  'Collaborated cross-functionally with [teams] to ship [deliverable].',
  'Mentored [N] team members; [N] promoted within [period].',
  'Reduced [cost/time] by [X]% by [initiative].'
];

export const PHRASES: Record<PhraseBucket, string[]> = {
  engineering: [
    'Built and shipped [system] serving [N]M requests/day at [latency] p95.',
    'Cut p95 latency [X]% by [optimisation].',
    'Migrated [N] services to [platform] with zero downtime.',
    'Reduced cloud spend $[X]/year through [right-sizing/caching].',
    'Designed the [component] now used by [N]+ internal teams.',
    'Improved test coverage from [X]% to [Y]%, cutting regressions [Z]%.',
    'Led the on-call rotation and reduced paging volume [X]% with better alerting.'
  ],
  design: [
    'Led the [feature] redesign that lifted [activation/retention] [X]%.',
    'Built and maintained the design system adopted by [N]+ engineers.',
    'Ran [N] rounds of usability testing, resolving [N] critical UX issues.',
    'Increased task-completion rate [X]% through a streamlined flow.',
    'Shipped [feature] used by [N]M+ users within [timeframe].'
  ],
  product: [
    'Grew [product] from $[X] to $[Y] ARR in [N] months.',
    'Defined and delivered the roadmap for [area], hitting [N] of [N] OKRs.',
    'Ran discovery that killed [N] low-value bets before build.',
    'Launched [feature] adopted by [X]% of accounts in [timeframe].',
    'Partnered with [eng/design] to ship [deliverable] [X] weeks early.'
  ],
  marketing: [
    'Built the [ABM/demand-gen] program that closed $[X] in pipeline ([Y]× ROI).',
    'Grew organic traffic from [X] to [Y] monthly visitors in [N] months.',
    'Scaled paid acquisition from $[X] to $[Y] with positive payback.',
    'Launched a campaign covered by [publications].',
    'Lifted conversion rate [X]% through [experiment].'
  ],
  sales: [
    'Closed $[X] in new ARR ([Y]% of quota) — top [Z]% of the team.',
    'Landed the largest [region] new logo: $[X] ACV.',
    'Built a [N]-contact referral pipeline generating [X]% of new business.',
    'Maintained a [X]% win rate across [N] enterprise deals.',
    'Mentored [N] reps; [N] promoted to senior within [period].'
  ],
  finance: [
    'Owned the $[X] [opex/budget] plan with forecast accuracy within [Y]%.',
    'Led [N] clean year-end audits with zero material findings.',
    'Cut the monthly close from [X] to [Y] days.',
    'Built the [model] now used in every board pack.',
    'Saved $[X]/year through [cost initiative].'
  ],
  operations: [
    'Scaled the [team/function] from [X] to [Y] across [N] markets.',
    'Lifted [CSAT/on-time] from [X]% to [Y]%.',
    'Cut cost-per-[unit] [X]% via process redesign.',
    'Stood up the [vendor/QA] function governing $[X] annual spend.',
    'Reduced [cycle time] [X]% with [Lean/automation].'
  ],
  people: [
    'Partnered with [N] leaders across an [N]-person org.',
    'Held regretted attrition under [X]% during [period].',
    'Designed the [levelling/comp] framework adopted company-wide.',
    'Closed [N] hires with a [X]% offer-accept rate.',
    'Cut time-to-fill from [X] to [Y] days.'
  ],
  healthcare: [
    'Designed the [protocol] that cut [adverse event] [X]%.',
    'Co-authored a [journal] paper cited [N]+ times.',
    'Managed a [acuity/caseload] with zero [errors] in [period].',
    'Precepted [N]+ [students/residents] per year.',
    'Led the [QI/safety] initiative across [unit].'
  ],
  legal: [
    'Lead associate on $[X] in announced [M&A/deals] across [N] transactions.',
    'Drafted the [framework] adopted by a [client] worth $[X].',
    'Advised on [N] cross-border matters spanning [jurisdictions].',
    'Reduced contract turnaround [X]% via a clause-library overhaul.'
  ],
  education: [
    'Raised [exam] results from [X]% to [Y]% over [N] years.',
    'Secured $[X] in competitive research funding.',
    'Published [N] peer-reviewed papers; [N]+ citations.',
    'Advise [N] [PhD/MSc] students; [N] now in [roles].',
    'Designed the [curriculum] now used across [scope].'
  ],
  general: GENERAL
};

export function phrasesForCategory(slug: string): string[] {
  const bucket = bucketForCategory(slug);
  return PHRASES[bucket] ?? GENERAL;
}

/** Curated palette presets for the in-app colour switcher. */
export interface PalettePreset { name: string; primary: string; accent: string; surface: string; ink: string; }
export const PALETTE_PRESETS: PalettePreset[] = [
  { name: 'Midnight Indigo', primary: '#1e1b4b', accent: '#7c3aed', surface: '#ffffff', ink: '#0f172a' },
  { name: 'Atlantic Navy',   primary: '#0c2340', accent: '#1d4ed8', surface: '#ffffff', ink: '#0c1f33' },
  { name: 'Forest Emerald',  primary: '#064e3b', accent: '#059669', surface: '#ffffff', ink: '#0f172a' },
  { name: 'Graphite',        primary: '#1f2937', accent: '#4b5563', surface: '#ffffff', ink: '#111827' },
  { name: 'Crimson',         primary: '#7f1d1d', accent: '#dc2626', surface: '#ffffff', ink: '#1f0a0a' },
  { name: 'Saffron',         primary: '#7a2e0e', accent: '#e07a3c', surface: '#fffaf2', ink: '#3b1f0a' },
  { name: 'Royal Purple',    primary: '#4c1d95', accent: '#a855f7', surface: '#ffffff', ink: '#1e1033' },
  { name: 'Teal Pacific',    primary: '#0f766e', accent: '#14b8a6', surface: '#ffffff', ink: '#0a1f1c' },
  { name: 'Rose',            primary: '#831843', accent: '#ec4899', surface: '#ffffff', ink: '#2a0e1d' },
  { name: 'Obsidian Gold',   primary: '#0a0a0a', accent: '#d4af37', surface: '#0a0a0a', ink: '#f5e6b8' },
  { name: 'Slate Coral',     primary: '#101820', accent: '#fb7185', surface: '#ffffff', ink: '#101820' },
  { name: 'Bronze',          primary: '#3e1f12', accent: '#c2410c', surface: '#fdf7f0', ink: '#2b1408' }
];

/** Font choices for the in-app font switcher. */
export interface FontPreset { name: string; heading: string; body: string; }
export const FONT_PRESETS: FontPreset[] = [
  { name: 'Modern (Inter)',        heading: 'Inter',                 body: 'Inter' },
  { name: 'Classic Serif',         heading: 'Source Serif Pro',      body: 'Georgia' },
  { name: 'Elegant (Playfair)',    heading: 'Playfair Display',      body: 'Inter' },
  { name: 'Refined (Cormorant)',   heading: 'Cormorant Garamond',    body: 'Inter' },
  { name: 'Geometric (DM Sans)',   heading: 'DM Sans',               body: 'DM Sans' },
  { name: 'Mono Tech',             heading: 'IBM Plex Mono',         body: 'IBM Plex Sans' }
];

/** Layout choices for the in-app layout switcher (maps to preview archetypes). */
export interface LayoutPreset { name: string; layoutType: string; }
export const LAYOUT_PRESETS: LayoutPreset[] = [
  { name: 'Sidebar',        layoutType: 'sidebar-left' },
  { name: 'Sidebar (right)',layoutType: 'sidebar-right' },
  { name: 'Header band',    layoutType: 'header-block' },
  { name: 'Timeline',       layoutType: 'single-column' },
  { name: 'Two column',     layoutType: 'two-column' },
  { name: 'Elegant',        layoutType: 'editorial' },
  { name: 'Compact',        layoutType: 'compact' }
];
