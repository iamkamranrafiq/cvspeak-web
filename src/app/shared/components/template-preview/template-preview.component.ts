import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { eduList, sampleFor, SampleResume, skillBarsFrom, splitSkills } from '@features/templates/data/sample-resumes';
import { COUNTRY_BY_CODE, locationForCountry } from '@features/templates/data/countries';
import { TemplateSummary } from '@core/models/api.models';

/**
 * Premium, live, themed resume preview.
 *
 * Renders one of four layout archetypes (derived from the template's
 * layoutType): a Sidebar-Pro (photo + skill bars + languages), a Two-Tone
 * Header band, a Timeline, or an Elegant editorial layout.
 *
 * All colour comes from the template's palette via CSS custom properties,
 * so every template looks distinct without per-template CSS. Typography
 * (serif vs sans heading) is auto-detected from the template's heading font.
 *
 * Used as a thumbnail (thumb=true) inside cards, and full-size on the
 * detail page and resume builder (thumb=false). When `data` is supplied the
 * preview renders real user content instead of the sample candidate.
 */
@Component({
  selector: 'app-template-preview',
  standalone: true,
  imports: [CommonModule],
  host: { '[class.is-full]': '!thumb()' },
  template: `
    <div class="tp"
         [class]="'tp--arch-' + archetype()"
         [class.tp--thumb]="thumb()"
         [class.tp--full]="!thumb()"
         [class.tp--serif]="serifHead()"
         [class.tp--side-right]="sideRight()"
         [style.--tp-primary]="def().palette?.primary || '#1e1b4b'"
         [style.--tp-accent]="def().palette?.accent || '#7c3aed'"
         [style.--tp-surface]="def().palette?.surface || '#ffffff'"
         [style.--tp-ink]="def().palette?.ink || '#0f172a'">

      <!-- =========================================================== -->
      <!-- SIDEBAR PRO                                                  -->
      <!-- =========================================================== -->
      <ng-container *ngIf="archetype() === 'sidebar'">
        <div class="grid-side">
          <aside class="side">
            <div class="side__avatar">{{ initials() }}</div>
            <p class="side__name">{{ s().fullName }}</p>
            <p class="side__role">{{ s().title }}</p>

            <div class="side__block">
              <h4>Contact</h4>
              <p class="side__row"><span class="ic">✉</span>{{ email() }}</p>
              <p class="side__row"><span class="ic">☎</span>{{ phone() }}</p>
              <p class="side__row"><span class="ic">⚲</span>{{ location() }}</p>
              <p class="side__row"><span class="ic">in</span>{{ linkedin() }}</p>
            </div>

            <div class="side__block">
              <h4>Skills</h4>
              <div class="skillbar" *ngFor="let sk of skillBars()">
                <span class="skillbar__name">{{ sk.name }}</span>
                <span class="skillbar__track"><span class="skillbar__fill" [style.width.%]="sk.level"></span></span>
              </div>
            </div>

            <div class="side__block">
              <h4>Languages</h4>
              <div class="lang" *ngFor="let l of languages()">
                <span class="lang__name">{{ l.name }}</span>
                <span class="lang__dots">
                  <i *ngFor="let d of dots; let i = index" [class.on]="i < l.level"></i>
                </span>
              </div>
            </div>

            <div class="side__block" *ngIf="s().certifications?.length">
              <h4>Certifications</h4>
              <p class="side__cert" *ngFor="let c of s().certifications">{{ c }}</p>
            </div>
          </aside>

          <main class="main">
            <section class="block">
              <h2>{{ summaryLabel() }}</h2>
              <p class="lede">{{ s().summary }}</p>
            </section>
            <section class="block" *ngIf="s().achievements?.length">
              <h2>Key Achievements</h2>
              <ul class="ach"><li *ngFor="let a of s().achievements">{{ a }}</li></ul>
            </section>
            <section class="block">
              <h2>Experience</h2>
              <div class="tl">
                <div class="tl__item" *ngFor="let e of s().experience">
                  <div class="tl__head">
                    <strong>{{ e.role }}</strong>
                    <span class="muted">{{ e.dates }}</span>
                  </div>
                  <div class="tl__sub">{{ e.company }}</div>
                  <ul><li *ngFor="let b of e.bullets">{{ b }}</li></ul>
                </div>
              </div>
            </section>
            <section class="block">
              <h2>Education</h2>
              <div *ngFor="let ed of edu()" style="margin-bottom:6px;">
                <div class="tl__head"><strong>{{ ed.degree }}</strong><span class="muted">{{ ed.dates }}</span></div>
                <div class="tl__sub">{{ ed.school }}</div>
                <div class="muted" *ngIf="ed.detail" style="font-size:9.5px;">{{ ed.detail }}</div>
              </div>
            </section>
          </main>
        </div>
      </ng-container>

      <!-- =========================================================== -->
      <!-- TWO-TONE HEADER BAND                                         -->
      <!-- =========================================================== -->
      <ng-container *ngIf="archetype() === 'header'">
        <div class="hdr">
          <header class="hdr__band">
            <h1>{{ s().fullName }}</h1>
            <p class="hdr__role">{{ s().title }}</p>
            <p class="hdr__contact">
              <span><span class="ic">✉</span>{{ email() }}</span>
              <span><span class="ic">☎</span>{{ phone() }}</span>
              <span><span class="ic">⚲</span>{{ location() }}</span>
            </p>
          </header>
          <main class="hdr__body">
            <section class="block"><h2>{{ summaryLabel() }}</h2><p class="lede">{{ s().summary }}</p></section>
            <section class="block" *ngIf="s().achievements?.length">
              <h2>Key Achievements</h2>
              <ul class="ach"><li *ngFor="let a of s().achievements">{{ a }}</li></ul>
            </section>
            <section class="block">
              <h2>Experience</h2>
              <div class="exp" *ngFor="let e of s().experience">
                <div class="exp__head"><strong>{{ e.role }}</strong><span class="exp__co">· {{ e.company }}</span><span class="muted exp__date">{{ e.dates }}</span></div>
                <ul><li *ngFor="let b of e.bullets">{{ b }}</li></ul>
              </div>
            </section>
            <section class="block">
              <h2>Education</h2>
              <div class="exp" *ngFor="let ed of edu()">
                <div class="exp__head"><strong>{{ ed.degree }}</strong><span class="exp__co">· {{ ed.school }}</span><span class="muted exp__date">{{ ed.dates }}</span></div>
                <div class="muted" *ngIf="ed.detail" style="font-size:9.5px;">{{ ed.detail }}</div>
              </div>
            </section>
            <section class="block">
              <h2>Skills</h2>
              <div class="pills"><span class="pill" *ngFor="let sk of skillTags()">{{ sk }}</span></div>
            </section>
            <section class="block" *ngIf="s().certifications?.length">
              <h2>Certifications</h2>
              <ul class="certs"><li *ngFor="let c of s().certifications">{{ c }}</li></ul>
            </section>
          </main>
        </div>
      </ng-container>

      <!-- =========================================================== -->
      <!-- TIMELINE + SKILL PILLS                                       -->
      <!-- =========================================================== -->
      <ng-container *ngIf="archetype() === 'timeline'">
        <div class="tline">
          <header class="tline__head">
            <h1>{{ s().fullName }}</h1>
            <p class="tline__role">{{ s().title }}</p>
            <p class="tline__contact">
              <span class="ic">✉</span>{{ email() }} &nbsp;·&nbsp;
              <span class="ic">☎</span>{{ phone() }} &nbsp;·&nbsp;
              <span class="ic">⚲</span>{{ location() }}
            </p>
            <div class="rule"></div>
          </header>
          <section class="block"><h2>{{ summaryLabel() }}</h2><p class="lede">{{ s().summary }}</p></section>
          <section class="block" *ngIf="s().achievements?.length">
            <h2>Key Achievements</h2>
            <ul class="ach"><li *ngFor="let a of s().achievements">{{ a }}</li></ul>
          </section>
          <section class="block">
            <h2>Experience</h2>
            <div class="tl tl--marked">
              <div class="tl__item" *ngFor="let e of s().experience">
                <div class="tl__head"><strong>{{ e.role }}</strong><span class="tl__co">· {{ e.company }}</span><span class="muted tl__date">{{ e.dates }}</span></div>
                <ul><li *ngFor="let b of e.bullets">{{ b }}</li></ul>
              </div>
            </div>
          </section>
          <section class="block">
            <h2>Education</h2>
            <div class="tl tl--marked">
              <div class="tl__item" *ngFor="let ed of edu()">
                <div class="tl__head"><strong>{{ ed.degree }}</strong><span class="tl__co">· {{ ed.school }}</span><span class="muted tl__date">{{ ed.dates }}</span></div>
                <div class="muted" *ngIf="ed.detail" style="font-size:9.5px;">{{ ed.detail }}</div>
              </div>
            </div>
          </section>
          <section class="block">
            <h2>Skills</h2>
            <div class="pills"><span class="pill" *ngFor="let sk of skillTags()">{{ sk }}</span></div>
          </section>
          <section class="block" *ngIf="s().certifications?.length">
            <h2>Certifications</h2>
            <ul class="certs"><li *ngFor="let c of s().certifications">{{ c }}</li></ul>
          </section>
        </div>
      </ng-container>

      <!-- =========================================================== -->
      <!-- ELEGANT EDITORIAL                                            -->
      <!-- =========================================================== -->
      <ng-container *ngIf="archetype() === 'elegant'">
        <div class="eleg">
          <header class="eleg__head">
            <h1>{{ s().fullName }}</h1>
            <p class="eleg__role">{{ s().title }}</p>
            <p class="eleg__contact">{{ email() }} &nbsp;·&nbsp; {{ phone() }} &nbsp;·&nbsp; {{ location() }}</p>
            <div class="eleg__rule"></div>
          </header>
          <section class="block"><h2>{{ summaryLabel() }}</h2><p class="lede">{{ s().summary }}</p></section>
          <section class="block" *ngIf="s().achievements?.length">
            <h2>Key Achievements</h2>
            <ul class="ach ach--center"><li *ngFor="let a of s().achievements">{{ a }}</li></ul>
          </section>
          <section class="block">
            <h2>Experience</h2>
            <div class="eleg__exp" *ngFor="let e of s().experience">
              <div class="eleg__exp-head"><strong>{{ e.role }}</strong><span class="muted">{{ e.dates }}</span></div>
              <div class="eleg__co">{{ e.company }}</div>
              <ul><li *ngFor="let b of e.bullets">{{ b }}</li></ul>
            </div>
          </section>
          <section class="block">
            <h2>Education</h2>
            <div class="eleg__exp" *ngFor="let ed of edu()">
              <div class="eleg__exp-head"><strong>{{ ed.degree }}</strong><span class="muted">{{ ed.dates }}</span></div>
              <div class="eleg__co">{{ ed.school }}<span *ngIf="ed.detail"> · {{ ed.detail }}</span></div>
            </div>
          </section>
          <section class="block"><h2>Skills</h2><p class="eleg__skills">{{ s().skills }}</p></section>
          <section class="block" *ngIf="s().certifications?.length">
            <h2>Certifications</h2>
            <p class="eleg__skills" *ngFor="let c of s().certifications">{{ c }}</p>
          </section>
        </div>
      </ng-container>
    </div>
  `,
  styles: [`
    :host { display: block; width: 100%; height: 100%; }
    /* Full-size mode (builder / detail): grow to fit content so multi-page
       resumes are fully visible instead of clipped to one page. */
    :host(.is-full) { height: auto; }

    .tp {
      width: 100%; height: 100%;
      background: var(--tp-surface);
      color: var(--tp-ink);
      font-family: 'Inter', system-ui, sans-serif;
      overflow: hidden;
      font-size: 11px;
      line-height: 1.5;
    }
    .tp--full { height: auto; min-height: 100%; overflow: visible; }
    .tp--serif h1, .tp--serif h2, .tp--serif h4 {
      font-family: 'Source Serif Pro', Georgia, 'Times New Roman', serif;
    }

    /* shared atoms */
    h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -.01em; line-height: 1.05; color: var(--tp-ink); }
    h2 { margin: 0 0 7px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .12em; color: var(--tp-primary); }
    .muted { color: color-mix(in srgb, var(--tp-ink) 55%, transparent); font-weight: 500; }
    .lede { margin: 0; }
    .block { margin-bottom: 15px; }
    ul { margin: 5px 0 0; padding-left: 15px; }
    li { margin-bottom: 3px; }
    .ic {
      display: inline-flex; align-items: center; justify-content: center;
      width: 13px; height: 13px; margin-right: 6px; font-size: 8px; font-style: normal;
      border-radius: 4px; background: color-mix(in srgb, var(--tp-accent) 18%, transparent);
      color: var(--tp-accent); flex: 0 0 13px; font-weight: 700;
    }

    /* certifications */
    .certs { margin: 4px 0 0; padding-left: 15px; }
    .certs li { margin-bottom: 3px; }
    .side__cert { font-size: 9px; color: rgba(255,255,255,.9); margin: 0 0 5px; line-height: 1.4; }

    /* key achievements */
    .ach { list-style: none; padding: 0; margin: 0; }
    .ach li { position: relative; padding-left: 16px; margin-bottom: 4px; }
    .ach li::before {
      content: '★'; position: absolute; left: 0; top: 0;
      color: var(--tp-accent); font-size: 9px;
    }
    .ach--center { max-width: 92%; margin: 0 auto; }

    /* pills */
    .pills { display: flex; flex-wrap: wrap; gap: 5px; }
    .pill {
      font-size: 9.5px; font-weight: 600; padding: 3px 9px; border-radius: 999px;
      background: color-mix(in srgb, var(--tp-accent) 12%, transparent);
      color: color-mix(in srgb, var(--tp-accent) 75%, var(--tp-ink));
      border: 1px solid color-mix(in srgb, var(--tp-accent) 25%, transparent);
    }

    /* timeline list */
    .tl__item { margin-bottom: 9px; }
    .tl__head { display: flex; align-items: baseline; gap: 5px; }
    .tl__head strong { font-size: 11.5px; }
    .tl__co { color: color-mix(in srgb, var(--tp-ink) 65%, transparent); }
    .tl__date { margin-left: auto; font-size: 9.5px; white-space: nowrap; }
    .tl__sub { color: var(--tp-accent); font-weight: 600; margin-top: 1px; }
    .tl--marked { position: relative; padding-left: 16px; }
    .tl--marked::before {
      content: ''; position: absolute; left: 4px; top: 4px; bottom: 4px;
      width: 2px; background: color-mix(in srgb, var(--tp-accent) 30%, transparent);
    }
    .tl--marked .tl__item { position: relative; }
    .tl--marked .tl__item::before {
      content: ''; position: absolute; left: -16px; top: 4px;
      width: 9px; height: 9px; border-radius: 50%;
      background: var(--tp-accent); box-shadow: 0 0 0 2px var(--tp-surface);
    }

    /* ============================ SIDEBAR PRO ============================ */
    .grid-side { display: grid; grid-template-columns: 34% 66%; height: 100%; }
    .tp--side-right .grid-side { grid-template-columns: 66% 34%; }
    .tp--side-right .side { order: 2; }
    .side {
      background: linear-gradient(165deg,
        var(--tp-primary) 0%,
        color-mix(in srgb, var(--tp-primary) 80%, var(--tp-accent)) 100%);
      color: #fff; padding: 22px 18px;
    }
    .side__avatar {
      width: 64px; height: 64px; border-radius: 50%; margin: 0 auto 10px;
      display: flex; align-items: center; justify-content: center;
      font-size: 22px; font-weight: 800; color: var(--tp-primary);
      background: #fff; box-shadow: 0 4px 14px rgba(0,0,0,.25);
    }
    .side__name { text-align: center; font-weight: 800; font-size: 14px; margin: 0; color: #fff; }
    .side__role { text-align: center; font-size: 10px; margin: 1px 0 16px; color: rgba(255,255,255,.8); }
    .side__block { margin-bottom: 16px; }
    .side__block h4 {
      font-size: 10px; text-transform: uppercase; letter-spacing: .14em;
      margin: 0 0 8px; padding-bottom: 4px; color: #fff;
      border-bottom: 1px solid rgba(255,255,255,.25);
    }
    .side__row { display: flex; align-items: center; font-size: 9px; margin: 0 0 4px; color: rgba(255,255,255,.92); word-break: break-all; }
    .side__row .ic { background: rgba(255,255,255,.18); color: #fff; }
    .skillbar { margin-bottom: 7px; }
    .skillbar__name { font-size: 9.5px; display: block; margin-bottom: 3px; color: #fff; }
    .skillbar__track { display: block; height: 4px; border-radius: 999px; background: rgba(255,255,255,.2); }
    .skillbar__fill { display: block; height: 100%; border-radius: 999px; background: #fff; }
    .lang { display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px; }
    .lang__name { font-size: 9.5px; color: #fff; }
    .lang__dots { display: flex; gap: 3px; }
    .lang__dots i { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,.28); }
    .lang__dots i.on { background: #fff; }
    .main { padding: 22px 22px; min-width: 0; }
    .main h1 { display: none; }   /* name lives in the sidebar for this archetype */

    /* ============================ HEADER BAND ============================ */
    .hdr__band {
      background: linear-gradient(120deg, var(--tp-primary), color-mix(in srgb, var(--tp-primary) 70%, var(--tp-accent)));
      color: #fff; padding: 26px 28px 22px;
    }
    .hdr__band h1 { color: #fff; }
    .hdr__role { margin: 3px 0 12px; font-size: 13px; font-weight: 600; color: rgba(255,255,255,.9); }
    .hdr__contact { display: flex; flex-wrap: wrap; gap: 14px; font-size: 9.5px; color: rgba(255,255,255,.92); margin: 0; }
    .hdr__contact .ic { background: rgba(255,255,255,.2); color: #fff; }
    .hdr__contact span { display: inline-flex; align-items: center; }
    .hdr__body { padding: 20px 28px; }
    .hdr__body h2 { position: relative; padding-left: 12px; }
    .hdr__body h2::before { content: ''; position: absolute; left: 0; top: 1px; bottom: 1px; width: 4px; border-radius: 2px; background: var(--tp-accent); }
    .exp { margin-bottom: 10px; }
    .exp__head { display: flex; align-items: baseline; gap: 5px; }
    .exp__head strong { font-size: 11.5px; }
    .exp__co { color: color-mix(in srgb, var(--tp-ink) 60%, transparent); }
    .exp__date { margin-left: auto; font-size: 9.5px; white-space: nowrap; }

    /* ============================ TIMELINE ============================ */
    .tline { padding: 24px 26px; }
    .tline__head h1 { color: var(--tp-primary); }
    .tline__role { margin: 3px 0 8px; font-size: 13px; font-weight: 600; color: var(--tp-accent); }
    .tline__contact { font-size: 9.5px; margin: 0; color: color-mix(in srgb, var(--tp-ink) 70%, transparent); display: flex; align-items: center; flex-wrap: wrap; }
    .tline__contact .ic { margin-left: 0; }
    .rule { height: 2px; background: linear-gradient(90deg, var(--tp-accent), transparent); margin: 12px 0 14px; border-radius: 2px; }

    /* ============================ ELEGANT ============================ */
    .eleg { padding: 30px 34px; }
    .eleg__head { text-align: center; margin-bottom: 6px; }
    .eleg__head h1 { font-size: 26px; font-weight: 600; letter-spacing: .04em; }
    .eleg__role { font-size: 12px; font-style: italic; color: var(--tp-accent); margin: 4px 0; letter-spacing: .03em; }
    .eleg__contact { font-size: 9.5px; color: color-mix(in srgb, var(--tp-ink) 65%, transparent); margin: 4px 0 0; }
    .eleg__rule { width: 56px; height: 2px; background: var(--tp-accent); margin: 12px auto 16px; }
    .eleg .block h2 { text-align: center; letter-spacing: .26em; font-weight: 600; margin-bottom: 10px; }
    .eleg__exp { margin-bottom: 11px; }
    .eleg__exp-head { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; }
    .eleg__exp-head strong { font-size: 12px; }
    .eleg__co { font-style: italic; color: color-mix(in srgb, var(--tp-ink) 60%, transparent); margin-top: 1px; }
    .eleg__skills { text-align: center; }

    /* ============================ THUMBNAIL SCALE ============================ */
    .tp--thumb { transform-origin: top left; transform: scale(.46); width: 217.39%; height: 217.39%; pointer-events: none; }
  `]
})
export class TemplatePreviewComponent {
  def   = input.required<TemplateSummary>();
  thumb = input(true);
  data  = input<SampleResume | null>(null);

