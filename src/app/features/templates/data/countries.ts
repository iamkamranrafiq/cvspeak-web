/**
 * Country metadata for the templates catalogue.
 * `theme` maps to a visual style preset in TemplatePreviewComponent —
 * countries that share a hiring culture share a theme.
 */
export interface CountryMeta {
  code: string;        // ISO-ish lowercase: us, uk, de, ae, sa, kr, ...
  name: string;
  flag: string;        // emoji
  region: 'NA' | 'EU' | 'ME' | 'APAC' | 'SA' | 'AF' | 'OC';
  theme:
    | 'silicon-valley' | 'london-corporate' | 'berlin-ats' | 'paris-creative'
    | 'milan-editorial' | 'madrid-warm' | 'amsterdam-clean' | 'scandinavian'
    | 'zurich-precision' | 'sydney-modern' | 'dubai-luxury' | 'riyadh-executive'
    | 'doha-premium' | 'karachi-vibrant' | 'mumbai-vibrant' | 'dhaka-vibrant'
    | 'singapore-sharp' | 'tokyo-compact' | 'seoul-modern' | 'shanghai-bold'
    | 'sao-paulo-warm' | 'mexico-warm' | 'capetown-classic' | 'istanbul-classic'
    | 'cairo-classic' | 'toronto-professional';
}

export const COUNTRIES: CountryMeta[] = [
  { code: 'us', name: 'United States',  flag: '🇺🇸', region: 'NA',   theme: 'silicon-valley' },
  { code: 'ca', name: 'Canada',         flag: '🇨🇦', region: 'NA',   theme: 'toronto-professional' },
  { code: 'uk', name: 'United Kingdom', flag: '🇬🇧', region: 'EU',   theme: 'london-corporate' },
  { code: 'de', name: 'Germany',        flag: '🇩🇪', region: 'EU',   theme: 'berlin-ats' },
  { code: 'fr', name: 'France',         flag: '🇫🇷', region: 'EU',   theme: 'paris-creative' },
  { code: 'it', name: 'Italy',          flag: '🇮🇹', region: 'EU',   theme: 'milan-editorial' },
  { code: 'es', name: 'Spain',          flag: '🇪🇸', region: 'EU',   theme: 'madrid-warm' },
  { code: 'nl', name: 'Netherlands',    flag: '🇳🇱', region: 'EU',   theme: 'amsterdam-clean' },
  { code: 'se', name: 'Sweden',         flag: '🇸🇪', region: 'EU',   theme: 'scandinavian' },
  { code: 'no', name: 'Norway',         flag: '🇳🇴', region: 'EU',   theme: 'scandinavian' },
  { code: 'ch', name: 'Switzerland',    flag: '🇨🇭', region: 'EU',   theme: 'zurich-precision' },
  { code: 'au', name: 'Australia',      flag: '🇦🇺', region: 'OC',   theme: 'sydney-modern' },
  { code: 'nz', name: 'New Zealand',    flag: '🇳🇿', region: 'OC',   theme: 'sydney-modern' },
  { code: 'ae', name: 'UAE',            flag: '🇦🇪', region: 'ME',   theme: 'dubai-luxury' },
  { code: 'sa', name: 'Saudi Arabia',   flag: '🇸🇦', region: 'ME',   theme: 'riyadh-executive' },
  { code: 'qa', name: 'Qatar',          flag: '🇶🇦', region: 'ME',   theme: 'doha-premium' },
  { code: 'pk', name: 'Pakistan',       flag: '🇵🇰', region: 'APAC', theme: 'karachi-vibrant' },
  { code: 'in', name: 'India',          flag: '🇮🇳', region: 'APAC', theme: 'mumbai-vibrant' },
  { code: 'bd', name: 'Bangladesh',     flag: '🇧🇩', region: 'APAC', theme: 'dhaka-vibrant' },
  { code: 'sg', name: 'Singapore',      flag: '🇸🇬', region: 'APAC', theme: 'singapore-sharp' },
  { code: 'my', name: 'Malaysia',       flag: '🇲🇾', region: 'APAC', theme: 'singapore-sharp' },
  { code: 'jp', name: 'Japan',          flag: '🇯🇵', region: 'APAC', theme: 'tokyo-compact' },
  { code: 'kr', name: 'South Korea',    flag: '🇰🇷', region: 'APAC', theme: 'seoul-modern' },
  { code: 'cn', name: 'China',          flag: '🇨🇳', region: 'APAC', theme: 'shanghai-bold' },
  { code: 'br', name: 'Brazil',         flag: '🇧🇷', region: 'SA',   theme: 'sao-paulo-warm' },
  { code: 'mx', name: 'Mexico',         flag: '🇲🇽', region: 'NA',   theme: 'mexico-warm' },
  { code: 'za', name: 'South Africa',   flag: '🇿🇦', region: 'AF',   theme: 'capetown-classic' },
  { code: 'tr', name: 'Turkey',         flag: '🇹🇷', region: 'EU',   theme: 'istanbul-classic' },
  { code: 'eg', name: 'Egypt',          flag: '🇪🇬', region: 'AF',   theme: 'cairo-classic' }
];

export const COUNTRY_BY_CODE: Record<string, CountryMeta> =
  Object.fromEntries(COUNTRIES.map(c => [c.code, c]));
