import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ApiService } from '@core/services/api.service';
import { SeoService } from '@core/services/seo.service';
import { BlogPostDetail } from '@core/models/api.models';
import { AdSlotComponent } from '@shared/components/ad-slot/ad-slot.component';

@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [CommonModule, RouterLink, AdSlotComponent],
  template: `
    <section class="section" *ngIf="post()">
      <div class="container container--narrow">
        <a routerLink="/blog" class="text-muted" style="text-decoration:none;">← Back to all posts</a>

        <header style="margin-top: 1rem;">
          <div class="row" style="gap:.5rem;">
            <span class="badge" *ngIf="post()!.categoryName">{{ post()!.categoryName }}</span>
            <span class="text-muted" style="font-size:.85rem;">{{ post()!.readTimeMinutes }} min read</span>
          </div>
          <h1>{{ post()!.title }}</h1>
          <p class="text-muted" *ngIf="post()!.subtitle">{{ post()!.subtitle }}</p>
          <div class="row" style="gap:.5rem; margin-top:.75rem;">
            <span class="text-muted" style="font-size:.9rem;">By {{ post()!.authorName }}</span>
            <span class="text-muted" style="font-size:.9rem;" *ngIf="post()!.publishedAt">· {{ post()!.publishedAt | date:'longDate' }}</span>
          </div>
        </header>

        <img *ngIf="post()!.coverImageUrl" [src]="post()!.coverImageUrl" [alt]="post()!.title"
             style="width:100%; border-radius:18px; margin: 2rem 0; aspect-ratio:16/9; object-fit:cover;" loading="lazy">

        <article class="prose" [innerHTML]="safeHtml()"></article>

        <!-- Ad slot AFTER article body, never in the middle of it -->
        <app-ad-slot slotId="blog-post-after-content" variant="footer"></app-ad-slot>
      </div>
    </section>
  `
})
export class BlogPostComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private api   = inject(ApiService);
  private seo   = inject(SeoService);
  private sanitizer = inject(DomSanitizer);

  post = signal<BlogPostDetail | null>(null);
  safeHtml = signal<SafeHtml>('');

  ngOnInit(): void {
    this.route.paramMap.subscribe(p => {
      const slug = p.get('slug');
      if (!slug) return;
      this.api.getBlogPost(slug).subscribe(post => {
        this.post.set(post);
        this.safeHtml.set(this.sanitizer.bypassSecurityTrustHtml(post.contentHtml || ''));

        this.seo.apply({
          title:       post.metaTitle ?? post.title,
          description: post.metaDesc  ?? post.excerpt ?? '',
          canonical:   post.canonicalUrl ?? `/blog/${post.slug}`,
          image:       post.ogImageUrl ?? post.coverImageUrl ?? undefined,
          type:        'article',
          publishedAt: post.publishedAt,
          author:      post.authorName
        });

        if (post.schemaJson) {
          try { this.seo.setJsonLd(JSON.parse(post.schemaJson), 'blog-post-jsonld'); } catch { /* ignore */ }
        }
      });
    });
  }
}
