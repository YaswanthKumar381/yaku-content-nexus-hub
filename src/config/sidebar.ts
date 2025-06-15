
import { Archive, History } from "lucide-react";
import { SidebarTool } from "@/types/canvas";
import { YoutubeIcon } from "@/components/canvas/YoutubeIcon";
import { FileTextIcon } from "@/components/canvas/FileTextIcon";
import { KeyboardIcon } from "@/components/canvas/KeyboardIcon";
import { EarthIcon } from "@/components/canvas/EarthIcon";
import { ImageNodeIcon } from "@/components/canvas/ImageNodeIcon";
import { GalleryVerticalEndIcon } from "@/components/icons/animated/GalleryVerticalEndIcon";
import { AudioLinesIcon } from "@/components/icons/animated/AudioLinesIcon";

export const sidebarTools: SidebarTool[] = [
  { id: "video", icon: YoutubeIcon, label: "Video" },
  { id: "filter", icon: Archive, label: "Filter" },
  { id: "history", icon: History, label: "History" },
  { id: "file-text", icon: FileTextIcon, label: "File" },
  { id: "text", icon: KeyboardIcon, label: "Text" },
  { id: "website", icon: EarthIcon, label: "Website" },
  { id: "image", icon: ImageNodeIcon, label: "Image" },
  { id: "gallery", icon: GalleryVerticalEndIcon, label: "Gallery" },
  { id: "audio", icon: AudioLinesIcon, label: "Audio" }
];
