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

  // History handlers
  const handleUndo = useCallback(() => {
    const previousState = canvasHistory.undo();
    if (previousState) {
      console.log('Undoing to state:', previousState);

      // Clear current state
      chatNodes.setChatNodes([]);
      textNodes.setTextNodes([]);
      videoNodes.setVideoNodes([]);
      audioNodes.setAudioNodes([]);
      imageNodes.setImageNodes([]);
      documentNodes.setDocumentNodes([]);
      websiteNodes.setWebsiteNodes([]);
      groupNodes.setGroupNodes([]);
      connections.setConnections([]);

      // Restore state
      if (previousState.chatNodes) chatNodes.setChatNodes(previousState.chatNodes);
      if (previousState.textNodes) textNodes.setTextNodes(previousState.textNodes);
      if (previousState.videoNodes) videoNodes.setVideoNodes(previousState.videoNodes);
      if (previousState.audioNodes) audioNodes.setAudioNodes(previousState.audioNodes);
      if (previousState.imageNodes) {
        imageNodes.setImageNodes(previousState.imageNodes);
      }
      if (previousState.documentNodes) {
        documentNodes.setDocumentNodes(previousState.documentNodes);
      }
      if (previousState.websiteNodes) {
        websiteNodes.setWebsiteNodes(previousState.websiteNodes);
      }
      if (previousState.groupNodes) {
        groupNodes.setGroupNodes(previousState.groupNodes);
      }
      if (previousState.connections) connections.setConnections(previousState.connections);
    }
  }, [canvasHistory, chatNodes, textNodes, videoNodes, audioNodes, imageNodes, documentNodes, websiteNodes, groupNodes, connections]);

  const handleRedo = useCallback(() => {
    const nextState = canvasHistory.redo();
    if (nextState) {
      console.log('Redoing to state:', nextState);
      
      // Clear current state
      chatNodes.setChatNodes([]);
      textNodes.setTextNodes([]);
      videoNodes.setVideoNodes([]);
      audioNodes.setAudioNodes([]);
      imageNodes.setImageNodes([]);
      documentNodes.setDocumentNodes([]);
      websiteNodes.setWebsiteNodes([]);
      groupNodes.setGroupNodes([]);
      connections.setConnections([]);

      // Restore state
      if (nextState.chatNodes) chatNodes.setChatNodes(nextState.chatNodes);
      if (nextState.textNodes) textNodes.setTextNodes(nextState.textNodes);
      if (nextState.videoNodes) videoNodes.setVideoNodes(nextState.videoNodes);
      if (nextState.audioNodes) audioNodes.setAudioNodes(nextState.audioNodes);
      if (nextState.imageNodes) {
        // Fix: Pass proper arguments for image nodes
        imageNodes.setImageNodes(nextState.imageNodes);
      }
      if (nextState.documentNodes) {
        // Fix: Pass proper arguments for document nodes  
        documentNodes.setDocumentNodes(nextState.documentNodes);
      }
      if (nextState.websiteNodes) {
        // Fix: Pass proper arguments for website nodes
        websiteNodes.setWebsiteNodes(nextState.websiteNodes);
      }
      if (nextState.groupNodes) {
        // Fix: Pass proper arguments for group nodes
        groupNodes.setGroupNodes(nextState.groupNodes);
      }
      if (nextState.connections) connections.setConnections(nextState.connections);
    }
  }, [canvasHistory, chatNodes, textNodes, videoNodes, audioNodes, imageNodes, documentNodes, websiteNodes, groupNodes, connections]);

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
