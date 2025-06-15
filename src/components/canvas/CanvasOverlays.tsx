
import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Unlink } from "lucide-react";
import { CanvasNode, Connection } from '@/types/canvas';

interface CanvasOverlaysProps {
  nodeToEdit: CanvasNode | null;
  connectionToEdit: Connection | null;
  popoverPosition: { x: number; y: number; };
  nodeToDelete: CanvasNode | null;
  onClosePopover: () => void;
  onDeleteNodeRequest: () => void;
  onDisconnect: () => void;
  onConfirmDeleteNode: () => void;
  onCancelDelete: () => void;
}

export const CanvasOverlays: React.FC<CanvasOverlaysProps> = ({
  nodeToEdit,
  connectionToEdit,
  popoverPosition,
  nodeToDelete,
  onClosePopover,
  onDeleteNodeRequest,
  onDisconnect,
  onConfirmDeleteNode,
  onCancelDelete,
}) => {
  return (
    <>
      <Popover open={!!nodeToEdit || !!connectionToEdit} onOpenChange={onClosePopover}>
        <PopoverTrigger asChild>
          <div className="absolute" style={{ top: popoverPosition.y, left: popoverPosition.x }} />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-1">
          {nodeToEdit && (
            <Button variant="destructive" onClick={onDeleteNodeRequest} size="sm" className="w-full">
              <Trash2 className="h-4 w-4 mr-2" /> Delete Node
            </Button>
          )}
          {connectionToEdit && (
            <Button variant="destructive" onClick={onDisconnect} size="sm" className="w-full">
              <Unlink className="h-4 w-4 mr-2" /> Disconnect
            </Button>
          )}
        </PopoverContent>
      </Popover>

      <AlertDialog open={!!nodeToDelete} onOpenChange={(open) => !open && onCancelDelete()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the node and all its connections.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirmDeleteNode}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
