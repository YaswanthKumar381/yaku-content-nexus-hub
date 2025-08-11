
import { useState, useCallback } from 'react';
import { AudioNode, AudioRecording } from '@/types/canvas';
import { transcribeAudio } from '@/services/groqService';
import { v4 as uuidv4 } from 'uuid';

interface useAudioNodesProps {
  onNodeClick: (nodeId: string) => void;
}

export const useAudioNodes = ({ onNodeClick }: useAudioNodesProps) => {
  const [audioNodes, setAudioNodes] = useState<AudioNode[]>([]);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const addAudioNode = useCallback((x: number, y: number): AudioNode => {
    const newNode: AudioNode = {
      id: uuidv4(),
      x,
      y,
      type: 'audio',
      recordings: [],
    };

    setAudioNodes(prev => [...prev, newNode]);
    return newNode;
  }, []);

  const deleteAudioNode = useCallback((nodeId: string) => {
    setAudioNodes(prev => prev.filter(node => node.id !== nodeId));
  }, []);

  const addRecordingToNode = useCallback(async (nodeId: string, audioBlob: Blob, duration: number) => {
    const groqApiKey = localStorage.getItem('groq-api-key');
    
    let transcript: string | undefined;
    if (groqApiKey) {
      try {
        transcript = await transcribeAudio(audioBlob, groqApiKey);
      } catch (error) {
        console.error('Failed to transcribe audio:', error);
      }
    }

    const recording: AudioRecording = {
      id: uuidv4(),
      blob: audioBlob,
      duration,
      transcript,
      recordedAt: new Date().toISOString(),
    };

    setAudioNodes(prev => prev.map(node => 
      node.id === nodeId 
        ? { ...node, recordings: [...node.recordings, recording] }
        : node
    ));
  }, []);

  const deleteRecording = useCallback((nodeId: string, recordingId: string) => {
    setAudioNodes(prev => prev.map(node => 
      node.id === nodeId 
        ? { ...node, recordings: node.recordings.filter(r => r.id !== recordingId) }
        : node
    ));
  }, []);

  const moveAudioNode = useCallback((nodeId: string, clientX: number, clientY: number, transform: { x: number; y: number; scale: number }) => {
    const containerRect = { left: 0, top: 0 }; // Simplified for canvas
    const x = (clientX - containerRect.left - transform.x - dragOffset.x) / transform.scale;
    const y = (clientY - containerRect.top - transform.y - dragOffset.y) / transform.scale;

    setAudioNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, x, y } : node
    ));
  }, [dragOffset]);

  const handleNodePointerDown = useCallback((e: React.PointerEvent, nodeId: string) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('[data-no-drag]')) {
      return;
    }

    e.stopPropagation();
    onNodeClick(nodeId);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setDraggingNodeId(nodeId);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [onNodeClick]);

  const handleNodePointerUp = useCallback((e: React.PointerEvent) => {
    setDraggingNodeId(null);
    setDragOffset({ x: 0, y: 0 });
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  }, []);

  const forceResetDragState = useCallback(() => {
    setDraggingNodeId(null);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  return {
    audioNodes,
    draggingNodeId,
    addAudioNode,
    deleteAudioNode,
    addRecordingToNode,
    deleteRecording,
    moveAudioNode,
    handleNodePointerDown,
    handleNodePointerUp,
    forceResetDragState,
  };
};
