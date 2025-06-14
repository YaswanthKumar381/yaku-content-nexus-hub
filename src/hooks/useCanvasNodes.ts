
import { useState, useCallback } from 'react';
import { useNodesState, useEdgesState, addEdge } from '@xyflow/react';
import { generateId, extractVideoId, fetchTranscript } from '@/utils/youtube';
import { useToast } from "@/hooks/use-toast";
import type { CanvasNode, TextNodeData, VideoNodeData } from '@/types/canvas';

export const useCanvasNodes = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<CanvasNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { toast } = useToast();

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addTextNode = useCallback((label: string, context: string, position: { x: number; y: number }) => {
    const newNode: CanvasNode = {
      id: generateId(),
      type: 'text',
      position,
      data: { label, context },
    };
    setNodes((prevNodes) => [...prevNodes, newNode]);
    toast({
      title: "Text Node Created",
      description: "Your new text node has been successfully created.",
    });
  }, [setNodes, toast]);

  const addVideoNode = useCallback(async (url: string) => {
    try {
      console.log('🎬 Creating video node for:', url);
      
      const videoId = extractVideoId(url);
      if (!videoId) {
        console.error('❌ Invalid YouTube URL');
        return;
      }

      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      
      const newNode: CanvasNode = {
        id: generateId(),
        type: 'video',
        position: { x: 100, y: 100 },
        data: {
          label: `Video: ${videoId}`,
          url,
          thumbnail: thumbnailUrl,
          title: `Video: ${videoId}`,
          context: 'Loading transcript...'
        }
      };

      setNodes(prevNodes => [...prevNodes, newNode]);
      console.log('✅ Video node created:', newNode.id);

      try {
        const transcript = await fetchTranscript(url);
        
        setNodes(prevNodes => 
          prevNodes.map(node => 
            node.id === newNode.id 
              ? { ...node, data: { ...node.data, context: transcript } }
              : node
          )
        );
        console.log('✅ Transcript added to node context');
      } catch (transcriptError) {
        console.error('❌ Failed to fetch transcript, but node created:', transcriptError);
        setNodes(prevNodes => 
          prevNodes.map(node => 
            node.id === newNode.id 
              ? { ...node, data: { ...node.data, context: 'Transcript unavailable for this video' } }
              : node
          )
        );
      }
      
    } catch (error) {
      console.error('❌ Failed to create video node:', error);
    }
  }, [setNodes]);

  const deleteNode = useCallback((nodeId: string) => {
    setNodes((prevNodes) => prevNodes.filter((node) => node.id !== nodeId));
    setEdges((prevEdges) => prevEdges.filter(edge => edge.source !== nodeId && edge.target !== nodeId));
    toast({
      title: "Node Deleted",
      description: "The selected node has been successfully deleted.",
    });
  }, [setNodes, setEdges, toast]);

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addTextNode,
    addVideoNode,
    deleteNode
  };
};
