
import React, { useState, useEffect } from 'react';
import { TextNode } from '@/types/canvas';
import { useTheme } from '@/contexts/ThemeContext';
import { Trash2, Text as TextIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface TextNodeComponentProps {
  node: TextNode;
  onPointerDown: (e: React.PointerEvent, nodeId: string) => void;
  onUpdate: (nodeId: string, data: Partial<Omit<TextNode, 'id' | 'type'>>) => void;
  onDelete: (nodeId: string) => void;
  onStartConnection: (nodeId: string) => void;
  isConnected: boolean;
}

export const TextNodeComponent: React.FC<TextNodeComponentProps> = ({
  node,
  onPointerDown,
  onUpdate,
  onDelete,
  onStartConnection,
  isConnected,
}) => {
  const { isDarkMode } = useTheme();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [title, setTitle] = useState(node.title || '');
  const [content, setContent] = useState(node.content);
  
  const isNewNode = node.content === "Click to edit this note...";

  useEffect(() => {
    if (isNewNode) {
      setTimeout(() => setIsPopoverOpen(true), 100);
    }
  }, [isNewNode]);
  
  useEffect(() => {
    if (isPopoverOpen) {
        setTitle(node.title || '');
        setContent(isNewNode ? '' : node.content);
    }
  }, [isPopoverOpen, node.title, node.content, isNewNode]);

  const handleSave = () => {
    onUpdate(node.id, { title, content });
    setIsPopoverOpen(false);
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <div
          data-node-id={node.id}
          className="absolute rounded-lg shadow-lg group flex flex-col bg-white border-2 border-gray-200 cursor-grab overflow-visible"
          style={{
            transform: `translate(${node.x}px, ${node.y}px)`,
            width: node.width,
            height: node.height,
          }}
          onPointerDown={(e) => onPointerDown(e, node.id)}
        >
          <div className="flex items-center gap-2 px-3 py-1 bg-orange-100/90 rounded-t-md border-b-2 border-orange-200/90">
            <TextIcon size={14} className="text-orange-600" />
            <span className="text-sm font-semibold text-orange-800">Text</span>
          </div>
          <div className="p-3 flex-grow overflow-hidden">
            {node.title && <h3 className="font-bold text-sm text-gray-800 mb-1 truncate">{node.title}</h3>}
            <p className="text-xs text-gray-700 overflow-hidden text-ellipsis" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
              {isNewNode ? "Click to add text..." : node.content}
            </p>
          </div>

          <button
              className="absolute -top-2.5 -right-2.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
              onClick={(e) => {
                  e.stopPropagation();
                  onDelete(node.id);
              }}
          >
              <Trash2 size={12} />
          </button>

          <div
            data-connection-handle
            onPointerDown={(e) => {
              e.stopPropagation();
              onStartConnection(node.id);
            }}
            className="absolute top-1/2 -right-4 -translate-y-1/2 w-4 h-4 bg-transparent rounded-full border-2 border-orange-400 hover:border-orange-500 z-10 cursor-pointer flex items-center justify-center transition-opacity"
          >
            {isConnected && <div className="w-2 h-2 bg-orange-500 rounded-full" />}
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80 z-50" onPointerDown={(e) => e.stopPropagation()}>
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Text Note</h4>
            <p className="text-sm text-muted-foreground">
              Edit the title and content.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
               <label htmlFor="title" className="text-sm text-right">Title</label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-2 h-8"
                placeholder="Note title (optional)"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <label htmlFor="content" className="text-sm text-right">Content</label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="col-span-2 min-h-[120px]"
                placeholder="Type your note here."
              />
            </div>
          </div>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
