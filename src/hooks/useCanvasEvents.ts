import { useCallback } from "react";
import { VideoNode, DocumentNode, ChatNode, TextNode, WebsiteNode, AudioNode, ImageNode } from "@/types/canvas";

interface UseCanvasEventsProps {
  isDraggingVideo: boolean;
  setIsDraggingVideo: (value: boolean) => void;
  setPendingVideoNode: (value: { x: number; y: number } | null) => void;
  setShowVideoInput: (value: boolean) => void;
  canvasContainerRef: React.RefObject<HTMLDivElement>;
  transform: { x: number; y: number; scale: number };
  addVideoNode: (x: number, y: number, url: string) => Promise<VideoNode>;
  pendingVideoNode: { x: number; y: number } | null;
  videoUrl: string;
  setIsCreatingNode: (value: boolean) => void;
  resetVideoInput: () => void;
  setCurrentVideoUrl: (url: string) => void;
  setShowTranscriptPopup: (value: boolean) => void;
  setCurrentTranscript: (value: string) => void;
  setTranscriptError: (value: string) => void;
  forceResetDragState: () => void;
  // Document related props
  isDraggingDocument: boolean;
  setIsDraggingDocument: (value: boolean) => void;
  setPendingDocumentNode: (value: { x: number; y: number } | null) => void;
  setShowDocumentUpload: (value: boolean) => void;
  addDocumentNode: (x: number, y: number, files: File[]) => Promise<DocumentNode>;
  addDocumentsToNode: (nodeId: string, files: File[]) => Promise<void>;
  uploadTargetNodeId: string | null;
  pendingDocumentNode: { x: number; y: number } | null;
  setIsUploading: (value: boolean) => void;
  resetDocumentUpload: () => void;
  isDraggingChat: boolean;
  setIsDraggingChat: (value: boolean) => void;
  addChatNode: (x: number, y: number) => ChatNode;
  isDraggingText: boolean;
  setIsDraggingText: (value: boolean) => void;
  addTextNode: (x: number, y: number) => TextNode;
  isDraggingWebsite: boolean;
  setIsDraggingWebsite: (value: boolean) => void;
  addWebsiteNode: (x: number, y: number, urls: string[]) => Promise<WebsiteNode>;
  setPendingWebsiteNode: (value: { x: number; y: number } | null) => void;
  setShowWebsiteInput: (value: boolean) => void;
  pendingWebsiteNode: { x: number; y: number } | null;
  setIsScrapingWebsites: (value: boolean) => void;
  resetWebsiteInput: () => void;
  isDraggingAudio: boolean;
  setIsDraggingAudio: (value: boolean) => void;
  addAudioNode: (x: number, y: number) => AudioNode;
  isDraggingImage: boolean;
  setIsDraggingImage: (value: boolean) => void;
  addImageNode: (x: number, y: number, files: File[]) => Promise<ImageNode>;
  setPendingImageNode: (value: { x: number; y: number } | null) => void;
  setShowImageUpload: (value: boolean) => void;
  pendingImageNode: { x: number; y: number } | null;
  setIsUploadingImages: (value: boolean) => void;
  resetImageUpload: () => void;
  addImagesToNode: (nodeId: string, files: File[]) => Promise<void>;
  // Group related props
  isDraggingGroup: boolean;
  setIsDraggingGroup: (value: boolean) => void;
  addGroupNode: (x: number, y: number) => import('@/types/canvas').GroupNode;
}

