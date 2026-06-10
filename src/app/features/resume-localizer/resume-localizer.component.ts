import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { SeoService } from '@core/services/seo.service';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { AdSlotComponent } from '@shared/components/ad-slot/ad-slot.component';
import { COUNTRIES } from '@features/templates/data/countries';

interface LocalizeResult { localized: string; changes: string[]; language: string; }

@Component({
  selector: 'app-resume-localizer',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, FileUploadComponent, AdSlotComponent],
  template: `
    <section class="section">
      <div class="container container--narrow">

        <header *ngIf="!result()" class="text-center" style="margin-bottom: 2rem;">
          <div class="badge">✦ AI-powered • {{ COUNTRIES.length }} countries</div>
          <h1>Resume Localizer</h1>
          <p class="text-muted">
            Applying for a job abroad? Upload your resume, pick the country, and AI rewrites it to match
            local hiring conventions — photo &amp; personal-detail norms, date formats, spelling, tone and length —
            translating it if the language differs.
          </p>
        </header>

        <!-- INPUT -->
        <div *ngIf="!result()" class="card" style="padding: 1.5rem;">
          <label class="label">Target country</label>
          <select class="select" [ngModel]="country()" (ngModelChange)="country.set($event)">
            <option *ngFor="let c of COUNTRIES" [value]="c.code">{{ c.flag }} {{ c.name }}</option>
          </select>

          <label class="label" style="margin-top: 1.25rem;">Your resume</label>
          <app-file-upload (fileSelected)="onFile($event)"></app-file-upload>
          <p *ngIf="file()" class="text-muted" style="font-size:.85rem; margin:.5rem 0 0;">Selected: {{ file()!.name }}</p>

          <div class="or"><span>or paste text</span></div>
          <textarea class="textarea" rows="8" placeholder="Paste your resume text here…" [(ngModel)]="text"></textarea>

          <div *ngIf="error()" class="alert alert--danger" style="margin-top: 1rem;">{{ error() }}</div>

          <button class="btn btn--primary btn--block btn--lg" style="margin-top: 1.25rem;"
                  [disabled]="(!file() && text.trim().length < 50) || loading()" (click)="run()">
            <span *ngIf="!loading()">Localize for {{ countryName() }} →</span>
            <span *ngIf="loading()">Adapting your resume…</span>
          </button>
          <p class="text-muted" style="font-size:.82rem; text-align:center; margin-top:.6rem;">
            Takes a few seconds — the AI rewrites your whole resume. Nothing is stored.
          </p>
        </div>

        <!-- RESULT -->
        <div *ngIf="result() as r">
          <div class="result-head text-center" style="margin-bottom: 1.25rem;">
            <div class="badge">{{ flagFor() }} Localized for {{ countryName() }}<span *ngIf="r.language"> · {{ r.language }}</span></div>
            <h1>Your localized resume</h1>
          </div>

          <!-- What changed -->
          <div *ngIf="r.changes?.length" class="card">
            <h3>✨ What we adapted</h3>
            <ul class="changes">
              <li *ngFor="let c of r.changes">{{ c }}</li>
            </ul>
          </div>

          <!-- Localized text -->
          <div class="card">
            <div class="row" style="justify-content: space-between; align-items: center;">
              <h3 style="margin:0;">Adapted resume</h3>
              <button class="btn btn--ghost btn--sm" (click)="copy(r.localized)">{{ copied() ? '✓ Copied' : 'Copy' }}</button>
            </div>
            <pre class="localized">{{ r.localized }}</pre>
          </div>

          <div class="row" style="gap:.6rem; justify-content:center; margin-top: 1.5rem;">
            <button class="btn btn--ghost" (click)="reset()">Localize another</button>
            <a class="btn btn--primary" routerLink="/resume-builder">Build it as a template →</a>
          </div>

          <app-ad-slot slotId="localizer-after-result" variant="footer"></app-ad-slot>
        </div>

      </div>
    </section>
  `,
  styles: [`
    .or { display:flex; align-items:center; gap:.75rem; margin:1.25rem 0 1rem; color:var(--text-muted); font-size:.85rem; }
    .or::before, .or::after { content:''; flex:1; height:1px; background:var(--border-soft); }
    .card + .card { margin-top: 1rem; }
    .changes { margin:.5rem 0 0; padding-left: 1.2rem; }
    .changes li { margin-bottom:.4rem; }
    .localized {
      white-space: pre-wrap; word-wrap: break-word; font-family: 'Inter', system-ui, sans-serif;
      font-size: .92rem; line-height: 1.6; margin: .8rem 0 0; padding: 1.1rem;
      background: var(--surface-2); border: 1px solid var(--border-soft); border-radius: .6rem;
      max-height: 640px; overflow: auto;
    }
    .btn--sm { padding:.35rem .8rem; font-size:.82rem; }
  `]
})
export class ResumeLocalizerComponent implements OnInit {
  private api = inject(ApiService);
  private seo = inject(SeoService);

  readonly COUNTRIES = COUNTRIES;

  country = signal<string>('de');   // Germany default — strong contrast vs US/UK norms
  text = '';
  file = signal<File | null>(null);
  loading = signal(false);
  error   = signal<string | null>(null);
  result  = signal<LocalizeResult | null>(null);
  copied  = signal(false);

  ngOnInit(): void {
    this.seo.apply({
      title:       'Resume Localizer — Adapt Your CV for Any Country (AI) | CVSpeak',
      description: 'Adapt and translate your resume to any country’s hiring conventions with AI — photo & personal-detail norms, date formats, spelling, tone and length. Free.',
      canonical:   '/resume-localizer'
    });
  }

  countryName(): string { return COUNTRIES.find(c => c.code === this.country())?.name ?? 'your country'; }
  flagFor(): string { return COUNTRIES.find(c => c.code === this.country())?.flag ?? ''; }
  onFile(f: File): void { this.file.set(f); this.error.set(null); }

  run(): void {
    this.loading.set(true); this.error.set(null);
    this.api.localizeResume({
      file: this.file() ?? undefined,
      text: this.file() ? undefined : this.text,
      countryCode: this.country(),
      countryName: this.countryName()
    }).subscribe({
      next: r => { this.result.set(r); this.loading.set(false); window.scrollTo({ top: 0, behavior: 'smooth' }); },
      error: e => { this.error.set(e?.error?.error ?? 'Something went wrong. Please try again.'); this.loading.set(false); }
    });
  }

  copy(t: string): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(t).then(() => {
        this.copied.set(true);
        setTimeout(() => this.copied.set(false), 1800);
      });
    }
  }

  reset(): void { this.result.set(null); this.file.set(null); this.error.set(null); }
}
