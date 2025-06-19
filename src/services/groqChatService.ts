
import { ChatMessage } from "@/types/canvas";

interface GroqChatResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export const generateContentWithGroq = async (
  userPrompt: string, 
  context: string, 
  history: ChatMessage[], 
  apiKey: string, 
  model: string = 'llama-3.3-70b-versatile'
): Promise<string> => {
  if (!apiKey) {
    return "Please provide your Groq API key in the settings (top-right gear icon).";
  }

  const API_URL = 'https://api.groq.com/openai/v1/chat/completions';

  const systemMessage = history.find(m => m.role === 'system');
  const systemInstructionText = systemMessage?.content || "You are Yaku, a helpful AI assistant. Use the provided context from connected nodes to answer user questions.";

  const formattedHistory = history
    .filter(m => m.role === 'user' || m.role === 'assistant')
    .map(message => ({
      role: message.role === 'model' ? 'assistant' : message.role,
      content: message.content,
    }));

  const fullPrompt = context
    ? `Here is some context from connected nodes:\n\n---\n${context}\n---\n\nMy question is: ${userPrompt}`
    : userPrompt;

  const messages = [
    { role: "system", content: systemInstructionText },
    ...formattedHistory,
    { role: "user", content: fullPrompt },
  ];

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        max_tokens: 4096,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error("Groq API Error:", errorBody);
      throw new Error(`API request failed with status ${response.status}: ${errorBody.error?.message || 'Unknown error'}`);
    }

    const data: GroqChatResponse = await response.json();
    
    if (data.choices && data.choices.length > 0 && data.choices[0].message) {
      return data.choices[0].message.content;
    } else {
      console.warn("No content generated, or response format is unexpected.", data);
      return "I'm sorry, I couldn't generate a response. Please check the console for more details.";
    }
  } catch (error) {
    console.error("Error calling Groq API:", error);
    return `An error occurred while trying to chat. ${error instanceof Error ? error.message : 'Please check the console for details.'}`;
  }
};
