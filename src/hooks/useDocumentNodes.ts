import { useState, useCallback } from "react";
import { DocumentNode, DocumentFile } from "@/types/canvas";
import { extractTextFromFile } from "@/utils/documentUtils";

export const useDocumentNodes = () => {
  const [documentNodes, setDocumentNodes] = useState<Array<DocumentNode>>([]);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const updateDocumentFile = useCallback((nodeId: string, fileId: string, updates: Partial<DocumentFile>) => {
    setDocumentNodes(prev => prev.map(node => {
      if (node.id === nodeId) {
        return { 
          ...node, 
          documents: node.documents.map(doc => 
            doc.id === fileId ? { ...doc, ...updates } : doc
          ) 
        };
      }
      return node;
    }));
  }, []);

  const updateDocumentNode = useCallback((nodeId: string, updates: Partial<DocumentNode>) => {
    setDocumentNodes(prev => prev.map(node =>
      node.id === nodeId ? { ...node, ...updates } : node
    ));
  }, []);

  const deleteDocumentNode = useCallback((nodeId: string) => {
    setDocumentNodes(prev => prev.filter(node => node.id !== nodeId));
  }, []);

  const deleteDocumentFromFileNode = useCallback((nodeId: string, fileId: string) => {
    setDocumentNodes(prev => 
      prev
        .map(node => {
          if (node.id === nodeId) {
            const newDocuments = node.documents.filter(doc => doc.id !== fileId);
            return { ...node, documents: newDocuments };
          }
          return node;
        })
        .filter(node => node.documents.length > 0) // remove node if it becomes empty
    );
  }, []);

  const addDocumentNode = useCallback(async (x: number, y: number, files: File[]) => {
    const newNodeId = `doc-${Date.now()}`;
    const initialDocuments: DocumentFile[] = files.map((file, index) => ({
      id: `${newNodeId}-file-${Date.now()}-${index}`,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      uploadedAt: new Date().toISOString(),
    }));

    const newNode: DocumentNode = {
      id: newNodeId,
      x,
      y,
      documents: initialDocuments,
      type: 'document'
    };
    setDocumentNodes(prev => [...prev, newNode]);

    // Extract content for each file
    initialDocuments.forEach(async (docFile, index) => {
      const file = files[index];
      try {
        const text = await extractTextFromFile(file);
        updateDocumentFile(newNodeId, docFile.id, { content: text });
      } catch (error) {
        console.error("Error extracting document content:", error);
        updateDocumentFile(newNodeId, docFile.id, { content: "Failed to extract content." });
      }
    });
    
    return newNode;
  }, [updateDocumentFile]);
  
  const moveDocumentNode = useCallback((nodeId: string, clientX: number, clientY: number, transform: { x: number; y: number; scale: number }) => {
    if (!draggingNodeId || draggingNodeId !== nodeId) return;
    
    const newX = (clientX - transform.x - dragOffset.x) / transform.scale;
    const newY = (clientY - transform.y - dragOffset.y) / transform.scale;
    
    setDocumentNodes(prev => prev.map(node => 
      node.id === nodeId 
        ? { ...node, x: newX, y: newY }
        : node
    ));
  }, [draggingNodeId, dragOffset]);

  const handleNodePointerDown = useCallback((e: React.PointerEvent, nodeId: string) => {
    e.stopPropagation();
    
    const node = document.querySelector(`[data-node-id="${nodeId}"]`) as HTMLElement;
    if (node) {
      const rect = node.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
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

  const handleNodePointerUp = useCallback((e: React.PointerEvent) => {
    setDraggingNodeId(null);
    setDragOffset({ x: 0, y: 0 });
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (error) {
      console.warn("Could not release pointer capture:", error);
    }
  }, []);

  const forceResetDragState = useCallback(() => {
    setDraggingNodeId(null);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  return {
    documentNodes,
    draggingNodeId: draggingNodeId,
    addDocumentNode,
    updateDocumentNode,
    deleteDocumentNode,
    deleteDocumentFromFileNode,
    moveDocumentNode,
    handleNodePointerDown,
    handleNodePointerUp,
    forceResetDragState
  };
};
