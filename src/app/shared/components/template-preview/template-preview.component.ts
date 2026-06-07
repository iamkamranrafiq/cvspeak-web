import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { eduList, sampleFor, SampleResume, skillBarsFrom, splitSkills } from '@features/templates/data/sample-resumes';
import { COUNTRY_BY_CODE, locationForCountry } from '@features/templates/data/countries';
import { ColorPalette, Typography, TemplateSummary } from '@core/models/api.models';

/**
 * Premium, live, themed resume preview.
 *
 * Renders one of six layout archetypes derived from the template's layoutType
 * (or an explicit layoutOverride): Sidebar, Two-column, Header band, Timeline,
 * Elegant and Compact. All colour flows from CSS custom properties so every
 * template/palette looks distinct without per-template CSS.
 *
 * Overridable from the builder: palette, fonts and layout. Supports a profile
 * photo and fully dynamic, reorderable main-column sections (summary,
 * achievements, experience, projects, education, skills, certifications,
 * awards, and custom sections).
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
         [style.--tp-primary]="primary()"
         [style.--tp-accent]="accent()"
         [style.--tp-surface]="surface()"
         [style.--tp-ink]="ink()"
         [style.--tp-fh]="headingFont()"
         [style.--tp-fb]="bodyFont()">

      <!-- ============================= SIDEBAR ============================= -->
      <ng-container *ngIf="archetype() === 'sidebar'">
        <div class="grid-side">
          <aside class="side panel">
            <ng-container *ngTemplateOutlet="avatar"></ng-container>
            <p class="side__name">{{ s().fullName }}</p>
            <p class="side__role">{{ s().title }}</p>
            <ng-container *ngTemplateOutlet="contactBlock; context: { dark: true }"></ng-container>
            <ng-container *ngTemplateOutlet="skillsBlock; context: { dark: true }"></ng-container>
            <ng-container *ngTemplateOutlet="langsBlock; context: { dark: true }"></ng-container>
            <ng-container *ngTemplateOutlet="certsSide; context: { dark: true }"></ng-container>
          </aside>
          <main class="main"><ng-container *ngTemplateOutlet="mainCol"></ng-container></main>
        </div>
      </ng-container>

      <!-- ============================= TWO-COLUMN ========================= -->
      <ng-container *ngIf="archetype() === 'two-col'">
        <header class="band">
          <div class="band__txt">
            <h1>{{ s().fullName }}</h1>
            <p class="band__role">{{ s().title }}</p>
            <p class="band__contact">{{ contactInline() }}</p>
          </div>
          <ng-container *ngTemplateOutlet="avatarSm"></ng-container>
        </header>
        <div class="grid-2col">
          <main class="main"><ng-container *ngTemplateOutlet="mainCol"></ng-container></main>
          <aside class="aside panel-light">
            <ng-container *ngTemplateOutlet="skillsBlock; context: { dark: false }"></ng-container>
            <ng-container *ngTemplateOutlet="langsBlock; context: { dark: false }"></ng-container>
            <ng-container *ngTemplateOutlet="certsSide; context: { dark: false }"></ng-container>
          </aside>
        </div>
      </ng-container>

      <!-- ============================= HEADER BAND ======================== -->
      <ng-container *ngIf="archetype() === 'header'">
        <header class="band">
          <div class="band__txt">
            <h1>{{ s().fullName }}</h1>
            <p class="band__role">{{ s().title }}</p>
            <p class="band__contact">{{ contactInline() }}</p>
          </div>
          <ng-container *ngTemplateOutlet="avatarSm"></ng-container>
        </header>
        <main class="main main--pad"><ng-container *ngTemplateOutlet="mainCol"></ng-container></main>
      </ng-container>

      <!-- ============================= TIMELINE =========================== -->
      <ng-container *ngIf="archetype() === 'timeline'">
        <main class="main main--pad timeline">
          <header class="plain">
            <div class="plain__row">
              <div>
                <h1>{{ s().fullName }}</h1>
                <p class="plain__role">{{ s().title }}</p>
              </div>
              <ng-container *ngTemplateOutlet="avatarSm"></ng-container>
            </div>
            <p class="plain__contact">{{ contactInline() }}</p>
            <div class="rule"></div>
          </header>
          <ng-container *ngTemplateOutlet="mainCol"></ng-container>
        </main>
      </ng-container>

      <!-- ============================= ELEGANT ============================ -->
      <ng-container *ngIf="archetype() === 'elegant'">
        <main class="main main--pad elegant">
          <header class="eleg">
            <h1>{{ s().fullName }}</h1>
            <p class="eleg__role">{{ s().title }}</p>
            <p class="eleg__contact">{{ contactInline() }}</p>
            <div class="eleg__rule"></div>
          </header>
          <ng-container *ngTemplateOutlet="mainCol"></ng-container>
        </main>
      </ng-container>

      <!-- ============================= COMPACT ============================ -->
      <ng-container *ngIf="archetype() === 'compact'">
        <main class="main main--cpad compact">
          <header class="plain plain--compact">
            <h1>{{ s().fullName }}</h1>
            <p class="plain__role">{{ s().title }} &nbsp;·&nbsp; <span class="plain__contact-inline">{{ contactInline() }}</span></p>
            <div class="rule"></div>
          </header>
          <ng-container *ngTemplateOutlet="mainCol"></ng-container>
        </main>
      </ng-container>

      <!-- ===================================================================
           SHARED TEMPLATES
           =================================================================== -->

      <!-- Avatar (sidebar, large) -->
      <ng-template #avatar>
        <div class="side__avatar">
          <img *ngIf="s().photo" [src]="s().photo" alt="">
          <span *ngIf="!s().photo">{{ initials() }}</span>
        </div>
      </ng-template>
      <!-- Avatar small (header/two-col/timeline) -->
      <ng-template #avatarSm>
        <div class="avatar-sm" *ngIf="s().photo"><img [src]="s().photo" alt=""></div>
      </ng-template>

      <!-- Contact block (sidebar) -->
      <ng-template #contactBlock let-dark="dark">
        <h4 class="panel__h">Contact</h4>
        <p class="prow"><span class="ic">✉</span>{{ email() }}</p>
        <p class="prow"><span class="ic">☎</span>{{ phone() }}</p>
        <p class="prow"><span class="ic">⚲</span>{{ location() }}</p>
        <p class="prow"><span class="ic">in</span>{{ linkedin() }}</p>
      </ng-template>

      <!-- Skills (bars) -->
      <ng-template #skillsBlock let-dark="dark">
        <h4 class="panel__h">Skills</h4>
        <div class="skillbar" *ngFor="let sk of skillBars()">
          <span class="skillbar__name">{{ sk.name }}</span>
          <span class="skillbar__track"><span class="skillbar__fill" [style.width.%]="sk.level"></span></span>
        </div>
      </ng-template>

      <!-- Languages -->
      <ng-template #langsBlock let-dark="dark">
        <h4 class="panel__h">Languages</h4>
        <div class="lang" *ngFor="let l of languages()">
          <span class="lang__name">{{ l.name }}</span>
          <span class="lang__dots"><i *ngFor="let d of dots; let i = index" [class.on]="i < l.level"></i></span>
        </div>
      </ng-template>

      <!-- Certifications (side panel) -->
      <ng-template #certsSide let-dark="dark">
        <ng-container *ngIf="s().certifications?.length">
          <h4 class="panel__h">Certifications</h4>
          <p class="side__cert" *ngFor="let c of s().certifications">{{ c }}</p>
        </ng-container>
      </ng-template>

      <!-- ===================================================================
           DYNAMIC MAIN COLUMN — sections rendered in chosen order
           =================================================================== -->
      <ng-template #mainCol>
        <section class="sec sec--{{ key }}" *ngFor="let key of mainKeys()">
          <h2>{{ sectionLabel(key) }}</h2>

          <ng-container [ngSwitch]="baseKey(key)">

            <p *ngSwitchCase="'summary'" class="lede">{{ s().summary }}</p>

            <ng-container *ngSwitchCase="'achievements'">
              <p class="ach" *ngFor="let a of s().achievements"><span class="star">★</span>{{ a }}</p>
            </ng-container>

            <ng-container *ngSwitchCase="'experience'">
              <div class="item" *ngFor="let e of s().experience">
                <div class="item__head">
                  <strong>{{ e.role }}</strong>
                  <span class="item__co" *ngIf="e.company">· {{ e.company }}</span>
                  <span class="item__date">{{ e.dates }}</span>
                </div>
                <ul><li *ngFor="let b of e.bullets">{{ b }}</li></ul>
              </div>
            </ng-container>

            <ng-container *ngSwitchCase="'projects'">
              <div class="item" *ngFor="let p of s().projects">
                <div class="item__head"><strong>{{ p.name }}</strong></div>
                <p class="item__detail">{{ p.detail }}</p>
              </div>
            </ng-container>

            <ng-container *ngSwitchCase="'education'">
              <div class="item" *ngFor="let ed of edu()">
                <div class="item__head">
                  <strong>{{ ed.degree }}</strong>
                  <span class="item__co" *ngIf="ed.school">· {{ ed.school }}</span>
                  <span class="item__date">{{ ed.dates }}</span>
                </div>
                <p class="item__detail" *ngIf="ed.detail">{{ ed.detail }}</p>
              </div>
            </ng-container>

            <div *ngSwitchCase="'skills'" class="pills">
              <span class="pill" *ngFor="let sk of skillTags()">{{ sk }}</span>
            </div>

            <ul *ngSwitchCase="'certifications'" class="bullets">
              <li *ngFor="let c of s().certifications">{{ c }}</li>
            </ul>

            <ul *ngSwitchCase="'awards'" class="bullets">
              <li *ngFor="let a of s().awards">{{ a }}</li>
            </ul>

            <p *ngSwitchDefault class="lede">{{ customBody(key) }}</p>
          </ng-container>
        </section>
      </ng-template>
    </div>
  `,
  styles: [`
    :host { display: block; width: 100%; height: 100%; }
    :host(.is-full) { height: auto; }

    .tp {
      width: 100%; height: 100%;
      background: var(--tp-surface);
      color: var(--tp-ink);
      font-family: var(--tp-fb, 'Inter'), system-ui, sans-serif;
      overflow: hidden; font-size: 11px; line-height: 1.5;
    }
    .tp--full { height: auto; min-height: 100%; overflow: visible; }
    .tp--serif h1, .tp--serif h2, .tp--serif h4, .tp--serif .band h1, .tp--serif .eleg h1 {
      font-family: var(--tp-fh, 'Source Serif Pro'), Georgia, serif;
    }

    h1 { font-family: var(--tp-fh, 'Inter'); font-size: 24px; font-weight: 800; margin: 0; line-height: 1.05; letter-spacing: -.01em; color: var(--tp-ink); }
    h2 { font-family: var(--tp-fh, 'Inter'); font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .12em; color: var(--tp-primary); margin: 0 0 6px; }
    .muted { color: color-mix(in srgb, var(--tp-ink) 55%, transparent); }
    .lede { margin: 0; }
    .sec { margin-bottom: 14px; }
    ul { margin: 5px 0 0; padding-left: 15px; }
    li { margin-bottom: 3px; }

    .ic { display: inline-flex; align-items: center; justify-content: center; width: 13px; height: 13px; margin-right: 6px; font-size: 8px; font-style: normal; border-radius: 4px; background: color-mix(in srgb, var(--tp-accent) 18%, transparent); color: var(--tp-accent); flex: 0 0 13px; font-weight: 700; }

    /* Experience / education items */
    .item { margin-bottom: 9px; }
    .item__head { display: flex; align-items: baseline; gap: 5px; flex-wrap: wrap; }
    .item__head strong { font-size: 11.5px; }
    .item__co { color: var(--tp-accent); font-weight: 600; }
    .item__date { margin-left: auto; font-size: 9.5px; white-space: nowrap; color: color-mix(in srgb, var(--tp-ink) 55%, transparent); }
    .item__detail { margin: 2px 0 0; font-size: 10px; color: color-mix(in srgb, var(--tp-ink) 75%, transparent); }

    /* Achievements */
    .ach { margin: 0 0 4px; padding-left: 15px; position: relative; }
    .ach .star { position: absolute; left: 0; color: var(--tp-accent); font-size: 9px; }

    /* Pills / bullets */
    .pills { display: flex; flex-wrap: wrap; gap: 5px; }
    .pill { font-size: 9.5px; font-weight: 600; padding: 3px 9px; border-radius: 999px; background: color-mix(in srgb, var(--tp-accent) 12%, transparent); color: color-mix(in srgb, var(--tp-accent) 78%, var(--tp-ink)); border: 1px solid color-mix(in srgb, var(--tp-accent) 25%, transparent); }
    .bullets { margin: 4px 0 0; padding-left: 15px; }

    /* ---------- Panels (sidebar/aside) ---------- */
    .panel__h { font-size: 9.5px; text-transform: uppercase; letter-spacing: .12em; margin: 12px 0 6px; padding-bottom: 4px; font-weight: 700; }
    .prow { display: flex; align-items: center; font-size: 9px; margin: 0 0 4px; word-break: break-all; }
    .skillbar { margin-bottom: 7px; }
    .skillbar__name { font-size: 9.5px; display: block; margin-bottom: 3px; }
    .skillbar__track { display: block; height: 4px; border-radius: 999px; }
    .skillbar__fill { display: block; height: 100%; border-radius: 999px; }
    .lang { display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px; }
    .lang__name { font-size: 9.5px; }
    .lang__dots { display: flex; gap: 3px; }
    .lang__dots i { width: 6px; height: 6px; border-radius: 50%; }

    /* Dark panel (sidebar) */
    .panel { color: #fff; }
    .panel .panel__h { color: #fff; border-bottom: 1px solid rgba(255,255,255,.25); }
    .panel .prow { color: rgba(255,255,255,.92); }
    .panel .ic { background: rgba(255,255,255,.18); color: #fff; }
    .panel .skillbar__name, .panel .lang__name { color: #fff; }
    .panel .skillbar__track { background: rgba(255,255,255,.2); }
    .panel .skillbar__fill { background: #fff; }
    .panel .lang__dots i { background: rgba(255,255,255,.28); }
    .panel .lang__dots i.on { background: #fff; }
    .side__cert { font-size: 9px; color: rgba(255,255,255,.9); margin: 0 0 5px; line-height: 1.4; }

    /* Light panel (two-col aside) */
    .panel-light .panel__h { color: var(--tp-primary); border-bottom: 1px solid color-mix(in srgb, var(--tp-primary) 20%, transparent); }
    .panel-light .skillbar__track { background: color-mix(in srgb, var(--tp-ink) 12%, transparent); }
    .panel-light .skillbar__fill { background: var(--tp-accent); }
    .panel-light .lang__dots i { background: color-mix(in srgb, var(--tp-ink) 18%, transparent); }
    .panel-light .lang__dots i.on { background: var(--tp-accent); }
    .panel-light .side__cert { font-size: 9px; color: color-mix(in srgb, var(--tp-ink) 80%, transparent); margin: 0 0 5px; }

    /* ---------- SIDEBAR layout ---------- */
    .grid-side { display: grid; grid-template-columns: 34% 66%; height: 100%; }
    .tp--side-right .grid-side { grid-template-columns: 66% 34%; }
    .tp--side-right .side { order: 2; }
    .side { background: linear-gradient(165deg, var(--tp-primary) 0%, color-mix(in srgb, var(--tp-primary) 78%, var(--tp-accent)) 100%); padding: 22px 16px; }
    .side__avatar { width: 64px; height: 64px; border-radius: 50%; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 800; color: var(--tp-primary); background: #fff; overflow: hidden; box-shadow: 0 4px 14px rgba(0,0,0,.25); }
    .side__avatar img { width: 100%; height: 100%; object-fit: cover; }
    .side__name { text-align: center; font-weight: 800; font-size: 14px; margin: 0; color: #fff; }
    .side__role { text-align: center; font-size: 10px; margin: 1px 0 6px; color: rgba(255,255,255,.8); }
    .main { padding: 22px 22px; min-width: 0; }

    /* ---------- Header band (header / two-col) ---------- */
    .band { background: linear-gradient(120deg, var(--tp-primary), color-mix(in srgb, var(--tp-primary) 70%, var(--tp-accent))); color: #fff; padding: 22px 26px; display: flex; align-items: center; gap: 14px; }
    .band__txt { flex: 1; min-width: 0; }
    .band h1 { color: #fff; }
    .band__role { margin: 3px 0 8px; font-size: 13px; font-weight: 600; color: rgba(255,255,255,.9); }
    .band__contact { font-size: 9.5px; color: rgba(255,255,255,.92); margin: 0; }
    .avatar-sm { width: 56px; height: 56px; border-radius: 50%; overflow: hidden; flex: 0 0 56px; border: 2px solid rgba(255,255,255,.6); }
    .avatar-sm img { width: 100%; height: 100%; object-fit: cover; }
    .main--pad { padding: 18px 26px; }

    /* header h2 accent bar */
    .tp--arch-header .sec h2, .tp--arch-two-col .sec h2 { position: relative; padding-left: 11px; }
    .tp--arch-header .sec h2::before, .tp--arch-two-col .sec h2::before { content: ''; position: absolute; left: 0; top: 1px; bottom: 1px; width: 3px; border-radius: 2px; background: var(--tp-accent); }

    /* ---------- Two-column body ---------- */
    .grid-2col { display: grid; grid-template-columns: 64% 36%; }
    .grid-2col .main { padding: 18px 18px 18px 26px; }
    .aside { padding: 18px 22px 18px 14px; border-left: 1px solid color-mix(in srgb, var(--tp-ink) 10%, transparent); }

    /* ---------- Timeline ---------- */
    .plain__row { display: flex; align-items: flex-start; gap: 12px; }
    .plain h1 { color: var(--tp-primary); }
    .plain__role { margin: 3px 0 6px; font-size: 13px; font-weight: 600; color: var(--tp-accent); }
    .plain__contact { font-size: 9.5px; color: color-mix(in srgb, var(--tp-ink) 70%, transparent); margin: 0; }
    .rule { height: 2px; background: linear-gradient(90deg, var(--tp-accent), transparent); margin: 10px 0 12px; border-radius: 2px; }
    .timeline .sec--experience { position: relative; padding-left: 16px; }
    .timeline .sec--experience::before { content: ''; position: absolute; left: 4px; top: 24px; bottom: 4px; width: 2px; background: color-mix(in srgb, var(--tp-accent) 30%, transparent); }
    .timeline .sec--experience .item { position: relative; }
    .timeline .sec--experience .item::before { content: ''; position: absolute; left: -16px; top: 4px; width: 9px; height: 9px; border-radius: 50%; background: var(--tp-accent); box-shadow: 0 0 0 2px var(--tp-surface); }

    /* ---------- Elegant ---------- */
    .elegant .eleg { text-align: center; margin-bottom: 6px; }
    .elegant .eleg h1 { font-size: 26px; font-weight: 600; letter-spacing: .04em; }
    .elegant .eleg__role { font-size: 12px; font-style: italic; color: var(--tp-accent); margin: 4px 0; }
    .elegant .eleg__contact { font-size: 9.5px; color: color-mix(in srgb, var(--tp-ink) 65%, transparent); margin: 0; }
    .elegant .eleg__rule { width: 56px; height: 2px; background: var(--tp-accent); margin: 12px auto 16px; }
    .elegant .sec h2 { text-align: center; letter-spacing: .22em; font-weight: 600; }
    .elegant .item__head { justify-content: center; text-align: center; }
    .elegant .item__date { margin-left: 6px; }
    .elegant .ach, .elegant .bullets, .elegant ul { text-align: left; max-width: 92%; margin-left: auto; margin-right: auto; }

    /* ---------- Compact ---------- */
    .main--cpad { padding: 16px 22px; }
    .compact { font-size: 10px; }
    .compact h1 { font-size: 20px; }
    .compact .sec { margin-bottom: 9px; }
    .compact .item { margin-bottom: 6px; }
    .compact li { margin-bottom: 1.5px; line-height: 1.35; }
    .plain--compact .plain__role { margin: 2px 0 0; }
    .plain__contact-inline { font-weight: 400; color: color-mix(in srgb, var(--tp-ink) 65%, transparent); }

    /* ---------- Thumbnail scale ---------- */
    .tp--thumb { transform-origin: top left; transform: scale(.46); width: 217.39%; height: 217.39%; pointer-events: none; }
  `]
})
export class TemplatePreviewComponent {
  def   = input.required<TemplateSummary>();
  thumb = input(true);
  data  = input<SampleResume | null>(null);
  // Builder overrides
  paletteOverride = input<ColorPalette | null>(null);
  fontOverride    = input<Typography | null>(null);
  layoutOverride  = input<string | null>(null);

  readonly dots = [0, 1, 2, 3, 4];

  // ----- Content -----
  s = computed<SampleResume>(() => this.data() ?? sampleFor(this.def().category));

  // ----- Resolved palette / fonts (override wins) -----
  primary = computed(() => this.paletteOverride()?.primary || this.def().palette?.primary || '#1e1b4b');
  accent  = computed(() => this.paletteOverride()?.accent  || this.def().palette?.accent  || '#7c3aed');
  surface = computed(() => this.paletteOverride()?.surface || this.def().palette?.surface || '#ffffff');
  ink     = computed(() => this.paletteOverride()?.ink     || this.def().palette?.ink     || '#0f172a');
  headingFont = computed(() => this.fontOverride()?.heading || this.def().typography?.heading || 'Inter');
  bodyFont    = computed(() => this.fontOverride()?.body    || this.def().typography?.body    || 'Inter');
  serifHead = computed(() => /playfair|garamond|cormorant|serif|georgia|times/i.test(this.headingFont()));

  // ----- Layout archetype -----
  private layoutType = computed(() => this.layoutOverride() || this.def().layoutType || 'single-column');
  archetype = computed<'sidebar' | 'two-col' | 'header' | 'timeline' | 'elegant' | 'compact'>(() => {
    switch (this.layoutType()) {
      case 'sidebar-left':
      case 'sidebar-right': return 'sidebar';
      case 'two-column':    return 'two-col';
      case 'header-block':  return 'header';
      case 'editorial':     return 'elegant';
      case 'compact':       return 'compact';
      default:              return 'timeline';
    }
  });
  sideRight = computed(() => this.layoutType() === 'sidebar-right');
  private sideHoused = computed(() => this.archetype() === 'sidebar' || this.archetype() === 'two-col');

  // ----- Contact -----
  initials = computed(() => this.s().fullName.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase());
  email    = computed(() => this.s().email || (this.s().fullName.split(' ')[0].toLowerCase() + '@email.com'));
  phone    = computed(() => this.s().phone || '+1 555 010 2024');
  location = computed(() => this.s().location || locationForCountry(this.def().countryCode));
  linkedin = computed(() => this.s().linkedin || ('linkedin.com/in/' + this.s().fullName.toLowerCase().replace(/[^a-z]+/g, '')));
  contactInline = computed(() => [this.email(), this.phone(), this.location(), this.linkedin()].filter(Boolean).join('  ·  '));

  // ----- Education / skills / languages -----
  edu = computed(() => eduList(this.s()));
  skillBars = computed(() => skillBarsFrom(this.s().skills, 6));
  skillTags = computed(() => splitSkills(this.s().skills, 12));
  languages = computed(() =>
    (this.def().supportedLanguages?.length ? this.def().supportedLanguages : ['English'])
      .slice(0, 4).map((name, i) => ({ name, level: i === 0 ? 5 : 4 })));

  // ----- Dynamic main-column sections -----
  private readonly DEFAULT_ORDER = ['summary', 'achievements', 'experience', 'projects', 'education', 'skills', 'certifications', 'awards'];
  mainKeys = computed<string[]>(() => {
    const s = this.s();
    let keys: string[];
    if (s.sectionOrder?.length) {
      keys = s.sectionOrder.slice();   // explicit order (builder) — respect hides
    } else {
      keys = this.DEFAULT_ORDER.slice();
      (s.customSections ?? []).forEach((_, i) => keys.push('custom:' + i));
    }
    if (this.sideHoused()) keys = keys.filter(k => k !== 'skills' && k !== 'certifications');
    return keys.filter(k => this.hasSection(k));
  });

  baseKey(key: string): string { return key.startsWith('custom:') ? 'custom' : key; }

  private hasSection(key: string): boolean {
    const s = this.s();
    switch (this.baseKey(key)) {
      case 'summary':        return !!s.summary;
      case 'achievements':   return !!s.achievements?.length;
      case 'experience':     return !!s.experience?.length;
      case 'projects':       return !!s.projects?.length;
      case 'education':      return this.edu().length > 0;
      case 'skills':         return this.skillTags().length > 0;
      case 'certifications': return !!s.certifications?.length;
      case 'awards':         return !!s.awards?.length;
      case 'custom':         return !!this.customBody(key);
      default:               return false;
    }
  }

  sectionLabel(key: string): string {
    const c = this.def().category;
    switch (this.baseKey(key)) {
      case 'summary':
        if (c === 'executive') return 'Executive Summary';
        if (c === 'fresh-graduate' || c === 'internship') return 'Objective';
        if (['graphic-designer','product-designer','ui-ux-designer','creative'].includes(c)) return 'About';
        if (['academic','research','professor'].includes(c)) return 'Research Interests';
        return 'Summary';
      case 'achievements':   return 'Key Achievements';
      case 'experience':     return 'Experience';
      case 'projects':       return 'Projects';
      case 'education':      return 'Education';
      case 'skills':         return 'Skills';
      case 'certifications': return 'Certifications';
      case 'awards':         return 'Awards';
      case 'custom':         return this.customTitle(key);
      default:               return '';
    }
  }

  private customIndex(key: string): number { return parseInt(key.split(':')[1] ?? '-1', 10); }
  customTitle(key: string): string { return this.s().customSections?.[this.customIndex(key)]?.title ?? 'Section'; }
  customBody(key: string): string { return this.s().customSections?.[this.customIndex(key)]?.body ?? ''; }
}
