
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const GEMINI_MODELS = [
  { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro', description: 'Enhanced thinking and reasoning, multimodal understanding' },
  { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash', description: 'Adaptive thinking, cost efficiency' },
  { value: 'gemini-2.5-flash-lite-preview-06-17', label: 'Gemini 2.5 Flash-Lite Preview', description: 'Most cost-efficient model' },
  { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash', description: 'Next generation features, speed' },
  { value: 'gemini-2.0-flash-lite', label: 'Gemini 2.0 Flash-Lite', description: 'Cost efficiency and low latency' },
  { value: 'gemini-1.5-flash-latest', label: 'Gemini 1.5 Flash', description: 'Fast and versatile performance' },
  { value: 'gemini-1.5-flash-8b', label: 'Gemini 1.5 Flash-8B', description: 'High volume and lower intelligence tasks' },
  { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro', description: 'Complex reasoning tasks' },
];

export const SettingsPopover = () => {
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [groqApiKey, setGroqApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-1.5-flash-latest');

  useEffect(() => {
    const storedGeminiKey = localStorage.getItem('gemini-api-key');
    const storedGroqKey = localStorage.getItem('groq-api-key');
    const storedModel = localStorage.getItem('gemini-model');
    
    if (storedGeminiKey) {
      setGeminiApiKey(storedGeminiKey);
    }
    if (storedGroqKey) {
      setGroqApiKey(storedGroqKey);
    }
    if (storedModel) {
      setSelectedModel(storedModel);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('gemini-api-key', geminiApiKey);
    localStorage.setItem('groq-api-key', groqApiKey);
    localStorage.setItem('gemini-model', selectedModel);
    toast.success("Settings Saved", {
      description: "Your API keys and model preference have been saved successfully.",
    });
  };

  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <h4 className="font-medium leading-none">Settings</h4>
        <p className="text-sm text-muted-foreground">
          Manage your API keys and AI model preferences.
        </p>
      </div>
      <div className="grid gap-4">
        <div className="grid grid-cols-3 items-center gap-4">
          <Label htmlFor="gemini-model">AI Model</Label>
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger id="gemini-model" className="col-span-2 h-8">
              <SelectValue placeholder="Select AI model" />
            </SelectTrigger>
            <SelectContent>
              {GEMINI_MODELS.map((model) => (
                <SelectItem key={model.value} value={model.value}>
                  <div className="flex flex-col">
                    <span className="font-medium">{model.label}</span>
                    <span className="text-xs text-muted-foreground">{model.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <Label htmlFor="gemini-api-key">Gemini API</Label>
          <Input
            id="gemini-api-key"
            type="password"
            value={geminiApiKey}
            onChange={(e) => setGeminiApiKey(e.target.value)}
            className="col-span-2 h-8"
            placeholder="Enter Gemini API key"
          />
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <Label htmlFor="groq-api-key">Groq API</Label>
          <Input
            id="groq-api-key"
            type="password"
            value={groqApiKey}
            onChange={(e) => setGroqApiKey(e.target.value)}
            className="col-span-2 h-8"
            placeholder="Enter Groq API key"
          />
        </div>
      </div>
      <Button onClick={handleSave} size="sm" className="w-full">Save Settings</Button>
    </div>
  );
};
