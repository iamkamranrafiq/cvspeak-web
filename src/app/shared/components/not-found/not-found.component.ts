import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="nf">
      <div class="nf__inner">
        <div class="nf__code">404</div>
        <h1>Page not found</h1>
        <p>The page you're looking for doesn't exist or has moved.</p>
        <a routerLink="/" class="btn btn--primary">Back to home</a>
      </div>
    </section>
  `,
  styles: [`
    .nf       { min-height: 60vh; display: flex; align-items: center; justify-content: center; padding: 4rem 1rem; }
    .nf__inner{ text-align: center; max-width: 480px; }
    .nf__code { font-size: 5rem; font-weight: 900; color: var(--brand-500); letter-spacing: -.04em; }
    h1        { margin: .5rem 0; }
    p         { color: var(--text-muted); margin-bottom: 1.5rem; }
  `]
})
export class NotFoundComponent {}
