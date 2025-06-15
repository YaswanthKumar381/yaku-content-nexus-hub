
import React, { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable";
import { Trash2, Edit3, Check, X } from "lucide-react";
import { GroupNode } from "@/types/canvas";
import { useTheme } from "@/contexts/ThemeContext";

interface GroupNodeComponentProps {
  node: GroupNode;
  onPointerDown: (e: React.PointerEvent, nodeId: string) => void;
  onStartConnection: (nodeId: string) => void;
  onDelete: (nodeId: string) => void;
  onUpdate: (nodeId: string, updates: Partial<Omit<GroupNode, 'id' | 'type'>>) => void;
  isConnected: boolean;
  containedNodesCount: number;
}

export const GroupNodeComponent: React.FC<GroupNodeComponentProps> = ({
  node,
  onPointerDown,
  onStartConnection,
  onDelete,
  onUpdate,
  isConnected,
  containedNodesCount,
}) => {
  const { isDarkMode } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(node.title);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTitleEdit = () => {
    setIsEditing(true);
    setEditTitle(node.title);
  };

  const handleTitleSave = () => {
    onUpdate(node.id, { title: editTitle });
    setIsEditing(false);
  };

  const handleTitleCancel = () => {
    setEditTitle(node.title);
    setIsEditing(false);
  };

  const handleResize = (newWidth: number, newHeight: number) => {
    onUpdate(node.id, { width: newWidth, height: newHeight });
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (!isResizing) {
          setIsResizing(true);
          handleResize(width, height);
          setTimeout(() => setIsResizing(false), 100);
        }
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [isResizing]);

  return (
    <div
      className="absolute pointer-events-auto group"
      style={{ 
        left: node.x - node.width / 2, 
        top: node.y - node.height / 2,
        width: node.width,
        height: node.height,
      }}
      onPointerDown={(e) => onPointerDown(e, node.id)}
      data-node-id={node.id}
    >
      <Card 
        ref={containerRef}
        className={`w-full h-full relative border-2 border-dashed transition-all duration-300 ${
          isDarkMode 
            ? 'bg-zinc-800/20 border-zinc-600/50 hover:border-zinc-500/70' 
            : 'bg-gray-100/20 border-gray-300/50 hover:border-gray-400/70'
        } backdrop-blur-sm resize overflow-hidden`}
        style={{ 
          minWidth: '200px', 
          minHeight: '150px',
          resize: 'both',
        }}
      >
        {/* Header */}
        <div className={`absolute top-0 left-0 right-0 p-3 border-b border-dashed ${
          isDarkMode ? 'border-zinc-600/30 bg-zinc-800/40' : 'border-gray-300/30 bg-gray-100/40'
        } backdrop-blur-sm`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1">
              {isEditing ? (
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="h-6 text-sm border-none bg-transparent focus:ring-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleTitleSave();
                      if (e.key === 'Escape') handleTitleCancel();
                    }}
                    autoFocus
                  />
                  <Button variant="ghost" size="sm" onClick={handleTitleSave} className="h-6 w-6 p-0">
                    <Check className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleTitleCancel} className="h-6 w-6 p-0">
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 flex-1">
                  <h3 className="font-medium text-sm truncate">{node.title}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleTitleEdit}
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Edit3 className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-1">
              <span className={`text-xs px-2 py-1 rounded-full ${
                isDarkMode ? 'bg-zinc-700/50 text-zinc-300' : 'bg-gray-200/50 text-gray-600'
              }`}>
                {containedNodesCount} items
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(node.id);
                }}
                className="h-6 w-6 p-0 text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="absolute inset-0 top-12 p-4">
          <div className={`w-full h-full border border-dashed rounded-lg flex items-center justify-center ${
            isDarkMode ? 'border-zinc-600/30' : 'border-gray-300/30'
          }`}>
            <span className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-gray-500'}`}>
              Drag nodes here to group them
            </span>
          </div>
        </div>
      </Card>

      {/* Connection Handle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onStartConnection(node.id);
        }}
        className="absolute -right-8 top-1/2 -translate-y-1/2 h-8 w-8 p-0 rounded-full hover:bg-blue-500/20 transition-colors z-10"
        title="Create connection"
      >
        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 animate-pulse" />
      </Button>
    </div>
  );
};
