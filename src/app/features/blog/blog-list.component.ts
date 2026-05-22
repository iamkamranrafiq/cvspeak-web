import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { SeoService } from '@core/services/seo.service';
import { BlogPostSummary, PagedList } from '@core/models/api.models';
import { AdSlotComponent } from '@shared/components/ad-slot/ad-slot.component';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, RouterLink, AdSlotComponent],
  template: `
    <section class="section">
      <div class="container">
        <header class="text-center" style="margin-bottom: 2.5rem;">
          <div class="badge">Blog</div>
          <h1>Resume Tips, ATS Guides & Career Strategy</h1>
          <p class="text-muted">Practical, research-backed guides — read in 5-10 minutes.</p>
        </header>

        <div *ngIf="loading()" class="grid grid-3">
          <div *ngFor="let _ of [1,2,3,4,5,6]" class="skeleton" style="height: 320px;"></div>
        </div>

        <div *ngIf="!loading()" class="grid grid-3">
          <article *ngFor="let p of paged()?.items" class="card post-card">
            <a [routerLink]="['/blog', p.slug]" class="post-card__link">
              <div class="post-card__cover" *ngIf="p.coverImageUrl">
                <img [src]="p.coverImageUrl" [alt]="p.title" loading="lazy">
              </div>
              <div class="post-card__body">
                <div class="row" style="gap:.5rem;">
                  <span class="badge" *ngIf="p.isFeatured">Featured</span>
                  <span class="text-muted" style="font-size:.82rem;">{{ p.readTimeMinutes }} min read</span>
                </div>
                <h3>{{ p.title }}</h3>
                <p class="text-muted">{{ p.excerpt }}</p>
                <div class="row" style="gap:.35rem; margin-top:.5rem;">
                  <span class="chip" *ngFor="let t of p.tags?.slice(0, 3)">{{ t }}</span>
                </div>
              </div>
            </a>
          </article>
        </div>

        <app-ad-slot slotId="blog-list-footer" variant="footer"></app-ad-slot>
      </div>
    </section>
  `,
  styles: [`
    .post-card { padding: 0; overflow: hidden; }
    .post-card__link { display: block; text-decoration: none; color: inherit; }
    .post-card__cover { aspect-ratio: 16/9; background: var(--surface-2); overflow: hidden; }
    .post-card__cover img { width: 100%; height: 100%; object-fit: cover; transition: transform .3s; }
    .post-card:hover .post-card__cover img { transform: scale(1.04); }
    .post-card__body { padding: 1.25rem; }
    .post-card h3 { margin: .5rem 0; }
    .chip { padding:.15rem .5rem; border-radius:999px; background: var(--surface-2); color: var(--text-muted); font-size:.75rem; }
  `]
})
export class BlogListComponent implements OnInit {
  private api = inject(ApiService);
  private seo = inject(SeoService);

  loading = signal(true);
  paged   = signal<PagedList<BlogPostSummary> | null>(null);

  ngOnInit(): void {
    this.seo.apply({
      title:       'Resume Tips, ATS Guides & Career Blog | CVSpeak',
      description: 'Practical, research-backed guides on resume writing, ATS optimization, interviews, and career growth.',
      canonical:   '/blog'
    });
    this.api.listBlogPosts(1, 12).subscribe({
      next: p => { this.paged.set(p); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }
}
