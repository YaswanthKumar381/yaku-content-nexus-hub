
import React from "react";
import { Button } from "@/components/ui/button";

interface VideoInputModalProps {
  isOpen: boolean;
  videoUrl: string;
  isCreating: boolean;
  onUrlChange: (url: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export const VideoInputModal: React.FC<VideoInputModalProps> = ({
  isOpen,
  videoUrl,
  isCreating,
  onUrlChange,
  onSubmit,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
        <h3 className="text-lg font-semibold mb-4">Enter Video URL</h3>
        <input
          type="url"
          value={videoUrl}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="Enter YouTube video URL..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSubmit();
            }
          }}
          autoFocus
          disabled={isCreating}
        />
        {isCreating && (
          <div className="flex items-center space-x-2 mb-4 text-sm text-gray-600">
            <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <span>Creating video node...</span>
          </div>
        )}
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={!videoUrl.trim() || isCreating}
          >
            {isCreating ? "Creating..." : "Add Video"}
          </Button>
        </div>
      </div>
    </div>
  );
};
