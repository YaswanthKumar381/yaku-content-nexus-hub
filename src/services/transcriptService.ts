
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

export const fetchYouTubeTranscript = async (videoId: string): Promise<TranscriptResponse> => {
  const response = await fetch(`https://notegpt.io/api/v2/video-transcript?platform=youtube&video_id=${videoId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch transcript: ${response.statusText}`);
  }
  
  return response.json();
};

export const formatTranscriptText = (segments: TranscriptSegment[]): string => {
  return segments.map(segment => segment.text).join(' ');
};
