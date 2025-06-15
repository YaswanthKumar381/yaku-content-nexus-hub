
import React, { useState } from 'react';
import { AudioNode } from '@/types/canvas';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTheme } from '@/contexts/ThemeContext';
import { useAudioRecording } from '@/hooks/useAudioRecording';
import { Mic, Square, Play, Trash2, Download, FileAudio } from 'lucide-react';
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
      <Card className={`w-80 ${isDarkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-gray-200'} shadow-lg`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-3 border-b ${isDarkMode ? 'border-zinc-700' : 'border-gray-200'}`}>
          <div className="flex items-center gap-2">
            <FileAudio className="w-4 h-4" />
            <span className="text-sm font-medium">Audio Node</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              className="w-6 h-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onStartConnection(node.id);
              }}
              data-no-drag
            >
              <div className={`w-3 h-3 rounded-full border-2 ${isConnected ? 'bg-green-500 border-green-500' : isDarkMode ? 'border-zinc-400' : 'border-gray-400'}`} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="w-6 h-6 p-0 text-red-500 hover:text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(node.id);
              }}
              data-no-drag
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Recording Controls */}
        <div className="p-4">
          <div className="flex items-center justify-center gap-4 mb-4">
            {!isRecording ? (
              <Button
                onClick={handleStartRecording}
                disabled={!isSupported || isTranscribing}
                className="flex items-center gap-2"
                data-no-drag
              >
                <Mic className="w-4 h-4" />
                Start Recording
              </Button>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-sm">{formatDuration(recordingDuration)}</span>
                </div>
                <Button
                  onClick={handleStopRecording}
                  variant="destructive"
                  className="flex items-center gap-2"
                  data-no-drag
                >
                  <Square className="w-4 h-4" />
                  Stop
                </Button>
              </div>
            )}
          </div>

          {isTranscribing && (
            <div className="text-center text-sm text-gray-500 mb-4">
              Transcribing audio...
            </div>
          )}

          {/* Recordings List */}
          {node.recordings.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Recordings</h4>
              {node.recordings.map((recording, index) => (
                <div
                  key={recording.id}
                  className={`p-2 rounded border ${isDarkMode ? 'border-zinc-600 bg-zinc-700' : 'border-gray-200 bg-gray-50'}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs">Recording {index + 1}</span>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-6 h-6 p-0"
                        onClick={() => playRecording(recording)}
                        data-no-drag
                      >
                        <Play className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-6 h-6 p-0"
                        onClick={() => downloadRecording(recording, index)}
                        data-no-drag
                      >
                        <Download className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-6 h-6 p-0 text-red-500"
                        onClick={() => onDeleteRecording(node.id, recording.id)}
                        data-no-drag
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    Duration: {formatDuration(recording.duration)}
                  </div>
                  {recording.transcript && (
                    <div className="text-xs mt-1 p-1 bg-opacity-50 rounded">
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
