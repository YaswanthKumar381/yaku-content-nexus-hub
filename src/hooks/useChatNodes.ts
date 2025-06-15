import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { ChatNode, ChatMessage } from "@/types/canvas";
import { generateContent } from "@/services/geminiService";

export const useChatNodes = () => {
  const [chatNodes, setChatNodes] = useState<ChatNode[]>([]);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [isSendingMessageNodeId, setIsSendingMessageNodeId] = useState<string | null>(null);

  const addChatNode = useCallback((x: number, y: number) => {
    const newNode: ChatNode = {
      id: uuidv4(),
      x,
      y,
      type: "chat",
      height: 400, // Default height
      messages: [
        { id: uuidv4(), role: 'system', content: 'You are Yaku, a helpful AI assistant. Use the provided context from connected nodes to answer user questions.' },
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

    const apiKey = localStorage.getItem('gemini_api_key');

    if (!apiKey) {
        updateChatNodeMessages(nodeId, { id: uuidv4(), role: 'model', content: "Please provide your Gemini API key to continue." });
        setIsSendingMessageNodeId(null);
        return;
    }

    try {
      const modelResponse = await generateContent(userMessage, context, chatNode.messages, apiKey);
      updateChatNodeMessages(nodeId, { id: uuidv4(), role: 'model', content: modelResponse });
    } catch (error) {
      console.error("Failed to get response from Gemini:", error);
      updateChatNodeMessages(nodeId, { id: uuidv4(), role: 'model', content: "Sorry, something went wrong." });
    } finally {
      setIsSendingMessageNodeId(null);
    }
  }, [chatNodes, updateChatNodeMessages]);

  const moveChatNode = useCallback(
    (nodeId: string, event: React.PointerEvent, transform: { scale: number }) => {
      setChatNodes((prevNodes) =>
        prevNodes.map((node) =>
          node.id === nodeId
            ? { ...node, x: node.x + event.movementX / transform.scale, y: node.y + event.movementY / transform.scale }
            : node
        )
      );
    },
    []
  );

  const updateChatNodeHeight = useCallback((nodeId: string, height: number) => {
    setChatNodes(prev => prev.map(node => 
        node.id === nodeId ? { ...node, height } : node
    ));
  }, []);

  const handleNodePointerDown = useCallback((e: React.PointerEvent, nodeId: string) => {
    e.stopPropagation();
    const target = e.target as HTMLElement;
    target.setPointerCapture(e.pointerId);
    setDraggingNodeId(nodeId);
  }, []);

  const handleNodePointerUp = useCallback((e: React.PointerEvent) => {
    if (draggingNodeId) {
      const target = e.target as HTMLElement;
      target.releasePointerCapture(e.pointerId);
      setDraggingNodeId(null);
    }
  }, [draggingNodeId]);
  
  const forceResetDragState = useCallback(() => {
    setDraggingNodeId(null);
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
