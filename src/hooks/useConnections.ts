
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
  
  const startConnection = useCallback((nodeId: string) => {
    if (connectingInfo) return;
    const node = allNodesMap.get(nodeId);
    if (!node) return;
    const startPos = getHandlePosition(node);
    setConnectingInfo({ startNodeId: nodeId, startX: startPos.x, startY: startPos.y });
    console.log('🔗 Starting connection from node:', nodeId, 'type:', node.type);
  }, [allNodesMap, connectingInfo]);

  const endConnection = useCallback((nodeId: string) => {
    if (!connectingInfo) return null;
    const startNode = allNodesMap.get(connectingInfo.startNodeId);
    const endNode = allNodesMap.get(nodeId);
    
    console.log('🔗 Attempting to end connection:', {
      startNode: startNode?.type,
      endNode: endNode?.type,
      startNodeId: connectingInfo.startNodeId,
      endNodeId: nodeId
    });
    
    let connectionId: string | null = null;
    
    if (startNode && endNode && 
        (startNode.type === 'video' || startNode.type === 'document' || startNode.type === 'text' || startNode.type === 'website' || startNode.type === 'audio' || startNode.type === 'image' || startNode.type === 'group') && 
        endNode.type === 'chat') {
      console.log('✅ Connection allowed, adding connection');
      connectionId = addConnection(connectingInfo.startNodeId, nodeId);
    } else {
      console.log('❌ Connection not allowed');
    }
    
    setConnectingInfo(null);
    setLiveEndPoint(null);
    return connectionId;
  }, [addConnection, allNodesMap, connectingInfo]);
  
  const clearConnectionState = useCallback(() => {
    console.log('🧹 Clearing connection state');
    setConnectingInfo(null);
    setLiveEndPoint(null);
  }, []);

  return { 
    connections, 
    connectingInfo, 
    liveEndPoint, 
    setLiveEndPoint, 
    startConnection, 
    endConnection, 
    clearConnectionState, 
    removeConnectionsForNode, 
    removeConnection,
    addConnection 
  };
};
