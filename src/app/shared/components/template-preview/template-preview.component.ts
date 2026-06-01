import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { sampleFor, SampleResume } from '@features/templates/data/sample-resumes';
import { COUNTRY_BY_CODE, locationForCountry } from '@features/templates/data/countries';
import { TemplateSummary } from '@core/models/api.models';

/**
 * Renders a live, themed sample-resume preview for a TemplateDef.
 * Used as a thumbnail (thumb=true) inside template cards on the list page,
 * and at full scale on the detail page.
 *
 * Theme is derived from the template's country. Color palette and typography
 * come from the template definition itself, so two templates from the same
 * country can still look distinct.
 */
@Component({
  selector: 'app-template-preview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tp"
         [class]="'tp--theme-' + theme()"
         [class.tp--thumb]="thumb()"
         [style.--tp-primary]="def().palette?.primary"
         [style.--tp-accent]="def().palette?.accent"
         [style.--tp-surface]="def().palette?.surface"
         [style.--tp-ink]="def().palette?.ink"
         [style.--tp-font-h]="def().typography?.heading"
         [style.--tp-font-b]="def().typography?.body">

      <div class="tp__page" [class.tp__page--editorial]="def().layoutType === 'editorial'"
                            [class.tp__page--sidebar-left]="def().layoutType === 'sidebar-left'"
                            [class.tp__page--sidebar-right]="def().layoutType === 'sidebar-right'"
                            [class.tp__page--two-column]="def().layoutType === 'two-column'"
                            [class.tp__page--compact]="def().layoutType === 'compact'"
                            [class.tp__page--header-block]="def().layoutType === 'header-block'">

        <!-- Sidebar (when layout asks for it) -->
        <aside class="tp__side" *ngIf="def().layoutType === 'sidebar-left' || def().layoutType === 'sidebar-right'">
          <div class="tp__avatar">{{ initials() }}</div>
          <h3>Contact</h3>
          <p class="tp__small">{{ email() }}</p>
          <p class="tp__small">{{ phone() }}</p>
          <p class="tp__small">{{ location() }}</p>
          <h3>Skills</h3>
          <ul class="tp__chips">
            <li *ngFor="let s of skillList()">{{ s }}</li>
          </ul>
        </aside>

        <main class="tp__main">
          <header class="tp__head">
            <h1>{{ sample().fullName }}</h1>
            <p class="tp__title">{{ sample().title }}</p>
            <p class="tp__contact" *ngIf="!isSidebar()">
              {{ email() }} · {{ phone() }} · {{ location() }}
            </p>
            <div class="tp__rule"></div>
          </header>

          <section>
            <h2>{{ summaryLabel() }}</h2>
            <p>{{ sample().summary }}</p>
          </section>

          <section *ngIf="!isSidebar()">
            <h2>Skills</h2>
            <p>{{ sample().skills }}</p>
          </section>

          <section>
            <h2>Experience</h2>
            <div class="tp__entry" *ngFor="let e of sample().experience">
              <div class="tp__entry-head">
                <strong>{{ e.role }}</strong>
                <span class="tp__company">· {{ e.company }}</span>
                <span class="tp__date">{{ e.dates }}</span>
              </div>
              <ul>
                <li *ngFor="let b of e.bullets">{{ b }}</li>
              </ul>
            </div>
          </section>

          <section>
            <h2>Education</h2>
            <div class="tp__entry">
              <div class="tp__entry-head">
                <strong>{{ sample().education.degree }}</strong>
                <span class="tp__company">· {{ sample().education.school }}</span>
                <span class="tp__date">{{ sample().education.dates }}</span>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; width: 100%; height: 100%; }

    /* ---------- Skeleton ---------- */
    .tp {
      background: var(--tp-surface, #fff);
      color: var(--tp-ink, #111);
      font-family: var(--tp-font-b, Inter), sans-serif;
      overflow: hidden;
      width: 100%;
      height: 100%;
    }
    .tp__page { padding: 24px 28px; height: 100%; box-sizing: border-box; }
    .tp__page--sidebar-left  { display: grid; grid-template-columns: 32% 68%; padding: 0; height: 100%; }
    .tp__page--sidebar-right { display: grid; grid-template-columns: 68% 32%; padding: 0; height: 100%; }
    .tp__page--sidebar-right .tp__side { order: 2; }
    .tp__page--two-column main { columns: 2; column-gap: 18px; }
    .tp__page--compact .tp__entry ul li { font-size: 9.5px; line-height: 1.35; }

    /* Sidebar block */
    .tp__side {
      background: var(--tp-primary);
      color: #f4f4f5;
      padding: 22px 18px;
    }
    .tp__side h3 { font-size: 9.5px; text-transform: uppercase; letter-spacing: .12em; margin: 14px 0 6px; color: #fff; opacity: .9; }
    .tp__side .tp__small { font-size: 9px; opacity: .85; margin: 0 0 2px; }
    .tp__avatar {
      width: 46px; height: 46px; border-radius: 50%;
      background: var(--tp-accent); color: #fff; display: flex;
      align-items: center; justify-content: center; font-weight: 700; font-size: 14px;
      margin-bottom: 10px;
    }
    .tp__chips { list-style: none; padding: 0; margin: 4px 0 0; display: flex; flex-wrap: wrap; gap: 4px; }
    .tp__chips li { font-size: 8.5px; padding: 2px 6px; border-radius: 999px; background: rgba(255,255,255,.12); }
    .tp__main { padding: 24px 26px; min-width: 0; }
    .tp__page--sidebar-left .tp__main,
    .tp__page--sidebar-right .tp__main { padding: 24px 26px; }

    /* ---------- Typography ---------- */
    .tp h1 { font-family: var(--tp-font-h, Inter); font-size: 22px; margin: 0; line-height: 1.1; color: var(--tp-primary); letter-spacing: -.01em; }
    .tp h2 { font-family: var(--tp-font-h, Inter); font-size: 10.5px; text-transform: uppercase; letter-spacing: .1em; margin: 12px 0 5px; color: var(--tp-primary); }
    .tp p, .tp li { font-size: 10px; line-height: 1.45; margin: 0 0 3px; }
    .tp__title { color: var(--tp-accent); font-weight: 600; margin: 2px 0 4px; }
    .tp__contact { font-size: 9px; color: #555; }
    .tp__rule { height: 1px; background: var(--tp-primary); opacity: .15; margin: 8px 0 4px; }
    .tp__entry { margin: 4px 0 8px; }
    .tp__entry-head strong { font-size: 10.5px; }
    .tp__entry-head .tp__company { font-size: 10px; color: #444; margin-left: 2px; }
    .tp__entry-head .tp__date { float: right; font-size: 9.5px; color: #666; }
    .tp ul { margin: 3px 0 0 14px; padding: 0; }

    /* ---------- Thumbnail mode ---------- */
    .tp--thumb { transform-origin: top left; transform: scale(.46); width: 217.39%; height: 217.39%; pointer-events: none; }

    /* ====================================================================
       THEMES
       ==================================================================== */

    /* SILICON VALLEY — modern, generous whitespace, indigo accents */
    .tp--theme-silicon-valley h2 { border-bottom: 1px solid #e5e7eb; padding-bottom: 2px; }

    /* LONDON CORPORATE — classical, deep navy rules */
    .tp--theme-london-corporate h2 { border-bottom: 2px solid var(--tp-primary); padding-bottom: 2px; letter-spacing: .14em; }
    .tp--theme-london-corporate h1 { font-variant: small-caps; letter-spacing: .03em; }

    /* BERLIN ATS — quiet, monochrome, ATS-perfect */
    .tp--theme-berlin-ats h1 { font-weight: 700; }
    .tp--theme-berlin-ats h2 { color: #111; border-bottom: 1px solid #ddd; padding-bottom: 2px; }
    .tp--theme-berlin-ats .tp__title { color: #444; }

    /* ZURICH PRECISION — Swiss grid, single red rule */
    .tp--theme-zurich-precision h1 { font-weight: 800; }
    .tp--theme-zurich-precision .tp__rule { background: var(--tp-primary); opacity: 1; height: 2px; }
    .tp--theme-zurich-precision h2 { color: #000; }
    .tp--theme-zurich-precision .tp__title { color: var(--tp-primary); }

    /* AMSTERDAM CLEAN — slate + coral micro accent */
    .tp--theme-amsterdam-clean h2 { color: var(--tp-primary); border-left: 2px solid var(--tp-accent); padding-left: 6px; }

    /* SCANDINAVIAN — minimal, no rules */
    .tp--theme-scandinavian h1 { font-weight: 600; }
    .tp--theme-scandinavian h2 { color: #777; }
    .tp--theme-scandinavian .tp__title { color: #444; }

    /* PARIS CREATIVE — editorial serif, cream */
    .tp--theme-paris-creative { background: #faf6f0; }
    .tp--theme-paris-creative h1 { font-family: 'Playfair Display', Georgia, serif; font-weight: 400; font-style: italic; font-size: 26px; }
    .tp--theme-paris-creative h2 { font-family: 'Playfair Display', Georgia, serif; text-transform: none; letter-spacing: 0; font-style: italic; font-size: 13px; color: var(--tp-accent); }

    /* MILAN EDITORIAL — rose, magazine */
    .tp--theme-milan-editorial h1 { font-family: 'Playfair Display', Georgia, serif; font-weight: 700; }
    .tp--theme-milan-editorial h2 { color: var(--tp-accent); border-bottom: 1px dotted var(--tp-accent); padding-bottom: 2px; }

    /* MADRID WARM — coral header bar */
    .tp--theme-madrid-warm .tp__head { background: var(--tp-accent); color: #fff; margin: -24px -28px 12px; padding: 18px 28px; }
    .tp--theme-madrid-warm .tp__head h1, .tp--theme-madrid-warm .tp__head .tp__title { color: #fff; }
    .tp--theme-madrid-warm .tp__head .tp__contact { color: rgba(255,255,255,.85); }
    .tp--theme-madrid-warm .tp__rule { display: none; }

    /* SYDNEY MODERN — azure accent */
    .tp--theme-sydney-modern h2 { color: var(--tp-accent); }

    /* DUBAI LUXURY — dark canvas, gold ink */
    .tp--theme-dubai-luxury { background: #0a0a0a; color: #e8e1c4; }
    .tp--theme-dubai-luxury h1 { color: #e8d690; font-family: 'Cormorant Garamond', Georgia, serif; font-weight: 500; font-size: 26px; letter-spacing: .02em; }
    .tp--theme-dubai-luxury h2 { color: #d4af37; border-bottom: 1px solid rgba(212,175,55,.4); padding-bottom: 3px; letter-spacing: .18em; }
    .tp--theme-dubai-luxury .tp__title { color: #d4af37; font-style: italic; }
    .tp--theme-dubai-luxury .tp__contact { color: #b3a06a; }
    .tp--theme-dubai-luxury .tp__entry-head .tp__company,
    .tp--theme-dubai-luxury .tp__entry-head .tp__date { color: #b3a06a; }
    .tp--theme-dubai-luxury .tp__rule { background: #d4af37; opacity: .5; }

    /* RIYADH EXECUTIVE — champagne, elegant */
    .tp--theme-riyadh-executive { background: #fdfaf3; }
    .tp--theme-riyadh-executive h1 { font-family: 'Cormorant Garamond', Georgia, serif; color: #3b2f1c; }
    .tp--theme-riyadh-executive h2 { color: #b08d57; letter-spacing: .14em; }
    .tp--theme-riyadh-executive .tp__title { color: #b08d57; font-style: italic; }

    /* DOHA PREMIUM — same family, slightly different rhythm */
    .tp--theme-doha-premium { background: #0a0a0a; color: #f5e6b8; }
    .tp--theme-doha-premium h1 { color: #f5e6b8; font-family: 'Cormorant Garamond', Georgia, serif; }
    .tp--theme-doha-premium h2 { color: #d4af37; }
    .tp--theme-doha-premium .tp__title { color: #d4af37; }

    /* KARACHI VIBRANT — emerald sidebar nod */
    .tp--theme-karachi-vibrant .tp__side { background: linear-gradient(180deg, #064e3b 0%, #047857 100%); }
    .tp--theme-karachi-vibrant h2 { color: var(--tp-primary); }

    /* MUMBAI VIBRANT — saffron header */
    .tp--theme-mumbai-vibrant .tp__head { background: linear-gradient(135deg, #f59e0b 0%, #c2410c 100%); color: #fff; margin: -24px -28px 12px; padding: 18px 28px; }
    .tp--theme-mumbai-vibrant .tp__head h1,
    .tp--theme-mumbai-vibrant .tp__head .tp__title { color: #fff; }
    .tp--theme-mumbai-vibrant .tp__head .tp__contact { color: rgba(255,255,255,.9); }
    .tp--theme-mumbai-vibrant .tp__rule { display: none; }
    .tp--theme-mumbai-vibrant h2 { color: var(--tp-accent); }

    /* DHAKA VIBRANT — same family */
    .tp--theme-dhaka-vibrant .tp__side { background: linear-gradient(180deg, #065f46 0%, #059669 100%); }

    /* SINGAPORE SHARP — sharp blue */
    .tp--theme-singapore-sharp h2 { color: var(--tp-primary); border-bottom: 1px solid var(--tp-primary); padding-bottom: 2px; }

    /* TOKYO COMPACT — tight rhythm, sakura markers */
    .tp--theme-tokyo-compact h2 { color: #1a1a1a; }
    .tp--theme-tokyo-compact h2::before { content: '■'; color: var(--tp-accent); margin-right: 5px; font-size: 8px; }
    .tp--theme-tokyo-compact .tp__entry { margin: 3px 0 6px; }
    .tp--theme-tokyo-compact p, .tp--theme-tokyo-compact li { line-height: 1.3; }

    /* SEOUL MODERN — electric blue */
    .tp--theme-seoul-modern h2 { color: var(--tp-accent); border-bottom: 2px solid var(--tp-accent); padding-bottom: 2px; }

    /* SHANGHAI BOLD — bold coral header */
    .tp--theme-shanghai-bold .tp__head { background: var(--tp-primary); color: #fff; margin: -24px -28px 12px; padding: 18px 28px; }
    .tp--theme-shanghai-bold .tp__head h1, .tp--theme-shanghai-bold .tp__head .tp__title { color: #fff; }

    /* SÃO PAULO WARM */
    .tp--theme-sao-paulo-warm h2 { color: var(--tp-primary); }
    .tp--theme-sao-paulo-warm .tp__title { color: var(--tp-accent); }

    /* MEXICO WARM */
    .tp--theme-mexico-warm h2 { color: var(--tp-primary); border-left: 3px solid var(--tp-accent); padding-left: 6px; }

    /* CAPETOWN CLASSIC */
    .tp--theme-capetown-classic h2 { color: var(--tp-primary); }
    .tp--theme-capetown-classic h1 { font-family: 'Garamond', Georgia, serif; }

    /* ISTANBUL CLASSIC */
    .tp--theme-istanbul-classic h2 { color: var(--tp-accent); border-bottom: 1px solid var(--tp-accent); padding-bottom: 2px; }

    /* CAIRO CLASSIC */
    .tp--theme-cairo-classic h2 { color: var(--tp-primary); }

    /* TORONTO PROFESSIONAL */
    .tp--theme-toronto-professional h2 { color: var(--tp-primary); border-bottom: 1px solid #e5e7eb; padding-bottom: 2px; }
  `]
})
export class TemplatePreviewComponent {
  // Signal inputs — required so the computeds below react to input changes
  // (plain @Input properties are NOT tracked by computed(), which is why
  // live-typed data wasn't refreshing the preview).
  def   = input.required<TemplateSummary>();
  thumb = input(true);
  /** Optional real user data. When provided, displaces the sample candidate. */
  data  = input<SampleResume | null>(null);

  // Computed properties driven by def() + data()
  theme = computed(() => COUNTRY_BY_CODE[this.def().countryCode ?? '']?.theme ?? 'silicon-valley');
  sample = computed<SampleResume>(() => this.data() ?? sampleFor(this.def().category));
  isSidebar = computed(() => this.def().layoutType === 'sidebar-left' || this.def().layoutType === 'sidebar-right');
  initials = computed(() =>
    this.sample().fullName.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase());
  // Use `||` (not `??`) so empty strings from the builder fall back too,
  // preventing stray " · · " separators in the contact line.
  email = computed(() => this.sample().email || (this.sample().fullName.split(' ')[0].toLowerCase() + '@example.com'));
  phone = computed(() => this.sample().phone || '+1 555 010 2024');
  location = computed(() => this.sample().location || locationForCountry(this.def().countryCode));
  summaryLabel = computed(() => {
    const c = this.def().category;
    if (c === 'executive')      return 'Executive Summary';
    if (c === 'fresh-graduate' || c === 'internship') return 'Objective';
    if (c === 'graphic-designer' || c === 'product-designer' || c === 'ui-ux-designer' || c === 'creative') return 'About';
    if (c === 'academic' || c === 'research' || c === 'professor') return 'Research Interests';
    return 'Summary';
  });
  skillList = computed(() => this.sample().skills.split(/[·,•|]/).map(s => s.trim()).filter(Boolean).slice(0, 6));
}
