
import React from 'react';
import { VideoNode, DocumentNode, ChatNode } from '@/types/canvas';
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
  onTranscriptClick: (e: React.MouseEvent, node: VideoNode) => void;
  onStartConnection: (nodeId: string) => void;
  onEndConnection: (nodeId:string) => void;
  onSendMessage: (nodeId: string, message: string) => void;
  isSendingMessageNodeId: string | null;
}

export const NodeLayer: React.FC<NodeLayerProps> = ({
  videoNodes,
  documentNodes,
  chatNodes,
  onVideoNodePointerDown,
  onDocumentNodePointerDown,
  onChatNodePointerDown,
  onTranscriptClick,
  onStartConnection,
  onEndConnection,
  onSendMessage,
  isSendingMessageNodeId,
}) => {
  return (
    <>
      {/* Video Nodes */}
      {videoNodes.map((node) => (
        <VideoNodeComponent
          key={node.id}
          node={node}
          onPointerDown={onVideoNodePointerDown}
          onTranscriptClick={onTranscriptClick}
          onStartConnection={onStartConnection}
        />
      ))}

      {/* Document Nodes */}
      {documentNodes.map((node) => (
        <DocumentNodeComponent
          key={node.id}
          node={node}
          onPointerDown={onDocumentNodePointerDown}
          onStartConnection={onStartConnection}
        />
      ))}

      {/* Chat Nodes */}
      {chatNodes.map((node) => (
        <ChatNodeComponent
          key={node.id}
          node={node}
          onPointerDown={onChatNodePointerDown}
          onEndConnection={onEndConnection}
          onSendMessage={onSendMessage}
          isSendingMessage={isSendingMessageNodeId === node.id}
        />
      ))}
    </>
  );
};
