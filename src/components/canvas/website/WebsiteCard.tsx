
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, Trash2, FileText, MoreVertical } from "lucide-react";
import { WebsiteNode } from "@/types/canvas";
import { useTheme } from "@/contexts/ThemeContext";
import { WebsiteList } from "./WebsiteList";

interface WebsiteCardProps {
  node: WebsiteNode;
  onDelete: (nodeId: string) => void;
  onShowTranscript: () => void;
}

export const WebsiteCard: React.FC<WebsiteCardProps> = ({
  node,
  onDelete,
  onShowTranscript,
}) => {
  const { isDarkMode } = useTheme();

  return (
    <Card className={`w-80 max-h-96 overflow-hidden transition-all duration-200 hover:shadow-lg border-0 ${
      isDarkMode 
        ? 'bg-zinc-800/90 shadow-lg' 
        : 'bg-white/90 shadow-sm'
    } backdrop-blur-sm group-hover:scale-[1.01]`}>
      <CardHeader className="pb-3 px-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              isDarkMode ? 'bg-blue-600/20' : 'bg-blue-50'
            }`}>
              <Globe className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className={`font-semibold text-sm ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Website
              </h3>
              <p className={`text-xs ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {node.websites.length} site{node.websites.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onShowTranscript();
              }}
              className="h-8 w-8 p-0 rounded-full hover:bg-blue-100 text-blue-600"
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
              className="h-8 w-8 p-0 rounded-full hover:bg-red-100 text-red-600"
              title="Delete node"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
              title="More options"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="px-4 pb-4 max-h-72 overflow-y-auto">
        <WebsiteList websites={node.websites} />
      </CardContent>
    </Card>
  );
};
