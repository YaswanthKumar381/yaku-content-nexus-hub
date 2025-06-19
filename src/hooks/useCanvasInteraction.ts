
import { useCallback } from 'react';
import type { useConnections } from '@/hooks/useConnections';
import type { useVideoNodes } from '@/hooks/useVideoNodes';
import type { useDocumentNodes } from '@/hooks/useDocumentNodes';
import type { useChatNodes } from '@/hooks/useChatNodes';
import type { useTextNodes } from '@/hooks/useTextNodes';
import type { useWebsiteNodes } from '@/hooks/useWebsiteNodes';
import type { useAudioNodes } from '@/hooks/useAudioNodes';
import type { useCanvasTransform } from '@/hooks/useCanvasTransform';
import type { useImageNodes } from '@/hooks/useImageNodes';
import type { useGroupNodes } from '@/hooks/useGroupNodes';

interface UseCanvasInteractionProps {
  connectionsResult: ReturnType<typeof useConnections>;
  videoNodesResult: ReturnType<typeof useVideoNodes>;
  documentNodesResult: ReturnType<typeof useDocumentNodes>;
  chatNodesResult: ReturnType<typeof useChatNodes>;
  textNodesResult: ReturnType<typeof useTextNodes>;
  websiteNodesResult: ReturnType<typeof useWebsiteNodes>;
  audioNodesResult: ReturnType<typeof useAudioNodes>;
  imageNodesResult: ReturnType<typeof useImageNodes>;
  groupNodesResult: ReturnType<typeof useGroupNodes>;
  transformResult: ReturnType<typeof useCanvasTransform>;
}

