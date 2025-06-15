
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

export const fetchYouTubeTranscript = async (videoId: string): Promise<TranscriptResponse> => {
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const url = 'https://kome.ai/api/transcript';
  
  console.log("📡 Fetching transcript from kome.ai for video:", videoUrl);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/plain, */*',
      'Origin': 'https://kome.ai',
      'Referer': 'https://kome.ai/tools/youtube-transcript-generator'
    },
    body: JSON.stringify({
      video_id: videoUrl,
      format: true
    })
  });
  
  const data: KomeTranscriptResponse = await response.json();
  console.log("API Response:", data);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch transcript: ${response.status} ${response.statusText}`);
  }
  
  if (!data.success) {
    throw new Error(data.error || data.message || 'Failed to fetch transcript');
  }
  
  // Convert kome.ai response format to our expected format
  const segments: TranscriptSegment[] = data.segments?.map(segment => ({
    start: segment.start.toString(),
    end: segment.end.toString(),
    text: segment.text
  })) || [];
  
  // Create a mock response structure that matches our existing interface
  const mockResponse: TranscriptResponse = {
    code: 100000,
    message: 'Success',
    data: {
      videoId: videoId,
      videoInfo: {
        name: "YouTube Video", // We'll need to get this separately if needed
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
  
  return mockResponse;
};

export const formatTranscriptText = (segments: TranscriptSegment[]): string => {
  return segments.map(segment => segment.text).join(' ');
};
