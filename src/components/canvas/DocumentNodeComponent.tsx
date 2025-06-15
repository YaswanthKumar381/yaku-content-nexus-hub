
import React from 'react';
import { DocumentNode } from '@/types/canvas';
import { FileText, BrainCircuit } from 'lucide-react';
import { formatBytes } from '@/utils/documentUtils';

interface DocumentNodeProps {
  node: DocumentNode;
  onPointerDown: (e: React.PointerEvent, nodeId: string) => void;
}

export const DocumentNodeComponent: React.FC<DocumentNodeProps> = ({ node, onPointerDown }) => {
  
  const handleNodePointerDown = (e: React.PointerEvent) => {
    onPointerDown(e, node.id);
  };

  return (
    <div
      className="absolute cursor-move"
      data-node-id={node.id}
      style={{ left: node.x, top: node.y, transform: 'translate(-50%, -50%)' }}
      onPointerDown={handleNodePointerDown}
    >
      <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-lg w-64 border border-blue-200 hover:shadow-xl transition-shadow">
        <div className="absolute top-1/2 left-full transform -translate-y-1/2 w-4 h-4 bg-transparent rounded-full border-2 border-blue-500 z-10" />
        <div className="p-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 text-sm truncate" title={node.fileName}>
                {node.fileName}
              </h3>
              <p className="text-xs text-gray-500">
                {formatBytes(node.fileSize)}
              </p>
            </div>
          </div>
          <div className="mt-3">
             {node.content === undefined && (
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <BrainCircuit className="w-3 h-3" />
                  Extracting content...
                </p>
             )}
             {node.content && node.content !== "Failed to extract content." && (
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <BrainCircuit className="w-3 h-3" />
                  Content extracted
                </p>
              )}
              {node.content === "Failed to extract content." && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <BrainCircuit className="w-3 h-3" />
                  Extraction failed
                </p>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};
