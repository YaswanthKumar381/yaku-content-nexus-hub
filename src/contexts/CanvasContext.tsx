
import React, { createContext, useContext, ReactNode } from 'react';

interface CanvasContextType {
  nodes: any[];
  connections: any[];
  selectedNodeIds: string[];
  isDragging: boolean;
  isConnecting: boolean;
  connectingInfo: any;
  liveEndPoint: any;
  transform: { x: number; y: number; scale: number };
  canvasState: any;
  setTransform: (transform: any) => void;
  setSelectedNodeIds: (ids: string[]) => void;
}

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export const CanvasProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const contextValue: CanvasContextType = {
    nodes: [],
    connections: [],
    selectedNodeIds: [],
    isDragging: false,
    isConnecting: false,
    connectingInfo: null,
    liveEndPoint: null,
    transform: { x: 0, y: 0, scale: 1 },
    canvasState: {},
    setTransform: () => {},
    setSelectedNodeIds: () => {},
  };

  return (
    <CanvasContext.Provider value={contextValue}>
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => {
  const context = useContext(CanvasContext);
  if (context === undefined) {
    throw new Error('useCanvas must be used within a CanvasProvider');
  }
  return context;
};
