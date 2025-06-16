
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { WebsiteNode } from "@/types/canvas";
import { useTheme } from "@/contexts/ThemeContext";
import { WebsiteCard } from "./website/WebsiteCard";
import { WebsiteTranscriptModal } from "./website/WebsiteTranscriptModal";

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
        <WebsiteCard
          node={node}
          onDelete={onDelete}
          onShowTranscript={() => setShowTranscriptModal(true)}
        />

        {/* Connection Handle - positioned to touch the border with transparent background */}
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onStartConnection(node.id);
          }}
          className="absolute -right-4 top-1/2 -translate-y-1/2 h-8 w-8 p-0 rounded-full hover:bg-transparent transition-colors z-10"
          title="Create connection"
        >
          <div className="w-4 h-4 rounded-full border-2 border-emerald-500 bg-transparent animate-pulse shadow-lg shadow-emerald-500/30" />
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

      <WebsiteTranscriptModal
        isOpen={showTranscriptModal}
        onClose={() => setShowTranscriptModal(false)}
        node={node}
      />
    </>
  );
};
