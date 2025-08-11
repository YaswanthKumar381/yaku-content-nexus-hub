
import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { Connection, CanvasNode } from "@/types/canvas";
import { getHandlePosition } from "@/utils/canvasUtils";

export const useConnections = () => {
  const [connections, setConnections] = useState<Connection[]>([]);

  const addConnection = useCallback((sourceId: string, targetId: string) => {
    // Prevent connecting a node to itself
    if (sourceId === targetId) return null;

    let connectionId: string | null = null;

    setConnections((prevConnections) => {
      // Prevent duplicate connections
      if (prevConnections.some(c => c.sourceId === sourceId && c.targetId === targetId)) {
        return prevConnections;
      }

      const newConnection: Connection = {
        id: uuidv4(),
        sourceId,
        targetId,
      };
      
      connectionId = newConnection.id;
      console.log('Connection added:', newConnection);
      return [...prevConnections, newConnection];
    });

    return connectionId;
  }, []);
  
  const removeConnection = useCallback((connectionId: string) => {
    setConnections(prev => prev.filter(c => c.id !== connectionId));
  }, []);

  const removeConnectionsForNode = useCallback((nodeId: string) => {
    setConnections(prev => prev.filter(c => c.sourceId !== nodeId && c.targetId !== nodeId));
  }, []);

  return { 
    connections, 
    addConnection,
    removeConnection,
    removeConnectionsForNode,
  };
};
