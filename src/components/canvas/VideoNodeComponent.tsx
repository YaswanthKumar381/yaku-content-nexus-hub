
import React from "react";
import { VideoNode } from "@/types/canvas";
import { getVideoThumbnail, getYouTubeEmbedUrl } from "@/utils/videoUtils";
import { Text, AlertCircle, Play } from "lucide-react";

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
  const embedUrl = getYouTubeEmbedUrl(node.url);

  const handleTranscriptClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    console.log("🎯 Transcript button clicked, preventing drag");
    onTranscriptClick(e, node);
  };

  const handleNodePointerDown = (e: React.PointerEvent) => {
    // Check if the click is on the transcript button or its children
    const target = e.target as HTMLElement;
    const transcriptButton = target.closest('[data-transcript-button]');
    
    if (transcriptButton) {
      console.log("🚫 Preventing drag - clicked on transcript button");
      e.stopPropagation();
      e.preventDefault();
      return;
    }
    
    console.log("✅ Starting node drag for:", node.id);
    onPointerDown(e, node.id);
  };

  return (
    <div
      className="absolute cursor-move"
      data-node-id={node.id}
      style={{
        left: node.x,
        top: node.y,
        transform: 'translate(-50%, -50%)'
      }}
      onPointerDown={handleNodePointerDown}
    >
      <div className="relative bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow-lg overflow-hidden w-80 border border-red-200 hover:shadow-xl transition-shadow">
        <div className="absolute top-1/2 left-full transform -translate-y-1/2 w-4 h-4 bg-transparent rounded-full border-2 border-red-500 z-20" />
        <div className="relative">
          {embedUrl ? (
            <div className="relative w-full h-48">
              <iframe
                src={embedUrl}
                title={node.title}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="relative">
              <img
                src={getVideoThumbnail(node.url)}
                alt={node.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-black/70 rounded-full flex items-center justify-center hover:bg-black/90 transition-colors">
                  <Play className="w-6 h-6 text-white ml-1" fill="white" />
                </div>
              </div>
            </div>
          )}
          
          <button
            data-transcript-button
            onClick={handleTranscriptClick}
            onPointerDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
              console.log("🚫 Transcript button pointer down prevented");
            }}
            className="absolute top-2 right-2 w-8 h-8 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center transition-colors z-10 cursor-pointer"
            title="Transcript Options"
          >
            <Text className="w-4 h-4 text-white" />
          </button>
        </div>
        <div className="p-4">
          <h3 className="font-medium text-gray-900 text-sm mb-2 leading-tight">{node.title}</h3>
          {!node.context && (
            <p className="text-xs text-amber-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Transcript not loaded
            </p>
          )}
          {node.context && (
            <p className="text-xs text-green-600 flex items-center gap-1">
              <Text className="w-3 h-3" />
              Transcript available
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
