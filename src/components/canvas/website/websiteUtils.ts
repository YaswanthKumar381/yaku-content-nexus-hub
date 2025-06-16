
export const formatDomain = (url: string) => {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url;
  }
};

export const getTimeAgo = (dateString: string) => {
  const now = new Date();
  const fetchedAt = new Date(dateString);
  const diffInMinutes = Math.floor((now.getTime() - fetchedAt.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};

export const getPreviewContent = (html: string) => {
  if (html.includes('Failed to fetch')) {
    return html;
  }

  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // Remove scripts
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')   // Remove styles
    .replace(/<[^>]*>/g, ' ')                         // Remove HTML tags
    .replace(/\s+/g, ' ')                           // Normalize whitespace
    .trim();
};
