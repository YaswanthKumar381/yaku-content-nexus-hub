import { useCallback } from "react";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { useCanvasState } from "@/hooks/useCanvasState";
import { useCanvasTransform } from "@/hooks/useCanvasTransform";
import { useVideoNodes } from "@/hooks/useVideoNodes";
import { useDocumentNodes } from "@/hooks/useDocumentNodes";
import { useChatNodes } from "@/hooks/useChatNodes";
import { useConnections } from "@/hooks/useConnections";
import { useCanvasEvents } from "@/hooks/useCanvasEvents";
import { sidebarTools } from "@/config/sidebar";
import { VideoNode, DocumentNode } from "@/types/canvas";

import { VideoInputModal } from "@/components/canvas/VideoInputModal";
import { TranscriptModal } from "@/components/canvas/TranscriptModal";
import { DocumentUploadModal } from "@/components/canvas/DocumentUploadModal";
import { CanvasSidebar } from "@/components/canvas/CanvasSidebar";
import { CanvasNavigation } from "@/components/canvas/CanvasNavigation";
import { CanvasBackground } from "@/components/canvas/CanvasBackground";
import { ZoomIndicator } from "@/components/canvas/ZoomIndicator";
import { NodeLayer } from "@/components/canvas/NodeLayer";
import { ConnectionLayer } from "@/components/canvas/ConnectionLayer";

