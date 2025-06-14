
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { VideoNodeData } from '@/types/canvas';

interface VideoNodeComponentProps {
  data: VideoNodeData;
}

export const VideoNodeComponent = ({ data }: VideoNodeComponentProps) => {
  return (
    <div className="bg-zinc-800 rounded-md text-white shadow-md w-80">
      <img src={data.thumbnail} alt={data.title} className="rounded-t-md" />
      <div className="p-4">
        <h3 className="font-semibold mb-2">{data.title}</h3>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="absolute top-2 right-2">
              <FileText className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96">
            <ScrollArea className="h-96">
              <div className="text-sm opacity-70">{data.context}</div>
            </ScrollArea>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
