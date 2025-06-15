
import React, { useState } from 'react';
import { AudioNode } from '@/types/canvas';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTheme } from '@/contexts/ThemeContext';
import { useAudioRecording } from '@/hooks/useAudioRecording';
import { Mic, Square, Play, Trash2, Download, Volume2 } from 'lucide-react';
import { toast } from 'sonner';

interface AudioNodeComponentProps {
  node: AudioNode;
  onPointerDown: (e: React.PointerEvent, nodeId: string) => void;
  onStartConnection: (nodeId: string) => void;
  onDelete: (nodeId: string) => void;
  onAddRecording: (nodeId: string, audioBlob: Blob, duration: number) => Promise<void>;
  onDeleteRecording: (nodeId: string, recordingId: string) => void;
  isConnected: boolean;
}

export const AudioNodeComponent: React.FC<AudioNodeComponentProps> = ({
  node,
  onPointerDown,
  onStartConnection,
  onDelete,
  onAddRecording,
  onDeleteRecording,
  isConnected,
}) => {
  const { isDarkMode } = useTheme();
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [playingRecordingId, setPlayingRecordingId] = useState<string | null>(null);

  const {
    isRecording,
    recordingDuration,
    startRecording,
    stopRecording,
    isSupported,
  } = useAudioRecording();

  const handleStartRecording = async () => {
    if (!isSupported) {
      toast.error('Audio recording is not supported in this browser');
      return;
    }

    try {
      await startRecording();
      toast.success('Recording started');
    } catch (error) {
      toast.error('Failed to start recording');
    }
  };

  const handleStopRecording = async () => {
    try {
      const audioBlob = await stopRecording();
      if (audioBlob) {
        setIsTranscribing(true);
        await onAddRecording(node.id, audioBlob, recordingDuration);
        toast.success('Recording saved and transcribed');
      }
    } catch (error) {
      toast.error('Failed to save recording');
    } finally {
      setIsTranscribing(false);
    }
  };

  const playRecording = (recording: any) => {
    if (playingRecordingId === recording.id) {
      setPlayingRecordingId(null);
      return;
    }

    const audio = new Audio(URL.createObjectURL(recording.blob));
    setPlayingRecordingId(recording.id);
    audio.onended = () => setPlayingRecordingId(null);
    audio.play();
  };

  const downloadRecording = (recording: any, index: number) => {
    const url = URL.createObjectURL(recording.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recording-${index + 1}.webm`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className="absolute cursor-move"
      style={{ left: node.x, top: node.y }}
      onPointerDown={(e) => onPointerDown(e, node.id)}
      data-node-id={node.id}
    >
      <Card className={`w-80 relative ${
        isDarkMode 
          ? 'bg-gradient-to-br from-purple-900/90 to-indigo-900/90 border-purple-500/30 shadow-purple-500/20' 
          : 'bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200 shadow-purple-200/50'
      } shadow-lg backdrop-blur-sm`}>
        
        {/* Connection Handle - Right Side Middle */}
        <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 z-10">
          <Button
            size="sm"
            variant="ghost"
            className="w-4 h-4 p-0 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              onStartConnection(node.id);
            }}
            data-no-drag
          >
            <div className={`w-4 h-4 rounded-full border-2 transition-colors ${
              isConnected 
                ? 'bg-purple-500 border-purple-500 shadow-purple-500/50 shadow-lg' 
                : isDarkMode 
                  ? 'border-purple-400 hover:border-purple-300' 
                  : 'border-purple-500 hover:border-purple-600'
            }`} />
          </Button>
        </div>

        {/* Header */}
        <div className={`flex items-center justify-between p-3 border-b ${
          isDarkMode ? 'border-purple-700/50' : 'border-purple-200'
        }`}>
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${
              isDarkMode ? 'bg-purple-600/50' : 'bg-purple-100'
            }`}>
              <Volume2 className={`w-4 h-4 ${
                isDarkMode ? 'text-purple-200' : 'text-purple-600'
              }`} />
            </div>
            <span className={`text-sm font-medium ${
              isDarkMode ? 'text-purple-100' : 'text-purple-800'
            }`}>
              Audio
            </span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className={`w-6 h-6 p-0 transition-colors ${
              isDarkMode 
                ? 'text-red-400 hover:text-red-300 hover:bg-red-500/20' 
                : 'text-red-500 hover:text-red-600 hover:bg-red-50'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(node.id);
            }}
            data-no-drag
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>

        {/* Recording Controls */}
        <div className="p-4">
          <div className="flex items-center justify-center gap-4 mb-4">
            {!isRecording ? (
              <Button
                onClick={handleStartRecording}
                disabled={!isSupported || isTranscribing}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  isDarkMode
                    ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/20'
                    : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/30'
                } shadow-lg disabled:opacity-50`}
                data-no-drag
              >
                <Mic className="w-4 h-4" />
                Start Recording
              </Button>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-red-500/50 shadow-lg" />
                  <span className={`text-sm font-mono ${
                    isDarkMode ? 'text-purple-200' : 'text-purple-700'
                  }`}>
                    {formatDuration(recordingDuration)}
                  </span>
                </div>
                <Button
                  onClick={handleStopRecording}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white shadow-lg"
                  data-no-drag
                >
                  <Square className="w-4 h-4" />
                  Stop
                </Button>
              </div>
            )}
          </div>

          {isTranscribing && (
            <div className={`text-center text-sm mb-4 ${
              isDarkMode ? 'text-purple-300' : 'text-purple-600'
            }`}>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
                <span>Transcribing audio...</span>
              </div>
            </div>
          )}

          {/* Recordings List */}
          {node.recordings.length > 0 && (
            <div className="space-y-2">
              <h4 className={`text-sm font-medium ${
                isDarkMode ? 'text-purple-200' : 'text-purple-800'
              }`}>
                Recordings ({node.recordings.length})
              </h4>
              {node.recordings.map((recording, index) => (
                <div
                  key={recording.id}
                  className={`p-3 rounded-lg border transition-colors ${
                    isDarkMode 
                      ? 'border-purple-600/30 bg-purple-800/30 hover:bg-purple-700/30' 
                      : 'border-purple-200 bg-purple-50/50 hover:bg-purple-100/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-medium ${
                      isDarkMode ? 'text-purple-300' : 'text-purple-600'
                    }`}>
                      Recording {index + 1}
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className={`w-6 h-6 p-0 transition-colors ${
                          playingRecordingId === recording.id
                            ? isDarkMode ? 'bg-purple-600 text-white' : 'bg-purple-500 text-white'
                            : isDarkMode ? 'hover:bg-purple-700/50' : 'hover:bg-purple-100'
                        }`}
                        onClick={() => playRecording(recording)}
                        data-no-drag
                      >
                        <Play className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className={`w-6 h-6 p-0 transition-colors ${
                          isDarkMode ? 'hover:bg-purple-700/50' : 'hover:bg-purple-100'
                        }`}
                        onClick={() => downloadRecording(recording, index)}
                        data-no-drag
                      >
                        <Download className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className={`w-6 h-6 p-0 transition-colors ${
                          isDarkMode 
                            ? 'text-red-400 hover:text-red-300 hover:bg-red-500/20' 
                            : 'text-red-500 hover:text-red-600 hover:bg-red-50'
                        }`}
                        onClick={() => onDeleteRecording(node.id, recording.id)}
                        data-no-drag
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className={`text-xs mb-1 ${
                    isDarkMode ? 'text-purple-400' : 'text-purple-500'
                  }`}>
                    Duration: {formatDuration(recording.duration)}
                  </div>
                  {recording.transcript && (
                    <div className={`text-xs p-2 rounded border ${
                      isDarkMode 
                        ? 'bg-purple-900/30 border-purple-600/20 text-purple-200' 
                        : 'bg-white/50 border-purple-200/50 text-purple-700'
                    }`}>
                      {recording.transcript}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
