
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
import { useContextUsage } from "@/hooks/useContextUsage";
import { sidebarTools } from "@/config/sidebar";
import { VideoNode, DocumentNode, TextNode } from "@/types/canvas";

import { CanvasSidebar } from "@/components/canvas/CanvasSidebar";
import { CanvasNavigation } from "@/components/canvas/CanvasNavigation";
import { ZoomIndicator } from "@/components/canvas/ZoomIndicator";
import { CanvasArea } from "@/components/canvas/CanvasArea";
import { CanvasModals } from "@/components/canvas/CanvasModals";

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
  const contextUsage = useContextUsage(allNodesMap, connectionsResult.connections, chatNodesResult.chatNodes);

  const interactionResult = useCanvasInteraction({
    connectionsResult,
    videoNodesResult,
    documentNodesResult,
    chatNodesResult,
    textNodesResult,
    transformResult,
  });
  
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

  const { resetDocumentUpload, resetTranscriptModal } = canvasState;

  const handleDocumentModalClose = useCallback(() => {
    resetDocumentUpload();
    setUploadTargetNodeId(null);
  }, [resetDocumentUpload]);
  
  const eventsResult = useCanvasEvents({
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
    canvasContainerRef: transformResult.canvasContainerRef,
    transform: transformResult.transform,
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
  }, [connectionsResult.connections, allNodesMap, chatNodesResult]);

  const handleTranscriptModalClose = useCallback(() => {
    resetTranscriptModal();
    forceResetAllDragState();
  }, [resetTranscriptModal, forceResetAllDragState]);

  return (
    <div className={`min-h-screen relative overflow-hidden ${isDarkMode ? 'bg-zinc-900' : 'bg-gray-50'}`}>
      <CanvasArea
        transformResult={transformResult}
        interactionResult={interactionResult}
        eventsResult={eventsResult}
        connectionsResult={connectionsResult}
        videoNodesResult={videoNodesResult}
        documentNodesResult={documentNodesResult}
        chatNodesResult={chatNodesResult}
        textNodesResult={textNodesResult}
        allNodesMap={allNodesMap}
        onDeleteVideoNode={handleDeleteVideoNode}
        onDeleteDocumentNode={handleDeleteDocumentNode}
        onDeleteDocumentFile={handleDeleteDocumentFile}
        onDocumentNodeUploadClick={handleDocumentNodeUploadClick}
        onDeleteTextNode={handleDeleteTextNode}
        onSendMessage={handleSendMessage}
      />

      <CanvasModals
        canvasState={canvasState}
        eventsResult={eventsResult}
        videoNodesResult={videoNodesResult}
        uploadTargetNodeId={uploadTargetNodeId}
        onDocumentModalClose={handleDocumentModalClose}
        onTranscriptModalClose={handleTranscriptModalClose}
      />

      <CanvasSidebar
        tools={sidebarTools}
        selectedTool={canvasState.selectedTool}
        onToolSelect={canvasState.setSelectedTool}
        onVideoDragStart={eventsResult.handleVideoIconDragStart}
        onDocumentDragStart={eventsResult.handleDocumentIconDragStart}
        onChatDragStart={eventsResult.handleChatIconDragStart}
        onTextDragStart={eventsResult.handleTextIconDragStart}
      />

      <CanvasNavigation contextUsage={contextUsage} />

      <ZoomIndicator scale={transformResult.transform.scale} />
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
