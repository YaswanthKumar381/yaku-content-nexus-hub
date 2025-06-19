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

  // Enhanced undo/redo handlers with proper action tracking
  const handleUndo = () => {
    console.log('Undo button clicked, canUndo:', canUndo);
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
              case 'chat':
                // Handle chat node deletion if needed
                break;
            }
          }
          break;
        case 'ADD_CONNECTION':
          if (action.connectionId) {
            connectionsResult.removeConnection(action.connectionId);
          }
          break;
        default:
          console.log('Undo not implemented for action type:', action.type);
      }
    }
  };

  const handleRedo = () => {
    console.log('Redo button clicked, canRedo:', canRedo);
    const action = redo();
    if (action) {
      console.log('Redoing action:', action);
      
      // Implement redo logic based on action type
      switch (action.type) {
        case 'ADD_NODE':
          if (action.data?.position && action.data?.nodeType && action.nodeId) {
            console.log(`Redoing add ${action.data.nodeType} node at position:`, action.data.position);
            // Re-add the node with the same ID
            switch (action.data.nodeType) {
              case 'video':
                videoNodesResult.addVideoNode(action.data.position.x, action.data.position.y, action.data.url || '', action.nodeId);
                break;
              case 'document':
                documentNodesResult.addDocumentNode(action.data.position.x, action.data.position.y, action.nodeId);
                break;
              case 'text':
                textNodesResult.addTextNode(action.data.position.x, action.data.position.y, action.nodeId);
                break;
              case 'website':
                websiteNodesResult.addWebsiteNode(action.data.position.x, action.data.position.y, action.nodeId);
                break;
              case 'audio':
                audioNodesResult.addAudioNode(action.data.position.x, action.data.position.y, action.nodeId);
                break;
              case 'image':
                imageNodesResult.addImageNode(action.data.position.x, action.data.position.y, action.nodeId);
                break;
              case 'group':
                groupNodesResult.addGroupNode(action.data.position.x, action.data.position.y, action.nodeId);
                break;
              case 'chat':
                chatNodesResult.addChatNode(action.data.position.x, action.data.position.y, action.nodeId);
                break;
            }
          }
          break;
        case 'ADD_CONNECTION':
          if (action.data?.sourceId && action.data?.targetId) {
            connectionsResult.addConnection(action.data.sourceId, action.data.targetId);
          }
          break;
        default:
          console.log('Redo not implemented for action type:', action.type);
      }
    }
  };

  // Track node creation for undo/redo
  const trackNodeCreation = (nodeType: string, nodeId: string, position: { x: number, y: number }, url?: string) => {
    addAction({
      type: 'ADD_NODE',
      nodeId,
      data: { nodeType, position, url }
    });
  };

  // Track connection creation for undo/redo
  const trackConnectionCreation = (sourceId: string, targetId: string, connectionId: string) => {
    addAction({
      type: 'ADD_CONNECTION',
      connectionId,
      data: { sourceId, targetId }
    });
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