export const useCanvasEvents = ({
  isDraggingVideo,
  setIsDraggingVideo,
  setPendingVideoNode,
  setShowVideoInput,
  canvasContainerRef,
  transform,
  addVideoNode,
  pendingVideoNode,
  videoUrl,
  setIsCreatingNode,
  resetVideoInput,
  setCurrentVideoUrl,
  setShowTranscriptPopup,
  setCurrentTranscript,
  setTranscriptError,
  forceResetDragState,
  // Document props
  isDraggingDocument,
  setIsDraggingDocument,
  setPendingDocumentNode,
  setShowDocumentUpload,
  addDocumentNode,
  addDocumentsToNode,
  uploadTargetNodeId,
  pendingDocumentNode,
  setIsUploading,
  resetDocumentUpload,
  isDraggingChat,
  setIsDraggingChat,
  addChatNode,
  isDraggingText,
  setIsDraggingText,
  addTextNode,
  isDraggingWebsite,
  setIsDraggingWebsite,
  addWebsiteNode,
  setPendingWebsiteNode,
  setShowWebsiteInput,
  pendingWebsiteNode,
  setIsScrapingWebsites,
  resetWebsiteInput,
  isDraggingAudio,
  setIsDraggingAudio,
  addAudioNode,
  isDraggingImage,
  setIsDraggingImage,
  addImageNode,
  setPendingImageNode,
  setShowImageUpload,
  pendingImageNode,
  setIsUploadingImages,
  resetImageUpload,
  addImagesToNode,
  // Group props
  isDraggingGroup,
  setIsDraggingGroup,
  addGroupNode,
}: UseCanvasEventsProps) => {
  const handleVideoIconDragStart = useCallback((e: React.DragEvent) => {
    setIsDraggingVideo(true);
    e.dataTransfer.setData("text/plain", "video");
  }, [setIsDraggingVideo]);

  const handleDocumentIconDragStart = useCallback((e: React.DragEvent) => {
    setIsDraggingDocument(true);
    e.dataTransfer.setData("text/plain", "document");
  }, [setIsDraggingDocument]);

  const handleChatIconDragStart = useCallback((e: React.DragEvent) => {
    setIsDraggingChat(true);
    e.dataTransfer.setData("text/plain", "chat");
  }, [setIsDraggingChat]);

  const handleTextIconDragStart = useCallback((e: React.DragEvent) => {
    setIsDraggingText(true);
    e.dataTransfer.setData("text/plain", "text");
  }, [setIsDraggingText]);

  const handleWebsiteDragStart = useCallback((e: React.DragEvent) => {
    setIsDraggingWebsite(true);
    e.dataTransfer.setData("text/plain", "website");
  }, [setIsDraggingWebsite]);

  const handleAudioDragStart = useCallback((e: React.DragEvent) => {
    setIsDraggingAudio(true);
    e.dataTransfer.setData("text/plain", "audio");
  }, [setIsDraggingAudio]);

  const handleImageDragStart = useCallback((e: React.DragEvent) => {
    setIsDraggingImage(true);
    e.dataTransfer.setData("text/plain", "image");
  }, [setIsDraggingImage]);

  const handleGroupDragStart = useCallback((e: React.DragEvent) => {
    setIsDraggingGroup(true);
    e.dataTransfer.setData("text/plain", "group");
  }, [setIsDraggingGroup]);

  const handleCanvasDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();

    const rect = canvasContainerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left - transform.x) / transform.scale;
    const y = (e.clientY - rect.top - transform.y) / transform.scale;

    const dragType = e.dataTransfer.getData("text/plain");

    if (dragType === 'video' && isDraggingVideo) {
      setPendingVideoNode({ x, y });
      setShowVideoInput(true);
      setIsDraggingVideo(false);
    } else if (dragType === 'document' && isDraggingDocument) {
      setPendingDocumentNode({ x, y });
      setShowDocumentUpload(true);
      setIsDraggingDocument(false);
    } else if (dragType === 'chat' && isDraggingChat) {
      addChatNode(x, y);
      setIsDraggingChat(false);
    } else if (dragType === 'text' && isDraggingText) {
      addTextNode(x, y);
      setIsDraggingText(false);
    } else if (dragType === 'website' && isDraggingWebsite) {
      setPendingWebsiteNode({ x, y });
      setShowWebsiteInput(true);
      setIsDraggingWebsite(false);
    } else if (dragType === 'image' && isDraggingImage) {
      setPendingImageNode({ x, y });
      setShowImageUpload(true);
      setIsDraggingImage(false);
    } else if (dragType === 'audio' && isDraggingAudio) {
      addAudioNode(x, y);
      setIsDraggingAudio(false);
    } else if (dragType === 'group' && isDraggingGroup) {
      addGroupNode(x, y);
      setIsDraggingGroup(false);
    }
  }, [isDraggingVideo, isDraggingDocument, isDraggingChat, isDraggingText, isDraggingWebsite, isDraggingImage, isDraggingAudio, isDraggingGroup, transform, canvasContainerRef, setPendingVideoNode, setShowVideoInput, setIsDraggingVideo, setPendingDocumentNode, setShowDocumentUpload, setIsDraggingDocument, addChatNode, setIsDraggingChat, addTextNode, setIsDraggingText, setPendingWebsiteNode, setShowWebsiteInput, setIsDraggingWebsite, setPendingImageNode, setShowImageUpload, setIsDraggingImage, addAudioNode, setIsDraggingAudio, addGroupNode, setIsDraggingGroup]);

  const handleCanvasDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleVideoUrlSubmit = useCallback(async () => {
    if (!pendingVideoNode || !videoUrl.trim()) return;

    setIsCreatingNode(true);
    console.log("🎬 Creating video node with URL:", videoUrl);

    try {
      await addVideoNode(pendingVideoNode.x, pendingVideoNode.y, videoUrl);
      resetVideoInput();
      console.log("✅ Video node created successfully");
    } catch (error) {
      console.error("❌ Error creating video node:", error);
    } finally {
      setIsCreatingNode(false);
    }
  }, [pendingVideoNode, videoUrl, addVideoNode, setIsCreatingNode, resetVideoInput]);

  const handleDocumentUploadSubmit = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    setIsUploading(true);
    try {
      if (uploadTargetNodeId) {
        await addDocumentsToNode(uploadTargetNodeId, files);
      } else if (pendingDocumentNode) {
        await addDocumentNode(pendingDocumentNode.x, pendingDocumentNode.y, files);
      }
      resetDocumentUpload();
    } catch (error) {
      console.error("❌ Error creating/updating document node:", error);
    } finally {
      setIsUploading(false);
    }
  }, [pendingDocumentNode, addDocumentNode, resetDocumentUpload, setIsUploading, uploadTargetNodeId, addDocumentsToNode]);

  const handleImageUploadSubmit = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    setIsUploadingImages(true);
    try {
      if (uploadTargetNodeId) {
        await addImagesToNode(uploadTargetNodeId, files);
      } else if (pendingImageNode) {
        await addImageNode(pendingImageNode.x, pendingImageNode.y, files);
      }
      resetImageUpload();
    } catch (error) {
      console.error("❌ Error creating/updating image node:", error);
    } finally {
      setIsUploadingImages(false);
    }
  }, [pendingImageNode, addImageNode, resetImageUpload, setIsUploadingImages, uploadTargetNodeId, addImagesToNode]);

  const handleWebsiteUrlSubmit = useCallback(async (urls: string[]) => {
    if (!pendingWebsiteNode || urls.length === 0) return;

    setIsScrapingWebsites(true);
    console.log("🌐 Creating website node with URLs:", urls);

    try {
      await addWebsiteNode(pendingWebsiteNode.x, pendingWebsiteNode.y, urls);
      resetWebsiteInput();
      console.log("✅ Website node created successfully");
    } catch (error) {
      console.error("❌ Error creating website node:", error);
    } finally {
      setIsScrapingWebsites(false);
    }
  }, [pendingWebsiteNode, addWebsiteNode, setIsScrapingWebsites, resetWebsiteInput]);

  const handleTranscriptClick = useCallback(async (e: React.MouseEvent, node: VideoNode) => {
    console.log("🎯 Transcript button clicked for:", node.url);
    e.stopPropagation();
    e.preventDefault();
    
    // Force reset any dragging state immediately
    console.log("🔄 Force resetting drag state before opening modal");
    forceResetDragState();
    
    setCurrentVideoUrl(node.url);
    setShowTranscriptPopup(true);
    setCurrentTranscript("");
    setTranscriptError("");
  }, [forceResetDragState, setCurrentVideoUrl, setShowTranscriptPopup, setCurrentTranscript, setTranscriptError]);

  return {
    handleVideoIconDragStart,
    handleDocumentIconDragStart,
    handleChatIconDragStart,
    handleTextIconDragStart,
    handleCanvasDrop,
    handleCanvasDragOver,
    handleVideoUrlSubmit,
    handleDocumentUploadSubmit,
    handleTranscriptClick,
    handleWebsiteDragStart,
    handleWebsiteUrlSubmit,
    handleAudioDragStart,
    handleImageDragStart,
    handleImageUploadSubmit,
    handleGroupDragStart,
  };
};
