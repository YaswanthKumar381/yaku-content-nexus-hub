import { useState, useCallback } from 'react';

export const useNodeGlow = () => {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const handleNodeHover = useCallback((nodeId: string | null) => {
    setHoveredNodeId(nodeId);
  }, []);

  const handleNodeClick = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId);
  }, []);

  const handleCanvasClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  const isNodeGlowing = useCallback((nodeId: string) => {
    return hoveredNodeId === nodeId || selectedNodeId === nodeId;
  }, [hoveredNodeId, selectedNodeId]);

  const shouldShowGlow = useCallback((nodeId: string, nodeType: string) => {
    // Chat nodes glow when hovered over while another node is selected
    if (nodeType === 'chat') {
      return hoveredNodeId === nodeId && selectedNodeId && selectedNodeId !== nodeId;
    }
    // Other nodes glow when hovered or selected
    return isNodeGlowing(nodeId);
  }, [hoveredNodeId, selectedNodeId, isNodeGlowing]);

  return {
    hoveredNodeId,
    selectedNodeId,
    handleNodeHover,
    handleNodeClick,
    handleCanvasClick,
    clearSelection,
    isNodeGlowing,
    shouldShowGlow,
  };
};
