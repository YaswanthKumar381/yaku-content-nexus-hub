
import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { Connection } from "@/types/canvas";

export const useConnections = () => {
  const [connections, setConnections] = useState<Connection[]>([]);

  const addConnection = useCallback((sourceId: string, targetId: string) => {
    // Prevent connecting a node to itself
    if (sourceId === targetId) return;
    // Prevent duplicate connections
    if (connections.some(c => c.sourceId === sourceId && c.targetId === targetId)) return;

    const newConnection: Connection = {
      id: uuidv4(),
      sourceId,
      targetId,
    };
    setConnections((prev) => [...prev, newConnection]);
  }, [connections]);

  return { connections, addConnection };
};
