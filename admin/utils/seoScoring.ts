export interface SEOScore {
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  issues: {
    title: string;
    severity: 'critical' | 'warning' | 'info';
  }[];
}

export function scorePropertySEO(property: {
  name?: string;
  slug?: string;
  description?: string;
  images: string[];
  location?: string;
}): SEOScore {
  const issues: SEOScore['issues'] = [];
  let score = 100;

  // Title check
  if (!property.name || property.name.length === 0) {
    issues.push({ title: 'Missing property name', severity: 'critical' });
    score -= 20;
  } else if (property.name.length < 5) {
    issues.push({ title: 'Property name is too short (min 5 chars)', severity: 'warning' });
    score -= 10;
  } else if (property.name.length > 70) {
    issues.push({ title: 'Property name is too long (max 70 chars)', severity: 'warning' });
    score -= 5;
  }

  // Slug check
  if (!property.slug || property.slug.length === 0) {
    issues.push({ title: 'Missing URL slug', severity: 'critical' });
    score -= 15;
  }

  // Description check
  if (!property.description || property.description.length === 0) {
    issues.push({ title: 'Missing description', severity: 'critical' });
    score -= 20;
  } else if (property.description.length < 50) {
    issues.push({ title: 'Description is too short (min 50 chars)', severity: 'warning' });
    score -= 10;
  } else if (property.description.length > 160) {
    issues.push({ title: 'Description is too long (max 160 chars)', severity: 'info' });
    score -= 5;
  }

  // Images check
  if (property.images.length === 0) {
    issues.push({ title: 'No images uploaded', severity: 'critical' });
    score -= 25;
  } else if (property.images.length < 3) {
    issues.push({ title: 'Less than 3 images (recommended)', severity: 'warning' });
    score -= 10;
  }

  // Location check
  if (!property.location || property.location.length === 0) {
    issues.push({ title: 'Missing location information', severity: 'warning' });
    score -= 10;
  }

  score = Math.max(0, Math.min(100, score));

  let grade: SEOScore['grade'] = 'F';
  if (score >= 90) grade = 'A';
  else if (score >= 80) grade = 'B';
  else if (score >= 70) grade = 'C';
  else if (score >= 60) grade = 'D';

  return { score, grade, issues };
}

export function scoreBlogPostSEO(post: {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
}): SEOScore {
  const issues: SEOScore['issues'] = [];
  let score = 100;

  // Title check
  if (!post.title || post.title.length === 0) {
    issues.push({ title: 'Missing blog title', severity: 'critical' });
    score -= 20;
  } else if (post.title.length < 5) {
    issues.push({ title: 'Title is too short (min 5 chars)', severity: 'warning' });
    score -= 10;
  } else if (post.title.length > 70) {
    issues.push({ title: 'Title is too long (max 70 chars)', severity: 'warning' });
    score -= 5;
  }

  // Slug check
  if (!post.slug || post.slug.length === 0) {
    issues.push({ title: 'Missing URL slug', severity: 'critical' });
    score -= 15;
  }

  // Excerpt check
  if (!post.excerpt || post.excerpt.length === 0) {
    issues.push({ title: 'Missing excerpt', severity: 'critical' });
    score -= 15;
  } else if (post.excerpt.length < 50) {
    issues.push({ title: 'Excerpt is too short (min 50 chars)', severity: 'warning' });
    score -= 10;
  } else if (post.excerpt.length > 160) {
    issues.push({ title: 'Excerpt is too long (max 160 chars)', severity: 'info' });
    score -= 5;
  }

  // Content check
  if (!post.content || post.content.length === 0) {
    issues.push({ title: 'No content', severity: 'critical' });
    score -= 20;
  } else if (post.content.length < 300) {
    issues.push({ title: 'Content is too short (min 300 chars)', severity: 'warning' });
    score -= 15;
  }

  // Cover image check
  if (!post.coverImage) {
    issues.push({ title: 'Missing cover image', severity: 'warning' });
    score -= 10;
  }

  score = Math.max(0, Math.min(100, score));

  let grade: SEOScore['grade'] = 'F';
  if (score >= 90) grade = 'A';
  else if (score >= 80) grade = 'B';
  else if (score >= 70) grade = 'C';
  else if (score >= 60) grade = 'D';

  return { score, grade, issues };
}

export function getGradeColor(grade: SEOScore['grade']): string {
  const colors: Record<SEOScore['grade'], string> = {
    A: 'text-green-600',
    B: 'text-blue-600',
    C: 'text-yellow-600',
    D: 'text-orange-600',
    F: 'text-red-600',
  };
  return colors[grade];
}

export function getGradeBgColor(grade: SEOScore['grade']): string {
  const colors: Record<SEOScore['grade'], string> = {
    A: 'bg-green-100',
    B: 'bg-blue-100',
    C: 'bg-yellow-100',
    D: 'bg-orange-100',
    F: 'bg-red-100',
  };
  return colors[grade];
}
