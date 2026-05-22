import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { SeoService } from '@core/services/seo.service';
import { AnalyzeResumeResponse } from '@core/models/api.models';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { ScoreRingComponent } from '@shared/components/score-ring/score-ring.component';
import { AdSlotComponent } from '@shared/components/ad-slot/ad-slot.component';

@Component({
  selector: 'app-resume-analyzer',
  standalone: true,
  imports: [CommonModule, FormsModule, FileUploadComponent, ScoreRingComponent, AdSlotComponent],
  templateUrl: './resume-analyzer.component.html',
  styleUrl: './resume-analyzer.component.scss'
})
export class ResumeAnalyzerComponent implements OnInit {
  private api = inject(ApiService);
  private seo = inject(SeoService);

  file = signal<File | null>(null);
  targetRole = signal<string>('');
  loading = signal(false);
  error   = signal<string | null>(null);
  result  = signal<AnalyzeResumeResponse | null>(null);

  hasResult = computed(() => !!this.result());

  roles = [
    { slug: '',                     label: 'No specific role (general check)' },
    { slug: 'software-engineer',    label: 'Software Engineer' },
    { slug: 'frontend-developer',   label: 'Frontend Developer' },
    { slug: 'backend-developer',    label: 'Backend Developer' },
    { slug: 'fullstack-developer',  label: 'Full Stack Developer' },
    { slug: 'data-scientist',       label: 'Data Scientist' },
    { slug: 'devops-engineer',      label: 'DevOps Engineer' },
    { slug: 'angular-developer',    label: 'Angular Developer' },
    { slug: 'dotnet-developer',     label: '.NET Developer' },
    { slug: 'product-manager',      label: 'Product Manager' },
    { slug: 'ux-designer',          label: 'UX Designer' }
  ];

  ngOnInit(): void {
    this.seo.apply({
      title:       'AI Resume Analyzer — Free Instant Feedback | CVSpeak',
      description: 'Upload your resume and get an instant AI analysis: ATS score, keyword gaps, grammar, readability, and improvement tips. Free. No signup.',
      canonical:   '/resume-analyzer'
    });
  }

  onFile(f: File): void {
    this.file.set(f);
    this.error.set(null);
  }

  analyze(): void {
    const f = this.file();
    if (!f) { this.error.set('Please choose a file first.'); return; }
    this.loading.set(true);
    this.error.set(null);

    this.api.analyzeResume(f, this.targetRole() || undefined).subscribe({
      next: (res) => { this.result.set(res); this.loading.set(false); window.scrollTo({ top: 0, behavior: 'smooth' }); },
      error: (e) => {
        this.error.set(e?.error?.error ?? 'Something went wrong. Please try again.');
        this.loading.set(false);
      }
    });
  }

  reset(): void {
    this.file.set(null);
    this.result.set(null);
    this.error.set(null);
  }
}
