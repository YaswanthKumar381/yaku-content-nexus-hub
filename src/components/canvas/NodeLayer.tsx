
import React from 'react';
import { VideoNode, DocumentNode, ChatNode, CanvasNode } from '@/types/canvas';
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
  onSendMessage: (nodeId: string, message: string) => void;
  isSendingMessageNodeId: string | null;
  onNodeDoubleClick: (node: CanvasNode, e: React.MouseEvent) => void;
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
  onSendMessage,
  isSendingMessageNodeId,
  onNodeDoubleClick,
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
          onDoubleClick={(e) => onNodeDoubleClick(node, e)}
        />
      ))}

      {/* Document Nodes */}
      {documentNodes.map((node) => (
        <DocumentNodeComponent
          key={node.id}
          node={node}
          onPointerDown={onDocumentNodePointerDown}
          onStartConnection={onStartConnection}
          onDoubleClick={(e) => onNodeDoubleClick(node, e)}
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
          onResize={onChatNodeResize}
          onDoubleClick={(e) => onNodeDoubleClick(node, e)}
        />
      ))}
    </>
  );
};
