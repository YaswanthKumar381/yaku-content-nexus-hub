
import React from 'react';
import { VideoNode, DocumentNode, ChatNode, Connection, TextNode, WebsiteNode, AudioNode, ImageNode, GroupNode } from '@/types/canvas';
import { VideoNodeComponent } from './VideoNodeComponent';
import { DocumentNodeComponent } from './DocumentNodeComponent';
import { ChatNodeComponent } from './ChatNodeComponent';
import { TextNodeComponent } from './TextNodeComponent';
import { WebsiteNodeComponent } from './WebsiteNodeComponent';
import { AudioNodeComponent } from './AudioNodeComponent';
import { ImageNodeComponent } from './ImageNodeComponent';
import { GroupNodeComponent } from './GroupNodeComponent';

interface NodeLayerProps {
  videoNodes: VideoNode[];
  documentNodes: DocumentNode[];
  chatNodes: ChatNode[];
  textNodes: TextNode[];
  websiteNodes: WebsiteNode[];
  audioNodes: AudioNode[];
  imageNodes: ImageNode[];
  groupNodes: GroupNode[];
  onVideoNodePointerDown: (e: React.PointerEvent, nodeId: string) => void;
  onDocumentNodePointerDown: (e: React.PointerEvent, nodeId: string) => void;
  onChatNodePointerDown: (e: React.PointerEvent, nodeId: string) => void;
  onTextNodePointerDown: (e: React.PointerEvent, nodeId: string) => void;
  onWebsiteNodePointerDown: (e: React.PointerEvent, nodeId: string) => void;
  onAudioNodePointerDown: (e: React.PointerEvent, nodeId: string) => void;
  onImageNodePointerDown: (e: React.PointerEvent, nodeId: string) => void;
  onGroupNodePointerDown: (e: React.PointerEvent, nodeId: string) => void;
  onChatNodeResize: (nodeId: string, height: number) => void;
  onTranscriptClick: (e: React.MouseEvent, node: VideoNode) => void;
  onStartConnection: (nodeId: string) => void;
  onEndConnection: (nodeId:string) => void;
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
  onUpdateTextNode: (nodeId: string, data: Partial<Omit<TextNode, 'id'|'type'>>) => void;
  onSendMessage: (nodeId: string, message: string) => void;
  onDeleteGroupNode: (nodeId: string) => void;
  onUpdateGroupNode: (nodeId: string, updates: Partial<Omit<GroupNode, 'id' | 'type'>>) => void;
  isSendingMessageNodeId: string | null;
  connections: Connection[];
  onAddRecordingToNode: (nodeId: string, audioBlob: Blob, duration: number) => Promise<void>;
  onDeleteRecording: (nodeId: string, recordingId: string) => void;
}

export const NodeLayer: React.FC<NodeLayerProps> = ({
  videoNodes,
  documentNodes,
  chatNodes,
  textNodes,
  websiteNodes,
  audioNodes,
  imageNodes,
  groupNodes,
  onVideoNodePointerDown,
  onDocumentNodePointerDown,
  onChatNodePointerDown,
  onTextNodePointerDown,
  onWebsiteNodePointerDown,
  onAudioNodePointerDown,
  onImageNodePointerDown,
  onGroupNodePointerDown,
  onChatNodeResize,
  onTranscriptClick,
  onStartConnection,
  onEndConnection,
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
  onUpdateTextNode,
  onSendMessage,
  onDeleteGroupNode,
  onUpdateGroupNode,
  isSendingMessageNodeId,
  connections,
  onAddRecordingToNode,
  onDeleteRecording,
}) => {
  return (
    <>
      {/* Group Nodes - Rendered first so they appear behind other nodes */}
      {groupNodes.map((node) => {
        const isConnected = connections.some(c => c.sourceId === node.id);
        return (
          <GroupNodeComponent
            key={node.id}
            node={node}
            onPointerDown={onGroupNodePointerDown}
            onStartConnection={onStartConnection}
            onDelete={onDeleteGroupNode}
            onUpdate={onUpdateGroupNode}
            isConnected={isConnected}
          />
        );
      })}

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
            onDeleteFile={onDeleteDocumentFile}
            onUploadClick={onDocumentNodeUploadClick}
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

      {/* Text Nodes */}
      {textNodes.map((node) => {
        const isConnected = connections.some(c => c.sourceId === node.id);
        return (
          <TextNodeComponent
            key={node.id}
            node={node}
            onPointerDown={onTextNodePointerDown}
            onStartConnection={onStartConnection}
            onDelete={onDeleteTextNode}
            onUpdate={onUpdateTextNode}
            isConnected={isConnected}
          />
        );
      })}

      {/* Website Nodes */}
      {websiteNodes.map((node) => {
        const isConnected = connections.some(c => c.sourceId === node.id);
        return (
          <WebsiteNodeComponent
            key={node.id}
            node={node}
            onPointerDown={onWebsiteNodePointerDown}
            onStartConnection={onStartConnection}
            onDelete={onDeleteWebsiteNode}
            isConnected={isConnected}
          />
        );
      })}

      {/* Audio Nodes */}
      {audioNodes.map((node) => {
        const isConnected = connections.some(c => c.sourceId === node.id);
        return (
          <AudioNodeComponent
            key={node.id}
            node={node}
            onPointerDown={onAudioNodePointerDown}
            onStartConnection={onStartConnection}
            onDelete={onDeleteAudioNode}
            onAddRecording={onAddRecordingToNode}
            onDeleteRecording={onDeleteRecording}
            isConnected={isConnected}
          />
        );
      })}

      {/* Image Nodes */}
      {imageNodes.map((node) => {
        const isConnected = connections.some(c => c.sourceId === node.id);
        return (
          <ImageNodeComponent
            key={node.id}
            node={node}
            onPointerDown={onImageNodePointerDown}
            onStartConnection={onStartConnection}
            onDelete={onDeleteImageNode}
            onDeleteImage={onDeleteImageFile}
            onUploadClick={onImageNodeUploadClick}
            onAnalyzeImage={onAnalyzeImage}
            isConnected={isConnected}
          />
        );
      })}
    </>
  );
};
