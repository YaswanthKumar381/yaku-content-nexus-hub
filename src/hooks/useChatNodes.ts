
import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { ChatNode } from "@/types/canvas";

export const useChatNodes = () => {
  const [chatNodes, setChatNodes] = useState<ChatNode[]>([]);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);

  const addChatNode = useCallback((x: number, y: number) => {
    const newNode: ChatNode = {
      id: uuidv4(),
      x,
      y,
      type: "chat",
    };
    setChatNodes((prevNodes) => [...prevNodes, newNode]);
    return newNode;
  }, []);

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
    addChatNode,
    moveChatNode,
    handleNodePointerDown,
    handleNodePointerUp,
    forceResetDragState,
  };
};
