/**
 * Flat catalogue of professional categories shown in the filter dropdown.
 * `group` powers the optgroup grouping in the UI.
 * `icon` is an emoji (no external icon font dependency).
 */
export interface CategoryMeta {
  slug: string;          // url-safe, matches Template.category
  name: string;
  group: 'Engineering & Tech' | 'Design & Creative' | 'Business & Sales'
       | 'Finance & Operations' | 'People & Education' | 'Healthcare & Legal'
       | 'Built Environment' | 'Career Stage' | 'Other';
  icon: string;
}

export const CATEGORIES: CategoryMeta[] = [
  // --- Engineering & Tech ---
  { slug: 'software-engineer',      name: 'Software Engineer',      group: 'Engineering & Tech', icon: '💻' },
  { slug: 'frontend-developer',     name: 'Frontend Developer',     group: 'Engineering & Tech', icon: '🎨' },
  { slug: 'backend-developer',      name: 'Backend Developer',      group: 'Engineering & Tech', icon: '⚙️' },
  { slug: 'fullstack-developer',    name: 'Full Stack Developer',   group: 'Engineering & Tech', icon: '🧩' },
  { slug: 'devops-engineer',        name: 'DevOps Engineer',        group: 'Engineering & Tech', icon: '🛠️' },
  { slug: 'cloud-architect',        name: 'Cloud Architect',        group: 'Engineering & Tech', icon: '☁️' },
  { slug: 'data-scientist',         name: 'Data Scientist',         group: 'Engineering & Tech', icon: '📊' },
  { slug: 'ai-engineer',            name: 'AI Engineer',            group: 'Engineering & Tech', icon: '🤖' },
  { slug: 'cybersecurity',          name: 'Cybersecurity',          group: 'Engineering & Tech', icon: '🛡️' },
  { slug: 'mobile-developer',       name: 'Mobile Developer',       group: 'Engineering & Tech', icon: '📱' },
  { slug: 'game-developer',         name: 'Game Developer',         group: 'Engineering & Tech', icon: '🎮' },

  // --- Design & Creative ---
  { slug: 'ui-ux-designer',         name: 'UI/UX Designer',         group: 'Design & Creative',  icon: '🖌️' },
  { slug: 'graphic-designer',       name: 'Graphic Designer',       group: 'Design & Creative',  icon: '🖼️' },
  { slug: 'product-designer',       name: 'Product Designer',       group: 'Design & Creative',  icon: '✏️' },
  { slug: 'creative',               name: 'Creative',               group: 'Design & Creative',  icon: '🌈' },

  // --- Business & Sales ---
  { slug: 'marketing',              name: 'Marketing',              group: 'Business & Sales',   icon: '📣' },
  { slug: 'digital-marketing',      name: 'Digital Marketing',      group: 'Business & Sales',   icon: '📈' },
  { slug: 'seo-specialist',         name: 'SEO Specialist',         group: 'Business & Sales',   icon: '🔍' },
  { slug: 'sales',                  name: 'Sales',                  group: 'Business & Sales',   icon: '💼' },
  { slug: 'business-analyst',       name: 'Business Analyst',       group: 'Business & Sales',   icon: '📐' },
  { slug: 'project-manager',        name: 'Project Manager',        group: 'Business & Sales',   icon: '📋' },
  { slug: 'product-manager',        name: 'Product Manager',        group: 'Business & Sales',   icon: '🧭' },
  { slug: 'consultant',             name: 'Consultant',             group: 'Business & Sales',   icon: '🎯' },

  // --- Finance & Operations ---
  { slug: 'finance',                name: 'Finance',                group: 'Finance & Operations', icon: '💰' },
  { slug: 'accountant',             name: 'Accountant',             group: 'Finance & Operations', icon: '🧾' },
  { slug: 'banking',                name: 'Banking',                group: 'Finance & Operations', icon: '🏦' },
  { slug: 'operations',             name: 'Operations',             group: 'Finance & Operations', icon: '🔧' },
  { slug: 'customer-support',       name: 'Customer Support',       group: 'Finance & Operations', icon: '🎧' },

  // --- People & Education ---
  { slug: 'hr',                     name: 'HR',                     group: 'People & Education', icon: '🤝' },
  { slug: 'recruiter',              name: 'Recruiter',              group: 'People & Education', icon: '🧲' },
  { slug: 'teacher',                name: 'Teacher',                group: 'People & Education', icon: '📚' },
  { slug: 'professor',              name: 'Professor',              group: 'People & Education', icon: '🎓' },
  { slug: 'academic',               name: 'Academic',               group: 'People & Education', icon: '📖' },
  { slug: 'research',               name: 'Research',               group: 'People & Education', icon: '🔬' },

  // --- Healthcare & Legal ---
  { slug: 'doctor',                 name: 'Doctor',                 group: 'Healthcare & Legal', icon: '🩺' },
  { slug: 'nurse',                  name: 'Nurse',                  group: 'Healthcare & Legal', icon: '💉' },
  { slug: 'pharmacist',             name: 'Pharmacist',             group: 'Healthcare & Legal', icon: '💊' },
  { slug: 'lawyer',                 name: 'Lawyer',                 group: 'Healthcare & Legal', icon: '⚖️' },

  // --- Built Environment ---
  { slug: 'architect',              name: 'Architect',              group: 'Built Environment',  icon: '🏛️' },
  { slug: 'civil-engineer',         name: 'Civil Engineer',         group: 'Built Environment',  icon: '🏗️' },
  { slug: 'mechanical-engineer',    name: 'Mechanical Engineer',    group: 'Built Environment',  icon: '⚙️' },
  { slug: 'electrical-engineer',    name: 'Electrical Engineer',    group: 'Built Environment',  icon: '⚡' },
  { slug: 'real-estate',            name: 'Real Estate',            group: 'Built Environment',  icon: '🏠' },

  // --- Career Stage ---
  { slug: 'fresh-graduate',         name: 'Fresh Graduate',         group: 'Career Stage',       icon: '🎓' },
  { slug: 'internship',             name: 'Internship',             group: 'Career Stage',       icon: '🌱' },
  { slug: 'executive',              name: 'Executive',              group: 'Career Stage',       icon: '👔' },

  // --- Other ---
  { slug: 'government',             name: 'Government',             group: 'Other',              icon: '🏛️' },
  { slug: 'freelancer',             name: 'Freelancer',             group: 'Other',              icon: '🧑‍💻' },
  { slug: 'hospitality',            name: 'Hospitality',            group: 'Other',              icon: '🏨' }
];

export const CATEGORY_BY_SLUG: Record<string, CategoryMeta> =
  Object.fromEntries(CATEGORIES.map(c => [c.slug, c]));

export const CATEGORY_GROUPS = Array.from(new Set(CATEGORIES.map(c => c.group)));
