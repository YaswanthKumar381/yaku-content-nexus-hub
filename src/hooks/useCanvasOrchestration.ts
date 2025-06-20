
import { useCanvasState } from "@/hooks/useCanvasState";
import { useCanvasInteraction } from "@/hooks/useCanvasInteraction";

export const useCanvasOrchestration = () => {
  const canvasState = useCanvasState();
  
  // Mock transform object
  const transform = { x: 0, y: 0, scale: 1 };
  const canvasRef = { current: null };
  
  const interactionResult = useCanvasInteraction({
    canvasRef,
    transform,
    setTransform: () => {},
    selectedNodeIds: [],
    setSelectedNodeIds: () => {},
    onNodeMove: () => {},
  });

  // Return mock data to satisfy the Canvas component
  return {
    canvasState,
    transformResult: {
      transform,
      canvasContainerRef: canvasRef,
      handlePointerDown: () => {},
      handleTouchStart: () => {},
      handleTouchMove: () => {},
      handleTouchEnd: () => {},
    },
    interactionResult,
    eventsResult: {
      handleCanvasDrop: () => {},
      handleCanvasDragOver: () => {},
      handleTranscriptClick: () => {},
    },
    connectionsResult: {
      connections: [],
      connectingInfo: null,
      liveEndPoint: null,
      startConnection: () => {},
      endConnection: () => {},
      removeConnection: () => {},
      removeConnectionsForNode: () => {},
      addConnection: () => '',
    },
    videoNodesResult: {
      videoNodes: [],
      addVideoNode: async () => ({ id: '', x: 0, y: 0, url: '', title: '', type: 'video' as const }),
      deleteVideoNode: () => {},
      updateVideoNode: () => {},
      moveVideoNode: () => {},
      handleNodePointerDown: () => {},
      draggingNodeId: '',
      forceResetDragState: () => {},
    },
    documentNodesResult: {
      documentNodes: [],
      addDocumentNode: async () => ({ id: '', x: 0, y: 0, documents: [], type: 'document' as const }),
      deleteDocumentNode: () => {},
      handleNodePointerDown: () => {},
      draggingNodeId: '',
      forceResetDragState: () => {},
    },
    chatNodesResult: {
      chatNodes: [],
      addChatNode: () => ({ id: '', x: 0, y: 0, type: 'chat' as const, messages: [], height: 0 }),
      deleteChatNode: () => {},
      handleNodePointerDown: () => {},
      draggingNodeId: '',
      forceResetDragState: () => {},
    },
    textNodesResult: {
      textNodes: [],
      addTextNode: () => ({ id: '', x: 0, y: 0, type: 'text' as const, content: '', width: 0, height: 0 }),
      deleteTextNode: () => {},
      handleNodePointerDown: () => {},
      draggingNodeId: '',
      forceResetDragState: () => {},
    },
    websiteNodesResult: {
      websiteNodes: [],
      addWebsiteNode: async () => ({ id: '', x: 0, y: 0, type: 'website' as const, websites: [] }),
      deleteWebsiteNode: () => {},
      handleNodePointerDown: () => {},
      draggingNodeId: '',
      forceResetDragState: () => {},
    },
    audioNodesResult: {
      audioNodes: [],
      addAudioNode: () => ({ id: '', x: 0, y: 0, type: 'audio' as const, recordings: [] }),
      deleteAudioNode: () => {},
      handleNodePointerDown: () => {},
      draggingNodeId: '',
      forceResetDragState: () => {},
    },
    imageNodesResult: {
      imageNodes: [],
      addImageNode: async () => ({ id: '', x: 0, y: 0, type: 'image' as const, images: [] }),
      deleteImageNode: () => {},
      handleNodePointerDown: () => {},
      draggingNodeId: '',
      forceResetDragState: () => {},
    },
    groupNodesResult: {
      groupNodes: [],
      addGroupNode: () => ({ id: '', x: 0, y: 0, type: 'group' as const, title: '', width: 0, height: 0, containedNodes: [] }),
      deleteGroupNode: () => {},
      handleNodePointerDown: () => {},
      draggingNodeId: '',
      forceResetDragState: () => {},
    },
    contextUsage: { totalTokens: 0, usagePercentage: 0 },
    allNodesMap: new Map(),
    uploadTargetNodeId: null,
    onDeleteVideoNode: () => {},
    onDeleteDocumentNode: () => {},
    onDeleteDocumentFile: () => {},
    onDeleteTextNode: () => {},
    onDeleteWebsiteNode: () => {},
    onDeleteAudioNode: () => {},
    onDeleteImageNode: () => {},
    onDeleteImageFile: () => {},
    onDeleteGroupNode: () => {},
    onUpdateGroupNode: () => {},
    onDocumentNodeUploadClick: () => {},
    onDocumentModalClose: () => {},
    onImageNodeUploadClick: () => {},
    onImageModalClose: () => {},
    onAnalyzeImage: async () => {},
    onSendMessage: () => {},
    onTranscriptModalClose: () => {},
  };
};
