
import React from 'react';
import { VideoInputModal } from "@/components/canvas/VideoInputModal";
import { TranscriptModal } from "@/components/canvas/TranscriptModal";
import { DocumentUploadModal } from "@/components/canvas/DocumentUploadModal";

interface CanvasModalsProps {
  // Video Input Modal
  showVideoInput: boolean;
  videoUrl: string;
  isCreatingNode: boolean;
  onVideoUrlChange: (url: string) => void;
  onVideoUrlSubmit: () => void;
  onCancelVideoInput: () => void;

  // Document Upload Modal
  showDocumentUpload: boolean;
  isUploading: boolean;
  onDocumentUploadSubmit: (file: File) => void;
  onCloseDocumentUpload: () => void;

  // Transcript Modal
  showTranscriptPopup: boolean;
  currentVideoUrl: string;
  currentTranscript: string;
  transcriptError: string;
  onCloseTranscriptModal: () => void;
  onTranscriptChange: (transcript: string) => void;
  onSaveTranscript: () => void;
}

export const CanvasModals: React.FC<CanvasModalsProps> = ({
  showVideoInput,
  videoUrl,
  isCreatingNode,
  onVideoUrlChange,
  onVideoUrlSubmit,
  onCancelVideoInput,
  showDocumentUpload,
  isUploading,
  onDocumentUploadSubmit,
  onCloseDocumentUpload,
  showTranscriptPopup,
  currentVideoUrl,
  currentTranscript,
  transcriptError,
  onCloseTranscriptModal,
  onTranscriptChange,
  onSaveTranscript,
}) => {
  return (
    <>
      <VideoInputModal
        isOpen={showVideoInput}
        videoUrl={videoUrl}
        isCreating={isCreatingNode}
        onUrlChange={onVideoUrlChange}
        onSubmit={onVideoUrlSubmit}
        onCancel={onCancelVideoInput}
      />

      <DocumentUploadModal
        isOpen={showDocumentUpload}
        isUploading={isUploading}
        onSubmit={onDocumentUploadSubmit}
        onClose={onCloseDocumentUpload}
      />

      <TranscriptModal
        isOpen={showTranscriptPopup}
        videoUrl={currentVideoUrl}
        transcript={currentTranscript}
        error={transcriptError}
        onClose={onCloseTranscriptModal}
        onTranscriptChange={onTranscriptChange}
        onSave={onSaveTranscript}
      />
    </>
  );
};
