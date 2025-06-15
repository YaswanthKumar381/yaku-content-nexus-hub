
import React, { useRef } from 'react';
import { TextNode } from '@/types/canvas';
import { useTheme } from '@/contexts/ThemeContext';
import { Trash2 } from 'lucide-react';

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    // Prevent textarea drag/resize from moving the node
    if (textareaRef.current?.contains(target)) {
      if (
        e.clientX > textareaRef.current.getBoundingClientRect().right - 16 &&
        e.clientY > textareaRef.current.getBoundingClientRect().bottom - 16
      ) {
        return;
      }
    }
    onPointerDown(e, node.id);
  };
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate(node.id, { content: e.target.value });
  };
  
  const handleResizeEnd = () => {
    if (textareaRef.current) {
      onUpdate(node.id, { width: textareaRef.current.offsetWidth, height: node.height });
    }
  };

  return (
    <div
      data-node-id={node.id}
      className={`absolute rounded-lg shadow-lg group flex flex-col
        bg-orange-200/80 border-2 border-orange-400/90 backdrop-blur-sm cursor-grab
      `}
      style={{
        transform: `translate(${node.x}px, ${node.y}px)`,
        width: node.width,
        height: node.height,
      }}
      onPointerDown={onPointerDown}
    >
        <div className="flex-grow p-2 pt-1 flex flex-col">
            <textarea
                ref={textareaRef}
                className="w-full flex-grow bg-transparent border-none outline-none text-gray-800 placeholder-gray-600 resize"
                style={{ fontFamily: 'inherit', fontSize: '14px', lineHeight: '1.5' }}
                value={node.content}
                onChange={handleContentChange}
                onMouseUp={handleResizeEnd} 
                placeholder="Type something..."
                onPointerDown={(e) => e.stopPropagation()} // Prevent node drag when interacting with textarea
            />
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
            className={`absolute -right-[7px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full cursor-pointer
            ${isConnected ? 'bg-green-500' : 'bg-blue-500 hover:bg-blue-600'} border-2 ${isDarkMode ? 'border-zinc-900' : 'border-orange-200/80'} z-10`}
            onPointerDown={(e) => {
                e.stopPropagation();
                onStartConnection(node.id);
            }}
        />
    </div>
  );
};
