
import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { ImageNode, ImageData } from "@/types/canvas";
import { convertImageToBase64, analyzeImageWithGroq } from "@/services/groqVisionService";

export const useImageNodes = () => {
  const [imageNodes, setImageNodes] = useState<ImageNode[]>([]);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const addImageNode = useCallback(async (x: number, y: number, files: File[], nodeId?: string): Promise<ImageNode> => {
    const id = nodeId || uuidv4();
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
      id,
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
    console.log('🔍 analyzeImage called with:', { nodeId, imageId, hasApiKey: !!apiKey, hasPrompt: !!prompt });
    
    const node = imageNodes.find(n => n.id === nodeId);
    const image = node?.images.find(img => img.id === imageId);
    
    if (!node || !image) {
      console.error('❌ Node or image not found:', { nodeId, imageId, nodeExists: !!node, imageExists: !!image });
      throw new Error('Node or image not found');
    }

    if (!apiKey || apiKey.trim() === '') {
      console.error('❌ API key is missing or empty');
      throw new Error('Groq API key is required');
    }

    try {
      console.log('🧠 Calling Groq Vision API...');
      const analysis = await analyzeImageWithGroq(image, apiKey, prompt);
      console.log('✅ Analysis received:', analysis.substring(0, 100) + '...');
      
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
      
      console.log('✅ Analysis saved to node state');
    } catch (error) {
      console.error('❌ Error analyzing image:', error);
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
    
    const node = document.querySelector(`[data-node-id="${nodeId}"]`) as HTMLElement;
    if (node) {
      const rect = node.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate offset from cursor to node center
      setDragOffset({
        x: e.clientX - centerX,
        y: e.clientY - centerY
      });
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
    
    setDraggingNodeId(nodeId);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const moveImageNode = useCallback((nodeId: string, clientX: number, clientY: number, transform: any) => {
    if (!draggingNodeId || draggingNodeId !== nodeId) return;
    
    // Calculate the new position accounting for canvas transform and drag offset
    const newX = (clientX - transform.x - dragOffset.x) / transform.scale;
    const newY = (clientY - transform.y - dragOffset.y) / transform.scale;

    console.log("🔄 Moving image node:", nodeId, "to:", newX, newY);

    setImageNodes(prev => prev.map(node =>
      node.id === nodeId ? { ...node, x: newX, y: newY } : node
    ));
  }, [draggingNodeId, dragOffset]);

  const handleNodePointerUp = useCallback((e: React.PointerEvent) => {
    console.log("🖱️ Image node pointer up");
    setDraggingNodeId(null);
    setDragOffset({ x: 0, y: 0 });
    
    // Ensure pointer capture is released
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (error) {
      console.warn("Could not release pointer capture:", error);
    }
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
