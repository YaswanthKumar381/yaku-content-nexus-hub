
import { Archive, History, Bell } from "lucide-react";
import { SidebarTool } from "@/types/canvas";
import { YoutubeIcon } from "@/components/canvas/YoutubeIcon";
import { FileTextIcon } from "@/components/canvas/FileTextIcon";
import { KeyboardIcon } from "@/components/canvas/KeyboardIcon";
import { EarthIcon } from "@/components/canvas/EarthIcon";

export const sidebarTools: SidebarTool[] = [
  { id: "video", icon: YoutubeIcon, label: "Video" },
  { id: "filter", icon: Archive, label: "Filter" },
  { id: "history", icon: History, label: "History" },
  { id: "file-text", icon: FileTextIcon, label: "File" },
  { id: "text", icon: KeyboardIcon, label: "Text" },
  { id: "website", icon: EarthIcon, label: "Website" },
  { id: "chat", icon: Bell, label: "Chat" },
  { id: "help", icon: Bell, label: "Help" }
];
