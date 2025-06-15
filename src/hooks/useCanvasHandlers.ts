
import { useCallback } from "react";
import { VideoNode, DocumentNode, TextNode, WebsiteNode, AudioNode, ImageNode } from "@/types/canvas";
import type { useCanvasNodes } from "@/hooks/useCanvasNodes";
import type { useCanvasState } from "@/hooks/useCanvasState";

interface UseCanvasHandlersProps {
  nodesResult: ReturnType<typeof useCanvasNodes>;
  canvasState: ReturnType<typeof useCanvasState>;
}

export const useCanvasHandlers = ({ nodesResult, canvasState }: UseCanvasHandlersProps) => {
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
    allNodesMap,
    setUploadTargetNodeId,
  } = nodesResult;

  const forceResetAllDragState = useCallback(() => {
    videoNodesResult.forceResetDragState();
    documentNodesResult.forceResetDragState();
    chatNodesResult.forceResetDragState();
    textNodesResult.forceResetDragState();
    websiteNodesResult.forceResetDragState();
    audioNodesResult.forceResetDragState();
    imageNodesResult.forceResetDragState();
    groupNodesResult.forceResetDragState();
  }, [videoNodesResult, documentNodesResult, chatNodesResult, textNodesResult, websiteNodesResult, audioNodesResult, imageNodesResult, groupNodesResult]);

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

  const handleDeleteAudioNode = useCallback((nodeId: string) => {
    audioNodesResult.deleteAudioNode(nodeId);
    connectionsResult.removeConnectionsForNode(nodeId);
  }, [audioNodesResult, connectionsResult]);

  const handleDeleteImageNode = useCallback((nodeId: string) => {
    imageNodesResult.deleteImageNode(nodeId);
    connectionsResult.removeConnectionsForNode(nodeId);
  }, [imageNodesResult, connectionsResult]);

  const handleDeleteImageFile = useCallback((nodeId: string, imageId: string) => {
    const node = imageNodesResult.imageNodes.find(n => n.id === nodeId);
    if (node && node.images.length === 1 && node.images[0].id === imageId) {
        connectionsResult.removeConnectionsForNode(nodeId);
    }
    imageNodesResult.deleteImageFromNode(nodeId, imageId);
  }, [imageNodesResult, connectionsResult]);

  const handleDeleteGroupNode = useCallback((nodeId: string) => {
    groupNodesResult.deleteGroupNode(nodeId);
    connectionsResult.removeConnectionsForNode(nodeId);
  }, [groupNodesResult, connectionsResult]);

  const handleUpdateGroupNode = useCallback((nodeId: string, updates: Partial<Omit<import('@/types/canvas').GroupNode, 'id' | 'type'>>) => {
    groupNodesResult.updateGroupNode(nodeId, updates);
    // Update contained nodes after resizing
    if (updates.width || updates.height) {
      groupNodesResult.updateContainedNodes(nodeId, allNodesMap);
    }
  }, [groupNodesResult, allNodesMap]);

  const handleDocumentNodeUploadClick = useCallback((nodeId: string) => {
    setUploadTargetNodeId(nodeId);
    canvasState.setShowDocumentUpload(true);
  }, [canvasState, setUploadTargetNodeId]);

  const handleImageNodeUploadClick = useCallback((nodeId: string) => {
    setUploadTargetNodeId(nodeId);
    canvasState.setShowImageUpload(true);
  }, [canvasState, setUploadTargetNodeId]);

  const handleImageModalClose = useCallback(() => {
    canvasState.resetImageUpload();
    setUploadTargetNodeId(null);
  }, [canvasState, setUploadTargetNodeId]);

  const handleDocumentModalClose = useCallback(() => {
    canvasState.resetDocumentUpload();
    setUploadTargetNodeId(null);
  }, [canvasState, setUploadTargetNodeId]);

  const handleAnalyzeImage = useCallback(async (nodeId: string, imageId: string, prompt?: string) => {
    // Check both possible API key storage formats
    const apiKey = localStorage.getItem('groq-api-key') || localStorage.getItem('groq_api_key');
    
    console.log('🔍 Checking for Groq API key:', { 
      hasKey: !!apiKey, 
      keyLength: apiKey?.length || 0,
      storage: localStorage.getItem('groq-api-key') ? 'groq-api-key' : 'groq_api_key'
    });
    
    if (!apiKey) {
      console.error('❌ No Groq API key found in localStorage');
      alert('Please set your Groq API key in the settings (gear icon in top right)');
      return;
    }
    
    try {
      console.log('🧠 Starting image analysis for:', { nodeId, imageId, hasPrompt: !!prompt });
      await imageNodesResult.analyzeImage(nodeId, imageId, apiKey, prompt);
      console.log('✅ Image analysis completed successfully');
    } catch (error) {
      console.error('❌ Image analysis failed:', error);
      if (error instanceof Error && error.message.includes('API')) {
        alert('Image analysis failed. Please check your Groq API key in settings.');
      } else {
        alert('Image analysis failed. Please try again.');
      }
    }
  }, [imageNodesResult]);

  const handleSendMessage = useCallback((nodeId: string, message: string) => {
    const connectedNodes = connectionsResult.connections
        .filter(conn => conn.targetId === nodeId)
        .map(conn => allNodesMap.get(conn.sourceId))
        .filter((node): node is VideoNode | DocumentNode | TextNode | WebsiteNode | AudioNode | ImageNode | import('@/types/canvas').GroupNode => 
          !!node && (node.type === 'video' || node.type === 'document' || node.type === 'text' || node.type === 'website' || node.type === 'audio' || node.type === 'image' || node.type === 'group'));
    
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
        if(node.type === 'audio') {
          const audioContent = node.recordings.map(r => `Audio Recording:\nTranscript: ${r.transcript || 'Transcript not available'}`).join('\n\n');
          return `Audio Node Content:\n${audioContent}`;
        }
        if(node.type === 'image') {
          const imageContent = node.images.map(img => `Image: ${img.fileName}\nAnalysis: ${img.analysis || 'Image analysis not available'}`).join('\n\n');
          return `Image Node Content:\n${imageContent}`;
        }
        if(node.type === 'group') {
          return groupNodesResult.getGroupContext(node.id, allNodesMap);
        }
        return '';
    }).join('\n\n---\n\n');

    chatNodesResult.sendMessage(nodeId, message, context);
  }, [connectionsResult.connections, allNodesMap, chatNodesResult, groupNodesResult]);

  const handleTranscriptModalClose = useCallback(() => {
    canvasState.resetTranscriptModal();
    forceResetAllDragState();
  }, [canvasState, forceResetAllDragState]);

  return {
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
    handleImageNodeUploadClick,
    handleImageModalClose,
    handleDocumentModalClose,
    handleAnalyzeImage,
    handleSendMessage,
    handleTranscriptModalClose,
  };
};
