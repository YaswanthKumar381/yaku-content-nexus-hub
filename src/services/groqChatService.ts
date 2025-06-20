
const GROQ_API_BASE = 'https://api.groq.com/openai/v1';

export interface GroqChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GroqChatRequest {
  model: string;
  messages: GroqChatMessage[];
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  stream?: boolean;
}

export const groqModels = [
  { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B Instant', contextWindow: 131072 },
  { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B Versatile', contextWindow: 131072 },
  { id: 'deepseek-r1-distill-llama-70b', name: 'DeepSeek R1 Distill Llama 70B', contextWindow: 131072 },
  { id: 'qwen-qwq-32b', name: 'Qwen QwQ 32B', contextWindow: 131072 },
];

export const sendGroqChatMessage = async (
  messages: GroqChatMessage[],
  apiKey: string,
  model: string = 'llama-3.3-70b-versatile'
): Promise<string> => {
  if (!apiKey) {
    throw new Error('Groq API key is required');
  }

  const requestBody: GroqChatRequest = {
    model,
    messages,
    max_tokens: 4096,
    temperature: 0.7,
  };

  try {
    const response = await fetch(`${GROQ_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Check if the response has the expected structure
    if (data.choices && data.choices.length > 0 && data.choices[0].message) {
      return data.choices[0].message.content;
    }
    
    throw new Error('Invalid response format from Groq API');
  } catch (error) {
    console.error('Groq chat error:', error);
    throw error;
  }
};
