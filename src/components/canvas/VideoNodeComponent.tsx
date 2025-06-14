
import React from "react";
import { VideoNode } from "@/types/canvas";
import { getVideoThumbnail } from "@/utils/videoUtils";
import { Text, AlertCircle } from "lucide-react";

interface VideoNodeProps {
  node: VideoNode;
  onPointerDown: (e: React.PointerEvent, nodeId: string) => void;
  onTranscriptClick: (e: React.MouseEvent, node: VideoNode) => void;
}

export const VideoNodeComponent: React.FC<VideoNodeProps> = ({
  node,
  onPointerDown,
  onTranscriptClick
}) => {
  const handleTranscriptClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onTranscriptClick(e, node);
  };

  const handleNodePointerDown = (e: React.PointerEvent) => {
    // Only allow dragging if not clicking on the transcript button
    if ((e.target as HTMLElement).closest('[data-transcript-button]')) {
      return;
    }
    onPointerDown(e, node.id);
  };

  return (
    <div
      className="absolute cursor-move"
      style={{
        left: node.x,
        top: node.y,
        transform: 'translate(-50%, -50%)'
      }}
      onPointerDown={handleNodePointerDown}
    >
      <div className="bg-white rounded-lg shadow-lg overflow-hidden w-64 border border-gray-200 hover:shadow-xl transition-shadow">
        <div className="relative">
          <img
            src={getVideoThumbnail(node.url)}
            alt={node.title}
            className="w-full h-36 object-cover"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg";
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-black/70 rounded-full flex items-center justify-center">
              <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
            </div>
          </div>
          <button
            data-transcript-button
            onClick={handleTranscriptClick}
            className="absolute top-2 right-2 w-8 h-8 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center transition-colors z-10 cursor-pointer"
            title="Transcript Options"
          >
            <Text className="w-4 h-4 text-white" />
          </button>
        </div>
        <div className="p-3">
          <h3 className="font-medium text-gray-900 text-sm mb-1">{node.title}</h3>
          <p className="text-xs text-gray-500 truncate">{node.url}</p>
          {!node.context && (
            <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Transcript not loaded
            </p>
          )}
          {node.context && (
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <Text className="w-3 h-3" />
              Transcript available
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
