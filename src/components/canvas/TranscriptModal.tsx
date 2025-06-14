
import React from "react";
import { Button } from "@/components/ui/button";
import { X, AlertCircle, ExternalLink } from "lucide-react";
import { getYouTubeVideoId } from "@/utils/videoUtils";

interface TranscriptModalProps {
  isOpen: boolean;
  videoUrl: string;
  transcript: string;
  error: string;
  onClose: () => void;
  onTranscriptChange: (transcript: string) => void;
  onSave: () => void;
}

export const TranscriptModal: React.FC<TranscriptModalProps> = ({
  isOpen,
  videoUrl,
  transcript,
  error,
  onClose,
  onTranscriptChange,
  onSave
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col animate-in fade-in-0 zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b bg-gray-50 rounded-t-lg">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Transcript Options</h3>
            <p className="text-sm text-gray-600 mt-1">Manual transcript extraction required</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            {/* Error Message */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-amber-800 font-medium mb-1">Automatic Transcript Unavailable</h4>
                  <p className="text-amber-700 text-sm">{error}</p>
                </div>
              </div>
            </div>

            {/* Manual Options */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Alternative Methods:</h4>
              
              {/* YouTube Direct */}
              {videoUrl && getYouTubeVideoId(videoUrl) && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <h5 className="font-medium text-gray-800 mb-2">1. YouTube Transcript (Recommended)</h5>
                  <p className="text-sm text-gray-600 mb-3">
                    Access the official YouTube transcript directly from the video page.
                  </p>
                  <Button
                    onClick={() => {
                      const videoId = getYouTubeVideoId(videoUrl);
                      window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
                    }}
                    className="flex items-center space-x-2"
                    size="sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open YouTube Video</span>
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    Click "..." → "Show transcript" on YouTube, then copy and paste the text here.
                  </p>
                </div>
              )}

              {/* Browser Extensions */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h5 className="font-medium text-gray-800 mb-2">2. Browser Extensions</h5>
                <p className="text-sm text-gray-600 mb-3">
                  Install browser extensions that can extract YouTube transcripts:
                </p>
                <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                  <li>"YouTube Transcript" extension</li>
                  <li>"Video Transcript AI" extension</li>
                  <li>"Transcript for YouTube" extension</li>
                </ul>
              </div>

              {/* Manual Copy Paste */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h5 className="font-medium text-gray-800 mb-2">3. Manual Input</h5>
                <p className="text-sm text-gray-600 mb-3">
                  If you have the transcript text, paste it below:
                </p>
                <textarea
                  placeholder="Paste transcript text here..."
                  className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  value={transcript}
                  onChange={(e) => onTranscriptChange(e.target.value)}
                />
                {transcript && (
                  <div className="mt-3 flex justify-end">
                    <Button onClick={onSave} size="sm">
                      Save Transcript
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
