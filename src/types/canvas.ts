
import type { Node as ReactFlowNode, Edge } from '@xyflow/react';

export interface BaseNodeData {
  label: string;
  context: string;
  [key: string]: unknown;
}

export interface TextNodeData extends BaseNodeData {
  label: string;
  context: string;
}

export interface VideoNodeData extends BaseNodeData {
  label: string;
  url: string;
  thumbnail: string;
  title: string;
  context: string;
}

export interface TextNode extends ReactFlowNode {
  type: 'text';
  data: TextNodeData;
}

export interface VideoNode extends ReactFlowNode {
  type: 'video';
  data: VideoNodeData;
}

export type CanvasNode = TextNode | VideoNode;
