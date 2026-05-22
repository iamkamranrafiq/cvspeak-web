import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { SeoService } from '@core/services/seo.service';
import { TemplateSummary } from '@core/models/api.models';
import { AdSlotComponent } from '@shared/components/ad-slot/ad-slot.component';

@Component({
  selector: 'app-templates',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AdSlotComponent],
  template: `
    <section class="section">
      <div class="container">
        <header class="text-center" style="margin-bottom: 2rem;">
          <div class="badge">Free • ATS-friendly</div>
          <h1>Resume Templates</h1>
          <p class="text-muted">Hand-crafted, recruiter-tested templates. Download as HTML or print as PDF.</p>
        </header>

        <div class="filters card" style="padding: 1rem; display:flex; gap:1rem; flex-wrap:wrap; margin-bottom: 2rem;">
          <select class="select" style="max-width: 220px;" [(ngModel)]="category" (ngModelChange)="reload()">
            <option value="">All categories</option>
            <option value="developer">Developer</option>
            <option value="executive">Executive</option>
            <option value="graduate">Fresh Graduate</option>
            <option value="creative">Creative</option>
            <option value="academic">Academic</option>
          </select>
          <select class="select" style="max-width: 220px;" [(ngModel)]="country" (ngModelChange)="reload()">
            <option value="">Any country</option>
            <option value="us">United States</option>
            <option value="uk">United Kingdom</option>
            <option value="de">Germany</option>
            <option value="in">India</option>
            <option value="pk">Pakistan</option>
          </select>
        </div>

        <div *ngIf="loading()" class="grid grid-3">
          <div *ngFor="let _ of skeletons" class="skeleton" style="height: 320px;"></div>
        </div>

        <div *ngIf="!loading()" class="grid grid-3">
          <article *ngFor="let t of items()" class="card template-card">
            <div class="template-card__preview">
              <img *ngIf="t.previewUrl" [src]="t.previewUrl" [alt]="t.name + ' preview'" loading="lazy">
              <div *ngIf="!t.previewUrl" class="template-card__placeholder">{{ t.name }}</div>
            </div>
            <div class="template-card__body">
              <h3>{{ t.name }}</h3>
              <p class="text-muted">{{ t.description }}</p>
              <div class="row" style="gap:.4rem; margin-top: .5rem;">
                <span class="badge" *ngIf="t.atsFriendly">ATS-friendly</span>
                <span class="badge" *ngIf="t.roleTarget">{{ t.roleTarget }}</span>
                <span class="badge" *ngIf="t.countryCode">{{ t.countryCode.toUpperCase() }}</span>
              </div>
              <a [routerLink]="['/templates', t.slug]" class="btn btn--ghost" style="margin-top: 1rem; width: 100%;">Use template</a>
            </div>
          </article>
        </div>

        <div class="row" style="justify-content:center; margin-top: 2rem;" *ngIf="!loading() && items().length === 0">
          <p class="text-muted">No templates match those filters yet. Try clearing them.</p>
        </div>

        <app-ad-slot slotId="templates-footer" variant="footer"></app-ad-slot>
      </div>
    </section>
  `,
  styles: [`
    .template-card { padding: 0; overflow: hidden; display:flex; flex-direction: column; }
    .template-card__preview { background: var(--surface-2); aspect-ratio: 8.5 / 11; display:flex; align-items:center; justify-content:center; }
    .template-card__preview img { width: 100%; height: 100%; object-fit: cover; }
    .template-card__placeholder { font-weight: 700; color: var(--text-muted); padding: 2rem; text-align: center; }
    .template-card__body { padding: 1.25rem; display:flex; flex-direction:column; flex: 1; }
  `]
})
export class TemplatesComponent implements OnInit {
  private api = inject(ApiService);
  private seo = inject(SeoService);

  category = '';
  country  = '';
  loading  = signal(false);
  items    = signal<TemplateSummary[]>([]);
  skeletons = Array(6);

  ngOnInit(): void {
    this.seo.apply({
      title:       'Free Resume Templates — ATS-Friendly | CVSpeak',
      description: 'Browse free, ATS-friendly resume templates by role and country. Download as PDF or DOCX. No signup.',
      canonical:   '/templates'
    });
    this.reload();
  }

  reload(): void {
    this.loading.set(true);
    this.api.listTemplates(this.category || undefined, undefined, this.country || undefined).subscribe({
      next: p => { this.items.set(p.items); this.loading.set(false); },
      error: () => { this.loading.set(false); }
    });
  }
}
