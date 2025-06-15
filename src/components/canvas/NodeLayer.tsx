
import React from 'react';
import { VideoNode, DocumentNode, ChatNode, Connection } from '@/types/canvas';
import { VideoNodeComponent } from './VideoNodeComponent';
import { DocumentNodeComponent } from './DocumentNodeComponent';
import { ChatNodeComponent } from './ChatNodeComponent';

interface NodeLayerProps {
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
  onDeleteVideoNode: (nodeId: string) => void;
  onDeleteDocumentNode: (nodeId: string) => void;
  onSendMessage: (nodeId: string, message: string) => void;
  isSendingMessageNodeId: string | null;
  connections: Connection[];
}

export const NodeLayer: React.FC<NodeLayerProps> = ({
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
  onDeleteVideoNode,
  onDeleteDocumentNode,
  onSendMessage,
  isSendingMessageNodeId,
  connections,
}) => {
  return (
    <>
      {/* Video Nodes */}
      {videoNodes.map((node) => {
        const isConnected = connections.some(c => c.sourceId === node.id);
        return (
          <VideoNodeComponent
            key={node.id}
            node={node}
            onPointerDown={onVideoNodePointerDown}
            onTranscriptClick={onTranscriptClick}
            onStartConnection={onStartConnection}
            onDelete={onDeleteVideoNode}
            isConnected={isConnected}
          />
        );
      })}

      {/* Document Nodes */}
      {documentNodes.map((node) => {
        const isConnected = connections.some(c => c.sourceId === node.id);
        return (
          <DocumentNodeComponent
            key={node.id}
            node={node}
            onPointerDown={onDocumentNodePointerDown}
            onStartConnection={onStartConnection}
            onDelete={onDeleteDocumentNode}
            isConnected={isConnected}
          />
        );
      })}

      {/* Chat Nodes */}
      {chatNodes.map((node) => {
        const isConnected = connections.some(c => c.targetId === node.id);
        return (
          <ChatNodeComponent
            key={node.id}
            node={node}
            onPointerDown={onChatNodePointerDown}
            onEndConnection={onEndConnection}
            onSendMessage={onSendMessage}
            isSendingMessage={isSendingMessageNodeId === node.id}
            onResize={onChatNodeResize}
            isConnected={isConnected}
          />
        );
      })}
    </>
  );
};
