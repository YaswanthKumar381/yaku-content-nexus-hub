
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, Trash2, Plus, ExternalLink } from "lucide-react";
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

  return (
    <div
      className={`absolute pointer-events-auto group`}
      style={{ 
        left: node.x, 
        top: node.y, 
        transform: 'translate(-50%, -50%)' 
      }}
      onPointerDown={(e) => onPointerDown(e, node.id)}
    >
      <Card className={`w-80 max-h-96 overflow-hidden ${
        isDarkMode 
          ? 'bg-zinc-800/95 border-zinc-700' 
          : 'bg-white/95 border-gray-200'
      } backdrop-blur-sm shadow-lg`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>Websites ({node.websites.length})</span>
            </div>
            <div className="flex gap-1">
              {isConnected && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onStartConnection(node.id)}
                  className="h-6 w-6 p-0"
                >
                  <div className="w-4 h-4 rounded-full bg-blue-500" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(node.id)}
                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-3 max-h-80 overflow-y-auto">
          {node.websites.map((website, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border ${
                isDarkMode 
                  ? 'bg-zinc-700/50 border-zinc-600' 
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate" title={website.title}>
                    {website.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <a 
                      href={website.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1 truncate"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {website.url}
                    </a>
                  </div>
                </div>
              </div>
              
              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3">
                {website.content.substring(0, 200)}...
              </p>
              
              <Badge variant="secondary" className="mt-2 text-xs">
                {new Date(website.fetchedAt).toLocaleDateString()}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
