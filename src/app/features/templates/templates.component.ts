import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { SeoService } from '@core/services/seo.service';
import { TemplateSummary } from '@core/models/api.models';
import { AdSlotComponent } from '@shared/components/ad-slot/ad-slot.component';
import { TemplatePreviewComponent } from '@shared/components/template-preview/template-preview.component';
import { CATEGORIES, CATEGORY_GROUPS, CategoryMeta } from './data/categories';
import { COUNTRIES, COUNTRY_BY_CODE } from './data/countries';

type SortKey = 'popular' | 'newest' | 'downloads' | 'a-z';
type Level   = 'any' | 'entry' | 'mid' | 'senior' | 'executive';

@Component({
  selector: 'app-templates',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AdSlotComponent, TemplatePreviewComponent],
  template: `
    <!-- ============================================ HERO ============================================ -->
    <section class="hero">
      <div class="hero__bg" aria-hidden="true">
        <div class="hero__blob hero__blob--a"></div>
        <div class="hero__blob hero__blob--b"></div>
        <div class="hero__blob hero__blob--c"></div>
      </div>
      <div class="container hero__inner">
        <div class="badge badge--glass">✦ World-class resume templates</div>
        <h1 class="hero__title">Templates that get <em>shortlisted</em>.</h1>
        <p class="hero__subtitle">
          {{ totalCount() }} hand-crafted, ATS-friendly resume templates across {{ COUNTRIES.length }} countries and
          {{ CATEGORIES.length }} professions. Free to use. No signup.
        </p>

        <div class="hero__search">
          <span class="hero__search-icon">🔎</span>
          <input
            type="search"
            placeholder="Search 'frontend in Berlin', 'executive Dubai', 'fresh graduate'…"
            [(ngModel)]="search"
            (ngModelChange)="onFilterChange()"
            aria-label="Search templates" />
          <button type="button" *ngIf="search" class="hero__search-clear" (click)="search=''; onFilterChange()" aria-label="Clear">✕</button>
        </div>

        <div class="hero__stats">
          <div><strong>{{ totalCount() }}</strong><span>Templates</span></div>
          <div><strong>{{ COUNTRIES.length }}</strong><span>Countries</span></div>
          <div><strong>{{ CATEGORIES.length }}</strong><span>Professions</span></div>
          <div><strong>100%</strong><span>ATS-friendly</span></div>
        </div>
      </div>
    </section>

    <!-- ====================================== COUNTRY COLLECTION RAIL ====================================== -->
    <section class="rail" *ngIf="!loading()">
      <div class="container">
        <div class="rail__head">
          <h2>Browse by country</h2>
          <button type="button" class="link" (click)="country=''; onFilterChange()" *ngIf="country">Clear country</button>
        </div>
        <div class="rail__track" role="list">
          <button
            type="button"
            role="listitem"
            *ngFor="let c of COUNTRIES"
            class="country-chip"
            [class.is-active]="country === c.code"
            (click)="toggleCountry(c.code)">
            <span class="country-chip__flag">{{ c.flag }}</span>
            <span class="country-chip__name">{{ c.name }}</span>
            <span class="country-chip__count">{{ countByCountry()[c.code] || 0 }}</span>
          </button>
        </div>
      </div>
    </section>

    <!-- ====================================== FEATURED ====================================== -->
    <section class="featured" *ngIf="!hasFilters() && featuredList().length">
      <div class="container">
        <header class="section-head">
          <div>
            <p class="kicker">Editor’s picks</p>
            <h2>Featured templates</h2>
          </div>
          <p class="text-muted">Three flagship layouts our team built first.</p>
        </header>

        <div class="featured__grid">
          <article *ngFor="let t of featuredList()" class="card-feat" [routerLink]="['/templates', t.slug]">
            <div class="card-feat__preview">
              <app-template-preview [def]="t" [thumb]="true"></app-template-preview>
            </div>
            <div class="card-feat__body">
              <div class="row" style="gap:.4rem; flex-wrap:wrap; margin-bottom:.4rem;">
                <span class="ribbon">★ Editor’s pick</span>
                <span class="badge badge--ats" *ngIf="t.atsFriendly">ATS</span>
                <span class="badge badge--premium" *ngIf="t.isPremium">Premium</span>
              </div>
              <h3>{{ t.name }}</h3>
              <p class="text-muted">{{ t.description }}</p>
              <div class="card-feat__meta">
                <span>{{ flagOf(t.countryCode) }} {{ COUNTRY_BY_CODE[t.countryCode ?? '']?.name }}</span>
                <span>·</span>
                <span>{{ catLabel(t.category) }}</span>
                <span>·</span>
                <span>⬇ {{ formatCount(t.downloadCount) }}</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ====================================== FILTER BAR ====================================== -->
    <section class="filterbar">
      <div class="container">
        <div class="filterbar__inner">
          <div class="filterbar__group">
            <label>Profession</label>
            <select [(ngModel)]="category" (ngModelChange)="onFilterChange()">
              <option value="">All professions ({{ CATEGORIES.length }})</option>
              <optgroup *ngFor="let g of CATEGORY_GROUPS" [label]="g">
                <option *ngFor="let c of categoriesInGroup(g)" [value]="c.slug">
                  {{ c.icon }} {{ c.name }}
                </option>
              </optgroup>
            </select>
          </div>

          <div class="filterbar__group">
            <label>Country</label>
            <select [(ngModel)]="country" (ngModelChange)="onFilterChange()">
              <option value="">Any country</option>
              <option *ngFor="let c of COUNTRIES" [value]="c.code">{{ c.flag }} {{ c.name }}</option>
            </select>
          </div>

          <div class="filterbar__group">
            <label>Experience</label>
            <select [(ngModel)]="level" (ngModelChange)="onFilterChange()">
              <option value="any">Any level</option>
              <option value="entry">Entry</option>
              <option value="mid">Mid</option>
              <option value="senior">Senior</option>
              <option value="executive">Executive</option>
            </select>
          </div>

          <div class="filterbar__group">
            <label>Sort by</label>
            <select [(ngModel)]="sort" (ngModelChange)="onFilterChange()">
              <option value="popular">Most popular</option>
              <option value="downloads">Most downloads</option>
              <option value="a-z">A — Z</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          <div class="filterbar__chips">
            <label class="chip-toggle">
              <input type="checkbox" [(ngModel)]="atsOnly" (ngModelChange)="onFilterChange()" />
              <span>ATS-friendly only</span>
            </label>
            <button type="button" class="link" *ngIf="hasFilters()" (click)="resetFilters()">Reset filters</button>
          </div>
        </div>

        <div class="filterbar__active" *ngIf="hasFilters()">
          <span class="text-muted">Active:</span>
          <span class="active-chip" *ngIf="search">"{{ search }}" <button (click)="search=''; onFilterChange()">✕</button></span>
          <span class="active-chip" *ngIf="category">{{ catLabel(category) }} <button (click)="category=''; onFilterChange()">✕</button></span>
          <span class="active-chip" *ngIf="country">{{ flagOf(country) }} {{ COUNTRY_BY_CODE[country]?.name }} <button (click)="country=''; onFilterChange()">✕</button></span>
          <span class="active-chip" *ngIf="level !== 'any'">{{ level }} <button (click)="level='any'; onFilterChange()">✕</button></span>
          <span class="active-chip" *ngIf="atsOnly">ATS only <button (click)="atsOnly=false; onFilterChange()">✕</button></span>
        </div>
      </div>
    </section>

    <!-- ====================================== RESULTS ====================================== -->
    <section class="section">
      <div class="container">
        <header class="section-head">
          <div>
            <p class="kicker">All templates</p>
            <h2>
              <ng-container *ngIf="!loading()">{{ filtered().length }} {{ filtered().length === 1 ? 'template' : 'templates' }}</ng-container>
              <ng-container *ngIf="loading()">Loading…</ng-container>
            </h2>
          </div>
          <p class="text-muted" *ngIf="!hasFilters() && !loading()">Try filtering by country or profession to narrow down.</p>
        </header>

        <!-- Loading skeletons -->
        <div *ngIf="loading()" class="grid grid-3 results">
          <div *ngFor="let _ of skeletonRows" class="card-tmpl skel">
            <div class="card-tmpl__preview skel-shimmer"></div>
            <div class="card-tmpl__body">
              <div class="skel-line skel-line--lg skel-shimmer"></div>
              <div class="skel-line skel-shimmer"></div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div *ngIf="!loading() && filtered().length === 0" class="empty">
          <div class="empty__icon">🗂️</div>
          <h3>No templates match your filters</h3>
          <p class="text-muted">Try clearing a filter or exploring popular templates below.</p>
          <button type="button" class="btn btn--primary" (click)="resetFilters()">Reset filters</button>

          <div class="empty__suggest" *ngIf="suggestions().length">
            <p class="kicker">Closest matches</p>
            <div class="grid grid-3">
              <article *ngFor="let t of suggestions()" class="card-tmpl" [routerLink]="['/templates', t.slug]">
                <div class="card-tmpl__preview">
                  <app-template-preview [def]="t" [thumb]="true"></app-template-preview>
                </div>
                <div class="card-tmpl__body">
                  <h3>{{ t.name }}</h3>
                </div>
              </article>
            </div>
          </div>
        </div>

        <!-- Results grid -->
        <div *ngIf="!loading() && filtered().length > 0" class="grid grid-3 results">
          <article *ngFor="let t of filtered(); trackBy: trackBySlug" class="card-tmpl" [routerLink]="['/templates', t.slug]">
            <div class="card-tmpl__preview">
              <app-template-preview [def]="t" [thumb]="true"></app-template-preview>
              <div class="card-tmpl__overlay">
                <button type="button" class="btn btn--primary card-tmpl__cta">Use template →</button>
              </div>
              <div class="card-tmpl__ribbons">
                <span class="ribbon ribbon--hot" *ngIf="t.trending">🔥 Trending</span>
                <span class="ribbon ribbon--star" *ngIf="t.popularity >= 90 && !t.trending">★ Popular</span>
                <span class="ribbon ribbon--premium" *ngIf="t.isPremium">◆ Premium</span>
              </div>
              <div class="card-tmpl__flag" [attr.aria-label]="COUNTRY_BY_CODE[t.countryCode ?? '']?.name">
                {{ flagOf(t.countryCode) }}
              </div>
            </div>
            <div class="card-tmpl__body">
              <div class="card-tmpl__head">
                <h3>{{ t.name }}</h3>
                <span class="card-tmpl__downloads">⬇ {{ formatCount(t.downloadCount) }}</span>
              </div>
              <p class="card-tmpl__cat">{{ catIcon(t.category) }} {{ catLabel(t.category) }} · {{ COUNTRY_BY_CODE[t.countryCode ?? '']?.name }}</p>
              <div class="card-tmpl__tags">
                <span class="tag tag--ats" *ngIf="t.atsFriendly">ATS</span>
                <span class="tag" *ngFor="let tag of t.tags.slice(0,2)">{{ tag }}</span>
              </div>
            </div>
          </article>
        </div>

        <!-- Trending -->
        <ng-container *ngIf="!hasFilters() && !loading() && trendingList().length">
          <header class="section-head" style="margin-top: 4rem;">
            <div>
              <p class="kicker">🔥 Trending this week</p>
              <h2>What recruiters are downloading right now</h2>
            </div>
          </header>
          <div class="grid grid-4 results">
            <article *ngFor="let t of trendingList()" class="card-tmpl" [routerLink]="['/templates', t.slug]">
              <div class="card-tmpl__preview">
                <app-template-preview [def]="t" [thumb]="true"></app-template-preview>
                <div class="card-tmpl__flag">{{ flagOf(t.countryCode) }}</div>
              </div>
              <div class="card-tmpl__body">
                <h3>{{ t.name }}</h3>
                <p class="card-tmpl__cat">{{ catLabel(t.category) }}</p>
              </div>
            </article>
          </div>
        </ng-container>

        <app-ad-slot slotId="templates-footer" variant="footer"></app-ad-slot>
      </div>
    </section>
  `,
  styles: [`
    /* ============================ HERO ============================ */
    .hero { position: relative; overflow: hidden; padding: 5rem 0 3rem; isolation: isolate; }
    .hero__bg { position: absolute; inset: 0; z-index: -1; }
    .hero__blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: .35; }
    .hero__blob--a { width: 480px; height: 480px; background: #7c3aed; top: -120px; left: -120px; }
    .hero__blob--b { width: 380px; height: 380px; background: #06b6d4; top: 60px; right: -80px; opacity: .25; }
    .hero__blob--c { width: 320px; height: 320px; background: #f472b6; bottom: -160px; left: 30%; opacity: .2; }
    .hero__inner { position: relative; text-align: center; }
    .hero__title { font-size: clamp(2.2rem, 5vw, 3.4rem); font-weight: 800; line-height: 1.05; margin: 1rem 0; letter-spacing: -.02em; }
    .hero__title em { font-style: normal; background: linear-gradient(135deg, #7c3aed, #06b6d4); -webkit-background-clip: text; background-clip: text; color: transparent; }
    .hero__subtitle { color: var(--text-muted); max-width: 640px; margin: 0 auto 2rem; font-size: 1.05rem; }
    .hero__search {
      position: relative; max-width: 580px; margin: 0 auto;
      background: var(--surface-1); border: 1px solid var(--border-soft);
      border-radius: 999px; padding: .6rem 1.1rem; display: flex; align-items: center;
      box-shadow: 0 10px 32px rgba(124,58,237,.10);
    }
    .hero__search-icon { font-size: 1.1rem; margin-right: .5rem; }
    .hero__search input { flex: 1; border: 0; background: transparent; font-size: 1rem; color: var(--text); outline: none; }
    .hero__search-clear { border: 0; background: transparent; cursor: pointer; padding: .25rem .5rem; color: var(--text-muted); }
    .hero__stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; max-width: 720px; margin: 2.5rem auto 0; }
    .hero__stats > div { text-align: center; }
    .hero__stats strong { display: block; font-size: 1.6rem; font-weight: 800; color: var(--brand-500); }
    .hero__stats span { font-size: .85rem; color: var(--text-muted); }
    .badge--glass { display: inline-block; background: rgba(124,58,237,.10); color: var(--brand-500); border-radius: 999px; padding: .3rem .85rem; font-size: .8rem; font-weight: 600; backdrop-filter: blur(8px); border: 1px solid rgba(124,58,237,.2); }

    /* ============================ COUNTRY RAIL ============================ */
    .rail { padding: 1.5rem 0; border-bottom: 1px solid var(--border-soft); }
    .rail__head { display: flex; justify-content: space-between; align-items: center; margin-bottom: .9rem; }
    .rail__head h2 { font-size: 1rem; text-transform: uppercase; letter-spacing: .08em; color: var(--text-muted); margin: 0; }
    .rail__track { display: flex; gap: .6rem; overflow-x: auto; scrollbar-width: thin; padding-bottom: .5rem; }
    .country-chip { flex: 0 0 auto; display: flex; align-items: center; gap: .45rem; padding: .5rem .85rem; border: 1px solid var(--border-soft); border-radius: 999px; background: var(--surface-1); cursor: pointer; transition: all .15s; font-size: .9rem; color: var(--text); }
    .country-chip:hover { background: var(--surface-2); border-color: var(--brand-500); transform: translateY(-1px); }
    .country-chip.is-active { background: var(--brand-500); color: #fff; border-color: var(--brand-500); }
    .country-chip__flag { font-size: 1.1rem; }
    .country-chip__count { font-size: .75rem; padding: 0 .4rem; border-radius: 999px; background: rgba(0,0,0,.06); margin-left: .15rem; }
    .country-chip.is-active .country-chip__count { background: rgba(255,255,255,.25); }

    /* ============================ SECTION HEAD ============================ */
    .kicker { color: var(--brand-500); font-size: .75rem; text-transform: uppercase; letter-spacing: .12em; font-weight: 700; margin: 0 0 .2rem; }
    .section-head { display: flex; justify-content: space-between; align-items: end; gap: 1rem; margin-bottom: 1.25rem; flex-wrap: wrap; }
    .section-head h2 { font-size: 1.6rem; margin: 0; font-weight: 800; letter-spacing: -.01em; }

    /* ============================ FEATURED ============================ */
    .featured { padding: 3rem 0 2rem; }
    .featured__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
    .card-feat { cursor: pointer; border-radius: 1rem; background: var(--surface-1); border: 1px solid var(--border-soft); overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,.04); transition: transform .25s, box-shadow .25s, border-color .25s; }
    .card-feat:hover { transform: translateY(-4px); box-shadow: 0 18px 48px rgba(124,58,237,.20); border-color: var(--brand-500); }
    .card-feat__preview { aspect-ratio: 8.5 / 11; background: #f4f4f6; position: relative; overflow: hidden; border-bottom: 1px solid var(--border-soft); }
    .card-feat__body { padding: 1.25rem 1.4rem 1.4rem; }
    .card-feat__body h3 { margin: .1rem 0 .35rem; font-size: 1.15rem; font-weight: 700; }
    .card-feat__meta { margin-top: .8rem; display: flex; flex-wrap: wrap; gap: .35rem; color: var(--text-muted); font-size: .82rem; }

    /* ============================ FILTER BAR ============================ */
    .filterbar { position: sticky; top: 64px; z-index: 50; background: var(--surface-translucent); backdrop-filter: saturate(160%) blur(14px); border-bottom: 1px solid var(--border-soft); padding: 1rem 0; }
    .filterbar__inner { display: grid; grid-template-columns: 2fr 2fr 1.2fr 1.2fr auto; gap: 1rem; align-items: end; }
    .filterbar__group { display: flex; flex-direction: column; gap: .3rem; }
    .filterbar__group label { font-size: .72rem; text-transform: uppercase; letter-spacing: .08em; color: var(--text-muted); font-weight: 700; }
    .filterbar__group select { padding: .55rem .7rem; border-radius: .55rem; border: 1px solid var(--border-soft); background: var(--surface-1); color: var(--text); font-size: .92rem; cursor: pointer; }
    .filterbar__group select:focus { outline: 2px solid var(--brand-500); outline-offset: 1px; }
    .filterbar__chips { display: flex; align-items: center; gap: .8rem; }
    .chip-toggle { display: flex; align-items: center; gap: .4rem; font-size: .85rem; cursor: pointer; white-space: nowrap; }
    .filterbar__active { display: flex; gap: .4rem; flex-wrap: wrap; margin-top: .8rem; align-items: center; }
    .active-chip { display: inline-flex; align-items: center; gap: .35rem; background: rgba(124,58,237,.10); color: var(--brand-500); padding: .25rem .65rem; border-radius: 999px; font-size: .82rem; }
    .active-chip button { border: 0; background: transparent; color: inherit; cursor: pointer; padding: 0 .15rem; }
    .link { background: transparent; border: 0; color: var(--brand-500); cursor: pointer; font-weight: 600; font-size: .85rem; }
    .link:hover { text-decoration: underline; }

    /* ============================ TEMPLATE CARD ============================ */
    .results { gap: 1.5rem; }
    .card-tmpl { cursor: pointer; border-radius: .9rem; background: var(--surface-1); border: 1px solid var(--border-soft); overflow: hidden; transition: transform .25s, box-shadow .25s, border-color .25s; display: flex; flex-direction: column; }
    .card-tmpl:hover { transform: translateY(-3px); box-shadow: 0 16px 40px rgba(0,0,0,.12); border-color: var(--brand-500); }
    .card-tmpl__preview { position: relative; aspect-ratio: 8.5 / 11; background: #f4f4f6; overflow: hidden; border-bottom: 1px solid var(--border-soft); }
    .card-tmpl__preview app-template-preview { display: block; width: 100%; height: 100%; }
    .card-tmpl__overlay { position: absolute; inset: 0; background: linear-gradient(180deg, transparent 50%, rgba(0,0,0,.55)); opacity: 0; transition: opacity .2s; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 1rem; }
    .card-tmpl:hover .card-tmpl__overlay { opacity: 1; }
    .card-tmpl__cta { padding: .5rem 1.2rem; font-size: .88rem; }
    .card-tmpl__ribbons { position: absolute; top: .55rem; left: .55rem; display: flex; flex-direction: column; gap: .3rem; }
    .ribbon { font-size: .7rem; font-weight: 700; padding: .2rem .55rem; border-radius: .4rem; background: #fff; color: #111; box-shadow: 0 2px 8px rgba(0,0,0,.12); }
    .ribbon--hot { background: linear-gradient(135deg, #f97316, #dc2626); color: #fff; }
    .ribbon--star { background: linear-gradient(135deg, #fbbf24, #d97706); color: #fff; }
    .ribbon--premium { background: #0a0a0a; color: #d4af37; }
    .card-tmpl__flag { position: absolute; top: .55rem; right: .55rem; background: rgba(255,255,255,.95); width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.05rem; box-shadow: 0 2px 8px rgba(0,0,0,.12); }
    .card-tmpl__body { padding: 1rem 1.1rem 1.15rem; }
    .card-tmpl__head { display: flex; justify-content: space-between; align-items: baseline; gap: .5rem; }
    .card-tmpl__head h3 { margin: 0; font-size: 1rem; font-weight: 700; }
    .card-tmpl__downloads { font-size: .78rem; color: var(--text-muted); white-space: nowrap; }
    .card-tmpl__cat { font-size: .82rem; color: var(--text-muted); margin: .25rem 0 .5rem; }
    .card-tmpl__tags { display: flex; gap: .3rem; flex-wrap: wrap; }
    .tag { font-size: .7rem; padding: .15rem .55rem; border-radius: 999px; background: var(--surface-2); color: var(--text-muted); border: 1px solid var(--border-soft); }
    .tag--ats { background: rgba(16,185,129,.12); color: #047857; border-color: rgba(16,185,129,.3); }
    .badge--ats { background: rgba(16,185,129,.12); color: #047857; }
    .badge--premium { background: #0a0a0a; color: #d4af37; }

    /* ============================ EMPTY + SKELETONS ============================ */
    .empty { text-align: center; padding: 3rem 1rem; }
    .empty__icon { font-size: 3rem; margin-bottom: 1rem; }
    .empty h3 { margin: 0 0 .4rem; }
    .empty__suggest { margin-top: 2.5rem; text-align: left; }

    .skel .card-tmpl__preview { background: #eee; }
    .skel-shimmer {
      background: linear-gradient(90deg, #eee 0%, #f5f5f7 50%, #eee 100%);
      background-size: 200% 100%;
      animation: shimmer 1.4s linear infinite;
    }
    .skel-line { height: 12px; border-radius: 6px; margin-top: .5rem; }
    .skel-line--lg { height: 16px; width: 60%; }
    @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

    /* ============================ RESPONSIVE ============================ */
    @media (max-width: 960px) {
      .filterbar__inner { grid-template-columns: 1fr 1fr; }
      .filterbar__chips { grid-column: 1 / -1; justify-content: flex-start; }
      .featured__grid { grid-template-columns: 1fr; }
      .hero__stats { grid-template-columns: repeat(2, 1fr); }
      .filterbar { position: relative; top: 0; }
    }
    @media (max-width: 640px) {
      .filterbar__inner { grid-template-columns: 1fr; }
    }
  `]
})
export class TemplatesComponent implements OnInit {
  private api = inject(ApiService);
  private seo = inject(SeoService);

