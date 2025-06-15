
import { useCallback, useState } from "react";
import { Archive, History, Bell } from "lucide-react";
import { SidebarTool, VideoNode, DocumentNode, ChatNode } from "@/types/canvas";
import { useCanvasTransform } from "@/hooks/useCanvasTransform";
import { useVideoNodes } from "@/hooks/useVideoNodes";
import { useCanvasState } from "@/hooks/useCanvasState";
import { useCanvasEvents } from "@/hooks/useCanvasEvents";
import { VideoNodeComponent } from "@/components/canvas/VideoNodeComponent";
import { VideoInputModal } from "@/components/canvas/VideoInputModal";
import { TranscriptModal } from "@/components/canvas/TranscriptModal";
import { CanvasSidebar } from "@/components/canvas/CanvasSidebar";
import { CanvasNavigation } from "@/components/canvas/CanvasNavigation";
import { CanvasBackground } from "@/components/canvas/CanvasBackground";
import { ZoomIndicator } from "@/components/canvas/ZoomIndicator";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { YoutubeIcon } from "@/components/canvas/YoutubeIcon";
import { FileTextIcon } from "@/components/canvas/FileTextIcon";
import { useDocumentNodes } from "@/hooks/useDocumentNodes";
import { DocumentNodeComponent } from "@/components/canvas/DocumentNodeComponent";
import { DocumentUploadModal } from "@/components/canvas/DocumentUploadModal";
import { useChatNodes } from "@/hooks/useChatNodes";
import { ChatNodeComponent } from "@/components/canvas/ChatNodeComponent";
import { useConnections } from "@/hooks/useConnections";
import { ConnectionLine } from "@/components/canvas/ConnectionLine";

