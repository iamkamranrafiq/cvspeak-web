import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LogoComponent } from '../logo/logo.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, LogoComponent],
  template: `
    <footer class="footer">
      <div class="footer__inner">
        <div class="footer__brand">
          <a routerLink="/" class="footer__logo">
            <app-logo size="28"></app-logo>
            <span>CV<em>Speak</em></span>
          </a>
          <p class="footer__tag">Make your resume speak. Free AI tools to land more interviews — no signup, no catch.</p>
        </div>

        <div class="footer__cols">
          <div>
            <h4>Tools</h4>
            <a routerLink="/resume-analyzer">Resume Analyzer &amp; ATS</a>
            <a routerLink="/resume-localizer">Resume Localizer</a>
            <a routerLink="/job-match">Job Match</a>
            <a routerLink="/cover-letter">Cover Letter</a>
            <a routerLink="/resume-builder">Resume Builder</a>
          </div>
          <div>
            <h4>Resources</h4>
            <a routerLink="/templates">Templates</a>
            <a routerLink="/blog">Blog</a>
            <a routerLink="/tools">All Tools</a>
            <a routerLink="/resume-examples/software-engineer">Resume Examples</a>
            <a routerLink="/interview-questions/dotnet">Interview Questions</a>
          </div>
          <div>
            <h4>Company</h4>
            <a routerLink="/about">About</a>
            <a routerLink="/privacy">Privacy</a>
            <a routerLink="/terms">Terms</a>
            <a routerLink="/contact">Contact</a>
          </div>
        </div>
      </div>

      <div class="footer__bottom">
        © {{ year }} CVSpeak. All resume analysis is private — files are deleted automatically.
      </div>
    </footer>
  `,
  styles: [`
    .footer { background: var(--surface-1); border-top: 1px solid var(--border-soft); margin-top: 4rem; }
    .footer__inner { max-width: 1200px; margin: 0 auto; padding: 3rem 1.25rem 1.5rem; display: grid; grid-template-columns: 1.4fr 2fr; gap: 3rem; }
    .footer__brand { display: flex; flex-direction: column; gap: .9rem; }
    .footer__logo { display: flex; align-items: center; gap: .5rem; text-decoration: none; color: var(--text); font-weight: 800; font-size: 1.1rem; em { color: var(--brand-500); font-style: normal; } }
    .footer__tag { color: var(--text-muted); max-width: 320px; line-height: 1.6; }
    .footer__cols { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
    .footer__cols h4 { font-size: .8rem; text-transform: uppercase; letter-spacing: .08em; color: var(--text-muted); margin: 0 0 .8rem; font-weight: 700; }
    .footer__cols a { display: block; color: var(--text); text-decoration: none; padding: .25rem 0; font-size: .92rem; &:hover { color: var(--brand-500); } }
    .footer__bottom { max-width: 1200px; margin: 0 auto; padding: 1rem 1.25rem 2rem; color: var(--text-muted); font-size: .85rem; border-top: 1px solid var(--border-soft); }
    @media (max-width: 880px) { .footer__inner { grid-template-columns: 1fr; gap: 2rem; } .footer__cols { grid-template-columns: repeat(2, 1fr); } }
  `]
})
export class FooterComponent {
  year = new Date().getFullYear();
}
