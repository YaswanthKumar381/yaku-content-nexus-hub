
import { useCallback, useState } from "react";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { useCanvasState } from "@/hooks/useCanvasState";
import { useCanvasTransform } from "@/hooks/useCanvasTransform";
import { useVideoNodes } from "@/hooks/useVideoNodes";
import { useDocumentNodes } from "@/hooks/useDocumentNodes";
import { useChatNodes } from "@/hooks/useChatNodes";
import { useTextNodes } from "@/hooks/useTextNodes";
import { useConnections } from "@/hooks/useConnections";
import { useCanvasEvents } from "@/hooks/useCanvasEvents";
import { useCanvasInteraction } from "@/hooks/useCanvasInteraction";
import { sidebarTools } from "@/config/sidebar";
import { VideoNode, DocumentNode, TextNode } from "@/types/canvas";

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
  const textNodesResult = useTextNodes();

  const [uploadTargetNodeId, setUploadTargetNodeId] = useState<string | null>(null);

  const allNodes = [...videoNodesResult.videoNodes, ...documentNodesResult.documentNodes, ...chatNodesResult.chatNodes, ...textNodesResult.textNodes];
  const allNodesMap = new Map(allNodes.map(node => [node.id, node]));

  const connectionsResult = useConnections(allNodesMap);

  const { draggingNodeId, handleCanvasPointerMove, handleCanvasPointerUp } = useCanvasInteraction({
    connectionsResult,
    videoNodesResult,
    documentNodesResult,
    chatNodesResult,
    textNodesResult,
    transformResult,
  });
  
  const { transform, canvasContainerRef, handlePointerDown, handleTouchStart, handleTouchMove, handleTouchEnd } = transformResult;

  const forceResetAllDragState = useCallback(() => {
    videoNodesResult.forceResetDragState();
    documentNodesResult.forceResetDragState();
    chatNodesResult.forceResetDragState();
    textNodesResult.forceResetDragState();
  }, [videoNodesResult, documentNodesResult, chatNodesResult, textNodesResult]);

  const handleDeleteVideoNode = useCallback((nodeId: string) => {
    videoNodesResult.deleteVideoNode(nodeId);
    connectionsResult.removeConnectionsForNode(nodeId);
  }, [videoNodesResult, connectionsResult]);

  const handleDeleteDocumentNode = useCallback((nodeId: string) => {
    documentNodesResult.deleteDocumentNode(nodeId);
    connectionsResult.removeConnectionsForNode(nodeId);
  }, [documentNodesResult, connectionsResult]);

  const handleDeleteDocumentFile = useCallback((nodeId: string, fileId: string) => {
    const node = documentNodesResult.documentNodes.find(n => n.id === nodeId);
    // If it's the last file, the node will be deleted, so we should clean up connections.
    if (node && node.documents.length === 1 && node.documents[0].id === fileId) {
        connectionsResult.removeConnectionsForNode(nodeId);
    }
    documentNodesResult.deleteDocumentFromFileNode(nodeId, fileId);
  }, [documentNodesResult, connectionsResult]);

  const handleDeleteTextNode = useCallback((nodeId: string) => {
    textNodesResult.deleteTextNode(nodeId);
    connectionsResult.removeConnectionsForNode(nodeId);
  }, [textNodesResult, connectionsResult]);

  const handleDocumentNodeUploadClick = useCallback((nodeId: string) => {
    setUploadTargetNodeId(nodeId);
    canvasState.setShowDocumentUpload(true);
  }, [canvasState]);

  const handleDocumentModalClose = useCallback(() => {
    canvasState.resetDocumentUpload();
    setUploadTargetNodeId(null);
  }, [canvasState]);
  
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
    addDocumentsToNode: documentNodesResult.addDocumentsToNode,
    uploadTargetNodeId: uploadTargetNodeId,
    pendingDocumentNode: canvasState.pendingDocumentNode,
    setIsUploading: canvasState.setIsUploading,
    resetDocumentUpload: handleDocumentModalClose,
    isDraggingChat: canvasState.isDraggingChat,
    setIsDraggingChat: canvasState.setIsDraggingChat,
    addChatNode: chatNodesResult.addChatNode,
    isDraggingText: canvasState.isDraggingText,
    setIsDraggingText: canvasState.setIsDraggingText,
    addTextNode: textNodesResult.addTextNode,
    canvasContainerRef,
    transform,
    addVideoNode: videoNodesResult.addVideoNode,
    forceResetDragState: forceResetAllDragState,
  });

  const handleSendMessage = useCallback((nodeId: string, message: string) => {
    const connectedNodes = connectionsResult.connections
        .filter(conn => conn.targetId === nodeId)
        .map(conn => allNodesMap.get(conn.sourceId))
        .filter((node): node is VideoNode | DocumentNode | TextNode => !!node && (node.type === 'video' || node.type === 'document' || node.type === 'text'));
    
    const context = connectedNodes.map(node => {
        if(node.type === 'video') return `Video Title: ${node.title}\nTranscript: ${node.context || 'Not available'}`;
        if(node.type === 'document') {
          const docContent = node.documents.map(d => `Document: ${d.fileName}\nContent: ${d.content || 'Content not available'}`).join('\n\n');
          return `Document Node Content:\n${docContent}`;
        }
        if(node.type === 'text') return `Text Note:\n${node.content || 'Not available'}`;
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
          onDeleteConnection={connectionsResult.removeConnection}
        />
        
        <NodeLayer
          videoNodes={videoNodesResult.videoNodes}
          documentNodes={documentNodesResult.documentNodes}
          chatNodes={chatNodesResult.chatNodes}
          textNodes={textNodesResult.textNodes}
          onVideoNodePointerDown={videoNodesResult.handleNodePointerDown}
          onDocumentNodePointerDown={documentNodesResult.handleNodePointerDown}
          onChatNodePointerDown={chatNodesResult.handleNodePointerDown}
          onTextNodePointerDown={textNodesResult.handleNodePointerDown}
          onChatNodeResize={chatNodesResult.updateChatNodeHeight}
          onTranscriptClick={canvasEvents.handleTranscriptClick}
          onStartConnection={connectionsResult.startConnection}
          onEndConnection={connectionsResult.endConnection}
          onDeleteVideoNode={handleDeleteVideoNode}
          onDeleteDocumentNode={handleDeleteDocumentNode}
          onDeleteDocumentFile={handleDeleteDocumentFile}
          onDocumentNodeUploadClick={handleDocumentNodeUploadClick}
          onDeleteTextNode={handleDeleteTextNode}
          onUpdateTextNode={textNodesResult.updateTextNode}
          onSendMessage={handleSendMessage}
          isSendingMessageNodeId={chatNodesResult.isSendingMessageNodeId}
          connections={connectionsResult.connections}
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
        onClose={handleDocumentModalClose}
        mode={uploadTargetNodeId ? 'update' : 'create'}
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
        onTextDragStart={canvasEvents.handleTextIconDragStart}
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