  // ----- Filter state -----
  search   = '';
  category = '';
  country  = '';
  level: Level   = 'any';
  atsOnly  = false;
  sort: SortKey  = 'popular';

  // ----- Server data -----
  /** Full catalogue cached on init. We re-filter / re-sort client-side
   *  so filter changes are instant without an extra round-trip. */
  private allItems = signal<TemplateSummary[]>([]);
  loading = signal(true);
  private tick = signal(0);  // bumped on filter change

  // ----- Static metadata (presentation only) -----
  readonly COUNTRIES        = COUNTRIES;
  readonly CATEGORIES       = CATEGORIES;
  readonly CATEGORY_GROUPS  = CATEGORY_GROUPS;
  readonly COUNTRY_BY_CODE  = COUNTRY_BY_CODE;
  readonly skeletonRows     = Array(9);

  // ----- Derived totals -----
  totalCount     = computed(() => this.allItems().length);
  featuredList   = computed(() => this.allItems().filter(t => t.featured));
  trendingList   = computed(() => this.allItems().filter(t => t.trending).slice(0, 8));
  countByCountry = computed(() => {
    const m: Record<string, number> = {};
    for (const t of this.allItems()) {
      const k = t.countryCode ?? '';
      m[k] = (m[k] ?? 0) + 1;
    }
    return m;
  });

