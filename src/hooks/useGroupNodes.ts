
import { useState, useCallback } from "react";
import { GroupNode, CanvasNode, Transform } from "@/types/canvas";
import { v4 as uuidv4 } from 'uuid';

export const useGroupNodes = () => {
  const [groupNodes, setGroupNodes] = useState<GroupNode[]>([]);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const addGroupNode = useCallback((x: number, y: number): GroupNode => {
    const nodeId = uuidv4();
    
    const newNode: GroupNode = {
      id: nodeId,
      x,
      y,
      type: 'group',
      title: 'Untitled',
      width: 300,
      height: 200,
      containedNodes: [],
    };

    setGroupNodes(prev => [...prev, newNode]);
    console.log("✅ Group node created:", newNode);
    return newNode;
  }, []);

  const updateGroupNode = useCallback((nodeId: string, updates: Partial<Omit<GroupNode, 'id' | 'type'>>) => {
    setGroupNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, ...updates } : node
    ));
  }, []);

  const deleteGroupNode = useCallback((nodeId: string) => {
    setGroupNodes(prev => prev.filter(node => node.id !== nodeId));
  }, []);

  const updateContainedNodes = useCallback((groupId: string, allNodes: Map<string, CanvasNode>) => {
    setGroupNodes(prev => prev.map(groupNode => {
      if (groupNode.id !== groupId) return groupNode;

      const containedNodes: string[] = [];
      
      // Check which nodes are inside this group
      allNodes.forEach((node, nodeId) => {
        if (node.type === 'group' || node.type === 'chat') return; // Exclude group nodes and chat nodes
        
        const nodeX = node.x;
        const nodeY = node.y;
        const groupLeft = groupNode.x - groupNode.width / 2;
        const groupTop = groupNode.y - groupNode.height / 2;
        const groupRight = groupNode.x + groupNode.width / 2;
        const groupBottom = groupNode.y + groupNode.height / 2;
        
        if (nodeX >= groupLeft && nodeX <= groupRight && 
            nodeY >= groupTop && nodeY <= groupBottom) {
          containedNodes.push(nodeId);
        }
      });
      
      return { ...groupNode, containedNodes };
    }));
  }, []);

  const getGroupContext = useCallback((groupId: string, allNodes: Map<string, CanvasNode>): string => {
    const groupNode = groupNodes.find(g => g.id === groupId);
    if (!groupNode) return '';

    const contexts: string[] = [];
    
    groupNode.containedNodes.forEach(nodeId => {
      const node = allNodes.get(nodeId);
      if (!node) return;

      switch (node.type) {
        case 'video':
          contexts.push(`Video Title: ${node.title}\nTranscript: ${node.context || 'Not available'}`);
          break;
        case 'document':
          const docContent = node.documents.map(d => `Document: ${d.fileName}\nContent: ${d.content || 'Content not available'}`).join('\n\n');
          contexts.push(`Document Node Content:\n${docContent}`);
          break;
        case 'text':
          contexts.push(`Text Note:\n${node.content || 'Not available'}`);
          break;
        case 'website':
          const websiteContent = node.websites.map(w => `Website: ${w.title}\nURL: ${w.url}\nContent: ${w.content || 'Content not available'}`).join('\n\n');
          contexts.push(`Website Node Content:\n${websiteContent}`);
          break;
        case 'audio':
          const audioContent = node.recordings.map(r => `Audio Recording:\nTranscript: ${r.transcript || 'Transcript not available'}`).join('\n\n');
          contexts.push(`Audio Node Content:\n${audioContent}`);
          break;
        case 'image':
          const imageContent = node.images.map(img => `Image: ${img.fileName}\nAnalysis: ${img.analysis || 'Image analysis not available'}`).join('\n\n');
          contexts.push(`Image Node Content:\n${imageContent}`);
          break;
      }
    });

    return contexts.join('\n\n---\n\n');
  }, [groupNodes]);

  const handleNodePointerDown = useCallback((e: React.PointerEvent, nodeId: string) => {
    console.log("📦 Group node pointer down:", nodeId);
    e.stopPropagation();
    const node = groupNodes.find(n => n.id === nodeId);
    if (!node) return;

    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setDraggingNodeId(nodeId);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [groupNodes]);

  const moveGroupNode = useCallback((nodeId: string, clientX: number, clientY: number, transform: Transform) => {
    const canvasRect = document.querySelector('.absolute.inset-0')?.getBoundingClientRect();
    if (!canvasRect) return;

    const x = (clientX - canvasRect.left - transform.x - dragOffset.x) / transform.scale;
    const y = (clientY - canvasRect.top - transform.y - dragOffset.y) / transform.scale;

    console.log("🔄 Moving group node:", nodeId, "to:", x, y);

    setGroupNodes(prev => prev.map(node =>
      node.id === nodeId ? { ...node, x, y } : node
    ));
  }, [dragOffset]);

  const handleNodePointerUp = useCallback((e: React.PointerEvent) => {
    console.log("📦 Group node pointer up");
    setDraggingNodeId(null);
    setDragOffset({ x: 0, y: 0 });
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  }, []);

  const forceResetDragState = useCallback(() => {
    console.log("🔄 Force resetting group node drag state");
    setDraggingNodeId(null);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  return {
    groupNodes,
    draggingNodeId,
    addGroupNode,
    updateGroupNode,
    deleteGroupNode,
    updateContainedNodes,
    getGroupContext,
    handleNodePointerDown,
    moveGroupNode,
    handleNodePointerUp,
    forceResetDragState,
  };
};
