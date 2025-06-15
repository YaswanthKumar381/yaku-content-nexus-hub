
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UploadCloud, Trash2 } from 'lucide-react';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (files: File[]) => void;
  isUploading: boolean;
  mode: 'create' | 'update';
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isUploading,
  mode,
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
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Upload Document(s)' : 'Add More Documents'}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-40 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-8 h-8 mb-3 text-blue-500 dark:text-gray-400" />
                <p className="mb-2 text-sm text-blue-700 dark:text-gray-300">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">PDF, CSV, TXT, etc.</p>
              </div>
              <Input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} multiple />
            </label>
            {selectedFiles.length > 0 && (
              <div className="w-full space-y-2">
                <p className="font-semibold text-xs text-gray-500 dark:text-gray-400">Selected files:</p>
                <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                  {selectedFiles.map((file) => (
                    <div key={`${file.name}-${file.lastModified}`} className="flex justify-between items-center text-sm p-2 rounded-md bg-gray-50 dark:bg-zinc-800">
                      <span className="truncate pr-2" title={file.name}>{file.name}</span>
                      <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0" onClick={() => removeFile(file)}>
                        <Trash2 className="w-4 h-4 text-red-500 hover:text-red-600"/>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={handleModalClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={selectedFiles.length === 0 || isUploading}>
            {isUploading ? 'Uploading...' : (mode === 'create' ? `Upload & Create Node (${selectedFiles.length})` : `Add Files (${selectedFiles.length})`)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
