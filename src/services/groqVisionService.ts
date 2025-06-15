
import { ImageData } from "@/types/canvas";

interface GroqVisionResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export const analyzeImageWithGroq = async (imageData: ImageData, apiKey: string, prompt?: string): Promise<string> => {
  if (!apiKey) {
    throw new Error('Groq API key is required');
  }

  const defaultPrompt = "Analyze this image and provide detailed information about what you see. Describe the content, objects, colors, text, and any other relevant details.";
  
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt || defaultPrompt,
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${imageData.fileType};base64,${imageData.base64}`,
                },
              },
            ],
          },
        ],
        temperature: 0.7,
        max_completion_tokens: 1024,
        top_p: 1,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
    }

    const result: GroqVisionResponse = await response.json();
    return result.choices[0]?.message?.content || 'No analysis available';
  } catch (error) {
    console.error('Error analyzing image with Groq:', error);
    throw error;
  }
};

export const convertImageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix to get just the base64 string
      const base64 = base64String.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
