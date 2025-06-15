
export interface VideoNode {
  id: string;
  x: number;
  y: number;
  url: string;
  title: string;
  context?: string;
  type: 'video';
}

export interface DocumentNode {
  id: string;
  x: number;
  y: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  content?: string;
  uploadedAt: string;
  type: 'document';
}

export interface TextNode {
  id: string;
  x: number;
  y: number;
  type: 'text';
  title?: string;
  content: string;
  width: number;
  height: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
}

export interface ChatNode {
  id: string;
  x: number;
  y: number;
  type: 'chat';
  messages: ChatMessage[];
  height: number;
}

export type CanvasNode = VideoNode | DocumentNode | ChatNode | TextNode;

export interface Connection {
  id: string;
  sourceId: string;
  targetId: string;
}

export interface Transform {
  x: number;
  y: number;
  scale: number;
}

export interface SidebarTool {
  id: string;
  icon: any;
  label: string;
}
