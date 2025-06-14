
import React, { useState, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { CustomContextMenu } from '@/components/canvas/CustomContextMenu';
import { ContextMenuContent } from '@/components/canvas/ContextMenuContent';
import { TextNodeDialog } from '@/components/canvas/TextNodeDialog';
import { TextNodeComponent } from '@/components/canvas/TextNodeComponent';
import { VideoNodeComponent } from '@/components/canvas/VideoNodeComponent';
import { useCanvasNodes } from '@/hooks/useCanvasNodes';

const Canvas = () => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addTextNode,
    addVideoNode,
    deleteNode
  } = useCanvasNodes();

  const [newTextNodePosition, setNewTextNodePosition] = useState<{ x: number; y: number } | null>(null);
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [contextMenuTarget, setContextMenuTarget] = useState<string | null>(null);
  const [newTextNodeLabel, setNewTextNodeLabel] = useState("New Text");
  const [newTextNodeContext, setNewTextNodeContext] = useState("");
  const [newVideoNodeUrl, setNewVideoNodeUrl] = useState("");

  const handleContextMenu = (event: React.MouseEvent, node?: any) => {
    event.preventDefault();
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
    setIsContextMenuOpen(true);
    setContextMenuTarget(node ? node.id : null);
  };

  const closeContextMenu = () => {
    setIsContextMenuOpen(false);
    setContextMenuTarget(null);
  };

  const handleCanvasContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
    setIsContextMenuOpen(true);
    setContextMenuTarget(null);
    setNewTextNodePosition({ x: event.clientX, y: event.clientY });
  };

  const handleAddTextNode = () => {
    if (newTextNodePosition) {
      addTextNode(newTextNodeLabel, newTextNodeContext, newTextNodePosition);
      setNewTextNodePosition(null);
      closeContextMenu();
    }
  };

  const handleDeleteNode = () => {
    if (contextMenuTarget) {
      deleteNode(contextMenuTarget);
      closeContextMenu();
    }
  };

  const handleTextNodeLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTextNodeLabel(event.target.value);
  };

  const handleTextNodeContextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewTextNodeContext(event.target.value);
  };

  const handleVideoNodeUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewVideoNodeUrl(event.target.value);
  };

  return (
    <div className="w-full h-screen bg-zinc-900">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeContextMenu={handleContextMenu}
        onPaneContextMenu={handleCanvasContextMenu}
        onNodeDoubleClick={handleContextMenu}
        nodeTypes={{
          text: TextNodeComponent,
          video: VideoNodeComponent,
        }}
        fitView
        className="bg-zinc-800"
      >
        <Controls />
        <Background color="#444" />
      </ReactFlow>

      <CustomContextMenu
        isOpen={isContextMenuOpen}
        onClose={closeContextMenu}
        position={contextMenuPosition}
      >
        <ContextMenuContent
          contextMenuTarget={contextMenuTarget}
          onAddTextNode={handleAddTextNode}
          onAddVideoNode={addVideoNode}
          onDeleteNode={handleDeleteNode}
          onClose={closeContextMenu}
          newVideoNodeUrl={newVideoNodeUrl}
          onVideoUrlChange={handleVideoNodeUrlChange}
        />
      </CustomContextMenu>

      <TextNodeDialog
        newTextNodeLabel={newTextNodeLabel}
        newTextNodeContext={newTextNodeContext}
        onLabelChange={handleTextNodeLabelChange}
        onContextChange={handleTextNodeContextChange}
        onAddTextNode={handleAddTextNode}
      />
    </div>
  );
};

export default Canvas;
