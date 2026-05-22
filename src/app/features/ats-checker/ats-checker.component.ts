import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { SeoService } from '@core/services/seo.service';
import { AtsScoreResult } from '@core/models/api.models';
import { ScoreRingComponent } from '@shared/components/score-ring/score-ring.component';
import { AdSlotComponent } from '@shared/components/ad-slot/ad-slot.component';

@Component({
  selector: 'app-ats-checker',
  standalone: true,
  imports: [CommonModule, FormsModule, ScoreRingComponent, AdSlotComponent],
  template: `
    <section class="section">
      <div class="container container--narrow">

        <header *ngIf="!result()" class="text-center" style="margin-bottom: 2rem;">
          <div class="badge">Free • Paste & go</div>
          <h1>ATS Resume Checker</h1>
          <p class="text-muted">Paste your resume text below. Get an instant ATS-style score, no file upload required.</p>
        </header>

        <div *ngIf="!result()" class="card" style="padding: 1.5rem;">
          <label class="label">Resume text</label>
          <textarea class="textarea" rows="14" placeholder="Paste your full resume here…" [(ngModel)]="text"></textarea>

          <label class="label" style="margin-top: 1rem;">Target role (optional)</label>
          <input class="input" [(ngModel)]="role" placeholder="e.g. software-engineer, data-scientist">

          <div *ngIf="error()" class="alert alert--danger" style="margin-top: 1rem;">{{ error() }}</div>

          <button class="btn btn--primary btn--block btn--lg" style="margin-top: 1.25rem;"
                  [disabled]="text.length < 100 || loading()" (click)="run()">
            <span *ngIf="!loading()">Check my resume</span>
            <span *ngIf="loading()">Checking…</span>
          </button>
          <p class="text-muted" style="font-size:.85rem; text-align:center; margin-top:.5rem;">Minimum 100 characters. No data is stored.</p>
        </div>

        <div *ngIf="result()">
          <div class="card result-summary">
            <app-score-ring [value]="result()!.overallScore" label="Overall ATS" [size]="160"></app-score-ring>
            <div class="result-summary__rings">
              <app-score-ring [value]="result()!.formatScore"      label="Format"      [size]="80"></app-score-ring>
              <app-score-ring [value]="result()!.keywordScore"     label="Keywords"    [size]="80"></app-score-ring>
              <app-score-ring [value]="result()!.readabilityScore" label="Readability" [size]="80"></app-score-ring>
              <app-score-ring [value]="result()!.grammarScore"     label="Grammar"     [size]="80"></app-score-ring>
              <app-score-ring [value]="result()!.structureScore"   label="Structure"   [size]="80"></app-score-ring>
            </div>
          </div>

          <div *ngIf="result()!.suggestions.length" class="card">
            <h3>Top suggestions</h3>
            <div *ngFor="let s of result()!.suggestions" style="padding:.5rem 0; border-bottom:1px solid var(--border-soft);">
              <strong>{{ s.title }}</strong>
              <p class="text-muted" style="margin:.25rem 0 0;">{{ s.detail }}</p>
            </div>
          </div>

          <button class="btn btn--ghost" style="margin-top: 1.5rem;" (click)="reset()">Check another</button>

          <app-ad-slot slotId="ats-checker-after-result" variant="footer"></app-ad-slot>
        </div>

      </div>
    </section>
  `,
  styles: [`
    .result-summary { display:flex; gap:2rem; align-items:center; flex-wrap:wrap; padding:2rem; }
    .result-summary__rings { display:grid; grid-template-columns: repeat(5, 1fr); gap:.75rem; flex:1; }
    @media(max-width: 720px){ .result-summary__rings { grid-template-columns: repeat(2,1fr); } }
    .card + .card { margin-top: 1rem; }
  `]
})
export class AtsCheckerComponent implements OnInit {
  private api = inject(ApiService);
  private seo = inject(SeoService);

  text = '';
  role = '';
  loading = signal(false);
  error   = signal<string | null>(null);
  result  = signal<AtsScoreResult | null>(null);

  ngOnInit(): void {
    this.seo.apply({
      title:       'Free ATS Resume Checker — Beat the Bots | CVSpeak',
      description: 'Paste your resume and get an instant ATS-style score across format, keywords, grammar, and structure. Free, no signup.',
      canonical:   '/ats-checker'
    });
  }

  run(): void {
    this.loading.set(true); this.error.set(null);
    this.api.scoreText(this.text, this.role || undefined).subscribe({
      next:  r => { this.result.set(r); this.loading.set(false); },
      error: e => { this.error.set(e?.error?.error ?? 'Try again in a moment.'); this.loading.set(false); }
    });
  }
  reset(): void { this.result.set(null); }
}
