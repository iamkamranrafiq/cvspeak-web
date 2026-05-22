import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { SeoService } from '@core/services/seo.service';
import { ToolDto } from '@core/models/api.models';
import { AdSlotComponent } from '@shared/components/ad-slot/ad-slot.component';
import { environment } from '@env/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, AdSlotComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private api = inject(ApiService);
  private seo = inject(SeoService);

  tools = signal<ToolDto[]>([]);

  testimonials = [
    { text: 'Got 3 interview calls in a week after using the ATS Checker. The keyword gaps it found were exactly what was missing.', name: 'Sara K.', role: 'Frontend Engineer' },
    { text: 'The job-match tool saved me hours. Now I tailor my resume in 5 minutes instead of an hour.', name: 'Daniel P.', role: 'Product Manager' },
    { text: 'Free, fast, no signup. The score breakdown actually told me what to fix, not just a number.', name: 'Aisha R.', role: 'Data Scientist' }
  ];

  faqs = [
    { q: 'Is CVSpeak really free?', a: 'Yes — every tool on this site is free to use with no signup. We monetise through optional, non-intrusive sponsored content in the sidebar.' },
    { q: 'Do you store my resume?', a: 'Only temporarily. Uploaded files are auto-deleted after 30 days, and you can delete them sooner from your browser. No login means no permanent profile.' },
    { q: 'How accurate is the ATS score?', a: 'Our score combines six signals — format, keywords, readability, grammar, structure, contact info — using rules derived from common Applicant Tracking Systems. It will not be 100% identical to any single ATS but it reliably catches the issues those systems flag.' },
    { q: 'Can I use this for any role or country?', a: 'Yes. Pick a role hint for sharper keyword scoring, and choose from country-specific templates when you build a new resume.' }
  ];

  ngOnInit(): void {
    this.seo.apply({
      title:       'CVSpeak — AI Resume Analyzer, ATS Checker & Free Career Tools',
      description: 'Free AI-powered resume analyzer, ATS checker, job matcher, and career tools. No signup. Built for job seekers who want results.',
      canonical:   '/'
    });

    this.seo.setJsonLd({
      '@context': 'https://schema.org',
      '@type':    'FAQPage',
      mainEntity: this.faqs.map(f => ({
        '@type': 'Question',
        name:  f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a }
      }))
    });

    this.api.listTools().subscribe(t => this.tools.set(t));
  }

  trackTool = (_: number, t: ToolDto) => t.slug;
}
