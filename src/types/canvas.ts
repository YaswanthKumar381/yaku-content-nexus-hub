
export interface VideoNode {
  id: string;
  x: number;
  y: number;
  url: string;
  title: string;
  context?: string;
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
