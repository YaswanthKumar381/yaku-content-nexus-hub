
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Clock, ExternalLink, Globe } from "lucide-react";
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
      className={`p-3 rounded-lg border transition-all duration-200 hover:shadow-sm mb-3 last:mb-0 ${
        isDarkMode 
          ? 'bg-zinc-700/30 border-zinc-600/30 hover:border-zinc-500/50' 
          : 'bg-gray-50/50 border-gray-200/50 hover:border-gray-300/70'
      } group/item cursor-pointer`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-1.5 rounded-md mt-0.5 ${
          isDarkMode ? 'bg-blue-600/20' : 'bg-blue-50'
        }`}>
          <Globe className="w-3 h-3 text-blue-600" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className={`font-medium text-sm truncate pr-2 group-hover/item:text-blue-600 transition-colors ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`} title={website.title}>
              {website.title}
            </h4>
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
              website.content.includes('Failed to fetch') 
                ? 'bg-red-500' 
                : 'bg-green-500'
            }`} 
            title={website.content.includes('Failed to fetch') ? 'Failed to load' : 'Successfully loaded'}
            />
          </div>
          
          <a 
            href={website.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:text-blue-500 flex items-center gap-1 mb-2 truncate transition-colors font-medium"
            title={website.url}
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-3 h-3 flex-shrink-0" />
            {formatDomain(website.url)}
          </a>
          
          <p className={`text-xs leading-relaxed line-clamp-2 mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {previewContent.substring(0, 150)}
            {previewContent.length > 150 && '...'}
          </p>
          
          <Badge 
            variant="secondary" 
            className={`text-xs font-medium ${
              isDarkMode 
                ? 'bg-zinc-600/40 text-zinc-300 border-zinc-500/20' 
                : 'bg-gray-100 text-gray-600 border-gray-200/50'
            } border`}
          >
            <Clock className="w-3 h-3 mr-1" />
            {getTimeAgo(website.fetchedAt)}
          </Badge>
        </div>
      </div>
    </div>
  );
};
