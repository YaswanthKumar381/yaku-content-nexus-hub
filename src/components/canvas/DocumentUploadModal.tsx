import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UploadCloud, Trash2 } from 'lucide-react';
import { DocumentFile } from '@/types/canvas';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (files: File[]) => void;
  isUploading: boolean;
  mode: 'create' | 'update';
  existingFiles?: DocumentFile[];
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isUploading,
  mode,
  existingFiles = [],
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(prev => {
        const newFiles = Array.from(e.target.files!);
        const uniqueNewFiles = newFiles.filter(nf => !prev.some(pf => pf.name === nf.name && pf.size === nf.size));
        return [...prev, ...uniqueNewFiles];
      });
      e.target.value = ''; // Allow re-selecting the same file if removed
    }
  };

  const handleSubmit = () => {
    if (selectedFiles.length > 0) {
      onSubmit(selectedFiles);
    }
  };
  
  const handleModalClose = () => {
    setSelectedFiles([]);
    onClose();
  }

  const removeFile = (fileToRemove: File) => {
    setSelectedFiles(prev => prev.filter(file => file !== fileToRemove));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleModalClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{mode === 'create' ? 'Upload Document(s)' : 'Add More Documents'}</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto px-1">
          <div className="space-y-4 py-4">
            {/* Upload Area */}
            <div className="w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex flex-col items-center justify-center py-4 px-4">
                  <UploadCloud className="w-6 h-6 mb-2 text-blue-500 dark:text-gray-400" />
                  <p className="text-sm text-blue-700 dark:text-gray-300 text-center">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">PDF, CSV, TXT, etc.</p>
                </div>
                <Input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} multiple />
              </label>
            </div>
            
            {/* Files Section */}
            {(existingFiles.length > 0 || selectedFiles.length > 0) && (
              <div className="space-y-4">
                {/* Existing Files */}
                {existingFiles.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Current Files ({existingFiles.length})
                    </h4>
                    <div className="max-h-32 overflow-y-auto border rounded-md bg-gray-50 dark:bg-gray-800">
                      <div className="p-2 space-y-1">
                        {existingFiles.map((file) => (
                          <div key={file.id} className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded text-sm border">
                            <span className="truncate flex-1 mr-2" title={file.fileName}>
                              {file.fileName}
                            </span>
                            <span className="text-xs text-gray-500 flex-shrink-0">
                              {Math.round(file.fileSize / 1024)}KB
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* New Files to Upload */}
                {selectedFiles.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      New Files to Upload ({selectedFiles.length})
                    </h4>
                    <div className="max-h-32 overflow-y-auto border rounded-md bg-blue-50 dark:bg-blue-900/20">
                      <div className="p-2 space-y-1">
                        {selectedFiles.map((file) => (
                          <div key={`${file.name}-${file.lastModified}`} className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded text-sm border">
                            <span className="truncate flex-1 mr-2" title={file.name}>
                              {file.name}
                            </span>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-xs text-gray-500">
                                {Math.round(file.size / 1024)}KB
                              </span>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 w-6 p-0 hover:bg-red-100 dark:hover:bg-red-900/20" 
                                onClick={() => removeFile(file)}
                              >
                                <Trash2 className="w-3 h-3 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 pt-4 border-t">
          <Button variant="ghost" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={selectedFiles.length === 0 || isUploading}>
            {isUploading ? 'Uploading...' : (mode === 'create' ? `Upload & Create (${selectedFiles.length})` : `Add Files (${selectedFiles.length})`)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
