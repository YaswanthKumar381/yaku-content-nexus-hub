
import React from 'react';
import { CanvasBackground } from './CanvasBackground';
import { ConnectionLayer } from './ConnectionLayer';
import { NodeLayer } from './NodeLayer';
import { Transform, Connection, CanvasNode, VideoNode, DocumentNode, ChatNode } from '@/types/canvas';

interface CanvasContainerProps {
  canvasContainerRef: React.RefObject<HTMLDivElement>;
  transform: Transform;
  isDarkMode: boolean;

  // Pointer/Drag events
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: (e: React.PointerEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;

  // Connection Layer props
  connections: Connection[];
  allNodesMap: Map<string, CanvasNode>;
  connectingInfo: { startNodeId: string; startX: number; startY: number; } | null;
  liveEndPoint: { x: number; y: number; } | null;
  onConnectionDoubleClick: (connection: Connection, e: React.MouseEvent) => void;

  // Node Layer props
  videoNodes: VideoNode[];
  documentNodes: DocumentNode[];
  chatNodes: ChatNode[];
  onVideoNodePointerDown: (e: React.PointerEvent, nodeId: string) => void;
  onDocumentNodePointerDown: (e: React.PointerEvent, nodeId: string) => void;
  onChatNodePointerDown: (e: React.PointerEvent, nodeId: string) => void;
  onChatNodeResize: (nodeId: string, height: number) => void;
  onTranscriptClick: (e: React.MouseEvent, node: VideoNode) => void;
  onStartConnection: (nodeId: string) => void;
  onEndConnection: (nodeId:string) => void;
  onSendMessage: (nodeId: string, message: string) => void;
  isSendingMessageNodeId: string | null;
  onNodeDoubleClick: (node: CanvasNode, e: React.MouseEvent) => void;
}

export const CanvasContainer: React.FC<CanvasContainerProps> = ({
  canvasContainerRef,
  transform,
  isDarkMode,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onDrop,
  onDragOver,
  connections,
  allNodesMap,
  connectingInfo,
  liveEndPoint,
  onConnectionDoubleClick,
  videoNodes,
  documentNodes,
  chatNodes,
  onVideoNodePointerDown,
  onDocumentNodePointerDown,
  onChatNodePointerDown,
  onChatNodeResize,
  onTranscriptClick,
  onStartConnection,
  onEndConnection,
  onSendMessage,
  isSendingMessageNodeId,
  onNodeDoubleClick,
}) => {
  return (
    <div 
      ref={canvasContainerRef}
      className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onDrop={onDrop}
      onDragOver={onDragOver}
      style={{ 
        transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
        transformOrigin: '0 0'
      }}
    >
      <CanvasBackground transform={transform} />

      <ConnectionLayer 
        connections={connections}
        allNodesMap={allNodesMap}
        connectingInfo={connectingInfo}
        liveEndPoint={liveEndPoint}
        isDarkMode={isDarkMode}
        onConnectionDoubleClick={onConnectionDoubleClick}
      />
      
      <NodeLayer
        videoNodes={videoNodes}
        documentNodes={documentNodes}
        chatNodes={chatNodes}
        onVideoNodePointerDown={onVideoNodePointerDown}
        onDocumentNodePointerDown={onDocumentNodePointerDown}
        onChatNodePointerDown={onChatNodePointerDown}
        onChatNodeResize={onChatNodeResize}
        onTranscriptClick={onTranscriptClick}
        onStartConnection={onStartConnection}
        onEndConnection={onEndConnection}
        onSendMessage={onSendMessage}
        isSendingMessageNodeId={isSendingMessageNodeId}
        onNodeDoubleClick={onNodeDoubleClick}
      />
    </div>
  );
};
