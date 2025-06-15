import { useState } from "react";

export const useCanvasState = () => {
  const [selectedTool, setSelectedTool] = useState<string>('video');
  
  // Video state
  const [isDraggingVideo, setIsDraggingVideo] = useState(false);
  const [showVideoInput, setShowVideoInput] = useState(false);
  const [pendingVideoNode, setPendingVideoNode] = useState<{ x: number; y: number } | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [isCreatingNode, setIsCreatingNode] = useState(false);
  const [showTranscriptPopup, setShowTranscriptPopup] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [transcriptError, setTranscriptError] = useState('');

  // Document state
  const [isDraggingDocument, setIsDraggingDocument] = useState(false);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [pendingDocumentNode, setPendingDocumentNode] = useState<{ x: number; y: number } | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Chat state
  const [isDraggingChat, setIsDraggingChat] = useState(false);

  // Text state
  const [isDraggingText, setIsDraggingText] = useState(false);

  // Website state
  const [isDraggingWebsite, setIsDraggingWebsite] = useState(false);
  const [showWebsiteInput, setShowWebsiteInput] = useState(false);
  const [pendingWebsiteNode, setPendingWebsiteNode] = useState<{ x: number; y: number } | null>(null);
  const [isScrapingWebsites, setIsScrapingWebsites] = useState(false);

  // Audio state
  const [isDraggingAudio, setIsDraggingAudio] = useState(false);

  // Image state
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [pendingImageNode, setPendingImageNode] = useState<{ x: number; y: number } | null>(null);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  // Group state
  const [isDraggingGroup, setIsDraggingGroup] = useState(false);

  const resetVideoInput = () => {
    setShowVideoInput(false);
    setPendingVideoNode(null);
    setVideoUrl('');
    setIsCreatingNode(false);
  };

  const resetDocumentUpload = () => {
    setShowDocumentUpload(false);
    setPendingDocumentNode(null);
    setIsUploading(false);
  };

  const resetWebsiteInput = () => {
    setShowWebsiteInput(false);
    setPendingWebsiteNode(null);
    setIsScrapingWebsites(false);
  };

  const resetImageUpload = () => {
    setShowImageUpload(false);
    setPendingImageNode(null);
    setIsUploadingImages(false);
  };

  const resetTranscriptModal = () => {
    setShowTranscriptPopup(false);
    setCurrentVideoUrl('');
    setCurrentTranscript('');
    setTranscriptError('');
  };

  return {
    selectedTool,
    setSelectedTool,
    
    // Video
    isDraggingVideo,
    setIsDraggingVideo,
    showVideoInput,
    setShowVideoInput,
    pendingVideoNode,
    setPendingVideoNode,
    videoUrl,
    setVideoUrl,
    isCreatingNode,
    setIsCreatingNode,
    resetVideoInput,
    showTranscriptPopup,
    setShowTranscriptPopup,
    currentVideoUrl,
    setCurrentVideoUrl,
    currentTranscript,
    setCurrentTranscript,
    transcriptError,
    setTranscriptError,
    resetTranscriptModal,

    // Document
    isDraggingDocument,
    setIsDraggingDocument,
    showDocumentUpload,
    setShowDocumentUpload,
    pendingDocumentNode,
    setPendingDocumentNode,
    isUploading,
    setIsUploading,
    resetDocumentUpload,

    // Chat
    isDraggingChat,
    setIsDraggingChat,

    // Text
    isDraggingText,
    setIsDraggingText,

    // Website
    isDraggingWebsite,
    setIsDraggingWebsite,
    showWebsiteInput,
    setShowWebsiteInput,
    pendingWebsiteNode,
    setPendingWebsiteNode,
    isScrapingWebsites,
    setIsScrapingWebsites,
    resetWebsiteInput,

    // Audio
    isDraggingAudio,
    setIsDraggingAudio,

    // Image
    isDraggingImage,
    setIsDraggingImage,
    showImageUpload,
    setShowImageUpload,
    pendingImageNode,
    setPendingImageNode,
    isUploadingImages,
    setIsUploadingImages,
    resetImageUpload,

    // Group
    isDraggingGroup,
    setIsDraggingGroup,
  };
};
