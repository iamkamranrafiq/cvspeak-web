import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { SeoService } from '@core/services/seo.service';
import { TemplateSummary } from '@core/models/api.models';
import { TemplatePreviewComponent } from '@shared/components/template-preview/template-preview.component';
import { CATEGORIES } from './data/categories';
import { COUNTRY_BY_CODE } from './data/countries';

/**
 * Resume template detail page.
 * Fetches the full template list (small payload) and finds the matching slug.
 * Renders a hero (preview + metadata + CTAs), then a related-templates rail.
 */
@Component({
  selector: 'app-template-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, TemplatePreviewComponent],
  template: `
    <!-- =================== LOADING / NOT FOUND =================== -->
    <section *ngIf="loading()" class="section">
      <div class="container">
        <div class="skel-shimmer skel-block" style="height: 600px; border-radius: 1rem;"></div>
      </div>
    </section>

    <section *ngIf="!loading() && !template()" class="section">
      <div class="container" style="text-align:center; padding: 4rem 1rem;">
        <div style="font-size:3rem; margin-bottom: 1rem;">🗂️</div>
        <h2>Template not found</h2>
        <p class="text-muted">We couldn’t find that template. It may have been renamed or removed.</p>
        <a routerLink="/templates" class="btn btn--primary" style="margin-top: 1rem;">Browse all templates</a>
      </div>
    </section>

    <!-- =================== DETAIL =================== -->
    <ng-container *ngIf="!loading() && template() as t">
      <section class="hero">
        <div class="hero__bg" aria-hidden="true">
          <div class="hero__blob hero__blob--a" [style.background]="t.palette?.accent || '#7c3aed'"></div>
          <div class="hero__blob hero__blob--b" [style.background]="t.palette?.primary || '#06b6d4'"></div>
        </div>

        <div class="container hero__inner">
          <!-- Breadcrumb -->
          <nav class="crumbs">
            <a routerLink="/templates">Templates</a>
            <span>›</span>
            <span>{{ catLabel(t.category) }}</span>
            <span>›</span>
            <span class="crumb-current">{{ t.name }}</span>
          </nav>

          <div class="detail">
            <!-- Live preview -->
            <div class="detail__preview">
              <div class="preview-frame">
                <app-template-preview [def]="t" [thumb]="false"></app-template-preview>
              </div>
              <div class="preview-actions">
                <span class="preview-action-label">Preview shows sample content</span>
              </div>
            </div>

            <!-- Meta + CTAs -->
            <aside class="detail__meta">
              <div class="row" style="gap:.4rem; flex-wrap:wrap; margin-bottom: .6rem;">
                <span class="ribbon ribbon--hot" *ngIf="t.trending">🔥 Trending</span>
                <span class="ribbon ribbon--star" *ngIf="t.popularity >= 90 && !t.trending">★ Popular</span>
                <span class="ribbon ribbon--premium" *ngIf="t.isPremium">◆ Premium</span>
                <span class="badge badge--ats" *ngIf="t.atsFriendly">ATS-friendly</span>
              </div>

              <h1>{{ t.name }}</h1>
              <p class="detail__category">
                {{ catIcon(t.category) }} {{ catLabel(t.category) }}
                · {{ COUNTRY_BY_CODE[t.countryCode ?? '']?.flag }} {{ COUNTRY_BY_CODE[t.countryCode ?? '']?.name }}
              </p>

              <p class="detail__desc">{{ t.description }}</p>

              <div class="cta-stack">
                <a routerLink="/resume-builder" [queryParams]="{ template: t.slug }" class="btn btn--primary btn--lg">
                  Use this template →
                </a>
                <a routerLink="/resume-analyzer" class="btn btn--ghost btn--lg">Analyze my current CV first</a>
              </div>

              <div class="stat-grid">
                <div><strong>⬇ {{ formatCount(t.downloadCount) }}</strong><span>Downloads</span></div>
                <div><strong>{{ t.popularity }}</strong><span>Popularity</span></div>
                <div><strong>{{ t.experienceLevel | titlecase }}</strong><span>Level</span></div>
                <div><strong>{{ t.supportedLanguages.length }}</strong><span>Language{{ t.supportedLanguages.length === 1 ? '' : 's' }}</span></div>
              </div>

              <div class="spec">
                <h3>Template specifications</h3>
                <dl>
                  <dt>Layout</dt>      <dd>{{ t.layoutType | titlecase }}</dd>
                  <dt>Palette</dt>     <dd>
                    <span class="swatch" [style.background]="t.palette?.primary"></span>
                    <span class="swatch" [style.background]="t.palette?.accent"></span>
                    {{ t.palette?.name }}
                  </dd>
                  <dt>Typography</dt>  <dd>{{ t.typography?.heading }} / {{ t.typography?.body }}</dd>
                  <dt>Sections</dt>    <dd>{{ t.sections.join(' · ') }}</dd>
                  <dt *ngIf="t.industries.length">Industries</dt>
                  <dd *ngIf="t.industries.length">{{ t.industries.join(', ') }}</dd>
                  <dt *ngIf="t.recommendedFor.length">Recommended for</dt>
                  <dd *ngIf="t.recommendedFor.length">{{ t.recommendedFor.join(', ') }}</dd>
                  <dt>Languages</dt>   <dd>{{ t.supportedLanguages.join(', ') }}</dd>
                </dl>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <!-- =================== RELATED =================== -->
      <section class="section" *ngIf="related().length">
        <div class="container">
          <header class="section-head">
            <div>
              <p class="kicker">More like this</p>
              <h2>Related templates</h2>
            </div>
            <a routerLink="/templates" class="link">Browse all →</a>
          </header>

          <div class="related-grid">
            <article *ngFor="let r of related()" class="card-tmpl" [routerLink]="['/templates', r.slug]">
              <div class="card-tmpl__preview">
                <app-template-preview [def]="r" [thumb]="true"></app-template-preview>
                <div class="card-tmpl__flag">{{ COUNTRY_BY_CODE[r.countryCode ?? '']?.flag }}</div>
              </div>
              <div class="card-tmpl__body">
                <h3>{{ r.name }}</h3>
                <p class="card-tmpl__cat">{{ catLabel(r.category) }} · {{ COUNTRY_BY_CODE[r.countryCode ?? '']?.name }}</p>
              </div>
            </article>
          </div>
        </div>
      </section>
    </ng-container>
  `,
  styles: [`
    /* ======================== HERO ======================== */
    .hero { position: relative; overflow: hidden; padding: 3rem 0 4rem; isolation: isolate; }
    .hero__bg { position: absolute; inset: 0; z-index: -1; }
    .hero__blob { position: absolute; border-radius: 50%; filter: blur(100px); opacity: .25; }
    .hero__blob--a { width: 520px; height: 520px; top: -200px; left: -180px; }
    .hero__blob--b { width: 380px; height: 380px; bottom: -120px; right: -120px; opacity: .18; }

    .crumbs { display: flex; gap: .35rem; font-size: .85rem; color: var(--text-muted); margin-bottom: 1.4rem; flex-wrap: wrap; }
    .crumbs a { color: var(--brand-500); text-decoration: none; }
    .crumbs a:hover { text-decoration: underline; }
    .crumb-current { color: var(--text); font-weight: 600; }

    /* ======================== DETAIL GRID ======================== */
    .detail { display: grid; grid-template-columns: 1.05fr 1fr; gap: 3rem; align-items: start; }
    .detail__preview { position: relative; }
    .preview-frame {
      aspect-ratio: 8.5 / 11;
      background: #f4f4f6;
      border-radius: .9rem;
      overflow: hidden;
      border: 1px solid var(--border-soft);
      box-shadow: 0 30px 80px rgba(0,0,0,.18), 0 4px 12px rgba(0,0,0,.06);
      position: sticky; top: 80px;
    }
    .preview-actions { display: flex; justify-content: center; margin-top: .75rem; }
    .preview-action-label { font-size: .78rem; color: var(--text-muted); }

    .detail__meta h1 {
      font-size: clamp(1.8rem, 3.5vw, 2.4rem);
      margin: .4rem 0 .25rem;
      font-weight: 800;
      letter-spacing: -.01em;
    }
    .detail__category { color: var(--text-muted); margin: 0 0 1rem; font-size: 1.05rem; }
    .detail__desc     { color: var(--text); margin: 0 0 1.6rem; font-size: 1.05rem; line-height: 1.6; }

    .cta-stack { display: flex; flex-direction: column; gap: .6rem; margin-bottom: 1.8rem; }
    .btn--lg { padding: .85rem 1.4rem; font-size: 1rem; }

    .stat-grid {
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem;
      padding: 1.1rem; background: var(--surface-1); border: 1px solid var(--border-soft);
      border-radius: .85rem; margin-bottom: 1.4rem;
    }
    .stat-grid > div { text-align: center; }
    .stat-grid strong { display: block; font-size: 1.15rem; font-weight: 800; color: var(--brand-500); margin-bottom: .15rem; }
    .stat-grid span { font-size: .78rem; color: var(--text-muted); }

    .spec { padding: 1.1rem 1.3rem; background: var(--surface-1); border: 1px solid var(--border-soft); border-radius: .85rem; }
    .spec h3 { margin: 0 0 .8rem; font-size: 1rem; font-weight: 700; }
    .spec dl { display: grid; grid-template-columns: 1fr 2fr; row-gap: .55rem; column-gap: 1rem; margin: 0; }
    .spec dt { color: var(--text-muted); font-size: .85rem; font-weight: 600; }
    .spec dd { margin: 0; font-size: .9rem; color: var(--text); display: flex; align-items: center; gap: .4rem; flex-wrap: wrap; }
    .swatch { display: inline-block; width: 14px; height: 14px; border-radius: 50%; border: 1px solid rgba(0,0,0,.1); }

    /* ======================== RIBBONS / BADGES ======================== */
    .ribbon { font-size: .72rem; font-weight: 700; padding: .25rem .6rem; border-radius: .4rem; background: #fff; color: #111; box-shadow: 0 2px 8px rgba(0,0,0,.08); }
    .ribbon--hot { background: linear-gradient(135deg, #f97316, #dc2626); color: #fff; }
    .ribbon--star { background: linear-gradient(135deg, #fbbf24, #d97706); color: #fff; }
    .ribbon--premium { background: #0a0a0a; color: #d4af37; }
    .badge--ats { background: rgba(16,185,129,.12); color: #047857; padding: .22rem .6rem; border-radius: .4rem; font-size: .72rem; font-weight: 700; }

    /* ======================== SECTION HEAD ======================== */
    .kicker { color: var(--brand-500); font-size: .75rem; text-transform: uppercase; letter-spacing: .12em; font-weight: 700; margin: 0 0 .2rem; }
    .section-head { display: flex; justify-content: space-between; align-items: end; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 1rem; }
    .section-head h2 { font-size: 1.6rem; margin: 0; font-weight: 800; }
    .link { color: var(--brand-500); font-weight: 600; text-decoration: none; }
    .link:hover { text-decoration: underline; }

    /* ======================== RELATED ======================== */
    .related-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.25rem; }
    .card-tmpl { cursor: pointer; border-radius: .9rem; background: var(--surface-1); border: 1px solid var(--border-soft); overflow: hidden; transition: transform .2s, box-shadow .2s, border-color .2s; display: flex; flex-direction: column; }
    .card-tmpl:hover { transform: translateY(-3px); box-shadow: 0 14px 32px rgba(0,0,0,.10); border-color: var(--brand-500); }
    .card-tmpl__preview { position: relative; aspect-ratio: 8.5 / 11; background: #f4f4f6; overflow: hidden; border-bottom: 1px solid var(--border-soft); }
    .card-tmpl__flag { position: absolute; top: .5rem; right: .5rem; background: rgba(255,255,255,.95); width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,.12); }
    .card-tmpl__body { padding: .9rem 1rem 1.1rem; }
    .card-tmpl__body h3 { margin: 0 0 .25rem; font-size: .95rem; font-weight: 700; }
    .card-tmpl__cat { font-size: .8rem; color: var(--text-muted); margin: 0; }

    /* ======================== SKELETON ======================== */
    .skel-block { background: #eee; }
    .skel-shimmer { background: linear-gradient(90deg, #eee 0%, #f5f5f7 50%, #eee 100%); background-size: 200% 100%; animation: shimmer 1.4s linear infinite; }
    @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

    /* ======================== RESPONSIVE ======================== */
    @media (max-width: 960px) {
      .detail { grid-template-columns: 1fr; gap: 2rem; }
      .preview-frame { position: relative; top: 0; }
      .related-grid { grid-template-columns: repeat(2, 1fr); }
      .stat-grid { grid-template-columns: repeat(2, 1fr); }
      .spec dl { grid-template-columns: 1fr; row-gap: .25rem; }
      .spec dt { margin-top: .6rem; }
    }
    @media (max-width: 560px) {
      .related-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class TemplateDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private api   = inject(ApiService);
  private seo   = inject(SeoService);

  loading  = signal(true);
  template = signal<TemplateSummary | null>(null);
  related  = signal<TemplateSummary[]>([]);

  readonly COUNTRY_BY_CODE = COUNTRY_BY_CODE;

  ngOnInit(): void {
    this.route.paramMap.subscribe(p => {
      const slug = p.get('slug') ?? '';
      this.loading.set(true);
      this.api.listTemplates({ pageSize: 100, sort: 'popular' }).subscribe({
        next: r => {
          const hit = r.items.find(t => t.slug === slug) ?? null;
          this.template.set(hit);
          if (hit) {
            this.related.set(r.items.filter(t =>
              t.slug !== hit.slug && (t.category === hit.category || t.countryCode === hit.countryCode)
            ).slice(0, 4));
            this.seo.apply({
              title:       `${hit.name} — Free ${this.catLabel(hit.category)} Resume Template | CVSpeak`,
              description: hit.description ?? `${hit.name} — free ATS-friendly resume template for ${this.catLabel(hit.category)}.`,
              canonical:   `/templates/${hit.slug}`
            });
          }
          this.loading.set(false);
        },
        error: _ => { this.loading.set(false); }
      });
    });
  }

  catLabel(slug: string): string { return CATEGORIES.find(c => c.slug === slug)?.name ?? slug; }
  catIcon(slug: string):  string { return CATEGORIES.find(c => c.slug === slug)?.icon ?? '•'; }
  formatCount(n: number): string {
    if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'k';
    return n.toString();
  }
}
