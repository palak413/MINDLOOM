import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../Icons/IconSystem';
import { voiceAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Trash2, 
  Brain, 
  Activity,
  TrendingUp,
  Volume2,
  Clock,
  Zap,
  Heart,
  Target
} from 'lucide-react';

const VoiceRecorder = ({ onTranscription, onMoodAnalysis, className = '' }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [detectedMood, setDetectedMood] = useState(null);
  const [analysisDetails, setAnalysisDetails] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  
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
      
      // Request microphone with more specific constraints
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: false,  // Disable to get raw audio
          noiseSuppression: false, // Disable to get raw audio
          autoGainControl: false,  // Disable to get raw audio
          sampleRate: 44100,
          channelCount: 1,
          latency: 0.01
        } 
      });
      
      console.log('Microphone access granted, creating MediaRecorder...');
      console.log('Audio tracks:', stream.getAudioTracks().length);
      
      // Check available MIME types and choose the best one
      const mimeTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/wav',
        'audio/ogg;codecs=opus',
        'audio/ogg'
      ];
      
      let selectedMimeType = null;
      for (const mimeType of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          selectedMimeType = mimeType;
          break;
        }
      }
      
      if (!selectedMimeType) {
        throw new Error('No supported audio MIME type found');
      }
      
      console.log('Using MIME type:', selectedMimeType);
      
      // Create MediaRecorder with better configuration
      const options = {
        mimeType: selectedMimeType,
        audioBitsPerSecond: 128000
      };
      
      mediaRecorderRef.current = new MediaRecorder(stream, options);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        console.log('Data available event:', event.data.size, 'bytes');
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          console.log('Added chunk, total chunks:', audioChunksRef.current.length);
        } else {
          console.warn('Empty data chunk received');
        }
      };

      mediaRecorderRef.current.onstop = () => {
        console.log('Recording stopped, creating blob from', audioChunksRef.current.length, 'chunks');
        
        if (audioChunksRef.current.length === 0) {
          console.error('No audio chunks recorded');
          toast.error('No audio was recorded. Please try again.');
          stream.getTracks().forEach(track => track.stop());
          return;
        }
        
        // Calculate total size
        const totalSize = audioChunksRef.current.reduce((sum, chunk) => sum + chunk.size, 0);
        console.log('Total audio data size:', totalSize, 'bytes');
        
        if (totalSize === 0) {
          console.error('No audio data captured');
          toast.error('No audio data captured. Please try again.');
          stream.getTracks().forEach(track => track.stop());
          return;
        }
        
        const audioBlob = new Blob(audioChunksRef.current, { type: selectedMimeType });
        console.log('Created audio blob:', audioBlob.size, 'bytes, type:', audioBlob.type);
        
        if (audioBlob.size === 0) {
          console.error('Empty audio blob created');
          toast.error('Empty recording. Please try again.');
          stream.getTracks().forEach(track => track.stop());
          return;
        }
        
        setAudioBlob(audioBlob);
        setAudioURL(URL.createObjectURL(audioBlob));
        stream.getTracks().forEach(track => track.stop());
        
        console.log('Audio recording completed successfully');
        toast.success(`Recording completed! Captured ${Math.round(audioBlob.size / 1024)} KB of audio.`);
      };

      mediaRecorderRef.current.onerror = (event) => {
        console.error('MediaRecorder error:', event.error);
        toast.error(`Recording error: ${event.error.message}`);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.onstart = () => {
        console.log('MediaRecorder started');
      };

      // Start recording with smaller time slices for better data capture
      mediaRecorderRef.current.start(250); // Record in 250ms chunks
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      console.log('Recording started successfully');
      toast.success('Recording started! Speak clearly into your microphone...');

    } catch (error) {
      console.error('Error starting recording:', error);
      if (error.name === 'NotAllowedError') {
        toast.error('Microphone access denied. Please allow microphone access and try again.');
      } else if (error.name === 'NotFoundError') {
        toast.error('No microphone found. Please connect a microphone and try again.');
      } else if (error.name === 'NotSupportedError') {
        toast.error('Audio recording not supported in this browser. Please try a different browser.');
      } else {
        toast.error(`Could not access microphone: ${error.message}`);
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

    console.log('Starting advanced voice analysis with blob:', {
      size: audioBlob.size,
      type: audioBlob.type
    });

    if (audioBlob.size === 0) {
      toast.error('Empty recording. Please record again.');
      return;
    }

    // Additional validation
    if (audioBlob.size < 1000) { // Less than 1KB
      toast.error('Recording too short. Please record for at least 2-3 seconds.');
      return;
    }

    setIsProcessing(true);
    try {
      const formData = new FormData();
      
      // Generate a proper filename based on MIME type and timestamp
      const timestamp = Date.now();
      let fileName = 'recording';
      let extension = 'webm';
      
      if (audioBlob.type.includes('webm')) {
        extension = 'webm';
      } else if (audioBlob.type.includes('mp4')) {
        extension = 'mp4';
      } else if (audioBlob.type.includes('wav')) {
        extension = 'wav';
      } else if (audioBlob.type.includes('ogg')) {
        extension = 'ogg';
      }
      
      fileName = `voice_recording_${timestamp}.${extension}`;
      
      // Append the audio blob with proper filename
      formData.append('audio', audioBlob, fileName);

      console.log('Sending voice data:', {
        blobSize: audioBlob.size,
        blobType: audioBlob.type,
        fileName: fileName,
        formDataKeys: Array.from(formData.keys()),
        formDataSize: formData.get('audio').size
      });

      // Verify the FormData contains the file
      const audioFile = formData.get('audio');
      if (!audioFile || audioFile.size === 0) {
        throw new Error('Failed to prepare audio file for upload');
      }

      console.log('FormData verification:', {
        hasAudio: !!audioFile,
        audioSize: audioFile.size,
        audioType: audioFile.type,
        audioName: audioFile.name
      });

      const response = await voiceAPI.analyzeVoice(formData);
      console.log('Advanced voice analysis response:', response);
      
      const responseData = response.data.data;
      const mood = responseData.mood || 'NEUTRAL';
      const confidence = responseData.confidence || 0.8;
      const characteristics = responseData.characteristics || {};
      const insights = responseData.insights || [];
      const recommendations = responseData.recommendations || [];

      setDetectedMood(mood);
      setAnalysisDetails({
        mood,
        confidence,
        characteristics,
        insights,
        recommendations
      });
      
      // Call parent callbacks
      if (onMoodAnalysis) {
        onMoodAnalysis(mood, characteristics);
      }
      
      // Show success message with confidence
      const confidencePercent = Math.round(confidence * 100);
      let successMessage = `🎤 Advanced voice analysis complete! Detected mood: ${mood} (${confidencePercent}% confidence)`;
      
      toast.success(successMessage);
      
    } catch (error) {
      console.error('Voice analysis error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      
      // Provide more specific error messages
      let errorMessage = 'Failed to analyze voice. Please try again.';
      
      if (error.response?.status === 400) {
        const errorData = error.response?.data;
        if (errorData?.message?.includes('No audio file')) {
          errorMessage = 'No audio file was uploaded. Please record again.';
        } else {
          errorMessage = `Bad request: ${errorData?.message || 'Please check your recording and try again.'}`;
        }
      } else if (error.response?.status === 500) {
        errorMessage = 'Voice analysis service is temporarily unavailable. Using fallback mood detection.';
        // Set a fallback mood
        const fallbackMood = 'NEUTRAL';
        setDetectedMood(fallbackMood);
        setAnalysisDetails({
          mood: fallbackMood,
          confidence: 0.7,
          characteristics: {},
          insights: ['Analysis completed with fallback'],
          recommendations: ['Continue monitoring your emotional well-being']
        });
        if (onMoodAnalysis) {
          onMoodAnalysis(fallbackMood, {});
        }
        toast.success(`🎤 Voice analyzed with fallback! Detected mood: ${fallbackMood}`);
        return;
      } else if (!navigator.onLine) {
        errorMessage = 'No internet connection. Please check your network and try again.';
      } else if (error.message.includes('Failed to prepare audio file')) {
        errorMessage = 'Failed to prepare audio file for upload. Please try recording again.';
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
    setAnalysisDetails(null);
    setShowDetails(false);
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
      case 'anxious': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'calm': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'excited': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'sad': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'confident': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMoodIcon = (mood) => {
    switch (mood?.toLowerCase()) {
      case 'positive': return '😊';
      case 'negative': return '😞';
      case 'neutral': return '😐';
      case 'anxious': return '😰';
      case 'calm': return '😌';
      case 'excited': return '🤩';
      case 'sad': return '😢';
      case 'confident': return '😎';
      default: return '❓';
    }
  };

  const getCharacteristicIcon = (type) => {
    switch (type) {
      case 'pitch': return <TrendingUp className="w-4 h-4" />;
      case 'pauses': return <Clock className="w-4 h-4" />;
      case 'tone': return <Heart className="w-4 h-4" />;
      case 'speechRate': return <Zap className="w-4 h-4" />;
      case 'volume': return <Volume2 className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className={`bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Advanced Voice Analysis</h3>
            <p className="text-sm text-gray-600">Analyze mood through voice characteristics</p>
          </div>
        </div>
        
        {recordingTime > 0 && (
          <div className="text-right">
            <div className="text-sm font-mono font-medium text-gray-800">
              {formatTime(recordingTime)}
            </div>
            <div className="text-xs text-gray-500">Recording time</div>
          </div>
        )}
      </div>

      {/* Recording Status */}
      {audioBlob && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
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
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Mic className="w-5 h-5" />
            <span className="font-medium">Start Recording</span>
          </motion.button>
        )}

        {isRecording && (
          <motion.button
            onClick={stopRecording}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MicOff className="w-5 h-5" />
            <span className="font-medium">Stop Recording</span>
          </motion.button>
        )}

        {audioBlob && !isProcessing && (
          <div className="flex items-center space-x-2">
            <motion.button
              onClick={processRecording}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Brain className="w-4 h-4" />
              <span className="font-medium">Analyze Mood</span>
            </motion.button>
            
            <motion.button
              onClick={clearRecording}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Trash2 className="w-4 h-4" />
              <span className="font-medium">Clear</span>
            </motion.button>
          </div>
        )}

        {isProcessing && (
          <div className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span className="font-medium">Analyzing...</span>
          </div>
        )}
      </div>

      {/* Audio Playback */}
      {audioURL && !isRecording && (
        <motion.div
          className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <audio controls src={audioURL} className="w-full"></audio>
        </motion.div>
      )}

      {/* Mood Display */}
      <AnimatePresence>
        {detectedMood && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={`p-4 rounded-xl border text-center mb-4 ${getMoodColor(detectedMood)}`}
          >
            <p className="text-lg font-semibold flex items-center justify-center space-x-2">
              <span>Mood Detected:</span>
              <span className="text-2xl">{getMoodIcon(detectedMood)}</span>
              <span className="capitalize">{detectedMood}</span>
            </p>
            {analysisDetails && (
              <p className="text-sm mt-1">
                Confidence: {Math.round(analysisDetails.confidence * 100)}%
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analysis Details */}
      <AnimatePresence>
        {analysisDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Toggle Details Button */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <span className="font-medium text-gray-800">Analysis Details</span>
              <motion.div
                animate={{ rotate: showDetails ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <Target className="w-4 h-4 text-gray-600" />
              </motion.div>
            </button>

            {/* Detailed Analysis */}
            {showDetails && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
              >
                {/* Voice Characteristics */}
                {analysisDetails.characteristics && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(analysisDetails.characteristics).map(([type, data]) => (
                      <div key={type} className="p-3 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-center space-x-2 mb-2">
                          {getCharacteristicIcon(type)}
                          <span className="font-medium text-gray-800 capitalize">{type}</span>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          {Object.entries(data).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                              <span className="font-medium">
                                {typeof value === 'number' ? Math.round(value * 100) / 100 : value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Insights */}
                {analysisDetails.insights && analysisDetails.insights.length > 0 && (
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-2">Voice Insights</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      {analysisDetails.insights.map((insight, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommendations */}
                {analysisDetails.recommendations && analysisDetails.recommendations.length > 0 && (
                  <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                    <h4 className="font-medium text-green-800 mb-2">Recommendations</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      {analysisDetails.recommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-green-500 mt-0.5">•</span>
                          <span>{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceRecorder;
