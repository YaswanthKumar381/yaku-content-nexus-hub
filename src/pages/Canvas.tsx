import { useCallback } from "react";
import { Video, Archive, History, Bell } from "lucide-react";
import { VideoNode, SidebarTool } from "@/types/canvas";
import { useCanvasTransform } from "@/hooks/useCanvasTransform";
import { useVideoNodes } from "@/hooks/useVideoNodes";
import { useCanvasState } from "@/hooks/useCanvasState";
import { useCanvasEvents } from "@/hooks/useCanvasEvents";
import { VideoNodeComponent } from "@/components/canvas/VideoNodeComponent";
import { VideoInputModal } from "@/components/canvas/VideoInputModal";
import { TranscriptModal } from "@/components/canvas/TranscriptModal";
import { CanvasSidebar } from "@/components/canvas/CanvasSidebar";
import { CanvasNavigation } from "@/components/canvas/CanvasNavigation";
import { CanvasBackground } from "@/components/canvas/CanvasBackground";
import { ZoomIndicator } from "@/components/canvas/ZoomIndicator";

const Canvas = () => {
  const {
    selectedTool,
    setSelectedTool,
    isDraggingVideo,
    setIsDraggingVideo,
    showVideoInput,
    setShowVideoInput,
    pendingVideoNode,
    setPendingVideoNode,
    videoUrl,
    setVideoUrl,
    showTranscriptPopup,
    setShowTranscriptPopup,
    currentTranscript,
    setCurrentTranscript,
    transcriptError,
    setTranscriptError,
    isCreatingNode,
    setIsCreatingNode,
    currentVideoUrl,
    setCurrentVideoUrl,
    resetVideoInput,
    resetTranscriptModal
  } = useCanvasState();

  const {
    transform,
    canvasContainerRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  } = useCanvasTransform();

  const {
    videoNodes,
    draggingNodeId,
    addVideoNode,
    updateVideoNode,
    moveVideoNode,
    handleNodePointerDown,
    handleNodePointerUp,
    forceResetDragState
  } = useVideoNodes();

  const {
    handleVideoIconDragStart,
    handleCanvasDrop,
    handleCanvasDragOver,
    handleVideoUrlSubmit,
    handleTranscriptClick
  } = useCanvasEvents({
    isDraggingVideo,
    setIsDraggingVideo,
    setPendingVideoNode,
    setShowVideoInput,
    canvasContainerRef,
    transform,
    addVideoNode,
    pendingVideoNode,
    videoUrl,
    setIsCreatingNode,
    resetVideoInput,
    setCurrentVideoUrl,
    setShowTranscriptPopup,
    setCurrentTranscript,
    setTranscriptError,
    forceResetDragState
  });

  const sidebarTools: SidebarTool[] = [
    { id: "video", icon: Video, label: "Video" },
    { id: "filter", icon: Archive, label: "Filter" },
    { id: "history", icon: History, label: "History" },
    { id: "folder", icon: Archive, label: "Folder" },
    { id: "rocket", icon: Bell, label: "Rocket" },
    { id: "chat", icon: Bell, label: "Chat" },
    { id: "help", icon: Bell, label: "Help" }
  ];

  const handleTranscriptModalClose = useCallback(() => {
    console.log("🔽 Closing transcript modal");
    resetTranscriptModal();
    
    // Extra safety: force reset drag state when modal closes
    console.log("🔄 Force resetting drag state on modal close");
    forceResetDragState();
  }, [resetTranscriptModal, forceResetDragState]);

  const handleCanvasPointerMove = useCallback((e: React.PointerEvent) => {
    if (draggingNodeId) {
      console.log("📍 Moving node:", draggingNodeId);
      moveVideoNode(draggingNodeId, e.clientX, e.clientY, transform);
    } else {
      handlePointerMove(e, draggingNodeId, () => {});
    }
  }, [handlePointerMove, draggingNodeId, moveVideoNode, transform]);

  const handleCanvasPointerUp = useCallback((e: React.PointerEvent) => {
    if (draggingNodeId) {
      console.log("🎯 Ending drag for node:", draggingNodeId);
      handleNodePointerUp(e);
    }
    handlePointerUp(e);
  }, [draggingNodeId, handleNodePointerUp, handlePointerUp]);

  return (
    <div className="min-h-screen bg-zinc-900 relative overflow-hidden">
      {/* Canvas Container */}
      <div 
        ref={canvasContainerRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none"
        onPointerDown={(e) => handlePointerDown(e, draggingNodeId)}
        onPointerMove={handleCanvasPointerMove}
        onPointerUp={handleCanvasPointerUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onDrop={handleCanvasDrop}
        onDragOver={handleCanvasDragOver}
        style={{ 
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transformOrigin: '0 0'
        }}
      >
        <CanvasBackground transform={transform} />

        {/* Video Nodes */}
        {videoNodes.map((node) => (
          <VideoNodeComponent
            key={node.id}
            node={node}
            onPointerDown={handleNodePointerDown}
            onTranscriptClick={handleTranscriptClick}
          />
        ))}
      </div>

      {/* Video URL Input Modal */}
      <VideoInputModal
        isOpen={showVideoInput}
        videoUrl={videoUrl}
        isCreating={isCreatingNode}
        onUrlChange={setVideoUrl}
        onSubmit={handleVideoUrlSubmit}
        onCancel={resetVideoInput}
      />

      {/* Transcript Options Popup */}
      <TranscriptModal
        isOpen={showTranscriptPopup}
        videoUrl={currentVideoUrl}
        transcript={currentTranscript}
        error={transcriptError}
        onClose={handleTranscriptModalClose}
        onTranscriptChange={setCurrentTranscript}
        onSave={() => {
          updateVideoNode(
            videoNodes.find(node => node.url === currentVideoUrl)?.id || '',
            { context: currentTranscript }
          );
          handleTranscriptModalClose();
        }}
      />

      {/* Floating Left Sidebar */}
      <CanvasSidebar
        tools={sidebarTools}
        selectedTool={selectedTool}
        onToolSelect={setSelectedTool}
        onVideoDragStart={handleVideoIconDragStart}
      />

      {/* Navigation */}
      <CanvasNavigation />

      {/* Zoom indicator */}
      <ZoomIndicator scale={transform.scale} />
    </div>
  );
};

export default Canvas;
