
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

const GROQ_MODELS = [
  { value: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B Instant', description: '131K context window, fast inference' },
  { value: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B Versatile', description: '131K context window, high quality' },
  { value: 'deepseek-r1-distill-llama-70b', label: 'DeepSeek R1 Distill 70B', description: '131K context window, reasoning focused' },
  { value: 'meta-llama/llama-4-maverick-17b-128e-instruct', label: 'Llama 4 Maverick 17B', description: '131K context window, preview model' },
  { value: 'meta-llama/llama-4-scout-17b-16e-instruct', label: 'Llama 4 Scout 17B', description: '131K context window, preview model' },
  { value: 'qwen-qwq-32b', label: 'Qwen QwQ 32B', description: '131K context window, reasoning model' },
  { value: 'qwen/qwen3-32b', label: 'Qwen 3 32B', description: '131K context window, versatile model' },
];

const MODEL_PROVIDERS = [
  { value: 'gemini', label: 'Gemini (Google)' },
  { value: 'groq', label: 'Groq' },
];

export const SettingsPopover = () => {
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [groqApiKey, setGroqApiKey] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('gemini');
  const [selectedModel, setSelectedModel] = useState('gemini-1.5-flash-latest');

  useEffect(() => {
    const storedGeminiKey = localStorage.getItem('gemini-api-key');
    const storedGroqKey = localStorage.getItem('groq-api-key');
    const storedProvider = localStorage.getItem('model-provider');
    const storedModel = localStorage.getItem('selected-model');
    
    if (storedGeminiKey) {
      setGeminiApiKey(storedGeminiKey);
    }
    if (storedGroqKey) {
      setGroqApiKey(storedGroqKey);
    }
    if (storedProvider) {
      setSelectedProvider(storedProvider);
    }
    if (storedModel) {
      setSelectedModel(storedModel);
    }
  }, []);

  const handleProviderChange = (provider: string) => {
    setSelectedProvider(provider);
    // Set default model for the selected provider
    if (provider === 'gemini') {
      setSelectedModel('gemini-1.5-flash-latest');
    } else if (provider === 'groq') {
      setSelectedModel('llama-3.3-70b-versatile');
    }
  };

  const getAvailableModels = () => {
    return selectedProvider === 'gemini' ? GEMINI_MODELS : GROQ_MODELS;
  };

  const handleSave = () => {
    localStorage.setItem('gemini-api-key', geminiApiKey);
    localStorage.setItem('groq-api-key', groqApiKey);
    localStorage.setItem('model-provider', selectedProvider);
    localStorage.setItem('selected-model', selectedModel);
    toast.success("Settings Saved", {
      description: "Your API keys and model preferences have been saved successfully.",
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
          <Label htmlFor="model-provider">Provider</Label>
          <Select value={selectedProvider} onValueChange={handleProviderChange}>
            <SelectTrigger id="model-provider" className="col-span-2 h-8">
              <SelectValue placeholder="Select provider" />
            </SelectTrigger>
            <SelectContent>
              {MODEL_PROVIDERS.map((provider) => (
                <SelectItem key={provider.value} value={provider.value}>
                  {provider.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <Label htmlFor="ai-model">AI Model</Label>
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger id="ai-model" className="col-span-2 h-8">
              <SelectValue placeholder="Select AI model" />
            </SelectTrigger>
            <SelectContent>
              {getAvailableModels().map((model) => (
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
