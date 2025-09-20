#!/usr/bin/env python3
"""
Advanced Voice Analysis Script
Analyzes voice characteristics for mood detection
"""

import librosa
import numpy as np
import json
import sys
import os
from scipy import signal
from scipy.stats import skew, kurtosis

def analyze_voice_characteristics(audio_file):
    """
    Analyze voice characteristics from audio file
    """
    try:
        # Load audio file
        y, sr = librosa.load(audio_file, sr=22050)
        
        # Basic audio properties
        duration = len(y) / sr
        
        # Pitch analysis (Fundamental Frequency)
        pitches, magnitudes = librosa.piptrack(y=y, sr=sr)
        pitch_values = []
        for t in range(pitches.shape[1]):
            index = magnitudes[:, t].argmax()
            pitch = pitches[index, t]
            if pitch > 0:
                pitch_values.append(pitch)
        
        avg_pitch = np.mean(pitch_values) if pitch_values else 0
        pitch_std = np.std(pitch_values) if pitch_values else 0
        pitch_range = np.max(pitch_values) - np.min(pitch_values) if pitch_values else 0
        
        # Spectral features
        spectral_centroids = librosa.feature.spectral_centroid(y=y, sr=sr)[0]
        spectral_rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)[0]
        mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
        
        # Rhythm and tempo
        tempo, beats = librosa.beat.beat_track(y=y, sr=sr)
        
        # Voice activity detection (simple energy-based)
        frame_length = 2048
        hop_length = 512
        energy = librosa.feature.rms(y=y, frame_length=frame_length, hop_length=hop_length)[0]
        
        # Detect pauses (low energy regions)
        energy_threshold = np.mean(energy) * 0.3
        pauses = energy < energy_threshold
        pause_segments = []
        in_pause = False
        pause_start = 0
        
        for i, is_pause in enumerate(pauses):
            if is_pause and not in_pause:
                pause_start = i
                in_pause = True
            elif not is_pause and in_pause:
                pause_length = (i - pause_start) * hop_length / sr
                if pause_length > 0.1:  # Only count pauses longer than 100ms
                    pause_segments.append(pause_length)
                in_pause = False
        
        # Speech rate estimation
        words_per_minute = len(beats) * 60 / duration if duration > 0 else 0
        
        # Volume analysis
        rms_energy = librosa.feature.rms(y=y)[0]
        avg_volume = np.mean(rms_energy)
        volume_std = np.std(rms_energy)
        
        # Zero crossing rate (voice quality indicator)
        zcr = librosa.feature.zero_crossing_rate(y)[0]
        avg_zcr = np.mean(zcr)
        
        # Spectral features
        avg_spectral_centroid = np.mean(spectral_centroids)
        avg_spectral_rolloff = np.mean(spectral_rolloff)
        
        # MFCC features (voice timbre)
        avg_mfccs = np.mean(mfccs, axis=1)
        
        # Voice characteristics analysis
        characteristics = {
            'pitch': {
                'average_pitch': float(avg_pitch),
                'pitch_std': float(pitch_std),
                'pitch_range': float(pitch_range),
                'pitch_stability': float(1 - (pitch_std / avg_pitch)) if avg_pitch > 0 else 0
            },
            'pauses': {
                'total_pauses': len(pause_segments),
                'average_pause_length': float(np.mean(pause_segments)) if pause_segments else 0,
                'longest_pause': float(np.max(pause_segments)) if pause_segments else 0,
                'pause_frequency': len(pause_segments) / duration if duration > 0 else 0
            },
            'speech_rate': {
                'words_per_minute': float(words_per_minute),
                'tempo': float(tempo),
                'speech_rhythm': 'rapid' if words_per_minute > 160 else 'slow' if words_per_minute < 140 else 'normal'
            },
            'volume': {
                'average_volume': float(avg_volume),
                'volume_std': float(volume_std),
                'volume_consistency': float(1 - (volume_std / avg_volume)) if avg_volume > 0 else 0,
                'energy_level': float(avg_volume / np.max(rms_energy)) if np.max(rms_energy) > 0 else 0
            },
            'tone': {
                'spectral_centroid': float(avg_spectral_centroid),
                'spectral_rolloff': float(avg_spectral_rolloff),
                'zero_crossing_rate': float(avg_zcr),
                'voice_quality': 'clear' if avg_zcr < 0.1 else 'rough' if avg_zcr > 0.2 else 'normal'
            },
            'audio_properties': {
                'duration': float(duration),
                'sample_rate': int(sr),
                'file_size': os.path.getsize(audio_file) if os.path.exists(audio_file) else 0
            }
        }
        
        return characteristics
        
    except Exception as e:
        print(f"Error analyzing audio: {str(e)}", file=sys.stderr)
        return None

