
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
  const url = 'https://n8n-anrqdske.ap-southeast-1.clawcloudrun.com/webhook/get-transcript';
  
  console.log("📡 Fetching transcript from webhook for video:", videoUrl);
  
  const headers = {
    "Content-Type": "application/json"
  };
  
  const data = {
    video_url: videoUrl
  };
  
  console.log("📤 Sending request data:", data);
  
  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    console.error("❌ HTTP Error:", response.status, response.statusText);
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  const transcriptText = await response.text();
  console.log("📋 Received transcript:", transcriptText);
  
  if (!transcriptText || transcriptText.trim() === '') {
    throw new Error('No transcript received from the webhook');
  }
  
  // Create a single segment with the entire transcript
  const segments: TranscriptSegment[] = [{
    start: "0",
    end: "0",
    text: transcriptText.trim()
  }];
  
  console.log("✅ Processed transcript successfully");
  
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
