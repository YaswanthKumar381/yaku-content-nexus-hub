
import { useState, useCallback } from "react";
import { VideoNode } from "@/types/canvas";
import { getVideoTitle } from "@/utils/videoUtils";

export const useVideoNodes = () => {
  const [videoNodes, setVideoNodes] = useState<Array<VideoNode>>([]);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);

  const addVideoNode = useCallback(async (x: number, y: number, url: string) => {
    const newNode: VideoNode = {
      id: `video-${Date.now()}`,
      x,
      y,
      url,
      title: "Loading...",
      context: undefined
    };

    setVideoNodes(prev => [...prev, newNode]);
    
    // Fetch the actual title asynchronously
    try {
      const title = await getVideoTitle(url);
      setVideoNodes(prev => prev.map(node => 
        node.id === newNode.id ? { ...node, title } : node
      ));
    } catch (error) {
      console.error("Failed to update video title:", error);
      setVideoNodes(prev => prev.map(node => 
        node.id === newNode.id ? { ...node, title: "YouTube Video" } : node
      ));
    }
    
    return newNode;
  }, []);

  const updateVideoNode = useCallback((nodeId: string, updates: Partial<VideoNode>) => {
    setVideoNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, ...updates } : node
    ));
  }, []);

  const moveVideoNode = useCallback((nodeId: string, deltaX: number, deltaY: number, scale: number) => {
    setVideoNodes(prev => prev.map(node => 
      node.id === nodeId 
        ? { 
            ...node, 
            x: node.x + deltaX / scale, 
            y: node.y + deltaY / scale 
          }
        : node
    ));
  }, []);

  const handleNodePointerDown = useCallback((e: React.PointerEvent, nodeId: string) => {
    console.log("🎯 Node pointer down:", nodeId);
    e.stopPropagation();
    setDraggingNodeId(nodeId);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handleNodePointerUp = useCallback((e: React.PointerEvent) => {
    console.log("🎯 Node pointer up, releasing drag state");
    setDraggingNodeId(null);
    
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
  }, []);

  return {
    videoNodes,
    draggingNodeId,
    addVideoNode,
    updateVideoNode,
    moveVideoNode,
    handleNodePointerDown,
    handleNodePointerUp,
    forceResetDragState
  };
};