const CanvasContent = () => {
  const { isDarkMode } = useTheme();
  
  const {
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
    resetTranscriptModal,
    isDraggingDocument,
    setIsDraggingDocument,
    showDocumentUpload,
    setShowDocumentUpload,
    pendingDocumentNode,
    setPendingDocumentNode,
    isUploading,
    setIsUploading,
    resetDocumentUpload,
    isDraggingChat,
    setIsDraggingChat,
  } = useCanvasState();

  const {
    transform,
    canvasContainerRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  } = useCanvasTransform();

  const {
    videoNodes,
    draggingNodeId: draggingVideoNodeId,
    addVideoNode,
    updateVideoNode,
    moveVideoNode,
    handleNodePointerDown: handleVideoNodePointerDown,
    handleNodePointerUp: handleVideoNodePointerUp,
    forceResetDragState: forceResetVideoDragState
  } = useVideoNodes();

  const {
    documentNodes,
    draggingNodeId: draggingDocumentNodeId,
    addDocumentNode,
    moveDocumentNode,
    handleNodePointerDown: handleDocumentNodePointerDown,
    handleNodePointerUp: handleDocumentNodePointerUp,
    forceResetDragState: forceResetDocumentDragState
  } = useDocumentNodes();

  const {
    chatNodes,
    draggingNodeId: draggingChatNodeId,
    addChatNode,
    moveChatNode,
    handleNodePointerDown: handleChatNodePointerDown,
    handleNodePointerUp: handleChatNodePointerUp,
    forceResetDragState: forceResetChatDragState,
  } = useChatNodes();

  const { connections, addConnection } = useConnections();
  const [connectingInfo, setConnectingInfo] = useState<{
    startNodeId: string;
    startX: number;
    startY: number;
  } | null>(null);
  const [liveEndPoint, setLiveEndPoint] = useState<{ x: number, y: number } | null>(null);

  const draggingNodeId = draggingVideoNodeId || draggingDocumentNodeId || draggingChatNodeId;
  
  const allNodes = [...videoNodes, ...documentNodes, ...chatNodes];
  const allNodesMap = new Map(allNodes.map(node => [node.id, node]));

  const {
    handleVideoIconDragStart,
    handleDocumentIconDragStart,
    handleChatIconDragStart,
    handleCanvasDrop,
    handleCanvasDragOver,
    handleVideoUrlSubmit,
    handleDocumentUploadSubmit,
    handleTranscriptClick
  } = useCanvasEvents({
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
    forceResetDragState: () => {
      forceResetVideoDragState();
      forceResetDocumentDragState();
      forceResetChatDragState();
    },
    isDraggingDocument,
    setIsDraggingDocument,
    setPendingDocumentNode,
    setShowDocumentUpload,
    addDocumentNode,
    pendingDocumentNode,
    setIsUploading,
    resetDocumentUpload,
    isDraggingChat,
    setIsDraggingChat,
    addChatNode,
  });

  const getHandlePosition = (node: VideoNode | DocumentNode | ChatNode) => {
    switch (node.type) {
      case 'chat':
        // The handle is on the left of the 500px wide component.
        // Center of component is node.x. Left edge is node.x - 250.
        // Handle is 16px wide, and its left edge is 16px from the component's left edge.
        // So center of handle is (node.x - 250) - 16 + 8 = node.x - 258
        return { x: node.x - 258, y: node.y };
      case 'video':
        // The handle is on the right of the 320px (w-80) wide component.
        // Center of component is node.x. Right edge is node.x + 160.
        // Handle is 16px wide, and its left edge is at the component's right edge.
        // So center of handle is (node.x + 160) + 8 = node.x + 168
        return { x: node.x + 168, y: node.y };
      case 'document':
        // The handle is on the right of the 256px (w-64) wide component.
        // Center of component is node.x. Right edge is node.x + 128.
        // Handle is 16px wide, and its left edge is at the component's right edge.
        // So center of handle is (node.x + 128) + 8 = node.x + 136
        return { x: node.x + 136, y: node.y };
      default: {
        // This ensures exhaustiveness. If a new node type is added,
        // this will cause a compile-time error.
        const _exhaustiveCheck: never = node;
        throw new Error(`Unhandled node type: ${(_exhaustiveCheck as any)?.type}`);
      }
    }
  };

  const handleStartConnection = (nodeId: string) => {
    if (connectingInfo) return;
    const node = allNodesMap.get(nodeId);
    if (!node) return;
    const startPos = getHandlePosition(node);
    setConnectingInfo({ startNodeId: nodeId, startX: startPos.x, startY: startPos.y });
  };

  const handleEndConnection = (nodeId: string) => {
    if (!connectingInfo) return;
    const startNode = allNodesMap.get(connectingInfo.startNodeId);
    const endNode = allNodesMap.get(nodeId);
    if (startNode && endNode && (startNode.type === 'video' || startNode.type === 'document') && endNode.type === 'chat') {
      addConnection(connectingInfo.startNodeId, nodeId);
    }
    setConnectingInfo(null);
    setLiveEndPoint(null);
  };

  const handleTranscriptModalClose = useCallback(() => {
    console.log("🔽 Closing transcript modal");
    resetTranscriptModal();
    
    console.log("🔄 Force resetting drag state on modal close");
    forceResetVideoDragState();
    forceResetDocumentDragState();
    forceResetChatDragState();
  }, [resetTranscriptModal, forceResetVideoDragState, forceResetDocumentDragState, forceResetChatDragState]);

  const handleCanvasPointerMove = useCallback((e: React.PointerEvent) => {
    if (connectingInfo) {
      const rect = canvasContainerRef.current?.getBoundingClientRect();
      if (rect) {
        setLiveEndPoint({
          x: (e.clientX - rect.left) / transform.scale,
          y: (e.clientY - rect.top) / transform.scale,
        });
      }
    } else if (draggingVideoNodeId) {
      moveVideoNode(draggingVideoNodeId, e.clientX, e.clientY, transform);
    } else if (draggingDocumentNodeId) {
      moveDocumentNode(draggingDocumentNodeId, e.clientX, e.clientY, transform);
    } else if (draggingChatNodeId) {
      moveChatNode(draggingChatNodeId, e, transform);
    } else {
      handlePointerMove(e, draggingNodeId, () => {});
    }
  }, [handlePointerMove, draggingVideoNodeId, moveVideoNode, draggingDocumentNodeId, moveDocumentNode, transform, draggingChatNodeId, moveChatNode, connectingInfo]);

  const handleCanvasPointerUp = useCallback((e: React.PointerEvent) => {
    if (draggingVideoNodeId) {
      handleVideoNodePointerUp(e);
    } else if (draggingDocumentNodeId) {
      handleDocumentNodePointerUp(e);
    } else if (draggingChatNodeId) {
      handleChatNodePointerUp(e);
    }
    handlePointerUp(e);

    if (connectingInfo) {
      setConnectingInfo(null);
      setLiveEndPoint(null);
    }
  }, [draggingVideoNodeId, handleVideoNodePointerUp, handleDocumentNodePointerUp, draggingDocumentNodeId, handleChatNodePointerUp, draggingChatNodeId, handlePointerUp, connectingInfo]);

  const sidebarTools: SidebarTool[] = [
    { id: "video", icon: YoutubeIcon, label: "Video" },
    { id: "filter", icon: Archive, label: "Filter" },
    { id: "history", icon: History, label: "History" },
    { id: "file-text", icon: FileTextIcon, label: "File" },
    { id: "folder", icon: Archive, label: "Folder" },
    { id: "rocket", icon: Bell, label: "Rocket" },
    { id: "chat", icon: Bell, label: "Chat" },
    { id: "help", icon: Bell, label: "Help" }
  ];

  return (
    <div className={`min-h-screen relative overflow-hidden ${isDarkMode ? 'bg-zinc-900' : 'bg-gray-50'}`}>
      {/* Canvas Container */}
      <div 
        ref={canvasContainerRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none"
        onPointerDown={(e) => handlePointerDown(e, draggingNodeId)}
        onPointerMove={handleCanvasPointerMove}
        onPointerUp={handleCanvasPointerUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onDrop={handleCanvasDrop}
        onDragOver={handleCanvasDragOver}
        style={{ 
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transformOrigin: '0 0'
        }}
      >
        <CanvasBackground transform={transform} />

        {/* Connection Lines */}
        {connections.map(conn => {
          const sourceNode = allNodesMap.get(conn.sourceId);
          const targetNode = allNodesMap.get(conn.targetId);
          if (!sourceNode || !targetNode) return null;
          
          const sourcePos = getHandlePosition(sourceNode);
          const targetPos = getHandlePosition(targetNode);
          
          return (
            <ConnectionLine
              key={conn.id}
              sourceX={sourcePos.x}
              sourceY={sourcePos.y}
              targetX={targetPos.x}
              targetY={targetPos.y}
              isDarkMode={isDarkMode}
            />
          );
        })}

        {/* Live connection line */}
        {connectingInfo && liveEndPoint && (
          <ConnectionLine
            sourceX={connectingInfo.startX}
            sourceY={connectingInfo.startY}
            targetX={liveEndPoint.x}
            targetY={liveEndPoint.y}
            isDarkMode={isDarkMode}
          />
        )}

        {/* Video Nodes */}
        {videoNodes.map((node) => (
          <VideoNodeComponent
            key={node.id}
            node={node}
            onPointerDown={handleVideoNodePointerDown}
            onTranscriptClick={handleTranscriptClick}
            onStartConnection={handleStartConnection}
          />
        ))}

        {/* Document Nodes */}
        {documentNodes.map((node) => (
          <DocumentNodeComponent
            key={node.id}
            node={node}
            onPointerDown={handleDocumentNodePointerDown}
            onStartConnection={handleStartConnection}
          />
        ))}

        {/* Chat Nodes */}
        {chatNodes.map((node) => (
          <ChatNodeComponent
            key={node.id}
            node={node}
            onPointerDown={handleChatNodePointerDown}
            onEndConnection={handleEndConnection}
          />
        ))}
      </div>

      {/* Video URL Input Modal */}
      <VideoInputModal
        isOpen={showVideoInput}
        videoUrl={videoUrl}
        isCreating={isCreatingNode}
        onUrlChange={setVideoUrl}
        onSubmit={handleVideoUrlSubmit}
        onCancel={resetVideoInput}
      />

      {/* Document Upload Modal */}
      <DocumentUploadModal
        isOpen={showDocumentUpload}
        isUploading={isUploading}
        onSubmit={handleDocumentUploadSubmit}
        onClose={resetDocumentUpload}
      />

      {/* Transcript Options Popup */}
      <TranscriptModal
        isOpen={showTranscriptPopup}
        videoUrl={currentVideoUrl}
        transcript={currentTranscript}
        error={transcriptError}
        onClose={handleTranscriptModalClose}
        onTranscriptChange={setCurrentTranscript}
        onSave={() => {
          updateVideoNode(
            videoNodes.find(node => node.url === currentVideoUrl)?.id || '',
            { context: currentTranscript }
          );
          handleTranscriptModalClose();
        }}
      />

      {/* Floating Left Sidebar */}
      <CanvasSidebar
        tools={sidebarTools}
        selectedTool={selectedTool}
        onToolSelect={setSelectedTool}
        onVideoDragStart={handleVideoIconDragStart}
        onDocumentDragStart={handleDocumentIconDragStart}
        onChatDragStart={handleChatIconDragStart}
      />

      {/* Navigation */}
      <CanvasNavigation />

      {/* Zoom indicator */}
      <ZoomIndicator scale={transform.scale} />
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
