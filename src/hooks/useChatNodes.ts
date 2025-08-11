import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { ChatNode, ChatMessage } from "@/types/canvas";
import { generateContent } from "@/services/geminiService";
import { generateContentWithGroq } from "@/services/groqChatService";

interface useChatNodesProps {
  onNodeClick: (nodeId: string) => void;
}

export const useChatNodes = ({ onNodeClick }: useChatNodesProps) => {
  const [chatNodes, setChatNodes] = useState<ChatNode[]>([]);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [isSendingMessageNodeId, setIsSendingMessageNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const addChatNode = useCallback((x: number, y: number, nodeId?: string) => {
    const id = nodeId || uuidv4();
    const newNode: ChatNode = {
      id,
      x,
      y,
      type: "chat",
      height: 400, // Default height
      messages: [
        { id: uuidv4(), role: 'system', content: 'You are Yashu, a helpful AI assistant. Use the provided context from connected nodes to answer user questions.' },
        { id: uuidv4(), role: 'model', content: 'Hello! How can I help you today? Connect some video or document nodes to me and ask a question.' }
      ],
    };
    setChatNodes((prevNodes) => [...prevNodes, newNode]);
    return newNode;
  }, []);

  const updateChatNodeMessages = useCallback((nodeId: string, newMessage: ChatMessage) => {
    setChatNodes(prev => prev.map(node => {
      if (node.id === nodeId) {
        return { ...node, messages: [...node.messages, newMessage] };
      }
      return node;
    }));
  }, []);

  const sendMessage = useCallback(async (nodeId: string, userMessage: string, context: string) => {
    const chatNode = chatNodes.find(n => n.id === nodeId);
    if (!chatNode) return;

    setIsSendingMessageNodeId(nodeId);
    updateChatNodeMessages(nodeId, { id: uuidv4(), role: 'user', content: userMessage });

    const provider = localStorage.getItem('model-provider') || 'gemini';
    const selectedModel = localStorage.getItem('selected-model') || (provider === 'groq' ? 'llama-3.3-70b-versatile' : 'gemini-1.5-flash-latest');
    
    let apiKey = '';
    let modelResponse = '';

    if (provider === 'groq') {
      apiKey = localStorage.getItem('groq-api-key') || '';
      if (!apiKey) {
        updateChatNodeMessages(nodeId, { id: uuidv4(), role: 'model', content: "Please provide your Groq API key in the settings (top-right gear icon)." });
        setIsSendingMessageNodeId(null);
        return;
      }
      
      try {
        modelResponse = await generateContentWithGroq(userMessage, context, chatNode.messages, apiKey, selectedModel);
      } catch (error) {
        console.error("Failed to get response from Groq:", error);
        modelResponse = "Sorry, something went wrong with the Groq API.";
      }
    } else {
      apiKey = localStorage.getItem('gemini-api-key') || '';
      if (!apiKey) {
        updateChatNodeMessages(nodeId, { id: uuidv4(), role: 'model', content: "Please provide your Gemini API key in the settings (top-right gear icon)." });
        setIsSendingMessageNodeId(null);
        return;
      }
      
      try {
        modelResponse = await generateContent(userMessage, context, chatNode.messages, apiKey);
      } catch (error) {
        console.error("Failed to get response from Gemini:", error);
        modelResponse = "Sorry, something went wrong with the Gemini API.";
      }
    }

    updateChatNodeMessages(nodeId, { id: uuidv4(), role: 'model', content: modelResponse });
    setIsSendingMessageNodeId(null);
  }, [chatNodes, updateChatNodeMessages]);

  const moveChatNode = useCallback(
    (nodeId: string, clientX: number, clientY: number, transform: { x: number; y: number; scale: number }) => {
      if (!draggingNodeId || draggingNodeId !== nodeId) return;

      const newX = (clientX - transform.x - dragOffset.x) / transform.scale;
      const newY = (clientY - transform.y - dragOffset.y) / transform.scale;
      
      setChatNodes((prevNodes) =>
        prevNodes.map((node) =>
          node.id === nodeId
            ? { ...node, x: newX, y: newY }
            : node
        )
      );
    },
    [draggingNodeId, dragOffset]
  );

  const updateChatNodeHeight = useCallback((nodeId: string, height: number) => {
    setChatNodes(prev => prev.map(node => 
        node.id === nodeId ? { ...node, height } : node
    ));
  }, []);

  const handleNodePointerDown = useCallback((e: React.PointerEvent, nodeId: string) => {
    e.stopPropagation();
    
    onNodeClick(nodeId);

    const node = document.querySelector(`[data-node-id="${nodeId}"]`) as HTMLElement;
    if (node) {
      const rect = node.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      setDragOffset({
        x: e.clientX - centerX,
        y: e.clientY - centerY
      });
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
    
    setDraggingNodeId(nodeId);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handleNodePointerUp = useCallback((e: React.PointerEvent) => {
    if (draggingNodeId) {
      setDraggingNodeId(null);
      setDragOffset({ x: 0, y: 0 });
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch (error) {
        console.warn("Could not release pointer capture:", error);
      }
    }
  }, [draggingNodeId]);
  
  const forceResetDragState = useCallback(() => {
    setDraggingNodeId(null);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  return {
    chatNodes,
    draggingNodeId,
    isSendingMessageNodeId,
    addChatNode,
    moveChatNode,
    sendMessage,
    updateChatNodeHeight,
    handleNodePointerDown,
    handleNodePointerUp,
    forceResetDragState,
  };
};
