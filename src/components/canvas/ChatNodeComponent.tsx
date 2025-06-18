
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ChatNode, ChatMessage } from '@/types/canvas';
import { PromptInputBox } from './PromptInputBox';
import { useTheme } from '@/contexts/ThemeContext';
import { Bot, User, Plus, MessageCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { v4 as uuidv4 } from 'uuid';

interface ChatSession {
  id: string;
  name: string;
  messages: ChatMessage[];
}

interface ChatNodeComponentProps {
  node: ChatNode;
  onPointerDown: (e: React.PointerEvent, nodeId: string) => void;
  onEndConnection: (nodeId: string) => void;
  onSendMessage: (nodeId: string, message: string) => void;
  isSendingMessage: boolean;
  onResize: (nodeId: string, height: number) => void;
  isConnected: boolean;
}

export const ChatNodeComponent: React.FC<ChatNodeComponentProps> = ({ 
  node, 
  onPointerDown, 
  onEndConnection, 
  onSendMessage, 
  isSendingMessage, 
  onResize, 
  isConnected 
}) => {
  const { isDarkMode } = useTheme();
  const scrollAreaViewportRef = useRef<HTMLDivElement>(null);
  const resizerRef = useRef<HTMLDivElement>(null);
  
  // Initialize chat sessions - convert existing messages to first session
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(() => [
    {
      id: 'default',
      name: 'New Chat',
      messages: node.messages
    }
  ]);
  const [activeSessionId, setActiveSessionId] = useState('default');

  const activeSession = chatSessions.find(session => session.id === activeSessionId) || chatSessions[0];

  useEffect(() => {
    if (scrollAreaViewportRef.current) {
        scrollAreaViewportRef.current.scrollTo({ top: scrollAreaViewportRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [activeSession?.messages, isSendingMessage]);

  const handlePointerDown = (e: React.PointerEvent) => {
    // Allow dragging from anywhere on the chat node now
    console.log('✅ Starting chat node drag');
    e.stopPropagation();
    onPointerDown(e, node.id);
  };

  const handleConnectionEnd = (e: React.PointerEvent) => {
    e.stopPropagation();
    onEndConnection(node.id);
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
        onResize(node.id, Math.max(400, Math.min(800, newHeight)));
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

  const createNewChat = () => {
    const newSession: ChatSession = {
      id: uuidv4(),
      name: `Chat ${chatSessions.length + 1}`,
      messages: [
        { id: uuidv4(), role: 'system', content: 'You are Yaku, a helpful AI assistant. Use the provided context from connected nodes to answer user questions.' },
        { id: uuidv4(), role: 'model', content: 'Hello! How can I help you today? Connect some video or document nodes to me and ask a question.' }
      ]
    };
    setChatSessions(prev => [...prev, newSession]);
    setActiveSessionId(newSession.id);
  };

  // Prevent event bubbling for interactive content
  const handleContentInteraction = (e: React.SyntheticEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="absolute flex cursor-move"
      style={{
        left: node.x,
        top: node.y,
        transform: 'translate(-50%, -50%)',
        width: '800px',
        height: `${node.height + 60}px`,
      }}
      onPointerDown={handlePointerDown}
      data-node-id={node.id}
    >
      {/* Left handle - positioned to not interfere with dragging */}
      <div 
        onPointerUp={handleConnectionEnd}
        className={`absolute top-1/2 left-[-16px] transform -translate-y-1/2 w-4 h-4 bg-transparent rounded-full border-2 ${isDarkMode ? 'border-purple-400' : 'border-purple-600'} z-20 cursor-pointer flex items-center justify-center hover:scale-110 transition-transform`}
        title="Drop connection here"
      >
        {isConnected && <div className={`w-1.5 h-1.5 ${isDarkMode ? 'bg-purple-400' : 'bg-purple-600'} rounded-full`} />}
      </div>
      
      <div className="flex bg-zinc-900/95 backdrop-blur-md rounded-2xl overflow-hidden border border-zinc-700/50 shadow-2xl shadow-black/30 pointer-events-auto h-full">
        {/* Left Sidebar - Chat Sessions */}
        <div className="w-64 bg-zinc-800/80 border-r border-zinc-700/50 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-zinc-700/50">
            <div className="flex items-center gap-2 mb-3">
              <Bot className="w-5 h-5 text-purple-400" />
              <span className="text-white font-medium text-sm">AI Assistant</span>
            </div>
            <Button
              onClick={createNewChat}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 px-3 rounded-lg flex items-center gap-2"
              size="sm"
            >
              <Plus className="w-4 h-4" />
              New Chat
            </Button>
          </div>

          {/* Chat Sessions List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-2">
              <div className="text-xs text-zinc-400 mb-2 px-2">Previous Chats</div>
              {chatSessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => setActiveSessionId(session.id)}
                  className={`w-full text-left p-3 rounded-lg mb-1 text-sm transition-colors ${
                    activeSessionId === session.id 
                      ? 'bg-zinc-700/80 text-white' 
                      : 'text-zinc-300 hover:bg-zinc-700/40'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-3 h-3" />
                    <span className="truncate">{session.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-zinc-700/50 bg-zinc-800/40">
            <h3 className="text-white font-medium">{activeSession?.name || 'Chat'}</h3>
          </div>

          {/* Chat Messages Area */}
          <ScrollArea 
              className="flex-1 px-4 cursor-auto"
              style={{ height: `${node.height - 140}px` }}
              onClick={handleContentInteraction}
              onPointerDown={handleContentInteraction}
          >
              <div className="py-4 flex flex-col gap-6" ref={scrollAreaViewportRef}>
                  {activeSession?.messages.filter(m => m.role !== 'system').map(message => (
                      <div key={message.id} className={`flex items-start gap-4 max-w-[85%] ${message.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.role === 'user' ? 'bg-blue-600' : 'bg-purple-500'}`}>
                              {message.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                          </div>
                          <div className={`px-4 py-3 rounded-2xl text-white max-w-full ${message.role === 'user' ? 'bg-blue-600' : 'bg-zinc-700'}`}>
                              <div className="text-xs text-zinc-300 mb-1 font-medium">
                                  {message.role === 'user' ? 'Amaanath' : 'Poppy'}
                              </div>
                              <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                          </div>
                      </div>
                  ))}
                  {isSendingMessage && (
                      <div className="flex items-start gap-4 self-start">
                          <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                              <Bot className="w-4 h-4 text-white" />
                          </div>
                          <div className="px-4 py-3 rounded-2xl bg-zinc-700">
                              <div className="text-xs text-zinc-300 mb-1 font-medium">Poppy</div>
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

          {/* Input area */}
          <div 
            className="border-t border-zinc-700/50 bg-zinc-800/90 p-4" 
            onClick={handleContentInteraction}
            onPointerDown={handleContentInteraction}
          >
            <PromptInputBox 
                  onSend={(message) => onSendMessage(node.id, message)}
                  isLoading={isSendingMessage}
                  placeholder="Type your message to Claude 3.5..."
                  className="bg-zinc-700/50 border-zinc-600/50 shadow-none rounded-xl min-h-[50px] text-white placeholder:text-zinc-400"
            />
          </div>
        </div>
      </div>
      
      {/* Resizer */}
      <div 
        ref={resizerRef}
        onPointerDown={handleResizePointerDown}
        className="w-full h-4 cursor-ns-resize flex items-center justify-center group absolute bottom-0"
      >
        <div className="w-10 h-1.5 bg-zinc-600 rounded-full group-hover:bg-purple-500 transition-colors" />
      </div>
    </div>
  );
};
