
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { useCanvasOrchestration } from "@/hooks/useCanvasOrchestration";
import { useCanvasHistory } from "@/hooks/useCanvasHistory";
import { sidebarTools } from "@/config/sidebar";

import { CanvasSidebar } from "@/components/canvas/CanvasSidebar";
import { CanvasNavigation } from "@/components/canvas/CanvasNavigation";
import { ZoomIndicator } from "@/components/canvas/ZoomIndicator";
import { CanvasArea } from "@/components/canvas/CanvasArea";
import { CanvasModals } from "@/components/canvas/CanvasModals";

const CanvasContent = () => {
  const { isDarkMode } = useTheme();
  const { addAction, undo, redo, canUndo, canRedo } = useCanvasHistory();
  
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

  // Enhanced undo/redo handlers with actual implementation
  const handleUndo = () => {
    const action = undo();
    if (action) {
      console.log('Undoing action:', action);
      
      // Implement undo logic based on action type
      switch (action.type) {
        case 'ADD_NODE':
          if (action.nodeId && action.data?.nodeType) {
            console.log(`Undoing add ${action.data.nodeType} node:`, action.nodeId);
            // Delete the node that was added
            switch (action.data.nodeType) {
              case 'video':
                onDeleteVideoNode(action.nodeId);
                break;
              case 'document':
                onDeleteDocumentNode(action.nodeId);
                break;
              case 'text':
                onDeleteTextNode(action.nodeId);
                break;
              case 'website':
                onDeleteWebsiteNode(action.nodeId);
                break;
              case 'audio':
                onDeleteAudioNode(action.nodeId);
                break;
              case 'image':
                onDeleteImageNode(action.nodeId);
                break;
              case 'group':
                onDeleteGroupNode(action.nodeId);
                break;
            }
          }
          break;
        case 'DELETE_NODE':
          console.log('Cannot undo delete node - restoration not implemented yet');
          break;
        case 'ADD_CONNECTION':
          if (action.connectionId) {
            connectionsResult.removeConnection(action.connectionId);
          }
          break;
        case 'DELETE_CONNECTION':
          console.log('Cannot undo delete connection - restoration not implemented yet');
          break;
        default:
          console.log('Unknown action type for undo:', action.type);
      }
    }
  };

  const handleRedo = () => {
    const action = redo();
    if (action) {
      console.log('Redoing action:', action);
      // TODO: Implement actual redo logic based on action type
    }
  };

  return (
    <div className={`min-h-screen relative overflow-hidden ${isDarkMode ? 'bg-zinc-900' : 'bg-gray-50'}`}>
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

      <CanvasSidebar
        tools={sidebarTools}
        selectedTool={canvasState.selectedTool}
        onToolSelect={canvasState.setSelectedTool}
        onVideoDragStart={eventsResult.handleVideoIconDragStart}
        onDocumentDragStart={eventsResult.handleDocumentIconDragStart}
        onChatDragStart={eventsResult.handleChatIconDragStart}
        onTextDragStart={eventsResult.handleTextIconDragStart}
        onWebsiteDragStart={eventsResult.handleWebsiteDragStart}
        onAudioDragStart={eventsResult.handleAudioDragStart}
        onImageDragStart={eventsResult.handleImageDragStart}
        onGroupDragStart={eventsResult.handleGroupDragStart}
      />

      <CanvasNavigation 
        contextUsage={contextUsage} 
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={canUndo}
        canRedo={canRedo}
      />

      <ZoomIndicator scale={transformResult.transform.scale} />
    </div>
  );
};

const Canvas = () => {
  return (
    <ThemeProvider>
      <CanvasContent />
    </ThemeProvider>
  );
};

export default Canvas;
