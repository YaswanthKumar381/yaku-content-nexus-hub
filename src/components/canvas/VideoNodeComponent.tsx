
import React from "react";
import { VideoNode } from "@/types/canvas";
import { getVideoThumbnail, getYouTubeEmbedUrl } from "@/utils/videoUtils";
import { Text, AlertCircle, Play, Trash2 } from "lucide-react";

interface VideoNodeProps {
  node: VideoNode;
  onPointerDown: (e: React.PointerEvent, nodeId: string) => void;
  onTranscriptClick: (e: React.MouseEvent, node: VideoNode) => void;
  onStartConnection: (nodeId: string) => void;
  onDelete: (nodeId: string) => void;
  isConnected: boolean;
  isGlowing?: boolean;
}

export const VideoNodeComponent: React.FC<VideoNodeProps> = ({
  node,
  onPointerDown,
  onTranscriptClick,
  onStartConnection,
  onDelete,
  isConnected,
  isGlowing,
}) => {
  const embedUrl = getYouTubeEmbedUrl(node.url);

  const handleTranscriptClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    console.log("🎯 Transcript button clicked, preventing drag");
    onTranscriptClick(e, node);
  };

  const handleNodePointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;

    // Do not start drag if clicking on interactive elements
    if (target.closest('button, iframe, [data-connection-handle], [data-transcript-button]')) {
        console.log("🚫 Preventing drag - clicked on interactive element");
        e.stopPropagation();
        return;
    }
    
    // Only allow dragging from the text/draggable area at the bottom
    if (!target.closest('[data-draggable-area]')) {
        console.log("🚫 Preventing drag - not on draggable area");
        e.stopPropagation();
        return;
    }
    
    console.log("✅ Starting node drag for:", node.id);
    e.stopPropagation();
    onPointerDown(e, node.id);
  };

  const handleConnectionStart = (e: React.PointerEvent) => {
    e.stopPropagation();
    onStartConnection(node.id);
  };

  return (
    <div
      className="absolute cursor-default"
      data-node-id={node.id}
      style={{
        left: node.x,
        top: node.y,
        transform: 'translate(-50%, -50%)',
        boxShadow: isGlowing ? '0 0 20px 5px rgba(239, 68, 68, 0.7)' : 'none',
      }}
      onPointerDown={handleNodePointerDown}
    >
      <div 
        className={`group relative bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow-lg w-80 border border-red-200 hover:shadow-xl transition-shadow ${isConnected ? 'node-glow-red' : ''}`}
        onMouseEnter={() => {/* Add glow logic here */}}
        onMouseLeave={() => {/* Remove glow logic here */}}
        onClick={() => {/* Add selection logic here */}}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(node.id);
          }}
          className="absolute -top-2 -left-2 w-8 h-8 bg-white hover:bg-red-100 rounded-full flex items-center justify-center z-20 cursor-pointer border border-gray-300 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          title="Delete Node"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </button>
        <div 
          data-connection-handle
          onPointerDown={handleConnectionStart}
          className="absolute top-1/2 left-full transform -translate-y-1/2 w-4 h-4 bg-transparent rounded-full border-2 border-red-500 z-20 cursor-pointer flex items-center justify-center"
        >
          {isConnected && <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />}
        </div>
        <div className="relative">
          {embedUrl ? (
            <div className="relative w-full h-48 rounded-t-lg overflow-hidden">
              <iframe
                src={embedUrl}
                title={node.title}
                className="w-full h-full pointer-events-none"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="relative rounded-t-lg overflow-hidden group/thumbnail">
              <img
                src={getVideoThumbnail(node.url)}
                alt={node.title}
                className="w-full h-48 object-cover pointer-events-none"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover/thumbnail:opacity-100 transition-opacity pointer-events-none">
                <div className="w-16 h-16 bg-black/70 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors">
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
            }}
            className="absolute top-2 right-2 w-8 h-8 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center transition-colors z-10 cursor-pointer"
            title="Transcript Options"
          >
            <Text className="w-4 h-4 text-white" />
          </button>
        </div>
        <div className="p-4 cursor-grab hover:cursor-grab active:cursor-grabbing" data-draggable-area>
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
