import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ApiService } from '@core/services/api.service';
import { SeoService } from '@core/services/seo.service';
import { SeoPageDto } from '@core/models/api.models';
import { AdSlotComponent } from '@shared/components/ad-slot/ad-slot.component';

@Component({
  selector: 'app-seo-page',
  standalone: true,
  imports: [CommonModule, RouterLink, AdSlotComponent],
  template: `
    <section class="section" *ngIf="page()">
      <div class="container container--narrow">
        <header>
          <h1>{{ page()!.h1 }}</h1>
          <div class="intro" *ngIf="page()!.introHtml" [innerHTML]="introHtml()"></div>
        </header>

        <article class="prose" style="margin-top: 1.5rem;" [innerHTML]="bodyHtml()"></article>

        <!-- FAQ block from JSON -->
        <section *ngIf="faqs().length" style="margin-top: 2.5rem;">
          <h2>FAQ</h2>
          <details *ngFor="let f of faqs()" class="seo-faq">
            <summary>{{ f.q }}</summary>
            <p>{{ f.a }}</p>
          </details>
        </section>

        <!-- Related internal links cluster -->
        <section *ngIf="related().length" style="margin-top: 2.5rem;">
          <h2>Related guides</h2>
          <ul class="related">
            <li *ngFor="let r of related()">
              <a [routerLink]="r.path">{{ r.label }}</a>
            </li>
          </ul>
        </section>

        <app-ad-slot slotId="seo-page-footer" variant="footer"></app-ad-slot>
      </div>
    </section>

    <section class="section" *ngIf="notFound()">
      <div class="container text-center">
        <h1>Page not found</h1>
        <p class="text-muted">We couldn't find content for that URL.</p>
        <a routerLink="/" class="btn btn--primary" style="margin-top: 1rem;">Back to home</a>
      </div>
    </section>
  `,
  styles: [`
    .seo-faq { border-bottom: 1px solid var(--border-soft); padding: 1rem 0; }
    .seo-faq summary { cursor: pointer; font-weight: 600; }
    .seo-faq p { color: var(--text-muted); margin: .5rem 0 0; }
    .related { list-style: none; padding: 0; }
    .related li { padding: .4rem 0; }
    .related a { color: var(--brand-500); font-weight: 600; }
    .intro { color: var(--text-muted); font-size: 1.1rem; }
  `]
})
export class SeoPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private api   = inject(ApiService);
  private seo   = inject(SeoService);
  private sanitizer = inject(DomSanitizer);

  page      = signal<SeoPageDto | null>(null);
  notFound  = signal(false);
  introHtml = signal<SafeHtml>('');
  bodyHtml  = signal<SafeHtml>('');
  faqs      = signal<{ q: string; a: string }[]>([]);
  related   = signal<{ path: string; label: string }[]>([]);

  ngOnInit(): void {
    this.route.url.subscribe(() => {
      const path = '/' + this.route.snapshot.url.map(s => s.path).join('/');
      this.api.getSeoPage(path).subscribe({
        next: p => {
          this.page.set(p);
          this.introHtml.set(this.sanitizer.bypassSecurityTrustHtml(p.introHtml ?? ''));
          this.bodyHtml.set(this.sanitizer.bypassSecurityTrustHtml(p.bodyHtml));

          try { this.faqs.set(JSON.parse(p.faqJson)); } catch { this.faqs.set([]); }
          try { this.related.set(JSON.parse(p.relatedPages)); } catch { this.related.set([]); }

          this.seo.apply({
            title:       p.metaTitle,
            description: p.metaDesc,
            canonical:   p.urlPath,
            keywords:    (() => { try { return JSON.parse(p.keywordsJson); } catch { return []; } })()
          });

          if (this.faqs().length) {
            this.seo.setJsonLd({
              '@context': 'https://schema.org',
              '@type':    'FAQPage',
              mainEntity: this.faqs().map(f => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a }
              }))
            }, 'seo-page-faq');
          }
        },
        error: () => this.notFound.set(true)
      });
    });
  }
}
