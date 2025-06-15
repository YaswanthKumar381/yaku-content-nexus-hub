import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Globe, Trash2, ExternalLink, Clock, Link as LinkIcon, Sparkles, FileText } from "lucide-react";
import { WebsiteNode, WebsiteData } from "@/types/canvas";
import { useTheme } from "@/contexts/ThemeContext";

interface WebsiteNodeComponentProps {
  node: WebsiteNode;
  onPointerDown: (e: React.PointerEvent, nodeId: string) => void;
  onStartConnection: (nodeId: string) => void;
  onDelete: (nodeId: string) => void;
  isConnected: boolean;
}

export const WebsiteNodeComponent: React.FC<WebsiteNodeComponentProps> = ({
  node,
  onPointerDown,
  onStartConnection,
  onDelete,
  isConnected,
}) => {
  const { isDarkMode } = useTheme();
  const [showTranscriptModal, setShowTranscriptModal] = useState(false);

  const formatDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const fetchedAt = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - fetchedAt.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getPreviewContent = (html: string) => {
    if (html.includes('Failed to fetch')) {
      return html;
    }

    return html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // Remove scripts
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')   // Remove styles
      .replace(/<[^>]*>/g, ' ')                         // Remove HTML tags
      .replace(/\s+/g, ' ')                           // Normalize whitespace
      .trim();
  };

  const scrollbarStyles = {
    width: '4px',
    background: 'transparent',
    thumb: isDarkMode ? 'rgba(156, 163, 175, 0.5)' : 'rgba(107, 114, 128, 0.5)',
    thumbHover: isDarkMode ? 'rgba(156, 163, 175, 0.7)' : 'rgba(107, 114, 128, 0.7)'
  };

  return (
    <>
      <div
        className={`absolute pointer-events-auto group`}
        style={{ 
          left: node.x, 
          top: node.y, 
          transform: 'translate(-50%, -50%)' 
        }}
        onPointerDown={(e) => onPointerDown(e, node.id)}
        data-node-id={node.id}
      >
        <Card className={`w-96 max-h-[500px] overflow-hidden transition-all duration-300 hover:shadow-2xl ${
          isDarkMode 
            ? 'bg-gradient-to-br from-zinc-800/95 to-zinc-900/95 border-zinc-700/50 shadow-xl shadow-purple-500/5' 
            : 'bg-gradient-to-br from-white/95 to-gray-50/95 border-gray-200/50 shadow-xl shadow-blue-500/5'
        } backdrop-blur-md group-hover:scale-[1.02] border-2`}>
          <CardHeader className="pb-4 relative overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-r ${
              isDarkMode 
                ? 'from-purple-600/10 to-blue-600/10' 
                : 'from-purple-500/5 to-blue-500/5'
            }`} />
            <CardTitle className="flex items-center justify-between text-sm relative z-10">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  isDarkMode ? 'bg-purple-600/20' : 'bg-purple-500/10'
                } border ${isDarkMode ? 'border-purple-500/30' : 'border-purple-500/20'}`}>
                  <Globe className="w-4 h-4 text-purple-500" />
                </div>
                <div>
                  <span className="font-semibold">Websites</span>
                  <div className="flex items-center gap-1 mt-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span className="text-xs text-amber-500 font-medium">{node.websites.length} sites</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowTranscriptModal(true);
                  }}
                  className="h-8 w-8 p-0 rounded-full text-blue-500 hover:text-blue-400 hover:bg-blue-500/20 transition-colors"
                  title="View HTML transcript"
                >
                  <FileText className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(node.id);
                  }}
                  className="h-8 w-8 p-0 rounded-full text-red-500 hover:text-red-400 hover:bg-red-500/20 transition-colors"
                  title="Delete node"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
            {node.websites.map((website, index) => {
              const previewContent = getPreviewContent(website.content);
              return (
              <div
                key={index}
                className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-lg ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-zinc-700/30 to-zinc-600/30 border-zinc-600/50 hover:border-zinc-500/70' 
                    : 'bg-gradient-to-r from-gray-50/80 to-white/80 border-gray-200/70 hover:border-gray-300/70'
                } hover:scale-[1.01] group/item`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <LinkIcon className="w-3 h-3 text-blue-500 flex-shrink-0" />
                      <h4 className="font-semibold text-sm truncate group-hover/item:text-blue-500 transition-colors" title={website.title}>
                        {website.title}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <a 
                        href={website.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-blue-500 hover:text-blue-400 flex items-center gap-1 truncate transition-colors font-medium"
                        title={website.url}
                      >
                        <ExternalLink className="w-3 h-3" />
                        {formatDomain(website.url)}
                      </a>
                    </div>
                  </div>
                </div>
                
                <p className={`text-xs leading-relaxed line-clamp-4 mb-3 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {previewContent.substring(0, 300)}
                  {previewContent.length > 300 && '...'}
                </p>
                
                <div className="flex items-center justify-between">
                  <Badge 
                    variant="secondary" 
                    className={`text-xs font-medium ${
                      isDarkMode 
                        ? 'bg-zinc-600/50 text-zinc-300 border-zinc-500/30' 
                        : 'bg-gray-100/80 text-gray-600 border-gray-200/50'
                    } border`}
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    {getTimeAgo(website.fetchedAt)}
                  </Badge>
                  <div className={`w-2 h-2 rounded-full ${
                    website.content.includes('Failed to fetch') 
                      ? 'bg-red-500' 
                      : 'bg-green-500'
                  } animate-pulse`} 
                  title={website.content.includes('Failed to fetch') ? 'Failed to load' : 'Successfully loaded'}
                  />
                </div>
              </div>
            )})}
            
            {node.websites.length === 0 && (
              <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <Globe className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No websites added yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Connection Handle - positioned completely outside on the right */}
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onStartConnection(node.id);
          }}
          className="absolute -right-8 top-1/2 -translate-y-1/2 h-8 w-8 p-0 rounded-full hover:bg-blue-500/20 transition-colors z-10"
          title="Create connection"
        >
          <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 animate-pulse" />
        </Button>
        
        <style>
          {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: ${scrollbarStyles.thumb};
            border-radius: 2px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: ${scrollbarStyles.thumbHover};
          }
          `}
        </style>
      </div>

      {/* HTML Transcript Modal */}
      <Dialog open={showTranscriptModal} onOpenChange={setShowTranscriptModal}>
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
    </>
  );
};
