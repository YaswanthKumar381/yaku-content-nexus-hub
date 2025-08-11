
import React from 'react';
import { DocumentNode } from '@/types/canvas';
import { FileText, BrainCircuit, Trash2, UploadCloud } from 'lucide-react';
import { formatBytes } from '@/utils/documentUtils';

interface DocumentNodeProps {
  node: DocumentNode;
  onPointerDown: (e: React.PointerEvent, nodeId: string) => void;
  onStartConnection: (nodeId: string) => void;
  onDelete: (nodeId: string) => void;
  onDeleteFile: (nodeId: string, fileId: string) => void;
  onUploadClick: (nodeId: string) => void;
  isConnected: boolean;
  onNodeHover: (nodeId: string | null) => void;
  isGlowing?: boolean;
}

export const DocumentNodeComponent: React.FC<DocumentNodeProps> = ({ node, onPointerDown, onStartConnection, onDelete, onDeleteFile, onUploadClick, isConnected, onNodeHover, isGlowing }) => {
  
  const handleNodePointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('[data-connection-handle]') || target.closest('button') || target.closest('ul')) {
        return;
    }
    onPointerDown(e, node.id);
  };

  const nodeTitle = node.documents.length === 1 ? node.documents[0].fileName : node.documents.length > 1 ? `${node.documents.length} documents` : "Empty Node";
  const totalSize = node.documents.reduce((acc, doc) => acc + doc.fileSize, 0);

  return (
    <div
      className="absolute cursor-move"
      data-node-id={node.id}
      style={{
        left: node.x,
        top: node.y,
        transform: 'translate(-50%, -50%)',
        boxShadow: isGlowing ? '0 0 20px 5px rgba(59, 130, 246, 0.7)' : 'none',
      }}
      onPointerDown={handleNodePointerDown}
      onMouseEnter={() => onNodeHover(node.id)}
      onMouseLeave={() => onNodeHover(null)}
    >
      <div className="group relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-lg w-72 border border-blue-200 hover:shadow-xl transition-shadow">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(node.id);
          }}
          className="absolute -top-2 -left-2 w-8 h-8 bg-white hover:bg-red-100 rounded-full flex items-center justify-center z-20 cursor-pointer border border-gray-300 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          title="Delete Node"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onUploadClick(node.id);
          }}
          className="absolute -top-2 -right-2 w-8 h-8 bg-white hover:bg-blue-100 rounded-full flex items-center justify-center z-20 cursor-pointer border border-gray-300 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          title="Upload more files"
        >
          <UploadCloud className="w-4 h-4 text-blue-500" />
        </button>
        <div 
          data-connection-handle
          onPointerDown={(e) => {
            e.stopPropagation();
            onStartConnection(node.id);
          }}
          className="absolute top-1/2 left-full transform -translate-y-1/2 w-4 h-4 bg-transparent rounded-full border-2 border-blue-500 z-10 cursor-pointer flex items-center justify-center"
        >
          {isConnected && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />}
        </div>
        <div className="p-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 text-sm truncate" title={nodeTitle}>
                {nodeTitle}
              </h3>
              <p className="text-xs text-gray-500">
                Total size: {formatBytes(totalSize)}
              </p>
            </div>
          </div>
        </div>

        <div className="px-2 pb-2">
            <div className="bg-white/50 rounded-md max-h-48 overflow-y-auto">
                <ul className="p-1 space-y-1">
                    {node.documents.map(doc => (
                        <li key={doc.id} className="group/item flex items-center justify-between p-2 rounded-md hover:bg-blue-50/80 transition-colors duration-150 cursor-default">
                            <div className="flex items-center gap-3 min-w-0">
                                <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-800 truncate" title={doc.fileName}>{doc.fileName}</p>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <span>{formatBytes(doc.fileSize)}</span>
                                        &middot;
                                        {doc.content === undefined && <span className="flex items-center gap-1"><BrainCircuit className="w-3 h-3" />Extracting...</span>}
                                        {doc.content && doc.content !== "Failed to extract content." && <span className="text-green-600 flex items-center gap-1"><BrainCircuit className="w-3 h-3" />Ready</span>}
                                        {doc.content === "Failed to extract content." && <span className="text-red-600 flex items-center gap-1"><BrainCircuit className="w-3 h-3" />Failed</span>}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={(e) => { e.stopPropagation(); onDeleteFile(node.id, doc.id); }}
                                className="opacity-0 group-hover/item:opacity-100 transition-opacity duration-150 ml-2 p-1 rounded-full hover:bg-red-100"
                                title="Delete file"
                            >
                                <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                        </li>
                    ))}
                    {node.documents.length === 0 && (
                        <li className="text-center text-xs text-gray-500 p-4 cursor-default">
                            This node is empty.
                        </li>
                    )}
                </ul>
            </div>
        </div>
      </div>
    </div>
  );
};
