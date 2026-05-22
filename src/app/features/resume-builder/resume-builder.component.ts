import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SeoService } from '@core/services/seo.service';

interface ExperienceItem { role: string; company: string; from: string; to: string; bullets: string; }
interface EducationItem  { degree: string; school: string; year: string; }

@Component({
  selector: 'app-resume-builder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="section">
      <div class="container">
        <header class="text-center" style="margin-bottom: 2rem;">
          <div class="badge">Free • Live preview</div>
          <h1>Resume Builder</h1>
          <p class="text-muted">Type on the left, preview on the right. Print to PDF when you're done.</p>
        </header>

        <div class="builder">
          <!-- FORM -->
          <div class="builder__form card" style="padding: 1.5rem;">
            <h3>Contact</h3>
            <div class="grid grid-2">
              <input class="input" placeholder="Full name"        [(ngModel)]="name">
              <input class="input" placeholder="Title (optional)" [(ngModel)]="title">
              <input class="input" placeholder="Email"            [(ngModel)]="email">
              <input class="input" placeholder="Phone"            [(ngModel)]="phone">
              <input class="input" placeholder="Location"         [(ngModel)]="location">
              <input class="input" placeholder="linkedin.com/in/…" [(ngModel)]="linkedin">
            </div>

            <h3 style="margin-top: 1.5rem;">Summary</h3>
            <textarea class="textarea" rows="4" [(ngModel)]="summary" placeholder="2-4 lines about who you are and what you do."></textarea>

            <h3 style="margin-top: 1.5rem;">Experience</h3>
            <div *ngFor="let e of experience(); let i = index" class="card" style="padding: 1rem; margin-bottom: .75rem;">
              <div class="grid grid-2">
                <input class="input" placeholder="Role"    [(ngModel)]="e.role">
                <input class="input" placeholder="Company" [(ngModel)]="e.company">
                <input class="input" placeholder="From (e.g. Jan 2022)" [(ngModel)]="e.from">
                <input class="input" placeholder="To (e.g. Present)"    [(ngModel)]="e.to">
              </div>
              <textarea class="textarea" rows="4" style="margin-top:.5rem;" placeholder="One achievement per line" [(ngModel)]="e.bullets"></textarea>
              <button class="btn btn--ghost" style="margin-top:.5rem;" (click)="removeExperience(i)">Remove</button>
            </div>
            <button class="btn btn--ghost" (click)="addExperience()">+ Add role</button>

            <h3 style="margin-top: 1.5rem;">Education</h3>
            <div *ngFor="let ed of education(); let i = index" class="card" style="padding: 1rem; margin-bottom:.75rem;">
              <div class="grid grid-2">
                <input class="input" placeholder="Degree" [(ngModel)]="ed.degree">
                <input class="input" placeholder="School" [(ngModel)]="ed.school">
                <input class="input" placeholder="Year"   [(ngModel)]="ed.year">
              </div>
              <button class="btn btn--ghost" style="margin-top:.5rem;" (click)="removeEducation(i)">Remove</button>
            </div>
            <button class="btn btn--ghost" (click)="addEducation()">+ Add degree</button>

            <h3 style="margin-top: 1.5rem;">Skills</h3>
            <textarea class="textarea" rows="3" [(ngModel)]="skills" placeholder="Comma-separated: TypeScript, Angular, RxJS, …"></textarea>

            <div class="row" style="margin-top: 1.5rem;">
              <button class="btn btn--primary" (click)="print()">Download as PDF</button>
            </div>
          </div>

          <!-- PREVIEW -->
          <div class="builder__preview" id="preview">
            <div class="resume-page">
              <header class="resume-header">
                <h1>{{ name || 'Your Name' }}</h1>
                <p class="resume-header__title">{{ title }}</p>
                <p class="resume-header__contact">
                  <span *ngIf="email">{{ email }}</span>
                  <span *ngIf="phone"> · {{ phone }}</span>
                  <span *ngIf="location"> · {{ location }}</span>
                  <span *ngIf="linkedin"> · {{ linkedin }}</span>
                </p>
              </header>

              <section *ngIf="summary">
                <h2>Summary</h2>
                <p>{{ summary }}</p>
              </section>

              <section *ngIf="experience().length">
                <h2>Experience</h2>
                <div *ngFor="let e of experience()" class="resume-item">
                  <div class="resume-item__top">
                    <strong>{{ e.role }}</strong>
                    <span class="text-muted">{{ e.from }} – {{ e.to }}</span>
                  </div>
                  <div class="text-muted">{{ e.company }}</div>
                  <ul>
                    <li *ngFor="let b of (e.bullets || '').split('\\n')">{{ b }}</li>
                  </ul>
                </div>
              </section>

              <section *ngIf="education().length">
                <h2>Education</h2>
                <div *ngFor="let ed of education()" class="resume-item">
                  <div class="resume-item__top">
                    <strong>{{ ed.degree }}</strong>
                    <span class="text-muted">{{ ed.year }}</span>
                  </div>
                  <div class="text-muted">{{ ed.school }}</div>
                </div>
              </section>

              <section *ngIf="skills">
                <h2>Skills</h2>
                <p>{{ skills }}</p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrl: './resume-builder.component.scss'
})
export class ResumeBuilderComponent implements OnInit {
  private seo = inject(SeoService);

  name = ''; title = ''; email = ''; phone = ''; location = ''; linkedin = '';
  summary = ''; skills = '';
  experience = signal<ExperienceItem[]>([{ role: '', company: '', from: '', to: '', bullets: '' }]);
  education  = signal<EducationItem[]>([{ degree: '', school: '', year: '' }]);

  ngOnInit(): void {
    this.seo.apply({
      title:       'Free Resume Builder — ATS-Friendly Templates | CVSpeak',
      description: 'Build an ATS-friendly resume step by step with a live preview. Free, no signup. Export as PDF.',
      canonical:   '/resume-builder'
    });
  }

  addExperience(): void  { this.experience.update(a => [...a, { role: '', company: '', from: '', to: '', bullets: '' }]); }
  removeExperience(i: number): void { this.experience.update(a => a.filter((_, idx) => idx !== i)); }
  addEducation(): void   { this.education.update(a => [...a, { degree: '', school: '', year: '' }]); }
  removeEducation(i: number): void { this.education.update(a => a.filter((_, idx) => idx !== i)); }

  print(): void { window.print(); }
}
