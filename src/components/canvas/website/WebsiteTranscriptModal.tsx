
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, ExternalLink } from "lucide-react";
import { WebsiteNode } from "@/types/canvas";
import { useTheme } from "@/contexts/ThemeContext";
import { formatDomain } from "./websiteUtils";

interface WebsiteTranscriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  node: WebsiteNode;
}

export const WebsiteTranscriptModal: React.FC<WebsiteTranscriptModalProps> = ({
  isOpen,
  onClose,
  node,
}) => {
  const { isDarkMode } = useTheme();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Website HTML Transcripts
          </DialogTitle>
          <DialogDescription>
            Raw HTML content from all websites in this node
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {node.websites.map((website, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <ExternalLink className="w-4 h-4 text-blue-500" />
                  <h4 className="font-semibold text-sm">{website.title}</h4>
                  <span className="text-xs text-muted-foreground">({formatDomain(website.url)})</span>
                </div>
                <div className={`p-4 rounded-lg border font-mono text-xs leading-relaxed ${
                  isDarkMode 
                    ? 'bg-zinc-800/50 border-zinc-700' 
                    : 'bg-gray-50 border-gray-200'
                } max-h-96 overflow-y-auto`}>
                  <pre className="whitespace-pre-wrap break-words">
                    {website.content}
                  </pre>
                </div>
              </div>
            ))}
            {node.websites.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No website content available</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
