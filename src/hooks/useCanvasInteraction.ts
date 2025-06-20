
import { useCallback } from "react";
import { CanvasTransform } from "@/types/canvas";

interface UseCanvasInteractionProps {
  canvasRef: React.RefObject<HTMLDivElement>;
  transform: CanvasTransform;
  setTransform: (transform: CanvasTransform) => void;
  selectedNodeIds: string[];
  setSelectedNodeIds: (ids: string[]) => void;
  onNodeMove: (nodeId: string, clientX: number, clientY: number, transform: CanvasTransform) => void;
}

export const useCanvasInteraction = ({
  canvasRef,
  transform,
  setTransform,
  selectedNodeIds,
  setSelectedNodeIds,
  onNodeMove,
}: UseCanvasInteractionProps) => {
  const handlePointerUp = useCallback((event: PointerEvent, nodeId?: string, isDragging?: boolean) => {
    // Handle pointer up logic here
    console.log('Pointer up:', { event, nodeId, isDragging });
  }, []);

  const handleCanvasClick = useCallback((event: React.MouseEvent) => {
    // Handle canvas click logic
    console.log('Canvas clicked:', event);
  }, []);

  const handleNodeSelect = useCallback((nodeId: string) => {
    setSelectedNodeIds([nodeId]);
  }, [setSelectedNodeIds]);

  return {
    handlePointerUp,
    handleCanvasClick,
    handleNodeSelect,
  };
};
