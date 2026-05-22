import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { SeoService } from '@core/services/seo.service';
import { MatchJobResponse } from '@core/models/api.models';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { ScoreRingComponent } from '@shared/components/score-ring/score-ring.component';
import { AdSlotComponent } from '@shared/components/ad-slot/ad-slot.component';

@Component({
  selector: 'app-job-match',
  standalone: true,
  imports: [CommonModule, FormsModule, FileUploadComponent, ScoreRingComponent, AdSlotComponent],
  template: `
    <section class="section">
      <div class="container container--narrow">

        <header *ngIf="!result()" class="text-center" style="margin-bottom: 2rem;">
          <div class="badge">Free</div>
          <h1>Resume vs Job Description Match</h1>
          <p class="text-muted">Upload your resume, paste a job description, and we'll tell you how well they match — plus what to add.</p>
        </header>

        <div *ngIf="!result()" class="card" style="padding: 2rem;">
          <h3>1. Upload resume</h3>
          <app-file-upload (fileSelected)="onFile($event)"></app-file-upload>

          <h3 style="margin-top: 1.5rem;">2. Paste the job description</h3>
          <textarea class="textarea" rows="10" placeholder="Paste the full job description…" [(ngModel)]="jd"></textarea>

          <div class="grid grid-2" style="margin-top: 1rem;">
            <div>
              <label class="label">Job title (optional)</label>
              <input class="input" [(ngModel)]="title" placeholder="e.g. Senior Angular Developer">
            </div>
            <div>
              <label class="label">Company (optional)</label>
              <input class="input" [(ngModel)]="company" placeholder="e.g. Acme Inc.">
            </div>
          </div>

          <div *ngIf="error()" class="alert alert--danger" style="margin-top: 1rem;">{{ error() }}</div>

          <button class="btn btn--primary btn--block btn--lg" style="margin-top: 1.5rem;"
                  [disabled]="!file() || jd.length < 50 || loading()" (click)="run()">
            <span *ngIf="!loading()">Check match</span>
            <span *ngIf="loading()">Matching…</span>
          </button>
        </div>

        <ng-container *ngIf="result()">
          <div class="card" style="display:flex; gap:2rem; align-items:center; padding:2rem; flex-wrap:wrap;">
            <app-score-ring [value]="result()!.match.matchPercentage" label="Match" [size]="180"></app-score-ring>
            <div style="flex:1;">
              <h2 style="margin: 0 0 .5rem;">{{ matchVerdict() }}</h2>
              <p class="text-muted" *ngFor="let t of result()!.match.improvementTips" style="margin:.25rem 0;">→ {{ t }}</p>
            </div>
          </div>

          <div class="grid grid-2">
            <div class="card">
              <h3>Matched ({{ result()!.match.matchedSkills.length }})</h3>
              <div class="chips">
                <span *ngFor="let k of result()!.match.matchedSkills" class="chip chip--ok">{{ k }}</span>
              </div>
            </div>
            <div class="card">
              <h3>Missing ({{ result()!.match.missingSkills.length }})</h3>
              <div class="chips">
                <span *ngFor="let k of result()!.match.missingSkills" class="chip chip--miss">{{ k }}</span>
              </div>
            </div>
          </div>

          <button class="btn btn--ghost" style="margin-top: 1.5rem;" (click)="reset()">Try another match</button>

          <app-ad-slot slotId="job-match-after-result" variant="footer"></app-ad-slot>
        </ng-container>

      </div>
    </section>
  `,
  styles: [`
    .card + .card, .card + .grid, .grid + .card { margin-top: 1rem; }
    .chips { display:flex; flex-wrap:wrap; gap:.35rem; margin-top:.5rem; }
    .chip { padding:.25rem .6rem; border-radius:999px; font-size:.82rem; font-weight:500; border:1px solid var(--border-soft); }
    .chip--ok   { background: rgba(16,185,129,.1); color: var(--success); border-color: rgba(16,185,129,.25); }
    .chip--miss { background: rgba(239,68,68,.08);  color: var(--danger);  border-color: rgba(239,68,68,.25); }
  `]
})
export class JobMatchComponent implements OnInit {
  private api = inject(ApiService);
  private seo = inject(SeoService);

  file = signal<File | null>(null);
  jd = ''; title = ''; company = '';
  loading = signal(false);
  error   = signal<string | null>(null);
  result  = signal<MatchJobResponse | null>(null);

  ngOnInit(): void {
    this.seo.apply({
      title:       'Resume vs Job Description Match Tool | CVSpeak',
      description: 'Free tool to compare your resume against any job description. Get a match percentage and the exact missing keywords.',
      canonical:   '/job-match'
    });
  }

  onFile(f: File): void { this.file.set(f); }

  run(): void {
    if (!this.file()) return;
    this.loading.set(true); this.error.set(null);
    // Two-step flow: upload+parse via analyzer endpoint, then match
    this.api.analyzeResume(this.file()!).subscribe({
      next: (a) => {
        this.api.matchJob(a.resumeId, this.jd, this.title || undefined, this.company || undefined).subscribe({
          next: r => { this.result.set(r); this.loading.set(false); },
          error: e => { this.error.set(e?.error?.error ?? 'Match failed. Please try again.'); this.loading.set(false); }
        });
      },
      error: (e) => {
        this.error.set(e?.error?.error ?? 'Upload failed. Please try again.');
        this.loading.set(false);
      }
    });
  }

  matchVerdict(): string {
    const v = this.result()?.match.matchPercentage ?? 0;
    if (v >= 80) return 'Strong match';
    if (v >= 60) return 'Good baseline — small tweaks unlock interviews';
    if (v >= 40) return 'Partial match — tailoring needed';
    return 'Significant gap — consider a closer-fit role';
  }

  reset(): void { this.result.set(null); }
}
