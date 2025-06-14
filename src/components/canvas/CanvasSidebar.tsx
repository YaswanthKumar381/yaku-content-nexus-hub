
import React from "react";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { SidebarTool } from "@/types/canvas";

interface CanvasSidebarProps {
  tools: SidebarTool[];
  selectedTool: string;
  onToolSelect: (toolId: string) => void;
  onVideoDragStart: (e: React.DragEvent) => void;
}

export const CanvasSidebar: React.FC<CanvasSidebarProps> = ({
  tools,
  selectedTool,
  onToolSelect,
  onVideoDragStart
}) => {
  return (
    <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-20">
      <div className="w-16 bg-zinc-800/90 backdrop-blur-md border border-zinc-700/50 rounded-full flex flex-col items-center py-6 shadow-2xl">
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
                  : "text-zinc-400 hover:text-white hover:bg-zinc-700"
              }`}
              onClick={() => onToolSelect(tool.id)}
              draggable={tool.id === "video"}
              onDragStart={tool.id === "video" ? onVideoDragStart : undefined}
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
            className="w-10 h-10 rounded-full bg-zinc-700 hover:bg-zinc-600"
          >
            <User className="w-5 h-5 text-zinc-300" />
          </Button>
        </div>
      </div>
    </div>
  );
};
