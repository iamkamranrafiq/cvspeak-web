export interface AtsScoreResult {
  overallScore: number;
  formatScore: number;
  keywordScore: number;
  readabilityScore: number;
  grammarScore: number;
  structureScore: number;
  contactInfoPresent: boolean;
  hasSummary: boolean;
  hasExperience: boolean;
  hasEducation: boolean;
  hasSkills: boolean;
  issues:        { severity: 'low' | 'medium' | 'high'; code: string; message: string }[];
  suggestions:   { priority: 'low' | 'medium' | 'high'; title: string; detail: string }[];
  keywordsFound:   string[];
  keywordsMissing: string[];
}

export interface ExtractedSkill {
  skill: string;
  confidence: number;
  occurrences: number;
  category?: string;
}

export interface ResumeSection {
  type: string;
  order: number;
  title?: string;
  content?: string;
}

export interface AnalyzeResumeResponse {
  sessionToken: string;
  resumeId: string;
  atsAnalysisId: string;
  score: AtsScoreResult;
  parsed: {
    wordCount: number;
    charCount: number;
    sections: ResumeSection[];
    skills: ExtractedSkill[];
  };
}

export interface JobMatchResult {
  matchPercentage: number;
  jobKeywords: string[];
  matchedSkills: string[];
  missingSkills: string[];
  improvementTips: string[];
}

export interface MatchJobResponse { id: string; match: JobMatchResult; }

export interface BlogPostSummary {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  coverImageUrl?: string;
  authorName: string;
  tags: string[];
  readTimeMinutes?: number;
  viewCount: number;
  isFeatured: boolean;
  publishedAt?: string;
}

export interface BlogPostDetail extends BlogPostSummary {
  subtitle?: string;
  contentHtml: string;
  contentMarkdown: string;
  authorAvatarUrl?: string;
  wordCount?: number;
  metaTitle?: string;
  metaDesc?: string;
  canonicalUrl?: string;
  ogImageUrl?: string;
  schemaJson?: string;
  faqJson?: string;
  categorySlug?: string;
  categoryName?: string;
}

export interface PagedList<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface SeoPageDto {
  id: string;
  pageType: string;
  entitySlug: string;
  urlPath: string;
  title: string;
  h1: string;
  metaTitle: string;
  metaDesc: string;
  introHtml?: string;
  bodyHtml: string;
  faqJson: string;
  keywordsJson: string;
  relatedPages: string;
  schemaJson?: string;
  viewCount: number;
  updatedAt: string;
}

export interface ToolDto {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon?: string;
  urlPath: string;
  category: string;
  isFeatured: boolean;
  useCount: number;
}

export interface ColorPalette {
  name?:    string;
  primary?: string;
  accent?:  string;
  surface?: string;
  ink?:     string;
}
export interface Typography { heading?: string; body?: string; }

export interface TemplateSummary {
  id: string;
  slug: string;
  name: string;
  description?: string;
  category: string;
  roleTarget?: string;
  countryCode?: string;
  previewUrl?: string;
  atsFriendly: boolean;
  isPremium: boolean;
  downloadCount: number;
  experienceLevel?: string;
  industries: string[];
  palette: ColorPalette;
  typography: Typography;
  popularity: number;
  tags: string[];
  recommendedFor: string[];
  layoutType?: string;
  sections: string[];
  supportedLanguages: string[];
  featured: boolean;
  trending: boolean;
}

export interface CoverLetterResponse {
  id: string;
  sessionToken: string;
  content: string;
  wordCount: number;
}
