
import { ChatMessage } from "@/types/canvas";

export const generateContent = async (userPrompt: string, context: string, history: ChatMessage[], apiKey: string): Promise<string> => {
  if (!apiKey) {
    return "Please provide your Gemini API key in the settings (top-right gear icon).";
  }

  // Get the selected model from localStorage, default to gemini-1.5-flash-latest
  const selectedModel = localStorage.getItem('gemini-model') || 'gemini-1.5-flash-latest';
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`;

  const systemMessage = history.find(m => m.role === 'system');
  const systemInstructionText = systemMessage?.content || "You are Yashu, a helpful AI assistant. Use the provided context from connected nodes to answer user questions.";

  const formattedHistory = history
    .filter(m => m.role === 'user' || m.role === 'model')
    .map(message => ({
      role: message.role,
      parts: [{ text: message.content }],
    }));

  const fullPrompt = context
    ? `Here is some context from connected nodes:\n\n---\n${context}\n---\n\nMy question is: ${userPrompt}`
    : userPrompt;

  const contents = [
    ...formattedHistory,
    {
      role: "user",
      parts: [{ text: fullPrompt }],
    },
  ];

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: contents,
        system_instruction: {
          parts: [{ text: systemInstructionText }],
        },
        safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
        ]
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error("Gemini API Error:", errorBody);
      throw new Error(`API request failed with status ${response.status}: ${errorBody.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content.parts) {
      return data.candidates[0].content.parts[0].text;
    } else {
      console.warn("No content generated, or response format is unexpected.", data);
      const finishReason = data.candidates?.[0]?.finishReason;
      if (finishReason === 'SAFETY') {
        return "I'm sorry, the response was blocked due to safety settings. Please try rephrasing your prompt.";
      }
      return "I'm sorry, I couldn't generate a response. Please check the console for more details.";
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return `An error occurred while trying to chat. ${error instanceof Error ? error.message : 'Please check the console for details.'}`;
  }
};
