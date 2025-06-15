
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UploadCloud } from 'lucide-react';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (file: File) => void;
  isUploading: boolean;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isUploading,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onSubmit(selectedFile);
    }
  };
  
  const handleModalClose = () => {
    setSelectedFile(null);
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleModalClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex flex-col items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-10 h-10 mb-3 text-blue-500" />
                <p className="mb-2 text-sm text-blue-700">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PDF, CSV, TXT, etc.</p>
              </div>
              <Input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} />
            </label>
            {selectedFile && (
                <p className="mt-4 text-sm text-gray-600">Selected file: {selectedFile.name}</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={handleModalClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!selectedFile || isUploading}>
            {isUploading ? 'Uploading...' : 'Upload & Create Node'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
