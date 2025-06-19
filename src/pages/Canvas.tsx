
import React, { useRef, useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { CanvasArea } from '@/components/canvas/CanvasArea';
import { CanvasSidebar } from '@/components/canvas/CanvasSidebar';
import { CanvasNavigation } from '@/components/canvas/CanvasNavigation';
import { CanvasModals } from '@/components/canvas/CanvasModals';
import { useCanvasOrchestration } from '@/hooks/useCanvasOrchestration';
import { Video, FileText, Type, Globe, Volume2, Image, Users } from 'lucide-react';

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

  // Define sidebar tools
  const sidebarTools = [
    { id: 'video', icon: Video, label: 'Video' },
    { id: 'file-text', icon: FileText, label: 'Document' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'website', icon: Globe, label: 'Website' },
    { id: 'audio', icon: Volume2, label: 'Audio' },
    { id: 'image', icon: Image, label: 'Image' },
    { id: 'group', icon: Users, label: 'Group' },
  ];

  return (
    <ThemeProvider>
      <div className="h-screen w-screen overflow-hidden bg-zinc-950 relative">
        <CanvasNavigation 
          contextUsage={contextUsage}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={true}
          canRedo={true}
        />
        
        <div className="flex h-full pt-16">
          <CanvasSidebar 
            tools={sidebarTools}
            selectedTool=""
            onToolSelect={() => {}}
            onVideoDragStart={eventsResult.handleVideoIconDragStart}
            onDocumentDragStart={eventsResult.handleDocumentIconDragStart}
            onChatDragStart={eventsResult.handleChatIconDragStart}
            onTextDragStart={eventsResult.handleTextIconDragStart}
            onWebsiteDragStart={eventsResult.handleWebsiteDragStart}
            onImageDragStart={eventsResult.handleImageDragStart}
            onAudioDragStart={eventsResult.handleAudioDragStart}
            onGroupDragStart={eventsResult.handleGroupDragStart}
          />
          
          <div className="flex-1 relative">
            <CanvasArea
              transformResult={transformResult}
              interactionResult={interactionResult}
              eventsResult={eventsResult}
              connectionsResult={connectionsResult}
              videoNodesResult={videoNodesResult}
              documentNodesResult={documentNodesResult}
              chatNodesResult={chatNodesResult}
              textNodesResult={textNodesResult}
              websiteNodesResult={websiteNodesResult}
              audioNodesResult={audioNodesResult}
              imageNodesResult={imageNodesResult}
              groupNodesResult={groupNodesResult}
              allNodesMap={allNodesMap}
              onDeleteVideoNode={onDeleteVideoNode}
              onDeleteDocumentNode={onDeleteDocumentNode}
              onDeleteDocumentFile={onDeleteDocumentFile}
              onDocumentNodeUploadClick={onDocumentNodeUploadClick}
              onDeleteTextNode={onDeleteTextNode}
              onDeleteWebsiteNode={onDeleteWebsiteNode}
              onDeleteAudioNode={onDeleteAudioNode}
              onDeleteImageNode={onDeleteImageNode}
              onDeleteImageFile={onDeleteImageFile}
              onImageNodeUploadClick={onImageNodeUploadClick}
              onAnalyzeImage={onAnalyzeImage}
              onSendMessage={onSendMessage}
              onDeleteGroupNode={onDeleteGroupNode}
              onUpdateGroupNode={onUpdateGroupNode}
            />
          </div>
        </div>

        <CanvasModals 
          canvasState={canvasState}
          eventsResult={eventsResult}
          videoNodesResult={videoNodesResult}
          documentNodesResult={documentNodesResult}
          websiteNodesResult={websiteNodesResult}
          imageNodesResult={imageNodesResult}
          uploadTargetNodeId={uploadTargetNodeId}
          onDocumentModalClose={onDocumentModalClose}
          onTranscriptModalClose={onTranscriptModalClose}
          onImageModalClose={onImageModalClose}
        />
        
        <Toaster />
      </div>
    </ThemeProvider>
  );
};

export default Canvas;
