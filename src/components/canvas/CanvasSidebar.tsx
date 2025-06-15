
import React from "react";
import { Button } from "@/components/ui/button";
import { SidebarTool } from "@/types/canvas";
import { useTheme } from "@/contexts/ThemeContext";
import { MessageCircleMoreIcon } from "../icons/MessageCircleMoreIcon";

interface CanvasSidebarProps {
  tools: SidebarTool[];
  selectedTool: string;
  onToolSelect: (toolId: string) => void;
  onVideoDragStart: (e: React.DragEvent) => void;
  onDocumentDragStart: (e: React.DragEvent) => void;
  onChatDragStart: (e: React.DragEvent) => void;
}

export const CanvasSidebar: React.FC<CanvasSidebarProps> = ({
  tools,
  selectedTool,
  onToolSelect,
  onVideoDragStart,
  onDocumentDragStart,
  onChatDragStart,
}) => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-20">
      <div className={`w-16 ${isDarkMode ? 'bg-zinc-800/90 border-zinc-700/50' : 'bg-white/90 border-gray-200/50'} backdrop-blur-md border rounded-full flex flex-col items-center py-6 shadow-2xl`}>
        {/* Top Tools */}
        <div className="flex flex-col space-y-3 mb-6">
          {tools.map((tool) => (
            <Button
              key={tool.id}
              variant={selectedTool === tool.id ? "default" : "ghost"}
              size="icon"
              className={`w-10 h-10 rounded-full ${
                selectedTool === tool.id 
                  ? "bg-purple-600 hover:bg-purple-700 text-white" 
                  : isDarkMode 
                    ? "text-zinc-400 hover:text-white hover:bg-zinc-700" 
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              }`}
              onClick={() => onToolSelect(tool.id)}
              draggable={tool.id === "video" || tool.id === "file-text"}
              onDragStart={
                tool.id === "video"
                  ? onVideoDragStart
                  : tool.id === "file-text"
                  ? onDocumentDragStart
                  : undefined
              }
            >
              <tool.icon className="w-5 h-5" />
            </Button>
          ))}
        </div>

        {/* Bottom User Avatar */}
        <div className="mt-auto">
          <Button
            variant="ghost"
            size="icon"
            className={`w-10 h-10 rounded-full ${isDarkMode ? 'bg-zinc-700 hover:bg-zinc-600' : 'bg-gray-100 hover:bg-gray-200'}`}
            draggable={true}
            onDragStart={onChatDragStart}
          >
            <MessageCircleMoreIcon size={20} className={`${isDarkMode ? 'text-zinc-300' : 'text-gray-600'}`} />
          </Button>
        </div>
      </div>
    </div>
  );
};
