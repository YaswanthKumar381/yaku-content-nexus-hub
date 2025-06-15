
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
}

export const VideoNodeComponent: React.FC<VideoNodeProps> = ({
  node,
  onPointerDown,
  onTranscriptClick,
  onStartConnection,
  onDelete,
  isConnected,
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

    // Do not start drag if clicking on the connection handle or transcript button.
    // They have their own onPointerDown handlers.
    if (target.closest('[data-connection-handle]') || target.closest('[data-transcript-button]')) {
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
      <div className="group relative bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow-lg w-80 border border-red-200 hover:shadow-xl transition-shadow">
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
          onPointerDown={(e) => {
            e.stopPropagation();
            onStartConnection(node.id);
          }}
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
                className="w-full h-full"
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
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover/thumbnail:opacity-100 transition-opacity">
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