def determine_mood_from_characteristics(characteristics):
    """
    Determine mood based on voice characteristics
    """
    if not characteristics:
        return {
            'mood': 'NEUTRAL',
            'confidence': 0.5,
            'reasoning': 'Unable to analyze audio characteristics'
        }
    
    pitch = characteristics['pitch']
    pauses = characteristics['pauses']
    speech_rate = characteristics['speech_rate']
    volume = characteristics['volume']
    tone = characteristics['tone']
    
    # Mood scoring system
    mood_scores = {
        'POSITIVE': 0,
        'NEUTRAL': 0,
        'NEGATIVE': 0,
        'ANXIOUS': 0,
        'CALM': 0,
        'EXCITED': 0,
        'SAD': 0,
        'CONFIDENT': 0
    }
    
    # Pitch analysis
    if pitch['average_pitch'] > 200:
        mood_scores['EXCITED'] += 2
        mood_scores['ANXIOUS'] += 1
    elif pitch['average_pitch'] < 150:
        mood_scores['SAD'] += 2
        mood_scores['CALM'] += 1
    else:
        mood_scores['NEUTRAL'] += 1
        mood_scores['CONFIDENT'] += 1
    
    # Pitch stability
    if pitch['pitch_stability'] < 0.5:
        mood_scores['ANXIOUS'] += 2
    elif pitch['pitch_stability'] > 0.8:
        mood_scores['CONFIDENT'] += 1
    
    # Speech rate analysis
    if speech_rate['speech_rhythm'] == 'rapid':
        mood_scores['ANXIOUS'] += 2
        mood_scores['EXCITED'] += 1
    elif speech_rate['speech_rhythm'] == 'slow':
        mood_scores['SAD'] += 2
        mood_scores['CALM'] += 1
    else:
        mood_scores['NEUTRAL'] += 1
        mood_scores['CONFIDENT'] += 1
    
    # Volume analysis
    if volume['energy_level'] > 0.7:
        mood_scores['EXCITED'] += 2
        mood_scores['CONFIDENT'] += 1
    elif volume['energy_level'] < 0.3:
        mood_scores['SAD'] += 2
        mood_scores['CALM'] += 1
    else:
        mood_scores['NEUTRAL'] += 1
        mood_scores['POSITIVE'] += 1
    
    # Pause analysis
    if pauses['pause_frequency'] > 2:
        mood_scores['ANXIOUS'] += 1
    elif pauses['pause_frequency'] < 0.5:
        mood_scores['CONFIDENT'] += 1
    
    # Voice quality analysis
    if tone['voice_quality'] == 'rough':
        mood_scores['SAD'] += 1
        mood_scores['NEGATIVE'] += 1
    elif tone['voice_quality'] == 'clear':
        mood_scores['CONFIDENT'] += 1
        mood_scores['POSITIVE'] += 1
    
    # Find the mood with highest score
    primary_mood = max(mood_scores, key=mood_scores.get)
    max_score = mood_scores[primary_mood]
    
    # Calculate confidence
    total_score = sum(mood_scores.values())
    confidence = max_score / total_score if total_score > 0 else 0.5
    
    # Generate reasoning
    reasoning = []
    if pitch['average_pitch'] > 200:
        reasoning.append("High pitch suggests excitement or anxiety")
    elif pitch['average_pitch'] < 150:
        reasoning.append("Low pitch suggests sadness or calmness")
    
    if speech_rate['speech_rhythm'] == 'rapid':
        reasoning.append("Rapid speech suggests anxiety or excitement")
    elif speech_rate['speech_rhythm'] == 'slow':
        reasoning.append("Slow speech suggests sadness or calmness")
    
    if volume['energy_level'] > 0.7:
        reasoning.append("High energy suggests excitement or confidence")
    elif volume['energy_level'] < 0.3:
        reasoning.append("Low energy suggests sadness or fatigue")
    
    return {
        'mood': primary_mood,
        'confidence': float(confidence),
        'reasoning': '; '.join(reasoning) if reasoning else 'Analysis based on voice characteristics',
        'mood_scores': mood_scores
    }

def main():
    """
    Main function to run voice analysis
    """
    if len(sys.argv) != 2:
        print("Usage: python voice_analysis.py <audio_file>")
        sys.exit(1)
    
    audio_file = sys.argv[1]
    
    if not os.path.exists(audio_file):
        print(f"Error: Audio file '{audio_file}' not found")
        sys.exit(1)
    
    # Analyze voice characteristics
    characteristics = analyze_voice_characteristics(audio_file)
    
    if characteristics is None:
        print(json.dumps({
            'error': 'Failed to analyze audio file',
            'mood': 'NEUTRAL',
            'confidence': 0.5
        }))
        sys.exit(1)
    
    # Determine mood
    mood_analysis = determine_mood_from_characteristics(characteristics)
    
    # Combine results
    result = {
        'mood': mood_analysis['mood'],
        'confidence': mood_analysis['confidence'],
        'characteristics': characteristics,
        'reasoning': mood_analysis['reasoning'],
        'mood_scores': mood_analysis['mood_scores']
    }
    
    # Output JSON result
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()
