
import React, { useState } from 'react';
import { ImageNode } from '@/types/canvas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  ImageIcon, 
  Trash2, 
  Upload, 
  Eye, 
  Brain,
  AlertCircle,
  CheckCircle,
  Loader2,
  FileText
} from 'lucide-react';

interface ImageNodeComponentProps {
  node: ImageNode;
  onPointerDown: (e: React.PointerEvent, nodeId: string) => void;
  onStartConnection: (nodeId: string) => void;
  onDelete: (nodeId: string) => void;
  onDeleteImage: (nodeId: string, imageId: string) => void;
  onUploadClick: (nodeId: string) => void;
  onAnalyzeImage: (nodeId: string, imageId: string, prompt?: string) => Promise<void>;
  isConnected: boolean;
  isGlowing?: boolean;
}

export const ImageNodeComponent: React.FC<ImageNodeComponentProps> = ({
  node,
  onPointerDown,
  onStartConnection,
  onDelete,
  onDeleteImage,
  onUploadClick,
  onAnalyzeImage,
  isConnected,
  isGlowing,
}) => {
  const { isDarkMode } = useTheme();
  const [analyzingImageId, setAnalyzingImageId] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [showImageViewer, setShowImageViewer] = useState<string | null>(null);
  const [showTranscriptDialog, setShowTranscriptDialog] = useState(false);

  const handleAnalyzeImage = async (imageId: string, prompt?: string) => {
    setAnalyzingImageId(imageId);
    try {
      await onAnalyzeImage(node.id, imageId, prompt);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setAnalyzingImageId(null);
    }
  };

  const getImageDataUrl = (base64: string, fileType: string) => {
    return `data:${fileType};base64,${base64}`;
  };

  const handleNodePointerDown = (e: React.PointerEvent) => {
    // Don't propagate to canvas if clicking on buttons or interactive elements
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('[data-no-drag]')) {
      return;
    }
    
    e.stopPropagation();
    onPointerDown(e, node.id);
  };

  const handleConnectionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onStartConnection(node.id);
  };

  const handleButtonClick = (e: React.MouseEvent, callback: () => void) => {
    e.stopPropagation();
    callback();
  };

  const analyzedImages = node.images.filter(img => img.analysis);

  return (
    <div
      className={`absolute select-none ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
      style={{ 
        left: `${node.x}px`, 
        top: `${node.y}px`,
        transform: 'translate(-50%, -50%)',
        boxShadow: isGlowing ? '0 0 20px 5px rgba(99, 102, 241, 0.7)' : 'none',
      }}
      data-node-id={node.id}
    >
      <Card className={`w-80 ${isDarkMode ? 'bg-gray-800/90 border-gray-600' : 'bg-white/90 border-gray-300'} backdrop-blur-sm shadow-lg relative`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-indigo-900/50' : 'bg-indigo-100'}`}>
                <ImageIcon className={`w-4 h-4 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'}`} />
              </div>
              <div>
                <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Image
                </h3>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {node.images.length} image{node.images.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            
            <div className="flex gap-1" data-no-drag>
              {analyzedImages.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleButtonClick(e, () => setShowTranscriptDialog(true))}
                  className={`h-8 w-8 p-0 ${isDarkMode ? 'hover:bg-gray-700 text-blue-400' : 'hover:bg-gray-100 text-blue-600'}`}
                  title="View Analysis Transcript"
                >
                  <FileText className="w-3 h-3" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => handleButtonClick(e, () => onUploadClick(node.id))}
                className={`h-8 w-8 p-0 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <Upload className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => handleButtonClick(e, () => onDelete(node.id))}
                className={`h-8 w-8 p-0 ${isDarkMode ? 'hover:bg-red-900/50 text-red-400' : 'hover:bg-red-100 text-red-600'}`}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent 
          className="space-y-3 cursor-move"
          onPointerDown={handleNodePointerDown}
        >
          {node.images.length === 0 ? (
            <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No images uploaded</p>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => handleButtonClick(e, () => onUploadClick(node.id))}
                className="mt-2"
                data-no-drag
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Images
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {node.images.map((image) => (
                <div key={image.id} className={`relative border rounded-lg overflow-hidden ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                  <img
                    src={getImageDataUrl(image.base64, image.fileType)}
                    alt={image.fileName}
                    className="w-full h-24 object-cover cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowImageViewer(image.id);
                    }}
                  />
                  
                  <div className="absolute top-1 right-1 flex gap-1" data-no-drag>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => e.stopPropagation()}
                          className={`h-6 w-6 p-0 ${isDarkMode ? 'bg-gray-800/80 hover:bg-gray-700' : 'bg-white/80 hover:bg-gray-100'}`}
                        >
                          {analyzingImageId === image.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Brain className="w-3 h-3" />
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80" side="top">
                        <div className="space-y-3">
                          <h4 className="font-medium">Analyze Image</h4>
                          <Textarea
                            placeholder="Enter custom prompt (optional)"
                            value={customPrompt}
                            onChange={(e) => setCustomPrompt(e.target.value)}
                            className="h-20"
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleAnalyzeImage(image.id, customPrompt || undefined)}
                              disabled={analyzingImageId === image.id}
                            >
                              {analyzingImageId === image.id ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                              ) : (
                                <Brain className="w-4 h-4 mr-2" />
                              )}
                              Analyze
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAnalyzeImage(image.id)}
                              disabled={analyzingImageId === image.id}
                            >
                              Quick Analysis
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleButtonClick(e, () => onDeleteImage(node.id, image.id))}
                      className={`h-6 w-6 p-0 ${isDarkMode ? 'bg-red-900/80 hover:bg-red-800 text-red-300' : 'bg-red-100/80 hover:bg-red-200 text-red-600'}`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>

                  <div className="absolute bottom-1 left-1">
                    {image.analysis && (
                      <Badge variant="secondary" className="text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Analyzed
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {analyzedImages.length > 0 && (
            <div className="mt-3">
              <h4 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Recent Analysis
              </h4>
              <div className="space-y-2 max-h-20 overflow-y-auto">
                {analyzedImages.slice(0, 2).map((image) => (
                  <div key={image.id} className={`p-2 rounded text-xs ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <div className="font-medium mb-1">{image.fileName}</div>
                    <div className={`line-clamp-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {image.analysis}
                    </div>
                  </div>
                ))}
                {analyzedImages.length > 2 && (
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    +{analyzedImages.length - 2} more analyzed images
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>

        {/* Connection handle - positioned completely outside the card */}
        <div
          className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full border-2 cursor-pointer ${
            isConnected
              ? isDarkMode 
                ? 'bg-indigo-500 border-indigo-400' 
                : 'bg-indigo-600 border-indigo-500'
              : isDarkMode 
                ? 'bg-gray-600 border-gray-500 hover:bg-indigo-500 hover:border-indigo-400' 
                : 'bg-gray-300 border-gray-400 hover:bg-indigo-600 hover:border-indigo-500'
          } transition-colors`}
          style={{
            right: '-16px', // Position completely outside
          }}
          onClick={handleConnectionClick}
          data-no-drag
        />

        {/* Image viewer modal */}
        {showImageViewer && (
          <div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" 
            onClick={(e) => {
              e.stopPropagation();
              setShowImageViewer(null);
            }}
          >
            <div className="max-w-4xl max-h-4xl p-4">
              {(() => {
                const image = node.images.find(img => img.id === showImageViewer);
                return image ? (
                  <img
                    src={getImageDataUrl(image.base64, image.fileType)}
                    alt={image.fileName}
                    className="max-w-full max-h-full object-contain"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : null;
              })()}
            </div>
          </div>
        )}

        {/* Analysis Transcript Dialog */}
        <Dialog open={showTranscriptDialog} onOpenChange={setShowTranscriptDialog}>
          <DialogContent className={`max-w-2xl max-h-[80vh] ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}>
            <DialogHeader>
              <DialogTitle className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                Image Analysis Transcript
              </DialogTitle>
              <DialogDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                View all analyzed text from uploaded images
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 overflow-y-auto max-h-96">
              {analyzedImages.length === 0 ? (
                <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No analyzed images available</p>
                </div>
              ) : (
                analyzedImages.map((image) => (
                  <div key={image.id} className={`border rounded-lg p-4 ${isDarkMode ? 'border-gray-600 bg-gray-700/50' : 'border-gray-200 bg-gray-50'}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={getImageDataUrl(image.base64, image.fileType)}
                        alt={image.fileName}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {image.fileName}
                        </h4>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Analyzed on {new Date(image.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <h5 className="font-medium mb-2">Analysis:</h5>
                      <p className="whitespace-pre-wrap">{image.analysis}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  );
};
