
import React, { useState } from 'react';
import { KeyRound } from 'lucide-react';

interface ApiKeyInputProps {
  onSave: (apiKey: string) => void;
  isSaving: boolean;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onSave, isSaving }) => {
  const [apiKey, setApiKey] = useState('');

  const handleSave = () => {
    if (apiKey.trim()) {
      onSave(apiKey.trim());
    }
  };

  return (
    <div className="p-3 bg-zinc-900/50 rounded-b-2xl mt-2">
      <div className="flex items-center gap-2">
        <KeyRound className="h-4 w-4 text-zinc-500 flex-shrink-0" />
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          placeholder="Enter your Gemini API key"
          className="flex-grow bg-zinc-800 border border-zinc-700 rounded-md px-3 py-1.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow"
          disabled={isSaving}
        />
        <button
          onClick={handleSave}
          disabled={!apiKey.trim() || isSaving}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-1.5 px-4 rounded-md text-sm transition-colors disabled:bg-zinc-600 disabled:cursor-not-allowed flex-shrink-0"
        >
          {isSaving ? 'Sending...' : 'Save & Send'}
        </button>
      </div>
       <p className="text-xs text-zinc-500 mt-2 text-center">
        Get your API key from{' '}
        <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">
          Google AI Studio
        </a>. It's stored locally in your browser.
      </p>
    </div>
  );
};
