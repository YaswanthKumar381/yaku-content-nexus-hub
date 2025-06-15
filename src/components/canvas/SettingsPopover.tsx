
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

export const SettingsPopover = () => {
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [groqApiKey, setGroqApiKey] = useState('');
  const [provider, setProvider] = useState('gemini');

  useEffect(() => {
    const storedGeminiKey = localStorage.getItem('gemini-api-key');
    const storedGroqKey = localStorage.getItem('groq-api-key');
    if (storedGeminiKey) {
      setGeminiApiKey(storedGeminiKey);
    }
    if (storedGroqKey) {
      setGroqApiKey(storedGroqKey);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('gemini-api-key', geminiApiKey);
    localStorage.setItem('groq-api-key', groqApiKey);
    toast.success("API Keys Saved", {
      description: "Your API keys have been saved successfully.",
    });
  };

  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <h4 className="font-medium leading-none">Settings</h4>
        <p className="text-sm text-muted-foreground">
          Manage your API keys for AI providers.
        </p>
      </div>
      <div className="grid gap-4">
        <div className="grid grid-cols-3 items-center gap-4">
          <Label htmlFor="provider">Provider</Label>
          <Select value={provider} onValueChange={setProvider} disabled>
            <SelectTrigger id="provider" className="col-span-2 h-8">
              <SelectValue placeholder="Select provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gemini">Gemini</SelectItem>
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
      <Button onClick={handleSave} size="sm" className="w-full">Save Keys</Button>
    </div>
  );
};
