
import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { ImageNode, ImageData } from "@/types/canvas";
import { convertImageToBase64, analyzeImageWithGroq } from "@/services/groqVisionService";

export const useImageNodes = () => {
  const [imageNodes, setImageNodes] = useState<ImageNode[]>([]);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const addImageNode = useCallback(async (x: number, y: number, files: File[]): Promise<ImageNode> => {
    const nodeId = uuidv4();
    console.log("🖼️ Creating image node with files:", files.length);

    const imageDataPromises = files.map(async (file): Promise<ImageData> => {
      const base64 = await convertImageToBase64(file);
      return {
        id: uuidv4(),
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        base64,
        uploadedAt: new Date().toISOString(),
      };
    });

    const images = await Promise.all(imageDataPromises);

    const newNode: ImageNode = {
      id: nodeId,
      x,
      y,
      type: 'image',
      images,
    };

    setImageNodes(prev => [...prev, newNode]);
    console.log("✅ Image node created successfully");
    return newNode;
  }, []);

  const addImagesToNode = useCallback(async (nodeId: string, files: File[]): Promise<void> => {
    console.log("🖼️ Adding images to existing node:", nodeId);

    const imageDataPromises = files.map(async (file): Promise<ImageData> => {
      const base64 = await convertImageToBase64(file);
      return {
        id: uuidv4(),
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        base64,
        uploadedAt: new Date().toISOString(),
      };
    });

    const newImages = await Promise.all(imageDataPromises);

    setImageNodes(prev => prev.map(node => 
      node.id === nodeId 
        ? { ...node, images: [...node.images, ...newImages] }
        : node
    ));
    console.log("✅ Images added to node successfully");
  }, []);

  const analyzeImage = useCallback(async (nodeId: string, imageId: string, apiKey: string, prompt?: string): Promise<void> => {
    const node = imageNodes.find(n => n.id === nodeId);
    const image = node?.images.find(img => img.id === imageId);
    
    if (!node || !image) {
      throw new Error('Node or image not found');
    }

    try {
      const analysis = await analyzeImageWithGroq(image, apiKey, prompt);
      
      setImageNodes(prev => prev.map(n => 
        n.id === nodeId 
          ? {
              ...n,
              images: n.images.map(img => 
                img.id === imageId 
                  ? { ...img, analysis }
                  : img
              )
            }
          : n
      ));
    } catch (error) {
      console.error('Error analyzing image:', error);
      throw error;
    }
  }, [imageNodes]);

  const deleteImageNode = useCallback((nodeId: string) => {
    console.log("🗑️ Deleting image node:", nodeId);
    setImageNodes(prev => prev.filter(node => node.id !== nodeId));
  }, []);

  const deleteImageFromNode = useCallback((nodeId: string, imageId: string) => {
    console.log("🗑️ Deleting image from node:", nodeId, imageId);
    setImageNodes(prev => prev.map(node => 
      node.id === nodeId 
        ? { ...node, images: node.images.filter(img => img.id !== imageId) }
        : node
    ));
  }, []);

  const handleNodePointerDown = useCallback((e: React.PointerEvent, nodeId: string) => {
    console.log("🖱️ Image node pointer down:", nodeId);
    e.stopPropagation();
    const node = imageNodes.find(n => n.id === nodeId);
    if (!node) return;

    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setDraggingNodeId(nodeId);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [imageNodes]);

  const moveImageNode = useCallback((nodeId: string, clientX: number, clientY: number, transform: any) => {
    const canvasRect = document.querySelector('.absolute.inset-0')?.getBoundingClientRect();
    if (!canvasRect) return;

    const x = (clientX - canvasRect.left - transform.x - dragOffset.x) / transform.scale;
    const y = (clientY - canvasRect.top - transform.y - dragOffset.y) / transform.scale;

    console.log("🔄 Moving image node:", nodeId, "to:", x, y);

    setImageNodes(prev => prev.map(node =>
      node.id === nodeId ? { ...node, x, y } : node
    ));
  }, [dragOffset]);

  const handleNodePointerUp = useCallback((e: React.PointerEvent) => {
    console.log("🖱️ Image node pointer up");
    setDraggingNodeId(null);
    setDragOffset({ x: 0, y: 0 });
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  }, []);

  const forceResetDragState = useCallback(() => {
    console.log("🔄 Force resetting image node drag state");
    setDraggingNodeId(null);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  return {
    imageNodes,
    draggingNodeId,
    addImageNode,
    addImagesToNode,
    analyzeImage,
    deleteImageNode,
    deleteImageFromNode,
    handleNodePointerDown,
    moveImageNode,
    handleNodePointerUp,
    forceResetDragState,
  };
};
