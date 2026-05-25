import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LogoComponent } from '../logo/logo.component';
import { ThemeService } from '@core/services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LogoComponent],
  template: `
    <header class="nav">
      <div class="nav__container">
        <a routerLink="/" class="nav__brand" aria-label="CVSpeak home">
          <app-logo size="32" [animated]="true"></app-logo>
          <span class="nav__brand-text">CV<em>Speak</em></span>
        </a>

        <nav class="nav__links" aria-label="Primary">
          <a routerLink="/resume-analyzer" routerLinkActive="is-active">Resume Analyzer</a>
          <a routerLink="/ats-checker"     routerLinkActive="is-active">ATS Checker</a>
          <a routerLink="/job-match"       routerLinkActive="is-active">Job Match</a>
          <a routerLink="/templates"       routerLinkActive="is-active">Templates</a>
          <a routerLink="/tools"           routerLinkActive="is-active">Tools</a>
          <a routerLink="/blog"            routerLinkActive="is-active">Blog</a>
        </nav>

        <div class="nav__actions">
          <button class="nav__theme" type="button" (click)="theme.toggle()" [attr.aria-label]="'Toggle theme, currently ' + theme.theme()">
            <span *ngIf="theme.theme() === 'light'">🌙</span>
            <span *ngIf="theme.theme() === 'dark'">☀️</span>
          </button>
          <a routerLink="/resume-analyzer" class="btn btn--primary nav__cta">Analyze Resume</a>
        </div>
      </div>
    </header>
  `,
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  theme = inject(ThemeService);
}
