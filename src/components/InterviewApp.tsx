import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Pause, Square, Mic, Video, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ConversationEntry {
  id: string;
  type: 'bot' | 'user';
  timestamp: Date;
  audioBlob?: Blob;
  videoBlob?: Blob;
  audioUrl?: string;
  videoUrl?: string;
  transcript?: string;
}

type InterviewState = 'idle' | 'starting' | 'listening' | 'recording' | 'uploading' | 'waiting';

const InterviewApp: React.FC = () => {
  const { toast } = useToast();
  
  // State management
  const [state, setState] = useState<InterviewState>('idle');
  const [conversation, setConversation] = useState<ConversationEntry[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [currentBotAudio, setCurrentBotAudio] = useState<string | null>(null);

  // Refs for media handling
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioPlayerRef = useRef<HTMLAudioElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Recording chunks
  const audioChunksRef = useRef<Blob[]>([]);
  const videoChunksRef = useRef<Blob[]>([]);

  // Initialize media stream
  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: { facingMode: 'user', width: 640, height: 480 }
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      return true;
    } catch (error) {
      console.error('Error accessing media:', error);
      toast({
        title: "Media Access Error",
        description: "Please allow camera and microphone access to continue.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Start interview
  const startInterview = async () => {
    setState('starting');
    
    try {
      const response = await fetch('/api/start_interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to start interview');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const botEntry: ConversationEntry = {
        id: `bot-${Date.now()}`,
        type: 'bot',
        timestamp: new Date(),
        audioBlob,
        audioUrl,
        transcript: "Welcome! Let's begin your interview."
      };

      setConversation([botEntry]);
      setCurrentBotAudio(audioUrl);
      setState('listening');
      
      // Auto-play bot response
      if (audioPlayerRef.current) {
        audioPlayerRef.current.src = audioUrl;
        audioPlayerRef.current.play();
      }

      // Initialize media after successful start
      await initializeMedia();

      toast({
        title: "Interview Started",
        description: "Listen to the question and click record when ready to answer."
      });

    } catch (error) {
      console.error('Error starting interview:', error);
      toast({
        title: "Error",
        description: "Failed to start interview. Please try again.",
        variant: "destructive"
      });
      setState('idle');
    }
  };

  // Start recording
  const startRecording = async () => {
    if (!streamRef.current) {
      const success = await initializeMedia();
      if (!success) return;
    }

    setIsRecording(true);
    setState('recording');
    setRecordingTime(0);
    audioChunksRef.current = [];
    videoChunksRef.current = [];

    // Create separate recorders for audio and video
    const audioStream = new MediaStream(streamRef.current!.getAudioTracks());
    const videoStream = streamRef.current!;

    const audioRecorder = new MediaRecorder(audioStream, {
      mimeType: 'audio/webm;codecs=opus'
    });
    
    const videoRecorder = new MediaRecorder(videoStream, {
      mimeType: 'video/webm;codecs=vp8,opus'
    });

    audioRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    videoRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        videoChunksRef.current.push(event.data);
      }
    };

    mediaRecorderRef.current = audioRecorder; // Store audio recorder as primary
    audioRecorder.start(1000);
    videoRecorder.start(1000);

    // Start timer
    recordingTimerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);

    toast({
      title: "Recording Started",
      description: "Speak clearly and maintain eye contact with the camera."
    });
  };

  // Stop recording
  const stopRecording = () => {
    setIsRecording(false);
    setState('uploading');
    
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }

    // Process and upload after a short delay to ensure all data is collected
    setTimeout(async () => {
      await processAndUploadRecording();
    }, 500);
  };

  // Process and upload recording
  const processAndUploadRecording = async () => {
    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      const videoBlob = new Blob(videoChunksRef.current, { type: 'video/mp4' });

      const formData = new FormData();
      formData.append('audio', audioBlob, 'answer.wav');
      formData.append('video', videoBlob, 'answer.mp4');

      const response = await fetch('/api/submit_answer', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to submit answer');
      }

      // Add user's response to conversation
      const userEntry: ConversationEntry = {
        id: `user-${Date.now()}`,
        type: 'user',
        timestamp: new Date(),
        audioBlob,
        videoBlob,
        audioUrl: URL.createObjectURL(audioBlob),
        videoUrl: URL.createObjectURL(videoBlob)
      };

      // Get bot's next question
      const botAudioBlob = await response.blob();
      const botAudioUrl = URL.createObjectURL(botAudioBlob);
      
      const botEntry: ConversationEntry = {
        id: `bot-${Date.now()}`,
        type: 'bot',
        timestamp: new Date(),
        audioBlob: botAudioBlob,
        audioUrl: botAudioUrl,
        transcript: "Thank you for your answer. Here's the next question..."
      };

      setConversation(prev => [...prev, userEntry, botEntry]);
      setCurrentBotAudio(botAudioUrl);
      setState('listening');

      // Auto-play next question
      if (audioPlayerRef.current) {
        audioPlayerRef.current.src = botAudioUrl;
        audioPlayerRef.current.play();
      }

      toast({
        title: "Answer Submitted",
        description: "Listen to the next question."
      });

    } catch (error) {
      console.error('Error submitting answer:', error);
      toast({
        title: "Upload Error",
        description: "Failed to submit your answer. Please try again.",
        variant: "destructive"
      });
      setState('listening');
    }
  };

  // Format recording time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, []);

  const getStateMessage = () => {
    switch (state) {
      case 'idle':
        return 'Ready to start your interview';
      case 'starting':
        return 'Connecting to interviewer...';
      case 'listening':
        return 'Listen to the question, then record your answer';
      case 'recording':
        return `Recording your answer... ${formatTime(recordingTime)}`;
      case 'uploading':
        return 'Processing your answer...';
      case 'waiting':
        return 'Waiting for next question...';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent to-background p-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-screen">
          {/* Main Interview Panel */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Header */}
            <Card className="p-6 shadow-card">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">AI Interview</h1>
                  <p className="text-muted-foreground mt-1">Professional Video Interview Platform</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    state === 'idle' ? 'bg-muted' : 
                    state === 'recording' ? 'bg-recording animate-pulse' :
                    'bg-success'
                  }`} />
                  <span className="text-sm font-medium">{getStateMessage()}</span>
                </div>
              </div>
            </Card>

            {/* Video Preview */}
            <Card className="flex-1 p-6 shadow-card">
              <div className="relative w-full h-full min-h-96 bg-muted rounded-lg overflow-hidden">
                {state !== 'idle' ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>Your video will appear here</p>
                    </div>
                  </div>
                )}
                
                {/* Recording indicator */}
                {isRecording && (
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-recording text-recording-foreground px-3 py-1 rounded-full shadow-recording">
                    <div className="w-2 h-2 bg-recording-foreground rounded-full animate-pulse" />
                    <span className="text-sm font-medium">REC {formatTime(recordingTime)}</span>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4 mt-6">
                {state === 'idle' && (
                  <Button 
                    onClick={startInterview}
                    size="lg"
                    className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-interview transition-all duration-300"
                  >
                    Start Interview
                  </Button>
                )}

                {state === 'listening' && (
                  <Button
                    onClick={startRecording}
                    size="lg"
                    variant="outline"
                    className="border-recording text-recording hover:bg-recording hover:text-recording-foreground"
                  >
                    <Mic className="w-5 h-5 mr-2" />
                    Record Answer
                  </Button>
                )}

                {state === 'recording' && (
                  <Button
                    onClick={stopRecording}
                    size="lg"
                    className="bg-recording hover:bg-recording/90"
                  >
                    <Square className="w-5 h-5 mr-2" />
                    Stop Recording
                  </Button>
                )}

                {(state === 'uploading' || state === 'starting') && (
                  <Button size="lg" disabled>
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Processing...
                  </Button>
                )}
              </div>
            </Card>

            {/* Audio Player for Bot Questions */}
            {currentBotAudio && (
              <Card className="p-4 shadow-card">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    Current Question
                  </div>
                  <audio
                    ref={audioPlayerRef}
                    controls
                    className="flex-1"
                    src={currentBotAudio}
                  />
                </div>
              </Card>
            )}
          </div>

          {/* Conversation History */}
          <div className="lg:col-span-1">
            <Card className="h-full p-6 shadow-card">
              <h2 className="text-xl font-semibold mb-4">Interview Progress</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {conversation.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No conversation yet. Start your interview to begin.
                  </p>
                ) : (
                  conversation.map((entry) => (
                    <div
                      key={entry.id}
                      className={`p-4 rounded-lg ${
                        entry.type === 'bot' 
                          ? 'bg-accent border-l-4 border-primary' 
                          : 'bg-muted border-l-4 border-recording'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-2 h-2 rounded-full ${
                          entry.type === 'bot' ? 'bg-primary' : 'bg-recording'
                        }`} />
                        <span className="text-sm font-medium">
                          {entry.type === 'bot' ? 'Interviewer' : 'You'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {entry.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      
                      {entry.transcript && (
                        <p className="text-sm mb-2">{entry.transcript}</p>
                      )}
                      
                      {entry.audioUrl && (
                        <audio controls className="w-full mb-2" src={entry.audioUrl} />
                      )}
                      
                      {entry.videoUrl && entry.type === 'user' && (
                        <video 
                          controls 
                          className="w-full rounded" 
                          src={entry.videoUrl}
                          style={{ maxHeight: '120px' }}
                        />
                      )}
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewApp;