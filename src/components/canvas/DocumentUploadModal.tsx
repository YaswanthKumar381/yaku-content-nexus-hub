
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
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isUploading,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(prev => {
        const newFiles = Array.from(e.target.files!);
        const uniqueNewFiles = newFiles.filter(nf => !prev.some(pf => pf.name === nf.name && pf.size === nf.size));
        return [...prev, ...uniqueNewFiles];
      });
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Document(s)</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex flex-col items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-48 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-10 h-10 mb-3 text-blue-500" />
                <p className="mb-2 text-sm text-blue-700">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PDF, CSV, TXT, etc.</p>
              </div>
              <Input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} multiple />
            </label>
            {selectedFiles.length > 0 && (
              <div className="mt-4 w-full text-sm text-gray-600 max-h-40 overflow-y-auto pr-2">
                <p className="font-semibold mb-2 text-xs">Selected files:</p>
                <ul className="space-y-1">
                  {selectedFiles.map((file) => (
                    <li key={`${file.name}-${file.lastModified}`} className="flex justify-between items-center text-xs bg-gray-50 hover:bg-gray-100 p-2 rounded-md">
                      <span className="truncate pr-2" title={file.name}>{file.name}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0" onClick={() => removeFile(file)}>
                        <Trash2 className="w-3.5 h-3.5 text-red-500"/>
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={handleModalClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={selectedFiles.length === 0 || isUploading}>
            {isUploading ? 'Uploading...' : `Upload & Create Node (${selectedFiles.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
