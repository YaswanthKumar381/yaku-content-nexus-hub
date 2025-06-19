import { useState, useCallback } from 'react';

export interface CanvasAction {
  type: 'ADD_NODE' | 'DELETE_NODE' | 'MOVE_NODE' | 'ADD_CONNECTION' | 'DELETE_CONNECTION' | 'UPDATE_NODE';
  nodeId?: string;
  connectionId?: string;
  data?: any;
  timestamp: number;
}

export const useCanvasHistory = () => {
  const [history, setHistory] = useState<CanvasAction[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const addAction = useCallback((action: Omit<CanvasAction, 'timestamp'>) => {
    const newAction: CanvasAction = {
      ...action,
      timestamp: Date.now(),
    };

    setHistory(prev => {
      // Remove any actions after current index (when adding new action after undo)
      const newHistory = prev.slice(0, currentIndex + 1);
      newHistory.push(newAction);
      
      // Keep only last 50 actions to prevent memory issues
      if (newHistory.length > 50) {
        newHistory.shift();
        setCurrentIndex(prev => Math.max(0, prev - 1));
        return newHistory;
      }
      
      setCurrentIndex(newHistory.length - 1);
      return newHistory;
    });
  }, [currentIndex]);

  const canUndo = currentIndex >= 0;
  const canRedo = currentIndex < history.length - 1;

  const undo = useCallback(() => {
    if (canUndo) {
      setCurrentIndex(prev => prev - 1);
      return history[currentIndex];
    }
    return null;
  }, [canUndo, history, currentIndex]);

  const redo = useCallback(() => {
    if (canRedo) {
      setCurrentIndex(prev => prev + 1);
      return history[currentIndex + 1];
    }
    return null;
  }, [canRedo, history, currentIndex]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    setCurrentIndex(-1);
  }, []);

  return {
    addAction,
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory,
    history,
    currentIndex,
  };
};
