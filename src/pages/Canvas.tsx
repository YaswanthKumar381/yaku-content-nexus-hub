
import { useCallback } from "react";
import { Archive, History, Bell } from "lucide-react";
import { SidebarTool } from "@/types/canvas";
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
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { YoutubeIcon } from "@/components/canvas/YoutubeIcon";
import { FileTextIcon } from "@/components/canvas/FileTextIcon";
import { useDocumentNodes } from "@/hooks/useDocumentNodes";
import { DocumentNodeComponent } from "@/components/canvas/DocumentNodeComponent";
import { DocumentUploadModal } from "@/components/canvas/DocumentUploadModal";
import { useChatNodes } from "@/hooks/useChatNodes";
import { ChatNodeComponent } from "@/components/canvas/ChatNodeComponent";

const CanvasContent = () => {
  const { isDarkMode } = useTheme();
  
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
    resetTranscriptModal,
    isDraggingDocument,
    setIsDraggingDocument,
    showDocumentUpload,
    setShowDocumentUpload,
    pendingDocumentNode,
    setPendingDocumentNode,
    isUploading,
    setIsUploading,
    resetDocumentUpload,
    isDraggingChat,
    setIsDraggingChat,
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
    draggingNodeId: draggingVideoNodeId,
    addVideoNode,
    updateVideoNode,
    moveVideoNode,
    handleNodePointerDown: handleVideoNodePointerDown,
    handleNodePointerUp: handleVideoNodePointerUp,
    forceResetDragState: forceResetVideoDragState
  } = useVideoNodes();

  const {
    documentNodes,
    draggingNodeId: draggingDocumentNodeId,
    addDocumentNode,
    moveDocumentNode,
    handleNodePointerDown: handleDocumentNodePointerDown,
    handleNodePointerUp: handleDocumentNodePointerUp,
    forceResetDragState: forceResetDocumentDragState
  } = useDocumentNodes();

  const {
    chatNodes,
    draggingNodeId: draggingChatNodeId,
    addChatNode,
    moveChatNode,
    handleNodePointerDown: handleChatNodePointerDown,
    handleNodePointerUp: handleChatNodePointerUp,
    forceResetDragState: forceResetChatDragState,
  } = useChatNodes();

  const draggingNodeId = draggingVideoNodeId || draggingDocumentNodeId || draggingChatNodeId;

  const {
    handleVideoIconDragStart,
    handleDocumentIconDragStart,
    handleChatIconDragStart,
    handleCanvasDrop,
    handleCanvasDragOver,
    handleVideoUrlSubmit,
    handleDocumentUploadSubmit,
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
    forceResetDragState: () => {
      forceResetVideoDragState();
      forceResetDocumentDragState();
      forceResetChatDragState();
    },
    isDraggingDocument,
    setIsDraggingDocument,
    setPendingDocumentNode,
    setShowDocumentUpload,
    addDocumentNode,
    pendingDocumentNode,
    setIsUploading,
    resetDocumentUpload,
    isDraggingChat,
    setIsDraggingChat,
    addChatNode,
  });

  const sidebarTools: SidebarTool[] = [
    { id: "video", icon: YoutubeIcon, label: "Video" },
    { id: "filter", icon: Archive, label: "Filter" },
    { id: "history", icon: History, label: "History" },
    { id: "file-text", icon: FileTextIcon, label: "File" },
    { id: "folder", icon: Archive, label: "Folder" },
    { id: "rocket", icon: Bell, label: "Rocket" },
    { id: "chat", icon: Bell, label: "Chat" },
    { id: "help", icon: Bell, label: "Help" }
  ];

  const handleTranscriptModalClose = useCallback(() => {
    console.log("🔽 Closing transcript modal");
    resetTranscriptModal();
    
    console.log("🔄 Force resetting drag state on modal close");
    forceResetVideoDragState();
    forceResetDocumentDragState();
    forceResetChatDragState();
  }, [resetTranscriptModal, forceResetVideoDragState, forceResetDocumentDragState, forceResetChatDragState]);

  const handleCanvasPointerMove = useCallback((e: React.PointerEvent) => {
    if (draggingVideoNodeId) {
      moveVideoNode(draggingVideoNodeId, e.clientX, e.clientY, transform);
    } else if (draggingDocumentNodeId) {
      moveDocumentNode(draggingDocumentNodeId, e.clientX, e.clientY, transform);
    } else if (draggingChatNodeId) {
      moveChatNode(draggingChatNodeId, e, transform);
    } else {
      handlePointerMove(e, draggingNodeId, () => {});
    }
  }, [handlePointerMove, draggingVideoNodeId, moveVideoNode, draggingDocumentNodeId, moveDocumentNode, transform, draggingChatNodeId, moveChatNode]);

  const handleCanvasPointerUp = useCallback((e: React.PointerEvent) => {
    if (draggingVideoNodeId) {
      handleVideoNodePointerUp(e);
    } else if (draggingDocumentNodeId) {
      handleDocumentNodePointerUp(e);
    } else if (draggingChatNodeId) {
      handleChatNodePointerUp(e);
    }
    handlePointerUp(e);
  }, [draggingVideoNodeId, handleVideoNodePointerUp, handleDocumentNodePointerUp, draggingDocumentNodeId, handleChatNodePointerUp, draggingChatNodeId, handlePointerUp]);

  return (
    <div className={`min-h-screen relative overflow-hidden ${isDarkMode ? 'bg-zinc-900' : 'bg-gray-50'}`}>
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
            onPointerDown={handleVideoNodePointerDown}
            onTranscriptClick={handleTranscriptClick}
          />
        ))}

        {/* Document Nodes */}
        {documentNodes.map((node) => (
          <DocumentNodeComponent
            key={node.id}
            node={node}
            onPointerDown={handleDocumentNodePointerDown}
          />
        ))}

        {/* Chat Nodes */}
        {chatNodes.map((node) => (
          <ChatNodeComponent
            key={node.id}
            node={node}
            onPointerDown={handleChatNodePointerDown}
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

      {/* Document Upload Modal */}
      <DocumentUploadModal
        isOpen={showDocumentUpload}
        isUploading={isUploading}
        onSubmit={handleDocumentUploadSubmit}
        onClose={resetDocumentUpload}
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
        onDocumentDragStart={handleDocumentIconDragStart}
        onChatDragStart={handleChatIconDragStart}
      />

      {/* Navigation */}
      <CanvasNavigation />

      {/* Zoom indicator */}
      <ZoomIndicator scale={transform.scale} />
    </div>
  );
};

const Canvas = () => {
  return (
    <ThemeProvider>
      <CanvasContent />
    </ThemeProvider>
  );
};

export default Canvas;
