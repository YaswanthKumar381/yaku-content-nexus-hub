
import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Video, Instagram, Music } from "lucide-react";

interface VideoDropdownProps {
  selectedTool: string;
  onToolSelect: (toolId: string) => void;
  onVideoDragStart: (e: React.DragEvent, platform: string) => void;
  isDarkMode: boolean;
}

export const VideoDropdown: React.FC<VideoDropdownProps> = ({
  selectedTool,
  onToolSelect,
  onVideoDragStart,
  isDarkMode
}) => {
  const videoOptions = [
    { id: "youtube", icon: Video, label: "YouTube", color: "text-red-500" },
    { id: "instagram", icon: Instagram, label: "Instagram", color: "text-pink-500" },
    { id: "tiktok", icon: Music, label: "TikTok", color: "text-black" }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={selectedTool === "video" ? "default" : "ghost"}
          size="icon"
          className={`w-10 h-10 rounded-full ${
            selectedTool === "video"
              ? "bg-purple-600 hover:bg-purple-700 text-white" 
              : isDarkMode 
                ? "text-zinc-400 hover:text-white hover:bg-zinc-700" 
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
          }`}
          onClick={() => onToolSelect("video")}
        >
          <Video className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        side="right" 
        className={`${isDarkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-gray-200'} z-50`}
      >
        {videoOptions.map((option) => (
          <DropdownMenuItem
            key={option.id}
            className={`flex items-center gap-2 cursor-pointer ${
              isDarkMode ? 'text-zinc-300 hover:bg-zinc-700' : 'text-gray-700 hover:bg-gray-100'
            }`}
            draggable
            onDragStart={(e) => onVideoDragStart(e, option.id)}
            onSelect={() => onToolSelect(option.id)}
          >
            <option.icon className={`w-4 h-4 ${option.color}`} />
            <span>{option.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
