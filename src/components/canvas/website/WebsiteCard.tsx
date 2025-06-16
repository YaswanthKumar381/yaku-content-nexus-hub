
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, Trash2, FileText, Sparkles } from "lucide-react";
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
                onShowTranscript();
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
        <WebsiteList websites={node.websites} />
      </CardContent>
    </Card>
  );
};
