
import { fetchYouTubeTranscript } from "@/services/transcriptService";

export const getVideoTitle = async (url: string): Promise<string> => {
  try {
    console.log("🎥 Fetching video title from noembed for:", url);
    const response = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("📋 Received noembed data:", data);
    
    if (data.title) {
      return data.title;
    }
    
    throw new Error('No title found in noembed response');
  } catch (error) {
    console.error("Failed to fetch video title from noembed:", error);
    
    // Fallback to original method
    const videoId = getYouTubeVideoId(url);
    if (videoId) {
      try {
        const transcriptData = await fetchYouTubeTranscript(url);
        return transcriptData.data.videoInfo.name || "YouTube Video";
      } catch (error) {
        console.error("Failed to fetch video title from transcript service:", error);
        return "YouTube Video";
      }
    }
    
    if (url.includes('vimeo.com')) {
      return "Vimeo Video";
    }
    return "Video";
  }
};

export const getVideoThumbnail = (url: string): string => {
  const videoId = getYouTubeVideoId(url);
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }
  
  return "/placeholder.svg";
};

export const getYouTubeVideoId = (url: string): string => {
  // Handle YouTube Shorts URLs
  if (url.includes('/shorts/')) {
    const match = url.match(/\/shorts\/([^?&/]+)/);
    return match ? match[1] : '';
  }
  
  // Handle regular YouTube URLs
  if (url.includes('youtube.com/watch?v=')) {
    return url.split('v=')[1]?.split('&')[0] || '';
  } else if (url.includes('youtu.be/')) {
    return url.split('youtu.be/')[1]?.split('?')[0] || '';
  } else if (url.includes('youtube.com/embed/')) {
    return url.split('embed/')[1]?.split('?')[0] || '';
  }
  
  return '';
};

export const getYouTubeEmbedUrl = (url: string): string => {
  const videoId = getYouTubeVideoId(url);
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }
  return '';
};
