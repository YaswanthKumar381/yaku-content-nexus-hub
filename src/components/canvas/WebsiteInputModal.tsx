
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Globe } from "lucide-react";

interface WebsiteInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (urls: string[]) => void;
  isLoading?: boolean;
}

export const WebsiteInputModal: React.FC<WebsiteInputModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [urls, setUrls] = useState<string[]>([""]);

  const addUrlField = () => {
    setUrls([...urls, ""]);
  };

  const removeUrlField = (index: number) => {
    if (urls.length > 1) {
      setUrls(urls.filter((_, i) => i !== index));
    }
  };

  const updateUrl = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const handleSubmit = () => {
    const validUrls = urls.filter(url => url.trim() !== "");
    if (validUrls.length > 0) {
      onSubmit(validUrls);
      setUrls([""]);
    }
  };

  const handleClose = () => {
    onClose();
    setUrls([""]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Add Website URLs
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {urls.map((url, index) => (
            <div key={index} className="flex gap-2 items-end">
              <div className="flex-1">
                <Label htmlFor={`url-${index}`}>
                  Website URL {index + 1}
                </Label>
                <Input
                  id={`url-${index}`}
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => updateUrl(index, e.target.value)}
                  className="mt-1"
                />
              </div>
              {urls.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeUrlField(index)}
                  className="mb-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            onClick={addUrlField}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Another URL
          </Button>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading || urls.every(url => url.trim() === "")}
              className="flex-1"
            >
              {isLoading ? "Fetching..." : "Add Websites"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
