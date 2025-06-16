
import React from "react";
import { Globe } from "lucide-react";
import { WebsiteData } from "@/types/canvas";
import { useTheme } from "@/contexts/ThemeContext";
import { WebsiteItem } from "./WebsiteItem";

interface WebsiteListProps {
  websites: WebsiteData[];
}

export const WebsiteList: React.FC<WebsiteListProps> = ({ websites }) => {
  const { isDarkMode } = useTheme();

  if (websites.length === 0) {
    return (
      <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        <Globe className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No websites added yet</p>
      </div>
    );
  }

  return (
    <>
      {websites.map((website, index) => (
        <WebsiteItem key={index} website={website} />
      ))}
    </>
  );
};
