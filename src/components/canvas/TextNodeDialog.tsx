
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

interface TextNodeDialogProps {
  newTextNodeLabel: string;
  newTextNodeContext: string;
  onLabelChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onContextChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onAddTextNode: () => void;
}

export const TextNodeDialog = ({
  newTextNodeLabel,
  newTextNodeContext,
  onLabelChange,
  onContextChange,
  onAddTextNode
}: TextNodeDialogProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="absolute top-4 left-4 z-10">Add Text Node</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create Text Node</AlertDialogTitle>
          <AlertDialogDescription>
            Enter the label and context for the new text node.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="label" className="text-right">
              Label
            </Label>
            <Input
              type="text"
              id="label"
              value={newTextNodeLabel}
              onChange={onLabelChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="context" className="text-right">
              Context
            </Label>
            <Textarea
              id="context"
              value={newTextNodeContext}
              onChange={onContextChange}
              className="col-span-3"
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onAddTextNode}>Create</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
