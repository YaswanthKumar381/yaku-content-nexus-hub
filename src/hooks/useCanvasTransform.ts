
import { useState, useCallback, useRef, useEffect } from "react";
import { Transform } from "@/types/canvas";

interface useCanvasTransformProps {
  onCanvasClick: () => void;
}

export const useCanvasTransform = ({ onCanvasClick }: useCanvasTransformProps) => {
  const [transform, setTransform] = useState<Transform>({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastPointer, setLastPointer] = useState({ x: 0, y: 0 });
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    
    if (e.ctrlKey || e.metaKey) {
      // Zoom
      const rect = canvasContainerRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const zoomIntensity = 0.1;
      const zoom = e.deltaY < 0 ? 1 + zoomIntensity : 1 - zoomIntensity;
      const newScale = Math.max(0.1, Math.min(5, transform.scale * zoom));
      
      const scaleChange = newScale / transform.scale;
      const newX = mouseX - (mouseX - transform.x) * scaleChange;
      const newY = mouseY - (mouseY - transform.y) * scaleChange;
      
      console.log('Zoom:', { deltaY: e.deltaY, zoom, newScale, currentScale: transform.scale });
      
      setTransform({
        x: newX,
        y: newY,
        scale: newScale
      });
    } else {
      // Pan
      setTransform(prev => ({
        ...prev,
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY
      }));
    }
  }, [transform]);

  const handlePointerDown = useCallback((e: React.PointerEvent, draggingNodeId: string | null) => {
    if (draggingNodeId) return;
    
    onCanvasClick();
    setIsDragging(true);
    setLastPointer({ x: e.clientX, y: e.clientY });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [onCanvasClick]);

  const handlePointerMove = useCallback((e: React.PointerEvent, draggingNodeId: string | null, onNodeMove: (deltaX: number, deltaY: number) => void) => {
    if (draggingNodeId) {
      const deltaX = e.clientX - lastPointer.x;
      const deltaY = e.clientY - lastPointer.y;
      onNodeMove(deltaX, deltaY);
      setLastPointer({ x: e.clientX, y: e.clientY });
    } else if (isDragging) {
      const deltaX = e.clientX - lastPointer.x;
      const deltaY = e.clientY - lastPointer.y;
      
      setTransform(prev => ({
        ...prev,
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      setLastPointer({ x: e.clientX, y: e.clientY });
    }
  }, [isDragging, lastPointer, transform.scale]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + 
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      
      if (!canvasContainerRef.current?.dataset.initialDistance) {
        canvasContainerRef.current!.dataset.initialDistance = distance.toString();
        canvasContainerRef.current!.dataset.initialScale = transform.scale.toString();
        return;
      }
      
      const initialDistance = parseFloat(canvasContainerRef.current.dataset.initialDistance);
      const initialScale = parseFloat(canvasContainerRef.current.dataset.initialScale);
      const scaleFactor = distance / initialDistance;
      const newScale = Math.max(0.1, Math.min(5, initialScale * scaleFactor));
      
      setTransform(prev => ({
        ...prev,
        scale: newScale
      }));
    }
  }, [transform.scale]);

  const handleTouchEnd = useCallback(() => {
    if (canvasContainerRef.current) {
      delete canvasContainerRef.current.dataset.initialDistance;
      delete canvasContainerRef.current.dataset.initialScale;
    }
  }, []);

  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);

  return {
    transform,
    canvasContainerRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };
};
