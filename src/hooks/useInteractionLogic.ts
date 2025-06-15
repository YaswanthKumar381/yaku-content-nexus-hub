
import { useState, useCallback } from 'react';
import { CanvasNode, Connection } from '@/types/canvas';
import { useToast } from "@/hooks/use-toast";
import type { useConnections } from './useConnections';
import type { useChatNodes } from './useChatNodes';

interface UseInteractionLogicProps {
  connectionsResult: ReturnType<typeof useConnections>;
  chatNodesResult: ReturnType<typeof useChatNodes>;
  canvasContainerRef: React.RefObject<HTMLDivElement>;
}

export const useInteractionLogic = ({
  connectionsResult,
  chatNodesResult,
  canvasContainerRef
}: UseInteractionLogicProps) => {
  const { toast } = useToast();
  const [nodeToEdit, setNodeToEdit] = useState<CanvasNode | null>(null);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });
  const [nodeToDelete, setNodeToDelete] = useState<CanvasNode | null>(null);
  const [connectionToEdit, setConnectionToEdit] = useState<Connection | null>(null);

  const handleNodeDoubleClick = useCallback((node: CanvasNode, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = canvasContainerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setNodeToEdit(node);
    setConnectionToEdit(null);
    setPopoverPosition({ x: e.clientX, y: e.clientY });
  }, [canvasContainerRef]);

  const handleConnectionDoubleClick = useCallback((connection: Connection, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = canvasContainerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setConnectionToEdit(connection);
    setNodeToEdit(null);
    setPopoverPosition({ x: e.clientX, y: e.clientY });
  }, [canvasContainerRef]);

  const handleDeleteNodeRequest = useCallback(() => {
    if (nodeToEdit) {
      setNodeToDelete(nodeToEdit);
      setNodeToEdit(null);
    }
  }, [nodeToEdit]);

  const handleConfirmDeleteNode = useCallback(() => {
    if (!nodeToDelete) return;
    
    connectionsResult.removeConnectionsForNode(nodeToDelete.id);

    if (nodeToDelete.type === 'chat') {
        chatNodesResult.deleteChatNode(nodeToDelete.id);
        toast({ title: "Node deleted", description: "The chat node and its connections have been deleted." });
    } else {
        toast({
            variant: "destructive",
            title: "Action not supported",
            description: `Deleting ${nodeToDelete.type} nodes is not yet supported.`,
        });
    }
    setNodeToDelete(null);
  }, [nodeToDelete, connectionsResult, chatNodesResult, toast]);
  
  const handleCancelDelete = useCallback(() => {
    setNodeToDelete(null);
  }, []);

  const handleDisconnect = useCallback(() => {
      if (!connectionToEdit) return;
      connectionsResult.removeConnection(connectionToEdit.id);
      setConnectionToEdit(null);
      toast({ title: "Connection removed" });
  }, [connectionToEdit, connectionsResult, toast]);

  const closePopover = useCallback(() => {
    setNodeToEdit(null);
    setConnectionToEdit(null);
  }, []);

  return {
    nodeToEdit,
    popoverPosition,
    nodeToDelete,
    connectionToEdit,
    handleNodeDoubleClick,
    handleConnectionDoubleClick,
    handleDeleteNodeRequest,
    handleConfirmDeleteNode,
    handleCancelDelete,
    handleDisconnect,
    closePopover
  };
};
