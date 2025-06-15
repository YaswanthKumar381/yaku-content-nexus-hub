import { useCallback, useState } from "react";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { useCanvasState } from "@/hooks/useCanvasState";
import { useCanvasTransform } from "@/hooks/useCanvasTransform";
import { useVideoNodes } from "@/hooks/useVideoNodes";
import { useDocumentNodes } from "@/hooks/useDocumentNodes";
import { useChatNodes } from "@/hooks/useChatNodes";
import { useConnections } from "@/hooks/useConnections";
import { useCanvasEvents } from "@/hooks/useCanvasEvents";
import { useCanvasInteraction } from "@/hooks/useCanvasInteraction";
import { sidebarTools } from "@/config/sidebar";
import { VideoNode, DocumentNode, CanvasNode, Connection } from "@/types/canvas";
import { useToast } from "@/hooks/use-toast";

import { VideoInputModal } from "@/components/canvas/VideoInputModal";
import { TranscriptModal } from "@/components/canvas/TranscriptModal";
import { DocumentUploadModal } from "@/components/canvas/DocumentUploadModal";
import { CanvasSidebar } from "@/components/canvas/CanvasSidebar";
import { CanvasNavigation } from "@/components/canvas/CanvasNavigation";
import { CanvasBackground } from "@/components/canvas/CanvasBackground";
import { ZoomIndicator } from "@/components/canvas/ZoomIndicator";
import { NodeLayer } from "@/components/canvas/NodeLayer";
import { ConnectionLayer } from "@/components/canvas/ConnectionLayer";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Unlink } from "lucide-react";

