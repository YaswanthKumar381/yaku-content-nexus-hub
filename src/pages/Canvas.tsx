
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { useCanvasOrchestration } from "@/hooks/useCanvasOrchestration";
import { sidebarTools } from "@/config/sidebar";

import { CanvasSidebar } from "@/components/canvas/CanvasSidebar";
import { CanvasNavigation } from "@/components/canvas/CanvasNavigation";
import { ZoomIndicator } from "@/components/canvas/ZoomIndicator";
import { CanvasArea } from "@/components/canvas/CanvasArea";
import { CanvasModals } from "@/components/canvas/CanvasModals";

const CanvasContent = () => {
  const { isDarkMode } = useTheme();
  
  const {
    canvasState,
    transformResult,
    videoNodesResult,
    documentNodesResult,
    chatNodesResult,
    textNodesResult,
    websiteNodesResult,
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
    onDocumentNodeUploadClick,
    onDocumentModalClose,
    onSendMessage,
    onTranscriptModalClose,
  } = useCanvasOrchestration();

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
        allNodesMap={allNodesMap}
        onDeleteVideoNode={onDeleteVideoNode}
        onDeleteDocumentNode={onDeleteDocumentNode}
        onDeleteDocumentFile={onDeleteDocumentFile}
        onDocumentNodeUploadClick={onDocumentNodeUploadClick}
        onDeleteTextNode={onDeleteTextNode}
        onDeleteWebsiteNode={onDeleteWebsiteNode}
        onSendMessage={onSendMessage}
      />

      <CanvasModals
        canvasState={canvasState}
        eventsResult={eventsResult}
        videoNodesResult={videoNodesResult}
        documentNodesResult={documentNodesResult}
        websiteNodesResult={websiteNodesResult}
        uploadTargetNodeId={uploadTargetNodeId}
        onDocumentModalClose={onDocumentModalClose}
        onTranscriptModalClose={onTranscriptModalClose}
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
      />

      <CanvasNavigation contextUsage={contextUsage} />

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
