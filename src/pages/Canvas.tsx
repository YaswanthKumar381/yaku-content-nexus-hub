
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
import { useInteractionLogic } from "@/hooks/useInteractionLogic";
import { sidebarTools } from "@/config/sidebar";
import { VideoNode, DocumentNode } from "@/types/canvas";

import { CanvasSidebar } from "@/components/canvas/CanvasSidebar";
import { CanvasNavigation } from "@/components/canvas/CanvasNavigation";
import { ZoomIndicator } from "@/components/canvas/ZoomIndicator";
import { CanvasContainer } from "@/components/canvas/CanvasContainer";
import { CanvasOverlays } from "@/components/canvas/CanvasOverlays";
import { CanvasModals } from "@/components/canvas/CanvasModals";

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
  
  const { transform, canvasContainerRef, handlePointerDown, handleTouchStart, handleTouchMove, handleTouchEnd } = transformResult;

  const interactionLogic = useInteractionLogic({
    connectionsResult,
    chatNodesResult,
    canvasContainerRef,
  });

  const { draggingNodeId, handleCanvasPointerMove, handleCanvasPointerUp } = useCanvasInteraction({
    connectionsResult,
    videoNodesResult,
    documentNodesResult,
    chatNodesResult,
    transformResult,
  });
  
  const forceResetAllDragState = useCallback(() => {
    videoNodesResult.forceResetDragState();
    documentNodesResult.forceResetDragState();
    chatNodesResult.forceResetDragState();
  }, [videoNodesResult, documentNodesResult, chatNodesResult]);
  
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
  }, [canvasState, forceResetAllDragState]);

  const handleSaveTranscript = useCallback(() => {
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
  }, [canvasState, videoNodesResult, handleTranscriptModalClose]);

  return (
    <div className={`min-h-screen relative overflow-hidden ${isDarkMode ? 'bg-zinc-900' : 'bg-gray-50'}`}>
      <CanvasContainer
        canvasContainerRef={canvasContainerRef}
        transform={transform}
        isDarkMode={isDarkMode}
        onPointerDown={(e) => handlePointerDown(e, draggingNodeId)}
        onPointerMove={handleCanvasPointerMove}
        onPointerUp={handleCanvasPointerUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onDrop={canvasEvents.handleCanvasDrop}
        onDragOver={canvasEvents.handleCanvasDragOver}
        connections={connectionsResult.connections}
        allNodesMap={allNodesMap}
        connectingInfo={connectionsResult.connectingInfo}
        liveEndPoint={connectionsResult.liveEndPoint}
        onConnectionDoubleClick={interactionLogic.handleConnectionDoubleClick}
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
        onSendMessage={handleSendMessage}
        isSendingMessageNodeId={chatNodesResult.isSendingMessageNodeId}
        onNodeDoubleClick={interactionLogic.handleNodeDoubleClick}
      />

      <CanvasOverlays
        nodeToEdit={interactionLogic.nodeToEdit}
        connectionToEdit={interactionLogic.connectionToEdit}
        popoverPosition={interactionLogic.popoverPosition}
        nodeToDelete={interactionLogic.nodeToDelete}
        onClosePopover={interactionLogic.closePopover}
        onDeleteNodeRequest={interactionLogic.handleDeleteNodeRequest}
        onDisconnect={interactionLogic.handleDisconnect}
        onConfirmDeleteNode={interactionLogic.handleConfirmDeleteNode}
        onCancelDelete={interactionLogic.handleCancelDelete}
      />
      
      <CanvasModals
        showVideoInput={canvasState.showVideoInput}
        videoUrl={canvasState.videoUrl}
        isCreatingNode={canvasState.isCreatingNode}
        onVideoUrlChange={canvasState.setVideoUrl}
        onVideoUrlSubmit={canvasEvents.handleVideoUrlSubmit}
        onCancelVideoInput={canvasState.resetVideoInput}
        showDocumentUpload={canvasState.showDocumentUpload}
        isUploading={canvasState.isUploading}
        onDocumentUploadSubmit={canvasEvents.handleDocumentUploadSubmit}
        onCloseDocumentUpload={canvasState.resetDocumentUpload}
        showTranscriptPopup={canvasState.showTranscriptPopup}
        currentVideoUrl={canvasState.currentVideoUrl}
        currentTranscript={canvasState.currentTranscript}
        transcriptError={canvasState.transcriptError}
        onCloseTranscriptModal={handleTranscriptModalClose}
        onTranscriptChange={canvasState.setCurrentTranscript}
        onSaveTranscript={handleSaveTranscript}
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
