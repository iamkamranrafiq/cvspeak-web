import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { SeoService } from '@core/services/seo.service';
import { ColorPalette, TemplateSummary, Typography } from '@core/models/api.models';
import { TemplatePreviewComponent } from '@shared/components/template-preview/template-preview.component';
import { CustomSection, ProjectEntry, SampleResume, sampleFor } from '@features/templates/data/sample-resumes';
import { COUNTRY_BY_CODE, locationForCountry } from '@features/templates/data/countries';
import { CATEGORIES } from '@features/templates/data/categories';
import {
  FONT_PRESETS, LAYOUT_PRESETS, PALETTE_PRESETS, phrasesForCategory
} from '@features/templates/data/phrase-library';

interface ExperienceItem { role: string; company: string; from: string; to: string; bullets: string; }
interface EducationItem  { degree: string; school: string; year: string; }
interface SectionCfg     { key: string; label: string; visible: boolean; }

@Component({
  selector: 'app-resume-builder',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TemplatePreviewComponent],
  template: `
    <section class="builder-section">
      <div class="container">
        <header class="builder-head">
          <div>
            <div class="badge">Free · Live preview</div>
            <h1>Resume Builder</h1>
            <p class="text-muted">Customise everything on the left — see it live on the right.</p>
          </div>
          <div class="template-chip" *ngIf="template() as t">
            <div class="template-chip__swatch" [style.background]="activePrimary()"
                 [style.box-shadow]="'0 0 0 4px ' + activeAccent() + '33'"></div>
            <div class="template-chip__meta">
              <p class="kicker">Template</p>
              <h4>{{ t.name }}</h4>
              <p class="text-muted">{{ COUNTRY_BY_CODE[t.countryCode ?? '']?.flag }} {{ catLabel(t.category) }}</p>
            </div>
            <a routerLink="/templates" class="link" style="margin-left:auto;">Change →</a>
          </div>
          <div class="template-chip template-chip--missing" *ngIf="!template() && !loading()">
            <p class="text-muted" style="margin:0;">No template selected.</p>
            <a routerLink="/templates" class="btn btn--primary btn--sm">Pick a template →</a>
          </div>
        </header>

        <div class="builder">
          <!-- ============================ LEFT: CONTROLS + FORM ============================ -->
          <div class="builder__left">

            <!-- DESIGN TOOLBAR -->
            <div class="card panel-card">
              <h3>🎨 Design</h3>

              <label class="ctl-label">Layout</label>
              <div class="chips">
                <button type="button" class="chip" *ngFor="let l of LAYOUT_PRESETS"
                        [class.is-active]="activeLayout() === l.layoutType"
                        (click)="setLayout(l.layoutType)">{{ l.name }}</button>
              </div>

              <label class="ctl-label">Colour</label>
              <div class="swatches">
                <button type="button" class="swatch"
                        [class.is-active]="!paletteOverride()"
                        title="Template default"
                        [style.background]="template()?.palette?.primary || '#1e1b4b'"
                        (click)="setPalette(null)"><span class="swatch__a" [style.background]="template()?.palette?.accent"></span></button>
                <button type="button" class="swatch" *ngFor="let p of PALETTE_PRESETS"
                        [class.is-active]="paletteOverride()?.name === p.name"
                        [title]="p.name" [style.background]="p.primary"
                        (click)="setPalette(p)"><span class="swatch__a" [style.background]="p.accent"></span></button>
              </div>

              <div class="row2">
                <div>
                  <label class="ctl-label">Font</label>
                  <select class="input" [ngModel]="fontName()" (ngModelChange)="setFont($event)">
                    <option [ngValue]="''">Template default</option>
                    <option *ngFor="let f of FONT_PRESETS" [ngValue]="f.name">{{ f.name }}</option>
                  </select>
                </div>
                <div>
                  <label class="ctl-label">Photo</label>
                  <div class="photo-ctl">
                    <input #photoInput type="file" accept="image/*" hidden (change)="onPhoto($event)">
                    <button type="button" class="btn btn--ghost btn--sm" (click)="photoInput.click()">
                      {{ photo() ? 'Change' : 'Upload' }}
                    </button>
                    <button type="button" class="btn btn--ghost btn--sm" *ngIf="photo()" (click)="removePhoto()">Remove</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- ATS SCORE -->
            <div class="card panel-card ats">
              <div class="ats__ring" [style.--v]="ats().score">
                <span>{{ ats().score }}</span>
              </div>
              <div class="ats__body">
                <h3 style="margin:0 0 .3rem;">ATS score</h3>
                <p class="text-muted" style="margin:0 0 .4rem; font-size:.85rem;">
                  {{ ats().score >= 80 ? 'Strong — ready to apply.' : ats().score >= 60 ? 'Good — a few tweaks will help.' : 'Needs work — see tips.' }}
                </p>
                <ul class="ats__tips" *ngIf="ats().tips.length">
                  <li *ngFor="let tip of ats().tips">{{ tip }}</li>
                </ul>
              </div>
            </div>

            <!-- SECTIONS MANAGER -->
            <div class="card panel-card">
              <h3>🧩 Sections <span class="text-muted" style="font-weight:400;font-size:.8rem;">(reorder / show-hide)</span></h3>
              <div class="seclist">
                <div class="secrow" *ngFor="let sc of sections(); let i = index">
                  <span class="secrow__name" [class.is-hidden]="!sc.visible">{{ sc.label }}</span>
                  <div class="secrow__btns">
                    <button type="button" (click)="moveSection(i,-1)" [disabled]="i===0" title="Move up">↑</button>
                    <button type="button" (click)="moveSection(i,1)" [disabled]="i===sections().length-1" title="Move down">↓</button>
                    <button type="button" (click)="toggleSection(i)" [title]="sc.visible ? 'Hide' : 'Show'">{{ sc.visible ? '👁' : '🚫' }}</button>
                  </div>
                </div>
              </div>
              <div class="addsec">
                <select class="input" #addSel>
                  <option value="">+ Add section…</option>
                  <option value="projects">Projects</option>
                  <option value="awards">Awards</option>
                  <option value="custom">Custom section</option>
                </select>
                <button type="button" class="btn btn--ghost btn--sm" (click)="addSection(addSel.value); addSel.value='';">Add</button>
              </div>
            </div>

            <!-- FORM -->
            <div class="card builder__form" (input)="onEdit()">
              <h3>Contact</h3>
              <div class="grid grid-2">
                <input class="input" placeholder="Full name" [(ngModel)]="name">
                <input class="input" placeholder="Title (e.g. Senior PM)" [(ngModel)]="title">
                <input class="input" placeholder="Email" [(ngModel)]="email">
                <input class="input" placeholder="Phone" [(ngModel)]="phone">
                <input class="input" placeholder="Location" [(ngModel)]="location">
                <input class="input" placeholder="linkedin.com/in/…" [(ngModel)]="linkedin">
              </div>

              <h3>Summary</h3>
              <textarea class="textarea" rows="4" [(ngModel)]="summary"
                        placeholder="2-4 lines about who you are and what you do."></textarea>

              <h3>Experience</h3>
              <div *ngFor="let e of experience(); let i = index" class="sub-card">
                <div class="grid grid-2">
                  <input class="input" placeholder="Role" [(ngModel)]="e.role">
                  <input class="input" placeholder="Company" [(ngModel)]="e.company">
                  <input class="input" placeholder="From (e.g. Jan 2022)" [(ngModel)]="e.from">
                  <input class="input" placeholder="To (e.g. Present)" [(ngModel)]="e.to">
                </div>
                <textarea class="textarea" rows="4" style="margin-top:.5rem;"
                          placeholder="One achievement per line" [(ngModel)]="e.bullets"></textarea>
                <div class="exp-actions">
                  <button class="btn btn--ghost btn--sm" (click)="togglePhrases(i)">💡 Suggestions</button>
                  <button class="btn btn--ghost btn--sm" (click)="removeExperience(i)">Remove role</button>
                </div>
                <div class="phrases" *ngIf="phrasesFor() === i">
                  <p class="text-muted" style="font-size:.8rem;margin:.2rem 0 .4rem;">Click to insert, then edit the placeholders:</p>
                  <button type="button" class="phrase" *ngFor="let ph of phrases" (click)="insertPhrase(i, ph)">+ {{ ph }}</button>
                </div>
              </div>
              <button class="btn btn--ghost" (click)="addExperience()">+ Add role</button>

              <ng-container *ngIf="isVisible('projects')">
                <h3>Projects</h3>
                <div *ngFor="let p of projects(); let i = index" class="sub-card">
                  <input class="input" placeholder="Project name" [(ngModel)]="p.name">
                  <textarea class="textarea" rows="2" style="margin-top:.5rem;" placeholder="What it was and the impact" [(ngModel)]="p.detail"></textarea>
                  <button class="btn btn--ghost btn--sm" (click)="removeProject(i)">Remove</button>
                </div>
                <button class="btn btn--ghost" (click)="addProject()">+ Add project</button>
              </ng-container>

              <h3>Education</h3>
              <div *ngFor="let ed of education(); let i = index" class="sub-card">
                <div class="grid grid-2">
                  <input class="input" placeholder="Degree" [(ngModel)]="ed.degree">
                  <input class="input" placeholder="School" [(ngModel)]="ed.school">
                  <input class="input" placeholder="Year (e.g. 2019 — 2023)" [(ngModel)]="ed.year">
                </div>
                <button class="btn btn--ghost btn--sm" (click)="removeEducation(i)">Remove</button>
              </div>
              <button class="btn btn--ghost" (click)="addEducation()">+ Add degree</button>

              <h3>Skills</h3>
              <textarea class="textarea" rows="3" [(ngModel)]="skills"
                        placeholder="Separate with ·, comma or |"></textarea>

              <ng-container *ngIf="isVisible('awards')">
                <h3>Awards</h3>
                <textarea class="textarea" rows="3" [(ngModel)]="awardsText" placeholder="One award per line"></textarea>
              </ng-container>

              <ng-container *ngFor="let cs of customSections(); let i = index">
                <h3>{{ cs.title || 'Custom section' }}</h3>
                <input class="input" placeholder="Section title" [(ngModel)]="cs.title" style="margin-bottom:.5rem;">
                <textarea class="textarea" rows="3" [(ngModel)]="cs.body" placeholder="Content"></textarea>
              </ng-container>

              <div class="builder__cta">
                <button class="btn btn--primary" (click)="print()" [disabled]="generating()">
                  {{ generating() ? 'Generating…' : '⬇ Download as PDF' }}
                </button>
                <button class="btn btn--ghost" (click)="clearAll()">Start blank</button>
              </div>
            </div>
          </div>

          <!-- ============================ RIGHT: PREVIEW ============================ -->
          <div class="builder__preview" id="preview">
            <div class="preview-frame" *ngIf="template() as t; else noTemplate">
              <app-template-preview
                [def]="t" [data]="resumeData()" [thumb]="false"
                [paletteOverride]="paletteOverride()"
                [fontOverride]="fontOverride()"
                [layoutOverride]="layoutOverride()"></app-template-preview>
            </div>
            <ng-template #noTemplate>
              <div class="preview-frame preview-frame--empty">
                <div *ngIf="loading()" class="skel-shimmer" style="width:100%;height:100%;"></div>
                <div *ngIf="!loading()" style="padding:3rem;text-align:center;">
                  <div style="font-size:2.5rem;margin-bottom:.8rem;">🎨</div>
                  <h3>Pick a template to begin</h3>
                  <p class="text-muted" style="margin:.4rem 0 1rem;">Choose from 50 designs across 29 countries.</p>
                  <a routerLink="/templates" class="btn btn--primary">Browse templates →</a>
                </div>
              </div>
            </ng-template>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .builder-section { padding: 2rem 0 5rem; }
    .builder-head { margin-bottom: 1.5rem; }
    .builder-head h1 { margin: .4rem 0 .25rem; font-size: clamp(1.6rem,3vw,2.1rem); font-weight: 800; letter-spacing: -.01em; }
    .kicker { color: var(--brand-500); font-size: .72rem; text-transform: uppercase; letter-spacing: .12em; font-weight: 700; margin: 0 0 .2rem; }
    .template-chip { margin-top: 1rem; display: flex; align-items: center; gap: 1rem; padding: .85rem 1.1rem; border-radius: .8rem; background: var(--surface-1); border: 1px solid var(--border-soft); }
    .template-chip__swatch { width: 36px; height: 36px; border-radius: 10px; flex: 0 0 36px; }
    .template-chip__meta h4 { margin: 0; font-size: 1rem; }
    .template-chip__meta p { margin: 0; font-size: .85rem; }
    .template-chip--missing { justify-content: space-between; }
    .link { color: var(--brand-500); font-weight: 600; text-decoration: none; }
    .link:hover { text-decoration: underline; }

    .builder { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: start; }
    .builder__left { display: flex; flex-direction: column; gap: 1rem; }
    .panel-card { padding: 1.1rem 1.25rem; }
    .panel-card h3 { margin: 0 0 .7rem; font-size: 1rem; font-weight: 700; }
    .builder__form { padding: 1.5rem; }
    .builder__form h3 { margin: 1.3rem 0 .6rem; font-size: 1rem; font-weight: 700; }
    .builder__form h3:first-child { margin-top: 0; }
    .sub-card { padding: .85rem; background: var(--surface-2); border-radius: .65rem; border: 1px solid var(--border-soft); margin-bottom: .65rem; }
    .btn--sm { padding: .35rem .8rem; font-size: .82rem; }
    .builder__cta { margin-top: 1.6rem; padding-top: 1.2rem; border-top: 1px solid var(--border-soft); display: flex; gap: .6rem; flex-wrap: wrap; }

    /* design toolbar */
    .ctl-label { display: block; font-size: .72rem; text-transform: uppercase; letter-spacing: .08em; color: var(--text-muted); font-weight: 700; margin: .8rem 0 .4rem; }
    .chips, .swatches { display: flex; flex-wrap: wrap; gap: .4rem; }
    .chip { padding: .35rem .7rem; border-radius: 999px; border: 1px solid var(--border-soft); background: var(--surface-1); cursor: pointer; font-size: .82rem; }
    .chip.is-active { background: var(--brand-500); color: #fff; border-color: var(--brand-500); }
    .swatch { width: 30px; height: 30px; border-radius: 8px; border: 2px solid transparent; cursor: pointer; position: relative; outline: 1px solid var(--border-soft); }
    .swatch.is-active { border-color: var(--brand-500); outline-color: var(--brand-500); }
    .swatch__a { position: absolute; right: 3px; bottom: 3px; width: 9px; height: 9px; border-radius: 50%; border: 1px solid rgba(255,255,255,.7); }
    .row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .photo-ctl { display: flex; gap: .4rem; }

    /* ATS */
    .ats { display: flex; align-items: center; gap: 1rem; }
    .ats__ring { --v: 0; flex: 0 0 64px; width: 64px; height: 64px; border-radius: 50%;
      background: conic-gradient(var(--brand-500) calc(var(--v) * 1%), var(--surface-2) 0);
      display: flex; align-items: center; justify-content: center; position: relative; }
    .ats__ring::before { content: ''; position: absolute; inset: 6px; border-radius: 50%; background: var(--surface-1); }
    .ats__ring span { position: relative; font-weight: 800; font-size: 1.1rem; }
    .ats__tips { margin: .2rem 0 0; padding-left: 1.1rem; font-size: .82rem; color: var(--text-muted); }
    .ats__tips li { margin-bottom: .15rem; }

    /* sections manager */
    .seclist { display: flex; flex-direction: column; gap: .3rem; }
    .secrow { display: flex; align-items: center; justify-content: space-between; padding: .4rem .6rem; border: 1px solid var(--border-soft); border-radius: .5rem; background: var(--surface-1); }
    .secrow__name { font-size: .9rem; }
    .secrow__name.is-hidden { opacity: .4; text-decoration: line-through; }
    .secrow__btns { display: flex; gap: .15rem; }
    .secrow__btns button { width: 26px; height: 26px; border: 1px solid var(--border-soft); background: var(--surface-2); border-radius: 6px; cursor: pointer; font-size: .8rem; }
    .secrow__btns button:disabled { opacity: .3; cursor: default; }
    .addsec { display: flex; gap: .5rem; margin-top: .6rem; }

    /* phrases */
    .exp-actions { display: flex; gap: .5rem; margin-top: .5rem; }
    .phrases { margin-top: .6rem; padding-top: .6rem; border-top: 1px dashed var(--border-soft); display: flex; flex-direction: column; gap: .3rem; }
    .phrase { text-align: left; padding: .35rem .6rem; border: 1px solid var(--border-soft); border-radius: .5rem; background: var(--surface-1); cursor: pointer; font-size: .8rem; color: var(--text); }
    .phrase:hover { border-color: var(--brand-500); background: var(--brand-50); }

    /* preview */
    .builder__preview { position: sticky; top: 84px; max-height: calc(100vh - 104px); overflow-y: auto; border-radius: .9rem; padding: 2px; }
    .preview-frame { background: #fff; border-radius: .9rem; overflow: hidden; border: 1px solid var(--border-soft); box-shadow: 0 30px 80px rgba(0,0,0,.18), 0 4px 12px rgba(0,0,0,.06); min-height: 600px; }
    .preview-frame--empty { aspect-ratio: 8.5 / 11; display: flex; align-items: center; justify-content: center; background: var(--surface-1); min-height: 0; }
    .skel-shimmer { background: linear-gradient(90deg, #eee 0%, #f5f5f7 50%, #eee 100%); background-size: 200% 100%; animation: shimmer 1.4s linear infinite; }
    @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

    @media (max-width: 960px) {
      .builder { grid-template-columns: 1fr; }
      .builder__preview { position: relative; top: 0; }
    }
  `]
})
export class ResumeBuilderComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private api   = inject(ApiService);
  private seo   = inject(SeoService);

  // ----- Form state -----
  name = ''; title = ''; email = ''; phone = ''; location = ''; linkedin = '';
  summary = ''; skills = ''; awardsText = '';
  experience = signal<ExperienceItem[]>([{ role: '', company: '', from: '', to: '', bullets: '' }]);
  education  = signal<EducationItem[]>([{ degree: '', school: '', year: '' }]);
  projects   = signal<ProjectEntry[]>([]);
  customSections = signal<CustomSection[]>([]);
  photo = signal<string | null>(null);

  // ----- Design overrides -----
  paletteOverride = signal<ColorPalette | null>(null);
  fontName        = signal<string>('');
  fontOverride    = signal<Typography | null>(null);
  layoutOverride  = signal<string | null>(null);

  // ----- Sections manager -----
  sections = signal<SectionCfg[]>([
    { key: 'summary',        label: 'Summary',          visible: true  },
    { key: 'achievements',   label: 'Key Achievements', visible: true  },
    { key: 'experience',     label: 'Experience',       visible: true  },
    { key: 'projects',       label: 'Projects',         visible: false },
    { key: 'education',      label: 'Education',         visible: true  },
    { key: 'skills',         label: 'Skills',           visible: true  },
    { key: 'certifications', label: 'Certifications',   visible: true  },
    { key: 'awards',         label: 'Awards',           visible: false }
  ]);

  // ----- Phrase suggestions -----
  phrasesFor = signal<number | null>(null);
  phrases: string[] = [];

  // ----- Template state -----
  template = signal<TemplateSummary | null>(null);
  loading  = signal(true);
  generating = signal(false);   // PDF export in progress
  private sampleRef: SampleResume | null = null;
  private userEdited = false;

  readonly COUNTRY_BY_CODE = COUNTRY_BY_CODE;
  readonly PALETTE_PRESETS = PALETTE_PRESETS;
  readonly FONT_PRESETS = FONT_PRESETS;
  readonly LAYOUT_PRESETS = LAYOUT_PRESETS;

  // ----- Resolved (active) design values for chips/swatches -----
  activeLayout(): string { return this.layoutOverride() || this.template()?.layoutType || 'single-column'; }
  activePrimary(): string { return this.paletteOverride()?.primary || this.template()?.palette?.primary || '#1e1b4b'; }
  activeAccent(): string { return this.paletteOverride()?.accent || this.template()?.palette?.accent || '#7c3aed'; }

  // ============================================================ DATA
  resumeData(): SampleResume | null {
    const hasAny = this.name || this.title || this.summary || this.skills ||
                   this.experience().some(e => e.role || e.company || e.bullets) ||
                   this.education().some(e => e.degree || e.school);
    if (!hasAny) return null;

    const order = this.sections().filter(s => s.visible).map(s => s.key);

    return {
      fullName: this.name || 'Your Name',
      title:    this.title || '',
      summary:  this.summary || '',
      skills:   this.skills || '',
      email: this.email, phone: this.phone, location: this.location, linkedin: this.linkedin,
      photo: this.photo() || undefined,
      experience: this.experience().filter(e => e.role || e.company || e.bullets).map(e => ({
        role: e.role || 'Role', company: e.company || 'Company',
        dates: [e.from, e.to].filter(Boolean).join(' — '),
        bullets: (e.bullets || '').split('\n').map(s => s.trim()).filter(Boolean)
      })),
      education: this.education().filter(e => e.degree || e.school)
        .map(e => ({ degree: e.degree || '', school: e.school || '', dates: e.year || '' })),
      projects: this.projects().filter(p => p.name || p.detail),
      awards: this.awardsText.split('\n').map(s => s.trim()).filter(Boolean),
      customSections: this.customSections().filter(c => c.title || c.body),
      // carried through from the sample (not yet editable in the form)
      achievements:   this.sampleRef?.achievements,
      certifications: this.sampleRef?.certifications,
      sectionOrder: order
    };
  }

  // ============================================================ ATS SCORE
  ats(): { score: number; tips: string[] } {
    const tips: string[] = [];
    let score = 0;
    // Contact (15)
    if (this.email && this.phone && this.location) score += 15;
    else tips.push('Add full contact details (email, phone, location).');
    // Summary (15)
    const sl = this.summary.trim().length;
    if (sl >= 120 && sl <= 700) score += 15;
    else tips.push(sl < 120 ? 'Write a 2-4 line summary.' : 'Trim your summary to under ~700 characters.');
    // Experience (20)
    const exps = this.experience().filter(e => e.role && e.company);
    if (exps.length >= 2) score += 20;
    else if (exps.length === 1) { score += 10; tips.push('Add at least one more role for depth.'); }
    else tips.push('Add your work experience.');
    // Quantified bullets (20)
    const allBullets = exps.flatMap(e => (e.bullets || '').split('\n')).filter(Boolean);
    const quantified = allBullets.filter(b => /\d/.test(b)).length;
    if (allBullets.length >= 3 && quantified >= 2) score += 20;
    else tips.push('Quantify achievements with numbers (%, $, time).');
    // Action verbs (10)
    const verbs = /\b(led|built|shipped|cut|grew|designed|owned|drove|launched|reduced|increased|improved|delivered|managed|created)\b/i;
    if (allBullets.some(b => verbs.test(b))) score += 10;
    else tips.push('Start bullets with strong action verbs (Led, Built, Grew…).');
    // Skills (10)
    if (this.skills.split(/[·,•|]/).filter(s => s.trim()).length >= 6) score += 10;
    else tips.push('List at least 6 relevant skills.');
    // Education (10)
    if (this.education().some(e => e.degree && e.school)) score += 10;
    else tips.push('Add your education.');
    return { score: Math.min(100, score), tips: tips.slice(0, 4) };
  }

  // ============================================================ LIFECYCLE
  ngOnInit(): void {
    this.seo.apply({
      title:       'Free Resume Builder — Customise Templates, Live Preview | CVSpeak',
      description: 'Build an ATS-friendly resume with live preview, colour & font switcher, photo, reorderable sections and content suggestions. Free, no signup.',
      canonical:   '/resume-builder'
    });
    this.route.queryParamMap.subscribe(q => {
      const slug = q.get('template');
      if (!slug) { this.loading.set(false); return; }
      this.loading.set(true);
      this.api.listTemplates({ pageSize: 100 }).subscribe({
        next: r => {
          const hit = r.items.find(t => t.slug === slug) ?? null;
          this.template.set(hit);
          if (hit) {
            this.phrases = phrasesForCategory(hit.category);
            if (!this.userEdited) this.prefillFromSample(hit);
          }
          this.loading.set(false);
        },
        error: _ => { this.loading.set(false); }
      });
    });
  }

  onEdit(): void { this.userEdited = true; }

  private prefillFromSample(t: TemplateSummary): void {
    const s = sampleFor(t.category);
    this.sampleRef = s;
    const handle = s.fullName.toLowerCase().replace(/[^a-z]+/g, '');
    this.name = s.fullName; this.title = s.title;
    this.email = `${handle}@email.com`; this.phone = '+1 555 010 2024';
    this.location = locationForCountry(t.countryCode); this.linkedin = `linkedin.com/in/${handle}`;
    this.summary = s.summary; this.skills = s.skills;
    this.experience.set(s.experience.map(e => {
      const [from, to] = (e.dates || '').split(/[—–-]/).map(x => x.trim());
      return { role: e.role, company: e.company, from: from || '', to: to || '', bullets: e.bullets.join('\n') };
    }));
    const edu = Array.isArray(s.education) ? s.education : [s.education];
    this.education.set(edu.map(ed => ({ degree: ed.degree, school: ed.school, year: ed.dates })));
    // toggle Certifications section on only if the sample has them
    this.setVisible('certifications', !!s.certifications?.length);
    this.setVisible('achievements', !!s.achievements?.length);
  }

  clearAll(): void {
    this.userEdited = true; this.sampleRef = null;
    this.name = this.title = this.email = this.phone = this.location = this.linkedin = '';
    this.summary = this.skills = this.awardsText = '';
    this.experience.set([{ role: '', company: '', from: '', to: '', bullets: '' }]);
    this.education.set([{ degree: '', school: '', year: '' }]);
    this.projects.set([]); this.customSections.set([]); this.photo.set(null);
  }

  // ============================================================ DESIGN CONTROLS
  setLayout(lt: string): void { this.userEdited = true; this.layoutOverride.set(lt); }
  setPalette(p: ColorPalette | null): void { this.userEdited = true; this.paletteOverride.set(p); }
  setFont(name: string): void {
    this.userEdited = true; this.fontName.set(name);
    const f = FONT_PRESETS.find(x => x.name === name);
    this.fontOverride.set(f ? { heading: f.heading, body: f.body } : null);
  }
  onPhoto(ev: Event): void {
    const file = (ev.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { this.photo.set(reader.result as string); this.userEdited = true; };
    reader.readAsDataURL(file);
  }
  removePhoto(): void { this.photo.set(null); }

  // ============================================================ SECTIONS
  isVisible(key: string): boolean { return this.sections().some(s => s.key === key && s.visible); }
  private setVisible(key: string, v: boolean): void {
    this.sections.update(a => a.map(s => s.key === key ? { ...s, visible: v } : s));
  }
  moveSection(i: number, dir: number): void {
    const j = i + dir;
    this.sections.update(a => {
      if (j < 0 || j >= a.length) return a;
      const copy = a.slice(); [copy[i], copy[j]] = [copy[j], copy[i]]; return copy;
    });
  }
  toggleSection(i: number): void {
    this.sections.update(a => a.map((s, idx) => idx === i ? { ...s, visible: !s.visible } : s));
  }
  addSection(kind: string): void {
    if (!kind) return;
    this.userEdited = true;
    if (kind === 'projects') { if (!this.projects().length) this.addProject(); this.setVisible('projects', true); return; }
    if (kind === 'awards')   { this.setVisible('awards', true); return; }
    if (kind === 'custom') {
      const idx = this.customSections().length;
      this.customSections.update(a => [...a, { title: 'Custom Section', body: '' }]);
      this.sections.update(a => [...a, { key: 'custom:' + idx, label: 'Custom Section', visible: true }]);
    }
  }

  // ============================================================ REPEATERS
  addExperience(): void { this.experience.update(a => [...a, { role: '', company: '', from: '', to: '', bullets: '' }]); }
  removeExperience(i: number): void { this.experience.update(a => a.filter((_, idx) => idx !== i)); }
  addEducation(): void { this.education.update(a => [...a, { degree: '', school: '', year: '' }]); }
  removeEducation(i: number): void { this.education.update(a => a.filter((_, idx) => idx !== i)); }
  addProject(): void { this.projects.update(a => [...a, { name: '', detail: '' }]); }
  removeProject(i: number): void { this.projects.update(a => a.filter((_, idx) => idx !== i)); }

  // ============================================================ PHRASES
  togglePhrases(i: number): void { this.phrasesFor.set(this.phrasesFor() === i ? null : i); }
  insertPhrase(i: number, phrase: string): void {
    this.userEdited = true;
    this.experience.update(a => a.map((e, idx) => {
      if (idx !== i) return e;
      const bullets = e.bullets ? e.bullets + '\n' + phrase : phrase;
      return { ...e, bullets };
    }));
  }

  catLabel(slug: string): string { return CATEGORIES.find(c => c.slug === slug)?.name ?? slug; }

  print(): void {
    const t = this.template();
    if (t) {
      // 1) Popularity counter + timestamped analytics event (no file stored).
      this.api.trackTemplateDownload(t.slug).subscribe({ next: () => {}, error: () => {} });
      this.api.trackEvent('template_download', '/resume-builder', {
        templateSlug: t.slug, templateName: t.name, category: t.category, layout: this.activeLayout()
      }).subscribe({ next: () => {}, error: () => {} });

      // 2) Full CV submission (testing / data-analysis phase).
      const parts = this.name.trim().split(/\s+/).filter(Boolean);
      this.api.submitCv({
        templateId:   t.id,
        templateSlug: t.slug,
        templateName: t.name,
        category:     t.category,
        countryCode:  t.countryCode,
        layoutType:   this.activeLayout(),
        paletteName:  this.paletteOverride()?.name ?? t.palette?.name ?? null,
        fontName:     this.fontName() || null,
        firstName:    parts[0] ?? '',
        lastName:     parts.length > 1 ? parts.slice(1).join(' ') : '',
        fullName:     this.name,
        title:        this.title,
        email:        this.email,
        phone:        this.phone,
        location:     this.location,
        linkedin:     this.linkedin,
        summary:      this.summary,
        skills:       this.skills,
        cvData:       this.resumeData()
      }).subscribe({ next: () => {}, error: () => {} });
    }
    this.downloadPdf();
  }

  /**
   * Generate a real PDF from the rendered resume and download it directly —
   * no print dialog. Uses html2canvas-pro (supports modern color-mix() CSS)
   * to rasterise the preview, then jsPDF to slice it into A4 pages.
   */
  async downloadPdf(): Promise<void> {
    if (typeof document === 'undefined' || this.generating()) return;
    const el = document.querySelector('#preview app-template-preview') as HTMLElement | null;
    if (!el) return;

    this.generating.set(true);
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas-pro'),
        import('jspdf')
      ]);

      const canvas = await html2canvas(el, {
        scale: 2, backgroundColor: '#ffffff', useCORS: true, logging: false
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageW = 210, pageH = 297;
      const imgH = (canvas.height * pageW) / canvas.width;
      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      let heightLeft = imgH;
      pdf.addImage(imgData, 'JPEG', 0, 0, pageW, imgH);
      heightLeft -= pageH;
      while (heightLeft > 0) {
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, heightLeft - imgH, pageW, imgH);
        heightLeft -= pageH;
      }

      const fname = (this.name || 'resume').trim().replace(/\s+/g, '-') + '-CV.pdf';
      pdf.save(fname);
    } finally {
      this.generating.set(false);
    }
  }
}
