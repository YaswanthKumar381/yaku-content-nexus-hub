
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

export interface ChatNode {
  id: string;
  x: number;
  y: number;
  type: 'chat';
}

export type CanvasNode = VideoNode | DocumentNode | ChatNode;

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
