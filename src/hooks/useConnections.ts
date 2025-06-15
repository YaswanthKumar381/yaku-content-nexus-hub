
import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { Connection, CanvasNode } from "@/types/canvas";
import { getHandlePosition } from "@/utils/canvasUtils";

export const useConnections = (allNodesMap: Map<string, CanvasNode>) => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [connectingInfo, setConnectingInfo] = useState<{
    startNodeId: string;
    startX: number;
    startY: number;
  } | null>(null);
  const [liveEndPoint, setLiveEndPoint] = useState<{ x: number, y: number } | null>(null);

  const addConnection = useCallback((sourceId: string, targetId: string) => {
    // Prevent connecting a node to itself
    if (sourceId === targetId) return;

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
      return [...prevConnections, newConnection];
    });
  }, []);
  
  const removeConnection = useCallback((connectionId: string) => {
    setConnections(prev => prev.filter(c => c.id !== connectionId));
  }, []);

  const removeConnectionsForNode = useCallback((nodeId: string) => {
    setConnections(prev => prev.filter(c => c.sourceId !== nodeId && c.targetId !== nodeId));
  }, []);
  
  const startConnection = useCallback((nodeId: string) => {
    if (connectingInfo) return;
    const node = allNodesMap.get(nodeId);
    if (!node) return;
    const startPos = getHandlePosition(node);
    setConnectingInfo({ startNodeId: nodeId, startX: startPos.x, startY: startPos.y });
  }, [allNodesMap, connectingInfo]);

  const endConnection = useCallback((nodeId: string) => {
    if (!connectingInfo) return;
    const startNode = allNodesMap.get(connectingInfo.startNodeId);
    const endNode = allNodesMap.get(nodeId);
    if (startNode && endNode && (startNode.type === 'video' || startNode.type === 'document' || startNode.type === 'text') && endNode.type === 'chat') {
      addConnection(connectingInfo.startNodeId, nodeId);
    }
    setConnectingInfo(null);
    setLiveEndPoint(null);
  }, [addConnection, allNodesMap, connectingInfo]);
  
  const clearConnectionState = useCallback(() => {
    setConnectingInfo(null);
    setLiveEndPoint(null);
  }, []);

  return { connections, connectingInfo, liveEndPoint, setLiveEndPoint, startConnection, endConnection, clearConnectionState, removeConnectionsForNode, removeConnection };
};
