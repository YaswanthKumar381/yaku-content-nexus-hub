import React from 'react';
import { CanvasNode } from '@/types/canvas';
import { CanvasBackground } from './CanvasBackground';
import { ConnectionLayer } from './ConnectionLayer';
import { NodeLayer } from './NodeLayer';
import { useTheme } from '@/contexts/ThemeContext';

// Import hook return types
import type { useCanvasTransform } from '@/hooks/useCanvasTransform';
import type { useCanvasInteraction } from '@/hooks/useCanvasInteraction';
import type { useCanvasEvents } from '@/hooks/useCanvasEvents';
import type { useConnections } from '@/hooks/useConnections';
import type { useVideoNodes } from '@/hooks/useVideoNodes';
import type { useDocumentNodes } from '@/hooks/useDocumentNodes';
import type { useChatNodes } from '@/hooks/useChatNodes';
import type { useTextNodes } from '@/hooks/useTextNodes';
import type { useWebsiteNodes } from '@/hooks/useWebsiteNodes';
import type { useAudioNodes } from '@/hooks/useAudioNodes';
import type { useImageNodes } from '@/hooks/useImageNodes';

interface CanvasAreaProps {
  transformResult: ReturnType<typeof useCanvasTransform>;
  interactionResult: ReturnType<typeof useCanvasInteraction>;
  eventsResult: ReturnType<typeof useCanvasEvents>;
  connectionsResult: ReturnType<typeof useConnections>;
  videoNodesResult: ReturnType<typeof useVideoNodes>;
  documentNodesResult: ReturnType<typeof useDocumentNodes>;
  chatNodesResult: ReturnType<typeof useChatNodes>;
  textNodesResult: ReturnType<typeof useTextNodes>;
  websiteNodesResult: ReturnType<typeof useWebsiteNodes>;
  audioNodesResult: ReturnType<typeof useAudioNodes>;
  imageNodesResult: ReturnType<typeof useImageNodes>;
  allNodesMap: Map<string, CanvasNode>;
  onDeleteVideoNode: (nodeId: string) => void;
  onDeleteDocumentNode: (nodeId: string) => void;
  onDeleteDocumentFile: (nodeId: string, fileId: string) => void;
  onDocumentNodeUploadClick: (nodeId: string) => void;
  onDeleteTextNode: (nodeId: string) => void;
  onDeleteWebsiteNode: (nodeId: string) => void;
  onDeleteAudioNode: (nodeId: string) => void;
  onDeleteImageNode: (nodeId: string) => void;
  onDeleteImageFile: (nodeId: string, imageId: string) => void;
  onImageNodeUploadClick: (nodeId: string) => void;
  onAnalyzeImage: (nodeId: string, imageId: string, prompt?: string) => Promise<void>;
  onSendMessage: (nodeId: string, message: string) => void;
}

export const CanvasArea: React.FC<CanvasAreaProps> = ({
  transformResult,
  interactionResult,
  eventsResult,
  connectionsResult,
  videoNodesResult,
  documentNodesResult,
  chatNodesResult,
  textNodesResult,
  websiteNodesResult,
  audioNodesResult,
  imageNodesResult,
  allNodesMap,
  onDeleteVideoNode,
  onDeleteDocumentNode,
  onDeleteDocumentFile,
  onDocumentNodeUploadClick,
  onDeleteTextNode,
  onDeleteWebsiteNode,
  onDeleteAudioNode,
  onDeleteImageNode,
  onDeleteImageFile,
  onImageNodeUploadClick,
  onAnalyzeImage,
  onSendMessage,
}) => {
  const { isDarkMode } = useTheme();
  const { transform, canvasContainerRef, handlePointerDown, handleTouchStart, handleTouchMove, handleTouchEnd } = transformResult;
  const { draggingNodeId, handleCanvasPointerMove, handleCanvasPointerUp } = interactionResult;
  const { handleCanvasDrop, handleCanvasDragOver, handleTranscriptClick } = eventsResult;

  return (
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

      <ConnectionLayer 
        connections={connectionsResult.connections}
        allNodesMap={allNodesMap}
        connectingInfo={connectionsResult.connectingInfo}
        liveEndPoint={connectionsResult.liveEndPoint}
        isDarkMode={isDarkMode}
        onDeleteConnection={connectionsResult.removeConnection}
      />
      
      <NodeLayer
        videoNodes={videoNodesResult.videoNodes}
        documentNodes={documentNodesResult.documentNodes}
        chatNodes={chatNodesResult.chatNodes}
        textNodes={textNodesResult.textNodes}
        websiteNodes={websiteNodesResult.websiteNodes}
        audioNodes={audioNodesResult.audioNodes}
        imageNodes={imageNodesResult.imageNodes}
        onVideoNodePointerDown={videoNodesResult.handleNodePointerDown}
        onDocumentNodePointerDown={documentNodesResult.handleNodePointerDown}
        onChatNodePointerDown={chatNodesResult.handleNodePointerDown}
        onTextNodePointerDown={textNodesResult.handleNodePointerDown}
        onWebsiteNodePointerDown={websiteNodesResult.handleNodePointerDown}
        onAudioNodePointerDown={audioNodesResult.handleNodePointerDown}
        onImageNodePointerDown={imageNodesResult.handleNodePointerDown}
        onChatNodeResize={chatNodesResult.updateChatNodeHeight}
        onTranscriptClick={handleTranscriptClick}
        onStartConnection={connectionsResult.startConnection}
        onEndConnection={connectionsResult.endConnection}
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
        onUpdateTextNode={textNodesResult.updateTextNode}
        onSendMessage={onSendMessage}
        isSendingMessageNodeId={chatNodesResult.isSendingMessageNodeId}
        connections={connectionsResult.connections}
        onAddRecordingToNode={audioNodesResult.addRecordingToNode}
        onDeleteRecording={audioNodesResult.deleteRecording}
      />
    </div>
  );
};
