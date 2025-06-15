
import React from 'react';
import { ChatNode } from '@/types/canvas';
import { PromptInputBox } from './PromptInputBox';
import { useTheme } from '@/contexts/ThemeContext';

interface ChatNodeComponentProps {
  node: ChatNode;
  onPointerDown: (e: React.PointerEvent, nodeId: string) => void;
  onEndConnection: (nodeId: string) => void;
}

export const ChatNodeComponent: React.FC<ChatNodeComponentProps> = ({ node, onPointerDown, onEndConnection }) => {
  const { isDarkMode } = useTheme();
  
  const handlePointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    // Prevent dragging when interacting with the prompt box contents
    if (target.closest('button, input, textarea, a')) {
      return;
    }
    onPointerDown(e, node.id);
  };

  return (
    <div
      className="absolute cursor-move"
      style={{
        left: node.x,
        top: node.y,
        transform: 'translate(-50%, -50%)',
        width: '500px',
      }}
      onPointerDown={handlePointerDown}
    >
      {/* Left handle */}
      <div 
        onPointerUp={(e) => {
          e.stopPropagation();
          onEndConnection(node.id);
        }}
        className={`absolute top-1/2 left-[-16px] transform -translate-y-1/2 w-4 h-4 bg-transparent rounded-full border-2 ${isDarkMode ? 'border-purple-400' : 'border-purple-600'} z-20 cursor-pointer`}
      />
      
      <div className="cursor-default">
        <PromptInputBox />
      </div>
    </div>
  );
};
