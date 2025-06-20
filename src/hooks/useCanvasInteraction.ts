
import { useCallback } from "react";

interface Transform {
  x: number;
  y: number;
  scale: number;
}

interface UseCanvasInteractionProps {
  canvasRef: React.RefObject<HTMLDivElement>;
  transform: Transform;
  setTransform: (transform: Transform) => void;
  selectedNodeIds: string[];
  setSelectedNodeIds: (ids: string[]) => void;
  onNodeMove: (nodeId: string, clientX: number, clientY: number, transform: Transform) => void;
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
    console.log('Pointer up:', { event, nodeId, isDragging });
  }, []);

  const handleCanvasClick = useCallback((event: React.MouseEvent) => {
    console.log('Canvas clicked:', event);
  }, []);

  const handleNodeSelect = useCallback((nodeId: string) => {
    setSelectedNodeIds([nodeId]);
  }, [setSelectedNodeIds]);

  const handleCanvasPointerMove = useCallback((event: React.PointerEvent) => {
    console.log('Canvas pointer move:', event);
  }, []);

  const handleCanvasPointerUp = useCallback((event: React.PointerEvent) => {
    console.log('Canvas pointer up:', event);
  }, []);

  return {
    handlePointerUp,
    handleCanvasClick,
    handleNodeSelect,
    handleCanvasPointerMove,
    handleCanvasPointerUp,
    draggingNodeId: null,
  };
};