  // ----- Filtered + sorted view -----
  filtered = computed<TemplateSummary[]>(() => {
    this.tick();
    return this.sortList(this.applyFilters(this.allItems()), this.sort);
  });

  // ----- Empty-state suggestions (relax filters progressively) -----
  suggestions = computed<TemplateSummary[]>(() => {
    this.tick();
    if (this.filtered().length > 0) return [];
    const q = this.search.trim().toLowerCase();
    let list = this.allItems().filter(t =>
      (!this.category || t.category === this.category) &&
      (!q || (t.name + ' ' + t.description + ' ' + t.tags.join(' ')).toLowerCase().includes(q)));
    if (list.length === 0) list = this.allItems().filter(t => !this.category || t.category === this.category);
    if (list.length === 0) list = this.allItems().slice();
    return this.sortList(list, 'popular').slice(0, 3);
  });

  ngOnInit(): void {
    this.seo.apply({
      title:       'Free Resume Templates — ATS-Friendly Templates for 29 Countries | CVSpeak',
      description: 'Browse 50+ professionally-designed, ATS-friendly resume templates across 29 countries and 48 professions. Free. No signup.',
      canonical:   '/templates'
    });

    this.api.listTemplates({ pageSize: 100, sort: 'popular' }).subscribe({
      next: r => { this.allItems.set(r.items); this.loading.set(false); },
      error: _ => { this.loading.set(false); /* show empty state */ }
    });
  }

