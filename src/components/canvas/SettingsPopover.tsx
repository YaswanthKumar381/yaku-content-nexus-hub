
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
  const [apiKey, setApiKey] = useState('');
  const [provider, setProvider] = useState('gemini');

  useEffect(() => {
    const storedKey = localStorage.getItem('gemini-api-key');
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const handleSave = () => {
    if (provider === 'gemini') {
      localStorage.setItem('gemini-api-key', apiKey);
      toast.success("API Key Saved", {
        description: "Your Gemini API key has been saved successfully.",
      });
    }
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
          <Label htmlFor="api-key">API Key</Label>
          <Input
            id="api-key"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="col-span-2 h-8"
            placeholder="Enter your API key"
          />
        </div>
      </div>
      <Button onClick={handleSave} size="sm" className="w-full">Save Key</Button>
    </div>
  );
};
