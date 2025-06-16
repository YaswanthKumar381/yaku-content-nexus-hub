
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Clock, ExternalLink, Link as LinkIcon } from "lucide-react";
import { WebsiteData } from "@/types/canvas";
import { useTheme } from "@/contexts/ThemeContext";
import { getPreviewContent, formatDomain, getTimeAgo } from "./websiteUtils";

interface WebsiteItemProps {
  website: WebsiteData;
}

export const WebsiteItem: React.FC<WebsiteItemProps> = ({ website }) => {
  const { isDarkMode } = useTheme();
  const previewContent = getPreviewContent(website.content);

  return (
    <div
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
  );
};