  // ----- UI handlers -----
  onFilterChange(): void { this.tick.update(v => v + 1); }
  hasFilters(): boolean { return !!(this.search || this.category || this.country || this.atsOnly || this.level !== 'any'); }
  resetFilters(): void {
    this.search = ''; this.category = ''; this.country = '';
    this.atsOnly = false; this.level = 'any';
    this.onFilterChange();
  }
  toggleCountry(code: string): void {
    this.country = this.country === code ? '' : code;
    this.onFilterChange();
  }

  // ----- Helpers -----
  catLabel(slug: string): string { return CATEGORIES.find(c => c.slug === slug)?.name ?? slug; }
  catIcon(slug: string):  string { return CATEGORIES.find(c => c.slug === slug)?.icon ?? '•'; }
  categoriesInGroup(group: string): CategoryMeta[] { return CATEGORIES.filter(c => c.group === group); }
  trackBySlug(_: number, t: TemplateSummary): string { return t.slug; }
  flagOf(code: string | null | undefined): string { return COUNTRY_BY_CODE[code ?? '']?.flag ?? ''; }
  formatCount(n: number): string {
    if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'k';
    return n.toString();
  }

  private applyFilters(list: TemplateSummary[]): TemplateSummary[] {
    const q = this.search.trim().toLowerCase();
    return list.filter(t => {
      if (this.category && t.category    !== this.category) return false;
      if (this.country  && t.countryCode !== this.country)  return false;
      if (this.level !== 'any' && t.experienceLevel !== this.level) return false;
      if (this.atsOnly && !t.atsFriendly) return false;
      if (q) {
        const hay = (t.name + ' ' + (t.description ?? '') + ' ' + t.category + ' ' +
                     (t.countryCode ?? '') + ' ' + t.tags.join(' ') + ' ' +
                     t.industries.join(' ')).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }

  private sortList(list: TemplateSummary[], key: SortKey): TemplateSummary[] {
    const copy = list.slice();
    switch (key) {
      case 'popular':   copy.sort((a, b) => b.popularity    - a.popularity);    break;
      case 'downloads': copy.sort((a, b) => b.downloadCount - a.downloadCount); break;
      case 'a-z':       copy.sort((a, b) => a.name.localeCompare(b.name));      break;
      case 'newest':    copy.reverse(); break;
    }
    return copy;
  }
}
