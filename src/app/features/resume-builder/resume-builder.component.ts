import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { SeoService } from '@core/services/seo.service';
import { TemplateSummary } from '@core/models/api.models';
import { TemplatePreviewComponent } from '@shared/components/template-preview/template-preview.component';
import { SampleResume, sampleFor } from '@features/templates/data/sample-resumes';
import { COUNTRY_BY_CODE, locationForCountry } from '@features/templates/data/countries';
import { CATEGORIES } from '@features/templates/data/categories';

interface ExperienceItem { role: string; company: string; from: string; to: string; bullets: string; }
interface EducationItem  { degree: string; school: string; year: string; }

@Component({
  selector: 'app-resume-builder',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TemplatePreviewComponent],
  template: `
    <section class="builder-section">
      <div class="container">
        <!-- Header -->
        <header class="builder-head">
          <div>
            <div class="badge">Free • Live preview</div>
            <h1>Resume Builder</h1>
            <p class="text-muted">Type on the left, see your CV update on the right in real time.</p>
          </div>

          <!-- Template chip -->
          <div class="template-chip" *ngIf="template() as t">
            <div class="template-chip__swatch"
                 [style.background]="t.palette?.primary"
                 [style.box-shadow]="'0 0 0 4px ' + (t.palette?.accent || '#7c3aed') + '33'"></div>
            <div class="template-chip__meta">
              <p class="kicker">Template</p>
              <h4>{{ t.name }}</h4>
              <p class="text-muted">{{ COUNTRY_BY_CODE[t.countryCode ?? '']?.flag }} {{ catLabel(t.category) }}</p>
            </div>
            <a routerLink="/templates" class="link" style="margin-left: auto;">Change →</a>
          </div>

          <div class="template-chip template-chip--missing" *ngIf="!template() && !loading()">
            <p class="text-muted" style="margin: 0;">No template selected.</p>
            <a routerLink="/templates" class="btn btn--primary btn--sm">Pick a template →</a>
          </div>
        </header>

        <!-- Two-column layout -->
        <div class="builder">
          <!-- ============================ FORM ============================ -->
          <div class="builder__form card" (input)="onEdit()">
            <h3>Contact</h3>
            <div class="grid grid-2">
              <input class="input" placeholder="Full name"        [(ngModel)]="name">
              <input class="input" placeholder="Title (e.g. Senior PM)" [(ngModel)]="title">
              <input class="input" placeholder="Email"            [(ngModel)]="email">
              <input class="input" placeholder="Phone"            [(ngModel)]="phone">
              <input class="input" placeholder="Location"         [(ngModel)]="location">
              <input class="input" placeholder="linkedin.com/in/…" [(ngModel)]="linkedin">
            </div>

            <h3>Summary</h3>
            <textarea class="textarea" rows="4" [(ngModel)]="summary"
                      placeholder="2-4 lines about who you are and what you do."></textarea>

            <h3>Experience</h3>
            <div *ngFor="let e of experience(); let i = index" class="sub-card">
              <div class="grid grid-2">
                <input class="input" placeholder="Role"    [(ngModel)]="e.role">
                <input class="input" placeholder="Company" [(ngModel)]="e.company">
                <input class="input" placeholder="From (e.g. Jan 2022)" [(ngModel)]="e.from">
                <input class="input" placeholder="To (e.g. Present)"    [(ngModel)]="e.to">
              </div>
              <textarea class="textarea" rows="4" style="margin-top:.5rem;"
                        placeholder="One achievement per line"
                        [(ngModel)]="e.bullets"></textarea>
              <button class="btn btn--ghost btn--sm" (click)="removeExperience(i)">Remove role</button>
            </div>
            <button class="btn btn--ghost" (click)="addExperience()">+ Add role</button>

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
                      placeholder="Comma-separated: TypeScript, Angular, RxJS, …"></textarea>

            <div class="builder__cta">
              <button class="btn btn--primary" (click)="print()">⬇ Download as PDF</button>
              <button class="btn btn--ghost" (click)="clearAll()">Start blank</button>
            </div>
          </div>

          <!-- ============================ PREVIEW ============================ -->
          <div class="builder__preview" id="preview">
            <div class="preview-frame" *ngIf="template() as t; else noTemplate">
              <app-template-preview [def]="t" [data]="resumeData()" [thumb]="false"></app-template-preview>
            </div>
            <ng-template #noTemplate>
              <div class="preview-frame preview-frame--empty">
                <div *ngIf="loading()" class="skel-shimmer" style="width:100%;height:100%;"></div>
                <div *ngIf="!loading()" style="padding: 3rem; text-align: center;">
                  <div style="font-size: 2.5rem; margin-bottom: .8rem;">🎨</div>
                  <h3>Pick a template to begin</h3>
                  <p class="text-muted" style="margin: .4rem 0 1rem;">Choose from 50 designs across 29 countries.</p>
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
    .builder-head h1 { margin: .4rem 0 .25rem; font-size: clamp(1.6rem, 3vw, 2.1rem); font-weight: 800; letter-spacing: -.01em; }
    .kicker { color: var(--brand-500); font-size: .72rem; text-transform: uppercase; letter-spacing: .12em; font-weight: 700; margin: 0 0 .2rem; }

    .template-chip {
      margin-top: 1rem;
      display: flex; align-items: center; gap: 1rem;
      padding: .85rem 1.1rem; border-radius: .8rem;
      background: var(--surface-1); border: 1px solid var(--border-soft);
    }
    .template-chip__swatch { width: 36px; height: 36px; border-radius: 10px; flex: 0 0 36px; }
    .template-chip__meta h4 { margin: 0; font-size: 1rem; }
    .template-chip__meta p  { margin: 0; font-size: .85rem; }
    .template-chip--missing { justify-content: space-between; }
    .link { color: var(--brand-500); font-weight: 600; text-decoration: none; }
    .link:hover { text-decoration: underline; }

    .builder { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: start; }
    .builder__form { padding: 1.5rem; }
    .builder__form h3 { margin: 1.3rem 0 .6rem; font-size: 1rem; font-weight: 700; }
    .builder__form h3:first-child { margin-top: 0; }
    .sub-card {
      padding: .85rem; background: var(--surface-2); border-radius: .65rem;
      border: 1px solid var(--border-soft); margin-bottom: .65rem;
    }
    .btn--sm { padding: .35rem .8rem; font-size: .82rem; margin-top: .5rem; }
    .builder__cta { margin-top: 1.6rem; padding-top: 1.2rem; border-top: 1px solid var(--border-soft); display: flex; gap: .6rem; flex-wrap: wrap; }

    .builder__preview { position: sticky; top: 84px; }
    .preview-frame {
      aspect-ratio: 8.5 / 11;
      background: #f4f4f6;
      border-radius: .9rem; overflow: hidden;
      border: 1px solid var(--border-soft);
      box-shadow: 0 30px 80px rgba(0,0,0,.18), 0 4px 12px rgba(0,0,0,.06);
    }
    .preview-frame--empty {
      display: flex; align-items: center; justify-content: center;
      background: var(--surface-1);
    }
    .skel-shimmer {
      background: linear-gradient(90deg, #eee 0%, #f5f5f7 50%, #eee 100%);
      background-size: 200% 100%;
      animation: shimmer 1.4s linear infinite;
    }
    @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

    /* Print: only the preview goes to PDF */
    @media print {
      body * { visibility: hidden; }
      #preview, #preview * { visibility: visible; }
      #preview { position: absolute; left: 0; top: 0; width: 100%; }
      .preview-frame { box-shadow: none; border: 0; aspect-ratio: auto; }
    }

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

  // --- Form state ---
  name = ''; title = ''; email = ''; phone = ''; location = ''; linkedin = '';
  summary = ''; skills = '';
  experience = signal<ExperienceItem[]>([{ role: '', company: '', from: '', to: '', bullets: '' }]);
  education  = signal<EducationItem[]>([{ degree: '', school: '', year: '' }]);

  // --- Template state ---
  template = signal<TemplateSummary | null>(null);
  loading  = signal(true);

  readonly COUNTRY_BY_CODE = COUNTRY_BY_CODE;

  /** Real user data shaped as SampleResume for the preview component.
   *  Implemented as a plain method (not a computed signal) so Angular's
   *  change detection picks up changes to the plain string fields (name,
   *  title, …) on every keystroke — no manual signal bumping required.
   *  When fields are blank we fall back to the template's sample data so
   *  the user immediately sees what the design looks like. */
  resumeData(): SampleResume | null {
    const hasAny = this.name || this.title || this.summary || this.skills ||
                   this.experience().some(e => e.role || e.company || e.bullets) ||
                   this.education().some(e => e.degree || e.school);
    if (!hasAny) return null;

    return {
      fullName: this.name || 'Your Name',
      title:    this.title || '',
      summary:  this.summary || '',
      skills:   this.skills || '',
      email:    this.email,
      phone:    this.phone,
      location: this.location,
      linkedin: this.linkedin,
      experience: this.experience()
        .filter(e => e.role || e.company || e.bullets)
        .map(e => ({
          role:    e.role || 'Role',
          company: e.company || 'Company',
          dates:   [e.from, e.to].filter(Boolean).join(' — '),
          bullets: (e.bullets || '').split('\n').map(s => s.trim()).filter(Boolean)
        })),
      education: this.education()[0]
        ? {
            degree: this.education()[0].degree || '',
            school: this.education()[0].school || '',
            dates:  this.education()[0].year   || ''
          }
        : { degree: '', school: '', dates: '' }
    };
  }

  ngOnInit(): void {
    this.seo.apply({
      title:       'Free Resume Builder — ATS-Friendly Templates | CVSpeak',
      description: 'Build an ATS-friendly resume step by step with a live themed preview. Free, no signup. Export as PDF.',
      canonical:   '/resume-builder'
    });

    // 1. Read ?template=<slug>
    this.route.queryParamMap.subscribe(q => {
      const slug = q.get('template');
      if (!slug) { this.loading.set(false); return; }

      // 2. Fetch templates and find the match.
      this.loading.set(true);
      this.api.listTemplates({ pageSize: 100 }).subscribe({
        next: r => {
          const hit = r.items.find(t => t.slug === slug) ?? null;
          this.template.set(hit);
          // Seed the form with the template's sample candidate the first time
          // so the preview looks complete and is editable in place. We only do
          // this once, and only while the form is still untouched.
          if (hit && !this.userEdited) this.prefillFromSample(hit);
          this.loading.set(false);
        },
        error: _ => { this.loading.set(false); }
      });
    });
  }

  /** Has the user changed anything? Guards against clobbering edits when the
   *  query param re-emits (e.g. on navigation). */
  private userEdited = false;
  onEdit(): void { this.userEdited = true; }

  /** Fill every form field from the template's sample candidate. */
  private prefillFromSample(t: TemplateSummary): void {
    const s = sampleFor(t.category);
    const handle = s.fullName.toLowerCase().replace(/[^a-z]+/g, '');
    this.name     = s.fullName;
    this.title    = s.title;
    this.email    = `${handle}@email.com`;
    this.phone    = '+1 555 010 2024';
    this.location = locationForCountry(t.countryCode);
    this.linkedin = `linkedin.com/in/${handle}`;
    this.summary  = s.summary;
    this.skills   = s.skills;
    this.experience.set(s.experience.map(e => {
      const [from, to] = (e.dates || '').split(/[—–-]/).map(x => x.trim());
      return { role: e.role, company: e.company, from: from || '', to: to || '', bullets: e.bullets.join('\n') };
    }));
    this.education.set([{ degree: s.education.degree, school: s.education.school, year: s.education.dates }]);
  }

  /** Wipe the form to a blank slate (keeps the selected template). */
  clearAll(): void {
    this.userEdited = true;
    this.name = this.title = this.email = this.phone = this.location = this.linkedin = '';
    this.summary = this.skills = '';
    this.experience.set([{ role: '', company: '', from: '', to: '', bullets: '' }]);
    this.education.set([{ degree: '', school: '', year: '' }]);
  }

  addExperience():  void { this.experience.update(a => [...a, { role: '', company: '', from: '', to: '', bullets: '' }]); }
  removeExperience(i: number): void { this.experience.update(a => a.filter((_, idx) => idx !== i)); }
  addEducation():   void { this.education.update(a => [...a, { degree: '', school: '', year: '' }]); }
  removeEducation(i: number): void { this.education.update(a => a.filter((_, idx) => idx !== i)); }

  catLabel(slug: string): string { return CATEGORIES.find(c => c.slug === slug)?.name ?? slug; }
  print(): void { window.print(); }
}