export const useCanvasInteraction = ({
  connectionsResult,
  videoNodesResult,
  documentNodesResult,
  chatNodesResult,
  textNodesResult,
  websiteNodesResult,
  audioNodesResult,
  imageNodesResult,
  groupNodesResult,
  transformResult,
}: UseCanvasInteractionProps) => {
  const { connectingInfo, setLiveEndPoint, clearConnectionState } = connectionsResult;
  const { draggingNodeId: draggingVideoNodeId, moveVideoNode, handleNodePointerUp: handleVideoNodePointerUp } = videoNodesResult;
  const { draggingNodeId: draggingDocumentNodeId, moveDocumentNode, handleNodePointerUp: handleDocumentNodePointerUp } = documentNodesResult;
  const { draggingNodeId: draggingChatNodeId, moveChatNode, handleNodePointerUp: handleChatNodePointerUp } = chatNodesResult;
  const { draggingNodeId: draggingTextNodeId, moveTextNode, handleNodePointerUp: handleTextNodePointerUp } = textNodesResult;
  const { draggingNodeId: draggingWebsiteNodeId, moveWebsiteNode, handleNodePointerUp: handleWebsiteNodePointerUp } = websiteNodesResult;
  const { draggingNodeId: draggingAudioNodeId, moveAudioNode, handleNodePointerUp: handleAudioNodePointerUp } = audioNodesResult;
  const { draggingNodeId: draggingImageNodeId, moveImageNode, handleNodePointerUp: handleImageNodePointerUp } = imageNodesResult;
  const { draggingNodeId: draggingGroupNodeId, moveGroupNode, handleNodePointerUp: handleGroupNodePointerUp } = groupNodesResult;
  const { transform, canvasContainerRef, handlePointerMove, handlePointerUp } = transformResult;

  const draggingNodeId = draggingVideoNodeId || draggingDocumentNodeId || draggingChatNodeId || draggingTextNodeId || draggingWebsiteNodeId || draggingAudioNodeId || draggingImageNodeId || draggingGroupNodeId;

  const handleCanvasPointerMove = useCallback((e: React.PointerEvent) => {
    // Handle connection line preview
    if (connectingInfo) {
      const rect = canvasContainerRef.current?.getBoundingClientRect();
      if (rect) {
        setLiveEndPoint({
          x: (e.clientX - rect.left - transform.x) / transform.scale,
          y: (e.clientY - rect.top - transform.y) / transform.scale,
        });
      }
      return; // Don't handle node dragging while connecting
    }

    // Handle node dragging - only move the specific node that is being dragged
    if (draggingVideoNodeId) {
      console.log('🎯 Moving video node:', draggingVideoNodeId);
      moveVideoNode(draggingVideoNodeId, e.clientX, e.clientY, transform);
      return; // Exit early to prevent canvas panning
    } else if (draggingDocumentNodeId) {
      console.log('🎯 Moving document node:', draggingDocumentNodeId);
      moveDocumentNode(draggingDocumentNodeId, e.clientX, e.clientY, transform);
      return;
    } else if (draggingChatNodeId) {
      console.log('🎯 Moving chat node:', draggingChatNodeId);
      moveChatNode(draggingChatNodeId, e.clientX, e.clientY, transform);
      return;
    } else if (draggingTextNodeId) {
      console.log('🎯 Moving text node:', draggingTextNodeId);
      moveTextNode(draggingTextNodeId, e.clientX, e.clientY, transform);
      return;
    } else if (draggingWebsiteNodeId) {
      console.log('🎯 Moving website node:', draggingWebsiteNodeId);
      moveWebsiteNode(draggingWebsiteNodeId, e.clientX, e.clientY, transform);
      return;
    } else if (draggingAudioNodeId) {
      console.log('🎯 Moving audio node:', draggingAudioNodeId);
      moveAudioNode(draggingAudioNodeId, e.clientX, e.clientY, transform);
      return;
    } else if (draggingImageNodeId) {
      console.log('🎯 Moving image node:', draggingImageNodeId);
      moveImageNode(draggingImageNodeId, e.clientX, e.clientY, transform);
      return;
    } else if (draggingGroupNodeId) {
      console.log('🎯 Moving group node:', draggingGroupNodeId);
      moveGroupNode(draggingGroupNodeId, e.clientX, e.clientY, transform);
      return;
    }

    // Only handle canvas panning if no node is being dragged and no connection is active
    if (!draggingNodeId && !connectingInfo) {
      handlePointerMove(e);
    }
  }, [
      connectingInfo, canvasContainerRef, setLiveEndPoint, transform,
      draggingVideoNodeId, moveVideoNode,
      draggingDocumentNodeId, moveDocumentNode,
      draggingChatNodeId, moveChatNode,
      draggingTextNodeId, moveTextNode,
      draggingWebsiteNodeId, moveWebsiteNode,
      draggingAudioNodeId, moveAudioNode,
      draggingImageNodeId, moveImageNode,
      draggingGroupNodeId, moveGroupNode,
      handlePointerMove, draggingNodeId
  ]);

  const handleCanvasPointerUp = useCallback((e: React.PointerEvent) => {
    // Handle node pointer up events
    if (draggingVideoNodeId) {
      console.log('🎯 Ending video node drag');
      handleVideoNodePointerUp(e);
    } else if (draggingDocumentNodeId) {
      console.log('🎯 Ending document node drag');
      handleDocumentNodePointerUp(e);
    } else if (draggingChatNodeId) {
      console.log('🎯 Ending chat node drag');
      handleChatNodePointerUp(e);
    } else if (draggingTextNodeId) {
      console.log('🎯 Ending text node drag');
      handleTextNodePointerUp(e);
    } else if (draggingWebsiteNodeId) {
      console.log('🎯 Ending website node drag');
      handleWebsiteNodePointerUp(e);
    } else if (draggingAudioNodeId) {
      console.log('🎯 Ending audio node drag');
      handleAudioNodePointerUp(e);
    } else if (draggingImageNodeId) {
      console.log('🎯 Ending image node drag');
      handleImageNodePointerUp(e);
    } else if (draggingGroupNodeId) {
      console.log('🎯 Ending group node drag');
      handleGroupNodePointerUp(e);
    }
    
    // Handle canvas pointer up - this function should be called with just the event
    handlePointerUp(e);

    // Handle connection state
    if (connectingInfo) {
      const targetNodeElement = (e.target as HTMLElement).closest('[data-node-id]');
      // If we are connecting but don't land on a node, cancel the connection.
      // If we do land on a node, its own pointerup handler (onEndConnection) will manage the state.
      if (!targetNodeElement) {
        clearConnectionState();
      }
    }
  }, [
      draggingVideoNodeId, handleVideoNodePointerUp,
      draggingDocumentNodeId, handleDocumentNodePointerUp,
      draggingChatNodeId, handleChatNodePointerUp,
      draggingTextNodeId, handleTextNodePointerUp,
      draggingWebsiteNodeId, handleWebsiteNodePointerUp,
      draggingAudioNodeId, handleAudioNodePointerUp,
      draggingImageNodeId, handleImageNodePointerUp,
      draggingGroupNodeId, handleGroupNodePointerUp,
      handlePointerUp, connectingInfo, clearConnectionState
  ]);

  return { handleCanvasPointerMove, handleCanvasPointerUp, draggingNodeId };
};
