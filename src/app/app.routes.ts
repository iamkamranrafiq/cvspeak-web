import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
    title: 'CVSpeak — AI Resume Analyzer, ATS Checker & Free Career Tools'
  },
  {
    path: 'resume-analyzer',
    loadComponent: () => import('./features/resume-analyzer/resume-analyzer.component').then(m => m.ResumeAnalyzerComponent),
    title: 'AI Resume Analyzer — Free Instant Feedback | CVSpeak'
  },
  {
    path: 'ats-checker',
    loadComponent: () => import('./features/ats-checker/ats-checker.component').then(m => m.AtsCheckerComponent),
    title: 'Free ATS Resume Checker — Beat the Bots | CVSpeak'
  },
  {
    path: 'job-match',
    loadComponent: () => import('./features/job-match/job-match.component').then(m => m.JobMatchComponent),
    title: 'Resume vs Job Description Match Tool | CVSpeak'
  },
  {
    path: 'resume-builder',
    loadComponent: () => import('./features/resume-builder/resume-builder.component').then(m => m.ResumeBuilderComponent),
    title: 'Free Resume Builder — ATS-Friendly Templates | CVSpeak'
  },
  {
    path: 'templates',
    loadComponent: () => import('./features/templates/templates.component').then(m => m.TemplatesComponent),
    title: 'Free Resume Templates — ATS-Friendly | CVSpeak'
  },
  {
    path: 'cover-letter',
    loadComponent: () => import('./features/cover-letter/cover-letter.component').then(m => m.CoverLetterComponent),
    title: 'AI Cover Letter Generator — Free | CVSpeak'
  },
  {
    path: 'tools',
    loadComponent: () => import('./features/tools/tools.component').then(m => m.ToolsComponent),
    title: 'Free Resume & Career Tools | CVSpeak'
  },
  {
    path: 'blog',
    loadComponent: () => import('./features/blog/blog-list.component').then(m => m.BlogListComponent),
    title: 'Resume Tips, ATS Guides & Career Blog | CVSpeak'
  },
  {
    path: 'blog/:slug',
    loadComponent: () => import('./features/blog/blog-post.component').then(m => m.BlogPostComponent)
  },

  // Programmatic SEO routes — content is fetched from the API by url path
  {
    path: 'resume-examples/:slug',
    loadComponent: () => import('./features/seo-pages/seo-page.component').then(m => m.SeoPageComponent),
    data: { pageType: 'resume_example' }
  },
  {
    path: 'resume-skills/:slug',
    loadComponent: () => import('./features/seo-pages/seo-page.component').then(m => m.SeoPageComponent),
    data: { pageType: 'skill' }
  },
  {
    path: 'interview-questions/:slug',
    loadComponent: () => import('./features/seo-pages/seo-page.component').then(m => m.SeoPageComponent),
    data: { pageType: 'interview' }
  },
  {
    path: 'ats-keywords/:slug',
    loadComponent: () => import('./features/seo-pages/seo-page.component').then(m => m.SeoPageComponent),
    data: { pageType: 'ats_keywords' }
  },

  {
    path: '**',
    loadComponent: () => import('./shared/components/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: '404 — Page Not Found | CVSpeak'
  }
];
