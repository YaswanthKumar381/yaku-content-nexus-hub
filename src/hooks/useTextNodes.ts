
import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { TextNode } from "@/types/canvas";

interface useTextNodesProps {
  onNodeClick: (nodeId: string) => void;
}

export const useTextNodes = ({ onNodeClick }: useTextNodesProps) => {
  const [textNodes, setTextNodes] = useState<TextNode[]>([]);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const addTextNode = useCallback((x: number, y: number) => {
    const newNode: TextNode = {
      id: uuidv4(),
      x,
      y,
      type: "text",
      title: "New Note",
      content: "Click to edit this note...",
      width: 250,
      height: 120,
    };
    setTextNodes((prevNodes) => [...prevNodes, newNode]);
    return newNode;
  }, []);
  
  const deleteTextNode = useCallback((nodeId: string) => {
    setTextNodes(prev => prev.filter(n => n.id !== nodeId));
  }, []);

  const updateTextNode = useCallback((nodeId: string, data: Partial<Omit<TextNode, 'id' | 'type'>>) => {
    setTextNodes(prev => prev.map(node => 
        node.id === nodeId ? { ...node, ...data } : node
    ));
  }, []);

  const moveTextNode = useCallback(
    (nodeId: string, clientX: number, clientY: number, transform: { x: number; y: number; scale: number }) => {
      if (!draggingNodeId || draggingNodeId !== nodeId) return;

      const newX = (clientX - transform.x - dragOffset.x) / transform.scale;
      const newY = (clientY - transform.y - dragOffset.y) / transform.scale;
      
      setTextNodes((prevNodes) =>
        prevNodes.map((node) =>
          node.id === nodeId
            ? { ...node, x: newX, y: newY }
            : node
        )
      );
    },
    [draggingNodeId, dragOffset]
  );

  const handleNodePointerDown = useCallback((e: React.PointerEvent, nodeId: string) => {
    e.stopPropagation();
    
    onNodeClick(nodeId);

    const nodeEl = (e.target as HTMLElement).closest(`[data-node-id="${nodeId}"]`) as HTMLElement;
    if (nodeEl) {
        const rect = nodeEl.getBoundingClientRect();
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
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
    textNodes,
    draggingNodeId,
    addTextNode,
    deleteTextNode,
    updateTextNode,
    moveTextNode,
    handleNodePointerDown,
    handleNodePointerUp,
    forceResetDragState,
  };
};
