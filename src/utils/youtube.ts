
import { nanoid } from 'nanoid';
import { YoutubeTranscript } from 'youtube-transcript';

export const generateId = () => nanoid(8);

export const extractVideoId = (url: string): string | undefined => {
  const regex = /[?&]v=([^&]+)/;
  const match = url.match(regex);
  return match ? match[1] : undefined;
};

export const fetchTranscript = async (videoUrl: string): Promise<string> => {
  try {
    console.log('🎬 Fetching transcript for:', videoUrl);
    
    const transcript = await YoutubeTranscript.fetchTranscript(videoUrl);
    console.log('📝 Raw transcript data:', transcript);
    
    const transcriptText = transcript
      .map(segment => segment.text)
      .join(' ')
      .replace(/\n/g, ' ')
      .trim();
    
    console.log('✅ Processed transcript:', transcriptText.substring(0, 200) + '...');
    return transcriptText;
  } catch (error) {
    console.error('💥 Error fetching transcript:', error);
    throw new Error(`Failed to fetch transcript: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
