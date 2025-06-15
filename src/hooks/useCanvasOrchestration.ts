
import { useCallback, useState } from "react";
import { useCanvasState } from "@/hooks/useCanvasState";
import { useCanvasTransform } from "@/hooks/useCanvasTransform";
import { useVideoNodes } from "@/hooks/useVideoNodes";
import { useDocumentNodes } from "@/hooks/useDocumentNodes";
import { useChatNodes } from "@/hooks/useChatNodes";
import { useTextNodes } from "@/hooks/useTextNodes";
import { useWebsiteNodes } from "@/hooks/useWebsiteNodes";
import { useConnections } from "@/hooks/useConnections";
import { useCanvasEvents } from "@/hooks/useCanvasEvents";
import { useCanvasInteraction } from "@/hooks/useCanvasInteraction";
import { useContextUsage } from "@/hooks/useContextUsage";
import { VideoNode, DocumentNode, TextNode, WebsiteNode } from "@/types/canvas";

export const useCanvasOrchestration = () => {
  const canvasState = useCanvasState();
  const transformResult = useCanvasTransform();
  const videoNodesResult = useVideoNodes();
  const documentNodesResult = useDocumentNodes();
  const chatNodesResult = useChatNodes();
  const textNodesResult = useTextNodes();
  const websiteNodesResult = useWebsiteNodes();

  const [uploadTargetNodeId, setUploadTargetNodeId] = useState<string | null>(null);

  const allNodes = [...videoNodesResult.videoNodes, ...documentNodesResult.documentNodes, ...chatNodesResult.chatNodes, ...textNodesResult.textNodes, ...websiteNodesResult.websiteNodes];
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
    websiteNodesResult.forceResetDragState();
  }, [videoNodesResult, documentNodesResult, chatNodesResult, textNodesResult, websiteNodesResult]);

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
    if (node && node.documents.length === 1 && node.documents[0].id === fileId) {
        connectionsResult.removeConnectionsForNode(nodeId);
    }
    documentNodesResult.deleteDocumentFromFileNode(nodeId, fileId);
  }, [documentNodesResult, connectionsResult]);

  const handleDeleteTextNode = useCallback((nodeId: string) => {
    textNodesResult.deleteTextNode(nodeId);
    connectionsResult.removeConnectionsForNode(nodeId);
  }, [textNodesResult, connectionsResult]);

  const handleDeleteWebsiteNode = useCallback((nodeId: string) => {
    websiteNodesResult.deleteWebsiteNode(nodeId);
    connectionsResult.removeConnectionsForNode(nodeId);
  }, [websiteNodesResult, connectionsResult]);

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
    isDraggingWebsite: canvasState.isDraggingWebsite,
    setIsDraggingWebsite: canvasState.setIsDraggingWebsite,
    addWebsiteNode: websiteNodesResult.addWebsiteNode,
    setPendingWebsiteNode: canvasState.setPendingWebsiteNode,
    setShowWebsiteInput: canvasState.setShowWebsiteInput,
    pendingWebsiteNode: canvasState.pendingWebsiteNode,
    setIsScrapingWebsites: canvasState.setIsScrapingWebsites,
    resetWebsiteInput: canvasState.resetWebsiteInput,
    canvasContainerRef: transformResult.canvasContainerRef,
    transform: transformResult.transform,
    addVideoNode: videoNodesResult.addVideoNode,
    forceResetDragState: forceResetAllDragState,
  });

  const handleSendMessage = useCallback((nodeId: string, message: string) => {
    const connectedNodes = connectionsResult.connections
        .filter(conn => conn.targetId === nodeId)
        .map(conn => allNodesMap.get(conn.sourceId))
        .filter((node): node is VideoNode | DocumentNode | TextNode | WebsiteNode => !!node && (node.type === 'video' || node.type === 'document' || node.type === 'text' || node.type === 'website'));
    
    const context = connectedNodes.map(node => {
        if(node.type === 'video') return `Video Title: ${node.title}\nTranscript: ${node.context || 'Not available'}`;
        if(node.type === 'document') {
          const docContent = node.documents.map(d => `Document: ${d.fileName}\nContent: ${d.content || 'Content not available'}`).join('\n\n');
          return `Document Node Content:\n${docContent}`;
        }
        if(node.type === 'text') return `Text Note:\n${node.content || 'Not available'}`;
        if(node.type === 'website') {
          const websiteContent = node.websites.map(w => `Website: ${w.title}\nURL: ${w.url}\nContent: ${w.content || 'Content not available'}`).join('\n\n');
          return `Website Node Content:\n${websiteContent}`;
        }
        return '';
    }).join('\n\n---\n\n');

    chatNodesResult.sendMessage(nodeId, message, context);
  }, [connectionsResult.connections, allNodesMap, chatNodesResult]);

  const handleTranscriptModalClose = useCallback(() => {
    resetTranscriptModal();
    forceResetAllDragState();
  }, [resetTranscriptModal, forceResetAllDragState]);

  return {
    canvasState,
    transformResult,
    videoNodesResult,
    documentNodesResult,
    chatNodesResult,
    textNodesResult,
    websiteNodesResult,
    connectionsResult,
    contextUsage,
    interactionResult,
    eventsResult,
    allNodesMap,
    uploadTargetNodeId,
    onDeleteVideoNode: handleDeleteVideoNode,
    onDeleteDocumentNode: handleDeleteDocumentNode,
    onDeleteDocumentFile: handleDeleteDocumentFile,
    onDeleteTextNode: handleDeleteTextNode,
    onDeleteWebsiteNode: handleDeleteWebsiteNode,
    onDocumentNodeUploadClick: handleDocumentNodeUploadClick,
    onDocumentModalClose: handleDocumentModalClose,
    onSendMessage: handleSendMessage,
    onTranscriptModalClose: handleTranscriptModalClose,
  };
};
