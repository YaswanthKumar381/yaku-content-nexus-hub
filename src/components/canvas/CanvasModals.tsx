
import React from 'react';
import { VideoInputModal } from './VideoInputModal';
import { DocumentUploadModal } from './DocumentUploadModal';
import { TranscriptModal } from './TranscriptModal';
import { WebsiteInputModal } from './WebsiteInputModal';

// Import hook return types
import type { useCanvasState } from '@/hooks/useCanvasState';
import type { useCanvasEvents } from '@/hooks/useCanvasEvents';
import type { useVideoNodes } from '@/hooks/useVideoNodes';
import type { useDocumentNodes } from '@/hooks/useDocumentNodes';
import type { useWebsiteNodes } from '@/hooks/useWebsiteNodes';

interface CanvasModalsProps {
  canvasState: ReturnType<typeof useCanvasState>;
  eventsResult: ReturnType<typeof useCanvasEvents>;
  videoNodesResult: ReturnType<typeof useVideoNodes>;
  documentNodesResult: ReturnType<typeof useDocumentNodes>;
  websiteNodesResult: ReturnType<typeof useWebsiteNodes>;
  uploadTargetNodeId: string | null;
  onDocumentModalClose: () => void;
  onTranscriptModalClose: () => void;
}

export const CanvasModals: React.FC<CanvasModalsProps> = ({
  canvasState,
  eventsResult,
  videoNodesResult,
  documentNodesResult,
  websiteNodesResult,
  uploadTargetNodeId,
  onDocumentModalClose,
  onTranscriptModalClose,
}) => {
  const targetNode = uploadTargetNodeId ? documentNodesResult.documentNodes.find(n => n.id === uploadTargetNodeId) : null;
  const existingFiles = targetNode ? targetNode.documents : [];

  return (
    <>
      <VideoInputModal
        isOpen={canvasState.showVideoInput}
        videoUrl={canvasState.videoUrl}
        isCreating={canvasState.isCreatingNode}
        onUrlChange={canvasState.setVideoUrl}
        onSubmit={eventsResult.handleVideoUrlSubmit}
        onCancel={canvasState.resetVideoInput}
      />

      <DocumentUploadModal
        isOpen={canvasState.showDocumentUpload}
        isUploading={canvasState.isUploading}
        onSubmit={eventsResult.handleDocumentUploadSubmit}
        onClose={onDocumentModalClose}
        mode={uploadTargetNodeId ? 'update' : 'create'}
        existingFiles={existingFiles}
      />

      <WebsiteInputModal
        isOpen={canvasState.showWebsiteInput}
        onClose={canvasState.resetWebsiteInput}
        onSubmit={eventsResult.handleWebsiteUrlSubmit}
        isLoading={canvasState.isScrapingWebsites}
      />

      <TranscriptModal
        isOpen={canvasState.showTranscriptPopup}
        videoUrl={canvasState.currentVideoUrl}
        transcript={canvasState.currentTranscript}
        error={canvasState.transcriptError}
        onClose={onTranscriptModalClose}
        onTranscriptChange={canvasState.setCurrentTranscript}
        onSave={() => {
          if (canvasState.currentVideoUrl) {
            const nodeToUpdate = videoNodesResult.videoNodes.find(node => node.url === canvasState.currentVideoUrl);
            if (nodeToUpdate) {
              videoNodesResult.updateVideoNode(
                nodeToUpdate.id,
                { context: canvasState.currentTranscript }
              );
            }
          }
          onTranscriptModalClose();
        }}
      />
    </>
  );
};
