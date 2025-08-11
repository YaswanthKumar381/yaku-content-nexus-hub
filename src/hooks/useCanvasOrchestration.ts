
import { useCanvasState } from "@/hooks/useCanvasState";
import { useCanvasTransform } from "@/hooks/useCanvasTransform";
import { useCanvasEvents } from "@/hooks/useCanvasEvents";
import { useCanvasInteraction } from "@/hooks/useCanvasInteraction";
import { useCanvasNodes } from "@/hooks/useCanvasNodes";
import { useConnections } from "@/hooks/useConnections";
import { useCanvasHandlers } from "@/hooks/useCanvasHandlers";
import { useNodeGlow } from "@/hooks/useNodeGlow";

export const useCanvasOrchestration = () => {
  const canvasState = useCanvasState();
  const nodeGlowResult = useNodeGlow();
  const transformResult = useCanvasTransform({ onCanvasClick: nodeGlowResult.handleCanvasClick });

  // This is a bit of a hack to break the circular dependency.
  // We need connectionsResult to create nodesResult, but connectionsResult needs allNodesMap from nodesResult.
  // By passing a getter function for allNodesMap, we can defer its creation.
  const getNodesResult = () => nodesResult;

  const connectionsResult = useConnections(() => {
    const nodesResult = getNodesResult();
    const allNodes = [
      ...nodesResult.videoNodesResult.videoNodes,
      ...nodesResult.documentNodesResult.documentNodes,
      ...nodesResult.chatNodesResult.chatNodes,
      ...nodesResult.textNodesResult.textNodes,
      ...nodesResult.websiteNodesResult.websiteNodes,
      ...nodesResult.audioNodesResult.audioNodes,
      ...nodesResult.imageNodesResult.imageNodes,
      ...nodesResult.groupNodesResult.groupNodes
    ];
    return new Map(allNodes.map(node => [node.id, node]));
  });

  const nodesResult = useCanvasNodes({
    onNodeClick: nodeGlowResult.handleNodeClick,
    selectedNodeId: nodeGlowResult.selectedNodeId,
    addConnection: connectionsResult.addConnection,
    connections: connectionsResult.connections,
  });
  const handlersResult = useCanvasHandlers({ nodesResult, canvasState });

  const {
    videoNodesResult,
    documentNodesResult,
    chatNodesResult,
    textNodesResult,
    websiteNodesResult,
    audioNodesResult,
    imageNodesResult,
    groupNodesResult,
    contextUsage,
    uploadTargetNodeId,
    allNodes,
  } = nodesResult;

  const allNodesMap = new Map(allNodes.map(node => [node.id, node]));

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

  const interactionResult = useCanvasInteraction({
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

  return {
    canvasState,
    transformResult,
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
    interactionResult,
    eventsResult,
    nodeGlowResult,
    allNodesMap,
    uploadTargetNodeId,
    onDeleteVideoNode: handleDeleteVideoNode,
    onDeleteDocumentNode: handleDeleteDocumentNode,
    onDeleteDocumentFile: handleDeleteDocumentFile,
    onDeleteTextNode: handleDeleteTextNode,
    onDeleteWebsiteNode: handleDeleteWebsiteNode,
    onDeleteAudioNode: handleDeleteAudioNode,
    onDeleteImageNode: handleDeleteImageNode,
    onDeleteImageFile: handleDeleteImageFile,
    onDeleteGroupNode: handleDeleteGroupNode,
    onUpdateGroupNode: handleUpdateGroupNode,
    onDocumentNodeUploadClick: handleDocumentNodeUploadClick,
    onDocumentModalClose: handleDocumentModalClose,
    onImageNodeUploadClick: handleImageNodeUploadClick,
    onImageModalClose: handleImageModalClose,
    onAnalyzeImage: handleAnalyzeImage,
    onSendMessage: handleSendMessage,
    onTranscriptModalClose: handleTranscriptModalClose,
  };
};
