import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AnalyzeResumeResponse, AtsScoreResult, BlogPostDetail, BlogPostSummary,
  CoverLetterResponse, MatchJobResponse, PagedList, SeoPageDto,
  TemplateSummary, ToolDto
} from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  // Resume / ATS
  analyzeResume(file: File, targetRole?: string): Observable<AnalyzeResumeResponse> {
    const fd = new FormData();
    fd.append('file', file);
    if (targetRole) fd.append('targetRole', targetRole);
    return this.http.post<AnalyzeResumeResponse>('/api/v1/resumes/analyze', fd);
  }

  scoreText(resumeText: string, targetRole?: string): Observable<AtsScoreResult> {
    return this.http.post<AtsScoreResult>('/api/v1/ats/score-text', { resumeText, targetRole });
  }

  // Job match
  matchJob(resumeId: string, jobDescription: string, jobTitle?: string, companyName?: string): Observable<MatchJobResponse> {
    return this.http.post<MatchJobResponse>('/api/v1/job-match/match', {
      resumeId, jobDescription, jobTitle, companyName
    });
  }

  // Blog
  listBlogPosts(page = 1, pageSize = 12, category?: string, tag?: string): Observable<PagedList<BlogPostSummary>> {
    let url = `/api/v1/blog/posts?page=${page}&pageSize=${pageSize}`;
    if (category) url += `&category=${encodeURIComponent(category)}`;
    if (tag)      url += `&tag=${encodeURIComponent(tag)}`;
    return this.http.get<PagedList<BlogPostSummary>>(url);
  }

  getBlogPost(slug: string): Observable<BlogPostDetail> {
    return this.http.get<BlogPostDetail>(`/api/v1/blog/posts/${encodeURIComponent(slug)}`);
  }

  // SEO programmatic page
  getSeoPage(urlPath: string): Observable<SeoPageDto> {
    return this.http.get<SeoPageDto>(`/api/v1/seo/page?url=${encodeURIComponent(urlPath)}`);
  }

  // Templates
  listTemplates(filters: {
    search?: string; category?: string; country?: string; level?: string;
    atsOnly?: boolean; sort?: string; page?: number; pageSize?: number;
  } = {}): Observable<PagedList<TemplateSummary>> {
    const q = new URLSearchParams({
      page:     String(filters.page     ?? 1),
      pageSize: String(filters.pageSize ?? 60),
      sort:     filters.sort ?? 'popular'
    });
    if (filters.search)   q.set('search',   filters.search);
    if (filters.category) q.set('category', filters.category);
    if (filters.country)  q.set('country',  filters.country);
    if (filters.level)    q.set('level',    filters.level);
    if (filters.atsOnly)  q.set('atsOnly',  'true');
    return this.http.get<PagedList<TemplateSummary>>(`/api/v1/templates?${q.toString()}`);
  }

  // Tools
  listTools(): Observable<ToolDto[]> {
    return this.http.get<ToolDto[]>('/api/v1/tools');
  }

  extractSkills(text: string): Observable<{ skills: any[] }> {
    return this.http.post<{ skills: any[] }>('/api/v1/tools/skill-extractor', { text });
  }

  // Cover letter
  generateCoverLetter(body: {
    resumeId?: string;
    jobTitle: string;
    companyName: string;
    tone?: string;
    jobDescription?: string;
  }): Observable<CoverLetterResponse> {
    return this.http.post<CoverLetterResponse>('/api/v1/cover-letter/generate', body);
  }

  // Analytics
  trackEvent(eventName: string, pagePath?: string, metadata?: any): Observable<void> {
    return this.http.post<void>('/api/v1/analytics/track', {
      eventName, pagePath, referrer: undefined,
      metadataJson: metadata ? JSON.stringify(metadata) : undefined
    });
  }

  // Share
  createShareLink(targetType: 'ats' | 'job_match' | 'cover_letter', targetId: string, expiresInDays = 30) {
    return this.http.post<{ shortCode: string }>('/api/v1/share', { targetType, targetId, expiresInDays });
  }
}
