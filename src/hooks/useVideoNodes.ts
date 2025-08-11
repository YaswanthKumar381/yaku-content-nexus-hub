
import { useState, useCallback } from "react";
import { VideoNode } from "@/types/canvas";
import { getVideoTitle } from "@/utils/videoUtils";

interface useVideoNodesProps {
  onNodeClick: (nodeId: string) => void;
}

export const useVideoNodes = ({ onNodeClick }: useVideoNodesProps) => {
  const [videoNodes, setVideoNodes] = useState<Array<VideoNode>>([]);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const addVideoNode = useCallback(async (x: number, y: number, url: string, nodeId?: string) => {
    const id = nodeId || `video-${Date.now()}`;
    const newNode: VideoNode = {
      id,
      x,
      y,
      url,
      title: "Loading...",
      context: undefined,
      type: 'video',
    };

    setVideoNodes(prev => [...prev, newNode]);
    
    // Fetch the actual title asynchronously
    try {
      const title = await getVideoTitle(url);
      setVideoNodes(prev => prev.map(node => 
        node.id === id ? { ...node, title } : node
      ));
    } catch (error) {
      console.error("Failed to update video title:", error);
      setVideoNodes(prev => prev.map(node => 
        node.id === id ? { ...node, title: "YouTube Video" } : node
      ));
    }
    
    return newNode;
  }, []);

  const updateVideoNode = useCallback((nodeId: string, updates: Partial<VideoNode>) => {
    setVideoNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, ...updates } : node
    ));
  }, []);

  const deleteVideoNode = useCallback((nodeId: string) => {
    setVideoNodes(prev => prev.filter(node => node.id !== nodeId));
  }, []);

  const moveVideoNode = useCallback((nodeId: string, clientX: number, clientY: number, transform: { x: number; y: number; scale: number }) => {
    if (!draggingNodeId || draggingNodeId !== nodeId) return;
    
    // Calculate the new position accounting for canvas transform and drag offset
    const newX = (clientX - transform.x - dragOffset.x) / transform.scale;
    const newY = (clientY - transform.y - dragOffset.y) / transform.scale;
    
    setVideoNodes(prev => prev.map(node => 
      node.id === nodeId 
        ? { ...node, x: newX, y: newY }
        : node
    ));
  }, [draggingNodeId, dragOffset]);

  const handleNodePointerDown = useCallback((e: React.PointerEvent, nodeId: string) => {
    console.log("🎯 Node pointer down:", nodeId);
    e.stopPropagation();
    
    onNodeClick(nodeId);

    const node = document.querySelector(`[data-node-id="${nodeId}"]`) as HTMLElement;
    if (node) {
      const rect = node.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate offset from cursor to node center
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
    console.log("🎯 Node pointer up, releasing drag state");
    setDraggingNodeId(null);
    setDragOffset({ x: 0, y: 0 });
    
    // Ensure pointer capture is released
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (error) {
      console.warn("Could not release pointer capture:", error);
    }
  }, []);

  const forceResetDragState = useCallback(() => {
    console.log("🔄 Force resetting drag state");
    setDraggingNodeId(null);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  return {
    videoNodes,
    draggingNodeId,
    addVideoNode,
    updateVideoNode,
    deleteVideoNode,
    moveVideoNode,
    handleNodePointerDown,
    handleNodePointerUp,
    forceResetDragState
  };
};
