
import { fetchYouTubeTranscript } from "@/services/transcriptService";

export const getVideoTitle = async (url: string): Promise<string> => {
  const videoId = getYouTubeVideoId(url);
  if (videoId) {
    try {
      const transcriptData = await fetchYouTubeTranscript(videoId);
      return transcriptData.data.videoInfo.name || "YouTube Video";
    } catch (error) {
      console.error("Failed to fetch video title:", error);
      return "YouTube Video";
    }
  }
  
  if (url.includes('vimeo.com')) {
    return "Vimeo Video";
  }
  return "Video";
};

export const getVideoThumbnail = (url: string): string => {
  if (url.includes('youtube.com/watch?v=')) {
    const videoId = url.split('v=')[1]?.split('&')[0];
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
  } else if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0];
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
  } else if (url.includes('youtube.com/embed/')) {
    const videoId = url.split('embed/')[1]?.split('?')[0];
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
  }
  
  return "/placeholder.svg";
};

export const getYouTubeVideoId = (url: string): string => {
  if (url.includes('youtube.com/watch?v=')) {
    return url.split('v=')[1]?.split('&')[0] || '';
  } else if (url.includes('youtu.be/')) {
    return url.split('youtu.be/')[1]?.split('?')[0] || '';
  } else if (url.includes('youtube.com/embed/')) {
    return url.split('embed/')[1]?.split('?')[0] || '';
  }
  return '';
};
