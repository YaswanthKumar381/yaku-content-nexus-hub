import React, { useRef, useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { CanvasArea } from '@/components/canvas/CanvasArea';
import { CanvasSidebar } from '@/components/canvas/CanvasSidebar';
import { CanvasNavigation } from '@/components/canvas/CanvasNavigation';
import { CanvasModals } from '@/components/canvas/CanvasModals';
import { useCanvasOrchestration } from '@/hooks/useCanvasOrchestration';

const Canvas = () => {
  const {
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
    allNodesMap,
    uploadTargetNodeId,
    onDeleteVideoNode,
    onDeleteDocumentNode,
    onDeleteDocumentFile,
    onDeleteTextNode,
    onDeleteWebsiteNode,
    onDeleteAudioNode,
    onDeleteImageNode,
    onDeleteImageFile,
    onDeleteGroupNode,
    onUpdateGroupNode,
    onDocumentNodeUploadClick,
    onDocumentModalClose,
    onImageNodeUploadClick,
    onImageModalClose,
    onAnalyzeImage,
    onSendMessage,
    onTranscriptModalClose,
  } = useCanvasOrchestration();

  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'z') {
        event.preventDefault();
        handleUndo();
      }
      if ((event.metaKey || event.ctrlKey) && event.key === 'y') {
        event.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Enable undo/redo functionality
  const handleUndo = () => {
    console.log('Undo action triggered');
    // TODO: Implement undo functionality
  };

  const handleRedo = () => {
    console.log('Redo action triggered');
    // TODO: Implement redo functionality
  };

  return (
    <ThemeProvider>
      <div className="h-screen w-screen overflow-hidden bg-zinc-950 relative">
        <CanvasNavigation 
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={true} // Enable undo button
          canRedo={true} // Enable redo button
        />
        
        <div className="flex h-full pt-16">
          <CanvasSidebar />
          
          <div className="flex-1 relative">
            <CanvasArea
              ref={canvasRef}
              transform={transformResult.transform}
              videoNodes={videoNodesResult.videoNodes}
              documentNodes={documentNodesResult.documentNodes}
              chatNodes={chatNodesResult.chatNodes}
              textNodes={textNodesResult.textNodes}
              websiteNodes={websiteNodesResult.websiteNodes}
              audioNodes={audioNodesResult.audioNodes}
              imageNodes={imageNodesResult.imageNodes}
              groupNodes={groupNodesResult.groupNodes}
              connections={connectionsResult.connections}
              connectingInfo={connectionsResult.connectingInfo}
              contextUsage={contextUsage}
              allNodesMap={allNodesMap}
              isSendingMessageNodeId={chatNodesResult.isSendingMessageNodeId}
              onPointerMove={interactionResult.handleCanvasPointerMove}
              onPointerUp={interactionResult.handleCanvasPointerUp}
              onPointerDown={eventsResult.handleCanvasPointerDown}
              onWheel={eventsResult.handleCanvasWheel}
              onVideoNodePointerDown={videoNodesResult.handleNodePointerDown}
              onDocumentNodePointerDown={documentNodesResult.handleNodePointerDown}
              onChatNodePointerDown={chatNodesResult.handleNodePointerDown}
              onTextNodePointerDown={textNodesResult.handleNodePointerDown}
              onWebsiteNodePointerDown={websiteNodesResult.handleNodePointerDown}
              onAudioNodePointerDown={audioNodesResult.handleNodePointerDown}
              onImageNodePointerDown={imageNodesResult.handleNodePointerDown}
              onGroupNodePointerDown={groupNodesResult.handleNodePointerDown}
              onVideoTranscriptClick={eventsResult.handleVideoTranscriptClick}
              onVideoStartConnection={connectionsResult.startConnection}
              onChatEndConnection={connectionsResult.endConnection}
              onDeleteVideoNode={onDeleteVideoNode}
              onDeleteDocumentNode={onDeleteDocumentNode}
              onDeleteTextNode={onDeleteTextNode}
              onDeleteWebsiteNode={onDeleteWebsiteNode}
              onDeleteAudioNode={onDeleteAudioNode}
              onDeleteImageNode={onDeleteImageNode}
              onDeleteGroupNode={onDeleteGroupNode}
              onUpdateGroupNode={onUpdateGroupNode}
              onDocumentNodeUploadClick={onDocumentNodeUploadClick}
              onImageNodeUploadClick={onImageNodeUploadClick}
              onAnalyzeImage={onAnalyzeImage}
              onSendMessage={onSendMessage}
              onChatNodeResize={chatNodesResult.updateChatNodeHeight}
              onTextNodeUpdate={textNodesResult.updateTextNode}
              onWebsiteStartConnection={connectionsResult.startConnection}
              onAudioStartConnection={connectionsResult.startConnection}
              onImageStartConnection={connectionsResult.startConnection}
              onGroupStartConnection={connectionsResult.startConnection}
            />
          </div>
        </div>

        <CanvasModals 
          showVideoInput={canvasState.showVideoInput}
          videoUrl={canvasState.videoUrl}
          isCreatingVideo={canvasState.isCreatingNode}
          onVideoUrlChange={eventsResult.handleVideoUrlChange}
          onVideoSubmit={eventsResult.handleVideoSubmit}
          onVideoModalClose={eventsResult.resetVideoInput}
          showTranscriptPopup={canvasState.showTranscriptPopup}
          currentTranscript={canvasState.currentTranscript}
          transcriptError={canvasState.transcriptError}
          onTranscriptModalClose={onTranscriptModalClose}
          showDocumentUpload={canvasState.showDocumentUpload}
          isUploading={canvasState.isUploading}
          onDocumentUpload={eventsResult.handleDocumentUpload}
          onDocumentModalClose={onDocumentModalClose}
          onDeleteDocumentFile={onDeleteDocumentFile}
          showWebsiteInput={canvasState.showWebsiteInput}
          isScrapingWebsites={canvasState.isScrapingWebsites}
          onWebsiteUrlsSubmit={eventsResult.handleWebsiteUrlsSubmit}
          onWebsiteModalClose={eventsResult.resetWebsiteInput}
          showImageUpload={canvasState.showImageUpload}
          isUploadingImages={canvasState.isUploadingImages}
          onImageUpload={eventsResult.handleImageUpload}
          onImageModalClose={onImageModalClose}
          onDeleteImageFile={onDeleteImageFile}
        />
        
        <Toaster />
      </div>
    </ThemeProvider>
  );
};

export default Canvas;