const CanvasContent = () => {
  const { isDarkMode } = useTheme();
  
  const canvasState = useCanvasState();

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
    isSendingMessageNodeId,
    addChatNode,
    moveChatNode,
    sendMessage,
    updateChatNodeHeight,
    handleNodePointerDown: handleChatNodePointerDown,
    handleNodePointerUp: handleChatNodePointerUp,
    forceResetDragState: forceResetChatDragState,
  } = useChatNodes();

  const draggingNodeId = draggingVideoNodeId || draggingDocumentNodeId || draggingChatNodeId;
  
  const allNodes = [...videoNodes, ...documentNodes, ...chatNodes];
  const allNodesMap = new Map(allNodes.map(node => [node.id, node]));

  const { 
    connections, 
    connectingInfo, 
    liveEndPoint, 
    setLiveEndPoint, 
    startConnection, 
    endConnection, 
    clearConnectionState 
  } = useConnections(allNodesMap);

  const handleSendMessage = useCallback((nodeId: string, message: string) => {
    const connectedNodes = connections
        .filter(conn => conn.targetId === nodeId)
        .map(conn => allNodesMap.get(conn.sourceId))
        .filter((node): node is VideoNode | DocumentNode => !!node && (node.type === 'video' || node.type === 'document'));
    
    const context = connectedNodes.map(node => {
        if(node.type === 'video') return `Video Title: ${node.title}\nTranscript: ${node.context || 'Not available'}`;
        if(node.type === 'document') return `Document Name: ${node.fileName}\nContent: ${node.content || 'Not available'}`;
        return '';
    }).join('\n\n---\n\n');

    sendMessage(nodeId, message, context);
  }, [connections, allNodesMap, sendMessage]);

  const canvasEvents = useCanvasEvents({
    isDraggingVideo: canvasState.isDraggingVideo,
    setIsDraggingVideo: canvasState.setIsDraggingVideo,
    setPendingVideoNode: canvasState.setPendingVideoNode,
    setShowVideoInput: canvasState.setShowVideoInput,
    pendingVideoNode: canvasState.pendingVideoNode,
    videoUrl: canvasState.videoUrl,
    setIsCreatingNode: canvasState.setIsCreatingNode,
    resetVideoInput: canvasState.resetVideoInput,
    setCurrentVideoUrl: canvasState.setCurrentVideoUrl,
    setShowTranscriptPopup: canvasState.setShowTranscriptPopup,
    setCurrentTranscript: canvasState.setCurrentTranscript,
    setTranscriptError: canvasState.setTranscriptError,
    isDraggingDocument: canvasState.isDraggingDocument,
    setIsDraggingDocument: canvasState.setIsDraggingDocument,
    setPendingDocumentNode: canvasState.setPendingDocumentNode,
    setShowDocumentUpload: canvasState.setShowDocumentUpload,
    addDocumentNode,
    pendingDocumentNode: canvasState.pendingDocumentNode,
    setIsUploading: canvasState.setIsUploading,
    resetDocumentUpload: canvasState.resetDocumentUpload,
    isDraggingChat: canvasState.isDraggingChat,
    setIsDraggingChat: canvasState.setIsDraggingChat,
    addChatNode,
    canvasContainerRef,
    transform,
    addVideoNode,
    forceResetDragState: () => {
      forceResetVideoDragState();
      forceResetDocumentDragState();
      forceResetChatDragState();
    },
  });

  const handleTranscriptModalClose = useCallback(() => {
    console.log("🔽 Closing transcript modal");
    canvasState.resetTranscriptModal();
    
    console.log("🔄 Force resetting drag state on modal close");
    forceResetVideoDragState();
    forceResetDocumentDragState();
    forceResetChatDragState();
  }, [canvasState.resetTranscriptModal, forceResetVideoDragState, forceResetDocumentDragState, forceResetChatDragState]);

  const handleCanvasPointerMove = useCallback((e: React.PointerEvent) => {
    if (connectingInfo) {
      const rect = canvasContainerRef.current?.getBoundingClientRect();
      if (rect) {
        setLiveEndPoint({
          x: (e.clientX - rect.left - transform.x) / transform.scale,
          y: (e.clientY - rect.top - transform.y) / transform.scale,
        });
      }
    } else if (draggingVideoNodeId) {
      moveVideoNode(draggingVideoNodeId, e, transform);
    } else if (draggingDocumentNodeId) {
      moveDocumentNode(draggingDocumentNodeId, e, transform);
    } else if (draggingChatNodeId) {
      moveChatNode(draggingChatNodeId, e, transform);
    } else {
      handlePointerMove(e, draggingNodeId, () => {});
    }
  }, [handlePointerMove, draggingVideoNodeId, moveVideoNode, draggingDocumentNodeId, moveDocumentNode, transform, draggingChatNodeId, moveChatNode, connectingInfo, canvasContainerRef, setLiveEndPoint]);

  const handleCanvasPointerUp = useCallback((e: React.PointerEvent) => {
    if (draggingVideoNodeId) {
      handleVideoNodePointerUp(e);
    } else if (draggingDocumentNodeId) {
      handleDocumentNodePointerUp(e);
    } else if (draggingChatNodeId) {
      handleChatNodePointerUp(e);
    }
    handlePointerUp(e);

    if (connectingInfo) {
      clearConnectionState();
    }
  }, [draggingVideoNodeId, handleVideoNodePointerUp, handleDocumentNodePointerUp, draggingDocumentNodeId, handleChatNodePointerUp, draggingChatNodeId, handlePointerUp, connectingInfo, clearConnectionState]);

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
        onDrop={canvasEvents.handleCanvasDrop}
        onDragOver={canvasEvents.handleCanvasDragOver}
        style={{ 
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transformOrigin: '0 0'
        }}
      >
        <CanvasBackground transform={transform} />

        <ConnectionLayer 
          connections={connections}
          allNodesMap={allNodesMap}
          connectingInfo={connectingInfo}
          liveEndPoint={liveEndPoint}
          isDarkMode={isDarkMode}
        />
        
        <NodeLayer
          videoNodes={videoNodes}
          documentNodes={documentNodes}
          chatNodes={chatNodes}
          onVideoNodePointerDown={handleVideoNodePointerDown}
          onDocumentNodePointerDown={handleDocumentNodePointerDown}
          onChatNodePointerDown={handleChatNodePointerDown}
          onChatNodeResize={updateChatNodeHeight}
          onTranscriptClick={canvasEvents.handleTranscriptClick}
          onStartConnection={startConnection}
          onEndConnection={endConnection}
          onSendMessage={handleSendMessage}
          isSendingMessageNodeId={isSendingMessageNodeId}
        />
      </div>

      {/* Video URL Input Modal */}
      <VideoInputModal
        isOpen={canvasState.showVideoInput}
        videoUrl={canvasState.videoUrl}
        isCreating={canvasState.isCreatingNode}
        onUrlChange={canvasState.setVideoUrl}
        onSubmit={canvasEvents.handleVideoUrlSubmit}
        onCancel={canvasState.resetVideoInput}
      />

      {/* Document Upload Modal */}
      <DocumentUploadModal
        isOpen={canvasState.showDocumentUpload}
        isUploading={canvasState.isUploading}
        onSubmit={canvasEvents.handleDocumentUploadSubmit}
        onClose={canvasState.resetDocumentUpload}
      />

      {/* Transcript Options Popup */}
      <TranscriptModal
        isOpen={canvasState.showTranscriptPopup}
        videoUrl={canvasState.currentVideoUrl}
        transcript={canvasState.currentTranscript}
        error={canvasState.transcriptError}
        onClose={handleTranscriptModalClose}
        onTranscriptChange={canvasState.setCurrentTranscript}
        onSave={() => {
          if (canvasState.currentVideoUrl) {
            const nodeToUpdate = videoNodes.find(node => node.url === canvasState.currentVideoUrl);
            if (nodeToUpdate) {
              updateVideoNode(
                nodeToUpdate.id,
                { context: canvasState.currentTranscript }
              );
            }
          }
          handleTranscriptModalClose();
        }}
      />

      {/* Floating Left Sidebar */}
      <CanvasSidebar
        tools={sidebarTools}
        selectedTool={canvasState.selectedTool}
        onToolSelect={canvasState.setSelectedTool}
        onVideoDragStart={canvasEvents.handleVideoIconDragStart}
        onDocumentDragStart={canvasEvents.handleDocumentIconDragStart}
        onChatDragStart={canvasEvents.handleChatIconDragStart}
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