const CanvasContent = () => {
  const { isDarkMode } = useTheme();
  const { toast } = useToast();
  
  const canvasState = useCanvasState();
  const transformResult = useCanvasTransform();
  const videoNodesResult = useVideoNodes();
  const documentNodesResult = useDocumentNodes();
  const chatNodesResult = useChatNodes();

  const allNodes = [...videoNodesResult.videoNodes, ...documentNodesResult.documentNodes, ...chatNodesResult.chatNodes];
  const allNodesMap = new Map(allNodes.map(node => [node.id, node]));

  const connectionsResult = useConnections(allNodesMap);

  const [nodeToEdit, setNodeToEdit] = useState<CanvasNode | null>(null);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });
  const [nodeToDelete, setNodeToDelete] = useState<CanvasNode | null>(null);
  const [connectionToEdit, setConnectionToEdit] = useState<Connection | null>(null);

  const { draggingNodeId, handleCanvasPointerMove, handleCanvasPointerUp } = useCanvasInteraction({
    connectionsResult,
    videoNodesResult,
    documentNodesResult,
    chatNodesResult,
    transformResult,
  });
  
  const { transform, canvasContainerRef, handlePointerDown, handleTouchStart, handleTouchMove, handleTouchEnd } = transformResult;

  const forceResetAllDragState = useCallback(() => {
    videoNodesResult.forceResetDragState();
    documentNodesResult.forceResetDragState();
    chatNodesResult.forceResetDragState();
  }, [videoNodesResult, documentNodesResult, chatNodesResult]);
  
  const canvasEvents = useCanvasEvents({
    isDraggingVideo: canvasState.isDraggingVideo,
    setIsDraggingVideo: canvasState.setIsDraggingVideo,
    setPendingVideoNode: canvasState.setPendingVideoNode,
    setShowVideoInput: canvasState.setShowVideoInput,
    pendingVideoNode: canvasState.pendingVideoNode,
    videoUrl: canvasState.videoUrl,
    setIsCreatingNode: canvasState.setIsCreatingNode,
    resetVideoInput: canvasState.resetVideoInput,
    setCurrentVideoUrl: canvasState.setCurrentVideoUrl,
    setShowTranscriptPopup: canvasState.setShowTranscriptPopup,
    setCurrentTranscript: canvasState.setCurrentTranscript,
    setTranscriptError: canvasState.setTranscriptError,
    isDraggingDocument: canvasState.isDraggingDocument,
    setIsDraggingDocument: canvasState.setIsDraggingDocument,
    setPendingDocumentNode: canvasState.setPendingDocumentNode,
    setShowDocumentUpload: canvasState.setShowDocumentUpload,
    addDocumentNode: documentNodesResult.addDocumentNode,
    pendingDocumentNode: canvasState.pendingDocumentNode,
    setIsUploading: canvasState.setIsUploading,
    resetDocumentUpload: canvasState.resetDocumentUpload,
    isDraggingChat: canvasState.isDraggingChat,
    setIsDraggingChat: canvasState.setIsDraggingChat,
    addChatNode: chatNodesResult.addChatNode,
    canvasContainerRef,
    transform,
    addVideoNode: videoNodesResult.addVideoNode,
    forceResetDragState: forceResetAllDragState,
  });

  const handleSendMessage = useCallback((nodeId: string, message: string) => {
    const connectedNodes = connectionsResult.connections
        .filter(conn => conn.targetId === nodeId)
        .map(conn => allNodesMap.get(conn.sourceId))
        .filter((node): node is VideoNode | DocumentNode => !!node && (node.type === 'video' || node.type === 'document'));
    
    const context = connectedNodes.map(node => {
        if(node.type === 'video') return `Video Title: ${node.title}\nTranscript: ${node.context || 'Not available'}`;
        if(node.type === 'document') return `Document Name: ${node.fileName}\nContent: ${node.content || 'Not available'}`;
        return '';
    }).join('\n\n---\n\n');

    chatNodesResult.sendMessage(nodeId, message, context);
  }, [connectionsResult.connections, allNodesMap, chatNodesResult.sendMessage]);

  const handleTranscriptModalClose = useCallback(() => {
    console.log("🔽 Closing transcript modal");
    canvasState.resetTranscriptModal();
    
    console.log("🔄 Force resetting drag state on modal close");
    forceResetAllDragState();
  }, [canvasState.resetTranscriptModal, forceResetAllDragState]);

  const handleNodeDoubleClick = (node: CanvasNode, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = canvasContainerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setNodeToEdit(node);
    setPopoverPosition({ x: e.clientX, y: e.clientY });
  };
  
  const handleConnectionDoubleClick = (connection: Connection, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = canvasContainerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setConnectionToEdit(connection);
    setPopoverPosition({ x: e.clientX, y: e.clientY });
  };
  
  const handleDeleteNodeRequest = () => {
    if (nodeToEdit) {
      setNodeToDelete(nodeToEdit);
      setNodeToEdit(null);
    }
  };

  const handleConfirmDeleteNode = () => {
    if (!nodeToDelete) return;
    
    connectionsResult.removeConnectionsForNode(nodeToDelete.id);

    if (nodeToDelete.type === 'chat') {
        chatNodesResult.deleteChatNode(nodeToDelete.id);
        toast({ title: "Node deleted", description: "The chat node and its connections have been deleted." });
    } else {
        toast({
            variant: "destructive",
            title: "Action not supported",
            description: `Deleting ${nodeToDelete.type} nodes is not yet supported.`,
        });
    }
    setNodeToDelete(null);
  };
  
  const handleDisconnect = () => {
      if (!connectionToEdit) return;
      connectionsResult.removeConnection(connectionToEdit.id);
      setConnectionToEdit(null);
      toast({ title: "Connection removed" });
  };

  return (
    <div className={`min-h-screen relative overflow-hidden ${isDarkMode ? 'bg-zinc-900' : 'bg-gray-50'}`}>
      <div 
        ref={canvasContainerRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none"
        onPointerDown={(e) => handlePointerDown(e, draggingNodeId)}
        onPointerMove={handleCanvasPointerMove}
        onPointerUp={handleCanvasPointerUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onDrop={canvasEvents.handleCanvasDrop}
        onDragOver={canvasEvents.handleCanvasDragOver}
        style={{ 
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transformOrigin: '0 0'
        }}
      >
        <CanvasBackground transform={transform} />

        <ConnectionLayer 
          connections={connectionsResult.connections}
          allNodesMap={allNodesMap}
          connectingInfo={connectionsResult.connectingInfo}
          liveEndPoint={connectionsResult.liveEndPoint}
          isDarkMode={isDarkMode}
          onConnectionDoubleClick={handleConnectionDoubleClick}
        />
        
        <NodeLayer
          videoNodes={videoNodesResult.videoNodes}
          documentNodes={documentNodesResult.documentNodes}
          chatNodes={chatNodesResult.chatNodes}
          onVideoNodePointerDown={videoNodesResult.handleNodePointerDown}
          onDocumentNodePointerDown={documentNodesResult.handleNodePointerDown}
          onChatNodePointerDown={chatNodesResult.handleNodePointerDown}
          onChatNodeResize={chatNodesResult.updateChatNodeHeight}
          onTranscriptClick={canvasEvents.handleTranscriptClick}
          onStartConnection={connectionsResult.startConnection}
          onEndConnection={connectionsResult.endConnection}
          onSendMessage={handleSendMessage}
          isSendingMessageNodeId={chatNodesResult.isSendingMessageNodeId}
          onNodeDoubleClick={handleNodeDoubleClick}
        />
      </div>

      <Popover open={!!nodeToEdit || !!connectionToEdit} onOpenChange={() => { setNodeToEdit(null); setConnectionToEdit(null); }}>
        <PopoverTrigger asChild>
          <div className="absolute" style={{ top: popoverPosition.y, left: popoverPosition.x }} />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-1">
          {nodeToEdit && (
            <Button variant="destructive" onClick={handleDeleteNodeRequest} size="sm" className="w-full">
              <Trash2 className="h-4 w-4 mr-2" /> Delete Node
            </Button>
          )}
          {connectionToEdit && (
            <Button variant="destructive" onClick={handleDisconnect} size="sm" className="w-full">
              <Unlink className="h-4 w-4 mr-2" /> Disconnect
            </Button>
          )}
        </PopoverContent>
      </Popover>

      <AlertDialog open={!!nodeToDelete} onOpenChange={(open) => !open && setNodeToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the node and all its connections.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDeleteNode}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <VideoInputModal
        isOpen={canvasState.showVideoInput}
        videoUrl={canvasState.videoUrl}
        isCreating={canvasState.isCreatingNode}
        onUrlChange={canvasState.setVideoUrl}
        onSubmit={canvasEvents.handleVideoUrlSubmit}
        onCancel={canvasState.resetVideoInput}
      />

      <DocumentUploadModal
        isOpen={canvasState.showDocumentUpload}
        isUploading={canvasState.isUploading}
        onSubmit={canvasEvents.handleDocumentUploadSubmit}
        onClose={canvasState.resetDocumentUpload}
      />

      <TranscriptModal
        isOpen={canvasState.showTranscriptPopup}
        videoUrl={canvasState.currentVideoUrl}
        transcript={canvasState.currentTranscript}
        error={canvasState.transcriptError}
        onClose={handleTranscriptModalClose}
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
          handleTranscriptModalClose();
        }}
      />

      <CanvasSidebar
        tools={sidebarTools}
        selectedTool={canvasState.selectedTool}
        onToolSelect={canvasState.setSelectedTool}
        onVideoDragStart={canvasEvents.handleVideoIconDragStart}
        onDocumentDragStart={canvasEvents.handleDocumentIconDragStart}
        onChatDragStart={canvasEvents.handleChatIconDragStart}
      />

      <CanvasNavigation />

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
