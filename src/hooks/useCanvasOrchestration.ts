
import { useCanvasState } from "@/hooks/useCanvasState";
import { useCanvasTransform } from "@/hooks/useCanvasTransform";
import { useCanvasEvents } from "@/hooks/useCanvasEvents";
import { useCanvasInteraction } from "@/hooks/useCanvasInteraction";
import { useCanvasNodes } from "@/hooks/useCanvasNodes";
import { useCanvasHandlers } from "@/hooks/useCanvasHandlers";
import { useCanvasHistory } from "@/hooks/useCanvasHistory";

interface UseCanvasOrchestrationProps {
  canvasContainerRef: React.RefObject<HTMLDivElement>;
}

export const useCanvasOrchestration = ({ canvasContainerRef }: UseCanvasOrchestrationProps) => {
  const canvasState = useCanvasState();
  const transformResult = useCanvasTransform();
  const nodesResult = useCanvasNodes();
  const handlersResult = useCanvasHandlers({ nodesResult, canvasState });
  const canvasHistory = useCanvasHistory();

  // Update transform result with the passed canvasContainerRef
  transformResult.canvasContainerRef = canvasContainerRef;

  const {
    videoNodesResult,
    documentNodesResult,
    chatNodesResult,
    textNodesResult,
    websiteNodesResult,
    audioNodesResult,
    imageNodesResult,
    groupNodesResult,
    connectionsResult,
    contextUsage,
    allNodesMap,
    uploadTargetNodeId,
  } = nodesResult;

  const {
    forceResetAllDragState,
    handleDeleteVideoNode,
    handleDeleteDocumentNode,
    handleDeleteDocumentFile,
    handleDeleteTextNode,
    handleDeleteWebsiteNode,
    handleDeleteAudioNode,
    handleDeleteImageNode,
    handleDeleteImageFile,
    handleDeleteGroupNode,
    handleUpdateGroupNode,
    handleDocumentNodeUploadClick,
    handleDocumentModalClose,
    handleImageNodeUploadClick,
    handleImageModalClose,
    handleAnalyzeImage,
    handleSendMessage,
    handleTranscriptModalClose,
  } = handlersResult;

  const canvasInteraction = useCanvasInteraction({
    connectionsResult,
    videoNodesResult,
    documentNodesResult,
    chatNodesResult,
    textNodesResult,
    websiteNodesResult,
    audioNodesResult,
    imageNodesResult,
    groupNodesResult,
    transformResult,
  });
  
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
    isDraggingWebsite: canvasState.isDraggingWebsite,
    setIsDraggingWebsite: canvasState.setIsDraggingWebsite,
    addWebsiteNode: websiteNodesResult.addWebsiteNode,
    setPendingWebsiteNode: canvasState.setPendingWebsiteNode,
    setShowWebsiteInput: canvasState.setShowWebsiteInput,
    pendingWebsiteNode: canvasState.pendingWebsiteNode,
    setIsScrapingWebsites: canvasState.setIsScrapingWebsites,
    resetWebsiteInput: canvasState.resetWebsiteInput,
    isDraggingAudio: canvasState.isDraggingAudio,
    setIsDraggingAudio: canvasState.setIsDraggingAudio,
    addAudioNode: audioNodesResult.addAudioNode,
    isDraggingImage: canvasState.isDraggingImage,
    setIsDraggingImage: canvasState.setIsDraggingImage,
    addImageNode: imageNodesResult.addImageNode,
    setPendingImageNode: canvasState.setPendingImageNode,
    setShowImageUpload: canvasState.setShowImageUpload,
    pendingImageNode: canvasState.pendingImageNode,
    setIsUploadingImages: canvasState.setIsUploadingImages,
    resetImageUpload: canvasState.resetImageUpload,
    addImagesToNode: imageNodesResult.addImagesToNode,
    isDraggingGroup: canvasState.isDraggingGroup,
    setIsDraggingGroup: canvasState.setIsDraggingGroup,
    addGroupNode: groupNodesResult.addGroupNode,
    canvasContainerRef: transformResult.canvasContainerRef,
    transform: transformResult.transform,
    addVideoNode: videoNodesResult.addVideoNode,
    forceResetDragState: forceResetAllDragState,
  });

  // Canvas handlers for drag and drop events
  const canvasHandlers = {
    onDrop: canvasEvents.handleCanvasDrop,
    onDragOver: canvasEvents.handleCanvasDragOver,
  };

  return {
    // Node creation functions
    addChatNode: chatNodesResult.addChatNode,
    addTextNode: textNodesResult.addTextNode,
    addVideoNode: videoNodesResult.addVideoNode,
    addImageNode: imageNodesResult.addImageNode,
    addAudioNode: audioNodesResult.addAudioNode,
    addDocumentNode: documentNodesResult.addDocumentNode,
    addWebsiteNode: websiteNodesResult.addWebsiteNode,
    addGroupNode: groupNodesResult.addGroupNode,
    
    // Node management
    deleteNode: handleDeleteVideoNode, // Generic delete function
    duplicateNode: () => {}, // TODO: Implement if needed
    
    // Connection functions
    startConnection: connectionsResult.startConnection,
    endConnection: connectionsResult.endConnection,
    deleteConnection: connectionsResult.removeConnection,
    
    // Canvas functions
    moveNodesToFront: () => {}, // TODO: Implement if needed
    
    // Core objects
    canvasHandlers,
    canvasInteraction,
    canvasState,
    canvasTransform: transformResult,
    chatNodes: chatNodesResult,
    textNodes: textNodesResult,
    videoNodes: videoNodesResult,
    audioNodes: audioNodesResult,
    imageNodes: imageNodesResult,
    documentNodes: documentNodesResult,
    websiteNodes: websiteNodesResult,
    groupNodes: groupNodesResult,
    connections: connectionsResult,
    canvasHistory,
  };
};
