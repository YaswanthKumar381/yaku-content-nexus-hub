
import { useState, useCallback } from "react";
import { VideoNode } from "@/types/canvas";

export const useCanvasState = () => {
  const [selectedTool, setSelectedTool] = useState<string>("select");
  const [isDraggingVideo, setIsDraggingVideo] = useState(false);
  const [showVideoInput, setShowVideoInput] = useState(false);
  const [pendingVideoNode, setPendingVideoNode] = useState<{ x: number; y: number } | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [showTranscriptPopup, setShowTranscriptPopup] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [transcriptError, setTranscriptError] = useState("");
  const [isCreatingNode, setIsCreatingNode] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");

  const resetVideoInput = useCallback(() => {
    setShowVideoInput(false);
    setPendingVideoNode(null);
    setVideoUrl("");
  }, []);

  const resetTranscriptModal = useCallback(() => {
    setShowTranscriptPopup(false);
    setCurrentTranscript("");
    setTranscriptError("");
    setCurrentVideoUrl("");
  }, []);

  return {
    selectedTool,
    setSelectedTool,
    isDraggingVideo,
    setIsDraggingVideo,
    showVideoInput,
    setShowVideoInput,
    pendingVideoNode,
    setPendingVideoNode,
    videoUrl,
    setVideoUrl,
    showTranscriptPopup,
    setShowTranscriptPopup,
    currentTranscript,
    setCurrentTranscript,
    transcriptError,
    setTranscriptError,
    isCreatingNode,
    setIsCreatingNode,
    currentVideoUrl,
    setCurrentVideoUrl,
    resetVideoInput,
    resetTranscriptModal
  };
};
