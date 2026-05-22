import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { SeoService } from '@core/services/seo.service';
import { CoverLetterResponse } from '@core/models/api.models';
import { AdSlotComponent } from '@shared/components/ad-slot/ad-slot.component';

@Component({
  selector: 'app-cover-letter',
  standalone: true,
  imports: [CommonModule, FormsModule, AdSlotComponent],
  template: `
    <section class="section">
      <div class="container container--narrow">

        <header *ngIf="!result()" class="text-center" style="margin-bottom: 2rem;">
          <div class="badge">Free • AI-assisted</div>
          <h1>Cover Letter Generator</h1>
          <p class="text-muted">Give us the role and the company. We'll draft a 3-paragraph cover letter you can edit and send.</p>
        </header>

        <form *ngIf="!result()" class="card" (ngSubmit)="generate()" style="padding: 2rem;">
          <div class="grid grid-2">
            <div>
              <label class="label">Job title *</label>
              <input class="input" [(ngModel)]="jobTitle" name="jobTitle" required>
            </div>
            <div>
              <label class="label">Company *</label>
              <input class="input" [(ngModel)]="companyName" name="company" required>
            </div>
          </div>

          <label class="label" style="margin-top: 1rem;">Tone</label>
          <select class="select" [(ngModel)]="tone" name="tone">
            <option value="professional">Professional</option>
            <option value="enthusiastic">Enthusiastic</option>
            <option value="formal">Formal</option>
            <option value="conversational">Conversational</option>
          </select>

          <label class="label" style="margin-top: 1rem;">Job description (optional, makes the letter more specific)</label>
          <textarea class="textarea" rows="6" [(ngModel)]="jobDescription" name="jd"></textarea>

          <div *ngIf="error()" class="alert alert--danger" style="margin-top: 1rem;">{{ error() }}</div>

          <button class="btn btn--primary btn--block btn--lg" style="margin-top: 1.25rem;"
                  [disabled]="!jobTitle || !companyName || loading()">
            <span *ngIf="!loading()">Generate cover letter</span>
            <span *ngIf="loading()">Generating…</span>
          </button>
        </form>

        <div *ngIf="result()">
          <div class="card" style="padding: 2rem; white-space: pre-wrap; font-family: var(--font-sans); line-height: 1.7;">
            {{ result()!.content }}
          </div>
          <div class="row" style="margin-top: 1rem;">
            <button class="btn btn--ghost" (click)="copy()">{{ copied() ? 'Copied!' : 'Copy text' }}</button>
            <button class="btn btn--ghost" (click)="reset()">Generate another</button>
          </div>
          <app-ad-slot slotId="cover-letter-after-result" variant="footer"></app-ad-slot>
        </div>

      </div>
    </section>
  `
})
export class CoverLetterComponent implements OnInit {
  private api = inject(ApiService);
  private seo = inject(SeoService);

  jobTitle = '';
  companyName = '';
  tone = 'professional';
  jobDescription = '';

  loading = signal(false);
  error   = signal<string | null>(null);
  result  = signal<CoverLetterResponse | null>(null);
  copied  = signal(false);

  ngOnInit(): void {
    this.seo.apply({
      title:       'AI Cover Letter Generator — Free | CVSpeak',
      description: 'Generate a tailored cover letter in seconds. Free, no signup. Pick your tone and target the role.',
      canonical:   '/cover-letter'
    });
  }

  generate(): void {
    this.loading.set(true); this.error.set(null);
    this.api.generateCoverLetter({
      jobTitle: this.jobTitle, companyName: this.companyName,
      tone: this.tone, jobDescription: this.jobDescription || undefined
    }).subscribe({
      next: r => { this.result.set(r); this.loading.set(false); },
      error: e => { this.error.set(e?.error?.error ?? 'Try again in a moment.'); this.loading.set(false); }
    });
  }

  copy(): void {
    const text = this.result()?.content ?? '';
    if (!navigator?.clipboard) return;
    navigator.clipboard.writeText(text).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1500);
    });
  }

  reset(): void { this.result.set(null); }
}
