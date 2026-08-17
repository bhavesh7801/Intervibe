/**
 * Helper utility to determine if a candidate's target role is software-related.
 * The Coding IDE module is explicitly ENABLED for Software Engineer, Backend Engineer,
 * Frontend Engineer, Full Stack, Data Science, DevOps, ML, and Software Development roles,
 * and HIDDEN for other engineering fields (ECE, EE, ME, Civil) and non-tech fields.
 */
export const isTechRole = (targetRole) => {
  if (!targetRole) return true;
  
  const role = targetRole.toLowerCase().trim();

  // Core software engineering keywords that ALWAYS have Coding IDE enabled
  const softwareKeywords = [
    'software',
    'backend',
    'frontend',
    'full stack',
    'fullstack',
    'developer',
    'coder',
    'coding',
    'data scientist',
    'devops',
    'sre',
    'machine learning',
    'data engineer',
    'web'
  ];

  // Non-software engineering fields and non-tech fields where Coding IDE is hidden
  const nonSoftwareKeywords = [
    'electronics',
    'ece',
    'electrical',
    'ee',
    'e.e',
    'mechanical',
    'me',
    'm.e',
    'civil',
    'chemical',
    'mechatronics',
    'robotics',
    'embedded',
    'vlsi',
    'product manager',
    'project manager',
    'product owner',
    'hr',
    'human resources',
    'recruiter',
    'marketing',
    'sales',
    'business analyst',
    'finance',
    'financial analyst',
    'designer',
    'ui/ux',
    'ux researcher',
    'content',
    'copywriter',
    'account executive'
  ];

  // 1. If role matches any software engineering keyword, enable Coding IDE
  if (softwareKeywords.some((kw) => role.includes(kw))) {
    return true;
  }

  // 2. If role matches non-software or non-tech keyword, hide Coding IDE
  if (nonSoftwareKeywords.some((kw) => role.includes(kw))) {
    return false;
  }

  // 3. Default fallback
  return true;
};

/**
 * Curated list of Tech, Core Engineering (ECE, EE, ME), and Non-Tech Role Tracks
 * arranged strictly in ALPHABETICAL ORDER (A to Z).
 */
export const COMMON_ROLE_TRACKS = [
  'Backend Engineer',
  'Business Analyst',
  'Civil Engineering',
  'Data Scientist',
  'DevOps / SRE',
  'Electrical Engineering (EE)',
  'Electronics & Communication (ECE)',
  'Embedded Systems & VLSI',
  'Financial Analyst',
  'Frontend Engineer',
  'Full Stack Engineer',
  'HR / Recruiter',
  'Machine Learning Engineer',
  'Marketing Specialist',
  'Mechanical Engineering (ME)',
  'Product Manager',
  'Project Manager',
  'Robotics & Automation',
  'Sales / Account Executive',
  'Software Engineer',
  'UI/UX Designer'
].sort((a, b) => a.localeCompare(b));
