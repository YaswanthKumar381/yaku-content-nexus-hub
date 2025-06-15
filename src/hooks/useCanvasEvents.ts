
import { useCallback } from "react";
import { VideoNode, DocumentNode, ChatNode, TextNode } from "@/types/canvas";

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
  pendingDocumentNode: { x: number; y: number } | null;
  setIsUploading: (value: boolean) => void;
  resetDocumentUpload: () => void;
  isDraggingChat: boolean;
  setIsDraggingChat: (value: boolean) => void;
  addChatNode: (x: number, y: number) => ChatNode;
  isDraggingText: boolean;
  setIsDraggingText: (value: boolean) => void;
  addTextNode: (x: number, y: number) => TextNode;
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
  pendingDocumentNode,
  setIsUploading,
  resetDocumentUpload,
  isDraggingChat,
  setIsDraggingChat,
  addChatNode,
  isDraggingText,
  setIsDraggingText,
  addTextNode,
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
    }
  }, [isDraggingVideo, isDraggingDocument, isDraggingChat, isDraggingText, transform, canvasContainerRef, setPendingVideoNode, setShowVideoInput, setIsDraggingVideo, setPendingDocumentNode, setShowDocumentUpload, setIsDraggingDocument, addChatNode, setIsDraggingChat, addTextNode, setIsDraggingText]);

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
    if (!pendingDocumentNode) return;
    setIsUploading(true);
    try {
      await addDocumentNode(pendingDocumentNode.x, pendingDocumentNode.y, files);
      resetDocumentUpload();
    } catch (error) {
      console.error("❌ Error creating document node:", error);
    } finally {
      setIsUploading(false);
    }
  }, [pendingDocumentNode, addDocumentNode, resetDocumentUpload, setIsUploading]);

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
    handleTranscriptClick
  };
};
