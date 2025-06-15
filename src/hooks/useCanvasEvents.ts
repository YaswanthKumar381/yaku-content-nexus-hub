
import { useCallback } from "react";
import { VideoNode } from "@/types/canvas";

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
  forceResetDragState
}: UseCanvasEventsProps) => {
  const handleVideoIconDragStart = useCallback((e: React.DragEvent) => {
    setIsDraggingVideo(true);
    e.dataTransfer.setData("text/plain", "video");
  }, [setIsDraggingVideo]);

  const handleCanvasDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!isDraggingVideo) return;

    const rect = canvasContainerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left - transform.x) / transform.scale;
    const y = (e.clientY - rect.top - transform.y) / transform.scale;

    setPendingVideoNode({ x, y });
    setShowVideoInput(true);
    setIsDraggingVideo(false);
  }, [isDraggingVideo, transform, canvasContainerRef, setPendingVideoNode, setShowVideoInput, setIsDraggingVideo]);

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
    handleCanvasDrop,
    handleCanvasDragOver,
    handleVideoUrlSubmit,
    handleTranscriptClick
  };
};
