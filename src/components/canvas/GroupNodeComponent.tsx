
import React, { useState, useCallback } from "react";
import { Trash2, GripVertical } from "lucide-react";
import { GroupNode } from "@/types/canvas";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";

interface GroupNodeProps {
  node: GroupNode;
  onPointerDown: (e: React.PointerEvent, nodeId: string) => void;
  onStartConnection: (nodeId: string) => void;
  onDelete: (nodeId: string) => void;
  onUpdate: (nodeId: string, updates: Partial<Omit<GroupNode, 'id' | 'type'>>) => void;
  isConnected: boolean;
}

export const GroupNodeComponent: React.FC<GroupNodeProps> = ({
  node,
  onPointerDown,
  onStartConnection,
  onDelete,
  onUpdate,
  isConnected,
}) => {
  const { isDarkMode } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(node.title);
  const [isResizing, setIsResizing] = useState(false);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.stopPropagation();
    onPointerDown(e, node.id);
  }, [onPointerDown, node.id]);

  const handleTitleEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  }, [setIsEditing]);

  const handleTitleSave = useCallback(() => {
    setIsEditing(false);
    onUpdate(node.id, { title: editTitle });
  }, [setIsEditing, onUpdate, node.id, editTitle]);

  const handleTitleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    }
  }, [handleTitleSave]);

  const handleResizeStart = useCallback((e: React.PointerEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [setIsResizing]);

  const handleResize = useCallback((e: React.PointerEvent) => {
    if (!isResizing) return;

    const newWidth = Math.max(100, node.width + e.movementX);
    const newHeight = Math.max(80, node.height + e.movementY);

    onUpdate(node.id, { width: newWidth, height: newHeight });
  }, [isResizing, onUpdate, node.id, node.width, node.height]);

  const handleResizeEnd = useCallback((e: React.PointerEvent) => {
    setIsResizing(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  }, [setIsResizing]);

  return (
    <div
      className={`absolute pointer-events-auto group`}
      style={{ 
        left: node.x, 
        top: node.y, 
        transform: 'translate(-50%, -50%)',
        width: node.width,
        height: node.height,
      }}
      onPointerDown={handlePointerDown}
      data-node-id={node.id}
    >
      <div className={`w-full h-full border-2 border-dashed rounded-lg transition-all duration-300 hover:shadow-lg ${
        isDarkMode 
          ? 'border-gray-500/50 bg-gray-800/10 hover:border-gray-400/70' 
          : 'border-gray-300/70 bg-gray-100/20 hover:border-gray-400/70'
      } backdrop-blur-sm group-hover:scale-[1.01]`}>
        
        {/* Delete Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(node.id);
          }}
          className="absolute top-2 left-2 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-red-500 hover:bg-red-500/10"
          title="Delete Group"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
        
        {/* Title */}
        <div className="absolute -top-8 left-0 right-0">
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={handleTitleKeyDown}
              className={`w-full px-2 py-1 text-sm font-semibold bg-transparent border-b-2 border-gray-500 focus:outline-none focus:border-blue-500 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}
              autoFocus
            />
          ) : (
            <h3 
              onClick={handleTitleEdit}
              className={`text-sm font-semibold cursor-pointer hover:opacity-80 transition-opacity ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}
              title="Click to edit title"
            >
              {node.title}
            </h3>
          )}
        </div>

        {/* Connection Handle - Completely Outside */}
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onStartConnection(node.id);
          }}
          className="absolute top-1/2 -translate-y-1/2 h-8 w-8 p-0 rounded-full bg-transparent hover:bg-transparent transition-colors z-10"
          style={{ right: '-32px' }}
          title="Create connection"
        >
          <div className="w-4 h-4 rounded-full border-2 border-violet-500 bg-transparent animate-pulse shadow-lg shadow-violet-500/30" />
        </Button>

        {/* Resize Handles */}
        <div 
          className="absolute bottom-1 right-1 w-5 h-5 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer group-hover:opacity-80 opacity-0 transition-opacity"
          onPointerDown={handleResizeStart}
          onPointerMove={handleResize}
          onPointerUp={handleResizeEnd}
        >
          <GripVertical className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
