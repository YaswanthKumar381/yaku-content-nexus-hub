
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { TextNodeData } from '@/types/canvas';

interface TextNodeComponentProps {
  data: TextNodeData;
}

export const TextNodeComponent = ({ data }: TextNodeComponentProps) => {
  return (
    <div className="bg-zinc-800 rounded-md p-4 text-white shadow-md w-64">
      <div>{data.label}</div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="absolute top-2 right-2">
            <FileText className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <ScrollArea className="h-72">
            <div className="text-sm opacity-70">{data.context}</div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  );
};
