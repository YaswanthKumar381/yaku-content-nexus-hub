
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";

interface ContextMenuContentProps {
  contextMenuTarget: string | null;
  onAddTextNode: () => void;
  onAddVideoNode: (url: string) => void;
  onDeleteNode: () => void;
  onClose: () => void;
  newVideoNodeUrl: string;
  onVideoUrlChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ContextMenuContent = ({
  contextMenuTarget,
  onAddTextNode,
  onAddVideoNode,
  onDeleteNode,
  onClose,
  newVideoNodeUrl,
  onVideoUrlChange
}: ContextMenuContentProps) => {
  if (contextMenuTarget === null) {
    return (
      <div className="space-y-2">
        <Button 
          variant="ghost" 
          className="w-full justify-start" 
          onClick={() => {
            onAddTextNode();
            onClose();
          }}
        >
          Add Text Node
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" className="w-full justify-start">
              Add Video Node
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Add YouTube Video</AlertDialogTitle>
              <AlertDialogDescription>
                Enter the YouTube video URL to add a video node.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="grid gap-2">
              <Label htmlFor="url">Video URL</Label>
              <Input
                id="url"
                placeholder="YouTube Video URL"
                onChange={onVideoUrlChange}
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => {
                onAddVideoNode(newVideoNodeUrl);
                onClose();
              }}>Add</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  return (
    <Button 
      variant="ghost" 
      className="w-full justify-start text-destructive"
      onClick={() => {
        onDeleteNode();
        onClose();
      }}
    >
      Delete Node
    </Button>
  );
};
