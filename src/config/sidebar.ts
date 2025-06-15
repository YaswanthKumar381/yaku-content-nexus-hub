
import { Archive, History, Bell } from "lucide-react";
import { SidebarTool } from "@/types/canvas";
import { YoutubeIcon } from "@/components/canvas/YoutubeIcon";
import { FileTextIcon } from "@/components/canvas/FileTextIcon";

export const sidebarTools: SidebarTool[] = [
  { id: "video", icon: YoutubeIcon, label: "Video" },
  { id: "filter", icon: Archive, label: "Filter" },
  { id: "history", icon: History, label: "History" },
  { id: "file-text", icon: FileTextIcon, label: "File" },
  { id: "folder", icon: Archive, label: "Folder" },
  { id: "rocket", icon: Bell, label: "Rocket" },
  { id: "chat", icon: Bell, label: "Chat" },
  { id: "help", icon: Bell, label: "Help" }
];
