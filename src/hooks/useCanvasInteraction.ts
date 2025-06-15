
import { useCallback } from 'react';
import type { useConnections } from '@/hooks/useConnections';
import type { useVideoNodes } from '@/hooks/useVideoNodes';
import type { useDocumentNodes } from '@/hooks/useDocumentNodes';
import type { useChatNodes } from '@/hooks/useChatNodes';
import type { useTextNodes } from '@/hooks/useTextNodes';
import type { useWebsiteNodes } from '@/hooks/useWebsiteNodes';
import type { useAudioNodes } from '@/hooks/useAudioNodes';
import type { useCanvasTransform } from '@/hooks/useCanvasTransform';

interface UseCanvasInteractionProps {
  connectionsResult: ReturnType<typeof useConnections>;
  videoNodesResult: ReturnType<typeof useVideoNodes>;
  documentNodesResult: ReturnType<typeof useDocumentNodes>;
  chatNodesResult: ReturnType<typeof useChatNodes>;
  textNodesResult: ReturnType<typeof useTextNodes>;
  websiteNodesResult: ReturnType<typeof useWebsiteNodes>;
  audioNodesResult: ReturnType<typeof useAudioNodes>;
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
  transformResult,
}: UseCanvasInteractionProps) => {
  const { connectingInfo, setLiveEndPoint, clearConnectionState } = connectionsResult;
  const { draggingNodeId: draggingVideoNodeId, moveVideoNode, handleNodePointerUp: handleVideoNodePointerUp } = videoNodesResult;
  const { draggingNodeId: draggingDocumentNodeId, moveDocumentNode, handleNodePointerUp: handleDocumentNodePointerUp } = documentNodesResult;
  const { draggingNodeId: draggingChatNodeId, moveChatNode, handleNodePointerUp: handleChatNodePointerUp } = chatNodesResult;
  const { draggingNodeId: draggingTextNodeId, moveTextNode, handleNodePointerUp: handleTextNodePointerUp } = textNodesResult;
  const { draggingNodeId: draggingWebsiteNodeId, moveWebsiteNode, handleNodePointerUp: handleWebsiteNodePointerUp } = websiteNodesResult;
  const { draggingNodeId: draggingAudioNodeId, moveAudioNode, handleNodePointerUp: handleAudioNodePointerUp } = audioNodesResult;
  const { transform, canvasContainerRef, handlePointerMove, handlePointerUp } = transformResult;

  const draggingNodeId = draggingVideoNodeId || draggingDocumentNodeId || draggingChatNodeId || draggingTextNodeId || draggingWebsiteNodeId || draggingAudioNodeId;

  const handleCanvasPointerMove = useCallback((e: React.PointerEvent) => {
    if (connectingInfo) {
      const rect = canvasContainerRef.current?.getBoundingClientRect();
      if (rect) {
        setLiveEndPoint({
          x: (e.clientX - rect.left - transform.x) / transform.scale,
          y: (e.clientY - rect.top - transform.y) / transform.scale,
        });
      }
    } else if (draggingVideoNodeId) {
      moveVideoNode(draggingVideoNodeId, e.clientX, e.clientY, transform);
    } else if (draggingDocumentNodeId) {
      moveDocumentNode(draggingDocumentNodeId, e.clientX, e.clientY, transform);
    } else if (draggingChatNodeId) {
      moveChatNode(draggingChatNodeId, e.clientX, e.clientY, transform);
    } else if (draggingTextNodeId) {
      moveTextNode(draggingTextNodeId, e.clientX, e.clientY, transform);
    } else if (draggingWebsiteNodeId) {
      moveWebsiteNode(draggingWebsiteNodeId, e.clientX, e.clientY, transform);
    } else if (draggingAudioNodeId) {
      moveAudioNode(draggingAudioNodeId, e.clientX, e.clientY, transform);
    } else {
      handlePointerMove(e, draggingNodeId, () => {});
    }
  }, [
      connectingInfo, canvasContainerRef, setLiveEndPoint, transform,
      draggingVideoNodeId, moveVideoNode,
      draggingDocumentNodeId, moveDocumentNode,
      draggingChatNodeId, moveChatNode,
      draggingTextNodeId, moveTextNode,
      draggingWebsiteNodeId, moveWebsiteNode,
      draggingAudioNodeId, moveAudioNode,
      handlePointerMove, draggingNodeId
  ]);

  const handleCanvasPointerUp = useCallback((e: React.PointerEvent) => {
    if (draggingVideoNodeId) {
      handleVideoNodePointerUp(e);
    } else if (draggingDocumentNodeId) {
      handleDocumentNodePointerUp(e);
    } else if (draggingChatNodeId) {
      handleChatNodePointerUp(e);
    } else if (draggingTextNodeId) {
      handleTextNodePointerUp(e);
    } else if (draggingWebsiteNodeId) {
      handleWebsiteNodePointerUp(e);
    } else if (draggingAudioNodeId) {
      handleAudioNodePointerUp(e);
    }
    handlePointerUp(e);

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
      handlePointerUp, connectingInfo, clearConnectionState
  ]);

  return { handleCanvasPointerMove, handleCanvasPointerUp, draggingNodeId };
};
