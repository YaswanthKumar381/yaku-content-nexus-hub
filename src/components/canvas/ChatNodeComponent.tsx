
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ChatNode } from '@/types/canvas';
import { PromptInputBox } from './PromptInputBox';
import { useTheme } from '@/contexts/ThemeContext';
import { Bot, User } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChatNodeComponentProps {
  node: ChatNode;
  onPointerDown: (e: React.PointerEvent, nodeId: string) => void;
  onEndConnection: (nodeId: string) => void;
  onSendMessage: (nodeId: string, message: string) => void;
  isSendingMessage: boolean;
  onResize: (nodeId: string, height: number) => void;
}

export const ChatNodeComponent: React.FC<ChatNodeComponentProps> = ({ node, onPointerDown, onEndConnection, onSendMessage, isSendingMessage, onResize }) => {
  const { isDarkMode } = useTheme();
  const scrollAreaViewportRef = useRef<HTMLDivElement>(null);
  const resizerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaViewportRef.current) {
        scrollAreaViewportRef.current.scrollTo({ top: scrollAreaViewportRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [node.messages, isSendingMessage]);
  
  const handlePointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button, input, textarea, a, [data-resizer], [data-scroll-area]')) {
      return;
    }
    onPointerDown(e, node.id);
  };

  const handleResizePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    const target = resizerRef.current;
    if (!target) return;
    target.setPointerCapture(e.pointerId);

    const startY = e.clientY;
    const startHeight = node.height;

    const handlePointerMove = (moveEvent: PointerEvent) => {
        const newHeight = startHeight + (moveEvent.clientY - startY);
        onResize(node.id, Math.max(200, Math.min(800, newHeight)));
    };

    const handlePointerUp = (upEvent: PointerEvent) => {
        if (target) {
            target.releasePointerCapture(e.pointerId);
        }
        document.removeEventListener('pointermove', handlePointerMove);
        document.removeEventListener('pointerup', handlePointerUp);
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  };

  return (
    <div
      className="absolute cursor-move flex flex-col"
      style={{
        left: node.x,
        top: node.y,
        transform: 'translate(-50%, -50%)',
        width: '600px',
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
      
      <div className="flex flex-col bg-zinc-800/80 backdrop-blur-md rounded-3xl overflow-hidden border border-zinc-700/50 shadow-2xl shadow-black/30">
        <ScrollArea 
            onWheel={(e) => e.stopPropagation()}
            className="flex-grow pr-2"
            style={{ height: `${node.height}px` }}
            data-scroll-area
        >
            <div className="h-full p-4 flex flex-col gap-4" ref={scrollAreaViewportRef}>
                {node.messages.filter(m => m.role !== 'system').map(message => (
                    <div key={message.id} className={`flex items-start gap-3 max-w-[85%] ${message.role === 'user' ? 'self-end' : 'self-start'}`}>
                        {message.role === 'model' && <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0"><Bot className="w-5 h-5 text-white" /></div>}
                        <div className={`px-4 py-2.5 rounded-2xl text-white ${message.role === 'user' ? 'bg-blue-600 rounded-br-none' : 'bg-zinc-700 rounded-bl-none'}`}>
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                        {message.role === 'user' && <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0"><User className="w-5 h-5 text-white" /></div>}
                    </div>
                ))}
                {isSendingMessage && (
                    <div className="flex items-start gap-3 self-start">
                        <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0"><Bot className="w-5 h-5 text-white" /></div>
                        <div className="px-4 py-2.5 rounded-2xl bg-zinc-700 rounded-bl-none">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ScrollArea>

        <div className="cursor-default border-t border-zinc-700/50">
          <PromptInputBox 
                onSend={(message) => onSendMessage(node.id, message)}
                isLoading={isSendingMessage}
                placeholder="Ask about the connected content..."
                className="bg-transparent border-none shadow-none rounded-none"
          />
        </div>
      </div>
      <div 
        ref={resizerRef}
        data-resizer
        onPointerDown={handleResizePointerDown}
        className="w-full h-4 cursor-ns-resize flex items-center justify-center group absolute bottom-0"
      >
        <div className="w-10 h-1.5 bg-zinc-600 rounded-full group-hover:bg-purple-500 transition-colors" />
      </div>
    </div>
  );
};