  readonly dots = [0, 1, 2, 3, 4];

  // ----- Core content -----
  s = computed<SampleResume>(() => this.data() ?? sampleFor(this.def().category));

  // ----- Layout archetype derived from the template's layoutType -----
  archetype = computed<'sidebar' | 'header' | 'timeline' | 'elegant'>(() => {
    switch (this.def().layoutType) {
      case 'sidebar-left':
      case 'sidebar-right':
      case 'two-column':   return 'sidebar';
      case 'header-block': return 'header';
      case 'editorial':    return 'elegant';
      default:             return 'timeline';   // single-column, compact, …
    }
  });
  sideRight = computed(() => this.def().layoutType === 'sidebar-right');

  // Serif heading detection from the template's heading font.
  serifHead = computed(() => {
    const h = (this.def().typography?.heading ?? '').toLowerCase();
    return /playfair|garamond|cormorant|serif|georgia|times/.test(h);
  });

  // ----- Contact (real data wins; `||` so empty strings fall back) -----
  initials = computed(() => this.s().fullName.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase());
  email    = computed(() => this.s().email || (this.s().fullName.split(' ')[0].toLowerCase() + '@email.com'));
  phone    = computed(() => this.s().phone || '+1 555 010 2024');
  location = computed(() => this.s().location || locationForCountry(this.def().countryCode));
  linkedin = computed(() => this.s().linkedin || ('linkedin.com/in/' + this.s().fullName.toLowerCase().replace(/[^a-z]+/g, '')));

  // ----- Education (object or array → array) -----
  edu = computed(() => eduList(this.s()));

  // ----- Skills / languages -----
  skillBars = computed(() => skillBarsFrom(this.s().skills, 6));
  skillTags = computed(() => splitSkills(this.s().skills, 12));
  languages = computed(() =>
    (this.def().supportedLanguages?.length ? this.def().supportedLanguages : ['English'])
      .slice(0, 4)
      .map((name, i) => ({ name, level: i === 0 ? 5 : 4 })));

  // ----- Section label adapts to category -----
  summaryLabel = computed(() => {
    const c = this.def().category;
    if (c === 'executive')                                                  return 'Executive Summary';
    if (c === 'fresh-graduate' || c === 'internship')                        return 'Objective';
    if (['graphic-designer','product-designer','ui-ux-designer','creative'].includes(c)) return 'About';
    if (['academic','research','professor'].includes(c))                     return 'Research Interests';
    return 'Summary';
  });
}
