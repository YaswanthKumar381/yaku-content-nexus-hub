
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useCanvasOrchestration } from "@/hooks/useCanvasOrchestration";
import { NodeLayer } from "@/components/canvas/NodeLayer";
import { ConnectionLayer } from "@/components/canvas/ConnectionLayer";
import { CanvasNavigation } from "@/components/canvas/CanvasNavigation";
import { CanvasSidebar } from "@/components/canvas/CanvasSidebar";
import { ContextUsageIndicator } from "@/components/canvas/ContextUsageIndicator";
import { CanvasModals } from "@/components/canvas/CanvasModals";
import { CanvasBackground } from "@/components/canvas/CanvasBackground";
import { ZoomIndicator } from "@/components/canvas/ZoomIndicator";
import { TranscriptModal } from "@/components/canvas/TranscriptModal";
import { WebsiteTranscriptModal } from "@/components/canvas/website/WebsiteTranscriptModal";
import { useQuery } from "@tanstack/react-query";
import { useContextUsage } from "@/hooks/useContextUsage";

const Canvas = () => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [transcriptModalOpen, setTranscriptModalOpen] = useState(false);
  const [websiteTranscriptModalOpen, setWebsiteTranscriptModalOpen] = useState(false);
  const [selectedWebsiteNodeForTranscript, setSelectedWebsiteNodeForTranscript] = useState<any>(null);

  const {
    addChatNode,
    addTextNode,
    addVideoNode,
    addImageNode,
    addAudioNode,
    addDocumentNode,
    addWebsiteNode,
    addGroupNode,
    deleteNode,
    duplicateNode,
    startConnection,
    endConnection,
    deleteConnection,
    moveNodesToFront,
    canvasHandlers,
    canvasInteraction,
    canvasState,
    canvasTransform,
    chatNodes,
    textNodes,
    videoNodes,
    audioNodes,
    imageNodes,
    documentNodes,
    websiteNodes,
    groupNodes,
    connections,
    canvasHistory
  } = useCanvasOrchestration({ canvasContainerRef });

  // History handlers
  const handleUndo = useCallback(() => {
    // For now, disable undo/redo functionality to prevent errors
    console.log('Undo requested - feature temporarily disabled');
  }, []);

  const handleRedo = useCallback(() => {
    // For now, disable undo/redo functionality to prevent errors
    console.log('Redo requested - feature temporarily disabled');
  }, []);

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
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  const { percentage, totalTokens, limit } = useContextUsage({
    chatNodes: chatNodes.chatNodes,
    textNodes: textNodes.textNodes,
    videoNodes: videoNodes.videoNodes,
    audioNodes: audioNodes.audioNodes,
    imageNodes: imageNodes.imageNodes,
    documentNodes: documentNodes.documentNodes,
    websiteNodes: websiteNodes.websiteNodes,
    groupNodes: groupNodes.groupNodes,
  });

  return (
    <div className="h-screen w-full overflow-hidden bg-zinc-900 relative">
      <CanvasBackground />

      <div
        className="absolute inset-0"
        ref={canvasContainerRef}
        style={{
          cursor: canvasInteraction.draggingNodeId ? 'grabbing' : 'grab',
        }}
        onPointerMove={canvasInteraction.handleCanvasPointerMove}
        onPointerUp={canvasInteraction.handleCanvasPointerUp}
        {...canvasHandlers}
      >
        <div
          style={{
            transform: `translate(${canvasTransform.transform.x}px, ${canvasTransform.transform.y}px) scale(${canvasTransform.transform.scale})`,
            transformOrigin: '0 0',
          }}
        >
          <ConnectionLayer connections={connections.connections} />
          <NodeLayer
            nodes={videoNodes.videoNodes}
            onNodePointerDown={videoNodes.handleNodePointerDown}
            onNodeDoubleClick={videoNodes.handleNodeDoubleClick}
          />
          <NodeLayer
            nodes={documentNodes.documentNodes}
            onNodePointerDown={documentNodes.handleNodePointerDown}
            onNodeDoubleClick={documentNodes.handleNodeDoubleClick}
          />
          <NodeLayer
            nodes={chatNodes.chatNodes}
            onNodePointerDown={chatNodes.handleNodePointerDown}
            onNodeDoubleClick={chatNodes.handleNodeDoubleClick}
          />
          <NodeLayer
            nodes={textNodes.textNodes}
            onNodePointerDown={textNodes.handleNodePointerDown}
            onNodeDoubleClick={textNodes.handleNodeDoubleClick}
          />
          <NodeLayer
            nodes={websiteNodes.websiteNodes}
            onNodePointerDown={websiteNodes.handleNodePointerDown}
            onNodeDoubleClick={websiteNodes.handleNodeDoubleClick}
            onShowTranscript={(node) => {
              setSelectedWebsiteNodeForTranscript(node);
              setWebsiteTranscriptModalOpen(true);
            }}
          />
          <NodeLayer
            nodes={audioNodes.audioNodes}
            onNodePointerDown={audioNodes.handleNodePointerDown}
            onNodeDoubleClick={audioNodes.handleNodeDoubleClick}
          />
           <NodeLayer
            nodes={imageNodes.imageNodes}
            onNodePointerDown={imageNodes.handleNodePointerDown}
            onNodeDoubleClick={imageNodes.handleNodeDoubleClick}
          />
          <NodeLayer
            nodes={groupNodes.groupNodes}
            onNodePointerDown={groupNodes.handleNodePointerDown}
          />
        </div>
      </div>

      <CanvasNavigation
        onAddChat={addChatNode}
        onAddText={addTextNode}
        onAddVideo={addVideoNode}
        onAddImage={addImageNode}
        onAddAudio={addAudioNode}
        onAddDocument={addDocumentNode}
        onAddWebsite={addWebsiteNode}
        onAddGroup={addGroupNode}
        onDelete={deleteNode}
        onDuplicate={duplicateNode}
        onStartConnection={startConnection}
        onEndConnection={endConnection}
        onDeleteConnection={deleteConnection}
        onMoveNodesToFront={moveNodesToFront}
      />

      <CanvasSidebar
        percentage={percentage}
        totalTokens={totalTokens}
        limit={limit}
      />

      <ContextUsageIndicator
        percentage={percentage}
        totalTokens={totalTokens}
        limit={limit}
      />

      <ZoomIndicator scale={canvasTransform.transform.scale} />

      <CanvasModals
        videoNodes={videoNodes}
        documentNodes={documentNodes}
        chatNodes={chatNodes}
        textNodes={textNodes}
        websiteNodes={websiteNodes}
        audioNodes={audioNodes}
        imageNodes={imageNodes}
        groupNodes={groupNodes}
      />

      <TranscriptModal
        isOpen={transcriptModalOpen}
        onClose={() => setTranscriptModalOpen(false)}
        chatNodes={chatNodes.chatNodes}
      />

      <WebsiteTranscriptModal
        isOpen={websiteTranscriptModalOpen}
        onClose={() => setWebsiteTranscriptModalOpen(false)}
        node={selectedWebsiteNodeForTranscript}
      />
    </div>
  );
};

export default Canvas;
