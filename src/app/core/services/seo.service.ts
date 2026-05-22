import { DOCUMENT } from '@angular/common';
import { Injectable, Renderer2, RendererFactory2, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from '@env/environment';

export interface SeoConfig {
  title:        string;
  description:  string;
  canonical?:   string;       // path or absolute url
  image?:       string;
  type?:        'website' | 'article';
  publishedAt?: string;
  modifiedAt?:  string;
  author?:      string;
  keywords?:    string[];
  noIndex?:     boolean;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private title = inject(Title);
  private meta  = inject(Meta);
  private doc   = inject(DOCUMENT);
  private renderer: Renderer2;

  constructor(rf: RendererFactory2) {
    this.renderer = rf.createRenderer(null, null);
  }

  apply(c: SeoConfig): void {
    this.title.setTitle(c.title);

    const url   = this.absoluteUrl(c.canonical ?? this.doc.location?.pathname ?? '/');
    const image = c.image ?? `${environment.siteUrl}/assets/og-default.png`;

    this.setTag('description', c.description);
    if (c.keywords?.length) this.setTag('keywords', c.keywords.join(', '));
    if (c.noIndex) this.setTag('robots', 'noindex,nofollow');
    else           this.setTag('robots', 'index,follow,max-snippet:-1,max-image-preview:large');

    // OpenGraph
    this.setProp('og:title', c.title);
    this.setProp('og:description', c.description);
    this.setProp('og:url', url);
    this.setProp('og:image', image);
    this.setProp('og:type', c.type ?? 'website');
    this.setProp('og:site_name', 'CVSpeak');

    if (c.type === 'article') {
      if (c.publishedAt) this.setProp('article:published_time', c.publishedAt);
      if (c.modifiedAt)  this.setProp('article:modified_time',  c.modifiedAt);
      if (c.author)      this.setProp('article:author',         c.author);
    }

    // Twitter
    this.setTag('twitter:card', 'summary_large_image');
    this.setTag('twitter:title', c.title);
    this.setTag('twitter:description', c.description);
    this.setTag('twitter:image', image);

    // Canonical
    this.setCanonical(url);
  }

  setJsonLd(json: unknown, id = 'app-jsonld'): void {
    const head = this.doc.head;
    let script = this.doc.getElementById(id) as HTMLScriptElement | null;
    if (!script) {
      script = this.renderer.createElement('script') as HTMLScriptElement;
      script.id   = id;
      script.type = 'application/ld+json';
      this.renderer.appendChild(head, script);
    }
    script.text = typeof json === 'string' ? json : JSON.stringify(json);
  }

  private setTag(name: string, content: string): void {
    if (this.meta.getTag(`name='${name}'`)) {
      this.meta.updateTag({ name, content });
    } else {
      this.meta.addTag({ name, content });
    }
  }

  private setProp(property: string, content: string): void {
    if (this.meta.getTag(`property='${property}'`)) {
      this.meta.updateTag({ property, content });
    } else {
      this.meta.addTag({ property, content });
    }
  }

  private setCanonical(url: string): void {
    let link = this.doc.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
    if (!link) {
      link = this.renderer.createElement('link');
      link!.setAttribute('rel', 'canonical');
      this.renderer.appendChild(this.doc.head, link);
    }
    link!.setAttribute('href', url);
  }

  private absoluteUrl(pathOrUrl: string): string {
    if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
    return environment.siteUrl.replace(/\/$/, '') + (pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`);
  }
}
