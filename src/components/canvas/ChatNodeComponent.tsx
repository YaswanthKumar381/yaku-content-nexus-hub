
import React from 'react';
import { ChatNode, ChatMessage } from '@/types/canvas';
import { PromptInputBox } from './PromptInputBox';
import { useTheme } from '@/contexts/ThemeContext';
import { Bot, User } from 'lucide-react';

interface ChatNodeComponentProps {
  node: ChatNode;
  onPointerDown: (e: React.PointerEvent, nodeId: string) => void;
  onEndConnection: (nodeId: string) => void;
  onSendMessage: (nodeId: string, message: string) => void;
  isSendingMessage: boolean;
}

export const ChatNodeComponent: React.FC<ChatNodeComponentProps> = ({ node, onPointerDown, onEndConnection, onSendMessage, isSendingMessage }) => {
  const { isDarkMode } = useTheme();
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [node.messages, isSendingMessage]);
  
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
      
      <div className="flex-grow h-80 bg-zinc-800/70 backdrop-blur-sm rounded-t-3xl p-4 overflow-y-auto flex flex-col gap-4 scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-transparent">
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
        <div ref={messagesEndRef} />
      </div>

      <div className="cursor-default">
        <PromptInputBox 
          onSend={(message) => onSendMessage(node.id, message)}
          isLoading={isSendingMessage}
          placeholder="Ask about the connected content..."
        />
      </div>
    </div>
  );
};
