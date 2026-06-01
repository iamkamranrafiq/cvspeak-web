/**
 * Realistic sample resume content per category. Powers the live preview
 * thumbnails on the templates page so every card looks like a real CV.
 *
 * Each sample is engineered to *demonstrate* the template — punchy
 * impact-driven bullets, concrete numbers, name-brand companies, top
 * universities — so a casual visitor sees instantly what the template
 * looks like with real, attractive content.
 */
export interface ExperienceEntry {
  role: string;
  company: string;
  dates: string;
  bullets: string[];
}
export interface EducationEntry {
  degree: string;
  school: string;
  dates: string;
  detail?: string;
}
export interface SampleResume {
  fullName: string;
  title: string;
  summary: string;
  skills: string;
  experience: ExperienceEntry[];
  education: EducationEntry;
  /** Optional contact overrides. When provided (e.g. by the Resume Builder),
   *  the preview uses these instead of the generated example contact strings. */
  email?:    string;
  phone?:    string;
  location?: string;
  linkedin?: string;
}

// ----- Default / "Silicon-style" software engineer -----
const DEFAULT_SE: SampleResume = {
  fullName: 'Alex Morgan',
  title:    'Senior Software Engineer',
  summary:  'Senior engineer with 8 years building distributed systems that serve 40M+ daily users. Shipped the platform behind $180M ARR; led the migration that cut infra spend 31%.',
  skills:   'TypeScript · Go · Rust · React · PostgreSQL · Kubernetes · AWS · gRPC · Kafka · Terraform · System design',
  experience: [
    { role: 'Senior Software Engineer', company: 'Stripe', dates: '2022 — Present',
      bullets: [
        'Owned the billing reconciliation pipeline processing $2.4B / quarter with 99.997% accuracy.',
        'Cut p95 latency 42% by replacing chatty REST with a typed RPC gateway and read-replica routing.',
        'Mentored 5 engineers; two promoted to Senior within 14 months.'
      ] },
    { role: 'Software Engineer', company: 'Airbnb', dates: '2019 — 2022',
      bullets: [
        'Designed the event-sourced inventory service powering 7M live listings.',
        'Led the monolith → 14 services migration with zero customer-facing downtime.'
      ] }
  ],
  education: { degree: 'B.S. Computer Science', school: 'Carnegie Mellon University', dates: '2015 — 2019', detail: 'GPA 3.9 · Dean’s List' }
};

