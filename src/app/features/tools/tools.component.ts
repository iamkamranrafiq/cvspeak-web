import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { SeoService } from '@core/services/seo.service';
import { ToolDto } from '@core/models/api.models';
import { AdSlotComponent } from '@shared/components/ad-slot/ad-slot.component';

@Component({
  selector: 'app-tools',
  standalone: true,
  imports: [CommonModule, RouterLink, AdSlotComponent],
  template: `
    <section class="section">
      <div class="container">
        <header class="text-center" style="margin-bottom: 2rem;">
          <div class="badge">All tools</div>
          <h1>Free career tools</h1>
          <p class="text-muted">Quick utilities for resumes, cover letters, keywords, and interview prep. No signup.</p>
        </header>

        <div *ngIf="loading()" class="grid grid-3">
          <div *ngFor="let _ of [1,2,3,4,5,6]" class="skeleton" style="height: 160px;"></div>
        </div>

        <div *ngIf="!loading()" class="grid grid-3">
          <a *ngFor="let t of tools()" [routerLink]="t.urlPath" class="card tool-card">
            <h3>{{ t.name }}</h3>
            <p class="text-muted">{{ t.description }}</p>
            <div class="tool-card__cta">Open tool →</div>
          </a>
        </div>

        <app-ad-slot slotId="tools-footer" variant="footer"></app-ad-slot>
      </div>
    </section>
  `,
  styles: [`
    .tool-card { text-decoration: none; color: inherit; display: flex; flex-direction: column; gap: .35rem; transition: transform .15s; }
    .tool-card:hover { transform: translateY(-2px); }
    .tool-card__cta { margin-top: auto; padding-top: .6rem; color: var(--brand-500); font-weight: 600; font-size: .9rem; }
  `]
})
export class ToolsComponent implements OnInit {
  private api = inject(ApiService);
  private seo = inject(SeoService);

  loading = signal(true);
  tools   = signal<ToolDto[]>([]);

  ngOnInit(): void {
    this.seo.apply({
      title:       'Free Resume & Career Tools | CVSpeak',
      description: 'A free toolkit for job seekers: ATS checker, resume analyzer, keyword generator, skill extractor, cover letter writer.',
      canonical:   '/tools'
    });
    this.api.listTools().subscribe({
      next: t => { this.tools.set(t); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }
}
