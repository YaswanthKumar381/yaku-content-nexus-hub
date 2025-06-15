export interface VideoNode {
  id: string;
  x: number;
  y: number;
  url: string;
  title: string;
  context?: string;
  type: 'video';
}

export interface DocumentFile {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  content?: string;
  uploadedAt: string;
}

export interface DocumentNode {
  id: string;
  x: number;
  y: number;
  documents: DocumentFile[];
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

export interface WebsiteData {
  url: string;
  title: string;
  content: string;
  fetchedAt: string;
}

export interface WebsiteNode {
  id: string;
  x: number;
  y: number;
  type: 'website';
  websites: WebsiteData[];
}

export type CanvasNode = VideoNode | DocumentNode | ChatNode | TextNode | WebsiteNode;

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
