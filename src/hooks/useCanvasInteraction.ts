import { useCallback } from 'react';
import type { useConnections } from '@/hooks/useConnections';
import type { useVideoNodes } from '@/hooks/useVideoNodes';
import type { useDocumentNodes } from '@/hooks/useDocumentNodes';
import type { useChatNodes } from '@/hooks/useChatNodes';
import type { useTextNodes } from '@/hooks/useTextNodes';
import type { useCanvasTransform } from '@/hooks/useCanvasTransform';

interface UseCanvasInteractionProps {
  connectionsResult: ReturnType<typeof useConnections>;
  videoNodesResult: ReturnType<typeof useVideoNodes>;
  documentNodesResult: ReturnType<typeof useDocumentNodes>;
  chatNodesResult: ReturnType<typeof useChatNodes>;
  textNodesResult: ReturnType<typeof useTextNodes>;
  transformResult: ReturnType<typeof useCanvasTransform>;
}

export const useCanvasInteraction = ({
  connectionsResult,
  videoNodesResult,
  documentNodesResult,
  chatNodesResult,
  textNodesResult,
  transformResult,
}: UseCanvasInteractionProps) => {
  const { connectingInfo, setLiveEndPoint, clearConnectionState } = connectionsResult;
  const { draggingNodeId: draggingVideoNodeId, moveVideoNode, handleNodePointerUp: handleVideoNodePointerUp } = videoNodesResult;
  const { draggingNodeId: draggingDocumentNodeId, moveDocumentNode, handleNodePointerUp: handleDocumentNodePointerUp } = documentNodesResult;
  const { draggingNodeId: draggingChatNodeId, moveChatNode, handleNodePointerUp: handleChatNodePointerUp } = chatNodesResult;
  const { draggingNodeId: draggingTextNodeId, moveTextNode, handleNodePointerUp: handleTextNodePointerUp } = textNodesResult;
  const { transform, canvasContainerRef, handlePointerMove, handlePointerUp } = transformResult;

  const draggingNodeId = draggingVideoNodeId || draggingDocumentNodeId || draggingChatNodeId || draggingTextNodeId;

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
    } else {
      handlePointerMove(e, draggingNodeId, () => {});
    }
  }, [
      connectingInfo, canvasContainerRef, setLiveEndPoint, transform,
      draggingVideoNodeId, moveVideoNode,
      draggingDocumentNodeId, moveDocumentNode,
      draggingChatNodeId, moveChatNode,
      draggingTextNodeId, moveTextNode,
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
    }
    handlePointerUp(e);

    if (connectingInfo) {
      clearConnectionState();
    }
  }, [
      draggingVideoNodeId, handleVideoNodePointerUp,
      draggingDocumentNodeId, handleDocumentNodePointerUp,
      draggingChatNodeId, handleChatNodePointerUp,
      draggingTextNodeId, handleTextNodePointerUp,
      handlePointerUp, connectingInfo, clearConnectionState
  ]);

  return { handleCanvasPointerMove, handleCanvasPointerUp, draggingNodeId };
};
