import { useState, useCallback } from 'react';
import type { ChatNode, TextNode, VideoNode, AudioNode, ImageNode, DocumentNode, WebsiteNode, GroupNode, Connection } from '@/types/canvas';

export interface CanvasState {
  chatNodes?: ChatNode[];
  textNodes?: TextNode[];
  videoNodes?: VideoNode[];
  audioNodes?: AudioNode[];
  imageNodes?: ImageNode[];
  documentNodes?: DocumentNode[];
  websiteNodes?: WebsiteNode[];
  groupNodes?: GroupNode[];
  connections?: Connection[];
}

export interface CanvasAction {
  type: 'ADD_NODE' | 'DELETE_NODE' | 'MOVE_NODE' | 'ADD_CONNECTION' | 'DELETE_CONNECTION' | 'UPDATE_NODE' | 'SAVE_STATE';
  nodeId?: string;
  connectionId?: string;
  data?: any;
  state?: CanvasState;
  timestamp: number;
}

export const useCanvasHistory = () => {
  const [history, setHistory] = useState<CanvasState[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const saveState = useCallback((state: CanvasState) => {
    setHistory(prev => {
      // Remove any states after current index (when adding new state after undo)
      const newHistory = prev.slice(0, currentIndex + 1);
      newHistory.push(state);
      
      // Keep only last 50 states to prevent memory issues
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
      return currentIndex > 0 ? history[currentIndex - 1] : null;
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
    saveState,
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory,
    history,
    currentIndex,
  };
};
