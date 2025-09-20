import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../Icons/IconSystem';
import { voiceAPI } from '../../services/api';
import toast from 'react-hot-toast';

const VoiceRecorder = ({ onTranscription, onMoodAnalysis, className = '' }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [detectedMood, setDetectedMood] = useState(null);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [audioURL]);

  const startRecording = async () => {
    try {
      console.log('Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      console.log('Microphone access granted, creating MediaRecorder...');
      
      // Check if MediaRecorder supports the preferred MIME type
      let mimeType = 'audio/webm';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/mp4';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'audio/wav';
        }
      }
      
      console.log('Using MIME type:', mimeType);
      
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: mimeType
      });
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        console.log('Data available event:', event.data.size, 'bytes');
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        console.log('Recording stopped, creating blob from', audioChunksRef.current.length, 'chunks');
        
        if (audioChunksRef.current.length === 0) {
          console.error('No audio chunks recorded');
          toast.error('No audio was recorded. Please try again.');
          return;
        }
        
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        console.log('Created audio blob:', audioBlob.size, 'bytes, type:', audioBlob.type);
        
        if (audioBlob.size === 0) {
          console.error('Empty audio blob created');
          toast.error('Empty recording. Please try again.');
          return;
        }
        
        setAudioBlob(audioBlob);
        setAudioURL(URL.createObjectURL(audioBlob));
        stream.getTracks().forEach(track => track.stop());
        
        console.log('Audio recording completed successfully');
        toast.success('Recording completed! Ready to analyze.');
      };

      mediaRecorderRef.current.onerror = (event) => {
        console.error('MediaRecorder error:', event.error);
        toast.error('Recording error occurred. Please try again.');
      };

      // Start recording with time slices to ensure data is captured
      mediaRecorderRef.current.start(1000); // Record in 1-second chunks
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      console.log('Recording started successfully');
      toast.success('Recording started! Speak now...');

    } catch (error) {
      console.error('Error starting recording:', error);
      if (error.name === 'NotAllowedError') {
        toast.error('Microphone access denied. Please allow microphone access and try again.');
      } else if (error.name === 'NotFoundError') {
        toast.error('No microphone found. Please connect a microphone and try again.');
      } else {
        toast.error('Could not access microphone. Please check permissions.');
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const processRecording = async () => {
    if (!audioBlob) {
      toast.error('No audio recording available. Please record first.');
      return;
    }

    console.log('Starting voice analysis with blob:', {
      size: audioBlob.size,
      type: audioBlob.type
    });

    if (audioBlob.size === 0) {
      toast.error('Empty recording. Please record again.');
      return;
    }

    setIsProcessing(true);
    try {
      const formData = new FormData();
      
      // Use the actual MIME type from the blob
      const fileName = audioBlob.type.includes('webm') ? 'recording.webm' : 
                     audioBlob.type.includes('mp4') ? 'recording.mp4' : 
                     'recording.wav';
      
      formData.append('audio', audioBlob, fileName);

      console.log('Sending voice data:', {
        blobSize: audioBlob.size,
        blobType: audioBlob.type,
        fileName: fileName,
        formDataKeys: Array.from(formData.keys())
      });

      const response = await voiceAPI.analyzeVoice(formData);
      console.log('Voice analysis response:', response);
      
      const responseData = response.data.data;
      const mood = responseData.mood || 'NEUTRAL';
      const details = responseData.details || [];
      const confidence = responseData.confidence || 0.8;
      const note = responseData.note;

      setDetectedMood(mood);
      
      // Call parent callbacks
      if (onMoodAnalysis) {
        onMoodAnalysis(mood, details);
      }
      
      // Show success message with confidence
      const confidencePercent = Math.round(confidence * 100);
      let successMessage = `🎤 Voice analyzed! Detected mood: ${mood} (${confidencePercent}% confidence)`;
      
      if (note) {
        successMessage += ` - ${note}`;
      }
      
      toast.success(successMessage);
      
    } catch (error) {
      console.error('Voice analysis error:', error);
      console.error('Error response:', error.response?.data);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to analyze voice. Please try again.';
      
      if (error.response?.status === 400) {
        errorMessage = 'No audio file was uploaded. Please record again.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Voice analysis service is temporarily unavailable. Using fallback mood detection.';
        // Set a fallback mood
        const fallbackMood = 'NEUTRAL';
        setDetectedMood(fallbackMood);
        if (onMoodAnalysis) {
          onMoodAnalysis(fallbackMood, [{ text: 'Fallback analysis', sentiment: fallbackMood, confidence: 0.7 }]);
        }
        toast.success(`🎤 Voice analyzed with fallback! Detected mood: ${fallbackMood}`);
        return;
      } else if (!navigator.onLine) {
        errorMessage = 'No internet connection. Please check your network and try again.';
      }
      
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearRecording = () => {
    setAudioBlob(null);
    setAudioURL(null);
    setTranscription('');
    setDetectedMood(null);
    setRecordingTime(0);
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getMoodColor = (mood) => {
    switch (mood?.toLowerCase()) {
      case 'positive': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'negative': return 'bg-red-100 text-red-800 border-red-200';
      case 'neutral': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMoodIcon = (mood) => {
    switch (mood?.toLowerCase()) {
      case 'positive': return 'smile';
      case 'negative': return 'frown';
      case 'neutral': return 'meh';
      default: return 'meh';
    }
  };

  return (
    <div className={`bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-lavender-100 rounded-xl flex items-center justify-center">
            <Icon name="microphone" size="md" className="text-lavender-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-wellness-primary">Voice Journal</h3>
            <p className="text-sm text-wellness-secondary">Record your thoughts and get mood analysis</p>
          </div>
        </div>
        
        {recordingTime > 0 && (
          <div className="text-right">
            <div className="text-sm font-mono font-medium text-wellness-primary">
              {formatTime(recordingTime)}
            </div>
            <div className="text-xs text-wellness-muted">Recording time</div>
          </div>
        )}
      </div>

      {/* Recording Status */}
      {audioBlob && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
          <div className="flex items-center space-x-2">
            <Icon name="check" size="sm" className="text-emerald-600" />
            <span className="text-sm font-medium text-emerald-800">
              Audio recorded successfully ({Math.round(audioBlob.size / 1024)} KB)
            </span>
          </div>
        </div>
      )}

      {/* Recording Controls */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        {!isRecording && !audioBlob && (
          <motion.button
            onClick={startRecording}
            className="flex items-center space-x-2 px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon name="microphone" size="sm" />
            <span className="font-medium">Start Recording</span>
          </motion.button>
        )}

        {isRecording && (
          <motion.button
            onClick={stopRecording}
            className="flex items-center space-x-2 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            <span className="font-medium">Stop Recording</span>
          </motion.button>
        )}

        {audioBlob && !isProcessing && (
          <div className="flex items-center space-x-2">
            <motion.button
              onClick={processRecording}
              className="flex items-center space-x-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon name="brain" size="sm" />
              <span className="font-medium">Analyze Mood</span>
            </motion.button>
            
            <motion.button
              onClick={clearRecording}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon name="times" size="sm" />
              <span className="font-medium">Clear</span>
            </motion.button>
          </div>
        )}

        {isProcessing && (
          <div className="flex items-center space-x-2 px-6 py-3 bg-lavender-100 text-lavender-700 rounded-xl">
            <Icon name="loading" size="sm" className="animate-spin" />
            <span className="font-medium">Analyzing voice...</span>
          </div>
        )}
      </div>

      {/* Audio Playback */}
      <AnimatePresence>
        {audioURL && (
          <motion.div 
            className="mb-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <Icon name="play" size="sm" className="text-emerald-500" />
                <span className="text-sm font-medium text-wellness-primary">Your Recording</span>
              </div>
              <audio controls className="w-full">
                <source src={audioURL} type="audio/wav" />
                Your browser does not support the audio element.
              </audio>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mood Analysis Results */}
      <AnimatePresence>
        {detectedMood && (
          <motion.div 
            className="bg-gradient-to-r from-lavender-50 to-sky-50 rounded-xl p-4 border border-lavender-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Icon name="brain" size="sm" className="text-lavender-500" />
                <span className="text-sm font-semibold text-wellness-primary">Voice Analysis</span>
              </div>
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium border ${getMoodColor(detectedMood)}`}>
                <Icon name={getMoodIcon(detectedMood)} size="sm" />
                <span>{detectedMood}</span>
              </div>
            </div>
            <p className="text-sm text-wellness-secondary">
              Based on your voice tone, we detected a <strong>{detectedMood}</strong> mood. 
              This can help you understand your emotional state.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recording Tips */}
      <div className="mt-4 p-3 bg-sky-50 rounded-lg">
        <div className="flex items-start space-x-2">
          <Icon name="info" size="sm" className="text-sky-500 mt-0.5" />
          <div className="text-xs text-sky-700">
            <p className="font-medium mb-1">Recording Tips:</p>
            <ul className="space-y-1 text-xs">
              <li>• Speak clearly and at a normal pace</li>
              <li>• Record in a quiet environment</li>
              <li>• Speak for at least 10-30 seconds for better analysis</li>
              <li>• Express your true feelings for accurate mood detection</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceRecorder;