export const SAMPLE_RESUMES: Record<string, SampleResume> = {
  'software-engineer':  DEFAULT_SE,

  'frontend-developer': {
    fullName: 'Maya Patel', title: 'Senior Frontend Engineer',
    summary:  'Frontend specialist obsessed with perceived performance. Shipped 4 design systems used by 200+ engineers and reduced TTI 38% across the consumer surface.',
    skills:   'React · TypeScript · Next.js · Tailwind · Storybook · Web Vitals · a11y · Framer Motion · Figma',
    experience: [
      { role: 'Senior Frontend Engineer', company: 'Shopify', dates: '2022 — Present',
        bullets: [
          'Led the design-system rewrite adopted by 18 product teams; cut UI bug volume 54%.',
          'Drove a 38% TTI improvement on the storefront serving 600K req/min.',
          'Built the a11y test harness that lifted Lighthouse a11y from 71 → 98.'
        ] },
      { role: 'Frontend Engineer', company: 'Notion', dates: '2019 — 2022',
        bullets: [
          'Shipped the new block editor used by 35M+ users.',
          'Reduced bundle size 41% with route-level code splitting.'
        ] }
    ],
    education: { degree: 'B.S. Computer Science', school: 'University of Waterloo', dates: '2015 — 2019' }
  },

  'backend-developer': {
    fullName: 'Daniel Wright', title: 'Senior Backend Engineer',
    summary:  'Backend engineer with deep expertise in data-intensive APIs. Built systems handling 250K writes/sec at peak. Comfortable from query planner internals to service mesh config.',
    skills:   'Go · Rust · PostgreSQL · Redis · gRPC · Kafka · Terraform · OpenTelemetry · Linux internals',
    experience: [
      { role: 'Senior Backend Engineer', company: 'Datadog', dates: '2021 — Present',
        bullets: [
          'Owned the ingestion pipeline accepting 8.4M events/sec across 12 regions.',
          'Cut cold-start ingest latency from 380ms → 90ms via custom Go runtime tuning.',
          'Authored the platform SDK now used by 240+ internal services.'
        ] },
      { role: 'Backend Engineer', company: 'Coinbase', dates: '2018 — 2021',
        bullets: [
          'Designed the order-matching engine processing $42M / day with <5ms p99.'
        ] }
    ],
    education: { degree: 'M.S. Computer Science', school: 'Georgia Tech', dates: '2016 — 2018' }
  },

  'fullstack-developer': { ...DEFAULT_SE, fullName: 'Jordan Reyes', title: 'Full Stack Engineer' },

  'devops-engineer': {
    fullName: 'Klaus Weber', title: 'Senior DevOps Engineer',
    summary:  'Platform engineer with deep Kubernetes + AWS expertise. Cut deploy times 80% across 12 teams. Owned the migration to multi-region active-active.',
    skills:   'Kubernetes · Terraform · AWS · GCP · Helm · ArgoCD · Prometheus · Grafana · Istio · Vault',
    experience: [
      { role: 'Senior DevOps Engineer', company: 'Spotify', dates: '2021 — Present',
        bullets: [
          'Migrated 340 services to active-active across 3 regions; achieved 99.99% SLO.',
          'Cut average deploy time from 22 min → 4 min via parallelised pipelines.',
          'Saved €1.8M/yr by rightsizing 4,200 K8s workloads with VPA + custom recommender.'
        ] },
      { role: 'Site Reliability Engineer', company: 'Klarna', dates: '2018 — 2021',
        bullets: ['Built the chaos-engineering platform now mandatory for tier-1 services.'] }
    ],
    education: { degree: 'M.Sc. Distributed Systems', school: 'TU Munich', dates: '2015 — 2017' }
  },

  'cloud-architect': {
    fullName: 'Anita Desai', title: 'Senior Cloud Solutions Architect',
    summary:  'Multi-cloud architect designing FinServ-grade landing zones. Saved $4.2M on AWS over 18 months and led 9 enterprise cloud migrations end-to-end.',
    skills:   'AWS · Azure · GCP · Landing zones · Terraform · FinOps · IAM · Well-Architected · Cost optimisation',
    experience: [
      { role: 'Cloud Solutions Architect', company: 'Goldman Sachs', dates: '2020 — Present',
        bullets: [
          'Architected the regulated-workload landing zone for 1,800+ services across 18 BUs.',
          'Saved $4.2M/yr through Reserved Instance optimisation and S3 Intelligent Tiering rollout.',
          'Led the multi-region DR exercise covering $40B+ trade volume daily.'
        ] }
    ],
    education: { degree: 'M.B.A.', school: 'INSEAD', dates: '2017 — 2019' }
  },

  'data-scientist': {
    fullName: 'Priya Iyer', title: 'Senior Data Scientist',
    summary:  'Data scientist with 7 years applying ML to marketplace & growth problems. Lifted ad CTR 22% via causal uplift modelling; built the search-ranking model behind $180M GMV.',
    skills:   'Python · PyTorch · TensorFlow · SQL · dbt · Causal inference · Bayesian models · MLflow · Spark · Airflow',
    experience: [
      { role: 'Senior Data Scientist', company: 'Uber', dates: '2021 — Present',
        bullets: [
          'Built the surge-pricing causal model live in 38 cities; lifted gross bookings 8.4%.',
          'Productionised the first uplift-based ad-pricing system; $24M incremental revenue first year.',
          'Authored 3 patents on counterfactual evaluation methods.'
        ] },
      { role: 'Data Scientist', company: 'Allianz', dates: '2018 — 2021',
        bullets: ['Reduced claims-fraud false positives 41% with gradient-boosted churn models.'] }
    ],
    education: { degree: 'M.Sc. Statistics', school: 'University of Edinburgh', dates: '2016 — 2018', detail: 'First Class Honours' }
  },

  'ai-engineer': {
    fullName: 'Mateo Ribeiro', title: 'Senior AI / ML Engineer',
    summary:  'Applied ML engineer shipping LLM-powered products at scale. Built the RAG stack powering a 4M-user assistant serving 12M queries/day at p95 < 600ms.',
    skills:   'PyTorch · Transformers · LangChain · vLLM · Vector DBs · CUDA · Triton · MLOps · RLHF',
    experience: [
      { role: 'Senior ML Engineer', company: 'Anthropic', dates: '2023 — Present',
        bullets: [
          'Owned the inference stack serving 12M queries/day at p95 < 600ms across 8 model variants.',
          'Cut GPU costs 38% by introducing speculative decoding + adaptive batching.',
          'Co-authored a published paper on long-context retrieval evaluation.'
        ] },
      { role: 'ML Engineer', company: 'Hugging Face', dates: '2020 — 2023',
        bullets: ['Shipped Optimum for ONNX/Triton; adopted by 8,000+ open-source projects.'] }
    ],
    education: { degree: 'M.Sc. Machine Learning', school: 'ETH Zürich', dates: '2018 — 2020' }
  },

  'cybersecurity': {
    fullName: 'Dana Levi', title: 'Senior Security Engineer',
    summary:  'Offensive-minded security engineer covering AppSec + cloud. Reduced critical CVEs 73% across 22 services. CTF national finalist 2021.',
    skills:   'Threat modelling · SAST/DAST · AWS security · Burp Suite · OWASP · Detection eng · Incident response · Zero Trust',
    experience: [
      { role: 'Senior Security Engineer', company: 'Cloudflare', dates: '2022 — Present',
        bullets: [
          'Built the auto-triage detection pipeline cutting MTTD from 4.2h → 18min.',
          'Reduced critical CVE backlog 73% across 22 customer-facing services.',
          'Led the response to a state-sponsored intrusion attempt with zero customer impact.'
        ] }
    ],
    education: { degree: 'B.S. Computer Engineering', school: 'Technion — Israel Institute of Technology', dates: '2014 — 2018' }
  },

  'mobile-developer': {
    fullName: 'Yuki Tanaka', title: 'Senior Mobile Engineer',
    summary:  'iOS + Android engineer who ships polished consumer apps. Two apps in App Store top 10. Apple Design Award nominee 2023.',
    skills:   'Swift · Kotlin · SwiftUI · Jetpack Compose · Firebase · GraphQL · Mobile CI · a11y · Combine · Coroutines',
    experience: [
      { role: 'Senior iOS Engineer', company: 'Headspace', dates: '2022 — Present',
        bullets: [
          'Rebuilt the home tab in SwiftUI; lifted DAU/MAU 11% within two release cycles.',
          'Cut app cold-start time 47% on iPhone SE class devices.',
          'Apple Design Award nominee 2023.'
        ] }
    ],
    education: { degree: 'B.Eng. Software Engineering', school: 'University of Tokyo', dates: '2015 — 2019' }
  },

  'game-developer': {
    fullName: 'Lukas Becker', title: 'Senior Gameplay Programmer',
    summary:  'Gameplay programmer shipping AAA titles. Wrote the multiplayer netcode for a 4M-CCU launch; tools used by 80+ designers.',
    skills:   'C++ · Unreal Engine 5 · Unity · Networking · ECS · Profiling · HLSL · Performance · Animation systems',
    experience: [
      { role: 'Senior Gameplay Programmer', company: 'CD Projekt Red', dates: '2021 — Present',
        bullets: [
          'Owned the multiplayer netcode for a 4M-CCU launch; <80ms p95 across 4 regions.',
          'Cut frame-time on PS5 from 19ms → 12ms in the open-world hub.',
          'Built tools adopted by 80+ designers; replaced 12 legacy editors.'
        ] }
    ],
    education: { degree: 'M.Sc. Computer Graphics', school: 'TU Vienna', dates: '2016 — 2018' }
  },

  // ----- DESIGN -----
  'ui-ux-designer': {
    fullName: 'Sofia Marchetti', title: 'Senior Product Designer',
    summary:  'Product designer obsessed with reducing cognitive load. I ship interfaces measured in retention, not impressions. Led the redesign that lifted activation 31%.',
    skills:   'Figma · Framer · Prototyping · Design systems · Motion · User research · Service design · Copywriting',
    experience: [
      { role: 'Senior Product Designer', company: 'Linear', dates: '2022 — Present',
        bullets: [
          'Led the onboarding redesign that lifted activation 31% across 14K new teams.',
          'Built the cross-platform design system now used by 90+ engineers.',
          'Wrote the design principles doc adopted org-wide; cited in 4 industry talks.'
        ] },
      { role: 'Product Designer', company: 'Figma', dates: '2019 — 2022',
        bullets: ['Designed the FigJam canvas used by 2M+ weekly users.'] }
    ],
    education: { degree: 'M.A. Interaction Design', school: 'Politecnico di Milano', dates: '2017 — 2019' }
  },

  'graphic-designer': {
    fullName: 'Camille Laurent', title: 'Senior Graphic Designer',
    summary:  'Editorial designer with a typographic obsession. Brand systems for 30+ launches including 3 covered by It’s Nice That and Eye on Design.',
    skills:   'Adobe Creative Cloud · Branding · Editorial · Typography · Print production · Motion · Identity systems',
    experience: [
      { role: 'Senior Graphic Designer', company: 'Pentagram', dates: '2021 — Present',
        bullets: [
          'Led identity work for 9 launches; 3 features in Eye on Design and It’s Nice That.',
          'Built the new wordmark and brand system for a $400M IPO.',
          'Mentored 4 designers across the London + NYC studios.'
        ] }
    ],
    education: { degree: 'B.A. Graphic Design', school: 'École nationale supérieure des Arts Décoratifs (Paris)', dates: '2013 — 2017' }
  },

  'product-designer': {
    fullName: 'Sofia Marchetti', title: 'Senior Product Designer',
    summary:  'Product designer obsessed with reducing cognitive load. Shipping interfaces measured in retention, not impressions.',
    skills:   'Figma · Framer · Design systems · Prototyping · UX research · Motion · Service design',
    experience: [
      { role: 'Senior Product Designer', company: 'Notion', dates: '2022 — Present',
        bullets: [
          'Owned the AI feature surface from concept to ship; adopted by 12M users in 90 days.',
          'Led the design system 2.0 migration across 14 product surfaces.'
        ] }
    ],
    education: { degree: 'M.A. Interaction Design', school: 'Politecnico di Milano', dates: '2017 — 2019' }
  },

  'creative': { ...DEFAULT_SE, fullName: 'Camille Laurent', title: 'Creative Director',
    summary: 'Creative director with 12 years across brand, editorial and motion. Built creative teams from 4 to 22 at two category-defining startups.',
    skills:  'Brand strategy · Art direction · Creative leadership · Motion · Editorial · Hiring · Mentoring' },

  // ----- MARKETING / SALES / BIZ -----
  'marketing': {
    fullName: 'James Whitmore', title: 'Senior Marketing Manager',
    summary:  'B2B marketer with 10 years driving pipeline at category-leading SaaS. Built integrated programs that returned 4.3× pipeline and closed $12M from 40 named accounts.',
    skills:   'Demand gen · ABM · Brand · Content · Lifecycle · HubSpot · Marketo · Salesforce · GA4 · Attribution',
    experience: [
      { role: 'Senior Marketing Manager', company: 'Snowflake', dates: '2021 — Present',
        bullets: [
          'Built the ABM program that closed $12M from 40 target accounts (4.3× ROI).',
          'Launched the brand campaign covered by The Verge, TechCrunch and WSJ.',
          'Grew the lifecycle program from 0 → $8M in influenced pipeline in 12 months.'
        ] }
    ],
    education: { degree: 'B.A. Communications', school: 'NYU', dates: '2012 — 2016' }
  },

  'digital-marketing': { ...DEFAULT_SE,
    fullName: 'James Whitmore', title: 'Senior Digital Marketing Lead',
    summary: 'Performance marketer who scaled paid acquisition from $200K → $12M/yr with positive payback. 9 years across B2B SaaS and consumer.',
    skills:  'Google Ads · Meta Ads · LinkedIn Ads · Attribution · Conversion · GA4 · SQL · BigQuery',
    experience: [
      { role: 'Senior Digital Marketing Lead', company: 'Webflow', dates: '2021 — Present',
        bullets: [
          'Scaled paid spend from $1.4M → $12M/yr ARR with sub-9-month payback.',
          'Built the multi-touch attribution model used in board reporting.'
        ] }
    ],
    education: { degree: 'B.Sc. Mathematics', school: 'UCL', dates: '2012 — 2015' }
  },

  'seo-specialist': { ...DEFAULT_SE,
    fullName: 'Hana Schultz', title: 'Senior SEO Specialist',
    summary: 'Technical SEO who grew organic traffic from 80K → 2.1M monthly visitors in 14 months across 3 domains.',
    skills:  'Technical SEO · Programmatic SEO · Schema · Core Web Vitals · Ahrefs · GSC · SQL · BigQuery · Python',
    experience: [
      { role: 'Senior SEO Specialist', company: 'Zapier', dates: '2022 — Present',
        bullets: [
          'Grew organic traffic 26× across 3 product domains in 14 months.',
          'Built the programmatic SEO engine generating 240K indexed pages.'
        ] }
    ],
    education: { degree: 'B.A. Marketing', school: 'University of Amsterdam', dates: '2014 — 2018' }
  },

  'sales': {
    fullName: 'Robert King', title: 'Enterprise Account Executive',
    summary:  'Enterprise AE closing 7-figure SaaS contracts. 142% of quota three years running. Top 5% globally across 320-AE org.',
    skills:   'MEDDPICC · Enterprise sales · Salesforce · Outreach · Gong · Sales engineering partnering · C-level negotiation',
    experience: [
      { role: 'Enterprise Account Executive', company: 'Salesforce', dates: '2021 — Present',
        bullets: [
          'Closed $14.2M in new ARR FY24 (142% of quota); top 5% globally.',
          'Landed the largest new logo in EMEA Q2: $3.4M ACV with 3-year commit.',
          'Mentored 6 reps; 4 promoted to senior within 18 months.'
        ] }
    ],
    education: { degree: 'B.A. Economics', school: 'University of Texas at Austin', dates: '2012 — 2016' }
  },

  'business-analyst': { ...DEFAULT_SE, fullName: 'Mei Lin', title: 'Senior Business Analyst',
    summary: 'Business analyst bridging finance, ops and product teams. Built the planning model adopted across 12 BUs at a Fortune 500.',
    skills:  'SQL · Tableau · Power BI · Looker · Excel modelling · Financial planning · Stakeholder management' },

  'project-manager': { ...DEFAULT_SE, fullName: 'Rohit Sharma', title: 'Senior Project Manager',
    summary: 'PMP-certified project manager delivering 28 enterprise programs on time and under budget. $80M cumulative TCV managed.',
    skills:  'PMP · Agile · Scrum · Risk management · Stakeholder communication · Jira · Confluence · MS Project' },

  'product-manager': {
    fullName: 'Aisha Bello', title: 'Senior Product Manager',
    summary:  'PM shipping data-heavy B2B SaaS. Took a $4M ARR product to $42M ARR in 30 months. 3 launches covered by TechCrunch.',
    skills:   'Product strategy · Discovery · SQL · A/B testing · Roadmapping · Stakeholder mgmt · OKR design · GTM',
    experience: [
      { role: 'Senior Product Manager', company: 'Stripe', dates: '2022 — Present',
        bullets: [
          'Owned Billing for SaaS — grew from $4M → $42M ARR in 30 months.',
          'Shipped the metered-pricing engine adopted by 9 of the top 10 AI startups.',
          'Ran the discovery program that killed 6 false starts before they shipped.'
        ] }
    ],
    education: { degree: 'M.B.A.', school: 'Stanford GSB', dates: '2019 — 2021' }
  },

  'consultant': { ...DEFAULT_SE,
    fullName: 'Henrik Olsen', title: 'Senior Management Consultant',
    summary: 'Strategy consultant covering FinServ & TMT. Led 18 engagements spanning growth strategy, M&A diligence, and operating-model redesign.',
    skills:  'Strategy · M&A diligence · Operating model · Financial modelling · Stakeholder management · Workshop facilitation',
    experience: [
      { role: 'Senior Consultant', company: 'McKinsey & Company', dates: '2020 — Present',
        bullets: [
          'Led 4 growth-strategy engagements for top-3 European banks; each $200K+ TCV.',
          'Built the operating-model blueprint adopted by a $4B telco post-merger.'
        ] }
    ],
    education: { degree: 'M.B.A.', school: 'INSEAD', dates: '2017 — 2019' }
  },

  // ----- FINANCE / OPS -----
  'finance':    { ...DEFAULT_SE, fullName: 'Olivia Brooks', title: 'Senior Finance Manager',
    summary: 'FP&A lead covering revenue, opex and headcount planning. Built the planning model adopted board-wide; saved 40 hours/month of analyst time.',
    skills:  'Financial modelling · FP&A · Forecasting · Variance analysis · Excel · NetSuite · Looker · SQL' },
  'accountant': { ...DEFAULT_SE, fullName: 'David Chen',   title: 'Senior Accountant',
    summary: 'CPA-qualified senior accountant with 9 years closing books at scale. Led 3 year-end audits with zero findings.',
    skills:  'CPA · US GAAP · IFRS · NetSuite · QuickBooks · Audit · SOX · Revenue recognition (ASC 606)' },
  'banking':    { ...DEFAULT_SE, fullName: 'Emma Thornton', title: 'Investment Banking Associate',
    summary: 'IB associate covering TMT M&A. Closed $2.4B in announced deals across 8 transactions in 18 months.',
    skills:  'M&A · LBO modelling · DCF · Comparable company analysis · Pitch books · Bloomberg · CapIQ',
    experience: [
      { role: 'Investment Banking Associate', company: 'Goldman Sachs', dates: '2021 — Present',
        bullets: [
          'Lead associate on $2.4B in announced TMT M&A across 8 transactions.',
          'Built the LBO model anchoring the $640M take-private of a public SaaS target.'
        ] }
    ],
    education: { degree: 'M.B.A.', school: 'Wharton', dates: '2019 — 2021' } },
  'operations': { ...DEFAULT_SE, fullName: 'Hassan Raza',   title: 'Senior Operations Manager',
    summary: 'Ops leader scaling support, success and ops teams 5→90 across two B2B SaaS companies.',
    skills:  'Operations · Process design · CSAT · NPS · Workforce planning · Zendesk · Salesforce · SQL' },
  'customer-support': { ...DEFAULT_SE, fullName: 'Lucia Romano', title: 'Customer Support Lead',
    summary: 'CX leader building support teams that scale with the product. Lifted CSAT from 82 → 96 while volume grew 3.4×.',
    skills:  'CX strategy · CSAT/NPS · Zendesk · Intercom · Quality assurance · Workforce planning' },

  // ----- PEOPLE / EDU -----
  'hr':        { ...DEFAULT_SE, fullName: 'Maria Costa',   title: 'Senior HR Business Partner',
    summary: 'HRBP partnering with eng + product leadership. Led 3 reorgs spanning 800 employees with zero unplanned attrition.',
    skills:  'People strategy · Comp design · Performance management · Workday · Coaching · Change management' },
  'recruiter': { ...DEFAULT_SE, fullName: 'Daniel Park',   title: 'Senior Technical Recruiter',
    summary: 'Tech recruiter who has placed 220+ engineers and PMs across FAANG and Series B startups.',
    skills:  'Sourcing · Closing · Greenhouse · Gem · LinkedIn Recruiter · Comp negotiation · DEI hiring' },

  'teacher':   { ...DEFAULT_SE, fullName: 'Sarah Mitchell', title: 'Secondary Mathematics Teacher',
    summary: 'Mathematics teacher with 11 years across state and grammar schools. GCSE pass rate consistently 28+ points above national average.',
    skills:  'Curriculum design · Pedagogy · Differentiation · AfL · IGCSE · A-level Further Maths · Pastoral care' },
  'professor': { ...DEFAULT_SE, fullName: 'Dr. Ada Nwosu',  title: 'Assistant Professor of Computer Science',
    summary: 'Tenure-track CS professor. 14 peer-reviewed publications, 1,800+ citations, NSF CAREER award 2023.',
    skills:  'Research · Teaching · Grant writing · LaTeX · Curriculum design · Peer review · Student advising' },
  'academic':  { ...DEFAULT_SE, fullName: 'Dr. Ada Nwosu',  title: 'Research Fellow',
    summary: 'Research focus on representation learning for time-series. NeurIPS, ICML and ICLR publications; H-index 14.',
    skills:  'PyTorch · JAX · Statistical inference · Causal modelling · LaTeX · Grant writing · Peer review' },
  'research':  { ...DEFAULT_SE, fullName: 'Dr. Ada Nwosu',  title: 'Research Scientist' },

  // ----- HEALTHCARE / LEGAL -----
  'doctor': {
    fullName: 'Dr. Imran Khan', title: 'Internal Medicine Physician',
    summary:  'Board-certified internal medicine physician with 9 years of acute-care experience across two teaching hospitals. Published in NEJM and JAMA Internal Medicine.',
    skills:   'Internal Medicine · ICU · EHR (Epic) · Clinical research · Medical education · Patient advocacy · ACLS · USMLE',
    experience: [
      { role: 'Attending Physician — Internal Medicine', company: 'Massachusetts General Hospital', dates: '2020 — Present',
        bullets: [
          'Lead attending across 38-bed teaching unit; oversee 12 residents per rotation.',
          'Co-authored a NEJM paper on sepsis bundles cited 240+ times.',
          'Designed the rapid-response protocol that cut code-blue events 31%.'
        ] }
    ],
    education: { degree: 'M.D.', school: 'Harvard Medical School', dates: '2011 — 2015' }
  },
  'nurse': { ...DEFAULT_SE, fullName: 'Grace Adeyemi', title: 'Registered Nurse (ICU)',
    summary: 'BSN-RN with 8 years critical-care experience. Charge-nurse-eligible. CCRN-certified. Bilingual English/French.',
    skills:  'Critical care · Triage · IV therapy · BLS · ACLS · CCRN · Epic · Patient advocacy · Mentoring' },
  'pharmacist':{ ...DEFAULT_SE, fullName: 'Karim El-Sayed', title: 'Clinical Pharmacist',
    summary: 'PharmD specialising in oncology. 7 years across hospital and ambulatory settings. Board-certified BCOP.',
    skills:  'Oncology pharmacy · BCOP · Chemotherapy verification · Patient counselling · Drug interactions · MTM' },
  'lawyer': { ...DEFAULT_SE, fullName: 'Patricia Wells', title: 'Senior Corporate Attorney',
    summary: 'Corporate lawyer with 11 years on cross-border M&A. Closed $3.2B in announced deals across 14 transactions.',
    skills:  'M&A · Securities · Contract negotiation · Cross-border deals · Due diligence · Corporate governance',
    experience: [
      { role: 'Senior Associate', company: 'Skadden, Arps, Slate, Meagher & Flom LLP', dates: '2018 — Present',
        bullets: [
          'Lead associate on $3.2B in announced cross-border M&A across 14 transactions.',
          'Drafted the joint-venture framework adopted by a $40B FTSE 100 client.'
        ] }
    ],
    education: { degree: 'J.D.', school: 'Columbia Law School', dates: '2012 — 2015' } },

  // ----- BUILT ENVIRONMENT -----
  'architect': { ...DEFAULT_SE, fullName: 'Andreas Meier', title: 'Senior Architect',
    summary: 'Licensed architect with 12 years across residential, commercial and adaptive-reuse. AIA award winner 2022.',
    skills:  'AutoCAD · Revit · Rhino · SketchUp · BIM · Sustainability (LEED AP) · Construction documents · Client management' },
  'civil-engineer':      { ...DEFAULT_SE, fullName: 'Faisal Ahmed',  title: 'Civil Engineer (P.E.)',
    summary: 'Licensed civil engineer with 10 years on transportation and bridge infrastructure. Lead design on 3 projects exceeding $80M.',
    skills:  'Structural analysis · AutoCAD Civil 3D · STAAD.Pro · MicroStation · Project management · DOT specifications' },
  'mechanical-engineer': { ...DEFAULT_SE, fullName: 'Sven Larsson',  title: 'Senior Mechanical Engineer',
    summary: 'Mechanical engineer specialising in HVAC and energy systems. Designed systems saving clients €2.8M/yr in energy costs.',
    skills:  'SolidWorks · AutoCAD · Thermodynamics · FEA · Energy modelling · HVAC · CFD · LEED' },
  'electrical-engineer': { ...DEFAULT_SE, fullName: 'Wei Chen',      title: 'Senior Electrical Engineer',
    summary: 'Power systems engineer with 9 years on grid integration and renewable projects. Lead engineer on a 120MW solar farm interconnection.',
    skills:  'Power systems · ETAP · MATLAB · PSCAD · Protection design · Renewable integration · NEC' },
  'real-estate': { ...DEFAULT_SE, fullName: 'Natalie Greene', title: 'Senior Real Estate Agent',
    summary: 'Top-producing agent with 8 years in luxury residential. Closed $84M in 2024 — #3 in the brokerage.',
    skills:  'Luxury residential · Negotiation · CRM · Marketing · Staging · Investor relations · Off-market sourcing' },

  // ----- CAREER STAGE -----
  'fresh-graduate': {
    fullName: 'Jamie Carter', title: 'Computer Science Graduate',
    summary:  'Recent CS graduate from a top-10 program with FAANG internship experience. Strong foundation in distributed systems and full-stack web. Seeking new-grad SWE role.',
    skills:   'Python · Java · TypeScript · SQL · React · Spring Boot · Git · Algorithms · System design · LeetCode (top 5%)',
    experience: [
      { role: 'Software Engineering Intern', company: 'Google', dates: 'Summer 2024',
        bullets: [
          'Built a distributed cache invalidation system serving 4M req/min on the Search infra team.',
          'Returned offer received; converted to full-time.'
        ] },
      { role: 'Software Engineering Intern', company: 'Stripe', dates: 'Summer 2023',
        bullets: ['Shipped 3 features on the Billing Portal used by 80K+ merchants.'] }
    ],
    education: { degree: 'B.S. Computer Science', school: 'Carnegie Mellon University', dates: '2021 — 2025', detail: 'GPA 3.92 · Dean’s List all 4 years' }
  },
  'internship': { ...DEFAULT_SE,
    fullName: 'Jamie Carter', title: 'Software Engineering Intern',
    summary: 'Penultimate-year CS student at CMU seeking a Summer 2025 SWE internship. Previous intern at a Series C fintech.',
    skills:  'Python · TypeScript · React · SQL · Git · Algorithms · LeetCode (top 5%) · Hackathon winner',
    experience: [
      { role: 'Software Engineering Intern', company: 'Plaid', dates: 'Summer 2024',
        bullets: ['Built 2 microservices integrated into the consumer API used by 8K+ apps.'] }
    ],
    education: { degree: 'B.S. Computer Science', school: 'Carnegie Mellon University', dates: '2022 — 2026', detail: 'Expected May 2026 · GPA 3.9' }
  },
  'executive':  { ...DEFAULT_SE, fullName: 'Margaret Holloway', title: 'Chief Operating Officer',
    summary: 'Operating executive with 19 years scaling product orgs from 50 to 2,000. Two successful exits; public-company board experience.',
    skills:  'Strategy · Operations · M&A integration · Board governance · P&L ownership · Org design · Public-company IR',
    experience: [
      { role: 'Chief Operating Officer', company: 'Datadog', dates: '2021 — Present',
        bullets: [
          'Operating partner from $700M ARR through $2.6B ARR and IPO.',
          'Led the integration of 3 acquisitions totalling $1.2B in deal value.',
          'Currently serve on the board of 2 public technology companies.'
        ] }
    ],
    education: { degree: 'M.B.A.', school: 'Harvard Business School', dates: '2003 — 2005' } },

  'government':  { ...DEFAULT_SE, fullName: 'John Anderson', title: 'Senior Policy Analyst',
    summary: 'Policy analyst with 9 years across federal and state policy. Author of 3 white papers cited in Senate hearings.',
    skills:  'Policy analysis · Quantitative research · Stakeholder engagement · Stata · R · Federal regulation · Briefing' },
  'freelancer':  { ...DEFAULT_SE, fullName: 'Eva Sokolova',  title: 'Freelance Full-Stack Developer',
    summary: 'Full-stack freelancer with 7 years shipping client work for 24 companies (Series A → public). 100% 5-star rating across 60+ projects.',
    skills:  'TypeScript · React · Next.js · Node · PostgreSQL · AWS · Stripe · Client management · Contracts' },
  'hospitality': { ...DEFAULT_SE, fullName: 'Antonio Bianchi', title: 'Senior Hotel Operations Manager',
    summary: 'Hospitality leader running 220-room luxury properties. Lifted ADR 14% and RevPAR 22% YoY across two flagship hotels.',
    skills:  'Operations · F&B · Revenue management · Opera PMS · Guest experience · Team leadership · P&L ownership' }
};

export function sampleFor(category: string): SampleResume {
  return SAMPLE_RESUMES[category] ?? DEFAULT_SE;
}
