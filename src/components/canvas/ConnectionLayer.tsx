import React from 'react';
import { Connection, CanvasNode } from '@/types/canvas';
import { ConnectionLine } from './ConnectionLine';
import { getHandlePosition } from '@/utils/canvasUtils';

interface ConnectionLayerProps {
  connections: Connection[];
  allNodesMap: Map<string, CanvasNode>;
  connectingInfo: { startNodeId: string; startX: number; startY: number; } | null;
  liveEndPoint: { x: number; y: number; } | null;
  isDarkMode: boolean;
  onConnectionDoubleClick: (connection: Connection, e: React.MouseEvent) => void;
}

export const ConnectionLayer: React.FC<ConnectionLayerProps> = ({
  connections,
  allNodesMap,
  connectingInfo,
  liveEndPoint,
  isDarkMode,
  onConnectionDoubleClick,
}) => {
  return (
    <>
      {/* Connection Lines */}
      {connections.map(conn => {
        const sourceNode = allNodesMap.get(conn.sourceId);
        const targetNode = allNodesMap.get(conn.targetId);
        if (!sourceNode || !targetNode) return null;
        
        const sourcePos = getHandlePosition(sourceNode);
        const targetPos = getHandlePosition(targetNode);
        
        return (
          <ConnectionLine
            key={conn.id}
            sourceX={sourcePos.x}
            sourceY={sourcePos.y}
            targetX={targetPos.x}
            targetY={targetPos.y}
            isDarkMode={isDarkMode}
            onDoubleClick={(e) => onConnectionDoubleClick(conn, e)}
          />
        );
      })}

      {/* Live connection line */}
      {connectingInfo && liveEndPoint && (
        <ConnectionLine
          sourceX={connectingInfo.startX}
          sourceY={connectingInfo.startY}
          targetX={liveEndPoint.x}
          targetY={liveEndPoint.y}
          isDarkMode={isDarkMode}
        />
      )}
    </>
  );
};
