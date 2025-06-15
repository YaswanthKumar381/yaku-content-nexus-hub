
interface GroqTranscriptionResponse {
  text: string;
}

export const transcribeAudio = async (audioBlob: Blob, apiKey: string): Promise<string> => {
  if (!apiKey) {
    throw new Error('Groq API key is required');
  }

  const formData = new FormData();
  formData.append('file', audioBlob, 'audio.wav');
  formData.append('model', 'whisper-large-v3-turbo');
  formData.append('response_format', 'json');
  formData.append('language', 'en');
  formData.append('temperature', '0');

  try {
    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
    }

    const result: GroqTranscriptionResponse = await response.json();
    return result.text;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error;
  }
};
