import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Loader2, CheckCircle } from "lucide-react";
import { fetchYouTubeTranscript, formatTranscriptText } from "@/services/transcriptService";

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
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedTranscript, setFetchedTranscript] = useState("");
  const [videoTitle, setVideoTitle] = useState("");

  useEffect(() => {
    if (isOpen && videoUrl) {
      fetchTranscript();
    }
  }, [isOpen, videoUrl]);

  const fetchTranscript = async () => {
    if (!videoUrl) return;

    setIsLoading(true);
    try {
      console.log("🔍 Fetching transcript for video URL:", videoUrl);
      const response = await fetchYouTubeTranscript(videoUrl); // Pass original URL
      
      if (response.code === 100000) {
        setVideoTitle(response.data.videoInfo.name);
        
        // Try to get the best available transcript
        const transcripts = response.data.transcripts;
        let bestTranscript = "";
        
        if (transcripts.en_auto?.custom?.length > 0) {
          bestTranscript = formatTranscriptText(transcripts.en_auto.custom);
        } else if (transcripts.en_auto?.default?.length > 0) {
          bestTranscript = formatTranscriptText(transcripts.en_auto.default);
        } else if (transcripts.en_auto?.auto?.length > 0) {
          bestTranscript = formatTranscriptText(transcripts.en_auto.auto);
        }
        
        setFetchedTranscript(bestTranscript);
        onTranscriptChange(bestTranscript);
        console.log("✅ Transcript fetched successfully");
      } else {
        throw new Error(response.message || "Failed to fetch transcript");
      }
    } catch (error) {
      console.error("❌ Error fetching transcript:", error);
      setFetchedTranscript("");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col animate-in fade-in-0 zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b bg-gray-50 rounded-t-lg">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Video Transcript</h3>
            {videoTitle && (
              <p className="text-sm text-gray-600 mt-1">{videoTitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
              <span className="ml-2 text-gray-600">Fetching transcript...</span>
            </div>
          ) : fetchedTranscript ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-green-600 mb-4">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Transcript loaded successfully!</span>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Transcript:</h4>
                <div className="bg-white border rounded p-3 max-h-64 overflow-y-auto">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {fetchedTranscript}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={onSave} className="bg-purple-600 hover:bg-purple-700">
                  Save Transcript
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No transcript available for this video.</p>
              <Button 
                onClick={fetchTranscript}
                variant="outline"
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
