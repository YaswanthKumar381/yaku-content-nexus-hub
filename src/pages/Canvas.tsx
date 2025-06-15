
import { useCallback } from "react";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { useCanvasState } from "@/hooks/useCanvasState";
import { useCanvasTransform } from "@/hooks/useCanvasTransform";
import { useVideoNodes } from "@/hooks/useVideoNodes";
import { useDocumentNodes } from "@/hooks/useDocumentNodes";
import { useChatNodes } from "@/hooks/useChatNodes";
import { useConnections } from "@/hooks/useConnections";
import { useCanvasEvents } from "@/hooks/useCanvasEvents";
import { useCanvasInteraction } from "@/hooks/useCanvasInteraction";
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
  const transformResult = useCanvasTransform();
  const videoNodesResult = useVideoNodes();
  const documentNodesResult = useDocumentNodes();
  const chatNodesResult = useChatNodes();

  const allNodes = [...videoNodesResult.videoNodes, ...documentNodesResult.documentNodes, ...chatNodesResult.chatNodes];
  const allNodesMap = new Map(allNodes.map(node => [node.id, node]));

  const connectionsResult = useConnections(allNodesMap);

  const { draggingNodeId, handleCanvasPointerMove, handleCanvasPointerUp } = useCanvasInteraction({
    connectionsResult,
    videoNodesResult,
    documentNodesResult,
    chatNodesResult,
    transformResult,
  });
  
  const { transform, canvasContainerRef, handlePointerDown, handleTouchStart, handleTouchMove, handleTouchEnd } = transformResult;

  const forceResetAllDragState = useCallback(() => {
    videoNodesResult.forceResetDragState();
    documentNodesResult.forceResetDragState();
    chatNodesResult.forceResetDragState();
  }, [videoNodesResult, documentNodesResult, chatNodesResult]);

  const handleDeleteVideoNode = useCallback((nodeId: string) => {
    videoNodesResult.deleteVideoNode(nodeId);
    connectionsResult.removeConnectionsForNode(nodeId);
  }, [videoNodesResult, connectionsResult]);

  const handleDeleteDocumentNode = useCallback((nodeId: string) => {
    documentNodesResult.deleteDocumentNode(nodeId);
    connectionsResult.removeConnectionsForNode(nodeId);
  }, [documentNodesResult, connectionsResult]);
  
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
    addDocumentNode: documentNodesResult.addDocumentNode,
    pendingDocumentNode: canvasState.pendingDocumentNode,
    setIsUploading: canvasState.setIsUploading,
    resetDocumentUpload: canvasState.resetDocumentUpload,
    isDraggingChat: canvasState.isDraggingChat,
    setIsDraggingChat: canvasState.setIsDraggingChat,
    addChatNode: chatNodesResult.addChatNode,
    canvasContainerRef,
    transform,
    addVideoNode: videoNodesResult.addVideoNode,
    forceResetDragState: forceResetAllDragState,
  });

  const handleSendMessage = useCallback((nodeId: string, message: string) => {
    const connectedNodes = connectionsResult.connections
        .filter(conn => conn.targetId === nodeId)
        .map(conn => allNodesMap.get(conn.sourceId))
        .filter((node): node is VideoNode | DocumentNode => !!node && (node.type === 'video' || node.type === 'document'));
    
    const context = connectedNodes.map(node => {
        if(node.type === 'video') return `Video Title: ${node.title}\nTranscript: ${node.context || 'Not available'}`;
        if(node.type === 'document') return `Document Name: ${node.fileName}\nContent: ${node.content || 'Not available'}`;
        return '';
    }).join('\n\n---\n\n');

    chatNodesResult.sendMessage(nodeId, message, context);
  }, [connectionsResult.connections, allNodesMap, chatNodesResult.sendMessage]);

  const handleTranscriptModalClose = useCallback(() => {
    console.log("🔽 Closing transcript modal");
    canvasState.resetTranscriptModal();
    
    console.log("🔄 Force resetting drag state on modal close");
    forceResetAllDragState();
  }, [canvasState.resetTranscriptModal, forceResetAllDragState]);

  return (
    <div className={`min-h-screen relative overflow-hidden ${isDarkMode ? 'bg-zinc-900' : 'bg-gray-50'}`}>
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
          connections={connectionsResult.connections}
          allNodesMap={allNodesMap}
          connectingInfo={connectionsResult.connectingInfo}
          liveEndPoint={connectionsResult.liveEndPoint}
          isDarkMode={isDarkMode}
        />
        
        <NodeLayer
          videoNodes={videoNodesResult.videoNodes}
          documentNodes={documentNodesResult.documentNodes}
          chatNodes={chatNodesResult.chatNodes}
          onVideoNodePointerDown={videoNodesResult.handleNodePointerDown}
          onDocumentNodePointerDown={documentNodesResult.handleNodePointerDown}
          onChatNodePointerDown={chatNodesResult.handleNodePointerDown}
          onChatNodeResize={chatNodesResult.updateChatNodeHeight}
          onTranscriptClick={canvasEvents.handleTranscriptClick}
          onStartConnection={connectionsResult.startConnection}
          onEndConnection={connectionsResult.endConnection}
          onDeleteVideoNode={handleDeleteVideoNode}
          onDeleteDocumentNode={handleDeleteDocumentNode}
          onSendMessage={handleSendMessage}
          isSendingMessageNodeId={chatNodesResult.isSendingMessageNodeId}
        />
      </div>

      <VideoInputModal
        isOpen={canvasState.showVideoInput}
        videoUrl={canvasState.videoUrl}
        isCreating={canvasState.isCreatingNode}
        onUrlChange={canvasState.setVideoUrl}
        onSubmit={canvasEvents.handleVideoUrlSubmit}
        onCancel={canvasState.resetVideoInput}
      />

      <DocumentUploadModal
        isOpen={canvasState.showDocumentUpload}
        isUploading={canvasState.isUploading}
        onSubmit={canvasEvents.handleDocumentUploadSubmit}
        onClose={canvasState.resetDocumentUpload}
      />

      <TranscriptModal
        isOpen={canvasState.showTranscriptPopup}
        videoUrl={canvasState.currentVideoUrl}
        transcript={canvasState.currentTranscript}
        error={canvasState.transcriptError}
        onClose={handleTranscriptModalClose}
        onTranscriptChange={canvasState.setCurrentTranscript}
        onSave={() => {
          if (canvasState.currentVideoUrl) {
            const nodeToUpdate = videoNodesResult.videoNodes.find(node => node.url === canvasState.currentVideoUrl);
            if (nodeToUpdate) {
              videoNodesResult.updateVideoNode(
                nodeToUpdate.id,
                { context: canvasState.currentTranscript }
              );
            }
          }
          handleTranscriptModalClose();
        }}
      />

      <CanvasSidebar
        tools={sidebarTools}
        selectedTool={canvasState.selectedTool}
        onToolSelect={canvasState.setSelectedTool}
        onVideoDragStart={canvasEvents.handleVideoIconDragStart}
        onDocumentDragStart={canvasEvents.handleDocumentIconDragStart}
        onChatDragStart={canvasEvents.handleChatIconDragStart}
      />

      <CanvasNavigation />

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
