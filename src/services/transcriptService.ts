export interface TranscriptSegment {
  start: string;
  end: string;
  text: string;
}

export interface VideoInfo {
  name: string;
  thumbnailUrl: {
    hqdefault: string;
    maxresdefault: string;
  };
  embedUrl: string;
  duration: string;
  description: string;
  upload_date: string;
  genre: string;
  author: string;
  channel_id: string;
}

export interface KomeTranscriptResponse {
  success: boolean;
  transcript?: string;
  segments?: Array<{
    text: string;
    start: number;
    end: number;
  }>;
  error?: string;
  message?: string;
}

export interface TranscriptResponse {
  code: number;
  message: string;
  data: {
    videoId: string;
    videoInfo: VideoInfo;
    language_code: Array<{
      code: string;
      name: string;
    }>;
    transcripts: {
      [key: string]: {
        custom: TranscriptSegment[];
        default: TranscriptSegment[];
        auto: TranscriptSegment[];
      };
    };
  };
}

export const fetchYouTubeTranscript = async (videoUrl: string): Promise<TranscriptResponse> => {
  const url = 'https://kome.ai/api/transcript';
  
  console.log("📡 Fetching transcript from kome.ai for video:", videoUrl);
  
  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json, text/plain, */*",
    "Origin": "https://kome.ai",
    "Referer": "https://kome.ai/tools/youtube-transcript-generator"
  };
  
  const data = {
    video_id: videoUrl, // Use original URL format
    format: true
  };
  
  console.log("📤 Sending request data:", data);
  
  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data)
  });
  
  const responseData: KomeTranscriptResponse = await response.json();
  console.log("📋 Transcript API Response:", responseData);
  
  if (!response.ok) {
    console.error("❌ HTTP Error:", response.status, response.statusText);
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  if (!responseData.success) {
    console.error("❌ API Error:", responseData.error || responseData.message);
    throw new Error(responseData.error || responseData.message || 'Failed to fetch transcript');
  }
  
  // Convert segments from kome.ai format
  const segments: TranscriptSegment[] = responseData.segments?.map(segment => ({
    start: segment.start.toString(),
    end: segment.end.toString(),
    text: segment.text
  })) || [];
  
  console.log("✅ Processed segments count:", segments.length);
  
  // Extract video ID for thumbnail generation
  const videoId = getYouTubeVideoId(videoUrl);
  
  // Create response matching our interface
  const transcriptResponse: TranscriptResponse = {
    code: 100000,
    message: 'Success',
    data: {
      videoId: videoId,
      videoInfo: {
        name: "YouTube Video",
        thumbnailUrl: {
          hqdefault: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          maxresdefault: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
        },
        embedUrl: `https://www.youtube.com/embed/${videoId}`,
        duration: "",
        description: "",
        upload_date: "",
        genre: "",
        author: "",
        channel_id: ""
      },
      language_code: [
        { code: 'en', name: 'English' }
      ],
      transcripts: {
        en_auto: {
          custom: segments,
          default: segments,
          auto: segments
        }
      }
    }
  };
  
  return transcriptResponse;
};

// Helper function to extract video ID from URL
const getYouTubeVideoId = (url: string): string => {
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

export const formatTranscriptText = (segments: TranscriptSegment[]): string => {
  return segments.map(segment => segment.text).join(' ');
};
